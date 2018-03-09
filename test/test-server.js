// adding chai, chaiHttp for testing
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
// add the expect function
const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Test', function(){
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the that promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
	before(function(){
		return runServer();
	});

  // although we only have one test module at the moment, we'll
  // close our server at the end of these tests. Otherwise,
  // if we add another test module that also has a `before` block
  // that starts our server, it will cause an error because the
  // server would still be running from the previous tests.
	after(function() {
	return closeServer();
	});	

  // test strategy:
  //   1. make request to `/shopping-list`
  //   2. inspect response object and prove has right code and have
  //   right keys in response object.
  	it('should list items on GET', function(){
	    // for Mocha tests, when we're dealing with asynchronous operations,
	    // we must either return a Promise object or else call a `done` callback
	    // at the end of the test. The `chai.request(server).get...` call is asynchronous
	    // and returns a Promise, so we just return it.
      	return chai.request(app)
      	.get('/blog-posts')
      	.then(function(res){
      		expect(res).to.have.status(200);
      		expect(res).to.be.json;
      		expect(res.body).to.be.a('array');

      		// it should be at least have 1 item on app load
      		expect(res.body.length).to.be.at.least(1);
      		// each item should be an object with key/value pairs
      		const expectedKeys = ["title", "content", "author", "publishDate", "id"];
      		res.body.forEach(function(item){
      			expect(item).to.be.a('object');
      			expect(item).to.include.keys(expectedKeys);
      		});
      	});
  	});

  	it('should add an item on POST', function(){
  		const newItem = {title:'test A', content: "this is a test post", 
  		author: "Leo_Tester", publishDate: "03-03-2018"};
      // const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newItem));
  		return chai.request(app)
  		.post('/blog-posts')
      .send(newItem)
  		.then(function(res){
  			expect(res).to.have.status(201);
  			expect(res).to.be.json;
  			expect(res.body).to.be.a('object');
  			const expectedKeys = ["title", "content", "author", "publishDate", "id"];
  			expect(res.body).to.include.keys(expectedKeys);
  			expect(res.body.id).to.not.equal(null);
  			// should be deep equal
        expect(res.body.title).to.equal(newItem.title);
        expect(res.body.content).to.equal(newItem.content);
        expect(res.body.author).to.equal(newItem.author)
  		});
  	});

  it('should update items on PUT', function() {
    // we initialize our updateData here and then after the initial
    // request to the app, we update it with an `id` property so
    // we can make a second, PUT call to the app.
    const updateData = {
      title: 'test B',
      content: 'this is an updated post',
      author: "Leo_Tester_2",
      publishDate: "03-04-2018"
    };

    return chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        // this will return a promise whose value will be the response
        // object, which we can inspect in the next `then` block. Note
        // that we could have used a nested callback here instead of
        // returning a promise and chaining with `then`, but we find
        // this approach cleaner and easier to read and reason about.
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
      // prove that the PUT request has right status code
      // and returns updated item
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });

  // test strategy:
  //  1. GET shopping list items so we can get ID of one
  //  to delete.
  //  2. DELETE an item and ensure we get back a status 204
  it('should delete items on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
})