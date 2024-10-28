import { useState, useEffect } from 'react';
import useAuth from '../../useAuth';
import { useNavigate  } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import styles from './usersStyles.module.css';
const backendUrl = import.meta.env.VITE_SERVER_URL;

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // Use useEffect to handle navigation after component renders
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]); // Only re-run this effect if user or navigate changes

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim() || !password.trim()) {
            setErrorMessage('Email and password are required.');
            return;
        }

        const response = await fetch(`${backendUrl}/users/log-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        

        if (response.ok) {
            // Handle successful login
            const data = await response.json();  // Assuming your server returns the token in the response body
            const token = data.token;
            
            // Store the token in localStorage
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            setUser(decodedToken);
    
            // Redirect to posts or the desired page after successful login
            navigate('/');
        } else {
            // Handle log in error
            setErrorMessage('Login failed. Please try again.')
        }
    }

    return (
        <>
            <h1>Log In</h1>
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
                
                <label htmlFor='password'><h2>Password</h2>
                    <input 
                    type='password'
                    name='password'
                    placeholder='********'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </label>

                <div className='btn-div'>
                    <button className="sign-up-btn" onClick={() => navigate("/users/sign-up")} type='button'>Sign Up</button>
                    <button type='submit'>Log In</button>
                </div>
            </form>
            
        </>
        
    );
}

export default LoginForm;