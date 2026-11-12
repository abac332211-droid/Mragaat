#!/usr/bin/env python3
"""Acceptance regression for the RC3-DEV direct-save race fix.

Runs the actual modified HTML, DOM handlers, and async save flow in Chromium.
A/B are deterministic in-memory FileSystemFileHandle-like fixtures. This is
not a native File System Access API or physical-disk test.
"""
from __future__ import annotations
import base64
import hashlib
import json
import platform
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
HTML_PATH = HERE / "raqee3-v8.0.0-rc3-dev-racefix.html"
HTML_BYTES = HTML_PATH.read_bytes()
HTML = HTML_BYTES.decode("utf-8")
HTML_SHA256 = hashlib.sha256(HTML_BYTES).hexdigest()

PRELUDE = r'''<script>
window.__race = {
  queue: [], A: null, B: null, enteredStage: null, gates: {}, pickerCalls: 0,
  makeGate: function(stage){
    let release; let entered;
    const promise = new Promise(r => release = r);
    const enteredPromise = new Promise(r => entered = r);
    const g = {promise, enteredPromise, release, enter: function(){ window.__race.enteredStage=stage; entered(); return promise; }};
    this.gates[stage] = g; return g;
  },
  makeHandle: function(name, text, side){
    const self=this; const enc=new TextEncoder();
    const obj={name, side, bytes:enc.encode(text), counts:{getFile:0,createWritable:0,write:0,close:0,abort:0},
      getFile: async function(){
        selfHandle.counts.getFile++;
        const n=selfHandle.counts.getFile;
        const snap=selfHandle.bytes.slice();
        const file=new File([snap],name,{type:'text/plain'});
        file.arrayBuffer=async function(){
          const stage = side==='A' && n===1 ? 'freshness-buffer' : side==='A' && n===2 ? 'backup-buffer' : side==='A' && n===3 ? 'postwrite-buffer' : null;
          if(stage && self.gates[stage]) await self.gates[stage].enter();
          return snap.slice().buffer;
        };
        return file;
      },
      createWritable: async function(){
        selfHandle.counts.createWritable++;
        const call=selfHandle.counts.createWritable;
        if(side==='A' && call===1 && self.gates['createWritable']) await self.gates['createWritable'].enter();
        let staged=null; let closed=false;
        return {
          write: async function(value){ selfHandle.counts.write++; if(value instanceof Uint8Array) staged=value.slice(); else if(value instanceof ArrayBuffer) staged=new Uint8Array(value.slice(0)); else if(value instanceof Blob) staged=new Uint8Array(await value.arrayBuffer()); else staged=enc.encode(String(value)); },
          close: async function(){ selfHandle.counts.close++; if(!staged) staged=new Uint8Array(0); selfHandle.bytes=staged.slice(); closed=true; },
          abort: async function(){ selfHandle.counts.abort++; if(!closed) return; }
        };
      }
    };
    const selfHandle=obj; return obj;
  },
  bytesB64: function(b){let s=''; for(const x of b)s+=String.fromCharCode(x); return btoa(s);}
};
window.__confirmResponses=[]; window.__confirmPrompts=[];
window.confirm=function(message){window.__confirmPrompts.push(String(message)); return window.__confirmResponses.length ? !!window.__confirmResponses.shift() : true;};
Object.defineProperty(window,'showOpenFilePicker',{configurable:true,value:async function(){window.__race.pickerCalls++; const h=window.__race.queue.shift(); if(!h) throw new Error('NO_HANDLE_QUEUED'); return [h];}});
</script>'''

RACE_WINDOWS = [
    ("DIRECT-RACE-01", "freshness-buffer", "A freshness-read bytes are pending."),
    ("DIRECT-RACE-02", "backup-buffer", "A rollback-backup bytes are pending."),
    ("DIRECT-RACE-03", "createWritable", "A.createWritable() is pending."),
    ("DIRECT-RACE-04", "postwrite-buffer", "A post-write readback is pending."),
]
CASES = [(cid + "-UI", stage, "UI picker switch attempt while " + desc, "ui") for cid,stage,desc in RACE_WINDOWS] + \
        [(cid + "-FORCED", stage, "Forced mutable-global replacement while " + desc, "forced") for cid,stage,desc in RACE_WINDOWS]


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def check(ok: bool, label: str) -> dict:
    return {"check": label, "pass": bool(ok)}


