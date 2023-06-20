import axios from 'axios';
import { BiFace } from 'react-icons/bi';
import { useState, useEffect } from 'react';

export default function FriendsList({uId}) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`/api/user/${uId}/friends`); // Replace with your API endpoint
                const friendIdList = await response.data.friends;
                const friendsList = [];
                for (const friendId of friendIdList) {
                    const friendResponse = await axios.get(`/api/user/${friendId}`);
                    const friendData = {
                        fname: friendResponse.data.user.fname,
                        lname: friendResponse.data.user.lname,
                        email: friendResponse.data.user.email,
                        fId: friendResponse.data.user._id,
                    }
                    friendsList.push(friendData);
                }
                setFriends(friendsList)
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, []);

    const removeFriend = (friendId) => {
        // Logic to remove the friend with the given friendId
    };


    return(
         <div>
        {friends.map((friend) => (
            <div className='flex border-2 border-red-700' key={friend.fId}>
            {/* Icon */}
            <BiFace className='text-4xl' />
            {/* Details */}
            <div className='flex-col border-2 border-blue-500'>
                <h2 className='text-2xl text-black'>{friend.fname} {friend.lname}</h2>
                <h3 className='text-xl text-gray-500'>{friend.email}</h3>
            </div>
            {/* Button */}
            <button className='btn btn-outline btn-error' onClick={() => removeFriend(friend.id)}>
                Remove
            </button>
            </div>
        ))}
        </div>
        // <div>
        // {friends.map((friend) => (
        //     <div className='flex border-2 border-red-700' key={friend.id}>
        //     {/* Icon */}
        //     <BiFace className='text-4xl' />
        //     {/* Details */}
        //     <div className='flex-col border-2 border-blue-500'>
        //         <h2 className='text-2xl text-black'>{friend.name}</h2>
        //         <h3 className='text-xl text-gray-500'>@{friend.username}</h3>
        //     </div>
        //     {/* Button */}
        //     <button className='btn btn-outline btn-error' onClick={() => removeFriend(friend.id)}>
        //         Remove
        //     </button>
        //     </div>
        // ))}
        // </div>
    );
}