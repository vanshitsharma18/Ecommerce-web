document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('msg');
      msgEl.innerHTML = '';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const data = await apiFetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        setUser(data.user);
        window.location.href = 'products.html';
      } catch (err) {
        msgEl.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });
  }

  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('msg');
      msgEl.innerHTML = '';

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const data = await apiFetch('/api/users/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        setToken(data.token);
        setUser(data.user);
        window.location.href = 'products.html';
      } catch (err) {
        msgEl.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    });
  }
});
