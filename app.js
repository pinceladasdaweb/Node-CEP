/*jslint node: true */
"use strict";

var express = require('express'),
    index   = require('./routes/index'),
    app     = express(),
    port    = process.env.PORT || 3002;

app.use('/', index);

app.listen(port);

console.log('Your server goes on localhost:' + port);