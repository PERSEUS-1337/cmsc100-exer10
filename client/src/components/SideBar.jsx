import { BiFace } from 'react-icons/bi';

import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SideBar({uId}) {

    const [user, setUser] = useState([]);
    useEffect(() => {
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
        fetchUser();
    }, []);

    return(
        <div className=' w-1/3 h-full'>
            {/* User Profile Details */}
            <div className='flex '>
                {/* Icon */}
                <BiFace className='text-4xl'></BiFace>
                {/* Details */}
                <div className=' flex-col '>
                    <h2 className=' text-2xl text-black'>{user.name}</h2>
                    <h3 className=' text-xl text-gray-500'>{user.email}</h3>
                </div>
            </div>
            {/* Friends Requests */}
            <h2 className='text-4xl'>Friend Requests</h2>
            <FriendRequests
                uId={uId}
            />
            {/* Friends List */}
            <h2 className='text-4xl'>Friends List</h2>
            <FriendsList
                uId={uId}
            />
        </div>
    );
}