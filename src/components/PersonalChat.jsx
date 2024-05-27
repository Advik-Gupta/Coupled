import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import '../css/PersonalChat.css'
import SendIcon from '@mui/icons-material/Send';
import { useParams, useNavigate } from 'react-router-dom';
import db from '../firebase'

function PersonalChat({user}) {
    const { personChattingWith } = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [chattingWithUser, setChattingWithUser] = useState({name: '....'});
    const [messages, setMessages] = useState([
        {message: 'Messages are loading....'},
    ])
    const [message, setMessage] = useState('');

    useEffect(() => {
        const form = document.querySelector('form')
        form.addEventListener('submit', (e) => {
            e.preventDefault()
        })
        const fetchChats = async () => {
            const currentUserData =  await db.collection('users').doc(user.userId).onSnapshot(snapshot => {
                setCurrentUser(snapshot.data())
                if (snapshot.data().messages[personChattingWith][0].message === 'No messages yet') {
                    setMessages(snapshot.data().messages[personChattingWith].slice(1))
                } else {
                    setMessages(snapshot.data().messages[personChattingWith])
                }
            })
            const chattingWithUserData =  await db.collection('users').doc(personChattingWith).get().then(data => {
                setChattingWithUser(data.data())
                return data.data()
            })
        }
        fetchChats()
    }, [])

    useEffect(() => {
        const elements = document.querySelectorAll(".personalChat_message");
        if (elements.length > 0) {
            elements[elements.length - 1].scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    const sendMessage = async () => {   
        setMessage('')
        await db.collection('users').doc(user.userId).update({
            messages: {
                [personChattingWith]: [...messages, {message: message}]
            }
        })
        const otherUserMsgs = await db.collection('users').doc(personChattingWith).get().then(data => {
            return data.data().messages[user.userId]
        })
        await db.collection('users').doc(personChattingWith).update({
            messages: {
                [user.userId]: [...otherUserMsgs, {message: message, name: currentUser.name, image: currentUser.images[0]}]
            }
        })
    }

    return (
        <>
        <div className='personalChat'>
            <p className='personalChat_matchTime'>You are chatting with {chattingWithUser.name}</p>
            <div className="messages">
                {messages.map((message) => (
                    <div id='personalChat_message' className='personalChat_message'>
                        {
                            message.image && (
                                <>
                                    <Avatar className="personalChat_image" alt={message.name} src={message.image} sx={{ width: 36, height: 36 }} />
                                </>
                            )
                        }
                        <p className={`personalChat_text ${!message.name ? "personalChat_textUser" : ""}`}>{message.message}</p>
                    </div>
                ))}
            </div>
        </div>
        <form className="personalChat_input" action="">
            <input value={message} type="text" placeholder="Type a message" className="personalChat_inputField" onChange={(e) => setMessage(e.target.value)} />
            <button className="personalChat_inputButton" onClick={sendMessage}>
                <SendIcon />
            </button>
        </form>
        </>
    )
}

export default PersonalChat