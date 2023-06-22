import axios from 'axios';
import { useState, useEffect } from 'react';

import { BiFace, BiSad } from 'react-icons/bi';
import { RxCross2, RxPlus, RxPaperPlane } from 'react-icons/rx'

export default function FriendsList({uId}) {
    const [friends, setFriends] = useState([]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`/api/user/${uId}/friends`); 
            const friendIdList = await response.data.friends;
            const friendsList = [];
            if (friendIdList) {
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
                setFriends(friendsList);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const removeFriend = async (fId) => {
        try {
            const data = {
                "uId": uId,
                "fId": fId
            }
            const response = await axios.delete('/api/user/friend', {data: data});
            console.info(response.data)
            const updatedFriends = friends.filter((friend) => friend.fId !== fId);
            setFriends(updatedFriends);
            handleRefresh();
        } catch (error) {
            console.log(error)
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return(
        <div className=' flex-col bg-neutral rounded-box p-4 space-y-4 w-full border-2 hover:border-primary'>
             <div>
                <h2 className='text-xl text-success'>Friends List</h2>
                <div className="border-b-2 border-gray-400"/>
            </div>
        {friends.length === 0 ? (
            <div className='flex text-2xl text-white items-center gap-x-4'>
                <BiSad className='text-4xl text-accent'/>
                <h2>No Friends yet</h2>
            </div>
            ) : (friends.map((friend) => (
            <div className='flex items-center gap-2 justify-between ' key={friend.fId}>
                <div className='flex items-center gap-2'>
                    {/* Icon */}
                    {/* <BiFace className='text-4xl text-success' /> */}
                    {/* Details */}
                    <div className='flex-col '>
                        <h2 className='text-xl text-secondary font-bold'>{friend.fname} {friend.lname}</h2>
                        <h3 className='text-[11px] text-base-100'>{friend.email}</h3>
                    </div>
                </div>
                {/* Button */}
                <button className='btn btn-circle btn-outline btn-error btn-xs' onClick={() => removeFriend(friend.fId)}>
                    <RxCross2 className='text-xl'/>
                </button>
            </div>
        )))}
        </div>
    );
}