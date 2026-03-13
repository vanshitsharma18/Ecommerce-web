document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  try {
    const products = await apiFetch('/api/products');
    if (products.length === 0) {
      grid.innerHTML = '<div class="empty-state">No products available yet.</div>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image || 'https://via.placeholder.com/300x200?text=Product'}" alt="${p.name}">
        <div class="card-body">
          <div class="category">${p.category}</div>
          <h3>${p.name}</h3>
          <div class="price">$${p.price.toFixed(2)}</div>
          <div class="stock">${p.stock > 0 ? p.stock + ' in stock' : 'Out of stock'}</div>
          <button class="btn btn-primary" onclick="addToCart('${p._id}', '${p.name}', ${p.price})" ${p.stock === 0 ? 'disabled' : ''}>
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
  }
});

async function addToCart(productId, name, price) {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }
  try {
    await apiFetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, name, price, quantity: 1 }),
    });
    alert('Added to cart!');
  } catch (err) {
    alert('Error: ' + err.message);
  }
}
