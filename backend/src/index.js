const express = require('express');
const session = require('express-session');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
HEAD
  origin: true,

  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://192.168.0.32:3000',
  ],
 tp-devops
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
  },
}));

const downloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/f', downloadLimiter);

app.use('/api', routes);
app.get('/health', (_, res) => res.json({ status: 'ok' }));

<<<<<<< HEAD
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Access from other devices via: http://<YOUR_LOCAL_IP>:${PORT}`);
});
=======
app.listen(PORT, '0.0.0.0', () => console.log(`Backend listening on port ${PORT}`));
>>>>>>> tp-devops
