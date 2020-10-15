const express = require('express');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const enforce = require('express-sslify');
const PORT = process.env.PORT || 5000;

const app = express();

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;



app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(serveStatic(__dirname + '/dist'));

app.use(history());


// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

server.use(middlewares);
server.use(router);

server.listen(port, () => {
    console.log('JSON Server is running')
})