const whatsappNumber = "2348012345678";
const currency = new Intl.NumberFormat("en-NG");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const collections = [
  ["Necklaces","Necklaces"],["Bracelets","Bracelets"],["Rings","Rings"],["Earrings","Earrings"],
  ["Anklets","Anklets"],["Chains","Chains"],["Pendants","Pendants"],["Charms","Charms"],
  ["Bangles","Bangles"],["Watches","Watches"],["Shades","Shades"],["Brooches","Brooches"],
  ["Hair Jewelry","Hair Accessories"],["Toe Rings","Toe Rings"],["Body Jewelry","Body Jewelry"],["Cufflinks","Cufflinks"],
  ["Pearls","Pearls"],["Crystal Jewelry","Crystals"],["Birthstone Pieces","Birthstones"],["Bridal Jewelry","Bridal"],
  ["Statement Pieces","Statement"],["Layering Sets","Layering Sets"],["Jewelry Gift Sets","Gift Sets"],["Luxury Accessories","Luxury"]
];
let cart = JSON.parse(localStorage.getItem("lumiCart")) || [];

function makeProduct(id,name,category,variant=0){
  const prices=[12500,18500,24000,32000,42000,56000,68000,89000];
  return {id,name,category,price:prices[(id+variant)%prices.length]};
}

function productCard(product){
  return `<article class="product-card" data-product-id="${product.id}"><div class="product-media"><div class="media-placeholder"><i class="bi bi-gem"></i><small>YOUR PHOTO</small></div></div><div class="product-body"><div class="product-meta">${product.category.toUpperCase()}</div><div class="product-title">${product.name}</div><div class="d-flex align-items-center justify-content-between gap-2 mt-3"><span class="product-price">₦${currency.format(product.price)}</span><button class="add-btn" data-add-id="${product.id}"><i class="bi bi-plus-lg"></i> Add</button></div></div></article>`;
}

const featured = [makeProduct(101,"Lumi Halo Necklace","Best Seller",1),makeProduct(102,"Pink Crystal Cuff","Trending",2),makeProduct(103,"Rosé Star Earrings","New Drop",3)];

function allProducts(){
  const all=[...featured];
  collections.forEach((item,index)=>{const [title,chip]=item;all.push(makeProduct(index*3+1,`Lumi ${title} — Classic`,chip,1),makeProduct(index*3+2,`Lumi ${title} — Blush`,chip,2),makeProduct(index*3+3,`Lumi ${title} — Signature`,chip,3));});
  return all;
}

const sections=document.getElementById("collectionSections");
collections.forEach((item,index)=>{
  const [title,chip]=item;
  const products=[makeProduct(index*3+1,`Lumi ${title} — Classic`,chip,1),makeProduct(index*3+2,`Lumi ${title} — Blush`,chip,2),makeProduct(index*3+3,`Lumi ${title} — Signature`,chip,3)];
  const section=document.createElement("section");
  section.className="collection-section reveal-up";
  section.id=`collection-${index+1}`;
  section.innerHTML=`<div class="collection-top"><div><span class="collection-number">${String(index+1).padStart(2,"0")}</span><h3>${title}</h3><div class="collection-chip">${chip}</div></div><div class="text-end"><span class="eyebrow">LUMI EDIT</span></div></div><div class="product-rail">${products.map(productCard).join("")}</div>`;
  sections.appendChild(section);
});

document.getElementById("year").textContent=new Date().getFullYear();

