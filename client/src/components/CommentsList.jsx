import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { BiFace, BiEdit } from 'react-icons/bi';
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

            console.log(pId)

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
        <div>
            <div className='flex-col'>
            {isAlertVisible && (
                <div className="alert alert-success">
                    <span>
                        {alertMessage}
                    </span>
                </div>
            )}
            <div className="border-b-2 border-gray-400"/>
                <div className='flex justify-between'>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Write a comment</span>
                        </label>
                        <input type="text" placeholder="Type here" value={comment} onChange={(e) => setComment(e.target.value)} className="input input-bordered w-full max-w-xs" />
                    </div>
                    <button onClick={handleCommentCreate}>
                        <AiOutlineSend className='text-4xl text-primary' />
                    </button>
                </div>
            </div>
            
            {comments?.map((comment) => (
                <div key={comment._id}>
                    <h1 className='text-4xl'>{comment.authorName}</h1>
                    <p>{comment.text}</p>
                    <p>{comment.createdAt}</p>
                </div>
            ))}
        </div>
    );
}