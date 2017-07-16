var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
var config={

}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/home2.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home2.jpg'));
});
app.get('/ui/create_join.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'create_join.jpg'));
});
app.get('/ui/style.scss', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.scss'));
});
app.get('/ui/index.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.js'));
});
app.get('/ui/logo.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'logo.png'));
});
app.get('/home.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home.html'));
});
app.get('/create_join.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'create_join.html'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`Expense Calculator listening on port ${port}!`);
});
