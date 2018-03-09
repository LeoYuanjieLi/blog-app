const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// we're going to add some items to BlogPosts
// so there's some data to look at
BlogPosts.create("Fisrt Post", "This is my first post, hello world!", "Leo Yuanjie Li", );


// when the root of this router is called with GET, return
// all current BlogPosts items
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});


// when a new shopping list item is posted, make sure it's
// got required fields ('name' and 'checked'). if not,
// log an error and return a 400 status code. if okay,
// add new item to BlogPosts and return it with a 201.
router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ["title", "content", "author",];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author,);
  res.status(201).json(item);
});


// when DELETE request comes in with an id in path,
// try to delete that item from BlogPosts.
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ["title", "content", "author", "publishDate", 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(200).json(updatedItem);
})

module.exports = router;