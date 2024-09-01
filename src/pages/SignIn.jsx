import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import { FaUserLock } from "react-icons/fa";

import '../styles/signin.scss'
import { FaArrowLeft } from "react-icons/fa";

import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn } = useAuth()

    const navigate = useNavigate()

    async function handleSignIn(event) {
        event.preventDefault()

        try {
            const response = await signIn(email, password)

            if(response === 'User not found') {
                toast.error(response, {
                    id: 2,
                    duration: 1000
                })
            }

            if(response === 'Invalid Credentials') {
                toast.error(response, {
                    id: 3,
                    duration: 1000
                })
            }

            if(response === 'Signed') {
                navigate('/loading')
            }
        } catch (error) {
            console.error('Login failed', error)
        }
    }

    return (
        <div className='signInSuperContainer'>
            <Toaster />
            <FaArrowLeft color='var(--orange-5)' className='backArrow' onClick={() => navigate('/')} />
            <form className="signInContainer" onSubmit={handleSignIn}>
                <div className='iconContainer'>
                    <FaUserLock color='#fff'/>
                </div>
                <p className='signInTitle'>Sign In</p>
                <div className='formContainer'>
                    <input type="text" placeholder="Email Address" onChange={event => setEmail(event.target.value)}/>
                    <input type="password" placeholder="Password" onChange={event => setPassword(event.target.value)} />
                </div>
                <button>Sign In</button>
                <Link to='/signup' className='signInLink'>Don't have an account? <span>Sign Up</span></Link>
            </form>
        </div>
    )
}