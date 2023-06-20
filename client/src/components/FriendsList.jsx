import axios from 'axios';
import { BiFace } from 'react-icons/bi';
import { useState, useEffect } from 'react';

export default function FriendsList({uId}) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`/api/user/${uId}/friends`); // Replace with your API endpoint
                const data = await response.data.friends;
                setFriends(data); // Update the friends state with the fetched data
                console.log(friends);
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
            <div className='flex border-2 border-red-700' key={friend.id}>
            {/* Icon */}
            <BiFace className='text-4xl' />
            {/* Details */}
            <div className='flex-col border-2 border-blue-500'>
                <h2 className='text-2xl text-black'>{friend.name}</h2>
                <h3 className='text-xl text-gray-500'>@{friend.username}</h3>
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