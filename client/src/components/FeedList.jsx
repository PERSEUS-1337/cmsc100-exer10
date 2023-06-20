import axios from 'axios';

import { BiFace, BiCommentDetail } from 'react-icons/bi';
import { AiOutlineLike } from 'react-icons/ai'

import { useState, useEffect } from 'react';

export default function FeedList({uId}) {
    const [feed, setFeed] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Get the feed of the user that contains user posts and friends' posts
                const response = await axios.get(`/api/post/user/${uId}/feed`)
                const responseData = await response.data.feed;
                const finalPostList = []
                
                for (const post of responseData) {
                    const userResponse = await axios.get(`/api/user/${post.author}`);
                    const userData = userResponse.data.user;
                    var isLiked = false;

                    console.log(post.likes)
                    if ((post.likes).includes(uId)){
                        isLiked = true;
                    } else {
                        isLiked = false;
                    }

                    const date = new Date(post.createdAt);
                    const formattedDate = date.toLocaleString();
                    
                    const postDataFinal = {
                        pId: post._id,
                        uId: userData._id,
                        author: userData.fname + " " + userData.lname,
                        content: post.content,
                        createdAt: formattedDate,
                        likedByUser: isLiked
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

    return(
        <div className='space-y-4'>
            {feed.map((feed) => (
                <div className='flex ' key={feed.pId}>
                    {/* Interaction Column */}
                    <div className='flex-col'>
                        <label className='swap'>
                            <input type="checkbox" checked={likedPosts.includes(feed.pId)} onChange={() => handleToggleLike(feed.pId)} />
                            {/* <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} onClick={() => handleToggleLike(feed.pId)} /> */}
                            {/* {feed.likedByUser ? (
                                <button onClick={() => handleToggleLike(feed.pId)}>
                                    <AiOutlineLike className='swap-on text-4xl text-accent' />
                                </button>
                            ) : (
                                <button onClick={() => handleToggleLike(feed.pId)}>
                                
                                    <AiOutlineLike className='swap-off text-4xl text-neutral'/>
                                </button>
                            )} */}
                            <AiOutlineLike className='swap-on text-4xl text-accent'/>
                            <AiOutlineLike className='swap-off text-4xl text-neutral'/>
                        </label>
                        <BiCommentDetail className='text-4xl text-neutral'/>
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