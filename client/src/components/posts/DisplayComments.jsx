import { useState } from "react";
import styles from './DisplayPost.module.css'

function DisplayComments({ post, user, backendUrl, postId, fetchPost }) {
    const [content, setContent] = useState('');

    async function handleCreateComment (event) {
        event.preventDefault();

        if (!content.trim()) {
            // Handle empty content case
            alert("Comment cannot be empty.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${backendUrl}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content, authorId: user.id, postId })
            });

            if (response.ok) {
                // Optionally handle successful comment creation
                // You might want to refetch the post or update the UI
                setContent(''); // Clear input field
                fetchPost();
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className={styles['comment-root']}>
            <div className={styles['comment-body-container']}>
            <h3 className={styles['comments-title']}>Comments</h3>
                <div className={styles['comment-body']}>
                    {post.comments?.map(comment => {
                        const commentAuthorIsUser = comment.authorId === user.id;
                        const commentAuthorIsPostAuthor = comment.authorId === post.authorId && post.authorId != user.id;

                        return (
                            <div key={comment.id} className={styles.commentDiv}>
                                <p className={styles.content}>{comment.content}</p>
                                <p className={styles.createdAt}><span className={`${styles.username} ${commentAuthorIsUser ? styles['author-is-user'] : ""} ${commentAuthorIsPostAuthor ? styles['author-is-post-author'] : ""}`}>{comment.author.username}</span>{comment.createdAtTime}, {comment.createdAtDate}</p>
                            </div>
                        )
                    }
                    )}
                    <form onSubmit={handleCreateComment} className={styles['new-comment-container']}>
                        <textarea 
                            name="content"
                            placeholder="Type a new comment..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className={styles['new-comment-textarea']}
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DisplayComments;