var express = require('express');
var morgan = require('morgan');
var path = require('path');
var request=require('request');
var bodyParser=require('body-parser');
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/','main.js'));
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
app.post('/signup', function (req, res) {
  var username=req.body.username;
  var password=req.body.password;
  console.log(username);
  console.log(password);
  request.post({
    url: "http://auth.c100.hasura.me/signup",
    headers: {
          "Content-Type": "application/json"
      },
    body:{
      "username": username,
      "password": password
},
      json:true
}, function(error, response, body){
console.log(error);
//console.log(JSON.stringify(response));
//var result=JSON.parse(JSON.stringify(response));
res.send(JSON.stringify(response));
//console.log(result['status']);
console.log(JSON.stringify(response));
});
});
app.post('/login', function (req, res) {
  var username=req.body.username;
  var password=req.body.password;
  console.log(username);
  console.log(password);
  request.post({
    url: "http://auth.c100.hasura.me/login",
    headers: {
          "Content-Type": "application/json"
      },
    body:{
      "username": username,
      "password": password
},
      json:true
}, function(error, response, body){
console.log(error);
//console.log(JSON.stringify(response));
//var result=JSON.parse(JSON.stringify(response));
res.send(JSON.stringify(response));
//console.log(result['status']);
console.log(JSON.stringify(response));
});
});
app.get('/home.html', function (req, res) {
  // console.log(req.body.validate);
  res.sendFile(path.join(__dirname, 'ui', 'home.html'));
  request.post({
          url: "http://data.c100.hasura.me/v1/query",
          headers: {
                "Content-Type": "application/json"
                "Authorization":"Bearer"
            },
          body:{
	          "type": "select",
	          "args":{
		        "table": "user_data",
		        "columns":["*"]
  }
},
            json:true
}, function(error, response, body){
console.log(error);
console.log(JSON.stringify(response));
  console.log(body);
});
  });
app.get('/create_join.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'create_join.html'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`Expense Calculator listening on port ${port}!`);
});