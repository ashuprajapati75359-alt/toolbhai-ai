const $ = id => document.getElementById(id);
const fmtINR = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);

function calcAge(){
  const v=$('dob').value;if(!v)return $('ageResult').textContent='Please select a date.';
  const b=new Date(v),t=new Date(); if(b>t)return $('ageResult').textContent='Date of birth cannot be in the future.';
  let y=t.getFullYear()-b.getFullYear(),m=t.getMonth()-b.getMonth(),d=t.getDate()-b.getDate();
  if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate()} if(m<0){y--;m+=12}
  $('ageResult').textContent=`${y} years, ${m} months, ${d} days`;
}
function calcEMI(){
  const P=+$('loan').value,R=+$('rate').value/1200,N=+$('months').value;
  if(!(P>0&&N>0)||R<0)return $('emiResult').textContent='Enter valid values.';
  const emi=R===0?P/N:P*R*Math.pow(1+R,N)/(Math.pow(1+R,N)-1);
  $('emiResult').textContent=`Monthly EMI: ${fmtINR(emi)} • Total: ${fmtINR(emi*N)}`;
}
function calcGST(){
  const a=+$('gstAmount').value,r=+$('gstRate').value/100,mode=$('gstMode').value;
  if(!(a>=0))return $('gstResult').textContent='Enter a valid amount.';
  if(mode==='add'){const tax=a*r;$('gstResult').textContent=`GST: ${fmtINR(tax)} • Total: ${fmtINR(a+tax)}`}
  else{const base=a/(1+r),tax=a-base;$('gstResult').textContent=`Base: ${fmtINR(base)} • GST: ${fmtINR(tax)}`}
}
function calcPercent(){
  const p=+$('pct').value,n=+$('pctNum').value;
  if(Number.isNaN(p)||Number.isNaN(n))return $('pctResult').textContent='Enter valid values.';
  $('pctResult').textContent=`${p}% of ${n} = ${(p*n/100).toLocaleString('en-IN')}`;
}
$('wordText').addEventListener('input',e=>{
  const s=e.target.value.trim(),w=s? s.split(/\s+/).length:0;
  $('wordResult').textContent=`${w} words • ${e.target.value.length} characters`;
});

function loadImage(file){
  return new Promise((resolve,reject)=>{
    const img=new Image(); const u=URL.createObjectURL(file);
    img.onload=()=>{URL.revokeObjectURL(u);resolve(img)};img.onerror=reject;img.src=u;
  });
}
function downloadBlob(blob,name){
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
}
async function compressImage(){
  const f=$('compressInput').files[0]; if(!f)return $('compressResult').textContent='Choose an image first.';
  const img=await loadImage(f),c=$('workCanvas'),ctx=c.getContext('2d');c.width=img.width;c.height=img.height;ctx.drawImage(img,0,0);
  c.toBlob(blob=>{ if(!blob)return; downloadBlob(blob,'toolbhai-compressed.jpg');
    const save=Math.max(0,100-(blob.size/f.size*100));$('compressResult').textContent=`Done: ${(blob.size/1024).toFixed(1)} KB • ~${save.toFixed(0)}% smaller`;
  },'image/jpeg',+$('quality').value);
}
async function resizeImage(){
  const f=$('resizeInput').files[0],w=+$('resizeW').value,h=+$('resizeH').value;
  if(!f||!(w>0&&h>0))return $('resizeResult').textContent='Choose an image and enter width + height.';
  const img=await loadImage(f),c=$('workCanvas'),ctx=c.getContext('2d');c.width=w;c.height=h;ctx.clearRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
  c.toBlob(blob=>{downloadBlob(blob,'toolbhai-resized.png');$('resizeResult').textContent=`Done: ${w}×${h}px`},'image/png');
}
function makeQR(){
  const t=$('qrText').value.trim();if(!t)return $('qrWrap').textContent='Enter text or a link.';
  const url='https://quickchart.io/qr?size=220&text='+encodeURIComponent(t);
  $('qrWrap').innerHTML=`<img alt="Generated QR code" src="${url}">`;
}
function makePrompt(){
  const task=$('promptTask').value.trim(),tone=$('promptTone').value;
  if(!task)return $('promptResult').textContent='Enter your task first.';
  $('promptResult').textContent=`Act as an expert assistant. Your task: ${task}. Use a ${tone.toLowerCase()} tone. Give a clear, accurate answer with practical steps, examples where useful, and avoid unnecessary filler. Ask one concise clarifying question only if essential information is missing.`;
}
function makeTitles(){
  const t=$('ytTopic').value.trim();if(!t)return $('ytResult').textContent='Enter a video topic first.';
  const arr=[`${t}: The Complete Beginner Guide`,`7 Things You Must Know About ${t}`,`I Tried ${t} — Here’s What Happened`,`${t} Explained in 10 Minutes`,`Stop Making These ${t} Mistakes`];
  $('ytResult').textContent=arr.map((x,i)=>`${i+1}. ${x}`).join('\n');
}
function makeCaption(){
  const t=$('captionTopic').value.trim(),m=$('captionMood').value;if(!t)return $('captionResult').textContent='Enter a post topic first.';
  const bank={
    Cool:`${t} — simple moments, solid vibes. ✨ #GoodVibes #DailyLife`,
    Funny:`POV: ${t} was supposed to be easy 😂 #Mood #Relatable`,
    Motivational:`Small steps, big change. Today’s focus: ${t}. Keep going. 💪 #Motivation #Growth`,
    Simple:`${t}. That’s the post. 🙂 #Simple #Life`
  };$('captionResult').textContent=bank[m];
}

