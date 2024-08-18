// middleware/authorization.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ofComment(req, res, next) {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
    if (comment.authorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function ofPost (req, res, next) {
    const { postId } = req.params;
    const userId = req.user.id;
  
    try {
      const post = await prisma.post.findUnique({ where: { id: parseInt(postId) } });
      if (post.authorId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      next(err);
    }
}

async function ofUser (req, res, next) {
    try {
      if (req.user.id !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      next(err);
    }
}

module.exports = { 
    ofComment,
    ofPost,
    ofUser
 };
