const express = require('express');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const enforce = require('express-sslify');

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

server.listen(port);

const app = express();

app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(serveStatic(__dirname + '/dist'));

app.use(history());

app.listen(process.env.PORT || 5000);