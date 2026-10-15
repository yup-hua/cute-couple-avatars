const gallery=document.querySelector('#gallery');
const filters=document.querySelector('#filters');
const search=document.querySelector('#search');
const count=document.querySelector('#result-count');
const modal=document.querySelector('#lightbox');
let all=[],active='all';
const labels={'01_一二布布':'一二布布','02_软萌卡通':'软萌卡通','03_猫狗卡通':'猫狗卡通','04_狐兔搭档':'狐兔搭档','05_真实萌宠':'真实萌宠','06_手绘单人':'手绘单人'};
function element(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function show(item){
 document.querySelector('#modal-id').textContent=item.id;
 document.querySelector('#modal-title').textContent=item.name;
 const holder=document.querySelector('#modal-images');holder.replaceChildren();holder.classList.toggle('single',item.images.length===1);
 item.images.forEach(im=>{const box=element('div','full-image');const img=element('img');img.src=im.src;img.alt=item.name+' 头像'+im.side;box.append(img);const save=element('a','save','保存头像'+im.side);save.href=im.src;save.download=`${item.id}-${im.side}.${im.src.split('.').pop()}`;box.append(save);holder.append(box);});
 const source=document.querySelector('#modal-source');source.href=item.source;
 if(!modal.open)modal.showModal();
}
function render(){
 const q=search.value.trim().toLowerCase();
 const selected=all.filter(i=>(active==='all'||i.category===active)&&(!q||(i.id+' '+i.name+' '+labels[i.category]).toLowerCase().includes(q)));
 gallery.replaceChildren();
 selected.forEach(item=>{const card=element('article');const pair=element('div','pair'+(item.images.length===1?' single':''));item.images.forEach(im=>{const button=element('button','avatar');button.type='button';button.setAttribute('aria-label',`放大 ${item.id} ${item.name} 头像${im.side}`);const img=element('img');img.src=im.src;img.alt=item.name+' 头像'+im.side;img.loading='lazy';img.decoding='async';button.append(img,element('span','badge',im.side));button.addEventListener('click',()=>show(item));pair.append(button);});const meta=element('div','card-meta');meta.append(element('h2','',item.name),element('span','number',item.id));card.append(pair,meta,element('div','card-sub',labels[item.category]+(item.images.length===2?' · 一人一张':' · 单人头像')));gallery.append(card);});
 const pairs=selected.filter(i=>i.images.length===2).length;const singles=selected.length-pairs;
 count.textContent=[pairs?pairs+' 对情头':'',singles?singles+' 张单人':''].filter(Boolean).join(' / ')||'没有匹配结果';
 document.querySelector('#empty').hidden=selected.length>0;
}
function initFilters(){
 for(const [key,label] of [['all','全部'],...Object.entries(labels)]){const b=element('button',key===active?'active':'',label);b.type='button';b.setAttribute('aria-pressed',String(key===active));b.addEventListener('click',()=>{active=key;for(const x of filters.children){const chosen=x===b;x.classList.toggle('active',chosen);x.setAttribute('aria-pressed',String(chosen));}render();});filters.append(b);}
}
document.querySelector('#close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();});
search.addEventListener('input',render);
fetch('avatars.json').then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{all=data;initFilters();render();}).catch(()=>{count.textContent='图片暂时没加载出来';gallery.textContent='请刷新页面，再试一次。';});
