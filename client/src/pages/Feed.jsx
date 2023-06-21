import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

import FeedList from '../components/FeedList';
import CreatePost from '../components/CreatePost';

export default function FeedPage() {
    const uId = sessionStorage.getItem('uId');

    return(
        <div className="font-poppins bg-slate-400 sm:px-10 lg:px-40 py-2">
            {/* Navbar */}
            <NavBar
                uId={uId}
            />
            {/* Main Frame */}
            <div className=" flex  h-screen">
                {/* SideBar */}
                <SideBar
                    uId={uId}
                />
                {/* Feed Components */}
                <div className='flex-col w-full h-full '>
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