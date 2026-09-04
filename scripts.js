const whatsappNumber = "2348012345678";
const currency = new Intl.NumberFormat("en-NG");
let cart = JSON.parse(localStorage.getItem("lumiCart")) || [];

const categories = [
  "Necklaces","Bracelets","Rings","Earrings","Anklets","Chains","Pendants","Charms","Bangles","Watches","Shades","Brooches",
  "Hair Jewelry","Toe Rings","Body Jewelry","Cufflinks","Pearls","Crystal Jewelry","Birthstone Jewelry","Bridal Jewelry","Statement Jewelry","Layering Sets","Gift Sets","Jewelry Accessories"
];

const featured = [
  {id:901,name:"Classic Necklace",category:"Necklaces",price:28000},
  {id:902,name:"Crystal Bracelet",category:"Bracelets",price:22000},
  {id:903,name:"Pearl Earrings",category:"Earrings",price:18500},
  {id:904,name:"Gold Ring",category:"Rings",price:24000}
];

function makeProduct(id, category, index){
  const names=["Classic","Elegant","Premium"];
  const prices=[12500,16500,22000,28500,34000,42000];
  return {id,name:`${names[index]} ${category}`,category,price:prices[(id+index)%prices.length]};
}

const allProducts=[...featured];
const categoryRoot=document.getElementById("categorySections");

function placeholder(){return `<div class="media-placeholder"><i class="bi bi-gem"></i></div>`;}
function productCard(product){return `<article class="product-card reveal" data-product-id="${product.id}" data-name="${product.name.toLowerCase()}" data-category="${product.category.toLowerCase()}"><div class="product-media">${placeholder()}</div><div class="product-body"><div class="product-name">${product.name}</div><div class="product-category">${product.category}</div><div class="product-bottom"><strong>₦${currency.format(product.price)}</strong><button class="add-button" data-add-id="${product.id}"><i class="bi bi-plus-lg"></i> Add</button></div></div></article>`;}

document.getElementById("featuredGrid").innerHTML=featured.map(productCard).join("");

categories.forEach((category, index)=>{
  const products=[makeProduct((index+1)*10+1,category,0),makeProduct((index+1)*10+2,category,1),makeProduct((index+1)*10+3,category,2)];
  allProducts.push(...products);
  const section=document.createElement("section");
  section.className="category-section";
  section.innerHTML=`<div class="category-heading"><h3>${category}</h3><a href="#category-${index}">View all</a></div><div class="product-rail" id="category-${index}">${products.map(productCard).join("")}</div>`;
  categoryRoot.appendChild(section);
});

document.getElementById("year").textContent=new Date().getFullYear();

function saveCart(){localStorage.setItem("lumiCart",JSON.stringify(cart));updateCart();}
function cartTarget(){return window.innerWidth<768?document.getElementById("mobileCartCount")?.parentElement:document.querySelector(".cart-button")||document.querySelector(".mobile-cart");}
function pulseCart(){const target=cartTarget();if(!target)return;target.classList.remove("cart-pulse");void target.offsetWidth;target.classList.add("cart-pulse");setTimeout(()=>target.classList.remove("cart-pulse"),650);}
function flyToCart(button){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const card=button.closest(".product-card"), media=card?.querySelector(".product-media"), target=cartTarget();
  if(!media||!target)return;
  const a=media.getBoundingClientRect(), b=target.getBoundingClientRect();
  const ghost=document.createElement("div"); ghost.className="fly-item"; ghost.innerHTML='<i class="bi bi-gem"></i>';
  const size=Math.min(110,Math.max(60,a.width*.35)); ghost.style.width=`${size}px`;ghost.style.height=`${size}px`;
  const sx=a.left+a.width/2-size/2, sy=a.top+a.height/2-size/2, ex=b.left+b.width/2-size/2, ey=b.top+b.height/2-size/2;
  ghost.style.transform=`translate3d(${sx}px,${sy}px,0) scale(1)`; document.body.appendChild(ghost);
  ghost.animate([
    {transform:`translate3d(${sx}px,${sy}px,0) scale(1) rotate(0deg)`,opacity:1},
    {transform:`translate3d(${(sx+ex)/2}px,${Math.min(sy,ey)-90}px,0) scale(.7) rotate(10deg)`,opacity:1,offset:.55},
    {transform:`translate3d(${ex}px,${ey}px,0) scale(.15) rotate(20deg)`,opacity:.15}
  ],{duration:850,easing:"cubic-bezier(.2,.8,.2,1)",fill:"forwards"}).finished.finally(()=>{ghost.remove();pulseCart();});
}
function addToCart(id, button){const p=allProducts.find(x=>x.id===id);if(!p)return;const existing=cart.find(x=>x.id===id);existing?existing.quantity++:cart.push({...p,quantity:1});saveCart();showToast(`${p.name} added to cart.`);flyToCart(button);}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.quantity+=delta;if(item.quantity<1)cart=cart.filter(x=>x.id!==id);saveCart();}
function updateCart(){
  const count=cart.reduce((s,i)=>s+i.quantity,0);document.getElementById("cartCount").textContent=count;document.getElementById("mobileCartCount").textContent=count;
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div class="empty-cart"><i class="bi bi-bag"></i><p>Your cart is empty.</p></div>';document.getElementById("cartTotal").textContent="₦0";return;}
  box.innerHTML=cart.map(item=>`<div class="cart-item"><div class="cart-thumb"><i class="bi bi-gem"></i></div><div class="cart-info"><strong>${item.name}</strong><small>${item.category}</small><b>₦${currency.format(item.price)}</b><div class="qty"><button data-qty="${item.id}" data-delta="-1">−</button><span>${item.quantity}</span><button data-qty="${item.id}" data-delta="1">+</button></div></div></div>`).join("");
  const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);document.getElementById("cartTotal").textContent=`₦${currency.format(total)}`;
}
function showToast(text){document.getElementById("toastText").textContent=text;bootstrap.Toast.getOrCreateInstance(document.getElementById("cartToast"),{delay:1800}).show();}

document.addEventListener("click",e=>{const add=e.target.closest("[data-add-id]");if(add){addToCart(Number(add.dataset.addId),add);return;}const qty=e.target.closest("[data-qty]");if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));});
document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();});
document.getElementById("whatsappCheckout").addEventListener("click",()=>{if(!cart.length){showToast("Your cart is empty.");return;}let message="Hello Lumi Jewels, I would like to order:\n\n";cart.forEach((item,i)=>message+=`${i+1}. ${item.name}\nQuantity: ${item.quantity}\nPrice: ₦${currency.format(item.price)}\nSubtotal: ₦${currency.format(item.price*item.quantity)}\n\n`);const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);message+=`Total: ₦${currency.format(total)}\n\nName:\nDelivery address:\nPhone:`;window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank");});

document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();filterProducts();});
document.getElementById("searchInput").addEventListener("input",filterProducts);
function filterProducts(){const term=document.getElementById("searchInput").value.toLowerCase().trim();document.querySelectorAll(".product-card").forEach(card=>{card.style.display=!term||card.dataset.name.includes(term)||card.dataset.category.includes(term)?"":"none";});}

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:"0px 0px -7% 0px"});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

window.addEventListener("scroll",()=>{document.documentElement.style.setProperty("--scroll",`${window.scrollY}px`);},{passive:true});
updateCart();
