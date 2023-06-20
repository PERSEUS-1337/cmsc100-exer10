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

                    const date = new Date(post.createdAt);
                    const formattedDate = date.toLocaleString();

                    const postDataFinal = {
                        pId: post._id,
                        uId: userData._id,
                        author: userData.fname + " " + userData.lname,
                        content: post.content,
                        createdAt: formattedDate
                    }
                    finalPostList.push(postDataFinal);
                }
                setFeed(finalPostList)
            } catch (error) {
                console.error(error);
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