const translations={
  hi:{
    navTools:'टूल्स',navWhy:'क्यों ToolBhai',eyebrow:'फ्री • तेज़ • मोबाइल फ्रेंडली',heroTitle:'हर दिन के काम के लिए स्मार्ट टूल्स।',
    heroCopy:'कैलकुलेटर, इमेज टूल्स, टेक्स्ट टूल्स और स्मार्ट कंटेंट जनरेटर — एक ही आसान Hindi + English वेबसाइट पर।',
    explore:'टूल्स देखें',learnMore:'और जानें',noSignup:'साइनअप नहीं',worksPhone:'फोन पर काम करता है',freeTools:'फ्री टूल्स',
    workingTools:'वर्किंग टूल्स',languages:'भाषाएँ',apiCost:'MVP API लागत',heroNote:'Low-cost MVP: GitHub Pages, Netlify या Cloudflare Pages पर होस्ट कर सकते हैं।',
    allInOne:'ऑल-इन-वन टूलकिट',popularTools:'लोकप्रिय टूल्स',ageCalc:'उम्र कैलकुलेटर',ageDesc:'जन्म तारीख से सही उम्र निकालें।',dob:'जन्म तारीख',
    calculate:'कैलकुलेट',emiCalc:'EMI कैलकुलेटर',emiDesc:'मासिक लोन EMI का अनुमान लगाएँ।',gstDesc:'GST जोड़ें या हटाएँ।',
    percentCalc:'प्रतिशत कैलकुलेटर',percentDesc:'किसी नंबर का X% निकालें।',wordCounter:'वर्ड काउंटर',wordDesc:'शब्द और कैरेक्टर तुरंत गिनें।',
    compressor:'इमेज कंप्रेसर',compressDesc:'JPG/PNG को ब्राउज़र में कंप्रेस करें।',compress:'कंप्रेस',resizer:'इमेज रिसाइज़र',resizeDesc:'इमेज को अपनी साइज में बदलें।',resize:'रिसाइज़',
    qrGen:'QR कोड जनरेटर',qrDesc:'किसी भी लिंक या टेक्स्ट से QR बनाएँ।',generate:'जनरेट',promptGen:'AI प्रॉम्प्ट जनरेटर',promptDesc:'रफ आइडिया को बेहतर प्रॉम्प्ट में बदलें।',
    ytTitle:'YouTube टाइटल जनरेटर',ytDesc:'बिना API के आकर्षक टाइटल आइडिया पाएँ।',captionGen:'कैप्शन जनरेटर',captionDesc:'सोशल पोस्ट के लिए कैप्शन आइडिया बनाएँ।',
    builtForGrowth:'ग्रोथ के लिए बनाया गया',whyTitle:'ToolBhai AI क्यों?',fast:'तेज़',fastDesc:'ज़्यादातर टूल्स सीधे ब्राउज़र में चलते हैं।',privacy:'प्राइवेसी फ्रेंडली',
    privacyDesc:'सपोर्टेड इमेज टूल्स में प्रोसेसिंग लोकल होती है।',mobile:'मोबाइल-फर्स्ट',mobileDesc:'भारतीय मोबाइल यूज़र्स को ध्यान में रखकर बनाया गया।',
    bilingual:'दो भाषाएँ',bilingualDesc:'Hindi + English इंटरफेस सपोर्ट।',aboutTitle:'ToolBhai AI के बारे में',aboutText:'ToolBhai AI रोज़मर्रा के यूज़र्स के लिए फ्री ऑनलाइन टूल्स की वेबसाइट है। यह स्टार्टर वर्ज़न हल्का, मोबाइल-फ्रेंडली और आगे नए टूल्स, आर्टिकल्स व कमाई के फीचर्स जोड़ने के लिए आसान है।',
    aiNote:'नोट: अभी के “smart/AI” generators template-based हैं और किसी paid AI API को कॉल नहीं करते। बाद में real AI API जोड़ी जा सकती है।',
    faqTitle:'आम सवाल',faq1q:'क्या ToolBhai AI फ्री है?',faq1a:'हाँ। यह MVP फ्री browser-based tools इस्तेमाल करता है।',faq2q:'क्या बाद में AdSense जोड़ सकते हैं?',faq2a:'हाँ, original content, policy pages और useful tools जोड़ने के बाद approval के लिए apply कर सकते हैं।',faq3q:'क्या real AI connect कर सकते हैं?',faq3a:'हाँ। बाद में backend के जरिए OpenAI या किसी अन्य AI provider को जोड़ा जा सकता है।'
  }
};
let lang='en';
$('langToggle').addEventListener('click',()=>{
  lang=lang==='en'?'hi':'en';
  $('langToggle').textContent=lang==='en'?'हिंदी':'English';
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;if(!el.dataset.en)el.dataset.en=el.textContent;
    el.textContent=lang==='hi'?(translations.hi[key]||el.dataset.en):el.dataset.en;
  });
});
$('toolSearch').addEventListener('input',filterTools);
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');filterTools();
}));
function filterTools(){
  const q=$('toolSearch').value.toLowerCase().trim(),f=document.querySelector('.chip.active').dataset.filter;
  document.querySelectorAll('.tool-card').forEach(card=>{
    const okCat=f==='all'||card.dataset.category===f,okQ=!q||(card.dataset.name+' '+card.textContent.toLowerCase()).includes(q);
    card.classList.toggle('hidden',!(okCat&&okQ));
  });
}
$('year').textContent=new Date().getFullYear();
