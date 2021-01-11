var express = require('express');
var fs = require('fs');
var app = express();
var multer = require('multer')
var cors = require('cors');
var debug = require('debug')('myapp:server');
var http = require('http');
var PORT = process.argv[2]&&process.argv[2].slice(-4)
var port = normalizePort(process.env.PORT || PORT || '3001');

app.use(cors());

app.set(port);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname )
  }
});

var upload = multer({ storage: storage }).single('file');

app.post('/upload',function(req, res) {
     
  upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
          return res.status(500).json(err)
      } else if (err) {
          return res.status(500).json(err)
      }
    return res.status(200).send(req.file)

  });
});

app.get('/download', function(req, res) {
  res.sendFile(__dirname + '/public/Kaushik_Kumar_Resume.pdf')
});

app.get('/', function(req, res) {
  res.sendStatus(200);
})

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log(`server listening on ${addr.port}`);

  debug('Listening on ' + bind);
}

// app.listen(8000, function() {
//     console.log('App running on port 8000');
// });