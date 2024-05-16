import React from "react";
import { CardContent, Stack, Tab, Tabs } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import Card from "@mui/material/Card";

const styles = {
    tabs: {
        borderRadius: '0px 0px 0px 0px',
        backgroundColor: '#f0f0f0',
    },
    tab: {
        borderRadius: 16,
    },
};

const AuthTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue)
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {/* <Appbar /> */}
            <Stack direction="column">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                    sx={styles.tabs}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>
                {value === 0 && <Card><CardContent><Login /></CardContent></Card>}
                {value === 1 && <Card><CardContent><Register /></CardContent></Card>}
            </Stack>
        </div>
    );
}

export default AuthTabs;