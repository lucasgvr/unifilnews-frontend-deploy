import { Loader } from "../components/Loader";
import { Header } from "../components/Header";

import { useState, useEffect, useContext } from 'react';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

import '../styles/posts.scss'

import Modal from 'react-modal'
import { IoMdClose } from "react-icons/io";

import defaultImg from '../assets/default.png'
import { VscHeart } from "react-icons/vsc";

import { VscComment } from "react-icons/vsc";
import { FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";

import PostLikes from "../components/PostsLikes";

export function Posts() {
    const token = localStorage.getItem("token")
    const id = localStorage.getItem("userId")

    const [posts, setPosts] = useState([])

    const { signOut } = useAuth()

    const [validToken, setValidToken] = useState(true)

    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const [postContent, setPostContent] = useState('')
    const [editPostContent, setEditPostContent] = useState('')
    const [editPostId, setEditPostId] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:8000/posts')
                const postsWithUserInfo = await Promise.all(postsResponse.data.posts.map(async post => {
                    const userResponse = await axios.get(`http://localhost:8000/user?id=${post.userId}`)
                    const user = userResponse.data.user;

                    const isLikedResponse = await axios.post(`http://localhost:8000/posts/${post.id}/liked`, { userId: id });
                    const isLiked = isLikedResponse.data.isLiked;

                    return { ...post, user, isLiked }
                }))

                setPosts(postsWithUserInfo)
            } catch (error) {
                console.error('Failed to fetch posts: ', error);
            }
        }

        fetchPosts()
    }, [posts])

    function openModal() {
        setIsModalOpen(true);
    }
    
    function closeModal() {
        setIsModalOpen(false);
    }

    async function openEditModal(postId) {
        const postReponse = await axios.get(`http://localhost:8000/posts/${postId}`)
        setEditPostContent(postReponse.data.post[0].postContent)
        setEditPostId(postId)

        setIsEditModalOpen(true);
    }
    
    function closeEditModal() {
        setIsEditModalOpen(false);
    }

    Modal.setAppElement('#root')

    function handleCreatePost() {
        axios.post('http://localhost:8000/posts/new', {
            id,
            postContent,
            createdAt: new Date()
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })

        closeModal()
    }

    function getTimeDifference(postDate) {
        const currentDate = new Date();
        const difference = currentDate.getTime() - new Date(postDate).getTime();
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days > 0) {
            return `${days} days ago`;
        } else if (hours > 0) {
            return `${hours} hours ago`;
        } else if (minutes > 0) {
            return `${minutes} minutes ago`;
        } else {
            return `${seconds} seconds ago`;
        }
    }

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/posts/${postId}/like/new`, {
                userId: id,
            });

            console.log(response.data);
        } catch (error) {
            console.error('Failed to like post: ', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/posts/${postId}/delete`, {
                userId: id,
            });

            console.log(response.data);
        } catch (error) {
            console.error('Failed to delete post: ', error);
        }
    };

    const handleEditPost = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/posts/${postId}/update`, {
                postContent: editPostContent,
                createdAt: new Date()
            });

            console.log(response.data);
        } catch (error) {
            console.error('Failed to delete post: ', error);
        } finally {
            setEditPostContent('')
            setIsEditModalOpen(false)
            setEditPostId('')
        }
    }

    const openPostPage = (postId) => {
        navigate(`/post/${postId}`)
    }
    
    useEffect(() => {
        const validateToken = async () => {
            await axios.post('http://localhost:8000/token', { 
                token, 
                id 
            }).then(response => {
                if(response.data == false) {
                    console.log(response.data)
                    setValidToken(false)
                    toast.error('Session Expired', {
                        id: 1
                    })

                    setTimeout(() => {
                        navigate('/')
                        navigate(0)
                        signOut()
                    }, 2000)
                } else {
                    setValidToken(true)
                }
            }).catch(error => {
                console.log(error)
            })
        }

        validateToken()
    }, [validToken])

    return (
        !validToken ?  
        <div>
            <Toaster />
            <Loader />
        </div>
        :
        <div>
            <Header />

            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modalContainer"
                style={{ overlay: {background: 'rgba(0, 0, 0, 0.5)'} }}
            >
                <div className="modalContent">
                    <h1 className="title">New Post</h1>
                    <IoMdClose className="closeButton" onClick={closeModal}>Close</IoMdClose>
                    <textarea className="textInput" maxLength={1000} onChange={event => setPostContent(event.target.value)}></textarea>
                    <button className="postButton" onClick={handleCreatePost}>Post</button>
                </div>
            </Modal>

            <Modal 
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                className="modalContainer"
                style={{ overlay: {background: 'rgba(0, 0, 0, 0.5)'} }}
            >
                <div className="modalContent">
                    <h1 className="title">Edit Post</h1>
                    <IoMdClose className="closeButton" onClick={closeEditModal}>Close</IoMdClose>
                    <textarea className="textInput" defaultValue={editPostContent} maxLength={1000} onChange={event => setEditPostContent(event.target.value)}></textarea>
                    <button className="postButton" onClick={() => handleEditPost(editPostId)}>Edit</button>
                </div>
            </Modal>

            <div className="postsContainer">
                <div style={{ display: 'none' }}>
                    <h1>Posts</h1>
                    <textarea autoFocus maxLength={1000} placeholder='teste'/>
                </div>

                <div className="postsContainerHeader">
                    <h1>Posts</h1>
                    <button onClick={openModal}>+ New Post  </button>
                </div>

                {posts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(post => (
                    <div className="post" key={post.id}>
                        <div className="postHeader">
                            <div className="userInfo">
                                <img src={post.user.image ? `http://localhost:8000/images/${post.user.image}` : defaultImg} alt="" />
                                <p>{post.user.firstName} {post.user.lastName}</p>
                            </div>

                            <p>{getTimeDifference(post.createdAt)}</p>
                        </div>
                        <p onClick={() => openPostPage(post.id)}>{post.postContent}</p>
                        <div className="postFooter">
                            <div className="footerLeft">
                                <div className="likeContainer" onClick={() => handleLike(post.id)}>
                                    {post.isLiked ? (
                                        <FaHeart color="red" />
                                    ) : (
                                        <VscHeart color="red" />
                                    )}
                                    <PostLikes postId={post.id} />
                                </div>
                                <VscComment color="var(--orange-5)" onClick={() => openPostPage(post.id)}/>
                            </div>
                            <div className="footerRight">
                                {post.userId == id &&
                                    <>
                                        <MdDelete color="var(--orange-5)" onClick={() => handleDeletePost(post.id)}/>
                                        <BsPencilSquare color="var(--orange-5)" onClick={() => openEditModal(post.id)}/>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                ))}
                
            </div>
        </div>
    )
}