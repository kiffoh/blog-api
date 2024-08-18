// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // Current time in seconds

                    // Check if the token has expired
                    if (decodedToken.exp < currentTime) {
                        // Token expired
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        // Token is valid
                        setUser(decodedToken);
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
        }
        checkTokenValidity();
    }, [location]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
