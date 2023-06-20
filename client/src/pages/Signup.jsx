import { useForm } from "react-hook-form";
import axios from 'axios';

import React, { useState } from 'react';

export default function SignupPage() {
    const { register, handleSubmit,watch, formState: {errors, isDirty }, trigger } = useForm();
    const password = watch("password");

    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
        
    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/auth/signup', data);
            console.log(data)
            console.log(response.data); // Handle the response from the backend
            setAlertMessage('Success! ' + response.data.msg);
            sessionStorage.clear();
            sessionStorage.setItem('jwtToken', response.data.token);
            setIsAlertVisible(true);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error: ' + error.response.data.err);
            setIsAlertVisible(true);
        }
    };
    // Else, window does not refresh
    const onError = (errors, e) => console.log(errors, e);

    return(
        <div className=' form-control flex-col gap-5 px-20 xl:px-40 w-full h-screen justify-center bg-neutral text-white font-poppins'>
            <p className=' text-5xl font-bold text-center'>Sign-up Page</p>
            <form onSubmit={handleSubmit(onSubmit, onError, (data) => {
                // console.log(data)
            })}>
                <div className=''>
                    <div className=''>
                        <label className="label">
                            <span className="label-text text-white">First name</span>
                        </label>
                        <input className='input w-full bg-primary rounded-2xl required:border-red-500 required:border-2' name="fname" required={errors.fname?.message}
                            {...register(
                                "fname", 
                                { 
                                    required: "This is required", 
                                    maxLength: {
                                        value: 20,
                                        message: "Max length is 20"
                                    }
                                }
                            )} 
                        />
                        <label className="label">
                            <span className="label-text-alt text-warning">{errors.fname?.message}</span>
                        </label>
                    </div>
                    <div className=''>
                        <label className="label">
                            <span className="label-text text-white">Last name</span>
                        </label>
                        <input className='input w-full bg-primary rounded-2xl required:border-red-500 required:border-2' name="lname" required={errors.lname?.message}
                            {...register(
                                "lname", 
                                { 
                                    required: "This is required", 
                                    minLength: {
                                        value: 4,
                                        message: "Min length is 4"
                                    }
                                }
                            )} 
                        />
                        <label className="label">
                            <span className="label-text-alt text-warning">{errors.lname?.message}</span>
                        </label>            
                    </div>
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
                            <div className="w-1/2">
                                <label className="label">
                                    <span className="label-text text-white">Password</span>
                                </label>
                                <input className='input w-full bg-primary rounded-2xl  required:border-red-500 required:border-2' required={errors.password?.message}
                                    {...register(
                                        "password", 
                                        { 
                                            required: "This is required", 
                                            // pattern: {
                                            //     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                            //     message:"*Must be at least 8 characters, 1 number, 1  lowercase letter, and 1 uppercase letter"
                                            // },
                                            minLength: {
                                                value: 8,
                                                message: "Min length is 8"
                                            }
                                        }
                                    )}
                                    // onChange={() => trigger("password")}
                                    
                                />
                                <label className="label">
                                    <span className="label-text-alt text-warning">{errors.password?.message}</span>
                                </label>
                            </div>
                            <div className="w-1/2">
                                <label className="label">
                                    <span className="label-text text-white">Repeat password</span>
                                </label>
                                <input className='input w-full bg-primary rounded-2xl  required:border-red-500 required:border-2' required={errors.repPassword?.message}
                                    onChange={() => trigger("password")}
                                    {...register(
                                        "repPassword", 
                                        { 
                                            required: "This is required",                            
                                            validate: (value) => value === password || "The passwords do not match",
                                        }
                                    )}
                                    disabled={!password}
                                />
                            <label className="label">
                                    <span className="label-text-alt text-warning">{errors.repPassword?.message}</span>
                                </label>
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
                        <input type="submit" value="Sign-up" disabled={!isDirty} className="btn btn-accent w-full disabled:bg-white" />
                    </div>
                </div>
                <p className='text-sm text-center text-gray-700 py-4'>© 2023 All Rights Reserved</p>
            </form>
            {isAlertVisible && (
                <div className="alert">
                    {alertMessage}
                    <button onClick={() => setIsAlertVisible(false)}>Close</button>
                </div>
            )}
        </div>
    )
}