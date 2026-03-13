const API_BASE = 'http://localhost:3000'; // API Gateway

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function isLoggedIn() {
  return !!getToken();
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function logout() {
  removeToken();
  window.location.href = 'login.html';
}

// Update navbar based on login state
function updateNav() {
  const authLinks = document.getElementById('auth-links');
  if (!authLinks) return;
  if (isLoggedIn()) {
    const user = getUser();
    authLinks.innerHTML = `
      <span style="color:#ccc">Hi, ${user ? user.name : 'User'}</span>
      <button id="logout-btn" onclick="logout()">Logout</button>
    `;
  } else {
    authLinks.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', updateNav);
