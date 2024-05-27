import React, { useState, useEffect } from 'react'
import '../css/MatchPage.css'
import Avatar from '@mui/material/Avatar';
import { useParams, useNavigate } from 'react-router-dom';
import db from '../firebase';

function MatchPage({user}) {
    const { idOfMatchedUser } = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [matchedUser, setmatchedUser] = useState(null);
    const [matchApproval, setMatchApproval] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const approveMatch = async () => {

        const currentUserData =  await db.collection('users').doc(user.userId).get().then(data => {
            setCurrentUser(data.data())
            return data.data()
        })

        const matchedUserData =  await db.collection('users').doc(idOfMatchedUser).get().then(data => {
            setmatchedUser(data.data())
            return data.data()
        })

        matchedUserData.swipedUp.map(async (person) => {
            if (person.userId === currentUserData.userId) {
                setMatchApproval(true)
                await db.collection('users').doc(user.userId).update({
                    matchedWith: [ ...currentUserData.matchedWith, matchedUserData ],
                    messages: {...currentUserData.messages, [idOfMatchedUser]: [{message: 'No messages yet'}]},
                })
                await db.collection('users').doc(idOfMatchedUser).update({
                    matchedWith: [ ...matchedUserData.matchedWith, currentUserData ],
                    messages: {...matchedUserData.messages, [user.userId]: [{message: 'No messages yet'}]},
                })
            }
        })
      }
      approveMatch()
    }, [])

    const goToChat = () => {
        navigate(`/chats/${matchedUser.userId}`)
    }
    

    return (
        <div>
            {
                matchApproval ? (
                    <>
                        <div className="matchPage">
                            <div className="matchPage_avatar">
                                <Avatar alt={matchedUser.name} src={matchedUser.images[0]} fontSize='large' />
                            </div>
                            <div className="matchPage_details">
                                <h1>You matched with <strong>{matchedUser.name}</strong></h1>
                                <p>Try your luck by sending a message!!!</p>
                                <button onClick={goToChat}>Send Message 💪</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        Sorry you have not matched with this user
                    </>
                )
            }
        </div>
    )
}

export default MatchPage