#!/usr/bin/env python3
"""DIRECT-RACE-01..04 controlled handle-swap tests against unmodified RC3-DEV.
The UI event handler is real Chromium DOM/JS. File System Access handles are
explicit in-memory fixtures; this is not a native OS-backed FSA test.
"""
from __future__ import annotations
import hashlib, json, platform, zipfile
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
HTML_PATH = HERE / "raqee3-v8.0.0-rc3-dev.html"
HTML_BYTES = HTML_PATH.read_bytes()
HTML = HTML_BYTES.decode("utf-8")
HTML_SHA256 = hashlib.sha256(HTML_BYTES).hexdigest()

PRELUDE = r'''<script>
window.__race = {
  queue: [], A: null, B: null, enteredStage: null, gates: {},
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
  bytesText: function(b){return new TextDecoder().decode(b);},
  bytesB64: function(b){let s=''; for(const x of b)s+=String.fromCharCode(x); return btoa(s);}
};
window.__confirmResponses=[]; window.__confirmPrompts=[];
window.confirm=function(message){window.__confirmPrompts.push(String(message)); return window.__confirmResponses.length ? !!window.__confirmResponses.shift() : true;};
Object.defineProperty(window,'showOpenFilePicker',{configurable:true,value:async function(){const h=window.__race.queue.shift(); if(!h) throw new Error('NO_HANDLE_QUEUED'); return [h];}});
</script>'''

CASES = [
    ("DIRECT-RACE-01", "freshness-buffer", "Swap after A freshness getFile() begins, before the byte snapshot resolves."),
    ("DIRECT-RACE-02", "backup-buffer", "Swap while A's rollback backup File.arrayBuffer() is pending."),
    ("DIRECT-RACE-03", "createWritable", "Swap while A.createWritable() is pending, before its writer resolves."),
    ("DIRECT-RACE-04", "postwrite-buffer", "Swap while A's post-write verification readback is pending."),
]


def sha(b: bytes) -> str: return hashlib.sha256(b).hexdigest()
def check(ok, label): return {"check":label,"pass":bool(ok)}


