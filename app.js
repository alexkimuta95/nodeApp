const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//check connections
db.once('open', function(){
console.log('connected to MongoDB');
});
//scheck for db errors
db.on('err',function(err){
console.log(err);
});


//init app
const app = express();

//bring in models
const Article = require('./models/article');

//bring in express validator
expressValidate = require('./validate/express-validate');

//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

//body parser middleware
app.use(bodyParser.urlencoded({ extended:false }))

//parse application json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));


//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  
  }))

  //express messages middleware
  app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator

//app.use(expressValidate);

//passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
res.locals.user = req.user || null;
next();
});


//home route
app.get('/', function(req, res){
   Article.find({}, function(err, articles){
       if(err){
           console.log(err);
       }else{
        res.render('index', {
            title:'Artilces',
            articles:articles
        });
       }
    
   });

});

//royte files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);
//start server
app.listen(3000, function(err){
console.log('server started on port 3000')
});