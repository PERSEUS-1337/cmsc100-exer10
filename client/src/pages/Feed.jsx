import { BsSearch } from 'react-icons/bs';
import { GoGitMerge } from 'react-icons/go';
import { BiFace } from 'react-icons/bi';

import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import FeedList from '../components/FeedList';

export default function FeedPage() {
    const uId = sessionStorage.getItem('uId');

    return(
        <div className="font-poppins">
            {/* Navbar */}
            <div className="border-4 border-red-700 h-20 flex gap-4">
                {/* Logo */}
                <div className='flex border-4 border-black'>
                    <GoGitMerge className='text-4xl'></GoGitMerge>
                    <h1 className=' text-4xl'>BookFace</h1>
                </div>
                {/* Search Bar */}
                <div className=" flex gap-4 border-4 border-black">
                    <BsSearch className='text-3xl'></BsSearch>
                    <p className=''>Search for a user on Bookface</p>
                </div>
            </div>
            {/* Main Frame */}
            <div className=" flex border-4 border-blue-700 h-screen">
                {/* SideBar */}
                <div className=' w-1/3 h-full border-4 border-green-400'>
                    {/* User Profile Details */}
                    <div className='flex border-2 border-violet-700'>
                        {/* Icon */}
                        <BiFace className='text-4xl'></BiFace>
                        {/* Details */}
                        <div className=' flex-col border-2 border-blue-500'>
                            <h2 className=' text-2xl text-black'>Lorem Ipsum</h2>
                            <h3 className=' text-xl text-gray-500'>@Lorem Ipsum</h3>
                        </div>
                    </div>
                    {/* Friends Requests */}
                    <h2 className='text-4xl'>Friend Requests</h2>
                    <FriendRequests
                        uId={uId}
                    />
                    {/* Friends List */}
                    <h2 className='text-4xl'>Friends List</h2>
                    <FriendsList
                        uId={uId}
                    />
                </div>
                {/* Feed Components */}
                <div className=' w-full h-full border-4 border-orange-700'>
                    <FeedList 
                        uId={uId}
                    />
                </div>
            </div>
        </div>
    );
}