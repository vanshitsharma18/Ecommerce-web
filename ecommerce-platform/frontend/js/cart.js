document.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  const page = document.getElementById('cart-page') || document.getElementById('checkout-page');
  if (!page) return;

  await loadCart();
});

async function loadCart() {
  const cartBody = document.getElementById('cart-body');
  const cartSummary = document.getElementById('cart-summary');
  if (!cartBody) return;

  try {
    const cart = await apiFetch('/api/cart');
    const items = cart.items || [];

    if (items.length === 0) {
      cartBody.innerHTML = '<tr><td colspan="5" class="empty-state">Your cart is empty.</td></tr>';
      if (cartSummary) cartSummary.innerHTML = '';
      return;
    }

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    cartBody.innerHTML = items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.productId}')">Remove</button></td>
      </tr>
    `).join('');

    if (cartSummary) {
      const isCheckout = !!document.getElementById('checkout-page');
      cartSummary.innerHTML = `
        <div class="total">Total: $${total.toFixed(2)}</div>
        ${isCheckout
          ? `<button class="btn btn-success" onclick="placeOrder()">Pay & Place Order</button>`
          : `<a href="checkout.html" class="btn btn-success">Proceed to Checkout</a>`
        }
      `;
    }
  } catch (err) {
    cartBody.innerHTML = `<tr><td colspan="5" class="alert alert-error">${err.message}</td></tr>`;
  }
}

async function removeFromCart(productId) {
  try {
    await apiFetch('/api/cart/' + productId, { method: 'DELETE' });
    await loadCart();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function placeOrder() {
  try {
    // Get cart
    const cart = await apiFetch('/api/cart');
    const items = cart.items || [];
    if (items.length === 0) return alert('Cart is empty');

    // Create order
    const order = await apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });

    // Process fake payment
    const payment = await apiFetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify({ orderId: order._id, amount: order.totalAmount }),
    });

    // Clear cart items
    for (const item of items) {
      await apiFetch('/api/cart/' + item.productId, { method: 'DELETE' });
    }

    alert('Order placed successfully! Transaction: ' + payment.transactionId);
    window.location.href = 'products.html';
  } catch (err) {
    alert('Error: ' + err.message);
  }
}
