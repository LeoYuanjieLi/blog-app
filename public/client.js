
var blogItemTemplate = (
  '<li class="js-blog-item">' +
    '<p><span class="blog-item js-blog-item-name"></span></p>' +
    '<div class="blog-item-controls">' +
      '<button class="js-blog-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);


var BLOG_POST_URL = '/blog-posts';

function getAndDisplayblogPost() {
  console.log('Retrieving blog post');
  $.getJSON(BLOG_POST_URL, function(items) {
    console.log('Rendering blog post');
    var itemElements = items.map(function(item) {
      var element = $(blogItemTemplate);
      element.attr('id', item.id);
      var itemName = element.find('.js-blog-item-name');
      itemName.text(item.name);
      element.attr('data-checked', item.checked);
      if (item.checked) {
        itemName.addClass('blog-item__checked');
      }
      return element
    });
    $('.js-blog-post').html(itemElements);
  });
}

function addblogItem(item) {
  console.log('Adding blog item: ' + item);
  $.ajax({
    method: 'POST',
    url: BLOG_POST_URL,
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayblogList();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function deleteblogItem(itemId) {
  console.log('Deleting blog item `' + itemId + '`');
  $.ajax({
    url: BLOG_POST_URL + '/' + itemId,
    method: 'DELETE',
    success: getAndDisplayblogPost
  });
}

function updateblogPostItem(item) {
  console.log('Updating blog post item `' + item.id + '`');
  $.ajax({
    url: BLOG_POST_URL + '/' + item.id,
    method: 'PUT',
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayblogList()
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}


function handleblogPostAdd() {

  $('#js-blog-post-form').submit(function(e) {
    e.preventDefault();
    addblogItem({
      name: $(e.currentTarget).find('#js-new-item').val(),
    });
  });

}

function handleblogPostDelete() {
  $('.js-blog-post').on('click', '.js-blog-item-delete', function(e) {
    e.preventDefault();
    deleteblogItem(
      $(e.currentTarget).closest('.js-blog-item').attr('id'));
  });
}


$(function() {
  getAndDisplayblogPost();
  handleblogPostAdd();
  handleblogPostDelete();
});