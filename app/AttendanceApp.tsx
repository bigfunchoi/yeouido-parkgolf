 "use client";
import {useEffect,useMemo,useState} from "react";

const PEOPLE=["장선순","진도홍","이애자","노재돈","박윤경","조성완","오정화","김성규","이미경","박인규","김미숙","임임환"];
type Row={name:string;status:"참석"|"불참"|""};
type Meeting={date:string;label:string;type:"주말"|"공휴일"};

export default function AttendanceApp(){
 const [name,setName]=useState("");
 const [meetings,setMeetings]=useState<Meeting[]>([]);
 const [date,setDate]=useState("");
 const [rows,setRows]=useState<Row[]>([]);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [msg,setMsg]=useState("");

 useEffect(()=>{setName(localStorage.getItem("parkName")||""); loadDates()},[]);
 useEffect(()=>{if(date) loadAttendance(date)},[date]);

 async function loadDates(){
  try{const r=await fetch("/api/dates"); const d=await r.json(); setMeetings(d.dates||[]); if(!date&&d.dates?.length)setDate(localStorage.getItem("parkDate")||d.dates[0].date);}
  finally{setLoading(false)}
 }
 async function loadAttendance(d:string){
  const r=await fetch(`/api/attendance?date=${encodeURIComponent(d)}`); const data=await r.json();
  setRows(data.rows||[]);
 }
 async function save(status:"참석"|"불참"){
  if(!name){setMsg("먼저 이름을 선택해 주세요.");return}
  setSaving(true);setMsg("");
  const r=await fetch("/api/attendance",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({date,name,status})});
  const data=await r.json(); setSaving(false);
  if(data.ok){localStorage.setItem("parkName",name);setMsg("저장되었습니다.");await loadAttendance(date)}
  else setMsg("저장하지 못했습니다.");
 }
 const mine=rows.find(x=>x.name===name)?.status||"";
 const counts=useMemo(()=>({yes:rows.filter(x=>x.status==="참석").length,no:rows.filter(x=>x.status==="불참").length}),[rows]);
 const selected=meetings.find(x=>x.date===date);
 return <main>
  <header><div className="title">⛳ 여의도 파크골프</div><div className="subtitle">주말 · 공휴일 출석 체크</div></header>
  <section className="card">
   <label>① 내 이름</label>
   <select value={name} onChange={e=>{setName(e.target.value);localStorage.setItem("parkName",e.target.value)}}>
    <option value="">이름을 선택하세요</option>{PEOPLE.map(p=><option key={p}>{p}</option>)}
   </select>
  </section>
  <section className="card">
   <label>② 모임 날짜</label>
   <select value={date} onChange={e=>{setDate(e.target.value);localStorage.setItem("parkDate",e.target.value)}}>
    {meetings.map(m=><option key={m.date} value={m.date}>{m.label} · {m.type}</option>)}
   </select>
   <div className="dateLine"><strong>{selected?.label||"날짜를 불러오는 중…"}</strong><span>{selected?.type||""}</span></div>
   <div className="buttons">
    <button className={"yes "+(mine==="참석"?"active":"")} disabled={saving} onClick={()=>save("참석")}>✓ 참석</button>
    <button className={"no "+(mine==="불참"?"active":"")} disabled={saving} onClick={()=>save("불참")}>✕ 불참</button>
   </div>
   {msg&&<div className="msg">{msg}</div>}
  </section>
  <section className="card">
   <div className="summary"><strong>선택 날짜 출석 현황</strong><span>참석 {counts.yes} · 불참 {counts.no}</span></div>
   <div className="grid">{(rows.length?rows:PEOPLE.map(name=>({name,status:""} as Row))).map(x=>
    <div className="person" key={x.name}><span>{x.name}</span><b className={x.status==="참석"?"attend":x.status==="불참"?"absent":"pending"}>{x.status||"미정"}</b></div>)}</div>
  </section>
  <p className="foot">한 번 체크하면 같은 날짜의 모든 사람 화면에 반영됩니다.</p>
 </main>
}