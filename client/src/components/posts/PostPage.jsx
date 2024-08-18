
import styles from '../HomePage.module.css'
import { Link } from "react-router-dom";
// All posts page

function DisplayPosts ({posts, loading, error}) {
    if (loading) return <h4>Loading...</h4>

    if (error) return <div style={{ color: 'red' }}>{error}</div>; // Display the error message

    return (
        <>
            {posts? (
                <div className={styles.displayedPosts}>
                    {posts.map(post => (
                        <div key={post.id} className={styles.postDiv}>
                            <p className={styles.title}>
                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                            </p>
                            <p>Author: <span className={styles.username}>{post.author.username}</span></p>
                        </div>
                    ))}
                </div>
            ) : (
                <h3>There are no posts.</h3>
            )}
        </>
    )
}

export default DisplayPosts;