function saveCart(){localStorage.setItem("lumiCart",JSON.stringify(cart));updateCart();}
function getCartTarget(){
  const mobile=document.getElementById("mobileCartButton");
  const desktop=document.querySelector(".nav-cart");
  if(window.innerWidth<=991.98 && mobile) return mobile;
  return desktop || mobile;
}
function pulseCartTarget(target){
  if(!target || prefersReducedMotion)return;
  target.classList.remove("cart-target-pulse");
  void target.offsetWidth;
  target.classList.add("cart-target-pulse");
  target.addEventListener("animationend",()=>target.classList.remove("cart-target-pulse"),{once:true});
}
function createFlySparks(startX,startY,endX,endY){
  if(prefersReducedMotion)return;
  const count=7;
  for(let i=0;i<count;i++){
    const dot=document.createElement("span");
    dot.className="fly-cart-spark";
    dot.style.left=`${startX + (Math.random()*18-9)}px`;
    dot.style.top=`${startY + (Math.random()*18-9)}px`;
    const spreadX=(endX-startX)*(.2+Math.random()*.6);
    const spreadY=(endY-startY)*(.2+Math.random()*.6);
    dot.style.setProperty("--dx",`${spreadX + (Math.random()*70-35)}px`);
    dot.style.setProperty("--dy",`${spreadY + (Math.random()*70-35)}px`);
    document.body.appendChild(dot);
    dot.addEventListener("animationend",()=>dot.remove(),{once:true});
  }
}
function flyItemToCart(productId){
  if(prefersReducedMotion)return;
  const card=document.querySelector(`[data-product-id="${productId}"]`);
  const target=getCartTarget();
  if(!card || !target)return;
  const media=card.querySelector(".product-media");
  const from=media?.getBoundingClientRect() || card.getBoundingClientRect();
  const to=target.getBoundingClientRect();
  const size=Math.min(Math.max(from.width*.46,72),150);
  const startX=from.left+from.width/2-size/2;
  const startY=from.top+from.height/2-size/2;
  const endX=to.left+to.width/2-size/2;
  const endY=to.top+to.height/2-size/2;
  const ghost=document.createElement("div");
  ghost.className="fly-cart-ghost";
  ghost.style.width=`${size}px`;ghost.style.height=`${size}px`;
  ghost.style.transform=`translate3d(${startX}px,${startY}px,0) scale(1) rotate(0deg)`;
  ghost.innerHTML=`<div class="ghost-inner"><i class="bi bi-gem"></i></div>`;
  document.body.appendChild(ghost);
  createFlySparks(from.left+from.width*.55,from.top+from.height*.48,endX+size*.5,endY+size*.5);
  const midX=(startX+endX)/2 + (window.innerWidth<700 ? 0 : (Math.random()>0.5?45:-45));
  const midY=(startY+endY)/2 - Math.min(120,window.innerHeight*.12);
  const duration=Math.max(650,Math.min(1000,window.innerWidth<600?780:900));
  const animation=ghost.animate([
    {transform:`translate3d(${startX}px,${startY}px,0) scale(1) rotate(0deg)`,opacity:1,filter:"blur(0px)"},
    {transform:`translate3d(${midX}px,${midY}px,0) scale(.78) rotate(${window.innerWidth<600?8:-10}deg)`,opacity:.98,offset:.56},
    {transform:`translate3d(${endX}px,${endY}px,0) scale(.16) rotate(${window.innerWidth<600?18:-18}deg)`,opacity:.08,filter:"blur(1px)"}
  ],{duration,easing:"cubic-bezier(.22,.75,.2,1)",fill:"forwards"});
  animation.finished.then(()=>{ghost.remove();pulseCartTarget(target);});
}
function animateAdded(productId){
  const card=document.querySelector(`[data-product-id="${productId}"]`);
  if(card && !prefersReducedMotion){
    card.animate([{transform:"translateZ(0) scale(1)"},{transform:"translateZ(0) scale(1.045) rotate(-.7deg)"},{transform:"translateZ(0) scale(1)"}],{duration:650,easing:"cubic-bezier(.2,.8,.2,1)"});
    card.classList.remove("added-flash");
    void card.offsetWidth;
    card.classList.add("added-flash");
    setTimeout(()=>card.classList.remove("added-flash"),700);
  }
  flyItemToCart(productId);
}
function addToCart(id){
  const p=allProducts().find(x=>x.id===id);if(!p)return;
  const existing=cart.find(x=>x.id===id);existing?existing.quantity++:cart.push({...p,quantity:1});
  saveCart();showToast(`${p.name} added to your Lumi bag ✨`);animateAdded(id);
}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.quantity+=delta;if(item.quantity<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function updateCart(){
  const count=cart.reduce((sum,i)=>sum+i.quantity,0);
  document.getElementById("cartCount").textContent=count;
  const mobileCount=document.getElementById("mobileCartCount");
  if(mobileCount)mobileCount.textContent=count;
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML=`<div class="empty-cart"><i class="bi bi-bag-heart"></i><h5 class="mt-3">Your bag is waiting.</h5><p>Add something beautiful and it will appear here.</p></div>`;document.getElementById("cartTotal").textContent="₦0";return;}
  box.innerHTML=cart.map(item=>`<div class="cart-item"><div class="cart-thumb"><i class="bi bi-gem"></i></div><div class="cart-info"><strong>${item.name}</strong><span>${item.category} • ₦${currency.format(item.price)} each</span><div class="qty"><button data-qty-id="${item.id}" data-delta="-1">−</button><b>${item.quantity}</b><button data-qty-id="${item.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove-id="${item.id}" aria-label="Remove item"><i class="bi bi-trash3"></i></button></div>`).join("");
  const total=cart.reduce((sum,i)=>sum+i.price*i.quantity,0);document.getElementById("cartTotal").textContent=`₦${currency.format(total)}`;
}
function showToast(text){document.getElementById("toastText").textContent=text;bootstrap.Toast.getOrCreateInstance(document.getElementById("cartToast"),{delay:2200}).show();}

// Event delegation keeps the site compatible with dynamically rendered collections.
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add-id]");if(add){addToCart(Number(add.dataset.addId));return;}
  const qty=e.target.closest("[data-qty-id]");if(qty){changeQty(Number(qty.dataset.qtyId),Number(qty.dataset.delta));return;}
  const remove=e.target.closest("[data-remove-id]");if(remove){removeItem(Number(remove.dataset.removeId));return;}
});

