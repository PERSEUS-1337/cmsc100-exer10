import { BsSearch, BsPersonAdd } from 'react-icons/bs';
import { GoGitMerge } from 'react-icons/go';

import { useState } from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

export default function NavBar({uId}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/user/${uId}/search?search=${searchQuery}`);
            const searchData = response.data.users;
            
            const userResponse1 = await axios.get(`api/user/${uId}/friends`)
            const userResponse2 = await axios.get(`api/user/${uId}/requests`)
            const userFriends = userResponse1.data.friends;
            const userFriendRequests = userResponse2.data.friends;

            for (const user of searchData){
                user.isAFriend = false
                if (userFriends)
                    if (userFriends.includes(user._id))
                        user.isAFriend = true

                if (userFriendRequests)
                    if (userFriendRequests.includes(user._id))
                        user.isAFriend = true
            }
            
            setSearchResults(searchData);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const sendFriendRequest = async (fId) => {
        try {
            // Send a friend request to the user with the specified userId
            const data = {
                "uId": uId,
                "fId": fId
            }
            const response = await axios.post(`/api/user/friend`, data);
            const responseData = response.data;
            handleRefresh();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return(
        <div className=" navbar bg-base-300 rounded-box h-20 flex gap-4">
            {/* Logo */}
            <Link to='/'>
                <div className='flex '>
                    <GoGitMerge className='text-4xl'></GoGitMerge>
                    <h1 className=' text-4xl'>BookFace</h1>
                </div>
            </Link>
            {/* Search Bar */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search for a user on Bookface"
                    className="input input-bordered w-full max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-primary rounded-btn" onClick={handleSearch}>
                    Search
                </label>
                {/* Search Results Dropdown */}
                <ul tabIndex={0} className="menu flex dropdown-content z-[1] bg-inherit rounded-box w-0 mt-4">
                    {searchResults.length > 0 && (
                        <div className="flex-col absolute bg-white shadow-lg mt-2 py-2 rounded-lg">
                            {searchResults.map((user) => (
                                <li key={user._id}><a>
                                    <div key={user._id} className="px-4 py-2">
                                        <p className='text-2xl text-black'>{user.fname} {user.lname}</p>
                                        <p>{user.email}</p>
                                    </div>
                                    {/* Send Friend Request button */}
                                    {!user.isAFriend && (
                                        <button className='btn btn-primary btn-outline' onClick={() => sendFriendRequest(user._id)}>
                                            <BsPersonAdd className='text-4xl'/>
                                        </button>
                                    )}
                                </a></li>
                            ))}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}