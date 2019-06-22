const express = require('express');
const path = require('path');

const app = express();
const port = parseInt(process.env.PORT, 10) || 8000;

app.use(express.static('dist/overtime-frontend'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/overtime-frontend/index.html')));

app.listen(port);