document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();showToast("Your Lumi bag has been cleared.");});
document.getElementById("whatsappCheckout").addEventListener("click",()=>{
  if(!cart.length){showToast("Add at least one piece first 💗");return;}
  let message="Hello Lumi Jewels 💗\n\nI would like to order:\n\n";
  cart.forEach((item,i)=>{message+=`${i+1}. ${item.name}\nQty: ${item.quantity}\nPrice: ₦${currency.format(item.price)}\nSubtotal: ₦${currency.format(item.price*item.quantity)}\n\n`;});
  const total=cart.reduce((sum,i)=>sum+i.price*i.quantity,0);
  message+=`Total: ₦${currency.format(total)}\n\nName:\nDelivery address:\nPhone:\n\nThank you ✨`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank");
});

// Reveal animations.
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target);}}),{threshold:.08,rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll(".reveal-up").forEach(el=>revealObserver.observe(el));

// Hero reveal entrance.
requestAnimationFrame(()=>document.querySelectorAll(".hero-reveal").forEach(el=>el.classList.add("is-visible")));

// Scroll-controlled cinematic stack composition.
const editorial=document.querySelector(".editorial-stack");
const stage=document.getElementById("stackStage");
const lid=document.querySelector(".box-lid");
const pieces=[...document.querySelectorAll(".stack-piece")];
const dots=[...document.querySelectorAll(".editorial-dots span")];
const sceneCurrent=document.getElementById("sceneCurrent");
let scrollBusy=false;
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function lerp(a,b,t){return a+(b-a)*t;}
function cinematicScroll(){
  const r=editorial.getBoundingClientRect();
  const travel=editorial.offsetHeight-window.innerHeight;
  const p=clamp((-r.top)/Math.max(travel,1),0,1);
  const phase=p*5;
  const active=Math.min(4,Math.floor(phase+.001));
  sceneCurrent.textContent=String(active+1).padStart(2,"0");
  dots.forEach((d,i)=>d.classList.toggle("active",i===active));
  if(!prefersReducedMotion){
    const setPiece=(el,x,y,z,rot,scale)=>{el.style.transform=`translate3d(${x}px,${y}px,${z}px) rotate(${rot}deg) scale(${scale})`;};
    const baseW=Math.min(190,window.innerWidth*0.2);
    const spread=Math.min(300,window.innerWidth*.22);
    const depth=300;
    // Before each landing, a piece travels from a different direction toward the box.
    const targets=[
      [-baseW*.5,-55,210,-7,.88],[-20,-42,175,7,.90],[30,-22,140,-5,.92],[-10,-2,110,5,.94],[0,26,80,0,.96]
    ];
    const starts=[[-spread,-300,450,-22,.8],[spread,-330,430,21,.78],[-spread,50,420,-18,.8],[spread,20,390,16,.78],[0,-420,500,6,.76]];
    pieces.forEach((piece,i)=>{
      const local=clamp((phase-i)*1.15,0,1);
      const eased=local*local*(3-2*local);
      const [sx,sy,sz,sr,ss]=starts[i];
      const [tx,ty,tz,tr,ts]=targets[i];
      setPiece(piece,lerp(sx,tx,eased),lerp(sy,ty,eased),lerp(sz,tz,eased),lerp(sr,tr,eased),lerp(ss,ts,eased));
      piece.style.opacity=clamp(phase-i+1,0,1);
    });
    // Lid closes once all pieces have settled.
    const close=clamp((p-.72)/.22,0,1);const closeEase=close*close*(3-2*close);lid.style.transform=`translateZ(6px) rotateX(${lerp(0,72,closeEase)}deg)`;
    stage.style.transform=`translate(-50%,-50%) rotateY(${lerp(-6,6,p)}deg) rotateX(${lerp(3,-3,p)}deg)`;
  }
}
function onScroll(){if(scrollBusy)return;scrollBusy=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-window.innerHeight;document.querySelector(".scroll-progress").style.transform=`scaleX(${max>0?window.scrollY/max:0})`;cinematicScroll();scrollBusy=false;});}
window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);onScroll();

// Desktop-only pointer depth.
if(!prefersReducedMotion && window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  document.querySelectorAll(".product-card").forEach(card=>{
    card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*8).toFixed(2)}deg) translateY(-8px)`;});
    card.addEventListener("mouseleave",()=>card.style.transform="");
  });
  document.querySelectorAll(".magnetic").forEach(btn=>{btn.addEventListener("mousemove",e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${((e.clientX-r.left-r.width/2)*.07).toFixed(1)}px,${((e.clientY-r.top-r.height/2)*.07).toFixed(1)}px)`});btn.addEventListener("mouseleave",()=>btn.style.transform="");});
}

document.querySelectorAll(".navbar-nav .nav-link").forEach(link=>link.addEventListener("click",()=>{const nav=document.getElementById("mainNav");if(nav.classList.contains("show"))bootstrap.Collapse.getOrCreateInstance(nav).hide();}));
updateCart();
