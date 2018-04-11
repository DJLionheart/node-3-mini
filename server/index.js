require('dotenv').config();
const express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      mc = require( `${__dirname}/controllers/messages_controller` );

const createInitialSession = require(`${__dirname}/middlewares/session`),
      filter = require(`${__dirname}/middlewares/filter`);

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}../build` ) );
//express.static gives the file path to the build folder. Lets the server deliver (serve up) the static files for the front-end. You no-longer have to run npm start.

app.use( session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 100000
    }
}));

app.use( (req, res, next) => createInitialSession(req, res, next));
//If you invoke the middleware on your own, you need to manually pass it the
//req, res, and next arguments (as shown above).
//This allows you to add other middleware/steps. (If it's a post request, do this...
// If it's a get request, do that...)

//OR you could let express do it, and just write:

// app.use(createInitialSession)

// Express will pass it the req, res, and next arguments automatically if we do it that way.

app.use( (req, res, next) => {
    if(req.method === "POST" || req.method === "PUT") {
        filter(req, res, next);
    } else {
        next()
    }
});


app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", mc.update );
app.delete( "/api/messages", mc.delete );
app.get("/api/messages/history", mc.history )

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );