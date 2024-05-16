import React from "react";
import { Button } from "@mui/material";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const LogoutButton = () => {
    const handleClick = () => {
        localStorage.removeItem("email")

        window.location.href = '/'
    };

    return (
        <Button variant="outlined" color="inherit" onClick={handleClick} endIcon={<LogoutRoundedIcon />}>Logout</Button>
    );
};

export default LogoutButton;