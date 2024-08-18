var express = require('express');
var router = express.Router();
const {authenticateJwt} = require('../config/passportJWT');
const authorisation = require('../controllers/authorisation');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const passport = require('passport'); // Import passport here

// Maybe route is obsolete as I want the blog posts to be on the home page
router.get('/', postController.getAllPosts);

// Need validation for my posts and comments, the same respective validation can be used for all posts and all comments as to not repeat code

router.post('/', authenticateJwt, postController.createPost);

router.get('/:postId', postController.getPost)

router.put('/:postId', authenticateJwt, authorisation.ofPost, postController.updatePost);

router.delete('/:postId', authenticateJwt, authorisation.ofPost, postController.deletePost);

// router.get('/:postId/comments', authenticateJwt, (req, res));

router.post('/:postId/comments', authenticateJwt, commentController.createComment)

router.get('/:postId/comments/:commentId', authenticateJwt, commentController.getComment)

router.put('/:postId/comments/:commentId', authenticateJwt, authorisation.ofComment, commentController.updateComment);

router.delete('/:postId/comments/:commentId', authenticateJwt, authorisation.ofComment, commentController.deleteComment);

module.exports = router;
