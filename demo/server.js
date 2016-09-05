const ejs = require('ejs');
const path = require('path');
const express = require('express');

const Dir = {
  build: path.resolve('build'),
  index: path.resolve('build', 'index.html'),
};

const app = express();

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', Dir.build);
app.use(express.static(Dir.build));

app.get('/', (req, res) => res.sendFile(Dir.index));

app.listen('7777', 'localhost', () =>
  console.log('App running on http://localhost:7777'));
