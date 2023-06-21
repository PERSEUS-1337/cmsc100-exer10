import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BiFace } from 'react-icons/bi';
import { AiOutlineLike, AiOutlineArrowLeft } from 'react-icons/ai'
import { MdOutlineDeleteOutline } from 'react-icons/md'

import NavBar from '../components/NavBar';
import CommentsList from '../components/CommentsList';

export default function PostPage(){
    const uId = sessionStorage.getItem('uId');
    const { pId } = useParams();
    const [feed, setPost] = useState([]);
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

    useEffect(() => {
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

                const postDetails = {
                    aId: responseData.author,
                    author: userData.fname + " " + userData.lname,
                    createdAt: responseData.createdAt,
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
        fetchPost();
    }, [pId]);
    
    return(
        <div>
            <NavBar />
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
                    <AiOutlineArrowLeft className='text-4xl text-neutral'/>
                    {/* Remove Button */}
                    {feed.aId === uId && (
                        // <button className="btn" >
                            <MdOutlineDeleteOutline className='text-4xl text-error' onClick={handleRemovePost}/>
                        // </button>
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
                        <p className=''>
                            {feed.content}
                        </p>
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