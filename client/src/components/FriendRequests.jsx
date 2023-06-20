import axios from 'axios';
import { BiFace } from 'react-icons/bi';
import { useState, useEffect } from 'react';

export default function FriendRequests({uId}) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get(`/api/user/${uId}/requests`); 
                const requestIdList = await response.data.requests;
                console.log(requestIdList)
                const requestList = [];
                for (const requestId of requestIdList) {
                    // console.log(requestId._id)
                    const requestResponse = await axios.get(`/api/user/${requestId._id}`);
                    const requestData = {
                        fname: requestResponse.data.user.fname,
                        lname: requestResponse.data.user.lname,
                        email: requestResponse.data.user.email,
                        fId: requestResponse.data.user._id,
                    }
                    requestList.push(requestData);
                }
                setRequests(requestList)
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
    }, []);

    // ACCEPT FRIEND REQUEST
    const acceptFriend = async (fId) => {
        try {
            const data = {
                "uId": uId,
                "fId": fId
            }
            const response = await axios.post('/api/user/request', data);
            console.info(response.data)
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
            console.info(response.data)
            const updatedFriends = requests.filter((request) => request.fId !== fId);
            setRequests(updatedFriends);
            handleRefresh();
        } catch (error) {
            console.log(error)
        }
        
    };
    
    const handleRefresh = () => {
        window.location.reload();
    };

    return(
         <div>
        {requests.map((request) => (
            <div className='flex border-2 border-red-700' key={request.fId}>
            {/* Icon */}
            <BiFace className='text-4xl' />
            {/* Details */}
            <div className='flex-col border-2 border-blue-500'>
                <h2 className='text-2xl text-black'>{request.fname} {request.lname}</h2>
                <h3 className='text-xl text-gray-500'>{request.email}</h3>
            </div>
            {/* Button */}
            <button className='btn btn-outline btn-success' onClick={() => acceptFriend(request.fId)}>
                Accept
            </button>
            <button className='btn btn-outline btn-error' onClick={() => rejectFriend(request.fId)}>
                Remove
            </button>
            </div>
        ))}
        </div>
    );
}