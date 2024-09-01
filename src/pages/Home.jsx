import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import axios from 'axios'

import { HiPencilAlt } from "react-icons/hi";
import homeImg from '../assets/avatar.svg'
import '../styles/home.scss'
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { SubscribeButton } from '../components/SubscribeButton';
import toast, { Toaster } from 'react-hot-toast'


export function Home() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000')
            .then(response => setUsers(response.data))
            .catch(error => console.log(error))
    }, [])

    const { signOut, deleteUser } = useAuth()

    function handleUpdate() {
        // update function
    }

    function handleDelete(id) {
        deleteUser(id)
    }

    return (
        <>
            <Header />
            <main className='homeContainer'>
                <section className='hero'>
                <span>👋 Olá, seja bem-vindo</span>
                <h1>Notícias sobre <br /> 
                    o universo <span>Unifil</span>
                </h1>
                <p>
                    Tenha acesso à todas as publicações<br />
                    <span>entrevistas</span>, tutoriais, vídeos e dicas
                </p>
                <SubscribeButton />
                </section>

                <img src={homeImg} alt="Girl Coding" />
            </main>
        </>
    )
}