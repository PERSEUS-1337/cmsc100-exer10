import axios from 'axios';
import React, { useState } from 'react';

import { BiFace, BiEdit } from 'react-icons/bi';

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
        <div className='flex-col'>
            {isAlertVisible && (
                <div className="alert">
                    {alertMessage}
                    <button onClick={() => setIsAlertVisible(false)}>Close</button>
                </div>
            )}
            <h1>
                Post Something
            </h1>
            <div className="border-b-2 border-gray-400"/>
            <div className='flex justify-between'>
                <BiFace className='text-6xl text-neutral' />
                <textarea 
                className="textarea textarea-ghost"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                />
                <button onClick={handlePostCreate}>
                    <BiEdit className='text-6xl text-primary' />
                </button>
            </div>
        </div>
    );
}