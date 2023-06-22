import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import { BiFace, BiEdit } from 'react-icons/bi';
import { AiOutlineLike, AiOutlineArrowLeft } from 'react-icons/ai'
import { MdOutlineDeleteOutline, MdOutlineCreate, MdOutlineSave } from 'react-icons/md'

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
            handleRefresh();
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
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

            responseData.comments.reverse();

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
        <div className='font-poppins bg-slate-400 sm:px-10 lg:px-96 py-4 h-max'>
            <NavBar 
                uId={uId}
            />
            <div className='flex bg-white my-4 rounded-box p-4 w-2/3' key={feed.pId}>
                {/* Interaction Column */}
                <div className='flex-col space-y-4 items-center px-4'>
                    <button className='btn btn-square btn-sm btn-neutral'>
                        <Link to='/feed'>
                            <AiOutlineArrowLeft className='text-2xl'/>
                        </Link>
                    </button>
                    {/* Remove Button */}
                    {feed.aId === uId && (
                        <div className='flex-col w-min h-min space-y-2 items-center justify-between'>
                            <button className='btn btn-sm btn-square btn-outline btn-error' onClick={handleRemovePost}>
                                <Link to='/feed'>

                                    <MdOutlineDeleteOutline className='text-2xl' />
                                </Link>
                            </button>
                            <button className='btn btn-sm btn-square btn-accent btn-outline' onClick={() => {
                                if (isEditing) {
                                    handleSaveContent(feed.aId);
                                }
                                setIsEditing(!isEditing);
                                }}>
                                {isEditing ? <MdOutlineSave className='text-2xl'/> : <MdOutlineCreate className='text-2xl'/>}
                            </button>
                        </div>
                    )}
                </div>
                {/* Post Details */}
                <div className='flex-col space-y-4'>
                    {/* Post Author */}
                    <div className='flex '>
                        <div className='flex-col'>
                            <h1 className='text-3xl text-neutral font-bold'>
                                {feed.author}
                            </h1>
                            <p className='text-sm italic text-slate-400'>
                                {feed.createdAt}
                            </p>
                        </div>
                    </div>
                    {/* Post Content */}
                        {isEditing ? (
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="textarea textarea-accent w-full my-2"
                                placeholder={feed.content}
                            />
                        ) : (
                            <p className='text-xl'>{feed.content}</p>
                        )}
                    {/* Comments */}
                    <div className="border-b-2 border-gray-400"/>
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