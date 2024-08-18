// controllers/postController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPost (req, res) {
    console.log('CREATE POST REACHED')
    const { title, content, published } = req.body;
    const authorId = req.user.id;

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                published,
                authorId
            }
        })
        res.status(201).json(newPost);
    } catch (err) {
        console.error('Error creating post:', err); // Log the full error
        res.status(500).json({error: 'An error occurred while trying to create the post.'})
    }
}

async function updatePost (req, res) {
    const {postId} = req.params;
    const { title, content, published } = req.body;
    const authorId = req.user.id;

    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: parseInt(postId),
                authorId: authorId
            },
            data: {
                title,
                content,
                published
            }
        })
        res.status(200).json({message: 'Post updated successfully.', updatedPost});
    } catch (err) {
        if (err.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: 'Post not found or you are not the author.' });
        }
        res.status(500).json({error: 'An error occurred while trying to update the post.'})
    }
}

async function deletePost (req, res) {
    const {postId} = req.params;
    const authorId = req.user.id;

    try {
        const deleteComments = await prisma.comment.deleteMany({
            where: {
                postId: parseInt(postId)
            }
        })

        const deletePost = await prisma.post.delete({
            where: {
                id: parseInt(postId),
                authorId: authorId
            },
        })
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        if (err.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: 'Post not found or you are not the author.' });
        }
        res.status(500).json({error: 'An error occurred while trying to delete the post.'})
    }
}

async function getPost (req, res) {
    const { postId } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            },
            include: {
                author : {
                    select : {
                        username: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
            }
        })

        if (post) {
            const updatedPostDateTime = formatDateTime(post.updatedAt);

            const commentsWithFormattedDates  = post.comments.map(comment => {
                const formattedCommentDateTime = formatDateTime(comment.createdAt);
                return {
                    ...comment,
                    createdAtDate: formattedCommentDateTime.date,
                    createdAtTime: formattedCommentDateTime.time,
                };
            })
            
            const updatedPost = {
                ...post,
                updatedAtDate: updatedPostDateTime.date,
                updatedAtTime: updatedPostDateTime.time,
                comments: commentsWithFormattedDates
            }

            res.status(200).json(updatedPost); // 200 OK
        } else {
            res.status(404).json({ error: 'Post not found.' }); // 404 Not Found
        }
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({error: 'Post not found.'});
        }
        res.status(500).json({error: 'An error occured while trying to find the post.'})
    } 
}

async function getAllPosts (req, res) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        })

        if (posts) {
            res.status(200).json(posts)
        }

    } catch (err) {
        res.status(500).json({error: 'An error occured while trying to find the posts.'})
    }
    
}

function formatDateTime (isoString) {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;

    return {
        date: formattedDate,
        time: formattedTime
    };
}

module.exports = { 
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPosts
};
