 var socket = io.connect('http://localhost');
  socket.on('step', function (data) {
    //socket.emit('my other event', { my: 'data' });
    console.log(data);
  });

