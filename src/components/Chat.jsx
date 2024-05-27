import React from 'react';
import '../css/Chat.css';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate } from 'react-router-dom';

function Chat({name, message, timestamp, profilePicture, id}) {
    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }
      
    function stringAvatar(name) {
        return {
            sx: {
            bgcolor: stringToColor(name),
            width: 56, height: 56
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const navigate = useNavigate();
      
    return (
        <div className='chat' onClick={() => navigate(`/chats/${id}`)}>
            {
                profilePicture ? (
                    <>
                        <Avatar className="chat_image" alt={name} src={profilePicture} sx={{ width: 56, height: 56 }} />
                    </>
                ) : (
                    <>
                        <Avatar {...stringAvatar(`${name}`)} />
                    </>
                )
            }
            <div className="chat_details">
                <h2 className='chat_name'>{name}</h2>    
                <p className='chat_message'>{message}</p>
            </div>
        </div>
    )
}

export default Chat