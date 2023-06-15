import LoginPage from './login';

function App() {
  return (
    <div className='flex flex-row h-screen '>
      <div className='flex-1 h-full flex flex-col items-center justify-center gap-8'>
        <img src='./undraw_social_dashboard_re_ocbd.svg' alt='People socializing with each other' className=''/>
        <p className=' text-5xl font-bold'>Start your social life</p>
        <p className=' text-sm'>Find friends, make connections, and share your experiences on our platform today!</p>
      </div>
      <LoginPage />
    </div>
    
  );
}

export default App;
