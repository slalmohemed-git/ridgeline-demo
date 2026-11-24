// Minimal fake store logic (no checkout). Cart lives in localStorage.
(function(){
  const page=document.body.dataset.page, P=window.RIDGELINE_CATALOG;
  const cart=()=>{try{return JSON.parse(localStorage.getItem('rl_cart')||'[]')}catch(e){return []}};
  const save=c=>{try{localStorage.setItem('rl_cart',JSON.stringify(c))}catch(e){}};
  document.getElementById('cart-count').textContent=cart().length;
  if(page==='home'){
    document.getElementById('product-grid').innerHTML=P.map(p=>`<div class="card"><div class="note">${p.category}</div>
      <h3><a href="product.html?sku=${p.sku}">${p.name}</a></h3><div>&pound;${p.price}</div></div>`).join('');
  }
  if(page==='product'){
    const sku=new URLSearchParams(location.search).get('sku')||'TNT-001';
    const p=P.find(x=>x.sku===sku)||P[0]; window.RL_CURRENT=p;
    document.getElementById('p-name').textContent=p.name;
    document.getElementById('p-cat').textContent=p.category+' · '+p.sku;
    document.getElementById('p-price').innerHTML='&pound;'+p.price;
    document.getElementById('add-to-cart').addEventListener('click',()=>{const c=cart();c.push(p);save(c);
      document.getElementById('cart-count').textContent=c.length;document.getElementById('added').textContent='Added';});
  }
  if(page==='cart'){
    const c=cart();document.getElementById('cart-lines').innerHTML=c.length?c.map(p=>`<div>${p.name} &mdash; &pound;${p.price}</div>`).join(''):'Empty';
  }
})();