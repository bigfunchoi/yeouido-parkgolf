import {NextResponse} from "next/server";
function iso(d:Date){return d.toISOString().slice(0,10)}
function label(d:Date){return new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric",weekday:"short",timeZone:"Asia/Seoul"}).format(d)}
export async function GET(){
 const now=new Date(), end=new Date(now);end.setDate(end.getDate()+180);
 const years=[now.getUTCFullYear(),end.getUTCFullYear()];
 const holidays=new Map<string,string>();
 for(const y of years){try{const r=await fetch(`https://date.nager.at/api/v3/PublicHolidays/${y}/KR`,{next:{revalidate:86400}});if(r.ok){const a=await r.json();for(const h of a)holidays.set(h.date,h.localName||h.name)}}catch{}}
 const dates=[];for(let d=new Date(now);d<=end;d.setDate(d.getDate()+1)){const day=d.getUTCDay(),key=iso(d);if(day===0||day===6||holidays.has(key))dates.push({date:key,label:label(d),type:holidays.has(key)?"공휴일":"주말"})}
 return NextResponse.json({dates})
}