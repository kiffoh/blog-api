import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../useAuth';
import { Link } from 'react-router-dom';
import DisplayComments from './DisplayComments';
import styles from './DisplayPost.module.css'

const backendUrl = import.meta.env.VITE_SERVER_URL;

function DisplayPost () {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to handle errors
    const navigate = useNavigate(); // Hook to navigate programmatically
    const { user } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedContent, setUpdatedContent] = useState('');

    const handleUpdateSubmit = async (event, published = false) => {
        event.preventDefault();
        // Make an API call to update the post
        try {
            const token = localStorage.getItem('token') 
            const response = await fetch(`${backendUrl}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: updatedTitle, content: updatedContent, published: published}),
            });

            if (response.ok) {
                setEditMode(false); // Exit edit mode after saving
                fetchPost();
            } else {
                console.error('Failed to update the post');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handlePublishClick = (event) => {
        handleUpdateSubmit(event, true); // Pass `true` to indicate publishing
    };

    const handleDeleteBtn = async () => {
        try {
            const token = localStorage.getItem('token')           
            
           const response = await fetch(`${backendUrl}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional, but good to include
            },
            })

            if (response.ok) {
                navigate('/');
            } else if (response.status === 404) {
                setError('Post not found.');
            } else {
                setError('An error occurred while trying to delete the post.');
            }
        } catch (err) {
            setError('An unexpected error occurred.')
            console.log(err);
        }
    }

    const fetchPost = useCallback( async () => {
        try {
            const response = await fetch(`${backendUrl}/posts/${postId}`);
            
            if (response.ok) {
                const data = await response.json();

                if (!data.published && user.id != data.authorId) {
                    // Redirect to an error page if the post is not published
                    navigate('/error', { state: { message: 'This post is not published yet.' } });
                    return;
                }

                setPost(data);
                setUpdatedTitle(data.title);
                setUpdatedContent(data.content);

            } else if (response.status === 404) {
                setError('Post not found.');
            } else {
                setError('An error occurred while trying to fetch the post.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [postId, navigate, user])


    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading message
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Display the error message
    }

    return (
        <div>
            {post ? (
                <>
                    {user && post.authorId === user.id ? ( // User wrote the post
                        editMode? (
                            <>
                                <h1 className={styles['edit-title']}>Edit your post</h1>
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className='btn-div'>
                                        <button type='submit' className={styles['save-btn']}>Save</button>
                                        <button onClick={() => setEditMode(false)} className={styles['cancel-btn']}>Cancel</button>
                                    </div>

                                    <label htmlFor="title" className={styles['title-edit-container']}><h2>Title</h2>
                                        <input
                                            type="text"
                                            name="title"
                                            value={updatedTitle}
                                            onChange={e => setUpdatedTitle(e.target.value)}
                                            className={styles['title-edit']}
                                        />
                                    </label>

                                    <label htmlFor="content" className={styles['content-edit-container']}><h2>Content</h2>
                                        <textarea
                                            name="content"
                                            value={updatedContent}
                                            onChange={e => setUpdatedContent(e.target.value)}
                                            className={styles['content-edit']}
                                        />
                                    </label>

                                    <div className='btn-div'>
                                        <button onClick={handleDeleteBtn} className={styles['delete-btn']}>Delete</button>
                                        <button onClick={handlePublishClick} className={styles['publish-btn']}>Publish</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className={styles['edit-home-btns']}>
                                    <Link to='/'>Home</Link>
                                    <button onClick={() => setEditMode(true)} className={styles['edit-btn']}>Edit</button>
                                </div>
                                <h1>{post.title}</h1>
                                <h2 className={`${styles['author-title']} ${styles['author-is-user']}`}>{post.author.username}</h2>
                                <p>{post.content}</p>
                                <p className={styles['last-updated']}><span className={styles.text}>Updated: </span>{post.updatedAtTime}, {post.updatedAtDate}</p>

                                <br></br>

                                {post.published && 
                                    <>
                                        <DisplayComments
                                            post={post}
                                            user={user}
                                            backendUrl={backendUrl}
                                            postId={postId}
                                            fetchPost={fetchPost}
                                        />
                                    </>
                                }
                            </>
                        )
                    ) : (
                        <>
                            <div>
                                <Link to='/'>Home</Link>
                                <h1>{post.title}</h1>
                                <h2 className={styles['author-title']}>{post.author.username}</h2>
                                <p>{post.content}</p>
                                <p className={styles['last-updated']}><span className={styles.text}>Updated: </span> {post.updatedAtTime}, {post.updatedAtDate}</p>
                                <br></br>
                            </div>
                        
                            {user ? (
                                <>
                                    <DisplayComments
                                        post={post}
                                        user={user}
                                        backendUrl={backendUrl}
                                        postId={postId}
                                    />
                                </>
                            ) : (
                                <h2><Link to="/users/log-in">Log In</Link> to view the comments for this post.</h2>
                            )}
                        </>
                    )}
                </>
                ) : (
                    <p>No post found.</p> // This case shouldn't normally be hit due to the error handling above
                )
            }
        </div>
    )
}

export default DisplayPost;