import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { AiOutlineSend } from 'react-icons/ai';

export default function CommentsList({uId, comments}) {
    const { pId } = useParams();

    const [comment, setComment] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const handleCommentCreate = async () => {
        try {
            if (!comment) {
                // Handle empty comment
                console.log('Comment is empty');
                return;
            }

            const postData = {
                uId: uId,
                pId: pId,
                text: comment,
            };

            // Send a POST request to the backend API to create the comment
            const response = await axios.post('/api/post/comment', postData);
            // Handle successful comment creation (e.g., show success message, update post list, etc.)
            setAlertMessage('Success! ' + response.data.msg);
            setIsAlertVisible(true);

            // Clear the textarea after successful post creation
            setComment('');
            handleRefresh();
        } catch (error) {
            // Handle error (e.g., show error message, logging, etc.)
            console.error(error);
            setAlertMessage('Error: ' + error.response.data.err);
            setIsAlertVisible(true);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return(
        <div className='flex-col'>
            <div className='flex justify-between'>
                <div className=" w-full max-w-xs bg-slate-50 my-2 rounded-box p-2">
                    <label className="label">
                        <span className="label-text-alt">Write a comment</span>
                    </label>
                    <div className='flex gap-4'>
                        <input type="text" placeholder="Type here" value={comment} onChange={(e) => setComment(e.target.value)} className="input input-bordered w-full max-w-xs" />
                        <button onClick={handleCommentCreate}>
                            <AiOutlineSend className='text-3xl text-primary' />
                        </button>
                    </div>
                </div>
            </div>
            {isAlertVisible && (
                <label className="label">
                    <span className="label-text text-success">{alertMessage}</span>
                </label>
            )}
            <div className='flex-col'>
                <label className="label">
                    <span className="label-text text-lg text-black">Comments</span>
                </label>
                <div className="border-b-2 border-gray-400"/>
                <div className='flex-col p-4 space-y-4'>
                    {comments?.length > 0 ? (comments?.map((comment) => (
                        <div key={comment._id} className=''>
                            <h1 className='text-xl text-primary'>{comment.authorName}</h1>
                            <p className='text-md'>{comment.text}</p>
                            <p className='text-xs text-right text-slate-400 italic'>{comment.createdAt}</p>
                        </div>
                    ))): (
                       <div className="text-center text-slate-500">No comments yet</div> 
                    )}
                </div>
            </div>
        </div>
    );
}