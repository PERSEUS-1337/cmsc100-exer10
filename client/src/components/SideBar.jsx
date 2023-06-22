import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';

export default function SideBar({uId}) {
    const navigate = useNavigate();

    const [user, setUser] = useState([]);

    const fetchUser = async () => {
        try {
            // Get the feed of the user that contains user posts and friends' posts
            const response = await axios.get(`/api/user/${uId}`)
            const responseData = await response.data.user;
            const userDetails = {
                name: responseData.fname + " " + responseData.lname,
                email: responseData.email
            }

            setUser(userDetails);
        } catch (error) {
            console.error(error);
        }
    };

     const handleLogout = () => {
        // Remove the uId and token from session storage
        sessionStorage.removeItem('uId');
        sessionStorage.removeItem('jwtToken');

        // Redirect to the home page
        navigate('/');
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return(
        <div className=' w-96 h-min bg-white rounded-box p-4 space-y-4'>
            {/* User Profile Details */}
            <div className='flex-col items-center bg-slate-300 rounded-box p-4 w-full border-2 hover:border-primary'>
                {/* Details */}
                <h2 className=' text-2xl text-neutral font-bold'>{user.name}</h2>
                <h3 className=' text-sm text-gray-500'>{user.email}</h3>
            </div>
            {/* Logout Button */}
            <button className='rounded-box btn btn-sm btn-error btn-outline btn-block' onClick={handleLogout}>
                Logout
            </button>
            {/* Friends Requests */}
            <FriendRequests
                uId={uId}
            />
            {/* Friends List */}
            <FriendsList
                uId={uId}
            />
        </div>
    );
}