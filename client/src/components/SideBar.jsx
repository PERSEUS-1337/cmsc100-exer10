import { BsPersonCircle } from 'react-icons/bs';

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
        <div className=' w-2/3 h-min bg-white rounded-box p-2 space-y-2'>
            {/* User Profile Details */}
            <div className='flex items-center bg-base-100 rounded-box p-4 gap-2 w-full'>
                {/* Icon */}
                {/* <BsPersonCircle className='text-4xl text-neutral'/> */}
                {/* Details */}
                <div className=' flex-col '>
                    <h2 className=' text-2xl text-neutral font-bold'>{user.name}</h2>
                    <h3 className=' text-sm text-gray-500'>{user.email}</h3>
                </div>
            </div>
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