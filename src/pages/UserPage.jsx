import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import axios from 'axios'
import { Header } from "../components/Header"
import { Loader } from "../components/Loader"

import '../styles/user.scss'
import { useAuth } from "../hooks/useAuth"

import defaultImg from '../assets/default.png'
import toast, { Toaster } from 'react-hot-toast'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function UserPage() {
    const { id } = useParams()

    const [userPage, setUserPage] = useState(null)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [cpf, setCpf] = useState('')
    const [phone, setPhone] = useState('')

    const [selectedFile, setSelectedFile] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    const { user } = useAuth()

    useEffect(() => {
        const getUser = async (id) => {
            try {
                const response = await axios.get(`${BACKEND_URL}/users/${id}`)
    
                setUserPage(response.data.user)
            } catch (error) {
                console.error('Failed to fetch user: ', error)
            } 
        }

        getUser(id)
    }, [userPage])

    const handleFileChange = event => {
        setSelectedFile(event.target.files[0])
    }

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!/^\d{11}$/.test(cpf === "" ? user.cpf : cpf)) {
            toast.error("CPF must be 11 digits long", { id: 2 })
            return
        }
    
        if (!/^\d{11}$/.test(phone === "" ? user.phone : phone)) {
            toast.error("Phone number must be 11 digits long", { id: 2 })
            return
        }
    
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email === "" ? user.email : email)) {
            toast.error("Invalid email address", { id: 2 })
            return
        }
    
        if (newPassword === confirmNewPassword) {
            const updatedUser = {
                id,
                firstName: firstName === "" ? user.firstName : firstName,
                lastName: lastName === "" ? user.lastName : lastName,
                email: email === "" ? user.email : email,
                password: newPassword === "" || confirmNewPassword === "" ? user.password : newPassword,
                cpf: cpf === "" ? user.cpf : cpf,
                phone: phone === "" ? user.phone : phone,
            };
    
            try {
                const response = await axios.put(`${BACKEND_URL}/users/${id}/edit`, updatedUser, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
    
                if (response.data.message === "User updated successfully") {
                    toast.dismiss()
                    toast.success("User updated")
    
                    setTimeout(() => {
                        navigate("/")
                        navigate(0)
                    }, 2000)
                } else {
                    console.log("Error while editing user")
                }
            } catch (error) {
                console.error("Failed to update user", error)
                toast.error("Failed to update user")
            }
        } else {
            toast.error("Passwords do not match", {
                id: 2,
            })
        }
    }
    
    return (
        <>
            {!userPage ? 
                <Loader /> 
            : 
                <>
                    <Header />
                    <Toaster />

                    {`/user/${user?.id}` === location.pathname ? 
                        <form className="userEditContainer" onSubmit={handleUpload}>
                            <div className='formContainer'>
                                <div className="imageContainer">
                                    <img src={defaultImg} alt="" />
                                </div>
                                <div className='inputLine'>
                                    <input defaultValue={user.firstName} type="text" placeholder="First Name" onChange={event => setFirstName(event.target.value)} />
                                    <input defaultValue={user.lastName} type="text" placeholder="Last Name" onChange={event => setLastName(event.target.value)} />
                                </div>
                                <input defaultValue={user.email} type="text" placeholder="Email Address" onChange={event => setEmail(event.target.value)} />
                                <div className='inputLine'>
                                    <input type="password" placeholder="New Password" onChange={event => setNewPassword(event.target.value)} />
                                    <input type="password" placeholder="Confirm New Password" onChange={event => setConfirmNewPassword(event.target.value)} />
                                </div>
                                <input defaultValue={user.cpf} type="text" placeholder="CPF" onChange={event => setCpf(event.target.value)} />
                                <input defaultValue={user.phone} type="text" placeholder="Telefone" onChange={event => setPhone(event.target.value)} />
                            </div>
                            <div className="uploadContainer" disabled>
                                <label className="fileInput" disabled>
                                    Choose Image: {selectedFile?.name}
                                    <input type="file" onChange={handleFileChange} disabled />
                                </label>
                            </div>
                            <button>Save</button>
                        </form>
                    : 
                        <div>
                            UserPage
                            <div>
                                <p>{userPage.id} {userPage.firstName} {userPage.lastName}</p>
                                <p>{userPage.email}</p>
                                <p>{userPage.cpf}</p>
                                <p>{userPage.phone}</p>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}