const express = require('express');
const helmet = require("helmet");
const path = require('path');

const app = express();
const port = parseInt(process.env.PORT, 10) || 8000;

app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'use.fontawesome.com']
  }
}));

app.use((req, res) => {
  if (!['development', 'test'].includes(process.env.NODE_ENV)) {
    if (!prodWhitelist.includes(req.headers.host)) {
      return res.status(403).send('Not allowed');
    }
  }
});

app.use(express.static('dist/overtime-frontend'));

app.get('*', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.sendFile(path.join(__dirname, 'dist/overtime-frontend/index.html'));
});

app.listen(port);
