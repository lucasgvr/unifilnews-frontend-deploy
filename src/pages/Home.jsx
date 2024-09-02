import { Header } from '../components/Header';
import { SubscribeButton } from '../components/SubscribeButton';

import homeImg from '../assets/avatar.svg'

import '../styles/home.scss'

export function Home() {
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