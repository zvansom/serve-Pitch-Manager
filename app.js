const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJWT = require('express-jwt');
const expressValidator = require('express-validator');
const graphqlHTTP = require('express-graphql');
const path = require('path');

const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes/index');
const schema = require('./schema/schema');

// Create our Express app
const app = express();

// Allow cross-origin
app.use(cors());

// * Views only used for forgotten password email
// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());

// pass variables to our templates + all requests
// app.use((req, res, next) => {
//   res.locals.h = helpers;
//   res.locals.user = req.user || null;
//   next();
// });

// Helper function for Auth
function fromRequest(req) {
  if (req.body.headers.Authorization && 
    req.body.headers.Authorization.split(' ')[0] === 'Bearer') {
      return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

// JWT 
app.use(expressJWT({
    secret: 'test this secret',
    getToken: fromRequest,
  })
  .unless({
    path: [
      { url: '/login', methods: ['POST'] },
      { url: '/register', methods: ['POST'] },
      { url: '/account/forgot', methods: ['POST'] },
      { url: '/account/reset/:token', methods: ['POST'] },
    ],
}));

// bind express with graphql
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
