import axios from 'axios';

import { BiFace, BiCommentDetail } from 'react-icons/bi';
import { AiOutlineLike } from 'react-icons/ai'

import { useState, useEffect } from 'react';

export default function FeedList({uId}) {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/post/user/${uId}`); 
                const postResponseData = await response.data.posts;
                const postList = []
                for (const post of postResponseData) {
                    const userResponse = await axios.get(`/api/user/${post.author}`);
                    const postData = {
                        pId: post._id,
                        author: userResponse.data.user.fname + " " + userResponse.data.user.lname,
                        content: post.content,
                        createdAt: post.createdAt
                    }
                    postList.push(postData);
                }
                setFeed(postList)
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };
        fetchPosts();
    }, []);

    return(
        <div>
            {feed.map((feed) => (
                <div className='flex border-3 border-black' key={feed.pId}>
                    {/* Interaction Column */}
                    <div className='flex-col'>
                        <AiOutlineLike className='text-4xl text-accent'/>
                        <BiCommentDetail className='text-4xl text-neutral'/>
                    </div>
                    {/* Post Details */}
                    <div className='flex-col border-4'>
                        {/* Post Author */}
                        <div className='flex border-8'>
                            <BiFace className='text-6xl text-neutral' />
                            <div className='flex-col'>
                                <h1 className='text-4xl'>{feed.author}</h1>
                                <p>{feed.createdAt}</p>
                            </div>
                        </div>
                        {/* Post Content */}
                        <div>
                            <p className='border-8'>{feed.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}