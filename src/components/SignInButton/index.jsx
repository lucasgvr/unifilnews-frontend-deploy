import { useAuth } from '../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import './styles.scss'

import defaultImg from '../../assets/default.png'
import toast, { Toaster } from 'react-hot-toast';


export function SignInButton() {
    const { user, signOut } = useAuth()

    const location = useLocation();

    const navigate = useNavigate()

    function handleSignOut() {
        signOut()
    }

    return user ? (
        <button 
            type="button"
            className='signInButton'
            onClick={`/user/${user.id}` === location.pathname ? () => {
                navigate('/loading')
                handleSignOut()
     } : () => navigate(`/user/${user.id}`)}
        >
            {`/user/${user.id}` === location.pathname 
                ? 
                    <p>Sign Out</p>
                : 
                <>
                    <img src={user.image ? `http://localhost:8000/images/${user.image}` : defaultImg} alt="" />
                    {user.firstName} {user.lastName} 
                </>}
        </button>
    ) : (
        <button 
            type="button"
            className='signInButton'
            onClick={() => navigate('/login')}
        >
            Sign In
        </button>
    )
}