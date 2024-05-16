import React from "react";
import svgLogo from "../src/img/LOGO.png";
import { Stack } from "@mui/material";
import MainStepper from "./MainStepper";
import Header from './Pages/Header';
import Footer from './Pages/Footer';
import { Navigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import ecylogo from '../src/img/ecylogo.png'

const Main = () => {
  const matches = useMediaQuery('(min-width:800px)');
  const matches1 = useMediaQuery('(min-width:500px)');

  if (localStorage.getItem('token') === null) {
    return <Navigate to="/login" />
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "100vh",
          minHeight: "100vh",
        }}
      >

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <img src={BoschLogo} alt="bosch-logo" height="50"></img>
            <span style={{ flex: 1 }}></span>
            <Stack direction="row" alignItems="center">
              <ForumOutlinedIcon fontSize="" />
              <Typography style={{ fontSize: 14, paddingLeft: 6 }}>
                Contact us
              </Typography>
            </Stack> */}
          {/* <Header /> */}
        </Stack>

        <MainStepper />
        <Footer />
      </div>
      {/* <span style={{ flex: "1 auto" }}></span>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          style={{ backgroundColor: "#e2e2e2", padding: 16 }}
        >
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Get in touch with Loreum
            </Typography>
            <Typography style={{ fontSize: 14 }}>
              We look forward to inquiry
            </Typography>
          </Stack>
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Send us a message
            </Typography>
            <Typography style={{ fontSize: 14 }}>
              To contact form {">"}
            </Typography>
          </Stack>
        </Stack>
        {/* <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            backgroundColor: "#1976d2",
          }}
        ></Paper> } */}


    </>
  );
};

export default Main;
