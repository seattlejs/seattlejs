var path = require('path'),
    express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    app = express.createServer(),
    listener = io.listen(app),
    util = require('util'),
    querystring = require('querystring'),
    twitter = new (require('ntwitter'))({
      consumer_key: 'CXOYZUHx8eLon9Y2X2NxA',
      consumer_secret: '3hGVJpR9g58QGWEMtVgtYA4fnXoZdAUcHw7uTCwM',
      access_token_key: '625768616-f9jJ5McbMOi3mcTLIUZ1FVIN6z7NPBLRAtwz6DSc',
      access_token_secret: 'DoQNljhHF5o1VlUczzkAk1EJSdCACAmtmY30yisVA'
    }),
    lat = '47.623586',
    lng = '-122.336025',
    meetupEventId = '69119542',
    meetupApiKey = '6c39446450204b421c202b77432f514d',
    meetupGroupUrlName = 'seattlejs';

listener.set('log level', 1);

app.use(express.logger());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 8002);

app.post('/signin', function(request, response) { 
  var req = http.request({
      host: 'api.meetup.com',
      port: 80,
      path: '/2/checkin?' + querystring.stringify({
        key: meetupApiKey,
        event_id: meetupEventId,
        attendee_member_id: request.query.memberId
      }),
      method: 'POST'
    }, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  // write data to request body
  req.write('');
  req.end();

  response.send(200);
});

app.post('/tweet', function(request, response) {
  twitter.verifyCredentials(function(err, data) {
    console.log(data);
  }).updateStatus(request.query.tweet, function(err, data) {
    console.log(data);
  });
});

twitter.verifyCredentials(function(err, data) {
  console.log('verifyCredentials', data);
}).stream('statuses/filter', {track: 'seattlejs'}, function(stream) {
  stream.on('data', function (data) {
    console.log('will emit', data);
    listener.sockets.emit('tweet', data);
  });
  stream.on('end', function (response) {
    // Handle a disconnection
    console.log('disconnected');
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
    console.log('destroyed');
  });
  stream.on('error', function() {
    console.log('error', arguments);
  });
});
