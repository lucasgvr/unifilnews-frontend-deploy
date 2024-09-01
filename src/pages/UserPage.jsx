import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import axios from 'axios'
import { Header } from "../components/Header"
import { Loader } from "../components/Loader"

import '../styles/user.scss'
import { useAuth } from "../hooks/useAuth"

import defaultImg from '../assets/default.png'
import toast, { Toaster } from 'react-hot-toast'


import { FaTrash } from "react-icons/fa";

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

    const { user, signOut } = useAuth()

    const activeToken = localStorage.getItem("token")
    const activeId = localStorage.getItem("userId")

    useEffect(() => {
        const getUser = async (id) => {
            try {
                const response = await axios.get(`http://localhost:8000/user?id=${id}`)
    
                setUserPage(response.data.user)
            } catch (error) {
                console.error('Failed to fetch user: ', error)
            } 
        }

        getUser(id)
    }, [userPage])

    const handleFileChange = event => {
        setSelectedFile(event.target.files[0]);
    }

    const handleUpload = async (event) => {
        event.preventDefault()

        await axios.post('http://localhost:8000/token', { 
            token: activeToken, 
            id: activeId 
        }).then(response => {
            if(response.data == false) {
                toast.dismiss()
                toast.error('Session Expired', {
                    id: 1
                })

                setTimeout(() => {
                    navigate('/loading')
                    navigate(0)
                    signOut()
                }, 2000)
            } else {
                if(newPassword === confirmNewPassword) {
                    const formData = new FormData()
                    
                    formData.append('firstName', firstName === '' ? user.firstName : firstName)
                    formData.append('lastName', lastName === '' ? user.lastName : lastName)
                    formData.append('email', email === '' ? user.email : email)
                    formData.append('password', newPassword === '' || confirmNewPassword === '' ? user.password : newPassword)
                    formData.append('cpf', cpf === '' ? user.cpf : cpf)
                    formData.append('phone', phone === '' ? user.phone : phone)
                    formData.append('image', selectedFile == null ? user.image : selectedFile)
            
                    formData.append('id', user.id)

                    formData.append('newPassword', newPassword === '' ? false : true)

                    console.log(formData)
            
                    axios.post('http://localhost:8000/upload', formData)
                    .then(response => {
                        console.log(user.password)
                        console.log(newPassword)
                        if(response.data.Status === 'Success') {
                            toast.dismiss()
                            toast.success('User updated')
                            
                            setTimeout(() => {
                                navigate('/')
                                navigate(0)
                            }, 2000)
                        } else {
                            console.log('Error while uploading image')
                        }
                    })
                    .catch(error => console.log(error))
                } else {
                    toast.error('Passwords does not match', {
                        id: 2
                    })
                }
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const handleDeleteImg = async () => {
        await axios.post('http://localhost:8000/token', { 
            token: activeToken, 
            id: activeId 
        }).then(response => {
            if(response.data == false) {
                toast.error('Session Expired', {
                    id: 1
                })

                setTimeout(() => {
                    navigate('/')
                    navigate(0)
                    signOut()
                }, 2000)
            } else {
                axios.post(`http://localhost:8000/user/${user.id}/delete/image`)
                .then(response => {
                    if(response.data.Status === 'Success') {
                        console.log('Image deleted')
                    } else {
                        console.log('Error while deleting image')
                    }
                })
                .catch(error => console.log(error))
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <>
            {!userPage ? <Loader /> : 
            <>
                <Header />
                <Toaster />

                {`/user/${user?.id}` === location.pathname ? 
                <form className="userEditContainer" onSubmit={handleUpload}>
                    <div className='formContainer'>
                        <div className="imageContainer">
                            <img src={user.image ? `http://localhost:8000/images/${user.image}` : defaultImg} alt="" />
                            <FaTrash onClick={handleDeleteImg}color="var(--orange-5)"/>
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
                    <div className="uploadContainer">
                        <label className="fileInput">
                            Choose Image: {selectedFile?.name}
                            <input type="file" onChange={handleFileChange} />
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
                </div>}
                
            </>
            }
        </>
    )
}