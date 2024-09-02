import { createContext, useState, useEffect } from 'react'

import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const[loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId')

                if(userId) {
                    const response = await axios.get(`${BACKEND_URL}/users/${userId}`)

                    setUser(response.data.user)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Failed to fetch user: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const signIn = async (email, password) =>  {
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, { email, password })

            const { message, user } = response.data

            localStorage.setItem('userId', user.id)
            setUser(user)

            return message
        } catch (error) {
            return error.response.data.message
        }
    }

    const signOut = () => {
        localStorage.removeItem('userId')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider