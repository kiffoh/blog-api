// middleware/authorization.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createComment (req, res) {
    const { postId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                authorId
            }
        })
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({error: 'An error occurred while trying to create the comment.'})
    }
}

async function updateComment (req, res) {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    try {
        const updatedComment = await prisma.comment.update({
            where: {
                authorId,
                postId: parseInt(postId),
                id: parseInt(commentId)
            },
            data: {
                content
            }
        })
        res.status(200).json({message: 'Comment updated successfully.', updatedComment})
    } catch (err) {
        if (err.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: 'Comment not found or you are not the author.' });
        }
        res.status(500).json({error: 'An error occurred while trying to update the comment.'})
    }
}

async function deleteComment (req, res) {
    const { postId, commentId } = req.params;
    const authorId = req.user.id;

    try {
        const deleteComment = await prisma.comment.delete({
            where: {
                authorId,
                postId: parseInt(postId),
                id: parseInt(commentId)
            }
        })
        res.status(200).json({message: 'Comment deleted successfully.'})
    } catch (err) {
        if (err.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: 'Comment not found or you are not the author.' });
        }
        res.status(500).json({error: 'An error occurred while trying to delete the comment.'})
    }
}

async function getComment (req, res) {
    const { postId, commentId } = req.params;
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                postId: parseInt(postId),
                commentId: parseInt(commentId)
            }
        })
        if (comment) {
            res.status(200).json(comment); // 200 OK
        } else {
            res.status(404).json({ error: 'Comment not found.' }); // 404 Not Found
        }
    } catch (err) {
        if (err.code = 'P2025') {
            return res.status(404).json({error: 'Comment not found.'});
        }
        res.status(500).json({error: 'An error occured while trying to find the comment.'})
    }
    
}

module.exports = { 
    createComment,
    updateComment,
    deleteComment,
    getComment
 };
