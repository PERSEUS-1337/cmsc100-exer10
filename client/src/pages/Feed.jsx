import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import FeedList from '../components/FeedList';
import CreatePost from '../components/CreatePost';

import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';

export default function FeedPage() {
    const uId = sessionStorage.getItem('uId');

    const navigate = useNavigate();

    const isAuthenticated = async () => {
        // Set the default header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('jwtToken')}`;
        if (!sessionStorage.getItem('jwtToken'))
            navigate('/')
    }

    useEffect(() => {
        isAuthenticated();
    }, []);

    return(
        <div className="font-poppins bg-slate-400 sm:px-10 lg:px-96 py-4 h-max">
            {/* Navbar */}
            <NavBar
                uId={uId}
            />
            {/* Main Frame */}
            <div className=" flex h-screen py-4 gap-4">
                {/* SideBar */}
                <SideBar
                    uId={uId}
                />
                {/* Feed Components */}
                <div className='flex-col w-full h-full space-y-4'>
                    <CreatePost
                        uId={uId}
                        message="What's on your mind"
                    />
                    <FeedList 
                        uId={uId}
                    />
                </div>
            </div>
        </div>
    );
}