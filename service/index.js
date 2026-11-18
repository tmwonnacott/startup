const path = require('node:path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
  addUser,
  connectToDatabase,
  getUserByEmail,
  getUserByToken,
  removeUserToken,
  setUserToken,
} = require('./database');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return { email, password: passwordHash };
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res) {
  res.clearCookie('token', { path: '/' });
}

app.post('/api/auth', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
    res.status(400).send({ msg: 'Email and password are required' });
    return;
  }

  if (await getUserByEmail(email)) {
    res.status(409).send({ msg: 'Existing user' });
    return;
  }

  const user = await createUser(email, password);
  const token = uuidv4();
  try {
    await addUser({ ...user, token });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).send({ msg: 'Existing user' });
      return;
    }
    throw error;
  }

  setAuthCookie(res, token);
  res.send({ email: user.email });
});

app.put('/api/auth', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
    res.status(400).send({ msg: 'Email and password are required' });
    return;
  }

  const user = await getUserByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = uuidv4();
    await setUserToken(user.email, token);
    setAuthCookie(res, token);
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.delete('/api/auth', async (req, res) => {
  await removeUserToken(req.cookies.token);
  clearAuthCookie(res);
  res.send({});
});

app.get('/api/user/me', async (req, res) => {
  const user = await getUserByToken(req.cookies.token);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ msg: 'Not found' });
});

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    return;
  }
  next();
});

app.use((error, req, res, next) => {
  console.error('Request failed:', error);
  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(500).json({ msg: 'Internal server error' });
});

const port = process.env.PORT || (process.argv.length > 2 ? process.argv[2] : 4000);
async function start() {
  await connectToDatabase();
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error(`Unable to start service: ${error.message}`);
  process.exitCode = 1;
});
