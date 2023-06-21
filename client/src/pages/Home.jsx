import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    const handleButtonClick = (destination) => {
        // Redirect to the desired page
        navigate(destination);
    };
    
    return(
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                <h1 className="text-5xl font-bold">Hello there</h1>
                <p className="py-6">Press any of the buttons to demonstrate my social media app.</p>
                <div className=" space-x-10 flex justify-center">
                    <button className="btn btn-primary" onClick={() => handleButtonClick('/login')}>
                        Login
                    </button>
                    <button className="btn btn-primary" onClick={() => handleButtonClick('/signup')}>
                        Signup
                    </button>
                    <button className="btn btn-primary" onClick={() => handleButtonClick('/feed')}>
                        Feed
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}