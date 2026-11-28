"use strict";
/* ===================== Booska Cycle Clock · core engine · @Booskapro · © All rights reserved =====================
   Shared by the website (browser) and the archive robot (GitHub Action, Node). No DOM in this file. */
const DAY=864e5, HALVING_BLOCKS=210000;
const HALV=[{b:0,t:Date.UTC(2009,0,3,18,15,5)}]; // filled from the event log (exact halving block times)
const CONF=1.20, FIT_FROM=Date.UTC(2013,3,28);
const SNAP={block:977195,tBlock:Date.UTC(2026,10,23,11,25),price:61309,tPrice:Date.UTC(2026,10,23,11,37)};

/* ---------------- i18n ---------------- */
const MON={so:["Jan","Feb","Mar","Abr","Mey","Jun","Lul","Ogo","Sep","Okt","Nov","Dis"],en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]};
const T={so:{
 tagline:"Wareegga Bitcoin · Live",n_clock:"Waqtiga",n_inv:"Maalgashi",vid_t:"Muuqaalka: sida Booska u shaqeeyo",vid_s:"76 ilbiriqsi · qaacidada, saacadda iyo sida loo isticmaalo",vid_l:"▶ Muuqaal",n_cycles:"Wareegyada",n_price:"Qiimaha",n_calc:"Xisaabiye",n_form:"Moodeelada",n_about:"Ku saabsan",n_priv:"Privacy",n_terms:"Terms",nfa:"Ma aha talo maaliyadeed",more:"Fiiri →",
 k_clock:"Saacadda wareegga",c_time:"Saacadda",c_date:"Taariikh",c_phase:"Xilliga",s_price:"Qiimaha BTC",s_halv:"Halving 5",
 t_where:"Halka wareegga la joogo",t_fc:"Saadaasha Booska",t_fc_s:"Qaacidooyin furan · ma aha ballan",fc_note:"",
 t_conf:"Xaqiijinta bottom-ka",t_conf_s:"Weekly close > Low × 1.20",t_pc:"Qiimaha iyo sagxadda",t_pc_s:"Buluug = qiimaha · cad = trend · cagaar = sagxadda bottom-ka (trend × 0.5)",
 k_cycles:"Wareegyada",cy_lead:"Wareeg kasta: halving → top → bottom → halving xiga. Charts-ka farta ku wareeji, labada farna ku weynee.",
 t_wk:"Qiimaha – weekly",t_wk_s:"Shumac kasta = hal toddobaad · trend iyo sagxadda bottom-ka",lg_up:"Toddobaad kor",lg_dn:"Toddobaad hoos",lg_floor:"Sagxad (×0.5)",
 t_dd:"Inta uu ka hooseeyo ATH",t_dd_s:"Top kasta = 0%. Bottom-yadu way yaraanayaan (xiritaanka toddobaadka).",
 t_ov:"Wareegyada oo isku chart ah",t_ov_s:"Halving = 1x · daaqadaha TOP iyo BOTTOM waxaa laga xisaabiyay wareegyadii hore",
 t_hist:"Taariikhda wareegyada",t_hist_s:"Top iyo bottom kasta – taariikh, qiime, maalmo halving kaddib, saacad",hist_note:"Qiimayaasha top/bottom waa kuwa maalinta ugu sarreeya/hooseeya (intraday). Charts-ka waxay isticmaalaan xiritaanka.",
 k_price:"Qiimaha",pr_h:"Heerarka muhiimka ah ee wareeggan",pr_lead:"Halka qiimuhu ka joogo heer kasta. Lambarrada si toos ah ayay isu cusboonaysiiyaan.",t_lad:"Jaranjarada qiimaha",t_lad_s:"Heerarka, sare ilaa hoos (miisaan log)",t_lv:"Heerarka chart-ka",t_lv_s:"Qiimaha 2 sano ee u dambeeyay + heerarka",
 k_calc:"Xisaabiye",ca_h:"Geli taariikh ama block",ca_lead:"Hel saacadda wareegga, xilliga, iyo heerarka qiimaha – waqti kasta, hore ama dambe.",ca_in:"Gelinta",ca_date:"Taariikh",ca_block:"ama Block",q_now:"Maanta",ca_res:"Natiijada",ca_how:"Sida loo xisaabiyay",
 k_form:"Moodeelada",fo_h:"Moodeelada – laga xisaabiyay xogta, live",fo_lead:"Lambar kasta oo moodeel ah waxaa dib loo xisaabiyaa mar kasta oo bogga la furo ama xog cusub timaado. Halkan waxaa ku qoran sida loo helay, inta ay le'eg tahay saxnaantu, iyo qaladka.",fo_nums:"Lambarrada joogtada ah – halka ay ka yimaadeen",
 fo_honest:"<b>Daacadnimo:</b> moodeelada waxaa laga xisaabiyay 3–4 wareeg oo keliya. Waa qaab taariikheed, ma aha sharci. Wareeg kasta wuu jebin karaa – sidaas darteed qaladka wareeg kasta waa furan yahay.",
 ab_h:"Wareegga Bitcoin – si fudud loo sharxay",ab_lead:"Booska Cycle Clock waa bilaash, akoon la'aan. Wuxuu muujiyaa halka Bitcoin uu ka joogo wareeggiisa 4-sano, oo lambar kasta wuxuu leeyahay sharaxaad.",
 ab_how:"Sida uu u shaqeeyo",ab_how_t:"<ul><li>Block-ga live ah (mempool.space) ayaa wada saacadda: 210,000 block = 24 saac.</li><li>Moodeelada (trend, waqtiga, sagxadda, ^k) waxaa mar kasta laga xisaabiyaa xogta – lambar go'an ma jiro.</li><li>Wax kasta waxaa lagu xisaabiyaa browser-kaaga – server ma jiro.</li></ul>",
 ab_not:"Waxa uusan ahayn",ab_not_t:"<ul><li>Ma aha talo maaliyadeed, ma aha signal iib ama gade.</li><li>Qaacidooyinku waa qaab taariikheed – suuqu wuu jebin karaa.</li><li>Xogtu way daahi kartaa ama qaldami kartaa.</li></ul>",
 ab_src:"Halka xogtu ka timaado",ab_open:"Fur saacadda →",
 priv_t:"<h3>Privacy</h3><p>Cusboonaysiintii u dambeysay: 23 Nov 2026.</p><p>Booska Cycle Clock <b>akoon ma laha</b>, email ma ururiyo, mana isticmaalo cookies raad-raac ah ama xayeysiis.</p><p>Doorashada luqadda (SO/EN) waxaa lagu kaydiyaa browser-kaaga oo keliya (localStorage).</p><p>Si xogta live ah loo helo, browser-kaagu wuxuu si toos ah ula xiriiraa mempool.space, blockstream.info, CoinGecko, Binance iyo Coinbase. Adeegyadaas waxay arki karaan IP-gaaga sida bog kasta oo internet ah; siyaasadahooda ayaa khuseeya.</p><p>Bogga waxaa martigeliya GitHub Pages, kaas oo kaydin kara log caadi ah (sida IP) sababo amni awgood.</p>",
 terms_t:"<h3>Terms</h3><p><b>Waxbarasho keliya.</b> Wax kasta oo halkan ku jira waa macluumaad iyo waxbarasho – ma aha talo maaliyadeed, maalgashi ama canshuur.</p><p><b>Saxnaanta.</b> Xogta waxaa laga keenaa ilo dadweyne; way daahi kartaa, dhiman kartaa ama qaldami kartaa. Saadaasha waa qaab taariikheed, ma aha ballan.</p><p><b>Damaanad ma jirto.</b> Adeegga waxaa la bixiyaa sida uu yahay. Khasaare kasta oo ka yimaada isticmaalka xogtan mas'uul kama nihin.</p><p>Su'aalo: <a href='https://x.com/Booskapro' target='_blank' rel='noopener'>@Booskapro</a></p>",
 live:"Live",offline:"Xog kaydsan",cm_s:"Labo far ku weynee · dhibic kasta waa top ama bottom wareeg hore",go_now:"Hadda",k_time:"Waqtiga wareegga Bitcoin",clk_s:"Gacanta = maanta (block-ga live ah) · 24 saac = hal wareeg",tl_t:"Jadwalka wareegyada",tl_s:"",feed_t:"Dhacdooyinka u dambeeyay",feed_s:"",ct_t:"Waqtiga wareeg kasta",ct_s:"Maalmaha halving kaddib iyo saacadda wareegga",
 n_arch:"Kaydka",ar_h:"Diiwaanka live ah – waxba lama tirtiro",ar_lead:"Block kasta iyo qiime kasta waa la hubiyaa. Dhacdo kasta (halving, top, bottom) isla markiiba way is calaamadaysaa, robot-ka kaydkuna (GitHub Actions) 10 daqiiqo kasta ayuu xogta ku kaydiyaa – sannado kaddib waa la heli karaa.",
 ar_ev:"Dhammaan dhacdooyinka",ar_ev_s:"",ar_day:"Raadi maalin",ar_day_s:"Dooro taariikh – arag xogtii iyo saadaashii maalintaas.",ar_dl:"Soo deji xogta",ar_dl_s:"Xogta waa la soo dejisan karaa si shakhsi ah · © Booska Cycle Clock. Excel ama Python ku fur.",
 ar_led:"Saadaasha maalin kasta (forecast ledger)",ar_led_s:"Sida saadaashu isu beddeshay maalin kasta – caddayn aan la beddeli karin.",
 es_confirmed:"La xaqiijiyay",es_suspected:"La tuhunsan yahay",es_broken:"La jebiyay",ev_conf:"Xaqiijin",ev_first:"Low koowaad",ev_rel:"Relief",ev_local:"Live · wali lama kaydin",n_sig:"Signal",
 fd_k:"Aasaasaha",fd_role:"Cilmi-baare crypto · Aasaasaha Booska Cycle Clock",fd_by:"Aasaasaha",fd_btn:"Raac @Booskapro →",
 fd_txt:"Booska Cycle Clock wuxuu u dhisay si bulshada Soomaaliyeed iyo cid kasta ay u fahmaan wareegga Bitcoin – xog live ah, qaacidooyin furan, iyo lambar kasta oo sharaxaad leh.",
 sg_lead:"Shan xeer oo furan ayaa si toos ah loo hubiyaa – block kasta iyo toddobaad kasta. Mid kasta wuxuu leeyahay lambar, xeer iyo taariikh. Ma aha amar iib ama gade.",
 sg_state:"Xaaladda",sg_list:"Shanta calaamadood ee bottom-ka",sg_list_s:"Cagaar = buuxsamay · oranji = soo dhowaanaya · cawl = sugid · casaan = jabay",
 ph_t:"Marxaladaha wareegga",ph_s:"Daaqad kasta waxaa laga xisaabiyay wareegyadii hore; xaaladda waxaa laga xisaabiyaa xogta live-ka ah.",
 sh_t:"Taariikhda signal-ka xaqiijinta",sh_s:"Toddobaadkii ugu horreeyay ee xiritaankiisu ka sarreeyay Low × 1.20 – iyo hal sano kaddib (xogta laga xisaabiyay).",
 sg_warn:"<b>Signal-kan waa xeerar taariikheed oo furan – ma aha talo maaliyadeed.</b> Ma sheegayo iib ama gade. Tusaalaha taariikhdu waa yar yahay (3–4 wareeg); suuqu wuu jebin karaa xeer kasta.",
 osc_t:"Qiimaha ÷ Trend",osc_s:"1.0 = trend-ka · xariiqda cagaarka = celceliska bottom-yada (sagxadda) · miisaan log",
 st_ok:"Buuxsamay",st_near:"Soo dhowaanaya",st_wait:"Sugid",st_bad:"Jabay",
 x_badge:"Xog",q_badge:"Qiyaas",
 ph_rise:"Kor-u-kac",ph_top:"Aagga TOP",ph_fall:"Hoos-u-dhac",ph_bot:"Aagga BOTTOM",ph_rec:"Soo kabasho",
},en:{
 tagline:"Bitcoin cycle · Live",n_clock:"Time",n_inv:"Invest",vid_t:"Video: how Booska works",vid_s:"76 seconds · the formula, the clock and how to use it",vid_l:"▶ Video",n_cycles:"Cycles",n_price:"Price",n_calc:"Calculator",n_form:"Models",n_about:"About",n_priv:"Privacy",n_terms:"Terms",nfa:"Not financial advice",more:"Open →",
 k_clock:"Cycle clock",c_time:"Cycle time",c_date:"Date",c_phase:"Phase",s_price:"BTC price",s_halv:"Halving 5",
 t_where:"Where we are in the cycle",t_fc:"Booska forecast",t_fc_s:"Open formulas · not a promise",fc_note:"",
 t_conf:"Bottom confirmation",t_conf_s:"Weekly close > Low × 1.20",t_pc:"Price and floor",t_pc_s:"Blue = price · white = trend · green = bottom floor (trend × 0.5)",
 k_cycles:"Cycles",cy_lead:"Every cycle: halving → top → bottom → next halving. Drag the charts with a finger, pinch to zoom.",
 t_wk:"Price – weekly",t_wk_s:"Each candle = one week · trend and bottom floor",lg_up:"Up week",lg_dn:"Down week",lg_floor:"Floor (×0.5)",
 t_dd:"Distance below the all-time high",t_dd_s:"Every top = 0%. Bottoms get shallower (weekly closes).",
 t_ov:"All cycles on one chart",t_ov_s:"Halving = 1x · TOP and BOTTOM windows computed from past cycles",
 t_hist:"Cycle history",t_hist_s:"Every top and bottom – date, price, days after halving, clock time",hist_note:"Top/bottom prices are intraday highs/lows. Charts use closes.",
 k_price:"Price",pr_h:"The key levels of this cycle",pr_lead:"Where price sits against each level. Numbers update automatically.",t_lad:"Price ladder",t_lad_s:"Levels, top to bottom (log scale)",t_lv:"Levels on the chart",t_lv_s:"Last 2 years of price + levels",
 k_calc:"Calculator",ca_h:"Enter a date or a block",ca_lead:"Get the cycle time, phase and price levels – for any time, past or future.",ca_in:"Input",ca_date:"Date",ca_block:"or Block",q_now:"Today",ca_res:"Result",ca_how:"How it was calculated",
 k_form:"Models",fo_h:"Models – fitted from the data, live",fo_lead:"Every model number is recomputed each time the page opens or new data arrives. Here is how each was derived, how well it fits, and its error.",fo_nums:"Constants – where they come from",
 fo_honest:"<b>Honesty:</b> the models are fitted on only 3–4 cycles. They are a historical pattern, not a law. Any cycle can break it – so every cycle's error is shown openly.",
 ab_h:"The Bitcoin cycle – explained simply",ab_lead:"Booska Cycle Clock is free with no account. It shows where Bitcoin is in its 4-year cycle, and every number comes with an explanation.",
 ab_how:"How it works",ab_how_t:"<ul><li>The live block height (mempool.space) drives the clock: 210,000 blocks = 24 hours.</li><li>The models (trend, timing, floor, ^k) are refitted from the data every time – no hard-coded numbers.</li><li>Everything is calculated in your browser – there is no server.</li></ul>",
 ab_not:"What it is not",ab_not_t:"<ul><li>Not financial advice, not a buy or sell signal.</li><li>The formulas are a historical pattern – the market can break them.</li><li>Data can be delayed or wrong.</li></ul>",
 ab_src:"Where the numbers come from",ab_open:"Open the clock →",
 priv_t:"<h3>Privacy</h3><p>Last updated: 23 Nov 2026.</p><p>Booska Cycle Clock has <b>no accounts</b>, collects no email, and uses no tracking cookies or ads.</p><p>Your language choice (SO/EN) is stored only in your browser (localStorage).</p><p>For live data your browser connects directly to mempool.space, blockstream.info, CoinGecko, Binance and Coinbase. Like any website they can see your IP address; their policies apply.</p><p>The site is hosted on GitHub Pages, which may keep standard logs (such as IP) for security.</p>",
 terms_t:"<h3>Terms</h3><p><b>Education only.</b> Everything here is information and education – not financial, investment or tax advice.</p><p><b>Accuracy.</b> Data comes from public sources and may be delayed, missing or wrong. Forecasts are a historical pattern, not a promise.</p><p><b>No warranty.</b> The service is provided as is. We are not liable for losses from using this data.</p><p>Questions: <a href='https://x.com/Booskapro' target='_blank' rel='noopener'>@Booskapro</a></p>",
 live:"Live",offline:"Cached data",cm_s:"Pinch to zoom · each dot is a past top or bottom",go_now:"Now",k_time:"Bitcoin cycle time",clk_s:"Hand = today (live block) · 24 hours = one cycle",tl_t:"Cycle timeline",tl_s:"",feed_t:"Latest events",feed_s:"",ct_t:"Timing of every cycle",ct_s:"Days after halving and the cycle clock time",
 n_arch:"Archive",ar_h:"Live record – nothing is deleted",ar_lead:"Every block and every price is checked. Each event (halving, top, bottom) marks itself instantly, and the archive robot (GitHub Actions) saves the data every 10 minutes – available years from now.",
 ar_ev:"All events",ar_ev_s:"",ar_day:"Look up a day",ar_day_s:"Pick a date – see that day's data and forecast.",ar_dl:"Download the data",ar_dl_s:"Data can be downloaded for personal use · © Booska Cycle Clock. Open it in Excel or Python.",
 ar_led:"Daily forecast ledger",ar_led_s:"How the forecast changed each day – a record that cannot be altered.",
 es_confirmed:"Confirmed",es_suspected:"Suspected",es_broken:"Broken",ev_conf:"Confirmation",ev_first:"First low",ev_rel:"Relief",ev_local:"Live · not archived yet",n_sig:"Signal",
 fd_k:"Founder",fd_role:"Crypto researcher · Founder of Booska Cycle Clock",fd_by:"Founded by",fd_btn:"Follow @Booskapro →",
 fd_txt:"He built Booska Cycle Clock so the Somali community – and anyone – can understand the Bitcoin cycle: live data, open formulas, and an explanation for every number.",
 sg_lead:"Five open rules, checked automatically – every block and every week. Each has a number, a rule and a date. Not a buy or sell order.",
 sg_state:"Status",sg_list:"The five bottom signals",sg_list_s:"Green = met · orange = approaching · grey = waiting · red = broken",
 ph_t:"Cycle phases",ph_s:"Each window is computed from past cycles; the status is computed from live data.",
 sh_t:"Confirmation signal history",sh_s:"The first week that closed above Low × 1.20 – and one year later (computed from the data).",
 sg_warn:"<b>These signals are open historical rules – not financial advice.</b> They do not say buy or sell. The history is small (3–4 cycles); the market can break any rule.",
 osc_t:"Price ÷ Trend",osc_s:"1.0 = the trend · green line = average of past bottoms (the floor) · log scale",
 st_ok:"Met",st_near:"Approaching",st_wait:"Waiting",st_bad:"Broken",
 x_badge:"Data",q_badge:"Model",
 ph_rise:"Bull run",ph_top:"Top zone",ph_fall:"Bear market",ph_bot:"Bottom zone",ph_rec:"Recovery",
}};
let LANG="so";
try{const q=new URLSearchParams(location.search).get("lang");LANG=q||localStorage.getItem("booska_lang")||"so";}catch(e){}
if(!T[LANG])LANG="so";
const t=k=>(T[LANG][k]??T.so[k]??k);
const L=(so,en)=>LANG==="en"?en:so;
/* ---------------- utils ---------------- */
const nf=n=>Math.round(n).toLocaleString("en-US");
const usd=n=>(n<0?"−$":"$")+nf(Math.abs(n));
const usdK=n=>n>=1e6?"$"+(n/1e6).toFixed(2)+"M":n>=1e4?"$"+Math.round(n/1e3)+"K":n>=1e3?"$"+(n/1e3).toFixed(1)+"K":"$"+(n<10?n.toFixed(2):Math.round(n));
const pct=(x,d=1)=>(x>=0?"+":"−")+Math.abs(x).toFixed(d)+"%";
const ymd=s=>{const[a,b,c]=s.split("-").map(Number);return Date.UTC(a,b-1,c);};
const dstr=ms=>{const d=new Date(ms);return d.getUTCDate()+" "+MON[LANG][d.getUTCMonth()]+" "+d.getUTCFullYear();};
const mstr=ms=>{const d=new Date(ms);return MON[LANG][d.getUTCMonth()]+" "+d.getUTCFullYear();};
const mrange=(ms,w)=>{const a=new Date(ms-w*DAY),b=new Date(ms+w*DAY);
  if(a.getUTCFullYear()===b.getUTCFullYear())return a.getUTCMonth()===b.getUTCMonth()?mstr(ms):MON[LANG][a.getUTCMonth()]+"–"+MON[LANG][b.getUTCMonth()]+" "+b.getUTCFullYear();
  return mstr(a.getTime())+" – "+mstr(b.getTime());};
