const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

/**
 * ✅ Correct CORS setup
 * - Explicitly allow 'http://localhost:5173'
 * - Allow credentials (cookies, sessions)
 */
app.use(cors({
  origin: 'http://localhost:5173',  // Must match your frontend URL exactly
  credentials: true,
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

/**
 * ✅ Dummy login logic
 * Simulate authentication (this would normally set a session or token)
 */
app.post('/login/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    // Normally you would set cookies or session here
    res.cookie('token', 'dummy-token', { httpOnly: true, sameSite: 'Lax' });
    return res.json({
      success: true,
      user: { id: 1, username: 'admin', isAdmin: true },
      message: 'Login successful',
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

/**
 * ✅ Dummy auth status check
 * Pretend to check session/cookie and return user info if authenticated
 */
app.get('/login/auth/status', (req, res) => {
  // Normally you'd check session or token here
  // For demo purposes, always return authenticated user
  return res.json({
    user: { id: 1, username: 'admin', isAdmin: true },
  });
});

/**
 * ✅ Dummy logout logic
 */
app.post('/login/auth/logout', (req, res) => {
  // Normally you'd clear session or token
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
