import React from 'react'
import Logo from '../images/1.jpeg'
import '../css/SignUp.css'
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { auth } from '../firebase'
import db from '../firebase'
import { useNavigate } from 'react-router-dom'

function SignUp({setUser}) {
    const navigate = useNavigate();
    const [values, setValues] = React.useState({
        password: '',
        name: '',
        email: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    
    const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const signUpFormSubmit = async () => {
        const {name, email, password} = values;
        const { user } = await auth.createUserWithEmailAndPassword(email, password)
        
        const createUserProfileDocument = async (userAuth, additionalData) => {
            if(!userAuth) return;
            
            const userId = userAuth.uid
            const userRef = db.doc(`users/${userId}`)
            const snapShot = await userRef.get();

            if(!snapShot.exists) {
                const createdAt = new Date();

                try {
                    await userRef.set({
                      createdAt,
                      userId,
                      ...additionalData,
                      interactedWith: [],
                      matchedWith: [],
                      messages: {},
                      swipedUp: [],
                    }) 
                } catch (error) {
                    console.log('error creating user', error.message)
                }
            }
        }

        await createUserProfileDocument(user, {name, email, images: ['https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720']})
        const userData = await db.collection('users').doc(user.uid).get();
        setUser(userData.data())
        navigate('/editProfile')
    }

    return (
        <div className='signUpForm'>
            <img src={Logo} alt="Coupled Logo" className="signUpForm_logo" />
            <TextField value={values.name} onChange={handleChange('name')} id="outlined-basic" label="Name" variant="outlined" className='signUpForm_name_input signUpFormInput' />
            <TextField value={values.email} onChange={handleChange('email')} id="outlined-basic" label="Email" variant="outlined" className='signUpForm_email_input signUpFormInput' />
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className='signUpForm_password_input signUpFormInput' >
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
            <button className='signUpForm_submit_button' onClick={signUpFormSubmit} >
                    Sign Up
            </button>
        </div>
    )
}

export default SignUp