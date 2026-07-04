{
  "homepage": "https://sheikhdatapp.github.io/",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

import { useState, useEffect } from "react";

// Weekday → workout. JS getDay(): 0=Sun...6=Sat
// Sat=Upper, Sun=Lower, Mon=Rest, Tue=Push, Wed=Pull, Thu=Legs, Fri=Rest
const WEEK = { 6:"UPPER", 0:"LOWER", 1:"REST_MON", 2:"PUSH", 3:"PULL", 4:"LEGS", 5:"REST_FRI" };
const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const WEEK_ORDER = [6,0,1,2,3,4,5];

const workouts = {
  PUSH: { day:"Push Day", label:"PUSH", color:"#f97316", icon:"🔺", muscles:"Chest · Shoulders · Triceps", focus:"Horizontal push + overhead press strength", type:"train",
    exercises:[
      {name:"Barbell Bench Press",sets:"4",reps:"6–8",rest:"90s",tip:"Retract scapula, controlled descent 3 sec"},
      {name:"Seated DB Shoulder Press",sets:"3",reps:"8–10",rest:"75s",tip:"Primary press — do it fresh. Don't flare elbows too wide"},
      {name:"Incline DB Press",sets:"3",reps:"10–12",rest:"75s",tip:"30–45° incline, squeeze at top"},
      {name:"Cable Lateral Raise",sets:"3",reps:"12–15",rest:"60s",tip:"Lead with elbow, keep slight bend — side delts drive width"},
      {name:"Overhead DB Tricep Extension",sets:"3",reps:"10–12",rest:"60s",tip:"Keep upper arms vertical — long head stretch"},
      {name:"Tricep Rope Pushdown",sets:"3",reps:"12–15",rest:"60s",tip:"Flare rope at bottom"},
    ]},
  PULL: { day:"Pull Day", label:"PULL", color:"#3b82f6", icon:"🔻", muscles:"Back · Biceps · Rear Delts", focus:"Vertical + horizontal pull, rear delt volume", type:"train",
    exercises:[
      {name:"Weighted Pull-ups / Lat Pulldown",sets:"4",reps:"6–8",rest:"90s",tip:"Full stretch at bottom, drive elbows to hips"},
      {name:"Barbell Bent-Over Row",sets:"4",reps:"6–8",rest:"90s",tip:"Hinge 45°, pull to lower chest"},
      {name:"Seated Cable Row (wide grip)",sets:"3",reps:"10–12",rest:"75s",tip:"Chest proud, avoid rounding"},
      {name:"Face Pulls",sets:"3",reps:"15–20",rest:"60s",tip:"External rotate at end — protects shoulder"},
      {name:"DB Incline Curl",sets:"3",reps:"10–12",rest:"60s",tip:"Full stretch = more bicep activation"},
      {name:"Hammer Curl",sets:"3",reps:"12–15",rest:"60s",tip:"Neutral grip hits brachialis"},
    ]},
  LEGS: { day:"Legs Day", label:"LEGS", color:"#22c55e", icon:"⬛", muscles:"Quads · Hamstrings · Glutes · Calves", focus:"Quad-focused squat pattern + posterior chain", type:"train",
    exercises:[
      {name:"Barbell Back Squat",sets:"4",reps:"6–8",rest:"2min",tip:"FORM: Start light. Feet shoulder-width, toes out 15–30°. Brace core, push knees out over toes, hit parallel or below, drive through mid-foot. RED FLAGS: heels rising, knees caving, butt wink."},
      {name:"Romanian Deadlift",sets:"4",reps:"8–10",rest:"90s",tip:"FORM: Start light. Soft knee bend, push hips BACK not down, bar drags close to legs, flat back. Lower to strong hamstring stretch. If you feel lower back not hamstrings — you're rounding, go lighter."},
      {name:"Leg Press",sets:"3",reps:"10–12",rest:"75s",tip:"High foot placement = more glutes"},
      {name:"Bulgarian Split Squat",sets:"3",reps:"10 each",rest:"75s",tip:"FORM: Bodyweight only until solid. Rear foot on bench, front foot forward so knee stays behind toes. Torso upright, lower straight down, don't let front knee cave. Hold something for balance first 2 weeks."},
      {name:"Leg Curl (seated or lying)",sets:"3",reps:"10–12",rest:"60s",tip:"Full stretch is key — direct hamstring isolation"},
      {name:"Calf Raise (standing)",sets:"4",reps:"15–20",rest:"60s",tip:"Pause at top & bottom"},
    ]},
  UPPER: { day:"Upper Day", label:"UPPER", color:"#a855f7", icon:"▲", muscles:"Full Upper Body · Rear Delts", focus:"Balanced push/pull, rear delt priority", type:"train",
    exercises:[
      {name:"DB Flat Press",sets:"3",reps:"10–12",rest:"75s",tip:"Slight arch, feet flat"},
      {name:"Arnold Press",sets:"3",reps:"10–12",rest:"75s",tip:"Rotate as you press — hits all 3 heads"},
      {name:"Cable Row (close grip)",sets:"3",reps:"10–12",rest:"75s",tip:"Full retraction at end"},
      {name:"Chest-Supported DB Row",sets:"3",reps:"12–15",rest:"60s",tip:"Eliminates lower back fatigue"},
      {name:"Rear Delt Machine Fly",sets:"3",reps:"15–20",rest:"60s",tip:"Lead with elbows — year-round now. Machine keeps form consistent. Your rear delts need this."},
      {name:"Barbell or EZ Curl",sets:"3",reps:"10–12",rest:"60s",tip:"Supinate at the top"},
    ]},
  LOWER: { day:"Lower Day", label:"LOWER", color:"#eab308", icon:"▼", muscles:"Glutes · Hamstrings · Quads · Core", focus:"Glute/hamstring focus — balances quad-heavy Legs day", type:"train",
    exercises:[
      {name:"Deadlift (conventional)",sets:"4",reps:"5–6",rest:"2min",tip:"FORM: Very light in Month 1. Bar over mid-foot, hinge to grip, arms straight, brace hard, engage lats, push floor away — don't yank. Hips & shoulders rise together, bar drags up shins, lock out with glutes. RED FLAGS: rounding back, bar swinging out, hips shooting up first."},
      {name:"Hip Thrust",sets:"3",reps:"8–12",rest:"90s",tip:"Best direct glute builder. Upper back on bench, chin tucked, drive hips up, squeeze glutes hard at top, full lockout. Substitute: Cable Pull-Through or high-foot Leg Press if setup is awkward."},
      {name:"Hack Squat or Goblet Squat",sets:"3",reps:"10–12",rest:"75s",tip:"Goblet is great for form work"},
      {name:"Walking Lunges",sets:"3",reps:"12 each",rest:"75s",tip:"Torso upright, don't let front knee cave. 12 per leg = 24 total steps"},
      {name:"Leg Extension",sets:"3",reps:"12–15",rest:"60s",tip:"Terminal knee isolation — slow eccentric"},
      {name:"Ab Wheel / Hanging Knee Raise",sets:"3",reps:"10–15",rest:"60s",tip:"Control the negative"},
    ]},
  REST_MON: { day:"Rest Day", label:"REST", color:"#6b7280", icon:"💤", muscles:"Full body recovery", focus:"Active recovery — light walk, stretch, foam roll", type:"rest",
    exercises:[
      {name:"Light Walk / Cycling",sets:"1",reps:"20–30 min",rest:"—",tip:"Low intensity, heart rate under 120 bpm"},
      {name:"Full Body Stretching",sets:"1",reps:"15 min",rest:"—",tip:"Focus on hips, lats, hamstrings"},
      {name:"Foam Rolling",sets:"1",reps:"10–15 min",rest:"—",tip:"Target legs and thoracic spine"},
    ]},
  REST_FRI: { day:"Rest Day", label:"REST", color:"#6b7280", icon:"💤", muscles:"Full rest · Cheat meal tonight 🍕", focus:"Complete rest + Friday cheat dinner", type:"rest",
    exercises:[
      {name:"Optional: 20 min walk",sets:"—",reps:"—",rest:"—",tip:"Keep it easy. Don't add intensity."},
      {name:"Sleep 8+ hours",sets:"—",reps:"—",rest:"—",tip:"Muscle is built during recovery, not training"},
      {name:"🍕 Cheat Meal (dinner)",sets:"—",reps:"—",rest:"—",tip:"800–1,000 kcal. Eat normally all day. One meal, not one day. ~40g protein. Saturday back to normal."},
    ]},
};

const cardioByMonth = {
  "Month 1": [
    {weeks:"Weeks 1–2",label:"No cardio",detail:"Let your body adapt to 5-day training first. Adding cardio now risks burnout.",color:"#6b7280"},
    {weeks:"Weeks 3–4",label:"1–2× LISS",detail:"20–30 min incline treadmill walk or easy bike. HR 100–130 bpm.",color:"#22c55e"},
  ],
  "Month 2": [
    {weeks:"Weeks 5–6",label:"2–3× LISS",detail:"25–35 min incline walk or bike. Never before lifting.",color:"#3b82f6"},
    {weeks:"Week 7",label:"3× LISS",detail:"35–40 min. Main fat-loss lever alongside diet.",color:"#a855f7"},
    {weeks:"Week 8 (Deload)",label:"2× LISS only",detail:"Lifting reduced. 2 easy sessions. Full recovery.",color:"#6b7280"},
  ],
  "Month 3": [
    {weeks:"Weeks 9–10",label:"3× LISS",detail:"35–40 min. Incline treadmill walk ideal.",color:"#f97316"},
    {weeks:"Weeks 11–12",label:"2× LISS + 1× HIIT",detail:"20 min HIIT: 30s hard / 90s easy × 8 rounds.",color:"#ef4444"},
  ],
  "Month 4": [
    {weeks:"Weeks 13–14",label:"3× LISS + 1× HIIT",detail:"Peak cardio. LISS on rest days, HIIT post-session once weekly.",color:"#f97316"},
    {weeks:"Week 15 (Deload)",label:"2× LISS only",detail:"Final deload. Easy 25 min walks.",color:"#6b7280"},
    {weeks:"Week 16",label:"2× LISS",detail:"Maintain easy cardio. Feel your best.",color:"#22c55e"},
  ],
};

const ytLinks = {"Barbell Bench Press":"https://www.youtube.com/results?search_query=jeff+nippard+bench+press+tutorial","Incline DB Press":"https://www.youtube.com/results?search_query=jeff+nippard+incline+dumbbell+press","Seated DB Shoulder Press":"https://www.youtube.com/results?search_query=jeff+nippard+shoulder+press+tutorial","Cable Lateral Raise":"https://www.youtube.com/results?search_query=jeff+nippard+lateral+raise+tutorial","Tricep Rope Pushdown":"https://www.youtube.com/results?search_query=jeff+nippard+tricep+pushdown+tutorial","Overhead DB Tricep Extension":"https://www.youtube.com/results?search_query=jeff+nippard+overhead+tricep+extension","Weighted Pull-ups / Lat Pulldown":"https://www.youtube.com/results?search_query=jeff+nippard+lat+pulldown+pull+up+tutorial","Barbell Bent-Over Row":"https://www.youtube.com/results?search_query=jeff+nippard+bent+over+row+tutorial","Seated Cable Row (wide grip)":"https://www.youtube.com/results?search_query=jeff+nippard+cable+row+tutorial","Face Pulls":"https://www.youtube.com/results?search_query=jeff+nippard+face+pull+tutorial","DB Incline Curl":"https://www.youtube.com/results?search_query=jeff+nippard+incline+curl+tutorial","Hammer Curl":"https://www.youtube.com/results?search_query=jeff+nippard+hammer+curl+tutorial","Barbell Back Squat":"https://www.youtube.com/results?search_query=jeff+nippard+squat+tutorial","Romanian Deadlift":"https://www.youtube.com/results?search_query=jeff+nippard+romanian+deadlift+tutorial","Leg Press":"https://www.youtube.com/results?search_query=jeff+nippard+leg+press+tutorial","Leg Curl (seated or lying)":"https://www.youtube.com/results?search_query=jeff+nippard+leg+curl+tutorial","Bulgarian Split Squat":"https://www.youtube.com/results?search_query=jeff+nippard+bulgarian+split+squat+tutorial","Calf Raise (standing)":"https://www.youtube.com/results?search_query=jeff+nippard+calf+raise+tutorial","DB Flat Press":"https://www.youtube.com/results?search_query=jeff+nippard+dumbbell+bench+press+tutorial","Cable Row (close grip)":"https://www.youtube.com/results?search_query=jeff+nippard+cable+row+tutorial","Arnold Press":"https://www.youtube.com/results?search_query=jeff+nippard+arnold+press+tutorial","Chest-Supported DB Row":"https://www.youtube.com/results?search_query=jeff+nippard+chest+supported+row+tutorial","Cable Fly or Pec Deck":"https://www.youtube.com/results?search_query=jeff+nippard+cable+fly+pec+deck+tutorial","Barbell or EZ Curl":"https://www.youtube.com/results?search_query=jeff+nippard+barbell+curl+tutorial","Rear Delt Machine Fly":"https://www.youtube.com/results?search_query=jeff+nippard+rear+delt+fly+tutorial","Deadlift (conventional)":"https://www.youtube.com/results?search_query=jeff+nippard+deadlift+tutorial","Hip Thrust":"https://www.youtube.com/results?search_query=jeff+nippard+hip+thrust+tutorial","Hack Squat or Goblet Squat":"https://www.youtube.com/results?search_query=jeff+nippard+goblet+squat+tutorial","Walking Lunges":"https://www.youtube.com/results?search_query=jeff+nippard+lunges+tutorial","Leg Extension":"https://www.youtube.com/results?search_query=jeff+nippard+leg+extension+tutorial","Plank":"https://www.youtube.com/results?search_query=jeff+nippard+plank+core+tutorial","Ab Wheel / Hanging Knee Raise":"https://www.youtube.com/results?search_query=jeff+nippard+hanging+knee+raise+ab+tutorial"};

const measureGuide = [
  {key:"waist",name:"Waist",color:"#22c55e",primary:true,guide:"Measure at navel level, standing relaxed. Don't suck in. Measure at the end of a normal exhale. Your #1 fat-loss indicator."},
  {key:"chest",name:"Chest",color:"#3b82f6",guide:"Around the fullest part of your chest, tape under armpits across nipples. Arms relaxed, end of exhale."},
  {key:"hips",name:"Hips",color:"#a855f7",guide:"Around the widest part of glutes/hips, feet together. Keep tape level all the way around."},
  {key:"larm",name:"L Arm",color:"#f97316",guide:"Around the largest part of your relaxed left upper arm, hanging at your side. Measure relaxed, not flexed."},
  {key:"rarm",name:"R Arm",color:"#f97316",guide:"Around the largest part of your relaxed right upper arm, hanging at your side. Same spot weekly."},
  {key:"lthigh",name:"L Thigh",color:"#eab308",guide:"Around the largest part of your left thigh, mid-way hip to knee. Weight even on both legs."},
  {key:"rthigh",name:"R Thigh",color:"#eab308",guide:"Around the largest part of your right thigh, mid-way hip to knee. Same spot each time."},
  {key:"neck",name:"Neck",color:"#06b6d4",guide:"Around the middle of your neck, just below the Adam's apple. Snug not tight, look straight ahead."},
];

const START_W = 90.5, GOAL_W = 80;

export default function GymDashboard() {
  const realDow = new Date().getDay();
  const [view, setView] = useState("today");
  const [selDow, setSelDow] = useState(realDow);
  const [selMonth, setSelMonth] = useState("Month 1");
  const [expandedEx, setExpandedEx] = useState(null);
  const [expandedLog, setExpandedLog] = useState({}); // key: `${exName}-${idx}` -> bool
  const [checkedSets, setCheckedSets] = useState({});
  const [weightLogs, setWeightLogs] = useState({});
  const [bodyWeight, setBodyWeight] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [cardioLog, setCardioLog] = useState([]); // [{date, type, minutes, month}]

  useEffect(() => {
    (async () => {
      try { const wl = await window.storage.get("v41:weightLogs"); if (wl?.value) setWeightLogs(JSON.parse(wl.value)); } catch {}
      try { const bw = await window.storage.get("v41:bodyWeight"); if (bw?.value) setBodyWeight(JSON.parse(bw.value)); } catch {}
      try { const ms = await window.storage.get("v41:measurements"); if (ms?.value) setMeasurements(JSON.parse(ms.value)); } catch {}
      try { const cl = await window.storage.get("v41:cardioLog"); if (cl?.value) setCardioLog(JSON.parse(cl.value)); } catch {}
    })();
  }, []);
  const persist = async (k,v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };
  const today = () => new Date().toISOString().slice(0,10);

  const wkKey = WEEK[selDow];
  const w = workouts[wkKey];
  const isToday = selDow === realDow;

  const toggleSet = (ei, si) => setCheckedSets(p => ({ ...p, [`${wkKey}-${ei}-${si}`]: !p[`${wkKey}-${ei}-${si}`] }));

  const addWeightEntry = (exName, sets) => {
    const entry = { date: today(), sets: Array.from({length:sets}, () => ({w:"", r:""})) };
    const arr = [...(weightLogs[exName]||[]), entry];
    const next = { ...weightLogs, [exName]: arr };
    setWeightLogs(next); persist("v41:weightLogs", next);
    setExpandedLog(p=>({...p,[`${exName}-${arr.length-1}`]:true})); // open the new one
  };
  const updateWeightEntry = (exName, idx, si, field, value) => {
    const arr = [...(weightLogs[exName]||[])];
    if (si === -1) arr[idx] = { ...arr[idx], date: value };
    else arr[idx] = { ...arr[idx], sets: arr[idx].sets.map((s,i)=> i===si ? {...s,[field]:value} : s) };
    const next = { ...weightLogs, [exName]: arr };
    setWeightLogs(next); persist("v41:weightLogs", next);
  };
  const deleteWeightEntry = (exName, idx) => {
    const next = { ...weightLogs, [exName]: (weightLogs[exName]||[]).filter((_,i)=>i!==idx) };
    setWeightLogs(next); persist("v41:weightLogs", next);
  };

  const addBodyWeight = () => { const next=[...bodyWeight,{date:today(),kg:""}]; setBodyWeight(next); persist("v41:bodyWeight",next); };
  const updateBodyWeight = (idx,field,val) => { const next=bodyWeight.map((e,i)=>i===idx?{...e,[field]:val}:e); setBodyWeight(next); persist("v41:bodyWeight",next); };
  const deleteBodyWeight = (idx) => { const next=bodyWeight.filter((_,i)=>i!==idx); setBodyWeight(next); persist("v41:bodyWeight",next); };

  const addMeasurement = () => { const b={date:today()}; measureGuide.forEach(m=>b[m.key]=""); const next=[...measurements,b]; setMeasurements(next); persist("v41:measurements",next); };
  const updateMeasurement = (idx,key,val) => { const next=measurements.map((e,i)=>i===idx?{...e,[key]:val}:e); setMeasurements(next); persist("v41:measurements",next); };
  const deleteMeasurement = (idx) => { const next=measurements.filter((_,i)=>i!==idx); setMeasurements(next); persist("v41:measurements",next); };

  const addCardio = () => { const next=[...cardioLog,{date:today(),type:"LISS",minutes:"",month:selMonth}]; setCardioLog(next); persist("v41:cardioLog",next); };
  const updateCardio = (idx,field,val) => { const next=cardioLog.map((e,i)=>i===idx?{...e,[field]:val}:e); setCardioLog(next); persist("v41:cardioLog",next); };
  const deleteCardio = (idx) => { const next=cardioLog.filter((_,i)=>i!==idx); setCardioLog(next); persist("v41:cardioLog",next); };

  // Week boundaries (Sat-start week to match training split)
  const weekStart = (offset=0) => {
    const d = new Date();
    const dow = d.getDay(); // 0 Sun..6 Sat
    const daysSinceSat = (dow + 1) % 7; // Sat->0, Sun->1...
    d.setDate(d.getDate() - daysSinceSat - offset*7);
    d.setHours(0,0,0,0);
    return d;
  };
  const inWeek = (dateStr, offset=0) => {
    const d = new Date(dateStr+"T00:00:00");
    const s = weekStart(offset); const e = new Date(s); e.setDate(e.getDate()+7);
    return d>=s && d<e;
  };
  // Aggregate total volume (sum of weight*reps) per exercise for a given week offset
  const weekVolume = (offset) => {
    let total = 0;
    Object.values(weightLogs).forEach(entries => {
      (entries||[]).forEach(en => {
        if (inWeek(en.date, offset)) {
          en.sets.forEach(s => { const wv=parseFloat(s.w)||0, rv=parseFloat(s.r)||0; total += wv*rv; });
        }
      });
    });
    return total;
  };
  const weekSessions = (offset) => {
    const dates = new Set();
    Object.values(weightLogs).forEach(entries => (entries||[]).forEach(en => { if (inWeek(en.date, offset)) dates.add(en.date); }));
    return dates.size;
  };
  const weekCardioMin = (offset) => cardioLog.filter(c=>inWeek(c.date,offset)).reduce((a,c)=>a+(parseFloat(c.minutes)||0),0);
  const weekBodyWeight = (offset) => { const e = bodyWeight.filter(b=>b.kg!==""&&inWeek(b.date,offset)); return e.length? (e.reduce((a,b)=>a+parseFloat(b.kg),0)/e.length) : null; };

  const thisVol = weekVolume(0), lastVol = weekVolume(1);
  const volDelta = lastVol>0 ? (((thisVol-lastVol)/lastVol)*100) : null;
  const thisSess = weekSessions(0), lastSess = weekSessions(1);
  const thisCardio = weekCardioMin(0), lastCardio = weekCardioMin(1);
  const thisBW = weekBodyWeight(0), lastBW = weekBodyWeight(1);
  const bwDelta = (thisBW!=null && lastBW!=null) ? (thisBW-lastBW) : null;

  const latestW = bodyWeight.filter(e=>e.kg!=="").slice(-1)[0]?.kg;
  const lost = latestW ? (START_W - parseFloat(latestW)).toFixed(1) : "0.0";
  const remaining = latestW ? (parseFloat(latestW) - GOAL_W).toFixed(1) : (START_W-GOAL_W).toFixed(1);

  const Card = ({children, style={}}) => <div style={{background:"#111118",border:"1px solid #1e1e2e",borderRadius:14,padding:20,...style}}>{children}</div>;
  const Bebas = ({children, size=22, color, style={}}) => <div style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,fontSize:size,color,...style}}>{children}</div>;

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0a0a0f",minHeight:"100vh",color:"#e8e8f0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        .hov:hover{background:rgba(255,255,255,.04)}
        .daybtn:hover{transform:translateY(-2px)}
        .tabBtn{border:none;cursor:pointer;transition:all .2s;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:500;font-family:'DM Sans',sans-serif;white-space:nowrap}
        .pbar{height:3px;background:linear-gradient(90deg,#f97316,#a855f7,#22c55e,#06b6d4);border-radius:2px;background-size:200% 100%;animation:sh 3s linear infinite}
        @keyframes sh{0%{background-position:0%}100%{background-position:200%}}
        .chev{transition:transform .2s;display:inline-block}
        input,select{font-family:'DM Sans',sans-serif}
        .num-input{background:#0a0a0f;border:1px solid #2a2a3a;border-radius:6px;color:#e8e8f0;padding:6px 8px;font-size:13px;width:100%;text-align:center}
        .num-input:focus{outline:none;border-color:#a855f7}
        .add-btn{background:#1e1e3e;border:1px solid #3e3e6e;color:#c4b5fd;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
        .add-btn:hover{background:#2a2a4e}
        .del-btn{background:transparent;border:none;color:#666;cursor:pointer;font-size:14px;padding:2px 6px}
        .del-btn:hover{color:#ef4444}
        select{background:#1a1a2a;border:1px solid #3e3e6e;border-radius:8px;color:#c4b5fd;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer}
      `}</style>

      <div style={{background:"linear-gradient(135deg,#0d0d18,#12101a)",borderBottom:"1px solid #1e1e2e",padding:"20px 20px 0"}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:30,letterSpacing:2,background:"linear-gradient(90deg,#f97316,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>RECOMP PROTOCOL</div>
            <div style={{background:"#1e1e2e",border:"1px solid #2e2e4e",borderRadius:6,padding:"3px 10px",fontSize:11,color:"#888",letterSpacing:1}}>DAILY</div>
          </div>
          <div style={{color:"#666",fontSize:13,marginBottom:16}}>90.5 kg → 80 kg · 2,100 kcal/day · PPL + Upper/Lower</div>
          <div className="pbar" />
          <div style={{display:"flex",gap:3,padding:"12px 0 0",overflowX:"auto"}}>
            {[["today","Exercises"],["weekly","Weekly"],["nutrition","Nutrition"],["supplements","Supplements"],["tracker","Tracker"]].map(([t,lbl])=>(
              <button key={t} className="tabBtn" onClick={()=>setView(t)} style={{background:view===t?"#1e1e3e":"transparent",color:view===t?"#c4b5fd":"#666",border:view===t?"1px solid #3e3e6e":"1px solid transparent"}}>{lbl}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:16}}>

        {view==="today" && <>
          <div style={{background:"#0d0d18",border:"1px solid #1e1e2e",borderRadius:12,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:isToday?"#22c55e":"#a855f7"}}>{isToday ? "📍 TODAY" : "👁 PREVIEW"} · {DAY_NAMES[selDow]}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {!isToday && <button className="add-btn" onClick={()=>setSelDow(realDow)}>↩ Back to Today</button>}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
              {WEEK_ORDER.map(dow=>{
                const wk = workouts[WEEK[dow]];
                const active = dow===selDow;
                const realNow = dow===realDow;
                return (
                  <button key={dow} className="daybtn" onClick={()=>{setSelDow(dow);setExpandedEx(null);}} style={{cursor:"pointer",border:`1px solid ${active?wk.color:realNow?"#3e3e6e":"#222"}`,background:active?wk.color:"#111118",borderRadius:10,padding:"8px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all .2s",position:"relative"}}>
                    {realNow && !active && <div style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:"#22c55e"}}/>}
                    <span style={{fontSize:9,fontWeight:700,color:active?"#fff":"#888"}}>{DAY_SHORT[dow]}</span>
                    <span style={{fontSize:13}}>{wk.icon}</span>
                    <span style={{fontSize:7,fontWeight:600,letterSpacing:.3,color:active?"#fff":"#555"}}>{wk.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{background:`${w.color}18`,border:`1px solid ${w.color}40`,borderRadius:14,padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><Bebas size={28} color={w.color}>{w.day}</Bebas><div style={{fontSize:13,color:"#aaa",marginTop:2}}>{w.muscles}</div></div>
              <div style={{fontSize:34}}>{w.icon}</div>
            </div>
            <div style={{fontSize:12,color:w.color,marginTop:8,background:`${w.color}15`,borderRadius:8,padding:"6px 10px"}}>{w.focus}</div>
          </div>

          {w.exercises.map((ex,ei)=>{
            const setsN = parseInt(ex.sets)||0;
            const open = expandedEx===ei;
            const dc = Array.from({length:setsN},(_,si)=>checkedSets[`${wkKey}-${ei}-${si}`]).filter(Boolean).length;
            const allDone = setsN>0 && dc===setsN;
            const logs = weightLogs[ex.name]||[];
            return (
              <div key={ei} style={{background:allDone?"rgba(34,197,94,0.06)":"#111118",border:`1px solid ${allDone?"rgba(34,197,94,0.3)":"#1e1e2e"}`,borderRadius:12,overflow:"hidden"}}>
                <div className="hov" onClick={()=>setExpandedEx(open?null:ei)} style={{cursor:"pointer",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>{allDone&&<span style={{fontSize:12}}>✅</span>}<span style={{fontSize:14,fontWeight:500,color:allDone?"#86efac":"#e8e8f0"}}>{ex.name}</span></div>
                    <div style={{fontSize:12,color:"#555",marginTop:3}}>{ex.sets!=="—"&&`${ex.sets} sets`}{ex.reps!=="—"&&` · ${ex.reps} reps`}{ex.rest!=="—"&&` · ${ex.rest} rest`}{logs.length>0 && <span style={{color:"#a855f7"}}> · {logs.length} logged</span>}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>{setsN>0&&<div style={{fontSize:11,color:"#555"}}>{dc}/{setsN}</div>}<span className="chev" style={{color:"#444",fontSize:12,transform:open?"rotate(180deg)":"none"}}>▾</span></div>
                </div>
                {open&&(
                  <div style={{padding:"0 16px 14px",borderTop:"1px solid #1a1a2a"}}>
                    {ytLinks[ex.name]&&(
                      <a href={ytLinks[ex.name]} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,background:"#1a0a0a",border:"1px solid #ff000033",borderRadius:10,padding:"11px 14px",margin:"12px 0",textDecoration:"none"}}>
                        <div style={{width:34,height:34,background:"#ff0000",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>▶</div>
                        <div><div style={{fontSize:13,fontWeight:600,color:"#e8e8f0"}}>Search Jeff Nippard Tutorial</div><div style={{fontSize:11,color:"#666"}}>Opens YouTube search · pick top result</div></div>
                        <div style={{marginLeft:"auto",fontSize:11,color:"#ff4444"}}>↗</div>
                      </a>
                    )}
                    <div style={{background:"#0d0d18",borderRadius:8,padding:"10px 12px",marginBottom:12}}><span style={{fontSize:11,color:"#f97316"}}>💡 </span><span style={{fontSize:12,color:"#999",lineHeight:1.5}}>{ex.tip}</span></div>
                    {setsN>0&&<>
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:11,color:"#555",marginBottom:8,letterSpacing:.5}}>TAP TO LOG SETS (today)</div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          {Array.from({length:setsN},(_,si)=>{const dk = checkedSets[`${wkKey}-${ei}-${si}`];return <div key={si} onClick={()=>toggleSet(ei,si)} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${dk?w.color:"#333"}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:dk?`${w.color}33`:"transparent",color:dk?w.color:"#555",fontSize:11,fontWeight:600}}>{dk?"✓":si+1}</div>;})}
                        </div>
                      </div>
                      <div style={{background:"#0d0d18",borderRadius:10,padding:"12px 14px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:11,fontWeight:700,letterSpacing:.5,color:"#a855f7"}}>🏋️ WEIGHTS LOG</div><button className="add-btn" onClick={()=>addWeightEntry(ex.name,setsN)}>+ Log today</button></div>
                        {logs.length===0 ? <div style={{fontSize:12,color:"#555"}}>No entries yet. Tap "+ Log today" to record weights &amp; reps.</div> : (
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {[...logs].map((entry,idx)=>({entry,idx})).reverse().map(({entry,idx})=>{
                              const lk = `${ex.name}-${idx}`;
                              const openLog = !!expandedLog[lk];
                              const filled = entry.sets.filter(s=>s.w!==""||s.r!=="").length;
                              const topW = entry.sets.map(s=>parseFloat(s.w)||0).reduce((a,b)=>Math.max(a,b),0);
                              return (
                                <div key={idx} style={{background:"#111118",borderRadius:8,border:"1px solid #1e1e2e",overflow:"hidden"}}>
                                  <div className="hov" onClick={()=>setExpandedLog(p=>({...p,[lk]:!p[lk]}))} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px"}}>
                                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                                      <span className="chev" style={{color:"#444",fontSize:11,transform:openLog?"rotate(180deg)":"none"}}>▾</span>
                                      <span style={{fontSize:12,color:"#aaa",fontWeight:500}}>{entry.date}</span>
                                      {!openLog && filled>0 && <span style={{fontSize:11,color:"#a855f7"}}>{topW>0?`top ${topW}kg · `:""}{filled}/{entry.sets.length} sets</span>}
                                      {!openLog && filled===0 && <span style={{fontSize:11,color:"#555"}}>empty — tap to fill</span>}
                                    </div>
                                    <button className="del-btn" onClick={(e)=>{e.stopPropagation();deleteWeightEntry(ex.name,idx);}}>🗑</button>
                                  </div>
                                  {openLog && (
                                    <div style={{padding:"0 12px 12px",borderTop:"1px solid #1a1a2a"}}>
                                      <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 0"}}>
                                        <span style={{fontSize:11,color:"#555"}}>Date:</span>
                                        <input type="date" value={entry.date} onChange={e=>updateWeightEntry(ex.name,idx,-1,"date",e.target.value)} style={{background:"#0a0a0f",border:"1px solid #2a2a3a",borderRadius:6,color:"#aaa",padding:"4px 8px",fontSize:11}}/>
                                      </div>
                                      <div style={{display:"grid",gridTemplateColumns:"44px 1fr 1fr",gap:6,alignItems:"center"}}>
                                        <div/><div style={{fontSize:10,color:"#666",textAlign:"center"}}>Weight (kg)</div><div style={{fontSize:10,color:"#666",textAlign:"center"}}>Reps</div>
                                        {entry.sets.map((st,si)=>(
                                          <div key={si} style={{display:"contents"}}>
                                            <div style={{fontSize:11,color:"#a855f7",fontWeight:600}}>Set {si+1}</div>
                                            <input className="num-input" type="number" inputMode="decimal" placeholder="—" value={st.w} onChange={e=>updateWeightEntry(ex.name,idx,si,"w",e.target.value)}/>
                                            <input className="num-input" type="number" inputMode="numeric" placeholder="—" value={st.r} onChange={e=>updateWeightEntry(ex.name,idx,si,"r",e.target.value)}/>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>}
                  </div>
                )}
              </div>
            );
          })}
        </>}

        {view==="weekly" && <>
          {/* Month selector for cardio */}
          <div style={{background:"#0d0d18",border:"1px solid #1e1e2e",borderRadius:12,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:"#3b82f6"}}>📅 PROGRAM MONTH</div>
              <select value={selMonth} onChange={e=>setSelMonth(e.target.value)}>{Object.keys(cardioByMonth).map(m=><option key={m} value={m}>{m}</option>)}</select>
            </div>
          </div>

          {/* Performance vs last week */}
          <Card style={{borderColor:"#a855f733"}}>
            <Bebas color="#a855f7" style={{marginBottom:6}}>THIS WEEK vs LAST WEEK</Bebas>
            <div style={{fontSize:12,color:"#555",marginBottom:16}}>Weeks run Saturday → Friday, matching your split</div>
            {[
              {label:"💪 Training Volume", unit:"kg", now:thisVol, last:lastVol, delta:volDelta, deltaUnit:"%", higherBetter:true, fmt:v=>Math.round(v).toLocaleString()},
              {label:"🗓 Sessions Logged", unit:"", now:thisSess, last:lastSess, delta:(thisSess-lastSess), deltaUnit:"", higherBetter:true, fmt:v=>v},
              {label:"🚴 Cardio Minutes", unit:"min", now:thisCardio, last:lastCardio, delta:(thisCardio-lastCardio), deltaUnit:"min", higherBetter:true, fmt:v=>Math.round(v)},
              {label:"⚖️ Avg Body Weight", unit:"kg", now:thisBW, last:lastBW, delta:bwDelta, deltaUnit:"kg", higherBetter:false, fmt:v=>v!=null?v.toFixed(1):"—"},
            ].map(row=>{
              const hasData = row.now!=null && (row.last!=null || row.label.includes("Volume")||row.label.includes("Sessions")||row.label.includes("Cardio"));
              let deltaColor="#666", deltaText="—";
              if (row.delta!=null && !isNaN(row.delta) && (row.last>0 || row.delta!==0)) {
                const good = row.higherBetter ? row.delta>0 : row.delta<0;
                const flat = Math.abs(row.delta) < (row.deltaUnit==="%"?0.5:0.05);
                deltaColor = flat ? "#888" : good ? "#22c55e" : "#ef4444";
                const sign = row.delta>0?"+":"";
                deltaText = `${sign}${row.deltaUnit==="%"?row.delta.toFixed(0):row.delta.toFixed(row.deltaUnit==="kg"?1:0)}${row.deltaUnit}`;
              }
              return (
                <div key={row.label} style={{background:"#0d0d18",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:600,color:"#e8e8f0"}}>{row.label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:deltaColor,background:deltaColor+"18",border:"1px solid "+deltaColor+"33",borderRadius:6,padding:"2px 8px"}}>{deltaText}</span>
                  </div>
                  <div style={{display:"flex",gap:16}}>
                    <div><div style={{fontSize:10,color:"#555"}}>THIS WEEK</div><div style={{fontSize:18,fontWeight:700,color:"#e8e8f0"}}>{row.fmt(row.now)} <span style={{fontSize:11,color:"#555",fontWeight:400}}>{row.unit}</span></div></div>
                    <div style={{borderLeft:"1px solid #1e1e2e",paddingLeft:16}}><div style={{fontSize:10,color:"#555"}}>LAST WEEK</div><div style={{fontSize:18,fontWeight:700,color:"#666"}}>{row.fmt(row.last)} <span style={{fontSize:11,color:"#555",fontWeight:400}}>{row.unit}</span></div></div>
                  </div>
                </div>
              );
            })}
            <div style={{fontSize:11,color:"#555",lineHeight:1.6,marginTop:6}}>Training volume = weight × reps across all logged sets. Log your weights in the Exercises tab and cardio below to populate this.</div>
          </Card>

          {/* Cardio target for the month */}
          <Card style={{borderColor:"#3b82f633"}}>
            <Bebas color="#3b82f6" style={{marginBottom:6}}>CARDIO PLAN · {selMonth.toUpperCase()}</Bebas>
            <div style={{fontSize:12,color:"#555",marginBottom:14}}>Your target for this month per the roadmap</div>
            {cardioByMonth[selMonth].map((c,ci)=>(
              <div key={ci} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                <div style={{background:`${c.color}22`,border:`1px solid ${c.color}55`,borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,color:c.color,whiteSpace:"nowrap",marginTop:1}}>{c.weeks}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:"#e8e8f0",marginBottom:2}}>{c.label}</div><div style={{fontSize:12,color:"#666",lineHeight:1.5}}>{c.detail}</div></div>
              </div>
            ))}
          </Card>

          {/* Cardio log */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <Bebas color="#22c55e">CARDIO LOG</Bebas>
              <button className="add-btn" onClick={addCardio}>+ Log cardio</button>
            </div>
            <div style={{fontSize:11,color:"#555",marginBottom:12,lineHeight:1.6}}>Log each cardio session. This week's total: <span style={{color:"#22c55e",fontWeight:700}}>{Math.round(thisCardio)} min</span></div>
            {cardioLog.length===0 ? <div style={{fontSize:12,color:"#555"}}>No cardio logged yet. Tap "+ Log cardio" after a session.</div> : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[...cardioLog].map((e,idx)=>({e,idx})).reverse().map(({e,idx})=>(
                  <div key={idx} style={{display:"flex",gap:8,alignItems:"center",background:"#0d0d18",borderRadius:8,padding:"8px 10px",flexWrap:"wrap"}}>
                    <input type="date" value={e.date} onChange={ev=>updateCardio(idx,"date",ev.target.value)} style={{background:"#0a0a0f",border:"1px solid #2a2a3a",borderRadius:6,color:"#aaa",padding:"5px 8px",fontSize:11}}/>
                    <select value={e.type} onChange={ev=>updateCardio(idx,"type",ev.target.value)} style={{padding:"5px 8px",fontSize:11}}>
                      <option value="LISS">LISS</option><option value="HIIT">HIIT</option><option value="Walk">Walk</option>
                    </select>
                    <input className="num-input" type="number" inputMode="numeric" placeholder="min" value={e.minutes} onChange={ev=>updateCardio(idx,"minutes",ev.target.value)} style={{width:70}}/>
                    <span style={{fontSize:11,color:"#555"}}>min</span>
                    <button className="del-btn" onClick={()=>deleteCardio(idx)} style={{marginLeft:"auto"}}>🗑</button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>}

        {view==="nutrition" && <>
          <Card>
            <Bebas color="#f97316" style={{marginBottom:16}}>YOUR TARGETS</Bebas>
            {[["🎯 Goal Weight","80 kg"],["⚖️ Current Weight","90.5 kg (lose ~10.5 kg fat)"],["🔥 Daily Calories","2,100 kcal (flat, every day)"],["📊 Approach","Hold 2,100 · adjust by waist + photos"],["📉 Target loss","0.5–0.7 kg/week"],["🥩 Protein","180g/day minimum"],["💧 Water","3–4 L / day"],["😴 Sleep","7–9 hrs"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"center"}}><span style={{fontSize:13,color:"#aaa"}}>{l}</span><span style={{fontSize:13,fontWeight:500,color:"#e8e8f0"}}>{v}</span></div>
            ))}
          </Card>
          <Card>
            <Bebas color="#3b82f6" style={{marginBottom:6}}>MACROS (2,100 kcal)</Bebas>
            <div style={{fontSize:12,color:"#555",marginBottom:16}}>Protein prioritised to protect muscle</div>
            {[{macro:"Protein",amount:"180g",kcal:"720 kcal",pct:"34%",color:"#f97316",bar:34,note:"Highest priority — spread across all meals"},{macro:"Carbs",amount:"190–205g",kcal:"800 kcal",pct:"38%",color:"#3b82f6",bar:38,note:"Around training — rice, oats, potato, fruit"},{macro:"Fats",amount:"65g",kcal:"585 kcal",pct:"28%",color:"#22c55e",bar:28,note:"Never below 60g — eggs, olive oil, nuts"}].map(({macro,amount,kcal,pct,color,bar,note})=>(
              <div key={macro} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:600,color}}>{macro}</span><span style={{fontSize:13,color:"#e8e8f0"}}>{amount} <span style={{color:"#555"}}>· {kcal} · {pct}</span></span></div>
                <div style={{background:"#1a1a2a",borderRadius:4,height:5,marginBottom:4}}><div style={{width:`${bar}%`,height:"100%",background:color,borderRadius:4,opacity:.7}}/></div>
                <div style={{fontSize:11,color:"#555"}}>{note}</div>
              </div>
            ))}
          </Card>
          <Card>
            <Bebas color="#a855f7" style={{marginBottom:6}}>MEAL SPLIT</Bebas>
            <div style={{fontSize:12,color:"#555",marginBottom:16}}>Snacks 25% · 3 meals share the rest</div>
            {[{meal:"🌅 Breakfast",pct:"25%",kcal:525,p:"46g",c:"48g",f:"16g",color:"#f97316"},{meal:"☀️ Lunch",pct:"30%",kcal:630,p:"54g",c:"60g",f:"19g",color:"#3b82f6"},{meal:"🌙 Dinner",pct:"20%",kcal:420,p:"36g",c:"38g",f:"14g",color:"#a855f7"},{meal:"🍎 Snacks",pct:"25%",kcal:525,p:"44g",c:"48g",f:"16g",color:"#22c55e"}].map(({meal,pct,kcal,p,c,f,color})=>(
              <div key={meal} style={{marginBottom:12,background:"#0d0d18",borderRadius:10,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,color}}>{meal}</span><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,color:"#e8e8f0",fontWeight:600}}>{kcal} kcal</span><span style={{background:`${color}22`,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 7px",fontSize:11,fontWeight:700,color}}>{pct}</span></div></div>
                <div style={{display:"flex",gap:12}}><div style={{fontSize:11,color:"#666"}}><span style={{color:"#f97316",fontWeight:700}}>P </span>{p}</div><div style={{fontSize:11,color:"#666"}}><span style={{color:"#3b82f6",fontWeight:700}}>C </span>{c}</div><div style={{fontSize:11,color:"#666"}}><span style={{color:"#22c55e",fontWeight:700}}>F </span>{f}</div></div>
              </div>
            ))}
          </Card>
          <Card style={{borderColor:"#f43f5e33"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><Bebas color="#f43f5e">FRIDAY CHEAT MEAL</Bebas><div style={{background:"#f43f5e22",border:"1px solid #f43f5e44",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#f43f5e"}}>WEEKLY</div></div>
            <div style={{fontSize:12,color:"#555",marginBottom:14}}>800–1,000 kcal · dinner · Saturday back to normal</div>
            {[["✅","One meal only — not one day"],["✅","Still hit ~40g protein"],["✅","Eat normally all day — don't skip to earn it"],["❌","Don't go past 1,200 kcal"]].map(([i,r])=>(
              <div key={r} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}><span style={{fontSize:13}}>{i}</span><span style={{fontSize:12,color:"#888",lineHeight:1.6}}>{r}</span></div>
            ))}
          </Card>
        </>}

        {view==="supplements" && <>
          <Card style={{borderColor:"#06b6d433"}}><Bebas color="#06b6d4" style={{marginBottom:6}}>SUPPLEMENT STACK</Bebas><div style={{fontSize:12,color:"#555"}}>5 supplements · all compatible</div></Card>
          {[
            {name:"Dymatize ISO100 Hydrolyzed",sub:"Fastest-absorbing whey",tag:"✅",color:"#22c55e",when:"Post-workout in water. Rest days: between-meal top-up.",desc:"Bridges the gap to hit 180g protein daily."},
            {name:"Thorne Creatine Powder",sub:"Monohydrate · 5g daily",tag:"✅",color:"#22c55e",when:"Any time, every day. Mix into shake.",desc:"Most evidence-backed strength supplement. May add 0.5–1kg water first 2 weeks — not fat."},
            {name:"Thorne ALCAR",sub:"500mg · 1–2 caps",tag:"⚠️",color:"#eab308",when:"60–90 min before training/cardio. Skip full rest days.",desc:"Fat oxidation + mental focus. Amplifier, not a driver."},
            {name:"Pure Encapsulations Magnesium Glycinate",sub:"Best-absorbed form",tag:"✅",color:"#22c55e",when:"30–60 min before bed, nightly.",desc:"Improves deep sleep = better recovery & growth hormone."},
            {name:"Thorne Vitamin D + K2",sub:"D3 + MK-7 K2",tag:"✅",color:"#22c55e",when:"With lunch/dinner, daily.",desc:"K2 directs calcium to bones. Supports testosterone & recovery."},
          ].map(s=>(
            <Card key={s.name}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}><div><Bebas size={18} color={s.color}>{s.name}</Bebas><div style={{fontSize:12,color:"#555",marginTop:2}}>{s.sub}</div></div><span style={{background:`${s.color}22`,color:s.color,border:`1px solid ${s.color}44`,borderRadius:6,padding:"3px 9px",fontSize:12,fontWeight:700}}>{s.tag}</span></div>
              <p style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:12}}>{s.desc}</p>
              <div style={{background:"#0d0d18",borderRadius:8,padding:"10px 14px"}}><div style={{fontSize:11,color:s.color,fontWeight:700,marginBottom:6,letterSpacing:.5}}>⏰ WHEN</div><div style={{fontSize:12,color:"#777",lineHeight:1.6}}>{s.when}</div></div>
            </Card>
          ))}
        </>}

        {view==="tracker" && <>
          <Card style={{borderColor:"#22c55e33"}}>
            <Bebas color="#22c55e" style={{marginBottom:6}}>WEIGHT PROGRESS</Bebas>
            <div style={{fontSize:12,color:"#555",marginBottom:14}}>90.5 kg → 80 kg goal</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
              {[["CURRENT",latestW||"90.5","#e8e8f0","#1e1e2e"],["LOST",lost,"#22c55e","#22c55e33"],["TO GOAL",remaining,"#f97316","#f9731633"]].map(([lbl,val,col,bord])=>(
                <div key={lbl} style={{flex:1,minWidth:90,background:"#0d0d18",borderRadius:10,padding:12,textAlign:"center",border:`1px solid ${bord}`}}><div style={{fontSize:11,color:"#555"}}>{lbl}</div><div style={{fontSize:20,fontWeight:700,color:col}}>{val}</div><div style={{fontSize:11,color:"#666"}}>kg</div></div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:11,fontWeight:700,letterSpacing:.5,color:"#aaa"}}>⚖️ WEIGHT LOG</div><button className="add-btn" onClick={addBodyWeight}>+ Add entry</button></div>
            <div style={{fontSize:11,color:"#555",marginBottom:12,lineHeight:1.6}}>Weigh 3× per week — morning, after bathroom, before food. Watch the trend.</div>
            {bodyWeight.length===0 ? <div style={{fontSize:12,color:"#555"}}>No entries yet.</div> : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {bodyWeight.map((e,idx)=>(
                  <div key={idx} style={{display:"flex",gap:8,alignItems:"center",background:"#0d0d18",borderRadius:8,padding:"8px 10px"}}>
                    <input type="date" value={e.date} onChange={ev=>updateBodyWeight(idx,"date",ev.target.value)} style={{background:"#0a0a0f",border:"1px solid #2a2a3a",borderRadius:6,color:"#aaa",padding:"5px 8px",fontSize:11,flex:1}}/>
                    <input className="num-input" type="number" inputMode="decimal" placeholder="kg" value={e.kg} onChange={ev=>updateBodyWeight(idx,"kg",ev.target.value)} style={{width:80}}/>
                    <span style={{fontSize:11,color:"#555"}}>kg</span><button className="del-btn" onClick={()=>deleteBodyWeight(idx)}>🗑</button>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <Bebas color="#a855f7" style={{marginBottom:6}}>HOW TO MEASURE</Bebas>
            <div style={{fontSize:12,color:"#555",marginBottom:14}}>Weekly, same morning, relaxed. Waist is #1.</div>
            {measureGuide.map(m=>(
              <div key={m.key} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
                <div style={{background:`${m.color}22`,border:`1px solid ${m.color}55`,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:m.color,whiteSpace:"nowrap",marginTop:1,minWidth:64,textAlign:"center"}}>{m.name}{m.primary?" ⭐":""}</div>
                <div style={{fontSize:12,color:"#888",lineHeight:1.6}}>{m.guide}</div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><Bebas color="#22c55e">MEASUREMENT LOG</Bebas><button className="add-btn" onClick={addMeasurement}>+ Add entry</button></div>
            {measurements.length===0 ? <div style={{fontSize:12,color:"#555"}}>No entries yet. All values in cm.</div> : (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {measurements.map((entry,idx)=>(
                  <div key={idx} style={{background:"#0d0d18",borderRadius:10,padding:"12px 14px",border:"1px solid #1e1e2e"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><input type="date" value={entry.date} onChange={ev=>updateMeasurement(idx,"date",ev.target.value)} style={{background:"#0a0a0f",border:"1px solid #2a2a3a",borderRadius:6,color:"#aaa",padding:"5px 8px",fontSize:11}}/><button className="del-btn" onClick={()=>deleteMeasurement(idx)}>🗑</button></div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
                      {measureGuide.map(m=>(
                        <div key={m.key} style={{display:"flex",flexDirection:"column",gap:4}}>
                          <label style={{fontSize:11,color:m.color,fontWeight:600}}>{m.name}{m.primary?" ⭐":""} <span style={{color:"#555"}}>(cm)</span></label>
                          <input className="num-input" type="number" inputMode="decimal" placeholder="—" value={entry[m.key]||""} onChange={ev=>updateMeasurement(idx,m.key,ev.target.value)}/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <div style={{background:"linear-gradient(135deg,#1a0d2e,#0d1a0d)",border:"1px solid #2e1a4e",borderRadius:14,padding:20}}>
            <Bebas size={18} color="#c4b5fd" style={{marginBottom:10}}>YOUR SCORECARD</Bebas>
            <p style={{fontSize:13,color:"#888",lineHeight:1.7}}>Waist shrinking = fat loss. Weight flat or slowly dropping = normal recomp. Lifts climbing = muscle built. Judge over <strong style={{color:"#c4b5fd"}}>2–4 weeks</strong>. Data saves automatically.</p>
          </div>
        </>}

      </div>
    </div>
  );
}
