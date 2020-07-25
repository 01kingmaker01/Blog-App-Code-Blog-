// Express
const express = require('express');
var app = express();

//to PUT and DELETE route // use ?_method
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//express-sanitizer
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

//to select & view 'public' folder[1st & 2nd line] and ['view' folder => dont need to add ejs.(it recognizes it due to 3rd line)]
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BlogApp', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

var BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  date: { type: Date, default: Date.now },
});
var Blog = mongoose.model('Blog', BlogSchema);

app.get('/tiny', (req, res) => {
  res.render('tiny');
});

//landing page
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

//index route
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

//new route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

//create route
app.post('/blogs', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/blogs');
    }
  });
});

//Show route
app.get('/blogs/:id', (req, res) => {
  console.log(req.params.id);
  Blog.findById(req.params.id, (err, showBlog) => {
    if (err) {
      res.send('404 not found');
    } else {
      res.render('show', { showBlog: showBlog });
    }
  });
});

//Edit route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundblog) => {
    if (err) {
      console.error(err);
      res.send('Something went wrong');
    } else {
      res.render('edit', { blog: foundblog });
    }
  });
});

//update route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.error(err);
      res.send('error');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

//delete route
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.error(err);
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server has STARTED!!!');
});
