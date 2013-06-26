var sys    = require('sys'),
    http   = require('http'),
    url    = require('url'),
    fs     = require('fs'),
    Buffer = require('buffer').Buffer;

// ------------------------------------------------------------ //
// Base Server Stuff
// ------------------------------------------------------------ //

var server = http.createServer(function(req, res){
  // your normal server code
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Welcome! Ready to see <a href="/stream.html">the stream</a>?</h1>');
      res.end();
      break;
      
    case '/stream.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, 'utf8');
        res.end();
      });
      break;

    case '/jquery.min.js':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data, 'utf8');
        res.end();
      });
      break;
      
    default: send404(res);
  }
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(8899);


// ------------------------------------------------------------ //
// Socket.IO Stuff here
// ------------------------------------------------------------ //

var io = require('socket.io');

io = io.listen(server);

io.on('connection', function(client) {
    sys.debug(client.sessionId + ' connected');
    client.broadcast.emit('user connected');
    
    client.on('message', function(message) {
        // do stuff
        // client.broadcast(message)
        client.broadcast.send(message);
        client.send(message);
        sys.debug('message: ' + message);
    });
    
    client.on('disconnect', function() {
        sys.debug(client.sessionId + ' disconnected');
    });
});
