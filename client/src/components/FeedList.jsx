import axios from 'axios';

import { BiFace, BiCommentDetail } from 'react-icons/bi';
import { AiOutlineLike } from 'react-icons/ai'

import { useState, useEffect } from 'react';

export default function FeedList({uId}) {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
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

                setFeed(finalPostList)
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
        handleToggleLike();
    }, []);

    const handleToggleLike = async (pId) => {
        try {
            const requestData = {
                uId: uId,
                pId: pId
            };

            const response = await axios.patch('/api/post/like', requestData);
            const updatedPost = response.data.post;

            // Update the like state in the feed list
            const updatedFeed = feed.map((post) => {
            if (post.pId === pId) {
                return {
                ...post,
                likes: updatedPost.likes
                };
            }
            return post;
            });

            setFeed(updatedFeed);
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
                        {/* <label className='swap'>
                            <input type="checkbox" onClick={() => handleToggleLike(feed.pId)} /> */}
                            {feed.likedByUser ? (
                                <button onClick={() => handleToggleLike(feed.pId)}>
                                    <AiOutlineLike className='swap-on text-4xl text-accent' />
                                </button>
                            ) : (
                                <button onClick={() => handleToggleLike(feed.pId)}>
                                
                                    <AiOutlineLike className='swap-off text-4xl text-neutral'/>
                                </button>
                            )}
                            {/* <AiOutlineLike className='swap-on text-4xl text-accent'/>
                            <AiOutlineLike className='swap-off text-4xl text-neutral'/> */}
                        {/* </label> */}
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