import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './styles.scss'

export function SubscribeButton() {
    const { user } = useAuth()

    const navigate = useNavigate()

    return (
        <button
            type="button"
            className='subscribeButton'
            onClick={user ? () => navigate('/posts') : () => navigate('/login')}
        >
            Inscreva-se
        </button>
    )
}