var express         = require('express');
var config          = require('./config');
var app             = express();

app.use(require('body-parser').json());
app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

require('./api')(app);
require('./gui')(app);

app.listen(config.port);
console.log('Running on port: ' + config.port);
