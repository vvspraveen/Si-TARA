import * as React from 'react';
import Paper from "@mui/material/Paper";
import Axios from "axios";
import BOSCH from "../img/bosch.png";
import TextField from '@mui/material/TextField';
import Appbar from '../Pages/Appbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import fernet from 'fernet';

const Register = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [mailError, setMailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);
    const history = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(bosch.com|in.bosch.com|de.bosch.com)$/;

        if (!email.includes("@")) {
            setMailError("Email should contain '@' symbol");
            return;
        } else if (!emailRegex.test(email)) {
            setMailError("Invalid email address");
            return;
        }
        setMailError(null)

        if (password.includes(email.split("@")[0])) {
            setPasswordError("password shouldn't contain email");
            return;
        }
        if (password.length < 13) {
            setPasswordError('Password must be at least 13 characters long');
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&.]{13,}$/.test(password)) {
            setPasswordError('Password must contain at least one letter\n, one number, and one special character');
            return;
        }

        var secret = new fernet.Secret("NYQh5VTTJWtX-RMJC5hkI8_IBrnP3h30mpwDLtNgolQ=");
        var encrypttoken = new fernet.Token({
          secret: secret
        });
        var encryptedmail=encrypttoken.encode(email.toLowerCase());
        var encryptedpassword=encrypttoken.encode(password);
        setPasswordError(null);
        const data = {
            mail: encryptedmail,
            password:encryptedpassword
        }

        Axios.post("https://api.si-tara.com/registerUser", data)
            .then(response => {
                if (response.status === 201) {
                    // history("/home", { replace: true })
                    console.log("registerd successfully")
                    // localStorage.setItem("email", email);
                } 
            }).catch(error => {
                setMailError('Email is already registered')
            })
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Appbar />

            <div>
                <form onSubmit={handleSubmit}>
                    <Stack
                        sx={{
                            width: '45ch',
                        }}
                        spacing={2}
                        noValidate
                        autoComplete="off"
                        direction="column">
                        <p>Register Page</p>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(mailError)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(passwordError)}
                        />
                        <Button variant="contained" type='submit'>Sign up</Button>
                    </Stack>
                </form>
                {mailError ? <p style={{ color: 'red' }}>{mailError}</p> : <p style={{ color: 'red' }}>{passwordError}</p>}
                {/* {mailError && }
                {passwordError && } */}
            </div>
            <Paper
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    backgroundColor: "#1976d2",
                }}
                elevation={3}
            ><img src={BOSCH} style={{ height: "50px", maxWidth: "50%", float: "right", marginRight: "10px", marginTop: "5px" }} /></Paper>
        </div>
    )
}
export default Register