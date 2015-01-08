var user = {
    player: {
        firstName: "igal",
      lastName:"bo",
      accessCode:"1221212",
        email: "email@gmail.com"
    }
};

var userString = JSON.stringify(user);

var headers = {
  'Content-Type': 'application/json',
  'Content-Length': userString.length
};

var options = {
  host: 'myServer.example.com',
  port: 80,
  path: '/user/TheReddest',
  method: 'POST',
  headers: headers
};

setInterval( function() {
 	console.log("test");

}, 3000);