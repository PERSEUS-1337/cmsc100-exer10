import axios from 'axios';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { BiFace } from 'react-icons/bi';
import { MdTouchApp } from 'react-icons/md'
import { AiOutlineLike } from 'react-icons/ai'



export default function FeedList({uId}) {
    const [feed, setFeed] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const handleToggleLike = async (pId) => {
        try {
            const requestData = {
                uId: uId,
                pId: pId
            };

            // TODO: Show modal alert if success or not
            const response = await axios.patch('/api/post/like', requestData);
            // const updatedPost = response.data.post;
            
            // For state management whether its liked by user or not
            const isLiked = likedPosts.includes(pId);

            if (isLiked) {
                // Unlike the post
                const updatedLikedPosts = likedPosts.filter((postId) => postId !== pId);
                setLikedPosts(updatedLikedPosts);
            } else {
                // Like the post
                const updatedLikedPosts = [...likedPosts, pId];
                setLikedPosts(updatedLikedPosts);
            }

        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Get the feed of the user that contains user posts and friends' posts
                const response = await axios.get(`/api/post/user/${uId}/feed`)
                const responseData = await response.data.feed;

                // Contains the final feed data to be pushed to the list 
                const finalPostList = []
                
                // Iterates through one post object through an array of objects
                for (const post of responseData) {
                    // Gets the details of who posted it
                    const userResponse = await axios.get(`/api/user/${post.author}`);
                    const userData = userResponse.data.user;

                    // Value to check if its liked by current user who is logged in, to reflect on their screen if its liked or not
                    var isLiked = false;

                    if ((post.likes).includes(uId))
                        isLiked = true;

                    // For prettier data formatting
                    const date = new Date(post.createdAt);
                    const formattedDate = date.toLocaleString();
                    
                    // Object to be pushed to the array to be displayed in a list
                    const postDataFinal = {
                        pId: post._id,
                        uId: userData._id,
                        author: userData.fname + " " + userData.lname,
                        content: post.content,
                        createdAt: formattedDate,
                        likedByUser: isLiked,
                        likes: post.likes.length
                    }
                    finalPostList.push(postDataFinal);
                }

                setFeed(finalPostList);

                // Check which posts are liked by the user
                const likedPostIds = responseData.filter((post) =>
                    post.likes.includes(uId)
                );
                const likedPostIdsArray = likedPostIds.map((post) => post._id);

                // Set the likedPosts state to the initial liked posts
                setLikedPosts(likedPostIdsArray);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return(
        <div className='space-y-4'>
            {feed.map((feed) => (
                <div className='flex ' key={feed.pId}>
                    {/* Interaction Column */}
                    <div className='flex-col'>
                        <div>
                            <label className='swap'>
                                <input type="checkbox" checked={likedPosts.includes(feed.pId)} onChange={() => handleToggleLike(feed.pId)} />
                                <AiOutlineLike className='swap-on text-4xl text-accent'/>
                                <AiOutlineLike className='swap-off text-4xl text-neutral'/>
                            </label>
                            <p>
                                {feed.likes}
                            </p>
                        </div>
                        <Link to={{ pathname: `/feed/${feed.pId}`, state: { body: uId } }} key={feed.pId}>
                            <MdTouchApp className='text-4xl text-neutral'/>
                        </Link>
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
                            <p className=''>
                                {feed.content}
                            </p>
                        </div>
                    </div>
                </div>

            ))}
        </div>
    );
}