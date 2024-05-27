import React from 'react'
import Logo from '../images/1.jpeg'
import '../css/SignIn.css'
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

function SignIn({setUser}) {
    const navigate = useNavigate();
    const [values, setValues] = React.useState({
        password: '',
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

    const signInFormSubmit = async () => {
        try {
            const {user} = await auth.signInWithEmailAndPassword(values.email, values.password);
            const userData = await db.collection('users').doc(user.uid).get();
            setUser(userData.data())
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='signInForm'>
            <img src={Logo} alt="Coupled Logo" className="signInForm_logo" />
            <TextField value={values.email} onChange={handleChange('email')} id="outlined-basic" label="Email" variant="outlined" className='signInForm_email_input signInFormInput' />
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className='signInForm_password_input signInFormInput' >
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
            <button className='signInForm_submit_button' onClick={signInFormSubmit} >
                    Sign In
            </button>
        </div>
    )
}

export default SignIn;