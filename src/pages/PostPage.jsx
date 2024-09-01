import { useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { useEffect, useState } from "react"
import axios from "axios"
import defaultImg from '../assets/default.png'
import { Loader } from "../components/Loader"

import { useNavigate } from "react-router-dom";

import PostLikes from "../components/PostsLikes"

import Modal from 'react-modal'

import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { VscHeart } from "react-icons/vsc";
import { FaHeart } from "react-icons/fa";

import '../styles/post.scss'

export function PostPage() {
    const { id } = useParams()
    const userId = localStorage.getItem("userId")

    const navigate = useNavigate()

    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [commentContent, setCommentContent] = useState('')

    const [editPostContent, setEditPostContent] = useState('')

    const [editCommentId, setEditCommentId] = useState('')
    const [editCommentContent, setEditCommentContent] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false)


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

    function openModal() {
        setIsModalOpen(true);
    }
    
    function closeModal() {
        setIsModalOpen(false);
    }

    async function openEditModal(postId) {
        const postReponse = await axios.get(`http://localhost:8000/posts/${id}`)
        setEditPostContent(postReponse.data.post[0].postContent)

        setIsEditModalOpen(true);
    }
    
    function closeEditModal() {
        setIsEditModalOpen(false);
    }

    async function openEditCommentModal(commentId) {
        const commentReponse = await axios.get(`http://localhost:8000/comment/${commentId}`)
        setEditCommentContent(commentReponse.data.comment[0].commentContent)

        setEditCommentId(commentId)
        setIsEditCommentModalOpen(true);
    }
    
    function closeEditCommentModal() {
        setIsEditCommentModalOpen(false);
    }

    Modal.setAppElement('#root')

    function handleCreateComment() {
        axios.post(`http://localhost:8000/comments/${id}/new`, {
            userId,
            commentContent,
            createdAt: new Date()
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })

        closeModal()
    }

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/posts/${postId}/like/new`, {
                userId: userId,
            });

            setPost(prevPost => ({
                ...prevPost,
                isLiked: !prevPost.isLiked,
            }));

        } catch (error) {
            console.error('Failed to like post: ', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/posts/${id}/delete`, {
                userId: userId,
            });

            console.log(response.data);
        } catch (error) {
            console.error('Failed to delete post: ', error);
        } finally {
            navigate('/posts')
        }
    };

    const handleEditPost = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8000/posts/${id}/update`, {
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

    const handleEditComment = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/comment/${editCommentId}/update`, {
                commentContent: editCommentContent,
                createdAt: new Date()
            });

            console.log(response.data);
        } catch (error) {
            console.error('Failed to edit comment: ', error);
        } finally {
            setEditCommentContent('')
            setIsEditCommentModalOpen(false)
            setEditCommentId('')
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axios.post(`http://localhost:8000/comment/${commentId}/delete`);

            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to delete comment: ', error);
        }
    }

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await axios.get(`http://localhost:8000/posts/${id}`);
                const post = postResponse.data.post[0];
    
                const userResponse = await axios.get(`http://localhost:8000/user?id=${post.userId}`);
                const user = userResponse.data.user;

                const isLikedResponse = await axios.post(`http://localhost:8000/posts/${id}/liked`, { userId: userId });
                const isLiked = isLikedResponse.data.isLiked;
    
                const postWithUserInfo = { ...post, user, isLiked };
                
                setPost(postWithUserInfo);
            } catch (error) {
                console.error('Failed to fetch post: ', error);
            } 
        }

        const fetchComments = async () => {
            try {
                const commentsResponse = await axios.get(`http://localhost:8000/comments/${id}`);
                const commentsWithUserInfo = await Promise.all(commentsResponse.data.comments.map(async comment => {
                    const userResponse = await axios.get(`http://localhost:8000/user?id=${comment.userId}`)
                    const user = userResponse.data.user;

                    return { ...comment, user }
                }))

                setComments(commentsWithUserInfo);
            } catch (error) {
                console.error('Failed to fetch comments');
            } 
        }

        fetchPost()
        fetchComments()
    }, [post, comments])

    if (!post.user) {
        return <Loader />
    }

    return (
        <div>
            <Header />

            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modalContainer"
                style={{ overlay: {background: 'rgba(0, 0, 0, 0.5)'} }}
            >
                <div className="modalContent">
                    <h1 className="title">New Comment</h1>
                    <IoMdClose className="closeButton" onClick={closeModal}>Close</IoMdClose>
                    <textarea className="textInput" maxLength={1000} onChange={event => setCommentContent(event.target.value)}></textarea>
                    <button className="postButton" onClick={handleCreateComment}>Comment</button>
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
                    <button className="postButton" onClick={() => handleEditPost(id)}>Edit</button>
                </div>
            </Modal>

            <Modal 
                isOpen={isEditCommentModalOpen}
                onRequestClose={closeEditCommentModal}
                className="modalContainer"
                style={{ overlay: {background: 'rgba(0, 0, 0, 0.5)'} }}
            >
                <div className="modalContent">
                    <h1 className="title">Edit Comment</h1>
                    <IoMdClose className="closeButton" onClick={closeEditCommentModal}>Close</IoMdClose>
                    <textarea className="textInput" defaultValue={editCommentContent} maxLength={1000} onChange={event => setEditCommentContent(event.target.value)}></textarea>
                    <button className="postButton" onClick={() => handleEditComment(editCommentId)}>Edit</button>
                </div>
            </Modal>

            <div className="postContainer">
                <div className="post">
                    <div className="postHeader">
                        <div className="userInfo">
                            <img src={post.user.image ? `http://localhost:8000/images/${post.user.image}` : defaultImg} alt="" />
                            <p>{post.user.firstName} {post.user.lastName}</p>
                        </div>
                        <p>{getTimeDifference(post.createdAt)}</p>
                    </div>
                    <p className="content">{post.postContent}</p>

                    <div className="options">
                        <button onClick={openModal}>+ New Comment </button>
                        <div className="icons">
                            <div className="likeContainer" onClick={() => handleLike(id)}>
                                {post.isLiked ? (
                                    <FaHeart color="red" />
                                ) : (
                                    <VscHeart color="red" />
                                )}
                                <PostLikes postId={id} />
                            </div>
                            {post.userId == userId && 
                                <>
                                    <MdDelete size={24} color="var(--orange-5)" onClick={() => handleDeletePost(post.id)} />
                                    <BsPencilSquare size={24} color="var(--orange-5)" onClick={() => openEditModal(id)}/>
                                </>
                            }
                        </div>
                    </div>
                    
                    <div className="postComments">
                        {comments
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(comment => (
                            <div className="comment" key={comment.id}>
                                <div className="commentHeader">
                                    <div className="commentUserInfo">
                                        <img src={comment.user.image ? `http://localhost:8000/images/${comment.user.image}` : defaultImg} alt="" />
                                        <p>{comment.user.firstName} {comment.user.lastName}</p>
                                    </div>
                                    <p>{getTimeDifference(comment.createdAt)}</p>
                                </div>
                                <div className="commentContent">
                                    <p>{comment.commentContent}</p>
                                    {comment.userId == userId && 
                                        <div>
                                            <MdDelete size={16} color="var(--orange-5)" onClick={() => handleDeleteComment(comment.id)} />
                                            <BsPencilSquare size={16} color="var(--orange-5)" onClick={() => openEditCommentModal(comment.id)} />
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}