// useAuth.js
import { useContext } from 'react';
import AuthContext from './AuthContext';

// Custom hook to use the AuthContext
function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;