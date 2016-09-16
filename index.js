var express = require('express');
var app = express();
var path = require("path")

// app.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/index.html'));
//   //__dirname : It will resolve to your project folder.
// });

app.use(express.static('public'));
// app.use(express.static('files'));
//
// app.get('/js/three.js',function(req,res){
//   res.sendFile(path.join(__dirname+'/js/three.js'));
// });
//
// app.get('/js/main',function(req,res){
//   res.sendFile(path.join(__dirname+'/js/main.js'));
// });
//
// app.get('/js/three.js',function(req,res){
//   res.sendFile(path.join(__dirname+'/js/three.js'));
// });
//
// app.get('/js/main',function(req,res){
//   res.sendFile(path.join(__dirname+'/js/main.js'));
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
