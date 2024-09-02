import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'

import toast, { Toaster } from 'react-hot-toast'

import { FaUserLock } from "react-icons/fa";

import '../styles/signup.scss'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function SignUp() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [cpf, setCpf] = useState('')
    const [phone, setPhone] = useState('')

    const navigate = useNavigate()

    function handleSignUp(event) {
        event.preventDefault()

        const toastId = toast.loading('Loading')

        if(password === confirmPassword && password !== '') {
            axios.post(`${BACKEND_URL}/users`, {
                firstName,
                lastName,
                email,
                password,
                cpf,
                phone
            }).then(() => {
                toast.success('User created', {
                    id: toastId
                })
    
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }).catch(error => {
                toast.error(`Error: ${error.response.data.message}`, {
                    id: toastId
                })
            })
        } else {
            toast.error('Passwords does not match', {
                id: toastId
            })
        }

    }

    return (
        <form className="signUpContainer" onSubmit={handleSignUp}>
            <div className='iconContainer'>
                <FaUserLock color='#fff'/>
            </div>
            <p className='signUpTitle'>Sign Up</p>
            <div className='formContainer'>
                <div className='inputLine'>
                    <input type="text" placeholder="First Name" onChange={event => setFirstName(event.target.value)} />
                    <input type="text" placeholder="Last Name" onChange={event => setLastName(event.target.value)} />
                </div>
                <input type="text" placeholder="Email Address" onChange={event => setEmail(event.target.value)} />
                <div className="inputLine">
                    <input type="password" placeholder="Password"  onChange={event => setPassword(event.target.value)} />
                    <input type="password" placeholder="Confirm Password"  onChange={event => setConfirmPassword(event.target.value)} />
                </div>

                <input type="text" placeholder="CPF" onChange={event => setCpf(event.target.value)} />
                <input type="text" placeholder="Telefone" onChange={event => setPhone(event.target.value)} />
            </div>
            <button>Sign Up</button>
            <Link to='/login' className='signInLink'>Already have an account? <span>Sign In</span></Link>
            <Toaster />
        </form>
    )
}