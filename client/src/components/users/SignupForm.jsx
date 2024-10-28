import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../useAuth';
import styles from './usersStyles.module.css';
const backendUrl = import.meta.env.VITE_SERVER_URL;

function SignupForm() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Use useEffect to handle navigation after component renders
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]); // Only re-run this effect if user or navigate changes

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim() || !username.trim() || !password.trim()) {
            setErrorMessage('Email, username and password are required.');
            return
        }

        const response = await fetch(`${backendUrl}/users/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
        });

        if (response.ok) {
            // const data = await response.json();

            // Handle successful login
            /* 
            if (response.header != null) { // Redirect to specific post if not logged in
                res.redirect('posts/postId/comments')
            }
            res.redirect('/posts')
            */
           // Redirect to posts or the desired page after successful login
           navigate('/users/log-in');
        } else {
            // Handle log in error
            setErrorMessage('Sign-up failed. Please try again.')
        }
    }

    return (
        <>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <label htmlFor='email'><h2>Email</h2>
                    <input 
                    type='email'
                    name='email'
                    placeholder='ilovethisblog@bloglovers.blog'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                </label>

                <label htmlFor='username'><h2>Username</h2>
                    <input
                    type='text'
                    name='username'
                    placeholder='username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    />
                </label>
                
                <label htmlFor='password'><h2>Password</h2>
                    <input 
                    type='password'
                    name='password'
                    placeholder='********'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </label>

                <button type='submit'>Sign Up</button>
            </form>
        </>
        
    );
}

export default SignupForm;