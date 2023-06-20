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
                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                <div className=" space-x-10">
                    <button className="btn btn-primary" onClick={() => handleButtonClick('/login')}>
                        Login
                    </button>
                    <button className="btn btn-primary" onClick={() => handleButtonClick('/signup')}>
                        Signup
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}