const hm=h=>{h=((h%24)+24)%24;const H=Math.floor(h),M=Math.floor((h-H)*60+1e-9);return String(H).padStart(2,"0")+":"+String(M).padStart(2,"0");};
const iso=ms=>new Date(ms).toISOString().slice(0,10);
const monday=ms=>{const d=new Date(ms);const wd=(d.getUTCDay()+6)%7;return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-wd);};
const dayOf=ms=>{const d=new Date(ms);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------------- state ---------------- */
const S={block:SNAP.block,tBlock:SNAP.tBlock,price:SNAP.price,chg:null,liveB:false,liveP:false,low:0,lowT:0,newLow:false,ath:0,athT:0,
  srcB:"snapshot",srcP:"snapshot",tP:SNAP.tPrice,tW:null,srcW:"Coin Metrics + CoinGecko",srcC:null,candles:[],
  weekly:WEEKLY.map(r=>({t:ymd(r[0]),o:r[1],h:r[2],l:r[3],c:r[4]})),events:JSON.parse(JSON.stringify(EVENTS.events||EVENTS))};
const nowMs=()=>Date.now();
function curBlock(){if(S.liveB)return S.block;return Math.floor(SNAP.block+(nowMs()-SNAP.tBlock)/(avgMin()*60000));}
function avgMin(){const h=HALV[HALV.length-1];return (S.tBlock-h.t)/60000/Math.max(1,S.block-h.b);}
function anchors(){return HALV.map(h=>[h.t,h.b]).concat([[S.liveB?S.tBlock:nowMs(),curBlock()]]);}
function blockAt(ms){const A=anchors();
  if(ms<=A[0][0])return 0;
  for(let i=1;i<A.length;i++)if(ms<=A[i][0]){const[a,ba]=A[i-1],[b,bb]=A[i];return ba+(bb-ba)*(ms-a)/(b-a);}
  const[l,bl]=A[A.length-1];return bl+(ms-l)/(avgMin()*60000);}
function dateAt(blk){const A=anchors();
  for(let i=1;i<A.length;i++)if(blk<=A[i][1]){const[a,ba]=A[i-1],[b,bb]=A[i];return a+(b-a)*(blk-ba)/(bb-ba);}
  const[l,bl]=A[A.length-1];return l+(blk-bl)*avgMin()*60000;}

/* ---------------- MODEL: everything below is fitted from the data at runtime ---------------- */
let M=null;
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const sdv=a=>{const m=mean(a);return Math.sqrt(a.reduce((x,y)=>x+(y-m)**2,0)/Math.max(1,a.length-1));};
const MO=30.44*DAY;
function ols(from){const xs=[],ys=[];for(const r of S.weekly){if(r.t<from||r.t>nowMs())continue;const h=blockAt(r.t)/HALVING_BLOCKS;if(h<=0)continue;xs.push(Math.log10(h));ys.push(Math.log10(r.c));}
  const n=xs.length,mx=mean(xs),my=mean(ys);let sxy=0,sxx=0;for(let i=0;i<n;i++){sxy+=(xs[i]-mx)*(ys[i]-my);sxx+=(xs[i]-mx)**2;}
  const b=sxy/sxx,a=my-b*mx;let ss=0,st=0;for(let i=0;i<n;i++){ss+=(ys[i]-a-b*xs[i])**2;st+=(ys[i]-my)**2;}
  return{a,b,r2:1-ss/st,n,sd:Math.sqrt(ss/(n-2)),from,to:S.weekly[S.weekly.length-1].t};}
function confirmedRaw(){const bots=evList("bottom"),bot=bots[bots.length-1];if(bot&&bot.status==="confirmed")return true;
  const tops=evList("top"),top=tops[tops.length-1];if(top&&(S.lowT-evT(top))/DAY<MIN_BOT_D)return false;
  const w=lastClosedWeek();return w.c>S.low*CONF&&w.t>monday(S.lowT);}
// cycles (top + lowest bottom after it) derived from the event log – new cycles appear automatically
function cyclesFromEvents(){const by={};
  for(const e of S.events){if(e.type==="halving"||e.status==="broken")continue;const n=e.cycle;(by[n]=by[n]||{n,tops:[],bots:[]})[e.type==="top"?"tops":"bots"].push(e);}
  const out=[];for(const k of Object.keys(by).map(Number).sort((x,y)=>x-y)){const g=by[k];if(!g.tops.length)continue;
    const top=g.tops.reduce((x,y)=>y.p>x.p?y:x),bs=g.bots.filter(b=>evT(b)>evT(top));if(!bs.length)continue;
    const bot=bs.reduce((x,y)=>y.p<x.p?y:x);
    out.push({y:2012+4*(k-1),n:k,top:{t:evT(top),p:top.p,id:top.id},bot:{t:evT(bot),p:bot.p,prov:bot.status!=="confirmed",id:bot.id,confT:bot.confirmedAt?evT({t:bot.confirmedAt}):null}});}
  return out;}
function extIn(a,b,k,max){let r=null;for(const x of S.weekly)if(x.t>=a&&x.t<=b&&(!r||(max?x[k]>r[k]:x[k]<r[k])))r=x;return r;}
function buildModel(){
  const pl=ols(FIT_FROM),pl10=ols(Date.UTC(2010,6,12));
  const tr=(ms,p=pl)=>Math.pow(10,p.a+p.b*Math.log10(Math.max(.05,blockAt(ms)/HALVING_BLOCKS)));
  const hd=n=>dayOf(HALV[n].t),hrs=(ms,n)=>(blockAt(ms)-n*HALVING_BLOCKS)/HALVING_BLOCKS*24;
  const ev=cyclesFromEvents();
  ev.forEach(c=>{for(const e of[c.top,c.bot]){e.h=hrs(e.t,c.n);e.hm=hm(e.h);e.days=Math.round((e.t-hd(c.n))/DAY);}});
  const cyc=ev.filter(c=>c.n>=2),topD=cyc.map(c=>c.top.days),botD=cyc.map(c=>c.bot.days);
  const loo=a=>a.map((x,i)=>Math.abs(x-mean(a.filter((_,j)=>j!==i))));
  const fr=cyc.map(c=>c.bot.p/tr(c.bot.t)),fr10=cyc.map(c=>c.bot.p/tr(c.bot.t,pl10));
  const lad=ev.filter(c=>c.n>=3).map(c=>c.bot.p/ev.find(x=>x.n===c.n-1).top.p);
  // close-based extremes (daily closes, from the weekly high/low of closes)
  const cl=ev.map(c=>({n:c.n,top:extIn(c.top.t-21*DAY,c.top.t+21*DAY,"h",true),bot:extIn(c.bot.t-21*DAY,c.bot.t+21*DAY,"l",false)}));
  const mult=[];for(let i=1;i<ev.length;i++)mult.push({n:ev[i].n,c:cl[i].top.h/cl[i-1].bot.l,i:ev[i].top.p/ev[i-1].bot.p,tc:cl[i].top.h,bc:cl[i-1].bot.l});
  const ksC=[],ksI=[];for(let i=1;i<mult.length;i++){ksC.push(Math.log(mult[i].c)/Math.log(mult[i-1].c));ksI.push(Math.log(mult[i].i)/Math.log(mult[i-1].i));}
  // top before each halving (max close in the 400 days before)
  const pre=[];for(let n=1;n<HALV.length;n++){const H=HALV[n].t,x=extIn(H-400*DAY,H-DAY,"h",true);if(x)pre.push({n,t:x.t,p:x.h,mo:(H-x.t)/MO});}
  // first low (150–260 d after top) and relief rally (max between first low and final low)
  const fl=cyc.map(c=>{const a=extIn(c.top.t+150*DAY,Math.min(c.top.t+260*DAY,c.bot.t-14*DAY),"l",false);if(!a)return null;
    const r=extIn(a.t+7*DAY,c.bot.t-7*DAY,"h",true);const H=HALV[c.n].t;return{n:c.n,lo:a,rel:r,loMo:(a.t-H)/MO,relMo:r?(r.t-H)/MO:null};});
  const rng=a=>[Math.min(...a),Math.max(...a)];
  M={pl,pl10,trend:tr,ev,cyc,topD,botD,topDays:mean(topD),botDays:mean(botD),looTop:loo(topD),looBot:loo(botD),
    topWin:rng(cyc.map(c=>c.top.h)),botWin:rng(cyc.map(c=>c.bot.h)),fr,fr10,floorR:mean(fr),lad,ladder:mean(lad),
    mult,ksC,ksI,kc:mean(ksC),ki:mean(ksI),pre,preRng:rng(pre.map(p=>p.mo)),fl,
    flRng:rng(fl.filter(x=>x&&x.n<ev[ev.length-1].n).map(x=>x.loMo)),relRng:rng(fl.filter(x=>x&&x.rel&&x.n<ev[ev.length-1].n).map(x=>x.relMo)),built:nowMs()};}

const trendH=h=>Math.pow(10,M.pl.a+M.pl.b*Math.log10(h));
const trendAt=ms=>M.trend(ms);
function halvingMs(n){return HALV[n]?HALV[n].t:dateAt(n*HALVING_BLOCKS);}
function lastClosedWeek(){const w=S.weekly;const last=w[w.length-1];return (last.t+7*DAY<=nowMs())?last:w[w.length-2];}
function confirmed(){return confirmedRaw();}
function phaseOf(h,useConf){
  if(h<M.topWin[0])return["rise","var(--or)"];
  if(h<=M.topWin[1])return["top","var(--rd)"];
  if(h<M.botWin[0])return["fall","var(--rd)"];
  if(useConf? !confirmed() && h<20 : h<18)return["bot","var(--gr)"];
  return["rec","var(--gr)"];}
function forecast(){
  const b=curBlock(),n=Math.floor(b/HALVING_BLOCKS)+1,h5=dateAt(n*HALVING_BLOCKS);
  const top=h5+M.topDays*DAY,bot=h5+M.botDays*DAY,last=M.mult[M.mult.length-1];
  const tC=S.low*Math.pow(last.c,M.kc),tI=S.low*Math.pow(last.i,M.ki);
  return{n,h5,top,bot,topLo:Math.min(tC,tI),topHi:Math.max(tC,tI),multI:last.i,multC:last.c,
    botAth:S.ath*M.ladder,botTrend:trendAt(bot)*M.floorR,blocksLeft:n*HALVING_BLOCKS-b,
    preA:h5-M.preRng[1]*MO,preB:h5-M.preRng[0]*MO,topA:h5+Math.min(...M.topD)*DAY,topB:h5+Math.max(...M.topD)*DAY,botA:h5+Math.min(...M.botD)*DAY,botB:h5+Math.max(...M.botD)*DAY};}
const hhmm=ms=>{const d=new Date(ms);return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");};
const badge=(x,src,ms)=>`<span class="bd ${x?"x":"q"}">${x?t("x_badge"):t("q_badge")}${src?" · "+src:""}${ms?" "+hhmm(ms):""}</span>`;


/* ---------------- live data ---------------- */
async function getJSON(u,ms=9000){const c=new AbortController();const id=setTimeout(()=>c.abort(),ms);
  try{const r=await fetch(u,{signal:c.signal,cache:"no-store"});if(!r.ok)throw 0;const ct=r.headers.get("content-type")||"";return ct.includes("json")?r.json():r.text();}finally{clearTimeout(id);}}
async function fetchBlock(){
  for(const[u,src]of[["https://mempool.space/api/blocks/tip/height","mempool.space"],["https://blockstream.info/api/blocks/tip/height","blockstream"]]){
    try{const v=parseInt(await getJSON(u),10);if(v>900000){S.block=v;S.tBlock=nowMs();S.liveB=true;S.srcB=src;return true;}}catch(e){}}
  return false;}
async function fetchPrice(){
  const ok=(p,c,src)=>{S.price=p;S.chg=c;S.liveP=true;S.srcP=src;S.tP=nowMs();return true;};
  try{const j=await getJSON("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true");
    if(j.bitcoin&&j.bitcoin.usd)return ok(j.bitcoin.usd,j.bitcoin.usd_24h_change,"CoinGecko");}catch(e){}
  try{const j=await getJSON("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");if(j.lastPrice)return ok(+j.lastPrice,+j.priceChangePercent,"Binance");}catch(e){}
  try{const j=await getJSON("https://api.coinbase.com/v2/prices/BTC-USD/spot");if(j.data)return ok(+j.data.amount,null,"Coinbase");}catch(e){}
  return false;}
function putWeek(r){const i=S.weekly.findIndex(x=>x.t===r.t);if(i>=0)S.weekly[i]=r;else if(r.t>S.weekly[S.weekly.length-1].t)S.weekly.push(r);}
function weeksFromDaily(days){const m=new Map();for(const[ts,p]of days){const w=monday(ts);const r=m.get(w);if(!r)m.set(w,{t:w,o:p,h:p,l:p,c:p});else{r.h=Math.max(r.h,p);r.l=Math.min(r.l,p);r.c=p;}}
  let prev=null;const out=[...m.values()].sort((a,b)=>a.t-b.t);for(const r of out){if(prev)r.o=prev.c;prev=r;}
  if(out.length&&days.length&&dayOf(Math.min(...days.map(d=>d[0])))!==out[0].t)out.shift(); // drop a partial first week
  return out;}
async function fetchCandles(){ // daily intraday high/low → event detection
  try{const j=await getJSON("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=200");if(Array.isArray(j)&&j.length){S.candles=j.map(k=>({t:k[0],h:+k[2],l:+k[3],c:+k[4]}));S.srcC="Binance";return true;}}catch(e){}
  try{const j=await getJSON("https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400");if(Array.isArray(j)&&j.length){S.candles=j.map(k=>({t:k[0]*1000,h:+k[2],l:+k[1],c:+k[4]})).sort((a,b)=>a.t-b.t);S.srcC="Coinbase";return true;}}catch(e){}
  return false;}
async function fetchWeeks(){ // weekly closes (daily-close based, same basis as the history file)
  let got=false;
  try{const j=await getJSON("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily",12000);
    if(j.prices&&j.prices.length>100){for(const r of weeksFromDaily(j.prices))putWeek(r);got=true;S.srcW="CoinGecko";}}catch(e){}
  const c=await fetchCandles();
  if(!got&&c){for(const r of weeksFromDaily(S.candles.map(x=>[x.t,x.c])))putWeek(r);got=true;S.srcW=S.srcC;}
  if(got)S.tW=nowMs();return got;}


/* ---------------- EVENT ENGINE · the same code runs in the browser (live) and in the GitHub Action (archive) ----------------
   Rules: halving = block n×210,000 (exact block time) · top/bottom = new intraday extreme → "suspected", revised in place
   (old value kept in revisions[]) · top confirmed: weekly close < top × 0.80 · bottom confirmed: weekly close > low × 1.20 */
const TOP_CONF=0.80, NEW_EXT=0.002, CONF2=1.50, MIN_BOT_D=350; // bottom must come ≥ ~11.5 months after the top (history: 12.0–13.4)
const evT=e=>typeof e.t==="number"?e.t:Date.parse(String(e.t).length<=10?e.t+"T00:00:00Z":e.t);
const isoT=ms=>new Date(ms).toISOString().replace(".000Z","Z");
function evList(type){return S.events.filter(e=>e.type===type&&e.status!=="broken").sort((a,b)=>evT(a)-evT(b));}
function cycleOf(ms){return Math.floor(blockAt(ms)/HALVING_BLOCKS);}
function syncFromEvents(){
  const hs=S.events.filter(e=>e.type==="halving").sort((a,b)=>a.n-b.n);
  HALV.length=1;for(const h of hs)HALV.push({b:h.block,t:evT(h)});
  const tops=evList("top"),bots=evList("bottom");
  if(tops.length){const a=tops.reduce((x,y)=>y.p>x.p?y:x);S.ath=a.p;S.athT=evT(a);}
  if(bots.length){const b=bots[bots.length-1];S.low=b.p;S.lowT=evT(b);S.newLow=!!b.local;}}
function detectEvents(cands,o){o=o||{};const N=o.now||nowMs(),E=S.events,ch=[],local=!!o.local;
  const mark=(e,msg)=>{e.updatedAt=isoT(N);if(local)e.local=true;ch.push(msg);};
  const nid=(type,ms)=>{const y=new Date(ms).getUTCFullYear();let id=type+"-"+y,k=2;while(E.some(e=>e.id===id))id=type+"-"+y+"-"+(k++);return id;};
  const revise=(e,t,p,live)=>{(e.revisions=e.revisions||[]).push({t:e.t,p:e.p,until:isoT(N)});
    e.t=live?isoT(t):iso(t);e.p=Math.round(p);e.precision=live?"live":"day";e.cycle=cycleOf(t);mark(e,`${e.type} ${e.id} → ${e.p}`);};
  // 1) halvings – exact block time when available
  const blk=o.block||curBlock();
  for(let n=1;n<=Math.floor(blk/HALVING_BLOCKS);n++)if(!E.some(e=>e.type==="halving"&&e.n===n)){
    const bt=o.halvingTime?o.halvingTime(n):null;
    const e={id:"halving-"+n,type:"halving",n,block:n*HALVING_BLOCKS,t:isoT(bt||dateAt(n*HALVING_BLOCKS)),status:"confirmed",src:bt?"blockchain":"estimate",detectedAt:isoT(N)};
    E.push(e);mark(e,"halving "+n);}
  // 2) extremes from intraday candles + the live price
  const pts=(cands||[]).slice().sort((a,b)=>a.t-b.t);
  if(o.price)pts.push({t:N,h:o.price,l:o.price,c:o.price,live:true});
  for(const x of pts){const tops=evList("top"),bots=evList("bottom"),top=tops[tops.length-1],bot=bots[bots.length-1];
    const tT=top?evT(top):0,bT=bot?evT(bot):0,ath=tops.length?Math.max(...tops.map(e=>e.p)):Infinity;
    if(bT>tT){ // after a bottom
      if(bot.status==="suspected"&&x.t>=dayOf(bT)&&x.l<bot.p*(1-NEW_EXT))revise(bot,x.live?x.t:x.t,x.l,x.live);
      else if(bot.status==="confirmed"&&x.t>=dayOf(bT)&&x.l<bot.p*(1-NEW_EXT)){ // a confirmed low was broken: keep it, mark it, open a new suspected low
        bot.status="broken";bot.brokenAt=x.live?isoT(x.t):iso(x.t);mark(bot,"bottom broken "+bot.p);
        const e={id:nid("bottom",x.t),type:"bottom",cycle:cycleOf(x.t),t:x.live?isoT(x.t):iso(x.t),p:Math.round(x.l),status:"suspected",precision:x.live?"live":"day",detectedAt:isoT(N),revisions:[],replaces:bot.id};E.push(e);mark(e,"new low "+e.p);}
      else if(bot.status==="confirmed"&&x.h>ath*(1+NEW_EXT)){const e={id:nid("top",x.t),type:"top",cycle:cycleOf(x.t),t:x.live?isoT(x.t):iso(x.t),p:Math.round(x.h),status:"suspected",precision:x.live?"live":"day",detectedAt:isoT(N),revisions:[]};E.push(e);mark(e,"new top "+e.p);}
    }else if(top){ // after a top
      if(top.status==="suspected"&&x.t>=dayOf(tT)&&x.h>top.p*(1+NEW_EXT))revise(top,x.t,x.h,x.live);}}
  // 3) confirmations on closed weekly closes
  const wk=S.weekly.filter(w=>w.t+7*DAY<=N);
  {const tops=evList("top"),bots=evList("bottom"),top=tops[tops.length-1],bot=bots[bots.length-1];
   if(top&&top.status==="suspected"){const w=wk.find(w=>w.t>monday(evT(top))&&w.c<top.p*TOP_CONF);
     if(w){top.status="confirmed";top.confirmedAt=iso(w.t+7*DAY);mark(top,"top confirmed");
       let m=null;for(const r of pts)if(r.t>evT(top)&&(!m||r.l<m.l))m=r;for(const r of S.weekly)if(r.t>monday(evT(top))&&(!m||r.l<m.l))m={t:r.t,l:r.l};
       if(m){const e={id:nid("bottom",m.t),type:"bottom",cycle:cycleOf(m.t),t:iso(m.t),p:Math.round(m.l),status:"suspected",precision:"day",detectedAt:isoT(N),revisions:[]};E.push(e);mark(e,"bottom suspected "+e.p);}}}
   const late=bot&&(!top||(evT(bot)-evT(top))/DAY>=MIN_BOT_D);
   if(bot&&late&&bot.status==="suspected"&&(!top||evT(bot)>evT(top))){const w=wk.find(w=>w.t>monday(evT(bot))&&w.c>bot.p*CONF);
     if(w){bot.status="confirmed";bot.stage=1;bot.confirmedAt=iso(w.t+7*DAY);mark(bot,"bottom confirmed (early, ×1.20)");}}
   if(bot&&bot.status==="confirmed"&&bot.stage===1){const w=wk.find(w=>w.t>monday(evT(bot))&&w.c>bot.p*CONF2);
     if(w){bot.stage=2;bot.fullAt=iso(w.t+7*DAY);mark(bot,"bottom confirmed (full, ×1.50)");}}}
  if(ch.length)syncFromEvents();return ch;}

const leftTxt=ms=>{const d=ms/DAY;return d<60?L(`${Math.max(0,Math.round(d))} maalmood`,`${Math.max(0,Math.round(d))} days`):L(`~${Math.round(d/30.44)} bil`,`~${Math.round(d/30.44)} mo`);};
/* ---------------- signals (shared: page + archive) ---------------- */
function signals(){
  const b=curBlock(),n=Math.floor(b/HALVING_BLOCKS),h=(b-n*HALVING_BLOCKS)/HALVING_BLOCKS*24,H=halvingMs(n),days=(nowMs()-H)/DAY;
  const tr=trendAt(nowMs()),fl=tr*M.floorR,fr=S.price/fl,tgt=S.low*CONF,conf=confirmed(),prog=clamp((S.price-S.low)/(tgt-S.low),0,1),lowAge=(nowMs()-S.lowT)/DAY,wc=lastClosedWeek();
  const sig=[
    {name:L("1. Saacadda wareegga","1. Cycle clock"),rule:L(`Daaqadda bottom: ${hm(M.botWin[0])}–${hm(M.botWin[1])}`,`Bottom window: ${hm(M.botWin[0])}–${hm(M.botWin[1])}`),when:hm(h),
      s:h>=M.botWin[0]?"ok":(M.botWin[0]-h<1.5?"near":"wait"),note:h>=M.botWin[0]?L("daaqaddii waa la gaaray","window reached"):L(`${(M.botWin[0]-h).toFixed(1)} saac ka dhiman`,`${(M.botWin[0]-h).toFixed(1)} h to go`)},
    {name:L("2. Waqtiga","2. Timing"),rule:L(`Bottom: halving + ${Math.min(...M.botD)}–${Math.max(...M.botD)} maalmood`,`Bottom: halving + ${Math.min(...M.botD)}–${Math.max(...M.botD)} days`),when:L(`Maalin ${Math.floor(days)}`,`Day ${Math.floor(days)}`),
      s:days>=Math.min(...M.botD)?"ok":(Math.min(...M.botD)-days<90?"near":"wait"),note:days>=Math.min(...M.botD)?L("daaqadda waa la gaaray","window reached"):leftTxt((Math.min(...M.botD)-days)*DAY)},
    {name:L("3. Sagxadda","3. Floor"),rule:L(`Qiimaha ≤ 15% sagxadda (${usd(fl)}) ka sarreeya`,`Price within 15% above the floor (${usd(fl)})`),when:pct((fr-1)*100),
      s:fr<=1.15?"ok":(fr<=1.35?"near":"wait"),note:`${usd(S.price)} ÷ ${usd(fl)}`},
    {name:L("4. Low-gu wuu haystaa","4. The low holds"),rule:L(`Qiimuhu kama hooseeyo ${usd(S.low)} (${dstr(S.lowT)})`,`Price stays above ${usd(S.low)} (${dstr(S.lowT)})`),when:usd(S.low),
      s:S.lowT<=H?"wait":(lowAge>=2?"ok":"near"),note:L(`${Math.floor(lowAge)} maalmood ka hor`,`${Math.floor(lowAge)} days ago`)},
    {name:L("5. Xaqiijin","5. Confirmation"),rule:L(`Weekly close > Low × ${CONF.toFixed(2)} = ${usd(tgt)}`,`Weekly close > Low × ${CONF.toFixed(2)} = ${usd(tgt)}`),when:conf?"✔":L("Sugid","Waiting"),
      s:conf?"ok":(prog>=0.5?"near":"wait"),note:L(`weekly close ${usd(wc.c)} · ${Math.round(prog*100)}% jidka`,`weekly close ${usd(wc.c)} · ${Math.round(prog*100)}% of the way`),prog:conf?null:prog,left:conf?"":L(`${usd(Math.max(0,tgt-S.price))} ka dhiman`,`${usd(Math.max(0,tgt-S.price))} to go`)}];
  return{sig,score:sig.filter(x=>x.s==="ok").length,h,days,fl,tgt,conf,prog,wc};}
function historyRow(){const b=curBlock(),n=Math.floor(b/HALVING_BLOCKS),h=(b-n*HALVING_BLOCKS)/HALVING_BLOCKS*24,F=forecast(),sg=signals();
  return{date:iso(nowMs()),updated_utc:isoT(nowMs()),block:b,price:Math.round(S.price),clock:hm(h),phase:phaseOf(h,true)[0],signal:sg.score+"/5",
    halving_next:iso(F.h5),top_next:iso(F.top),bottom_next:iso(F.bot),top_lo:Math.round(F.topLo),top_hi:Math.round(F.topHi),
    bottom_lo:Math.round(Math.min(F.botAth,F.botTrend)),bottom_hi:Math.round(Math.max(F.botAth,F.botTrend)),ath:S.ath,low:S.low,
    a:+M.pl.a.toFixed(4),b:+M.pl.b.toFixed(4),r2:+M.pl.r2.toFixed(4),rho:+M.floorR.toFixed(4),k:+M.kc.toFixed(4),top_days:+M.topDays.toFixed(1),bottom_days:+M.botDays.toFixed(1)};}

syncFromEvents();
