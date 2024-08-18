// Post form page
import { useState, useEffect, useRef } from "react"
import useAuth from "../../useAuth";
import { Link, useNavigate } from "react-router-dom";
// Another question I have. If I am validating data on the backend, should I do it on the fronend as well?
// How do I validate it in the same way?
const backendUrl = import.meta.env.VITE_SERVER_URL;

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scroll height
        }
    }, [content]); // Adjust height when content changes


    if (!user) return <div>Please <Link to="/users/log-in">Log In</Link> to create a post.</div>

    const handlePublish = async (event, publishStatus) => {
        event.preventDefault();

        // Basic validation
        if (!title.trim() || !content.trim()) {
            setErrorMessage('Title and content are required.');
            return;
        }

        const token = localStorage.getItem('token');
        
        const response = await fetch(`${backendUrl}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, published: publishStatus})
        })
        

        if (response.ok) {
            const data = await response.json();

            if (publishStatus) {
                navigate(`/posts/${data.id}`);
            } else {
                // Optionally handle redirect or state update when saving as draft
                setErrorMessage('Post saved as draft.');
            }
        } else {
            setErrorMessage('The post creation failed. Please try again.')
        }
    }

    return (
        <>
            <h1>Create a new post</h1>
            <form onSubmit={handlePublish}>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <label htmlFor="title">Post Title:</label>
            <input 
                type="text"
                name="title"
                placeholder="The greatest emotion"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <label htmlFor="content">Content:</label>
            <textarea 
                ref={textareaRef}
                name="content"
                placeholder="To be postive and complacent... "
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ overflow: "hidden" }} // Hide scrollbars
                rows="3" // Start with one row
            />
            <div className="btn-div">   
                <button type="button" onClick={(e) => handlePublish(e, false)}>Save</button>
                <button type="button" onClick={(e) => handlePublish(e, true)}>Publish</button>
            </div>
            
        </form>
        </>
        
    )
}

export default CreatePost;