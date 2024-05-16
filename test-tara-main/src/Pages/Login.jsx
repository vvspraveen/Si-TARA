import * as React from 'react';
import Axios from "axios";
import TextField from '@mui/material/TextField';
import Appbar from './Appbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import fernet from 'fernet';
import BG from '../img/SiTaRA_Banner.png';
import random from 'random-key-generator';
import ReCAPTCHA from 'react-google-recaptcha';

window.Buffer = window.Buffer || require("buffer").Buffer;

const Login = () => {

    React.useEffect(() => {
        const jwtToken = localStorage.getItem("token");
        Axios.get("https://api.si-tara.com/getUserData", {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'x-access-token': localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.status === 200) {
                // stay || success
                // now check if password is changed or not 
                if (response.data.passwordChanged === false) {
                    navigate("/passwordChange")
                } else {
                    if (jwtToken === null || jwtToken === undefined || jwtToken === "") {
                        navigate("/");
                    } else {
                        navigate('/home')
                    }
                }
            }
        }).catch(error => {

        })
    })


    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const setCookie = () => {
        document.cookie = 'cookieName=TEST; expires=7; path=/'; // 'expires' sets the cookie expiration in days
    };

    const getCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return '';
    };

    const captchaRef = React.useRef(null)
    // if (localStorage.getItem('token')) {
    //     return (
    //         <Navigate to="/" />
    //     )
    // }

    function onChangecaptcha(value) {
        const response = Axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${value}&response=${process.env.REACT_APP_SECRET_KEY}`).then(response => {
            // console.log('Response Data:', response.data);
        }).catch(err => { });
        // console.log(response);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(bosch.com|in.bosch.com|de.bosch.com)$/;

        if (!email.includes("@")) {
            setError("Email should contain '@' symbol");
            return;
        } else if (!emailRegex.test(email)) {
            setError("Invalid email address");
            return;
        }
        const token = captchaRef.current.getValue();
        if (token == "") {
            alert("please check the Captcha");
            return;
        }
        captchaRef.current.reset();

        setError(null);

        console.log("request is send");
        var secret = new fernet.Secret("NYQh5VTTJWtX-RMJC5hkI8_IBrnP3h30mpwDLtNgolQ=");
        var encrypttoken = new fernet.Token({
            secret: secret
        });
        console.log("request is secret");
        var encryptedmail = encrypttoken.encode(email.toLowerCase());
        var encryptedpassword = encrypttoken.encode(password);
        console.log("request is send", encryptedmail, encryptedpassword);

        try {
            const response = await Axios.post(`https://api.si-tara.com/loginUser`, { 'mail': encryptedmail, 'password': encryptedpassword });
            // console.log(response.data.hasAccess)
            if (response.status === 200 && response.data.passwordStatus === true) {
                console.log(response.data.token);
                localStorage.setItem("token", response.data.token);
                navigate("/")
                const user_session = random.getRandom(20, 'TARA', '@', 'front')
                localStorage.setItem("sessionId", user_session)
                // localStorage.setItem("email", email);
                // localStorage.setItem("token", response.data.token);
                // if (isLocalStorageAvailable()) {
                // } else {
                //     sessionStorage.setItem("token", response.data.token)
                // }
            } else if (response.data.hasAccess === false) {
                setError(response.data.message)
            } else {
                localStorage.setItem("token", response.data.token);
                navigate("/passwordChange")
                setError(response.data.message)
            }
        } catch (error) {
            setError(error.response.data.message);
            setPassword("");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Appbar />
            <div style={{ backgroundImage: `url(${BG})`, height: '100vh', width: '100vw', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', backgroundPosition: 'right center', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '20px', borderRadius: '10px', width: 'max-content', marginBottom: 40, marginRight: 40 }}>
                    <Stack
                        sx={{
                            width: '45ch',
                        }}
                        spacing={2}
                        noValidate
                        autoComplete="off"
                        direction="column">
                        <p>Login Page</p>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <ReCAPTCHA
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            sitekey={process.env.REACT_APP_SITE_KEY}
                            ref={captchaRef}
                            onChange={onChangecaptcha}
                        />

                        <Button variant="contained" type='submit'>Sign in</Button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </Stack>
                </form>
            </div>

        </div>
    )
}
export default Login
