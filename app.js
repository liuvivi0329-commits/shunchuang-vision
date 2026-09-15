const heroVideo=document.querySelector('#hero-video');
const heroStage=document.querySelector('.hero-video-stage');
const heroPlay=document.querySelector('#hero-play');
heroVideo.addEventListener('playing',()=>{heroStage.classList.add('video-started');heroPlay.hidden=true;document.querySelector('#hero-video-error').hidden=true});
heroVideo.addEventListener('error',()=>{heroStage.classList.add('video-started');heroPlay.hidden=true;document.querySelector('#hero-video-error').hidden=false});
heroVideo.querySelector('source').addEventListener('error',()=>{heroStage.classList.add('video-started');document.querySelector('#hero-video-error').hidden=false});
function playHero(){heroVideo.muted=true;const attempt=heroVideo.play();if(attempt)attempt.catch(()=>{heroPlay.hidden=false})}
heroPlay.addEventListener('click',playHero);
playHero();
const conferenceError=document.querySelector('#conference-error');
const conferenceClips=[
  {
    "src": "assets/cooperation/1.mp4",
    "title": "新华社&26年中国-中东欧国家创新合作大会"
  },
  {
    "src": "assets/cooperation/3.mp4",
    "title": "苏晓&百度盛典"
  },
  {
    "src": "assets/cooperation/tiktok.mp4",
    "title": "瞬创科技&Tiktok"
  },
  {
    "src": "assets/cooperation/2.mp4",
    "title": "瞬创科技&CCTV6佳片有约合作短片"
  },
  {
    "src": "assets/cooperation/4.mp4",
    "title": "新华社&AI文博系列"
  }
];
const swipeArea=document.querySelector('#conference-swipe');
swipeArea.replaceChildren();
let conferenceIndex=0,conferenceVisible=false,conferenceTimer;
const conferenceSlides=conferenceClips.map((clip,index)=>{
 const slide=document.createElement('div');slide.className='conference-slide';
 const video=document.createElement('video');video.src=clip.src;video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',clip.title);
 video.addEventListener('loadedmetadata',()=>{if(index!==conferenceIndex&&video.duration>1)video.currentTime=.5});
 video.addEventListener('error',()=>{if(index===conferenceIndex)conferenceError.hidden=false});
 const button=document.createElement('button');button.type='button';button.className='conference-preview';button.setAttribute('aria-label','播放：'+clip.title);
 const label=document.createElement('span');label.textContent=clip.title;button.append(label);
 button.addEventListener('click',()=>showConference(index));
 slide.append(video,button);swipeArea.append(slide);return {slide,video,button};
});
function playConference(){const video=conferenceSlides[conferenceIndex].video;video.play().catch(()=>{/* Native controls remain available. */});}
function showConference(index,initial=false){
 clearTimeout(conferenceTimer);conferenceIndex=(index+conferenceClips.length)%conferenceClips.length;conferenceError.hidden=true;
 conferenceSlides.forEach(({slide,video,button},i)=>{
  const active=i===conferenceIndex;video.pause();video.controls=active;video.tabIndex=active?0:-1;button.hidden=active;
  const offset=(i-conferenceIndex+conferenceClips.length)%conferenceClips.length;
  const visible=active||offset===1||offset===conferenceClips.length-1;
  slide.dataset.position=active?'center':offset===1?'right':offset===conferenceClips.length-1?'left':'offstage';
  slide.inert=!visible;slide.setAttribute('aria-hidden',String(!visible));
 });
 document.querySelector('#conference-subtitle').textContent=conferenceClips[conferenceIndex].title;
 document.querySelectorAll('[data-conference]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===conferenceIndex)));
 if(!initial)conferenceTimer=setTimeout(()=>{if(conferenceVisible)playConference()},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:450);
}
document.querySelector('#conference-prev').addEventListener('click',()=>showConference(conferenceIndex-1));
document.querySelector('#conference-next').addEventListener('click',()=>showConference(conferenceIndex+1));
document.querySelectorAll('[data-conference]').forEach(button=>button.addEventListener('click',()=>showConference(Number(button.dataset.conference))));
let swipeStart=null;
swipeArea.addEventListener('pointerdown',event=>{
 if(event.target.closest('button')||event.button!==0)return;
 const rect=event.target.getBoundingClientRect();if(event.clientY>rect.bottom-56)return;
 swipeStart={x:event.clientX,y:event.clientY,id:event.pointerId};
});
window.addEventListener('pointerup',event=>{
 if(!swipeStart||event.pointerId!==swipeStart.id)return;
 const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;swipeStart=null;
 if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)showConference(conferenceIndex+(dx>0?1:-1));
});
window.addEventListener('pointercancel',()=>{swipeStart=null});
showConference(0,true);
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{conferenceVisible=entry.isIntersecting;if(conferenceVisible)playConference();else conferenceSlides.forEach(({video})=>video.pause())}),{threshold:.35});observer.observe(swipeArea);
}else{conferenceVisible=true;playConference()}
const selectedRow=document.querySelector('.selected-video-row');
function scrollSelected(direction){const card=selectedRow.querySelector('.selected-video-card');const gap=parseFloat(getComputedStyle(selectedRow).gap)||0;selectedRow.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
document.querySelector('#selected-prev').addEventListener('click',()=>scrollSelected(-1));
document.querySelector('#selected-next').addEventListener('click',()=>scrollSelected(1));
selectedRow.addEventListener('keydown',event=>{if(event.target!==selectedRow)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();scrollSelected(event.key==='ArrowLeft'?-1:1)}});
document.querySelectorAll('.selected-video-card video').forEach(video=>video.addEventListener('play',()=>{document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()})}));
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelectorAll('.ip-card').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.type!==button.dataset.filter)}));
const profiles={suxiao:{name:'苏晓',tag:'FLAGSHIP IP / 全能虚拟艺人',image:'suwan',description:'21 岁，INFJ，来自杭州西湖。唱歌、演戏、主持、代言，多面表达，自由生长。原创音乐已登陆酷狗、QQ 音乐、网易云等平台，与苏晞、NANA 共同构成充满情感连接的数字 IP 阵容。'},ayu:{name:'阿瑜',tag:'VIRTUAL ACTOR / 古风虚拟演员',image:'ali',description:'一眼记住的长相，跟谁都搭的气质。以超写实古风形象演绎不同故事，首部主演短剧《蛇宫旧梦》在红果突破 4000 万热度，另有 10 部以上待播剧集储备。'},nana:{name:'猩猩 NANA',tag:'MUSIC CREATOR / 潮流音乐制作人',image:'nana',description:'苏晓的好友兼音乐制作人。精通各类乐器，也会脱口秀，并拥有自己的 NANA 电台。用鲜明个性与幽默表达，让每一次创作都有不同的声音。'},suxi:{name:'苏晞',tag:'VIRTUAL IDOL / 新生代虚拟偶像',image:'sujin',description:'苏晓的妹妹，以演唱与音乐表达构建自己的数字舞台。与苏晓、猩猩 NANA 在《造梦次元》中同台，探索跨越时空的沉浸式演出。'}};
const ipDialog=document.querySelector('#ip-dialog');
const videoWorks=[{title:'夏日记录',file:'summer.mp4',note:'8月17日'},{title:'高尔夫 Vlog',file:'golf.mp4',note:'挥杆之间，发现生活的另一面'},{title:'攀岩 Vlog',file:'climbing.mp4',note:'向上一步，探索新的可能'}];
const videoSection=document.createElement('section');videoSection.className='profile-videos';videoSection.hidden=true;
videoSection.innerHTML='<div class="profile-video-heading"><div><p class="eyebrow">SU XIAO / VIDEO DIARY</p><h3>镜头里的苏晓</h3></div><span>03 FILMS</span></div><div class="profile-video-grid"></div>';
ipDialog.append(videoSection);
const videoGrid=videoSection.querySelector('.profile-video-grid');
videoWorks.forEach((work,index)=>{const article=document.createElement('article');article.className='profile-video-card';const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='none';video.dataset.src=`assets/suxiao/${work.file}`;video.setAttribute('aria-label',work.title);const fallback=document.createElement('a');fallback.href=video.dataset.src;fallback.textContent='打开视频';video.append(fallback);const title=document.createElement('h4');title.textContent=`0${index+1} / ${work.title}`;const note=document.createElement('p');note.textContent=work.note;const error=document.createElement('p');error.className='video-error';error.hidden=true;error.textContent='视频暂时无法播放，请检查文件是否完整，或使用支持 MP4 的浏览器。';video.addEventListener('error',()=>{error.hidden=false});video.addEventListener('play',()=>videoGrid.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()}));article.append(video,title,note,error);videoGrid.append(article)});
document.querySelectorAll('[data-ip]').forEach(card=>card.addEventListener('click',()=>{const p=profiles[card.dataset.ip],isSuxiao=card.dataset.ip==='suxiao';document.querySelector('#detail-name').textContent=p.name;document.querySelector('#detail-tag').textContent=p.tag;document.querySelector('#detail-description').textContent=p.description;const img=document.querySelector('#detail-image');img.src=card.dataset.ip==='ayu'?'assets/ayu.png':`assets/${p.image}.webp`;img.alt=p.name;ipDialog.classList.toggle('suxiao-profile',isSuxiao);videoSection.hidden=!isSuxiao;if(isSuxiao)videoGrid.querySelectorAll('video').forEach(video=>{if(!video.hasAttribute('src'))video.src=video.dataset.src});ipDialog.showModal();ipDialog.scrollTop=0;if(card.dataset.showWorks)requestAnimationFrame(()=>{ipDialog.scrollTop=videoSection.offsetTop});document.body.classList.add('profile-open')}));
ipDialog.addEventListener('close',()=>{videoGrid.querySelectorAll('video').forEach(video=>{video.pause();if(video.readyState>0)video.currentTime=0});document.body.classList.remove('profile-open')});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}})});
document.querySelector('#cooperate').addEventListener('click',()=>document.querySelector('#contact-dialog').showModal());
document.querySelector('#brief-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#brief-output').textContent=`瞬创视界 · 合作需求简报\n\n合作方向：${document.querySelector('#direction').value}\n需求描述：${document.querySelector('#brief').value.trim()}`;document.querySelector('#brief-result').hidden=false;document.querySelector('#copy-status').textContent='简报已生成，可复制后通过商务渠道沟通。'});
document.querySelector('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#brief-output').textContent);document.querySelector('#copy-status').textContent='已复制简报。'}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('#brief-output'));selection.removeAllRanges();selection.addRange(range);document.querySelector('#copy-status').textContent='请按 Ctrl+C（手机长按）复制选中的简报。'}});

const ipSlider=document.querySelector('.showcase-grid');
function moveIp(direction){const step=ipSlider.querySelector('.ip-grid-page').getBoundingClientRect().width+(parseFloat(getComputedStyle(ipSlider).gap)||0);ipSlider.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
document.querySelector('#ip-prev').addEventListener('click',()=>moveIp(-1));document.querySelector('#ip-next').addEventListener('click',()=>moveIp(1));
ipSlider.addEventListener('keydown',event=>{if(event.target!==ipSlider)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveIp(event.key==='ArrowLeft'?-1:1)}});
