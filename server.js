const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const app = express();
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ users: [], events: [] }).write();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'agenda-secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.get('users').find({ nombre: username, contrasena: password }).value();
  if (user) {
    req.session.user = user;
    res.redirect('/calendar.html');
  } else {
    res.send('Credenciales incorrectas');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/api/events', requireLogin, (req, res) => {
  const events = db.get('events').value();
  res.json(events);
});

app.post('/api/events', requireLogin, (req, res) => {
  const newEvent = { id: Date.now().toString(), ...req.body };
  db.get('events').push(newEvent).write();
  res.json(newEvent);
});

app.put('/api/events/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  db.get('events').find({ id }).assign(req.body).write();
  res.json({ id, ...req.body });
});

app.delete('/api/events/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  db.get('events').remove({ id }).write();
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
