import { useLocation } from "react-router-dom";
import DisplayPosts from "../posts/PostPage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UnpublishedPosts () {
    const location = useLocation();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unpublishedPosts, setUnpublishedPosts] = useState([]);

    useEffect(() => {
        try {
            const { posts } = location.state || {};
            setUnpublishedPosts(posts || []);
        } catch (err) {
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false);
        }
    }, [location.state])
    

    return (
        <>
            <Link to="/">Home</Link>
            <h1>Your Saved posts</h1>
            <DisplayPosts posts={unpublishedPosts} loading={loading} error={error} />
        </>
    )
}

export default UnpublishedPosts;