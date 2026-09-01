const API_BASE = window.ASK_API_BASE || '/api';
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');

function showMessage(message, type = 'error') {
  loginMessage.textContent = message;
  loginMessage.className = `login-message show ${type}`;
}

function clearMessage() {
  loginMessage.textContent = '';
  loginMessage.className = 'login-message';
}

function setLoading(loading) {
  loginBtn.disabled = loading;
  loginBtn.textContent = loading ? 'Signing in...' : 'Sign In to Dashboard';
}

if (localStorage.getItem('askBagbinAdminToken')) {
  window.location.replace('./dashboard.html');
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  if (!email || !password) return showMessage('Please enter your email address and password.');

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 405) {
        throw new Error('Login endpoint returned 405. Start the ASK Bagbin Node backend on port 5000 or configure the API URL.');
      }
      throw new Error(data.message || `Login failed (${response.status}).`);
    }

    localStorage.setItem('askBagbinAdminToken', data.token);
    localStorage.setItem('askBagbinAdmin', JSON.stringify(data.admin || {}));
    showMessage('Login successful. Redirecting to dashboard...', 'success');
    setTimeout(() => window.location.replace('./dashboard.html'), 350);
  } catch (error) {
    showMessage(error.message || 'Unable to connect to the server.');
  } finally {
    setLoading(false);
  }
});