def run_case(browser, case_id, gate_stage, description):
    page=browser.new_page()
    page_errors=[]
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.set_content(PRELUDE+HTML, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(30)
    initial_a=page.evaluate("PATCHES[0].steps[0].find")
    initial_b="FILE-B-ORIGINAL::DO-NOT-OVERWRITE\nUNIQUE-B-CONTENT\n"
    page.evaluate("""(arg)=>{
      const r=window.__race;
      r.A=r.makeHandle('A.txt',arg.a,'A');
      r.B=r.makeHandle('B.txt',arg.b,'B');
      r.queue=[r.A,r.B];
      window.__confirmResponses=[];
    }""", {"a":initial_a,"b":initial_b,"stage":gate_stage})
    # Select A via the real UI click handler.
    page.locator('input[name="saveMode"][value="direct"]').check()
    page.locator('#openForDirectBtn').click()
    page.wait_for_function("directFileHandle !== null && directFileHandle.name === 'A.txt' && currentFileName === 'A.txt'", timeout=5000)
    # Reset handle counters to exclude the file-open read itself.
    page.evaluate("stage => { window.__race.A.counts={getFile:0,createWritable:0,write:0,close:0,abort:0}; window.__race.B.counts={getFile:0,createWritable:0,write:0,close:0,abort:0}; window.__race.makeGate(stage); }", gate_stage)
    before=page.evaluate("""()=>({
      A:{name:window.__race.A.name,bytes:window.__race.bytesB64(window.__race.A.bytes),size:window.__race.A.bytes.length},
      B:{name:window.__race.B.name,bytes:window.__race.bytesB64(window.__race.B.bytes),size:window.__race.B.bytes.length},
      Asha:null,Bsha:null, selectedName:currentFileName, selectedHandle:directFileHandle.name
    })""")
    before["A"]["sha256"]=sha(__import__('base64').b64decode(before['A']['bytes']))
    before["B"]["sha256"]=sha(__import__('base64').b64decode(before['B']['bytes']))
    page.locator('#applyBtn').click()
    page.wait_for_function("window.__race.enteredStage === arguments[0]" if False else "window.__race.enteredStage !== null", timeout=10000)
    entered=page.evaluate("window.__race.enteredStage")
    if entered != gate_stage: raise RuntimeError(f"{case_id}: expected gate {gate_stage}, entered {entered}")
    # While the real save handler is suspended, select B through the real picker handler.
    page.locator('#openForDirectBtn').click()
    page.wait_for_function("directFileHandle !== null && directFileHandle.name === 'B.txt' && currentFileName === 'B.txt'", timeout=5000)
    state_after_swap=page.evaluate("""()=>({selectedName:currentFileName,directName:directFileName,
      handleName:directFileHandle && directFileHandle.name,targetMatches:directTargetMatches,
      directWriteBusy:directWriteBusy})""")
    # Release the A-side async operation and let the original apply handler continue.
    page.evaluate("stage => window.__race.gates[stage].release()", gate_stage)
    page.wait_for_function("directWriteBusy === false", timeout=15000)
    page.wait_for_timeout(80)
    after=page.evaluate("""()=>({
      A:{name:window.__race.A.name,bytes:window.__race.bytesB64(window.__race.A.bytes),size:window.__race.A.bytes.length,counts:window.__race.A.counts},
      B:{name:window.__race.B.name,bytes:window.__race.bytesB64(window.__race.B.bytes),size:window.__race.B.bytes.length,counts:window.__race.B.counts},
      summary:document.getElementById('summary').innerText,
      toast:document.getElementById('toast').innerText,
      downloadVisible:getComputedStyle(document.getElementById('downloadLink')).display!=='none',
      selectedName:currentFileName,directName:directFileName,handleName:directFileHandle&&directFileHandle.name,
      targetMatches:directTargetMatches,confirmPrompts:window.__confirmPrompts,
      evidence:(typeof evidenceGetQueue==='function'?evidenceGetQueue().slice(-1)[0]:null)
    })""")
    for k in ("A","B"):
      raw=__import__('base64').b64decode(after[k]["bytes"])
      after[k]["sha256"]=sha(raw)
    # Expected A patched text is deterministic from the first enabled patch.
    expected=page.evaluate("PATCHES[0].steps[0].replace")
    expected_hash=sha(expected.encode())
    # Distinguish: wrote A, wrote B, both, or neither.
    a_changed=after['A']['sha256']!=before['A']['sha256']
    b_changed=after['B']['sha256']!=before['B']['sha256']
    result={
      "case_id":case_id,"description":description,"gate_stage":gate_stage,"entered_stage":entered,
      "before":before,"state_after_B_selected":state_after_swap,"after":after,
      "expected_patch_text_sha256_utf8":expected_hash,
      "byte_identity":{
        "A_changed":a_changed,"B_changed":b_changed,
        "A_equals_expected_patch":after['A']['sha256']==expected_hash,
        "B_equals_expected_patch":after['B']['sha256']==expected_hash,
        "B_equals_A_original":after['B']['sha256']==before['A']['sha256'],
        "B_preserved":after['B']['sha256']==before['B']['sha256'],
        "A_preserved":after['A']['sha256']==before['A']['sha256']
      },
      "page_errors":page_errors
    }
    # Assertions are intentionally behavioral, and do not assume safe behavior.
    evidence=after.get("evidence") or {}
    target_identity_consistent = (
      after["selectedName"] == "A.txt" and after["directName"] == "A.txt" and
      evidence.get("targetName") == "A.txt" and
      (not a_changed or (after["A"]["sha256"] == expected_hash and evidence.get("actualFileSha256") == expected_hash))
    )
    if not a_changed and not b_changed:
      target_identity_consistent = ("أُلغي" in after["summary"] or "أُلغي" in after["toast"])
    result["risk_reproduced"] = (
      (case_id in ("DIRECT-RACE-01","DIRECT-RACE-02") and
       after["B"]["sha256"] == expected_hash and before["A"]["sha256"] == after["A"]["sha256"] and
       evidence.get("targetName") == "B.txt" and evidence.get("saveStatus","").startswith("direct-write-success"))
      or (case_id == "DIRECT-RACE-03" and
          after["A"]["sha256"] == expected_hash and after["B"]["sha256"] == before["A"]["sha256"] and
          after["B"]["sha256"] != before["B"]["sha256"] and "rollback-verified" in evidence.get("saveStatus",""))
      or (case_id == "DIRECT-RACE-04" and
          after["A"]["sha256"] == expected_hash and after["B"]["sha256"] == before["B"]["sha256"] and
          "تم التعديل مباشرة على: B.txt" in after["summary"] and evidence.get("targetName") == "B.txt" and
          evidence.get("actualFileSha256") == before["B"]["sha256"])
    )
    result["safety_invariants"] = {
      "B_preserved": after["B"]["sha256"] == before["B"]["sha256"],
      "result_identity_consistent_with_A_transaction": target_identity_consistent,
      "no_cross_target_effect": after["B"]["sha256"] == before["B"]["sha256"] and target_identity_consistent
    }
    result["checks"]=[
      check(not page_errors,"no uncaught page errors"),
      check(entered == gate_stage,"intended asynchronous race gate reached"),
      check(state_after_swap["handleName"]=="B.txt" and state_after_swap["selectedName"]=="B.txt","B selected in UI while A save awaited"),
      check(after["selectedName"]=="B.txt" and after["handleName"]=="B.txt","B remains selected after in-flight save"),
      check(result["safety_invariants"]["B_preserved"],"safety invariant: B bytes must remain unchanged"),
      check(target_identity_consistent,"safety invariant: result and evidence must remain bound to original transaction target A or cancel")
    ]
    result["pass_count"]=sum(1 for x in result["checks"] if x["pass"])
    result["check_count"]=len(result["checks"])
    page.close()
    return result


def main():
    runs=[]
    browser_version=None
    for run_no in range(1,4):
      with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-first-run'])
        browser_version=browser.version
        cases=[run_case(browser,cid,stage,desc) for cid,stage,desc in CASES]
        browser.close()
      runs.append({"run":run_no,"cases":cases,"browser_version":browser_version})
    source_after=HTML_PATH.read_bytes()
    source_unchanged=(sha(source_after)==HTML_SHA256)
    flat=[c for r in runs for c in r['cases']]
    # Fingerprint only behavioral fields; omit volatile evidence IDs/timestamps.
    signatures=[]
    for run in runs:
      signatures.append([
        {"case_id":c["case_id"],"before_A":c["before"]["A"]["sha256"],"before_B":c["before"]["B"]["sha256"],
         "after_A":c["after"]["A"]["sha256"],"after_B":c["after"]["B"]["sha256"],
         "summary":c["after"]["summary"],"saveStatus":(c["after"].get("evidence") or {}).get("saveStatus"),
         "targetName":(c["after"].get("evidence") or {}).get("targetName"),"risk_reproduced":c["risk_reproduced"]}
        for c in run["cases"]
      ])
    repeatable=all(signatures[0]==x for x in signatures[1:])
    output={
      "test_id":"DIRECT-RACE-01-04-RC3-DEV-CHROMIUM",
      "execution_status":"COMPLETED",
      "browser":{"name":"Chromium","version":browser_version},
      "runtime":{"python":platform.python_version(),"playwright":"sync_api"},
      "source":{"file":HTML_PATH.name,"size_bytes":len(HTML_BYTES),"sha256_before":HTML_SHA256,"sha256_after":sha(source_after),"unchanged":source_unchanged},
      "test_model":"Actual RC3-DEV HTML, app UI and asynchronous event handlers run in Chromium. File A/B are isolated in-memory FileSystemFileHandle-like test fixtures, not native OS files.",
      "race_definitions":[{"id":x[0],"gate":x[1],"description":x[2]} for x in CASES],
      "independent_browser_processes":3,"case_executions":len(flat),"case_matrix":"4 race windows x 3 separate Chromium processes",
      "race_reproductions":sum(1 for c in flat if c["risk_reproduced"]),"race_reproductions_total":len(flat),
      "assertions_passed":sum(c['pass_count'] for c in flat),"assertions_total":sum(c['check_count'] for c in flat),
      "safety_invariant_failures":sum(1 for c in flat if not c["safety_invariants"]["no_cross_target_effect"]),
      "behavioral_repeatability_across_runs":repeatable,
      "all_observations":runs,
      "native_file_system_access":"NOT_TESTED",
      "real_disk_write":"NOT_TESTED",
      "production_reachability":"UNPROVEN",
      "source_or_repository_modified":False
    }
    out=HERE/'DIRECT-RACE-01-04-result.json'
    out.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in output.items() if k!='all_observations'},ensure_ascii=False,indent=2))
    if not source_unchanged: raise SystemExit('RC3-DEV source changed during test')
    if output["race_reproductions"] != output["race_reproductions_total"]: raise SystemExit('One or more race outcomes did not match the expected reproduction signature')
    if not repeatable: raise SystemExit('Race results were not behaviorally repeatable')

if __name__=='__main__': main()
