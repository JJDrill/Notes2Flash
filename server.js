var fs = require('fs'),
    http = require('http');

http.createServer(function (req, res) {
  var requestedPage = "";

  if (req.url === '/') {
    requestedPage = "/index.html"
  } else {
    requestedPage = req.url
  }

  fs.readFile(__dirname + requestedPage, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8080);
