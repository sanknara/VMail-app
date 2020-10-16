const express = require('express');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const enforce = require('express-sslify');

const { exec } = require('child_process');

// Set port (default: 3000). For Heroku, we need to use
// the port set by the environment variable $PORT
const port = process.env.PORT || 3000;

const command = `json-server --watch db.json --port ${port}`;

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.log('Error running exec', err);
        return;
    }
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
});

const app = express();

app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(serveStatic(__dirname + '/dist'));

app.use(history());

app.listen(process.env.PORT || 5000);