var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ultimasNotas = [];
var usuarios = [];
var chatUsuarios = [];
var formidableMiddleware = require('express-formidable');


// Settings for CORS
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: './descargas',
  multiples: true, // req.files to be arrays of files
}));
app.post('/upload', (req, res) => {
  //console.log("salta");
  res.send(req.files[0]);
  //req.files; // contains files
});




io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('nota', function (notas) {
    io.emit('nota', notas);
    ultimasNotas = notas;
  });
  socket.on('usuarioRe', function (usuario) {
    if (usuarios.indexOf(usuario) == -1) { // significa que no existe
      io.emit('usuarioRe', usuario);
      usuarios.push(usuario);
      chatUsuarios.push({
        id: usuario,
        name: usuario,
        imageUrl: ''
      })
      io.emit('participantes',chatUsuarios);
      io.emit('nota', ultimasNotas);
      socket.on('disconnect', function () {
          io.emit('desconexion', usuario);
          usuarios.splice(usuarios.indexOf(usuario),1);
          chatUsuarios.splice(chatUsuarios.indexOf(usuario),1);
        
      })
    }else{
      io.emit("error_Login");
    }

  });

  socket.on('nuevaNota', function (notaRecibida) {
    console.log(notaRecibida);
    ultimasNotas.push(notaRecibida);
    io.emit('nuevaNota', notaRecibida);
    io.emit('nota', ultimasNotas);
  });

  socket.on('borrar', function (indice) {
    io.emit('borrar', ultimasNotas[indice]);
    ultimasNotas.splice(indice, 1);
    io.emit('nota', ultimasNotas);
  });

  socket.on('chatMensajes',function(mensajesRecibidos){
    socket.broadcast.emit("mensajesEnviados",mensajesRecibidos);
  })
});


http.listen(3000, function () {
  console.log('listening on *:3000');
});


