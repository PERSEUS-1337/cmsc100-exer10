import axios from 'axios';
import { useState, useEffect } from 'react';

import { BiFace } from 'react-icons/bi';
import { RxCross2, RxPlus, RxPaperPlane } from 'react-icons/rx'

export default function FriendRequests({uId}) {
    const [requests, setRequests] = useState([]);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`/api/user/${uId}/requests`); 
            const requestIdList = await response.data.requests;
            const requestList = [];
            if (requestIdList){
                for (const requestId of requestIdList) {
                    const requestResponse = await axios.get(`/api/user/${requestId._id}`);
                    const requestData = {
                        fname: requestResponse.data.user.fname,
                        lname: requestResponse.data.user.lname,
                        email: requestResponse.data.user.email,
                        fId: requestResponse.data.user._id,
                        status: requestId.status
                    }
                    requestList.push(requestData);
                }
                setRequests(requestList)
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    // ACCEPT FRIEND REQUEST
    const acceptFriend = async (fId) => {
        try {
            const data = {
                "uId": uId,
                "fId": fId
            }
            const response = await axios.post('/api/user/request', data);
            const updatedFriends = requests.filter((request) => request.fId !== fId);
            setRequests(updatedFriends);
            handleRefresh();
        } catch (error) {
            console.log(error)
        }
    };

    // REJECT FRIEND REQUEST
    const rejectFriend = async (fId) => {
        try {
            const data = {
                "uId": uId,
                "fId": fId
            }
            const response = await axios.delete('/api/user/request', {data: data});
            const updatedFriends = requests.filter((request) => request.fId !== fId);
            setRequests(updatedFriends);
        } catch (error) {
            console.log(error)
        }
        
    };
    
    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    return(
        <div className=' flex-col bg-neutral rounded-box p-4 space-y-4 w-full'>
            <div>
                <h2 className='text-xl text-accent'>Friend Requests</h2>
                <div className="border-b-2 border-gray-400"/>
            </div>
            {requests.map((request) => (
                <div className='flex items-center gap-2 justify-between' key={request.fId}>
                    <div className='flex items-center gap-2'>
                        {/* Icon */}
                        {/* <BiFace className='text-4xl text-accent'/> */}
                        {/* Details */}
                        <div className='flex-col '>
                            <h2 className='text-xl text-secondary font-bold'>{request.fname} {request.lname}</h2>
                            <h3 className='text-[11px] text-base-100'>{request.email}</h3>
                        </div>
                    </div>
                    {/* Interaction Buttons */}
                    <div className='flex border-white space-x-2'>
                        <div>
                            {request.status === 'received' ? (
                                <button className='btn btn-circle btn-xs btn-outline btn-success' onClick={() => acceptFriend(request.fId)}>
                                    <RxPlus className='text-xl'/>
                                </button>
                            ) : (
                                <div></div>
                                // <button className='btn btn-disabled btn-circle btn-xs btn-outline btn-primary' onClick={() => acceptFriend(request.fId)}>
                                //     <RxPlus className='text-xl'/>
                                // </button>
                            )}
                        </div>
                        <button className='btn btn-circle btn-outline btn-error btn-xs' onClick={() => rejectFriend(request.fId)}>
                            <RxCross2 className='text-xl'/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}