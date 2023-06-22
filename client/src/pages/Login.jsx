import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import NavBar from '../components/NavBar';

export default function LoginPage() {
    const navigate = useNavigate();
    const auth = sessionStorage.getItem('jwtToken')

    const isAuthenticated = async () => {
        if (auth)
            navigate('/feed')
    }

    const { register, handleSubmit, formState: {errors, isDirty }, trigger } = useForm();
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/auth/login', data);
            setAlertMessage('Success! ' + response.data.msg);
            sessionStorage.clear();
            sessionStorage.setItem('jwtToken', response.data.token);
            sessionStorage.setItem('uId', response.data._id);

            // Set the default header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('jwtToken')}`;
            
            // Redirect to the /feed page
            setIsAlertVisible(true);
            navigate("/feed");
        } catch (error) {
            console.error(error);
            setAlertMessage('Error: ' + error.response.data.err);
            setIsAlertVisible(true);
        }
    };

    // Else, window does not refresh
    const onError = (errors, e) => console.log(errors, e);

    useEffect(() => {
        isAuthenticated();
    }, []);

    return(
        <div className=' form-control flex-col gap-5 px-20 xl:px-40 w-full h-screen justify-center bg-neutral text-white font-poppins'>
            <NavBar/>
            <p className=' text-5xl font-bold text-center'>Login Page</p>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className=''>
                    <div className=''>
                        <label className="label">
                            <span className="label-text text-white">Email</span>
                        </label>
                        <input className='input w-full bg-primary rounded-2xl required:border-red-500 required:border-2' required={errors.email?.message}
                            {...register(
                            "email", 
                            { 
                                required: "This is required", 
                                pattern: {
                                    value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message:"The email format is incorrect"
                                },
                                minLength: {
                                    value: 4,
                                    message: "Min length is 4"
                                }
                            }
                            )}
                        />
                        <label className="label">
                            <span className="label-text-alt text-warning">{errors.email?.message}</span>
                        </label>
                    </div>
                    <div className=''>
                        <div className='flex flex-row justify-between gap-4'>
                            <div className="w-full">
                                <label className="label">
                                    <span className="label-text text-white">Password</span>
                                </label>
                                <input className='input w-full bg-primary rounded-2xl  required:border-red-500 required:border-2' required={errors.password?.message}
                                    {...register(
                                        "password", 
                                        { 
                                            required: "This is required", 
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                                message:"*Must be at least 8 characters, 1 number, 1  lowercase letter, and 1 uppercase letter"
                                            },
                                            minLength: {
                                                value: 7,
                                                message: "Min length is 8"
                                            }
                                        }
                                    )}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-warning">{errors.password?.message}</span>
                                </label>
                                {isAlertVisible && (
                                    <label className="label">
                                        <span className="label-text text-info">{alertMessage}</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-center'>
                        <label className="label cursor-pointer gap-2">
                        <input type="checkbox" className="checkbox checkbox-accent" />
                        <span className="label-text text-white">Remember me</span> 
                        </label>
                        <button className="btn btn-link text-accent">Forgot Password</button>
                    </div>
                    <div className=''>
                        <input type="submit" value="Login" disabled={!isDirty} className="btn btn-accent w-full disabled:bg-white" />
                    </div>
                </div>
                <p className='text-sm text-center text-gray-700 py-4'>© 2023 All Rights Reserved</p>
            </form>
        </div>
    )
}