import axios from 'axios';
import React, { useState } from 'react';

import { BiEdit } from 'react-icons/bi';

export default function CreatePost({uId}) {
    const [postContent, setPostContent] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const handlePostCreate = async () => {
        try {
            if (!postContent) {
                // Handle empty post content
                console.log('Post content is empty');
                return;
            }

            const postData = {
                uId: uId,
                content: postContent,
            };

            // Send a POST request to the backend API to create the post
            const response = await axios.post('/api/post', postData);
            // Handle successful post creation (e.g., show success message, update post list, etc.)
            setAlertMessage('Success! ' + response.data.msg);
            setIsAlertVisible(true);

            // Clear the textarea after successful post creation
            setPostContent('');
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
        <div className='flex-col bg-white rounded-box p-4'>
            <div>
                <label className="label">
                    <span className="label-text text-neutral text-2xl">Post Something</span>
                </label>
                <div className="border-b-2 border-gray-400 "/>
            </div>
            <div className='flex justify-between items-center gap-4'> 
                <textarea 
                    className="textarea textarea-accent w-full max-w-x my-2"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />
                <button className='btn btn-circle btn-outline btn-primary btn-md' onClick={handlePostCreate}>
                    <BiEdit className='text-4xl' />
                </button>
            </div>
            {isAlertVisible && (
                <label className="label">
                    <span className="label-text text-success">{alertMessage}</span>
                </label>
            )}
        </div>
    );
}