def run_case(browser, case_id: str, gate_stage: str, description: str, swap_mode: str) -> dict:
    page = browser.new_page()
    page_errors: list[str] = []
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.set_content(PRELUDE + HTML, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(30)

    initial_a = page.evaluate("PATCHES[0].steps[0].find")
    initial_b = "FILE-B-ORIGINAL::DO-NOT-OVERWRITE\nUNIQUE-B-CONTENT\n"
    page.evaluate("""(arg)=>{
      const r=window.__race;
      r.A=r.makeHandle('A.txt',arg.a,'A');
      r.B=r.makeHandle('B.txt',arg.b,'B');
      r.queue=[r.A,r.B];
      r.pickerCalls=0;
      window.__confirmResponses=[];
    }""", {"a": initial_a, "b": initial_b})

    page.locator('input[name="saveMode"][value="direct"]').check()
    page.locator('#openForDirectBtn').click()
    page.wait_for_function("directFileHandle !== null && directFileHandle.name === 'A.txt' && currentFileName === 'A.txt'", timeout=5000)
    page.evaluate("stage => { window.__race.A.counts={getFile:0,createWritable:0,write:0,close:0,abort:0}; window.__race.B.counts={getFile:0,createWritable:0,write:0,close:0,abort:0}; window.__race.makeGate(stage); window.__race.pickerCalls=0; }", gate_stage)

    before = page.evaluate("""()=>({
      A:{name:window.__race.A.name,bytes:window.__race.bytesB64(window.__race.A.bytes),size:window.__race.A.bytes.length},
      B:{name:window.__race.B.name,bytes:window.__race.bytesB64(window.__race.B.bytes),size:window.__race.B.bytes.length},
      selectedName:currentFileName,directName:directFileName,handleName:directFileHandle.name,
      loadToken:currentTargetLoadToken,rawToken:currentTargetRawToken
    })""")
    before["A"]["sha256"] = sha(base64.b64decode(before["A"]["bytes"]))
    before["B"]["sha256"] = sha(base64.b64decode(before["B"]["bytes"]))

    page.locator('#applyBtn').click()
    page.wait_for_function("window.__race.enteredStage !== null", timeout=10000)
    entered = page.evaluate("window.__race.enteredStage")
    if entered != gate_stage:
        raise RuntimeError(f"{case_id}: expected gate {gate_stage}, entered {entered}")

    # Try all target-changing UI routes while the transaction is suspended.
    during = page.evaluate("""async(swapMode)=>{
      const r=window.__race;
      const picker=document.getElementById('openForDirectBtn');
      const input=document.getElementById('targetFile');
      const clear=document.getElementById('clearBtn');
      const clean=document.getElementById('cleanTargetBtn');
      const undo=document.getElementById('undoTargetBtn');
      let afterPicker;
      if(swapMode==='ui'){
        // Try to select B even if the control was disabled by the implementation.
        picker.disabled=false;
        picker.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
        await new Promise(resolve=>setTimeout(resolve,0));
        afterPicker={selectedName:currentFileName,directName:directFileName,handleName:directFileHandle&&directFileHandle.name,
          pickerCalls:r.pickerCalls,queuedHandles:r.queue.length,method:'picker-event'};
      } else {
        // Fault injection: bypass all UI listeners and replace the mutable globals exactly while A is suspended.
        // This specifically validates that the in-flight transaction never dereferences those globals again.
        const bText=new TextDecoder().decode(r.B.bytes);
        directFileHandle=r.B; directFileName='B.txt'; directTargetMatches=true;
        currentFileName='B.txt'; currentHtml=norm(bText); directOpenedSnapshot=bText;
        currentLineEnding=detectLineEnding(bText); currentLineEndings=extractLineEndings(bText);
        currentEncoding='utf-8'; currentHasBOM=false;
        currentTargetLoadToken++; currentTargetRawToken++;
        const bHash=sha256HexPure(r.B.bytes);
        currentTargetRawEvidence={name:'B.txt',size:r.B.bytes.length,sha256:bHash,token:currentTargetRawToken,targetEngineVersion:null};
        currentTargetRawHashPromise=Promise.resolve(bHash);
        afterPicker={selectedName:currentFileName,directName:directFileName,handleName:directFileHandle&&directFileHandle.name,
          pickerCalls:r.pickerCalls,queuedHandles:r.queue.length,method:'forced-global-replacement'};
      }
      const priorToast=toast; r.guardToasts=[];
      toast=function(message){ if(directWriteBusy) r.guardToasts.push(String(message)); return priorToast.apply(this,arguments); };
      // Target-file input, clear, clean, and target-undo must remain guarded even
      // in a design that permits switching the picker to B while A stays pinned.
      const loadToken=currentTargetLoadToken, rawToken=currentTargetRawToken;
      const html=currentHtml, name=currentFileName, handle=directFileHandle;
      const dt=new DataTransfer(); dt.items.add(new File(['B-input-attempt'], 'B-input.html',{type:'text/html'}));
      input.files=dt.files; input.disabled=false;
      input.dispatchEvent(new Event('change',{bubbles:true})); input.disabled=true;
      clear.disabled=false; clear.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); clear.disabled=true;
      clean.disabled=false; clean.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); clean.disabled=true;
      undo.disabled=false; undo.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); undo.disabled=true;
      toast=priorToast;
      return {
        busy:directWriteBusy,
        pickerDisabled:picker.disabled,inputDisabled:input.disabled,clearDisabled:clear.disabled,
        cleanDisabled:clean.disabled,undoDisabled:undo.disabled,
        guardMessages:r.guardToasts,afterPicker,
        pickerCalls:r.pickerCalls,queuedHandles:r.queue.length,
        selectedName:currentFileName,directName:directFileName,handleName:directFileHandle&&directFileHandle.name,
        loadTokenUnchanged:currentTargetLoadToken===loadToken,
        rawTokenUnchanged:currentTargetRawToken===rawToken,
        htmlUnchanged:currentHtml===html,
        sameHandle:directFileHandle===handle,
        sameName:currentFileName===name
      };
    }""", swap_mode)

    page.evaluate("stage => window.__race.gates[stage].release()", gate_stage)
    page.wait_for_function("directWriteBusy === false", timeout=15000)
    page.wait_for_timeout(120)

    transaction_outcome = page.evaluate("""()=>({
      A:{name:window.__race.A.name,bytes:window.__race.bytesB64(window.__race.A.bytes),size:window.__race.A.bytes.length,counts:window.__race.A.counts},
      B:{name:window.__race.B.name,bytes:window.__race.bytesB64(window.__race.B.bytes),size:window.__race.B.bytes.length,counts:window.__race.B.counts},
      summary:document.getElementById('summary').innerText,
      toast:document.getElementById('toast').innerText,
      selectedName:currentFileName,directName:directFileName,handleName:directFileHandle&&directFileHandle.name,
      pickerEnabled:!document.getElementById('openForDirectBtn').disabled,
      fileInputEnabled:!document.getElementById('targetFile').disabled,
      clearEnabled:!document.getElementById('clearBtn').disabled,
      evidence:(typeof evidenceGetQueue==='function'?evidenceGetQueue().slice(-1)[0]:null),
      pickerCalls:window.__race.pickerCalls,queuedHandles:window.__race.queue.length
    })""")
    for key in ("A", "B"):
        raw = base64.b64decode(transaction_outcome[key]["bytes"])
        transaction_outcome[key]["sha256"] = sha(raw)

    expected_text = page.evaluate("PATCHES[0].steps[0].replace")
    expected_bytes = expected_text.encode("utf-8")
    expected_hash = sha(expected_bytes)
    evidence = transaction_outcome.get("evidence") or {}

    # After the transaction is fully over, B must be the valid selected target. If the in-flight
    # switch was blocked, select it now; if fault injection already selected it, do not reopen it.
    selected_after = page.evaluate("currentFileName")
    if selected_after != "B.txt":
        page.locator('#openForDirectBtn').click()
        page.wait_for_function("directFileHandle !== null && directFileHandle.name === 'B.txt' && currentFileName === 'B.txt'", timeout=5000)
    post_release = page.evaluate("""()=>({
      selectedName:currentFileName,directName:directFileName,handleName:directFileHandle&&directFileHandle.name,
      pickerEnabled:!document.getElementById('openForDirectBtn').disabled,
      Bbytes:window.__race.bytesB64(window.__race.B.bytes),Bsize:window.__race.B.bytes.length
    })""")
    post_release["Bsha256"] = sha(base64.b64decode(post_release["Bbytes"]))

    a_patched = transaction_outcome["A"]["sha256"] == expected_hash
    a_preserved = transaction_outcome["A"]["sha256"] == before["A"]["sha256"]
    b_preserved = transaction_outcome["B"]["sha256"] == before["B"]["sha256"]
    evidence_target_a = evidence.get("targetName") == "A.txt"
    evidence_actual_a = evidence.get("actualFileSha256") == expected_hash and evidence.get("actualFileSize") == len(expected_bytes)
    summary_a = "تم التعديل مباشرة على: A.txt" in transaction_outcome["summary"]
    selected_b_during = during["selectedName"] == "B.txt" and during["handleName"] == "B.txt"
    selection_blocked = (during["selectedName"] == "A.txt" and during["handleName"] == "A.txt" and
      during["pickerCalls"] == 0 and during["queuedHandles"] == 1)
    secondary_guards_ok = (during["loadTokenUnchanged"] and during["rawTokenUnchanged"] and
      during["htmlUnchanged"] and during["sameHandle"] and during["sameName"] and
      len(during.get("guardMessages",[])) >= 4)
    if selection_blocked:
      safe_pattern = a_patched and b_preserved and evidence_target_a and evidence_actual_a and summary_a
      safe_pattern_name = "picker-locked; transaction completes on pinned A"
    elif selected_b_during and gate_stage in ("freshness-buffer", "backup-buffer", "createWritable"):
      no_write_yet = a_preserved and b_preserved and transaction_outcome["A"]["counts"]["write"] == 0 and transaction_outcome["B"]["counts"]["write"] == 0
      cancelled_record = evidence_target_a and not evidence_actual_a and ("cancel" in str(evidence.get("saveStatus","")) or "failed" in str(evidence.get("saveStatus","")))
      safe_pattern = no_write_yet and cancelled_record
      safe_pattern_name = "B selected; A transaction cancelled before the first write"
    elif selected_b_during and gate_stage == "postwrite-buffer":
      pinned_success = a_patched and b_preserved and evidence_target_a and evidence_actual_a and summary_a
      pinned_rollback = a_preserved and b_preserved and evidence_target_a and "rollback-verified" in str(evidence.get("saveStatus",""))
      safe_pattern = pinned_success or pinned_rollback
      safe_pattern_name = "B selected; A transaction remains pinned or rolls back on A"
    else:
      safe_pattern = False
      safe_pattern_name = "UNSAFE_OR_UNCLASSIFIED"
    result = {
      "case_id": case_id, "description": description, "gate_stage": gate_stage, "entered_stage": entered,
      "before": before, "during_transaction_switch_attempt": during,
      "transaction_outcome": transaction_outcome, "post_release_B_selection": post_release,
      "expected_A_patched_size": len(expected_bytes), "expected_A_patched_sha256": expected_hash,
      "accepted_safe_behavior": safe_pattern_name,
      "safety_invariants": {
        "B_byte_identical": b_preserved,
        "A_either_patched_or_exactly_preserved": a_patched or a_preserved,
        "evidence_target_bound_to_A": evidence_target_a,
        "secondary_target_mutations_blocked": secondary_guards_ok,
        "switch_was_safely_blocked_or_transaction_bound": safe_pattern,
        "switching_available_after_transaction": (
          post_release["selectedName"] == "B.txt" and post_release["handleName"] == "B.txt" and
          post_release["Bsha256"] == before["B"]["sha256"]
        )
      },
      "page_errors": page_errors
    }
    result["safe_outcome"] = all(result["safety_invariants"].values()) and not page_errors
    result["checks"] = [
      check(not page_errors, "no uncaught page errors"),
      check(entered == gate_stage, "intended asynchronous gate reached"),
      check(during["busy"], "direct transaction marked busy during await"),
      check(selection_blocked or selected_b_during, "switch attempt resolved to either locked A or selected B"),
      check(secondary_guards_ok, "file input/clear/clean/undo cannot mutate target during transaction"),
      check(safe_pattern, "race resolved only through block, pre-write cancellation, or fully pinned A transaction"),
      check(b_preserved, "B bytes remain identical to pre-transaction snapshot"),
      check(a_patched or a_preserved, "A is either fully patched or restored byte-for-byte"),
      check(evidence_target_a, "evidence target identity remains A"),
      check(result["safety_invariants"]["switching_available_after_transaction"], "B can be selected after transaction and remains byte-identical"),
      check(transaction_outcome["pickerEnabled"] and transaction_outcome["fileInputEnabled"] and transaction_outcome["clearEnabled"], "target controls are restored after transaction"),
      check(transaction_outcome["selectedName"] in ("A.txt", "B.txt"), "selected target remains a valid explicit target after transaction")
    ]
    result["pass_count"] = sum(1 for item in result["checks"] if item["pass"])
    result["check_count"] = len(result["checks"])
    page.close()
    return result


def main() -> int:
    runs = []
    browser_version = None
    for run_no in range(1, 4):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium",
              args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", "--no-first-run"])
            browser_version = browser.version
            cases = [run_case(browser, cid, stage, desc, mode) for cid, stage, desc, mode in CASES]
            browser.close()
        runs.append({"run": run_no, "cases": cases, "browser_version": browser_version})

    source_after = HTML_PATH.read_bytes()
    flat = [case for run in runs for case in run["cases"]]
    signatures = []
    for run in runs:
        signatures.append([
          {"case_id":c["case_id"],"A_after":c["transaction_outcome"]["A"]["sha256"],
           "B_after":c["transaction_outcome"]["B"]["sha256"],
           "target":(c["transaction_outcome"].get("evidence") or {}).get("targetName"),
           "saveStatus":(c["transaction_outcome"].get("evidence") or {}).get("saveStatus"),
           "accepted_safe_behavior":c["accepted_safe_behavior"], "safe_outcome":c["safe_outcome"]} for c in run["cases"]
        ])
    repeatable = all(signatures[0] == signature for signature in signatures[1:])
    out = {
      "test_id":"DIRECT-RACE-01-04-RACEFIX-RC3-DEV-CHROMIUM",
      "execution_status":"COMPLETED",
      "browser":{"name":"Chromium","version":browser_version},
      "runtime":{"python":platform.python_version(),"playwright":"sync_api"},
      "source":{"file":HTML_PATH.name,"size_bytes":len(HTML_BYTES),"sha256_before":HTML_SHA256,
        "sha256_after":sha(source_after),"unchanged_during_test":sha(source_after)==HTML_SHA256},
      "test_model":"Actual patched RC3-DEV HTML and application UI/event handlers run in Chromium. File A/B use deterministic in-memory FileSystemFileHandle-like fixtures; native OS picker and physical disk are not tested.",
      "race_definitions":[{"id":x[0],"gate":x[1],"description":x[2],"switch_mode":x[3]} for x in CASES],
      "independent_browser_processes":3,"case_executions":len(flat),"case_matrix":"4 race windows x 2 swap modes x 3 separate Chromium processes",
      "safe_outcomes":sum(1 for c in flat if c["safe_outcome"]),"safe_outcomes_total":len(flat),
      "ui_lock_safe_outcomes":sum(1 for c in flat if c["case_id"].endswith("-UI") and c["safe_outcome"]),
      "forced_handle_replacement_safe_outcomes":sum(1 for c in flat if c["case_id"].endswith("-FORCED") and c["safe_outcome"]),
      "assertions_passed":sum(c["pass_count"] for c in flat),"assertions_total":sum(c["check_count"] for c in flat),
      "B_preserved_all_executions":all(c["safety_invariants"]["B_byte_identical"] for c in flat),
      "transaction_identity_consistent_all_executions":all(c["safety_invariants"]["evidence_target_bound_to_A"] and c["safety_invariants"]["switch_was_safely_blocked_or_transaction_bound"] for c in flat),
      "behaviorally_repeatable":repeatable,
      "all_observations":runs,
      "native_file_system_access":"NOT_TESTED",
      "real_disk_write":"NOT_TESTED",
      "production_reachability":"UNPROVEN",
      "repository_modified":False
    }
    out_path = HERE / "DIRECT-RACE-01-04-RACEFIX-result.json"
    out_path.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({k:v for k,v in out.items() if k!="all_observations"},ensure_ascii=False,indent=2))
    if sha(source_after) != HTML_SHA256:
        print("ERROR: source HTML changed during test", file=sys.stderr); return 2
    if out["safe_outcomes"] != out["safe_outcomes_total"]:
        print("ERROR: one or more race acceptance cases failed", file=sys.stderr); return 3
    if out["assertions_passed"] != out["assertions_total"]:
        print("ERROR: assertion failure(s)", file=sys.stderr); return 4
    if not repeatable:
        print("ERROR: behavior was not repeatable across browser processes", file=sys.stderr); return 5
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
