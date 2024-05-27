import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../css/Header.css'
import Logo from '../images/2.jpeg'
import { IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Header({backButton, hideChat, personal, hideBack}) {
  const navigate = useNavigate();

  return (
    <div className='header'>
        {
          backButton ? (
            <>
              <IconButton className={`${hideBack ? 'hidden' : ''}`} onClick={() => navigate(`${personal ? '/chats' : '/'}`)}>
                    <ArrowBackIcon className="header_icon" fontSize='large' />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => navigate('/editProfile')}>
                  <PersonIcon className="header_icon" fontSize='large' />
              </IconButton>
            </>
          )
        }
        <Link to={`${hideBack ? '' : '/'}`}>
          <img src={Logo} alt="Coupled Logo" className='header_logo' />
        </Link>
        <Link className={`${hideChat ? "hideChat" : ""}`} to="/chats">
          <IconButton>
              <ChatIcon className="header_icon" fontSize='large' />
          </IconButton>
        </Link>
    </div>
  )
}

export default Header