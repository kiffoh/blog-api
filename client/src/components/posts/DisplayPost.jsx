import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../useAuth';
import { Link } from 'react-router-dom';
import DisplayComments from './DisplayComments';

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

    const handleUpdateSubmit = async (event) => {
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
                body: JSON.stringify({ title: updatedTitle, content: updatedContent}),
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

                if (!data.published) {
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
    }, [postId, navigate])


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
                    {user && post.authorId === user.id ? ( // Assuming you retrieve the logged-in user somehow
                        editMode? (
                            <>
                                <form onSubmit={handleUpdateSubmit}>
                                    <button type='submit'>Update</button>
                                    <button onClick={() => setEditMode(false)}>Cancel</button>
                                    <button onClick={handleDeleteBtn}>Delete</button>
                                    <input
                                        type="text"
                                        name="title"
                                        value={updatedTitle}
                                        onChange={e => setUpdatedTitle(e.target.value)}
                                    />
                                    <textarea
                                        name="content"
                                        value={updatedContent}
                                        onChange={e => setUpdatedContent(e.target.value)}
                                    />
                                </form>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setEditMode(true)}>Edit</button>
                                <Link to='/'>Home</Link>
                                <h1>{post.title}</h1>
                                <p>Author: {post.author.username}</p>
                                <p>{post.content}</p>
                                <p>Last updated: {post.updatedAtTime}, {post.updatedAtDate}</p>

                                <br></br>
                                <h5>Comments</h5>
                                <DisplayComments
                                    post={post}
                                    user={user}
                                    backendUrl={backendUrl}
                                    postId={postId}
                                    fetchPost={fetchPost}
                                />
                            </>
                        )
                    ) : (
                        <>
                            <div>
                                <Link to='/'>Home</Link>
                                <h1>{post.title}</h1>
                                <p>Author: {post.author.username}</p>
                                <p>{post.content}</p>
                                <p>Last updated: {post.updatedAtTime}, {post.updatedAtDate}</p>
                                <br></br>
                            </div>
                        
                            {user ? (
                                <>
                                    <h5>Comments</h5>
                                    <DisplayComments
                                        post={post}
                                        user={user}
                                        backendUrl={backendUrl}
                                        postId={postId}
                                    />
                                </>
                            ) : (
                                <h6><Link to="/users/log-in">Log In</Link> to view the comments for this post.</h6>
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