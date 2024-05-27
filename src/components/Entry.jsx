import React from 'react'
import Logo from '../images/1.jpeg'
import '../css/Entry.css'
import { auth, provider } from '../firebase'
import { useNavigate } from 'react-router-dom'

function Entry({setUser}) {
    const navigate = useNavigate();

    const signInWithEmail = () => {
        navigate('/signin')
    }

    const signUpMethod = () => {
        navigate('/signup')
    }

    return (
        <div className='entry'>
            <img src={Logo} alt="Coupled Logo" className="entry_logo" />
            <div className="entry_loginOptions">
                    <p className="entry_welcomeText">
                        Welcome Back
                    </p>
                    <button className="entry_login" onClick={signInWithEmail}>
                        Sign In
                    </button>
            </div>
            <div className="entry_signUpOptions">
                    <p className="entry_welcomeText">
                        New here?
                    </p>
                    <button className="entry_signUp" onClick={signUpMethod}>
                        Sign Up
                    </button>
            </div>
        </div>
    )
}

export default Entry