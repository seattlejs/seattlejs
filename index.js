var express = require('express'),
    path = require('path'),
    server = express.createServer();
server.use(express.static(path.join(__dirname, 'public')));
server.listen(process.env.PORT || 3000);
