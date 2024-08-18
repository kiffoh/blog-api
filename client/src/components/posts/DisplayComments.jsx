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
        <div>
            {post.comments?.map(comment => (
                <div key={comment.id} className={styles.commentDiv}>
                    <p className={styles.content}>{comment.content}</p>
                    <p className={styles.username}>{comment.author.username}</p>
                    <p className={styles.createdAt}>{comment.createdAtTime}, {comment.createdAtDate}</p>
                </div>
            ))}
            <form onSubmit={handleCreateComment}>
                <label htmlFor="content">
                    {user.username}:
                    <input 
                        type="text"
                        name="content"
                        placeholder="Type a new comment..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </label>
                <button type="submit">Post Comment</button>
            </form>
        </div>
    )
}

export default DisplayComments;