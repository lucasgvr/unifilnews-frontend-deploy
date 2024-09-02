import { useState, useEffect } from 'react'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function PostLikes({ postId }) {
    const [likeCount, setLikeCount] = useState(0)

    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/posts/${postId}/likeCount`)
                setLikeCount(response.data.likeCount)
            } catch (error) {
                console.error('Error fetching like count:', error)
            }
        }

        fetchLikeCount()

        const intervalId = setInterval(() => {
            fetchLikeCount()
        }, 1000)

        return () => clearInterval(intervalId)
    }, [likeCount])

    return (
        <div>
            <span>{likeCount}</span>
        </div>
    )
}

export default PostLikes