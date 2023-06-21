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
    // const [likedPosts, setLikedPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(feed.content);

    // const handleToggleLike = async () => {
    //     try {
    //         const requestData = {
    //             uId: uId,
    //             pId: pId
    //         };

    //         // TODO: Show modal alert if success or not
    //         const response = await axios.patch('/api/post/like', requestData);
    //         // const updatedPost = response.data.post;
            
    //         // For state management whether its liked by user or not
    //         const isLiked = likedPosts.includes(pId);

    //         // if (isLiked) {
    //         //     // Unlike the post
    //         //     const updatedLikedPosts = likedPosts.filter((postId) => postId !== pId);
    //         //     setLikedPosts(updatedLikedPosts);
    //         // } else {
    //         //     // Like the post
    //         //     const updatedLikedPosts = [...likedPosts, pId];
    //         //     setLikedPosts(updatedLikedPosts);
    //         // }
    //         if (feed.liked) {
    //             // Unlike the post
    //             setPost((prevPost) => ({
    //                 ...prevPost,
    //                 liked: false,
    //                 likes: prevPost.likes - 1,
    //             }));
    //         } else {
    //             // Like the post
    //             setPost((prevPost) => ({
    //                 ...prevPost,
    //                 liked: true,
    //                 likes: prevPost.likes + 1,
    //             }));
    //         }
    //     } catch (error) {
    //         console.error('Error toggling like:', error);
    //     }
    // };

    const handleRemovePost = async () => {
        try {
            const requestData = {
                uId: uId,
                pId: pId
            };

            // TODO: Show modal alert if success or not
            const response = await axios.delete('/api/post', {data: requestData});
            console.log(response.data)

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
                console.log(response.data)
    
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
            console.log(postDetails)
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
                    {/* <div>
                        <label className='swap'>
                            <input
                                type="checkbox"
                                checked={feed?.liked}
                                onChange={handleToggleLike}
                            />
                            <AiOutlineLike className='swap-on text-4xl text-accent'/>
                            <AiOutlineLike className='swap-off text-4xl text-neutral'/>
                        </label>
                        <p>
                            {feed.likes}
                        </p>
                    </div> */}
                    <Link to='/feed'>
                        <button className='btn'>

                            <AiOutlineArrowLeft className='text-4xl text-neutral'/>
                        </button>
                    </Link>
                    {/* Remove Button */}
                    {feed.aId === uId && (
                        <div>
                            <MdOutlineDeleteOutline className='text-4xl text-error' onClick={handleRemovePost}/>
                            {/* <button className='btn btn-primary' onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Save' : 'Edit'}
                            </button> */}
                            <button className='btn btn-primary' onClick={() => {
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
                            <p>{feed.content}</p>
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