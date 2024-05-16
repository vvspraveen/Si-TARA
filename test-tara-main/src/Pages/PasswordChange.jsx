import * as React from 'react';
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Axios from "axios";
import TextField from '@mui/material/TextField';
import Appbar from './Appbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate, Navigate } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import fernet from 'fernet';


const PasswordChange = () => {

    // const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [updatedPassword, setUpdatedPassword] = React.useState("");
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const { email } = jwtDecode(token);

    
        Axios.get("https://api.si-tara.com/getUserData", { headers: { 'Access-Control-Allow-Origin': '*', 'x-access-token': localStorage.getItem("token") } }).then((response) => {
          if (response.data === true) { navigate('/'); }
        })
    //   })

    // if (isLocalStorageAvailable()) {
    //     if (localStorage.getItem('token')) {
    //         return (
    //             <Navigate to="/" />
    //         )
    //     }
    // } else {
    //     if (sessionStorage.getItem('token')) {
    //         return (
    //             <Navigate to="/" />
    //         )
    //     }
    // }

    // function isLocalStorageAvailable() {
    //     try {
    //         const testKey = "__localTest__";

    //         localStorage.setItem(testKey, testKey);
    //         localStorage.removeItem(testKey);

    //         return true;
    //     } catch (e) {
    //         return false;
    //     }
    // }

    const handleChange = (e) => {
        e.preventDefault();
      };

    const handleSubmit = async (event) => {
        try {
            console.log(password === updatedPassword)
            if (password === updatedPassword) {
                var secret = new fernet.Secret('NYQh5VTTJWtX-RMJC5hkI8_IBrnP3h30mpwDLtNgolQ=');
                var encrypttoken = new fernet.Token({
                  secret: secret
                });
                var encryptedmail=encrypttoken.encode(email.toLowerCase());
                var encryptedpassword=encrypttoken.encode(updatedPassword);
                const response = await Axios.post("https://api.si-tara.com/updatePassword", { 
                    'mail': encryptedmail, 'password': encryptedpassword 
                });
                if (response.status === 200) {
                    navigate("/")
                    // localStorage.setItem("email", email);
                    // localStorage.setItem("token", response.data.token);
                    // if (isLocalStorageAvailable()) {
                    //     localStorage.setItem("token", response.data.token);
                    // } else {
                    //     sessionStorage.setItem("token", response.data.token)
                    // }
                } else {
                    setError(response.data.message)
                    console.log("password updation failed")
                }
            } else {
                setError("password not matched")
                console.log("password not matched")
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Appbar />

            <div>
                    <Stack
                        sx={{
                            width: '45ch',
                        }}
                        spacing={2}
                        noValidate
                        autoComplete="off"
                        direction="column">
                        <p>Change Password</p>
                        {/* <TextField
                            label="Email"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        /> */}
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            onCopy={handleChange}
                            onPaste={handleChange}
                            onCut={handleChange}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={updatedPassword}
                            required
                            onChange={(e) => setUpdatedPassword(e.target.value)}
                            onCopy={handleChange}
                            onPaste={handleChange}
                            onCut={handleChange}
                        />
                        <Button variant="contained" disabled={password === "" && updatedPassword === ""} onClick={handleSubmit}>Update Password</Button>
                    </Stack>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

        </div>
    )
}
export default PasswordChange;