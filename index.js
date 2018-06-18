var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

passport.use(new Strategy(function(username, password, cb) {
	db.users.findByUsername(username, function(err, user) {
		if (err) { return cb(err); }
		if (!user) { return cb(null, false); }
		if (user.password != password) { return cb(null, false); }
		return cb(null, user);
	});
}));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	db.users.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});


// VIEWS
var app = express();
var router = express.Router();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

// MIDDLEWARE
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());


// MONGOOSE
var mongoDB = 'mongodb://127.0.0.1/ttt';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const User = require('./models/User');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTING
app.get('/',function(req, res) {
	res.render('index', { user: req.user });
});

app.get('/login',
	function(req, res){
		res.render('login');
	}
);
	
app.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	}
);
	
app.get('/logout',
	function(req, res){
		req.logout();
		res.redirect('/');
	}
);

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		res.render('profile', { user: req.user });
	}
);

app.listen(5000);