import React from 'react';
import { useNavigate } from 'react-router-dom';

// Header component
const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken'); // Check for the token in localStorage

    const handleLogout = () => {
        // Clear the token from localStorage and redirect to login page
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        navigate('/signin');
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">Game Metaverse</div>
            <nav>
                <ul className="flex space-x-4">
                    {/* Show Login and Signup buttons if the user is not authenticated */}
                    {!token ? (
                        <>
                            <li>
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                                >
                                    Login
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                                >
                                    Signup
                                </button>
                            </li>
                        </>
                    ) : (
                        // Show Logout button if the user is authenticated
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
