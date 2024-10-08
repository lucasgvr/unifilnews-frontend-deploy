import React, { useEffect, useState } from 'react'

import axios from 'axios'

import { Header } from '../components/Header'
import { SubscribeButton } from '../components/SubscribeButton'

import homeImg from '../assets/avatar.svg'

import '../styles/home.scss'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function Home() {
    const [visitorCount, setVisitorCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/visitor/count`)
                setVisitorCount(response.data.totalCount)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching visitor count', error)
                setLoading(false);
            }
        }

        const incrementVisitorCount = async () => {
            try {
                await axios.post(`${BACKEND_URL}/visitor/count/increment`)
            } catch (error) {
                console.error('Error incrementing visitor count', error)
            }  
        }

        fetchVisitorCount()
        incrementVisitorCount()
    }, [])

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
                    <div className='visitorContainer'>
                        <SubscribeButton />
                        {!loading && (
                            <div className='visitorCount'>
                                {visitorCount} visitantes até o momento
                            </div>
                        )}
                    </div>
                </section>

                <img src={homeImg} alt="Girl Coding" />
            </main>
        </>
    )
}