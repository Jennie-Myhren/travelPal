const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
//any passport, session, db TK
const PORT = process.env.PORT || 8080;
module.exports = app;

//global Mocha hook for resource cleanup TK

const createApp = () => {
  app.use(morgan('dev'));

  //body-parsing middleware
  app.use(express.json());
  app.use(
    bodyParser.urlencoded({
      parameterLimit: 100000,
      limit: '50mb',
      extended: true,
    })
  );

  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  //session middleware with passport TK
  //any auth routes
  app.use('/api', require('./api'));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // send 404 for other requests w/ an extension (.js, .css, ..)
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // send index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
};

createApp();
startListening();
//once DB, sync DB + sync sessionStore
