// Lists of post on this page - will replace app.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css'
import useAuth from "../useAuth";
import DisplayPosts from "./posts/PostPage";


const backendUrl = import.meta.env.VITE_SERVER_URL;

function HomePage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);

    const [publishedPosts, setPublishedPosts] = useState([]);
    const [unpublishedPosts, setUnpublishedPosts] = useState([]);
       
    useEffect(() => {
        const getAllPosts = async () => {
            try {
                const response = await fetch(`${backendUrl}/posts`)

                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                    setPublishedPosts(data.filter(post => post.published))
                } else {
                    setError('Failed to fetch posts.')
                }
            } catch (err) {
                setError('An unknown error occurred.')
            } finally {
                console.log('Use Effect is triggered again.')
                setLoading(false);
            }
            
        }
        getAllPosts();
    }, [])

    useEffect(() => {
        const FindUnpublishedPosts = () => {
            if (posts && user) {
                setUnpublishedPosts(posts.filter(post => !post.published && post.authorId === user.id))
            }
            
        }
        FindUnpublishedPosts();
    }, [user, posts])

    const LogOut  = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <>
            {user ? (
                <>
                    <div className="btn-div">
                        <button onClick={LogOut}>Log Out</button>
                        <button onClick={() => navigate(`/users/${user.id}/unpublished`, {state: {posts: unpublishedPosts}})}>View Saved Posts</button>
                    </div>
                
                    <h1>Welcome to the blog, {user.username}.</h1>
                </>             
                ) : (
                    <>
                        <div className="btn-div">
                            <Link to="/users/log-in">Log In</Link>
                            <Link to="/users/sign-up">Sign Up</Link>
                        </div>
                        <h1>Welcome to the blog</h1>
                    </>
                )}
            <Link to="/posts">+ Post</Link>

            <DisplayPosts posts={publishedPosts} loading={loading} error={error}/>
            
        </>
    )
    ;
    
}

export default HomePage;