import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

import { GoGitMerge } from 'react-icons/go';
import { BsSearch, BsPersonAdd } from 'react-icons/bs';
import { BiSad } from 'react-icons/bi'

export default function NavBar({uId}) {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/user/${uId}/search?search=${searchQuery}`);
            const searchData = response.data.users;
            
            const userResponse1 = await axios.get(`/api/user/${uId}/friends`)
            const userResponse2 = await axios.get(`/api/user/${uId}/requests`)
            const userFriends = userResponse1.data.friends;
            const userFriendRequests = userResponse2.data.requests;

            const reduceduserFriendRequests = userFriendRequests.map((obj) => obj._id);

            for (const user of searchData){
                user.isAFriend = false
                if (userFriends)
                    if (userFriends.includes(user._id))
                        user.isAFriend = true

                if (reduceduserFriendRequests)
                    if (reduceduserFriendRequests.includes(user._id))
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
            await axios.post(`/api/user/friend`, data);
            handleRefresh();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return(
        <div className=" navbar bg-white rounded-box h-20 flex gap-4 p-4 drop-shadow-lg justify-between">
            {/* Logo */}
            <div className='flex text-neutral normal-case p-4 hover:bg-slate-100 rounded-box' onClick={() => navigate('/')}>
                <GoGitMerge className='text-4xl'></GoGitMerge>
                <h1 className=' text-4xl'>BookFace</h1>
            </div>
            {/* Search Bar */}
            {uId && (
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search for a user"
                        className="input input-primary "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* Search Results Dropdown */}
                    <div className="dropdown dropdown-bottom dropdown-end drop-shadow-2xl">
                        <label tabIndex={0} className="btn btn-outline btn-primary btn-circle" onClick={handleSearch}>
                            <BsSearch className='text-3xl'/>
                        </label>
                        <ul tabIndex={0} className="menu flex dropdown-content z-[1] bg-inherit rounded-box mt-4">
                            <div className="flex-col bg-neutral rounded-lg w-max p-4 space-y-2">
                                <div>
                                    <h1 className='text-xl text-secondary px-4'>Search Results</h1>
                                    <div className="border-b-2 border-gray-400 mx-4"/>
                                </div> 
                            {searchResults.length > 0 ? (
                                <div>
                                    {searchResults.map((user) => (
                                        <li key={user._id}><a className='hover:bg-slate-500 flex justify-between'>
                                            {/* User Details */}
                                            <div key={user._id} className="">
                                                <p className='text-2xl font-bold text-secondary'>{user.fname} {user.lname}</p>
                                                <p className='text-base-100'>{user.email}</p>
                                            </div>
                                            {/* Send Friend Request button */}
                                            <div>
                                                {!user.isAFriend && (
                                                    <button className='btn btn-md btn-accent btn-outline' onClick={() => sendFriendRequest(user._id)}>
                                                        <BsPersonAdd className='text-4xl'/>
                                                    </button>
                                                )}
                                            </div>
                                        </a></li>
                                    ))}
                                </div>
                            ):(
                                <div className='flex text-2xl text-white items-center gap-x-4 bg-neutral rounded-lg w-max p-4 space-y-2'>
                                    <BiSad className='text-4xl text-accent'/>
                                    <h2>No users found...</h2>
                                </div>
                            )}
                            </div>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}