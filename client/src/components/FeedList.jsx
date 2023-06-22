import axios from 'axios';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { AiOutlineLike } from 'react-icons/ai';

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
            const updatedPost = response.data.post;
            
            // For state management whether its liked by user or not
            // Update the feed state with the updated post
            const updatedFeed = feed.map((post) => {
                if (post.pId === pId) {
                return {
                    ...post,
                    likes: updatedPost.likes.length
                };
                }
                return post;
            });
            setFeed(updatedFeed);

            // Update the likedPosts state based on the user's action
            if (likedPosts.includes(pId)) {
                const updatedLikedPosts = likedPosts.filter((postId) => postId !== pId);
                setLikedPosts(updatedLikedPosts);
            } else {
                const updatedLikedPosts = [...likedPosts, pId];
                setLikedPosts(updatedLikedPosts);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            // Get the feed of the user that contains user posts and friends' posts
            const response = await axios.get(`/api/post/user/${uId}/feed`)
            const responseData = await response.data.feed;
            responseData.reverse()

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

    useEffect(() => {
        fetchPosts();
    }, []);

    return(
        <div className='space-y-4 flex-col'>
            {feed.map((feed) => (
                <div className='flex bg-white rounded-box p-4 w-full' key={feed.pId}>
                    {/* Interaction Column */}
                    <div className='flex-col items-center h-min z-0'>
                        <label className='swap'>
                            <input type="checkbox"
                                checked={likedPosts.includes(feed.pId)}
                                onChange={() => handleToggleLike(feed.pId)}
                            />
                            <AiOutlineLike className='swap-on text-4xl text-accent'/>
                            <AiOutlineLike className='swap-off text-4xl text-neutral'/>
                        </label>
                        <p className='text-center'>
                            {feed.likes}
                        </p>
                    </div>
                    {/* Post Details */}
                        <div className='flex-col w-full hover:bg-slate-100 rounded-box px-4' >
                        <Link to={{ pathname: `/feed/${feed.pId}`, state: { body: uId } }} key={feed.pId}>
                            {/* Post Author */}
                            <div className='flex'>
                                <div className='flex-col'>
                                    <h1 className='text-2xl text-neutral font-bold'>
                                        {feed.author}
                                    </h1>
                                    <p className='text-xs font-light italic text-slate-500'>
                                        {feed.createdAt}
                                    </p>
                                </div>
                            </div>
                            {/* Post Content */}
                            <div>
                                <p className='pt-4 tooltip tooltip-bottom text-left' data-tip="Click to comment / edit / delete post">
                                    {feed.content}
                                </p>
                            </div>
                        </Link>
                        </div>
                </div>
            ))}
        </div>
    );
}