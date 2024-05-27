import React,  { useState, useEffect } from 'react'
import '../css/Chats.css'
import Chat from './Chat'
import db from '../firebase'

function Chats({user}) {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const currentUserData =  await db.collection('users').doc(user.userId).get().then(data => {
          setCurrentUser(data.data())
          return data.data()
      })
    }
    fetchChats()
  }, [])
  

  return (
    <div className='chats'>
      {
        currentUser && currentUser.matchedWith.map(person => {
          return (
            <Chat 
              name={person.name}
              id={person.userId}
              key={person.userId}
              message={currentUser.messages[person.userId][currentUser.messages[person.userId].length - 1].message}
              profilePicture={person.images[0]}
            />
          )
        })
      }
    </div>
  )
}

export default Chats