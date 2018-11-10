'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _orders = require('./routes/orders');

var _orders2 = _interopRequireDefault(_orders);

var _users = require('./routes/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/api/v1/parcels', _orders2.default);
app.use('/api/v1/users', _users2.default);

var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('listening on port ' + port + '....');
});

exports.default = app;