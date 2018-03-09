'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:1234@ds261838.mlab.com:61838/blog-app';
// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-restaurants-app';
exports.PORT = process.env.PORT || 8080;