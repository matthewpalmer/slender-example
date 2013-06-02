var http = require('http');
var fs = require('fs');
var restify = require('restify');
var postdata = require('postdata');

var server = restify.createServer();
server.get('/', function(req, res) {
  var stream = fs.createReadStream('index.html');
  stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
  });
  stream.pipe(res);
});
server.get('/slender.min.js', function(req, res) {
  console.log(res, req);
  var stream = fs.createReadStream('slender.min.js');
  stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
  });
  res.writeHead(200, {
    'Content-Type':'text/javascript'
  });
  stream.pipe(res);
});
server.get('/:path', function(req, res) {
  console.log(res, req);
  var stream = fs.createReadStream(req.params.path);
  stream.on('error', function (err) {
      res.statusCode = 500;
      res.end(String(err));
  });
  stream.pipe(res);
});

server.put('/:path', function(req, res) {
  //console.log(req, res); //should have data passed in
  postdata(req, res, function(err, data) {
    console.log('data is ', data);
    fs.writeFile(req.params.path, JSON.stringify(data), function(err) {
      if (err) console.log('err');
      console.log('saved ');
    })
  });
});

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
