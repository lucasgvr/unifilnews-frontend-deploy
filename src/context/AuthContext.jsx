import { createContext, useState, useEffect } from 'react'

import axios from 'axios'
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState('')
    const [error, setError] = useState('')

    const[loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId')

                if(userId) {
                    const response = await axios.get(`http://localhost:8000/user?id=${userId}`)

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
    }, [user])

    const signIn = async (email, password) =>  {
        try {
            const response = await axios.post('http://localhost:8000/login', { email, password })

            const { token, user } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('userId', user.id)

            setToken(token)
            setUser(user)

            console.log(user)
            console.log('Signed in')
            return response.data.Status
        } catch (error) {
            return error.response.data.error
        }
    }

    const signOut = () => {
        localStorage.removeItem('userId')
        localStorage.removeItem('token')
        setUser(null)
    }

    const deleteUser = async (userId) => {
        try {
            await axios.post(`http://localhost:8000/user/${userId}`)

            if(userId == localStorage.getItem('userId')) {
                signOut()
            }

            console.log('User deleted')
        } catch (error) {
            setError('Failed to delete user')
            console.error('Error deleting user:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading, token, error, deleteUser }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider