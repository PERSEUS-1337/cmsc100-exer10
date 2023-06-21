import { BsSearch } from 'react-icons/bs';
import { GoGitMerge } from 'react-icons/go';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

export default function NavBar() {
    return(
        <Link to='/'>
            <div className=" h-20 flex gap-4">
                {/* Logo */}
                <div className='flex '>
                    <GoGitMerge className='text-4xl'></GoGitMerge>
                    <h1 className=' text-4xl'>BookFace</h1>
                </div>
                {/* Search Bar */}
                <div className=" flex gap-4 ">
                    <BsSearch className='text-3xl'></BsSearch>
                    <p className=''>Search for a user on Bookface</p>
                </div>
            </div>
        </Link>
    );
}