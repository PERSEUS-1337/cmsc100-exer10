import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import { BiFace, BiEdit } from 'react-icons/bi';
import { AiOutlineLike, AiOutlineArrowLeft } from 'react-icons/ai'
import { MdOutlineDeleteOutline } from 'react-icons/md'

import NavBar from '../components/NavBar';
import CommentsList from '../components/CommentsList';

export default function PostPage(){
    const uId = sessionStorage.getItem('uId');
    const { pId } = useParams();
    
    const [feed, setPost] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(feed.content);

    const handleRemovePost = async () => {
        try {
            const requestData = {
                uId: uId,
                pId: pId
            };

            // TODO: Show modal alert if success or not
            const response = await axios.delete('/api/post', {data: requestData});
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleSaveContent = async () => {
        // Save the modified content or cancel the edit mode
        try {
            if (isEditing) {
                // Perform the save operation with editedContent
                const requestData = {
                    uId: uId,
                    pId: pId,
                    update: editedContent
                };
                
                var updatedPost = feed;
                updatedPost.content = editedContent
                
                const response = await axios.patch('/api/post', requestData);
    
                // Exit the editing mode
                setPost(updatedPost)
                setIsEditing(false);
            } else {
                // Enter the editing mode
                setIsEditing(true);
            }
        } catch (error) {

        }
    };

    const fetchPost = async () => {
        try {
            // Get the feed of the user that contains user posts and friends' posts
            const response = await axios.get(`/api/post/${pId}`)
            const responseData = response.data.post;
            
            const userResponse = await axios.get(`/api/user/${responseData.author}`)
            const userData = userResponse.data.user;
            
            for (const object of responseData.comments) {
                const commentResponse = await axios.get(`/api/user/${object.author}`);
                const commentData = commentResponse.data.user;
                object.authorName = commentData.fname + " " + commentData.lname;
            }

            const date = new Date(responseData.createdAt);
            const formattedDate = date.toLocaleString();

            const postDetails = {
                aId: responseData.author,
                author: userData.fname + " " + userData.lname,
                createdAt: formattedDate,
                content: responseData.content,
                likes: responseData.likes.length,
                comments: responseData.comments
            }
            
            setPost(postDetails)
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        fetchPost();
    }, [pId]);
    
    return(
        <div>
            <NavBar />
            <div className='flex ' key={feed.pId}>
                {/* Interaction Column */}
                <div className='flex-col'>
                    <Link to='/feed'>
                        <button className='btn btn-outline btn-neutral'>
                            <AiOutlineArrowLeft className='text-4xl'/>
                        </button>
                    </Link>
                    {/* Remove Button */}
                    {feed.aId === uId && (
                        <div className='flex border-4'>
                            <button className='btn btn-outline btn-error' onClick={handleRemovePost}>

                                <MdOutlineDeleteOutline className='text-4xl' />
                            </button>
                            <button className='btn btn-outline btn-primary' onClick={() => {
                                if (isEditing) {
                                    handleSaveContent(feed.aId);
                                }
                                setIsEditing(!isEditing);
                                }}>
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                        </div>
                    )}
                </div>
                {/* Post Details */}
                <div className='flex-col '>
                    {/* Post Author */}
                    <div className='flex '>
                        <BiFace className='text-6xl text-neutral' />
                        <div className='flex-col'>
                            <h1 className='text-4xl'>
                                {feed.author}
                            </h1>
                            <p>
                                {feed.createdAt}
                            </p>
                        </div>
                    </div>
                    {/* Post Content */}
                    <div>
                        {isEditing ? (
                            <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="textarea"
                            placeholder={feed.content}
                            />
                        ) : (
                            <p className='text-3xl'>{feed.content}</p>
                        )}
                    </div>
                    {/* Comments */}
                    <div>
                        <CommentsList
                            uId={uId}
                            comments={feed.comments}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}