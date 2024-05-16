import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import '@bosch/frontend.kit-npm/dist/frontend-kit.css';
import jwtDecode from "jwt-decode";
import SearchForm from "./Pages/SearchForm";
import Lottie from 'react-lottie';
import success from './lottie/success'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import svgLogo from "../src/img/LOGO.png";
import useMediaQuery from '@mui/material/useMediaQuery';
import DisabledHeader from './Pages/DisabledHeader';
import { useLocation } from 'react-router-dom';
import './styles.css'
//import Tracebility from './Tracebility';


import autoTable from 'jspdf-autotable';

// import MainTaraPDF from "./Pages/EditData_AP";
import { jsPDF } from 'jspdf';

import {
  Stepper,
  Step,
  StepLabel,
  Stack,
  Typography,
  Button,
  StepButton,
  Grid,
  Paper,
  Box,
  Radio,
  Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import './index.css'
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector";
import Axios from "axios";
import step1 from './img/step1.svg';
import step2 from './img/step2.svg';
import step3 from './img/step3.svg';
import step4 from './img/step4.svg';
import { useNavigate } from "react-router-dom";
import Header from "./Pages/Header";
import EditData_AP from "./Pages/EditData_AP1";
import random from 'random-key-generator';
import { rgb } from "d3";


var assumm;
var misuss;
var damscenario;
var secgoalls;
var ThreatScenarioss;
var security_needs;
var riskass;
var updassoc;



function TabPanel(props) {
  const { children, value, index, ...other } = props;



  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  width: 'max-content',
}));


const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18
  },
  // [`&.${stepConnectorClasses.active}`]: {
  //   [`& .${stepConnectorClasses.line}`]: {
  //     backgroundColor: "#2364cc"
  //   }
  // },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#2364cc"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1
  }
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: "#2364cc",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)"
  }),
  ...(ownerState.completed && {
    backgroundColor: "#2364cc"
  })
}));


function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <img src={step1} style={{ width: '1.5rem' }} />,
    2: <img src={step2} style={{ width: '1.5rem' }} />,
    3: <img src={step3} style={{ width: '1.5rem' }} />,
    4: <img src={step4} style={{ width: '1.5rem' }} />,
    5: <img src={step4} style={{ width: '1.5rem' }} />
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      class={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  class: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node
};

const steps = ["Interfaces and Protocols", "Cloud", "Database", "Applications and Servers", "Automotive ECUs"];
const user_session = random.getRandom(20, 'TARA', '@', 'front')
console.log(localStorage.getItem("sessionId"))
const token = localStorage.getItem('token');


const PDFViewer3 = () => {
  const [value, setValue] = React.useState(0)
  const [showComponent, setShowComponent] = React.useState(false);
  const [zipFileUrl, setzipFileUrl] = React.useState('');
  const [displayPdfUrl, setDisplayPdfUrl] = React.useState('');
  const [displayATPdfUrl, setDisplayATPdfUrl] = React.useState('');
  const [displayDocUrl, setDisplayDocUrl] = React.useState('');
  const [displayTGUrl, setDisplayTGUrl] = React.useState('');
  const [countdown, setCountdown] = React.useState(120); // Initial countdown value in seconds
  const token = localStorage.getItem('token');
  const [tabName, setTabName] = React.useState(localStorage.getItem('docType') === "AP .PDF" ? 'TARA PDF' : localStorage.getItem('docType') === "AP SCD" ? 'SECURITY CONCEPT DOCUMENT' : localStorage.getItem('docType') === "AP AT" ? 'ATTACK TREES PDF' : localStorage.getItem('docType') === "AP TR" ? 'TRACEABILITY GRAPHS PDF' : '')
  const [pdfStatus, setPDFStatus] = React.useState('processing');
  const [xlStatus, setXLStatus] = React.useState('processing');
  const [secStatus, setSecStatus] = React.useState('processing');
  const [vdStatus, setVDStatus] = React.useState('processing');

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [leSecStatus, setLESecStatus] = React.useState('processing');
  const [displayLeDocUrl, setDisplayLeDocUrl] = React.useState('');
  const [lexlStatus, setLEXLStatus] = React.useState('processing');

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var ap_pdf = !(localStorage.getItem("docType").includes("AP .PDF"))
  //console.log(test) 
  var ap_scd = !(localStorage.getItem("docType").includes("AP SCD"))
  //console.log(test) 
  var ap_vd = !(localStorage.getItem("vulnStat"))



  var le_pdf = !(localStorage.getItem("docType").includes("LE .PDF"))
  //console.log(test) 
  var le_scd = !(localStorage.getItem("docType").includes("LE SCD"))
  //console.log(test) 
  var le_vd = !(localStorage.getItem("vulnStat"))


  // 'AP .xlsm': false,
  //   'AP .PDF': false,
  //   'AP SCD': false,
  //   'AP AT': false,
  //   'AP VD': false,
  //   'AP TR': false,

  useEffect(() => {
    if ((localStorage.getItem("docType").includes("AP .PDF"))) {
      if (pdfStatus === 'processing') {
        const id = setInterval(() => {

          fetchPDFStatus()
          console.log("in pdf statu", pdfStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [pdfStatus]);

  useEffect(() => {

    // console.log(test) 





    // console.log(!localStorage.getItem("docType").includes("AP VD"))
    if ((localStorage.getItem("docType").includes("AP .xlsm")) && ap_pdf && ap_scd && ap_vd) {
      if (xlStatus === "processing") {
        console.log("in wowcxl")
        const id = setInterval(() => {
          fetchXLStatus()
          console.log("in xl statu", xlStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [xlStatus]);

  useEffect(() => {

    // console.log(test) 





    // console.log(!localStorage.getItem("docType").includes("AP VD"))
    if ((localStorage.getItem("docType").includes("AP .xlsm"))) {
      if (xlStatus === "processing") {
        console.log("in wowcxl")
        const id = setInterval(() => {
          fetchXLStatus()
          console.log("in xl statu", xlStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [xlStatus]);

  useEffect(() => {
    console.log(localStorage.getItem("vulnStat"))
    if ((localStorage.getItem("vulnStat") === "true") || localStorage.getItem("LEvulnStat") === "true") {
      if (vdStatus === "processing") {
        console.log("in vd stst")
        const id = setInterval(() => {
          fetchVDStatus()
          console.log("in vuln statu", vdStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [vdStatus]);

  //////////////////////////////////////////////LE STATUS .xlsm/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if ((localStorage.getItem("docType").includes("LE .xlsm"))) {
      if (lexlStatus === "processing") {
        console.log("in wowcxl")
        const id = setInterval(() => {
          fetchLEXLStatus()
          console.log("in le xl statu", xlStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [lexlStatus]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////LE STATUS SCD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if ((localStorage.getItem("docType").includes("LE SCD"))) {
      if (leSecStatus === "processing") {
        console.log("in le scd status")
        const id = setInterval(() => {
          fetchLESecDocStatus()
          console.log("in le scd statu", leSecStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [leSecStatus]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    console.log((localStorage.getItem("docType").includes("AP .xlsm")) && (localStorage.getItem("vulnStat")))
    if ((localStorage.getItem("docType").includes("AP .xlsm")) && (localStorage.getItem("vulnStat") === "true")) {
      if (vdStatus === "processing") {
        console.log("in xlvdStat")
        const id = setInterval(() => {
          fetchXLVDStatus()
          console.log("in xl statu", xlStatus)
          console.log("in VD statu", vdStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [vdStatus, xlStatus]);

  useEffect(() => {
    console.log((localStorage.getItem("docType").includes("AP .PDF")) && (localStorage.getItem("vulnStat")))
    if ((localStorage.getItem("docType").includes("AP .PDF")) && (localStorage.getItem("vulnStat"))) {
      if (vdStatus === "processing" && pdfStatus === "processing") {
        console.log("in pdfvulnstat")
        const id = setInterval(() => {
          fetchPDFStatus()
          fetchVDStatus()
          console.log("in PDF statu", pdfStatus)
          console.log("in VD statu", vdStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [vdStatus, pdfStatus]);

  useEffect(() => {
    console.log(localStorage.getItem("docType").length === 15)
    if ((localStorage.getItem("docType").includes("AP SCD"))) {
      console.log(localStorage.getItem("docType").length === 2)
      console.log(localStorage.getItem("docType").length)
      if (secStatus === "processing") {
        // console.log("in xlstatus")
        const id = setInterval(() => {
          fetchSecDoc()
          console.log("in xlsec statu", secStatus)
        }, 5000);

        // pdfStatus === "processing" ? "" : clearInterval(id)
        return () => {
          clearInterval(id)
        }
      }
    }
  }, [secStatus]);

  // useEffect(() => {
  //   if ()
  // })

  const fetchPDFStatus = async () => {
    localStorage.setItem("vulnStat", false)
    try {
      console.log(localStorage.getItem("sessionId"))
      Axios.post("https://api.si-tara.com/getPDFStatus", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
        "methodology": localStorage.getItem("methodology"),
        "docType": localStorage.getItem('docType')
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.PDF_status === "generated") {
            setPDFStatus(res.data.PDF_status)
            setDisplayPdfUrl(res.data.url)
            setShowComponent(true)
            localStorage.setItem("status", 1)
          }
        }
      })
    }
    catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }

  const fetchSecDoc = async () => {
    try {
      console.log(localStorage.getItem("sessionId"))
      // console.log(localStorage.getItem("methodology"))
      // console.log("fetching from db")
      Axios.post("https://api.si-tara.com/getDoc", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
        "docType": localStorage.getItem('docType')
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.secdoc_status === "generated") {
            setDisplayDocUrl(res.data.url);
            console.log(displayDocUrl)
            setSecStatus(res.data.secdoc_status)
            setShowComponent(true);
            localStorage.setItem("status", 1)
          }
          console.log("xlsec is", res.data.secdoc_status)
        }
      });
    } catch (error) {
      console.error('Error fetching XLSEC:', error);
    }
  };

  // const fetchXlSecStatus = async () => {
  //   try {
  //     Axios.post("https://api.si-tara.com/getDoc", {
  //       "email": jwtDecode(token).email,
  //       "sessionId": localStorage.getItem("sessionId"),
  //       "methodology": localStorage.getItem("methodology"),
  //       "docType": localStorage.getItem('docType')
  //     }).then((res) => {
  //       if (res.status === 200) {
  //         setPDFStatus(res.data.PDF_status)
  //         setDisplayPdfUrl(res.data.url)
  //         setShowComponent(true);

  //         localStorage.setItem("status", 1)
  //         console.log("xl status is", res.data.xl_status);
  //       }
  //     })
  //   }
  //   catch (error) {
  //     console.error('Error fetching PDF:', error);
  //   }
  // }

  const fetchXLVDStatus = async () => {
    try {
      // setShowComponent(true);
      console.log("fetching from db")
      Axios.post("https://api.si-tara.com/getXLVDStatus", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
      }).then((res) => {
        if (res.status === 200) {
          if ((res.data.xl_status === "generated" && res.data.VD_status === "generated")) {
            setzipFileUrl(res.data.url);
            setXLStatus(res.data.xl_status);
            setVDStatus(res.data.VD_status)
            setShowComponent(true);
            localStorage.setItem("status", 1)
          }
          console.log("xl status is", res.data.xl_status);
          console.log("xl status is", res.data.VD_status);
        }
      });
      // console.log(response.data.url)
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }

  const fetchVDStatus = async () => {
    try {
      // setShowComponent(true);
      console.log("fetching from db")
      Axios.post("https://api.si-tara.com/getVDFile", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
      }).then((res) => {
        if (res.status === 200) {
          if ((res.data.VD_status === "generated")) {
            setzipFileUrl(res.data.url);
            setVDStatus(res.data.VD_status)
            setShowComponent(true);
            localStorage.setItem("status", 1)
          }
          console.log("VD status is", res.data.VD_status);
        }
      });
      // console.log(response.data.url)
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }

  const fetchXLStatus = async () => {

    localStorage.setItem("vulnStat", false)
    try {
      // setShowComponent(true);
      console.log("fetching from db")
      Axios.post("https://api.si-tara.com/getFiles", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.xl_status === "generated") {
            setzipFileUrl(res.data.url);
            setXLStatus(res.data.xl_status);
            setShowComponent(true);
            localStorage.setItem("status", 1)
          }
          console.log("xl status is", res.data.xl_status);
        }
      });
      // console.log(response.data.url)
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }


  ///////////////////////////////////////// LE .xlsm status /////////////////////////////////////////////////////////////////////////

  const fetchLEXLStatus = async () => {

    localStorage.setItem("vulnStat", false)
    try {
      // setShowComponent(true);
      console.log("fetching from db")
      Axios.post("https://api.si-tara.com/getLEFile", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
      }).then((res) => {
        if (res.status === 200) {
          setzipFileUrl(res.data.url);
          if (res.data.lexl_status === "generated") {
            setLEXLStatus(res.data.lexl_status);
            console.log("inside lexlgen")
            setShowComponent(true);
            localStorage.setItem("status", 1)
          }
          console.log("xl status is", res.data.lexl_status);
        }
      });
      // console.log(response.data.url)
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }

  ///////////////////////////////////////// LE .xlsm status /////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////// LE SCD status /////////////////////////////////////////////////////////////////////////

  const fetchLESecDocStatus = async () => {

    localStorage.setItem("vulnStat", false)
    try {
      // console.log(localStorage.getItem("methodology"))
      // console.log("fetching from db")
      Axios.post("https://api.si-tara.com/getDoc", {
        "email": jwtDecode(token).email,
        "sessionId": localStorage.getItem("sessionId"),
        "docType": localStorage.getItem('docType')
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.secdoc_status === "generated") {
            setDisplayLeDocUrl(res.data.url);
            setLESecStatus(res.data.secdoc_status)
            setShowComponent(true);
            localStorage.setItem("status", 1)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching XLSEC:', error);
    }
  };

  ///////////////////////////////////////// LE SCD status /////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // fetchPDFStatus()
    const fetchZipFile = async () => {
      try {
        // setShowComponent(true);
        console.log("fetching from db")
        const response = await Axios.post("https://api.si-tara.com/getFiles", {
          "email": jwtDecode(token).email,
          "sessionId": localStorage.getItem("sessionId")
        });
        setzipFileUrl(response.data.url);
        // console.log(response.data.url)
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    const fetchPdf = async () => {
      try {
        // console.log(localStorage.getItem("methodology"))
        // console.log("fetching from db")
        const response = await Axios.post("https://api.si-tara.com/getPdf", {
          "email": jwtDecode(token).email,
          "sessionId": localStorage.getItem("sessionId"),
          "methodology": localStorage.getItem("methodology"),
          "docType": localStorage.getItem('docType')
        });
        setDisplayPdfUrl(response.data.url);

        // const fileStats = await Axios.post("https://api.si-tara.com/fileStatus", {
        //   "email": jwtDecode(token).email,
        // });
        // console.log(fileStats.data.xl_status)
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    const fetchATPdf = async () => {
      try {
        // console.log(localStorage.getItem("methodology"))
        console.log("fetching from AT")
        const response = await Axios.post("https://api.si-tara.com/getAT", {
          "email": jwtDecode(token).email,
          "sessionId": localStorage.getItem("sessionId"),
          "docType": localStorage.getItem('docType')
        });
        setDisplayATPdfUrl(response.data.url);

        // const fileStats = await Axios.post("https://api.si-tara.com/fileStatus", {
        //   "email": jwtDecode(token).email,
        // });
        // console.log(fileStats.data.xl_status)
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    const fetchSecDoc = async () => {
      try {
        // console.log(localStorage.getItem("methodology"))
        // console.log("fetching from db")
        const response = await Axios.post("https://api.si-tara.com/getDoc", {
          "email": jwtDecode(token).email,
          "sessionId": localStorage.getItem("sessionId"),
          "docType": localStorage.getItem('docType')
        });
        setDisplayDocUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    const fetchTG = async () => {
      try {
        // console.log(localStorage.getItem("methodology"))
        // console.log("fetching from db")
        const response = await Axios.post("https://api.si-tara.com/getTG", {
          "email": jwtDecode(token).email,
          "sessionId": localStorage.getItem("sessionId"),
          "docType": localStorage.getItem('docType')
        });
        setDisplayTGUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      // fetchZipFile();
      fetchPdf();
      // fetchDoc();
      fetchATPdf();
      fetchTG();
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  const calculateProgress = () => {
    const initialCountdown = 120;
    return ((initialCountdown - countdown) / initialCountdown) * 100;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabName(event.target.innerText)
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: success,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };


  return (

    <div>
      {showComponent ? (
        <div>
          {(localStorage.getItem("docType").includes("AP .xlsm")
            || localStorage.getItem("docType").includes("AP SCD")
            || localStorage.getItem("docType").includes("AP .PDF")
            || localStorage.getItem("vulnStat")
            || localStorage.getItem("LEvulnStat")
            || localStorage.getItem("docType").includes("LE .xlsm")
            || localStorage.getItem("docType").includes("LE SCD")
          ) ? (
            // <div>
            //   {
            //     <div>
            //       <a href={zipFileUrl} target="_blank" rel="noopener noreferrer">
            //         <center>Download your SEP documents</center>
            //       </a>
            //       <Box
            //         sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100vh', width: '100%' }}
            //       >
            //         <Tabs
            //           centered
            //           orientation="horizontal"
            //           value={value}
            //           onChange={handleChange}
            //           aria-label="Vertical tabs example"
            //           sx={{ border: 1, borderColor: 'divider', padding: 5 }}
            //         ><Tab label="TaRA PDF" {...a11yProps(0)} />
            //           <Tab label="Security Concept Document" {...a11yProps(1)} />
            //           <Tab label="Attack Trees PDF" {...a11yProps(2)} />
            //           <Tab label="Traceability Graphs PDF" {...a11yProps(3)} />
            //         </Tabs>
            //         <TabPanel value={value} index={0} sx={{ padding: '0px' }}>

            //           <Stack
            //             component="form"
            //             sx={{
            //               width: '75rem',
            //               padding: 0
            //             }}
            //             noValidate
            //             autoComplete="off"
            //           >
            //             <iframe src={`${displayPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>


            //           </Stack>

            //         </TabPanel>
            //         <TabPanel value={value} index={1} sx={{ padding: 0 }}>
            //           <Stack
            //             component="form"
            //             sx={{
            //               width: '75rem',
            //               padding: 0
            //             }}
            //             noValidate
            //             autoComplete="off"
            //           >
            //             <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px" padding='0px'></iframe>
            //           </Stack>
            //         </TabPanel>
            //         <TabPanel value={value} index={2} sx={{ padding: 0 }}>
            //           <Stack
            //             component="form"
            //             sx={{
            //               width: '75rem',
            //               padding: 0
            //             }}
            //             noValidate
            //             autoComplete="off"
            //           >
            //             <iframe src={`${displayATPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>
            //           </Stack>
            //         </TabPanel>
            //         <TabPanel value={value} index={3} sx={{ padding: 0 }}>
            //           <Stack
            //             component="form"
            //             sx={{
            //               width: '75rem',
            //               padding: 0
            //             }}
            //             noValidate
            //             autoComplete="off"
            //           >
            //             <iframe src={`${displayTGUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>
            //           </Stack>
            //         </TabPanel>
            //       </Box>
            //     </div>
            //   }
            // </div>
            <div>
              {
                ((xlStatus === "generated" || lexlStatus === "generated")) ?
                  <>
                    {/* <h1>in main</h1> */}
                    {console.log("inside show component true")}
                    <div style={{ textAlign: 'center' }}>
                      <a href={zipFileUrl} target="_blank" rel="noopener noreferrer">
                        {console.log("in download")}
                        <center style={{ display: 'inline', textAlign: 'center' }}>Download your SEP documents</center>
                      </a>
                    </div> <Box
                      padding={0}
                      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100vh', width: '100%', padding: '0px' }}
                    >
                      {localStorage.setItem("status", 1)}
                      {(pdfStatus === "generated") && <iframe src={`${displayPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>}
                      {(secStatus === "generated") && <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>}
                      {(leSecStatus === "generated") && <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayLeDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>}
                      {/* <Stack direction={'column'} sx={{ padding: 5 }}>
                        <center><Typography style={{ fontWeight: "bold" }}>Click Below Tabs to View the Documents</Typography></center>
                        {localStorage.setItem("status", 1)}
                        <Tabs
                          orientation="horizontal"
                          centered
                          value={value}
                          onChange={handleChange}
                          aria-label="Vertical tabs example"
                          sx={{ border: 1, borderColor: 'divider', marginTop: '24px', marginLeft: 6.2, marginRight: 6.2 }}
                        >
                          {(localStorage.getItem("docType").includes("AP .PDF")) ? <Tab label="TaRA PDF"  {...a11yProps(0)} /> : ""}
                          {(localStorage.getItem("docType").includes("LE .PDF")) ? <Tab label="TaRA PDF"  {...a11yProps(0)} /> : ""}
                          {(localStorage.getItem("docType").includes("AP SCD")) ? <Tab label="Security Concept Document" {...a11yProps(1)} /> : ""}
                          {(localStorage.getItem("docType").includes("LE SCD")) ? <Tab label="Security Concept Document" {...a11yProps(1)} /> : ""}
                          {((localStorage.getItem("docType").includes("AP AT")) && (localStorage.getItem("methodology") === "Attack Potential")) ? <Tab label="Attack Trees PDF" {...a11yProps(2)} /> : ""}
                          {(localStorage.getItem("docType").includes("AP TR")) ? <Tab label="Traceability Graphs PDF" {...a11yProps(3)} /> : ""}
                          {(localStorage.getItem("docType").includes("LE TR")) ? <Tab label="Traceability Graphs PDF" {...a11yProps(3)} /> : ""}
                        </Tabs>

                        {((tabName === "TARA PDF") && (pdfStatus === "generated")) ? <TabPanel value={value} index={value} sx={{ padding: 0 }}>

                          <Stack
                            component="form"
                            sx={{
                              width: '75rem',
                              paddingLeft: '50px',
                              paddingRight: '50px',
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <iframe src={`${displayPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>


                          </Stack>

                        </TabPanel> : ""}
                        {((tabName === "SECURITY CONCEPT DOCUMENT") && (secStatus === "generated")) ? <TabPanel value={value} index={value} sx={{ padding: 0 }}>
                          <Stack
                            component="form"
                            sx={{
                              width: '75rem',
                              paddingLeft: '50px',
                              paddingRight: '50px',
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>
                          </Stack>
                        </TabPanel> : ""}
                        {tabName === "ATTACK TREES PDF" ? <TabPanel value={value} index={value} sx={{ padding: 0 }}>
                          <Stack
                            component="form"
                            sx={{
                              width: '75rem',
                              paddingLeft: '50px',
                              paddingRight: '50px',
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <iframe src={`${displayATPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>
                          </Stack>
                        </TabPanel> : ""}
                        {tabName === "TRACEABILITY GRAPHS PDF" ? <TabPanel value={value} index={value} sx={{ padding: 0 }}>
                          <Stack
                            component="form"
                            sx={{
                              width: '75rem',
                              paddingLeft: '50px',
                              paddingRight: '50px',
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <iframe src={`${displayTGUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>
                          </Stack>
                        </TabPanel> : ""}
                      </Stack> */}

                    </Box>
                  </> :
                  <>
                    {/* <h1>in else</h1> */}
                    {localStorage.setItem("status", 1)}
                    {(pdfStatus === "generated") && <iframe src={`${displayPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>}
                    {(leSecStatus === "generated") && <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayLeDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>}
                    {(localStorage.getItem("docType").includes("AP SCD") && (secStatus === "processing") || localStorage.getItem("docType").includes("LE SCD") && (secStatus === "processing")) ?
                      <>
                        <l-line-spinner
                          size="40"
                          stroke="3"
                          speed="1"
                          color="black">
                        </l-line-spinner>
                        <h6 style={{ marginLeft: '10px' }}>{(localStorage.getItem("docType").includes("AP SCD") && (secStatus === "processing") || localStorage.getItem("docType").includes("LE SCD") && (secStatus === "processing")) ? "Security Concept document is generating please wait....." : ""}<br></br></h6>
                      </> : (secStatus === "generated") && <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>}
                    {(xlStatus === "generated" || lexlStatus === "generated") ? <><h1>{xlStatus}</h1>
                      <div style={{ textAlign: 'center' }}>
                        <a href={zipFileUrl} target="_blank" rel="noopener noreferrer">
                          {console.log("in download")}
                          <center style={{ display: 'inline', textAlign: 'center' }}>Download your SEP documents</center>
                        </a>
                      </div></> : ""}
                    {((vdStatus === "generated" && localStorage.getItem("vulnStat") === "true") || (vdStatus === "generated" && localStorage.getItem("LEvulnStat") === "true")) && <div style={{ textAlign: 'center' }}>
                      <a href={zipFileUrl} target="_blank" rel="noopener noreferrer">
                        {console.log("in download")}
                        <center style={{ display: 'inline', textAlign: 'center' }}>Download your SEP documents</center>
                      </a>
                    </div>}
                    {/* {(vdStatus === "generated") && (<div style={{ textAlign: 'center' }}>
                      <a href={zipFileUrl} target="_blank" rel="noopener noreferrer">
                        {console.log("in download")}
                        <center style={{ display: 'inline', textAlign: 'center' }}>Download your SEP documents</center>
                      </a>
                    </div>)} */}
                  </>
              }
            </div>
          ) : (setShowComponent(false))}
        </div>
      ) : (
        <div>
          {((localStorage.getItem("docType").includes("AP .xlsm")) || (localStorage.getItem("docType").includes("AP SCD")) || (localStorage.getItem("docType").includes("AP .PDF")) || (localStorage.getItem("docType").includes("LE .xlsm")) || (localStorage.getItem("docType").includes("LE SCD")) || (localStorage.getItem("vulnStat"))) ?
            (secStatus === "processing" || xlStatus === "processing" || pdfStatus === "processing" || lexlStatus === "processing" || leSecStatus === "processing" || vdStatus === "processing") ?
              <>
                {/* <div><center>You can download your files in: {countdown} seconds</center></div> */}
                {localStorage.setItem("status", 0)}
                {/* {console.log("in timer")}
                {console.log("ap.xlsm", localStorage.getItem("docType").includes("AP .xlsm"))}
                {(localStorage.getItem("docType").includes("AP .xlsm") && localStorage.getItem("docType").includes("AP SCD")) ? console.log("both are available") : console.log("not available")} */}
                <div>
                  <Stack direction='column' alignItems={'center'}>
                    {/* //////////////////////////////////////////////LE STATUS .xlsm///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                    {(localStorage.getItem("docType").includes("LE .xlsm") && (lexlStatus === "processing")) ?
                      <>
                        {(pdfStatus === "generated") ?
                          <>
                            <div><center>You can download your files in: {countdown} seconds</center></div>
                            {localStorage.setItem("status", 0)}
                            <div
                              style={{
                                width: '100%',
                                height: '10px',
                                backgroundColor: '#f3f3f3',
                                borderRadius: '5px',
                                marginTop: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: `${calculateProgress()}%`,
                                  height: '100%',
                                  backgroundColor: '#000080',
                                  borderRadius: '5px',
                                }}
                              ></div>
                            </div>
                          </> :
                          (lexlStatus === "processing" && localStorage.getItem("docType").includes("LE .xlsm")) &&

                          <>
                            <l-line-spinner
                              size="40"
                              stroke="3"
                              speed="1"
                              color="black">
                            </l-line-spinner>
                            <h6 style={{ marginLeft: '10px' }}>.xlsm document is generating please wait.....</h6>
                            <div><center>You can download your files in: {countdown} seconds</center></div>
                            {localStorage.setItem("status", 0)}
                            <div
                              style={{
                                width: '100%',
                                height: '10px',
                                backgroundColor: '#f3f3f3',
                                borderRadius: '5px',
                                marginTop: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: `${calculateProgress()}%`,
                                  height: '100%',
                                  backgroundColor: '#000080',
                                  borderRadius: '5px',
                                }}
                              ></div>
                            </div>
                          </>
                        }</>
                      :
                      (lexlStatus === "generated") &&
                      <>
                        <Lottie
                          options={defaultOptions}
                          height={70}
                          width={70} />
                        <h6 style={{ marginLeft: '10px' }}>".xlsm document is generated"</h6>
                      </>
                    }

                    {/* //////////////////////////////////////////////LE STATUS .xlsm///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}


                    {(localStorage.getItem("docType").includes("AP .xlsm") && (xlStatus === "processing")) ?
                      <>
                        {(pdfStatus === "generated") ?
                          <>
                            <div><center>You can download your files in: {countdown} seconds</center></div>
                            {localStorage.setItem("status", 0)}
                            <div
                              style={{
                                width: '100%',
                                height: '10px',
                                backgroundColor: '#f3f3f3',
                                borderRadius: '5px',
                                marginTop: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: `${calculateProgress()}%`,
                                  height: '100%',
                                  backgroundColor: '#000080',
                                  borderRadius: '5px',
                                }}
                              ></div>
                            </div>
                          </> :
                          (((xlStatus === "processing") && (localStorage.getItem("docType").includes("AP .xlsm")))) &&

                          <>
                            <l-line-spinner
                              size="40"
                              stroke="3"
                              speed="1"
                              color="black">
                            </l-line-spinner>
                            <h6 style={{ marginLeft: '10px' }}>.xlsm document is generating please wait.....</h6>
                            <div><center>You can download your files in: {countdown} seconds</center></div>
                            {localStorage.setItem("status", 0)}
                            <div
                              style={{
                                width: '100%',
                                height: '10px',
                                backgroundColor: '#f3f3f3',
                                borderRadius: '5px',
                                marginTop: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: `${calculateProgress()}%`,
                                  height: '100%',
                                  backgroundColor: '#000080',
                                  borderRadius: '5px',
                                }}
                              ></div>
                            </div>
                          </>
                        }</>
                      :
                      (xlStatus === "generated") &&
                      <>
                        <Lottie
                          options={defaultOptions}
                          height={70}
                          width={70} />
                        <h6 style={{ marginLeft: '10px' }}>".xlsm document is generated"</h6>
                      </>
                    }
                    {/* <h6 style={{ marginLeft: '10px' }}>
                          {(localStorage.getItem("docType").includes("AP .xlsm") && (xlStatus === "processing")) ? ".xlsm document is generating please wait....." : ".xlsm document is generated"}<br></br>
                        </h6> */}
                    {/* </> : ""} */}
                    {(localStorage.getItem("docType").includes("AP .PDF") && (pdfStatus === "processing")) ?
                      <>
                        {(localStorage.getItem("docType").includes("AP .PDF") && (pdfStatus === "processing")) ?
                          <l-line-spinner
                            size="40"
                            stroke="3"
                            speed="1"
                            color="black">
                          </l-line-spinner>

                          :


                          <Lottie
                            options={defaultOptions}
                            height={70}
                            width={70}
                          />}

                        <h6 style={{ marginLeft: '10px' }}>{(localStorage.getItem("docType").includes("AP .PDF") && (pdfStatus === "processing")) ? "TaRA PDF document is generating please wait....." : "TaRA PDF document is generated"}<br></br></h6>
                      </>

                      :
                      (pdfStatus === "generated") && <iframe src={`${displayPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>

                    }

                    {(((localStorage.getItem("vulnStat") === "true") && (vdStatus === "processing")) && (localStorage.getItem("docType").includes("AP .xlsm") && (xlStatus === "processing")) || ((localStorage.getItem("LEvulnStat") === "true") && (vdStatus === "processing")) && (localStorage.getItem("docType").includes("LE .xlsm") && (lexlStatus === "processing")) || ((localStorage.getItem("vulnStat") === "true") && (vdStatus === "processing")) || ((localStorage.getItem("LEvulnStat") === "true") && (vdStatus === "processing"))) ?
                      <>
                        {/* <h1>inside vulnstat</h1> */}
                        <div><center>You can download your files in: {countdown} seconds</center></div>
                        <div
                          style={{
                            width: '100%',
                            height: '10px',
                            backgroundColor: '#f3f3f3',
                            borderRadius: '5px',
                            marginTop: '10px',
                          }}
                        >
                          <div
                            style={{
                              width: `${calculateProgress()}%`,
                              height: '100%',
                              backgroundColor: '#000080',
                              borderRadius: '5px',
                            }}
                          ></div>
                        </div>
                      </>
                      : ""}

                    {/* // <iframe src={`${displayPdfUrl}#toolbar=0`} type="application/pdf" width="100%" height="800px"></iframe>} */}


                    {(localStorage.getItem("docType").includes("AP SCD") && (secStatus === "processing")) ?
                      <>
                        <l-line-spinner
                          size="40"
                          stroke="3"
                          speed="1"
                          color="black">
                        </l-line-spinner>
                        <h6 style={{ marginLeft: '10px' }}>{(localStorage.getItem("docType").includes("AP SCD") && (secStatus === "processing")) ? "Security Concept document is generating please wait....." : ""}<br></br></h6>
                      </> : (secStatus === "generated") && <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>
                    }





                    {/* //////////////////////////////////////////////LE STATUS SCD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                    {(localStorage.getItem("docType").includes("LE SCD") && (leSecStatus === "processing")) ?
                      <>
                        <l-line-spinner
                          size="40"
                          stroke="3"
                          speed="1"
                          color="black">
                        </l-line-spinner>
                        <h6 style={{ marginLeft: '10px' }}>{(localStorage.getItem("docType").includes("LE SCD") && (leSecStatus === "processing")) ? "Security Concept document is generating please wait....." : ""}<br></br></h6>
                      </> : (leSecStatus === "generated") && <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(displayLeDocUrl)}&embedded=true`} type="text/html" width="100%" height="800px"></iframe>
                    }

                    {/* //////////////////////////////////////////////LE STATUS SCD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}


                    {/* <h6 style={{ marginLeft: '10px' }}>
                      {(localStorage.getItem("docType").includes("AP .xlsm") && (xlStatus === "processing")) ? ".xlsm document is generating please wait....." : ""}<br></br>
                      {(localStorage.getItem("docType").includes("AP .PDF") && (pdfStatus === "processing")) ? "TaRA PDF document is generating please wait....." : ""}<br></br>
                      {(localStorage.getItem("docType").includes("AP SCD") && (secStatus === "processing")) ? "Security Concept document is generating please wait....." : ""}<br></br>
                      {(localStorage.getItem("docType").includes("AP .xlsm")) ? ".xlsm document is generating please wait....." : (localStorage.getItem("docType").includes("AP SCD")) ? "SCD document is generating please wait....." : (localStorage.getItem("docType").includes("AP .PDF")) ? "TaRA PDF document is generating please wait....." : (localStorage.getItem("docType").includes("AP VD")) ? "Vulnerability document is generating please wait....." : "All Docs are generating please wait"}
                    </h6> */}
                  </Stack>
                </div>
              </>
              :
              <>
                <Stack direction='row' alignItems={'center'}>
                  <div>
                    <Lottie
                      options={defaultOptions}
                      height={70}
                      width={70}
                    />
                  </div>
                  <h6>
                    {xlStatus === "generated" ? ".xlsm document is generated" : ""}<br></br>
                    {secStatus === "generated" ? "Sec document is generated" : ""}<br></br>
                    {pdfStatus === "generated" ? ".pdf document is generated" : ""}<br></br>
                    {/* {xlStatus === "generated" ? ".xlsm document is generated" : secStatus === "generated" ? "SCD document is generated" : pdfStatus === "generated" ? "TaRA PDF document is generated" : vdStatus === "generated" ? "Vulnerability document is generated" : "All Docs are generated"} */}
                    {/* {"documents are generated"} */}
                  </h6>
                </Stack>
              </>
            :
            <>{console.log("xl and sec not selected")}</>
          }
        </div>
      )
      }
    </div >
  );
};

const MainStepper = () => {

  // const [selectedValues, setSelectedValue] = React.useState([""])

  // const selectedValues = [""]

  const [interfaces, setInterfaces] = React.useState(new Set());
  const [cloud, setCloud] = React.useState(new Set());
  const [database, setDatabase] = React.useState(new Set());
  const [application, setApplication] = React.useState(new Set());
  const [automotive, setAutomotive] = React.useState(new Set());

  const [device, setDevice] = React.useState(new Set());
  const [activeStep, setActiveStep] = React.useState(0);
  const [isGenerated, setIsGenerated] = React.useState("no");
  const [completed, setCompleted] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedMethodology, setSelectedMethodology] = React.useState('');

  const [disabledGenerate, setGenerate] = React.useState(true)

  const [awsAsset, setAwsAsset] = React.useState([]);
  const [azureAsset, setAzureAsset] = React.useState([]);
  const [gcpAsset, setGcpAsset] = React.useState([]);

  const [interfaceasset, setInterfaceAsset] = React.useState([]);

  const [automotiveAsset, setAutomotiveAsset] = React.useState([]);
  const [automotiveTCMAsset, setAutomotiveTCMAsset] = React.useState([]);

  const [reldatasset, setreldatasset] = React.useState([]);
  const [nreldatasset, setnreldatasset] = React.useState([]);
  const [memdatasset, setmemdatasset] = React.useState([]);

  const [webapplication, setwebapplication] = React.useState([]);
  const [mobileapplication, setmobileapplication] = React.useState([]);
  const [serverapplication, setserverapplication] = React.useState([]);

  const [filePath, setFilePath] = React.useState('');
  const [selectedCloud, setCloudOption] = React.useState("AWS");
  const [selectedDatabase, setDatabaseOption] = React.useState("Relational");

  const [selectedApplication, setApplicationOption] = React.useState("Web")
  const [selectedAutomotive, setAutomotiveOption] = React.useState("Powertrain")

  const [departmentName, setDepartmentName] = React.useState('')
  const [departmentNameGenerate, setDepartmentNameGenerate] = React.useState(false)

  const [projectName, setprojectName] = React.useState('')
  const [projectNameGenerate, setprojectNameGenerate] = React.useState(false)

  const [managerName, setManagerName] = React.useState('')
  const [managerNameGenerate, setManagerNameGenerate] = React.useState(false)

  const [scopeText, setScopeText] = React.useState('');
  const [scopeTextGenerate, setScopeTextGenerate] = React.useState(false);

  const [technicalText, setTechnicalText] = React.useState('');
  const [technicalTextGenerate, setTechnicalTextGenerate] = React.useState(false);

  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  const [isAPChecked, setIsAPChecked] = React.useState(false);
  const [isLEChecked, setIsLEChecked] = React.useState(false);

  const vulnCheckboxName = 'Vulnerability Document';

  const [newCheckedState, setNewCheckedState] = React.useState(false)

  const [projError, setProjError] = React.useState('');
  const [mangError, setMangError] = React.useState('');
  const [deptError, setDeptError] = React.useState('');
  const [scopeError, setScopeError] = React.useState('');
  const [techError, setTechError] = React.useState('');

  const [apMethod, isAPMethod] = React.useState(false);
  const [apMethod1, isAPMethod1] = React.useState(false);
  const [leMethod, isLEMethod] = React.useState(false);
  const [leMethod1, isLEMethod1] = React.useState(false);

  const [procText, setProcText] = React.useState([])



  // #######################################PDF Code #####################################
  const [assumption, setassumption] = React.useState([])
  const [assumption_count, setassumption_count] = React.useState(0)
  const [Assumption_Model, setAssumptionModel] = React.useState({})
  const [misuse, setmisuse] = React.useState([])
  const [misuse_count, setMisuse_count] = React.useState(0)
  const [Misuse_Model, setMisuseModel] = React.useState({})
  const [damageScenario, setDamageScenario] = React.useState([])
  const [damage_count, setDamage_count] = React.useState(0)
  const [DamageScenario_Model, setDamageScenarioModel] = React.useState({})
  const [SecGoals, setSecGoals] = React.useState([])
  const [SecGoals_count, setSecGoals_count] = React.useState(0)
  const [SecGoals_Model, setSecGoalsModel] = React.useState({})
  const [Threat, setThreat] = React.useState([])
  const [Threat_Model, setThreatModel] = React.useState({})
  const [ThreatDSs, setThreatDSs] = React.useState([])
  const [ThreatDSs_Model, setThreatDSsModel] = React.useState({})
  const [ThreatEvaluation_AP, setThreatEvaluation_AP] = React.useState([])
  const [ThreatEvaluation_AP_Model, setThreatEvaluation_APModel] = React.useState({})
  const [RiskAssessment, setRiskAssessment] = React.useState([])
  const [RiskAssesment_Model, setRiskAssesmentModel] = React.useState({})
  const [SecurityNeeds, setSecurityNeeds] = React.useState([])
  const [SecurityNeeds_Model, setSecurityNeedsModel] = React.useState({})
  const [threatDamageAssociations, setThreatDamageAssociations] = React.useState([]);
  const [updatedAssociations, setUpdatedAssociations] = React.useState([]);
  const [Tracebility_data, setTracebility_data] = React.useState({})
  const [pdfGenerationProgress, setPdfGenerationProgress] = React.useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [currentFact, setCurrentFact] = React.useState("");

  const [uploadStatus, setUploadStatus] = React.useState('');
  const [processedText, setProcessedText] = React.useState([]); // State to store processed text
  const [unavailableText, setUnavailableText] = React.useState([]); // State to store processed text
  const [uploadCompleted, setUploadCompleted] = React.useState(false); // State to track upload completion
  const [processingText, setProcessingText] = React.useState(false); // State to track text processing
  // const [imageSrc, setImageSrc] = React.useState(null);
  // const [pdfSrc, setPdfSrc] = React.useState(null);
  const [fileSrc, setFileSrc] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [zoomFactor, setZoomFactor] = React.useState(1);
  const [isPopupOpen, setPopupOpen] = React.useState(false);

  const [archData, setArchData] = React.useState([]);

  const location = useLocation(); // Get the location object

  // Access the data passed from the previous route
  useEffect(() => {
    setArchData(location.state && location.state.assetData.data)
  }, [])
  // setArchData(mainData)
  // Use the data as needed
  // console.log(mainData);


  const [dataTosend, setDataTosend] = React.useState({
    data: [],
    projectname: '',
    managername: ''
  });


  const transformToRiskAssessmentFormat = (associations, ThreatEvaluation_AP) => {

    if (!Array.isArray(ThreatEvaluation_AP)) {
      return [];
    }

    return associations.map((assoc, index) => {
      // Log the current assoc.threat value

      // Attempt to find the matching threat evaluation
      const threatEval = ThreatEvaluation_AP.find(te => {
        return te.Threat_i === assoc.threat;
      });


      const attack_Potential = threatEval ? threatEval["Attack Potential"] : 'Unknown';
      if (assoc.threat == 'Blocking BLE API') {
        console.log('ble api blocking', assoc.cons)
      }

      return {
        id: `R-${index + 1}`, // Assuming you want to prefix the ID with 'R-'
        damage_scenario: assoc.damageScenario,
        D_id: assoc.damageScenarioId,
        consequence: assoc.cons,
        Threat: assoc.threat,
        risk: calculateRiskOfD(assoc.cons),
        attackPotential: attack_Potential,
        risk_of_d: getRisk_D(attack_Potential, assoc.cons),
      };
    });
  };



  const calculateRiskOfD = (consequence) => {
    switch (consequence) {
      case 'Serious':
        return 'very high';
      case 'Severe':
        return 'high';
      case 'Moderate':
        return 'low';
      case 'Negligible':
        return 'very low';
      default:
        return 'Unknown';
    }
  };



  function getRisk_D(attackPotential, consequence) {
    if (attackPotential === 'Beyond High') {
      switch (consequence) {
        case 'Negligible': return 'Low';
        case 'Moderate': return 'Low';
        case 'Serious': return 'Low';
        case 'Severe': return 'Medium';
        default: return 'Invalid Consequence';
      }
    } else if (attackPotential === 'High') {
      switch (consequence) {
        case 'Negligible': return 'Low';
        case 'Moderate': return 'Medium';
        case 'Serious': return 'Medium';
        case 'Severe': return 'High';
        default: return 'Invalid Consequence';
      }
    } else if (attackPotential === 'Moderate') {
      switch (consequence) {
        case 'Negligible': return 'Low';
        case 'Moderate': return 'Medium';
        case 'Serious': return 'High';
        case 'Severe': return 'High';
        default: return 'Invalid Consequence';
      }
    } else if (attackPotential === 'Enhanced Basic') {
      switch (consequence) {
        case 'Negligible': return 'Medium';
        case 'Moderate': return 'High';
        case 'Serious': return 'High';
        case 'Severe': return 'Very High';
        default: return 'Invalid Consequence';
      }
    } else if (attackPotential === 'Basic') {
      switch (consequence) {
        case 'Negligible': return 'Medium';
        case 'Moderate': return 'High';
        case 'Serious': return 'Very High';
        case 'Severe': return 'Very High';
        default: return 'Invalid Consequence';
      }
    } else {
      return 'Invalid Attack Potential';
    }
  }








  function getPDFdata() {
    const keys = [
      "assumption",
      "assumption_comment",
      "muc_description",
      "muc_comment",
      "damage_scenario",
      "consequence",
      "consequence_DS",
      "consequence_reasoning",
      "Asset_description",
      "Objective",
      "objective_description",
      "Threat",
      "affected security goal",
      "damage_scenario_copy",
      "security_description_assumption",
      "security_needed_assumption",
      "security_need_bosch",
      "requirement",
      "security_descrption_threat",
      "Threat_T"
    ];

    const arr = []
    if (Array.from(interfaces).length > 0) {
      interfaces.forEach(function (element) {
        arr.push(element)
      })

    }
    if ((Array.from(cloud).length > 0)) {
      cloud.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(database).length > 0)) {
      database.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(device).length > 0)) {
      device.forEach(function (element) {
        arr.push(element)
      })
    }

    console.log("archDatajnedf", archData)
    if ((Array.from(archData) !== null)) {
      if ((Array.from(archData).length > 0)) {
        archData.forEach(function (element) {
          arr.push(element)
        })
      }
    }

    if ((Array.from(application).length > 0)) {
      application.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(automotive).length > 0)) {
      automotive.forEach(function (element) {
        arr.push(element)
      })
    }



    Axios.post(`https://api.si-tara.com/EditDataNew`, { 'asset_list': arr.map(item => item.toLowerCase()) }).then(response => {
      console.log('This is our required data', response.data)

      const data = response.data
      const assum = convertToJSON(data, keys, ["assumption", "assumption_comment"], "id", "Asm-", ["assumption"])
      console.log('assum', assum)
      setassumption(assum)
      setassumption_count(assum.length)

      assumm = assum

      const misuse = convertToJSON(data, keys, ["muc_description", "muc_comment"], "id", "MUC-", ["muc_description"])
      setmisuse(misuse)
      setMisuse_count(misuse.length)

      misuss = misuse

      const damage_scenario = convertToJSON(data, keys, ["damage_scenario", "consequence", "consequence_DS", "consequence_reasoning"], "id", "DS-", ["damage_scenario"])

      setDamageScenario(damage_scenario)
      setDamage_count(damage_scenario.length)

      damscenario = damage_scenario

      const secgoals = convertToJSON(data, keys, ["Asset_description", "Objective", "objective_description"], "id", "A-", ["Asset_description", "Objective"])
      setSecGoals(secgoals)
      setSecGoals_count(secgoals.length)

      secgoalls = secgoals

      const Threats = convertToJSON(data, keys, ["Threat", "affected security goal", "damage_scenario_copy"], "id", "Th-", ["Threat"])

      ThreatScenarioss = Threats



      const combined_damage_Threat = joinArrays3(Threats, damage_scenario, "damage_scenario_copy", "damage_scenario", "Did", "id")

      setThreatDSs(joinArrays3(Threats, damage_scenario, "damage_scenario_copy", "damage_scenario", "Did", "id"))

      const security_ass = convertToJSON(data, keys, ["Threat_T", "security_descrption_threat"], "id", "SN-R-", ["security_descrption_threat", "Threat_T"])


      setSecurityNeeds(joinArrays4(security_ass, Threats, "Threat_T", "Threat", "id", "Threat_id"))
      setThreatEvaluation_AP(convertToJSON(data, keys, ["Threat"], "id", "Th-", ["Threat"]))


      security_needs = security_ass

      setThreatDamageAssociations(InitialtransformToRiskAssessmentFormat(combined_damage_Threat))
      setUpdatedAssociations(InitialtransformToRiskAssessmentFormat(combined_damage_Threat))


      updassoc = InitialtransformToRiskAssessmentFormat(combined_damage_Threat)


      console.log(updassoc, "Updassoc data is as below")


      console.log('initial risk assessment', InitialtransformToRiskAssessmentFormat(combined_damage_Threat))
      console.log(assum, "Assumption Part");
      console.log(misuse, "Misusecases");
      console.log(damage_scenario, "Damage scenarios");
      console.log("Sec Data", secgoals);
      console.log("Threats Data", Threats);
      console.log("Threat Evaluation AP Data", ThreatEvaluation_AP)
      console.log("Sec Data", security_ass);


      console.log("Traceability Data is as below ----->", Tracebility_data)


      // MainTaraPDF(assum,misuse,damage_scenario,secgoals,Threats,ThreatEvaluation_AP,security_ass);
    })

  }

  //var ThreatEvaluation_APG; 


  function findMinimumSumObjects(objects) {
    // Create an object to store the minimum sum object for each unique combination of Name and Security_properties
    const minSumObjects = {};
    var count = 1
    // Iterate through the array of objects
    objects.forEach(obj => {
      const key = obj.security_properties + ' of ' + obj.name;
      const sum = parseInt(obj.access, 10) + parseInt(obj.equipment, 10) + parseInt(obj.expertise, 10) + parseInt(obj.knowledge, 10) + parseInt(obj.time, 10);

      // If the key doesn't exist or the current sum is smaller than the existing sum, update the object
      if (!minSumObjects[key] || sum < minSumObjects[key].sum) {
        minSumObjects[key] = {
          id: 'T' + [count],
          Access: obj.access.toString(),
          Equipment: obj.equipment.toString(),
          Expertise: obj.expertise.toString(),
          Knowledge: obj.knowledge.toString(),
          Time: obj.time.toString(),
          Sum: sum.toString(),
          Threat: obj.threat,

        };
        count++;
      }
    });

    // Convert the object to an array of minimum sum objects
    const minSumObjectsArray = Object.values(minSumObjects);

    const ranges = [
      { min: 0, max: 9, attackPotential: 'Beyond High' },
      { min: 10, max: 13, attackPotential: 'High' },
      { min: 14, max: 19, attackPotential: 'Moderate' },
      { min: 20, max: 24, attackPotential: 'Enhanced Basic' },
      { min: 25, max: Infinity, attackPotential: 'Basic' }
      // Set Infinity as the max for the last range
    ];

    minSumObjectsArray.forEach(obj => {
      let attackPotential = 'Unknown'; // Default value

      // Find the range that matches the sum
      const range = ranges.find(range => obj.Sum >= range.min && obj.Sum <= range.max);

      // If a range is found, set the attack potential accordingly
      if (range) {
        attackPotential = range.attackPotential;
      }

      // Assign the attack potential to the object
      obj['Attack Potential'] = attackPotential;
    });

    return minSumObjectsArray;
  }





  const InitialtransformToRiskAssessmentFormat = (associations) => {
    return associations.flatMap((assoc, index) => {
      // Check if the damage_scenario key exists in the assoc object
      if ('damage_scenario' in assoc) {
        return assoc.Did.map((did, didIndex) => ({
          threatId: assoc.id,
          threat: assoc.Threat,
          damageScenarioId: did,
          damageScenario: assoc.damage_scenario,
          cons: assoc.consequence,
          // Add any additional details you need from the damage scenario
        }));
      } else {
        // If damage_scenario key is not present, return null or any other default value
        return null;
      }
    }).filter(item => item !== null); // Filter out any null values
  };







  useEffect(() => {
    const arr = []
    if (Array.from(interfaces).length > 0) {
      interfaces.forEach(function (element) {
        arr.push(element)
      })

    }
    if ((Array.from(cloud).length > 0)) {
      cloud.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(database).length > 0)) {
      database.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(automotive).length > 0)) {
      automotive.forEach(function (element) {
        arr.push(element)
      })
    }


    // console.log("archDatajnedf", archData)
    if (Array.from(archData) !== null) {
      if ((Array.from(archData).length > 0)) {
        archData.forEach(function (element) {
          arr.push(element)
        })
      }
    }

    if ((Array.from(application).length > 0)) {
      application.forEach(function (element) {
        arr.push(element)
      })
    }
    // if((Array.from(automotive).length > 0)){
    //   automotive.forEach(function(element){
    //     arr.push(element)
    //   })
    // }


    function concatenateArrays(dataObject) {
      let concatenatedArray = [];
      for (let key in dataObject) {
        concatenatedArray = concatenatedArray.concat(dataObject[key]);
      }
      return concatenatedArray;
    }

    console.log("archdata", arr)
    Axios.post(`https://api.si-tara.com/attackTrees`, { 'attacktrees_list': arr.map(item => item.toLowerCase()) }).then(response => {


      console.log(response.data, "The response data for attack trees are as follows")

      if (ThreatDSs.length != 0) {
        setThreatEvaluation_AP(joinArrays2(findMinimumSumObjects(concatenateArrays(response.data)), ThreatDSs, "Threat", "Threat"))
        const ThreatEvaluation_AP = joinArrays2(findMinimumSumObjects(concatenateArrays(response.data)), ThreatDSs, "Threat", "Threat")


        // ThreatEvaluation_APG=ThreatEvaluation_AP;

        console.log(ThreatEvaluation_AP, "The attack vectors are as follows")





        riskass = transformToRiskAssessmentFormat(updassoc, ThreatEvaluation_AP);

        console.log(riskass, "Riskass is as below")


        riskass.forEach(item => {
          console.log(`Damage Scenario: ${item.damage_scenario}, Risk: ${item.risk}`, `Threat: ${item.Threat}`);
        });

        const transformedRiskAss = riskass.map(item => {
          return {
            damageScenario: item.damage_scenario,
            risk: item.risk,
            Threat: item.Threat
          };
        });

        // Now transformedRiskAss contains the transformed array
        // For example, logging the transformed array
        console.log(transformedRiskAss, "This transformedRiskass is as below");






        MainTaraPDF(assumm, misuss, damscenario, secgoalls, ThreatScenarioss, ThreatEvaluation_AP, security_needs, riskass, transformedRiskAss, scopeText, technicalText);




      }
    })

  }, [ThreatDSs])






  useEffect(() => {
    console.log('securityNeeds', SecurityNeeds)
    console.log('riskassessment', RiskAssessment)
    const data = joinArrays1(RiskAssessment, SecurityNeeds, "Threat", "SG_id", "id")
    console.log('tracebility data', data)

    const nodes = [];
    const links = [];
    const uniqueNodeIds = new Set();

    data.forEach(result => {
      // Add Damage Scenario node if not already added
      const damageScenarioNodeId = `${result.D_id}`;
      if (!uniqueNodeIds.has(damageScenarioNodeId)) {
        nodes.push({
          id: damageScenarioNodeId,
          name: result.damage_scenario,
          type: 'Damage Scenario'
        });
        uniqueNodeIds.add(damageScenarioNodeId);
      }

      // Add Risk node if not already added
      const riskNodeId = `${result.damage_scenario}`;
      if (!uniqueNodeIds.has(riskNodeId)) {
        nodes.push({
          id: riskNodeId,
          name: `${result.damage_scenario} - ${result.Threat}`,
          type: 'Risk'
        });
        uniqueNodeIds.add(riskNodeId);
      }

      // Add Threat node if not already added
      const threatNodeId = `${result.Threat_id}`;
      if (!uniqueNodeIds.has(threatNodeId)) {
        nodes.push({
          id: threatNodeId,
          name: result.Threat,
          type: 'Threat'
        });
        uniqueNodeIds.add(threatNodeId);
      }

      // Add Security Goals node if not already added
      const sec_goal_id = `${result.R_id}`;
      if (!uniqueNodeIds.has(sec_goal_id)) {
        nodes.push({
          id: sec_goal_id,
          name: result.security_descrption_threat,
          type: 'Security Goals'
        });
        uniqueNodeIds.add(sec_goal_id);
      }

      // Add link between Damage Scenario and Risk
      links.push({
        source: damageScenarioNodeId,
        target: riskNodeId
      });

      // Add link between Risk and Threat
      links.push({
        source: riskNodeId,
        target: threatNodeId
      });

      // Add link between Threat and Security Goals
      links.push({
        source: threatNodeId,
        target: sec_goal_id
      });
    });

    setTracebility_data({ nodes: nodes, links: links })

  }, [RiskAssessment, SecurityNeeds]);







  function joinArrays1(array1, array2, key, key1, key2) {
    let newArray = [];

    array1.forEach(obj1 => {
      const obj2 = array2.find(obj2 => obj2[key1].toLowerCase().trim() === obj1[key].toLowerCase().trim());
      if (obj2) {
        let newObj = { ...obj1 }; // Create a copy of obj1

        // Append all keys from obj2 to newObj
        Object.keys(obj2).forEach(obj2Key => {
          if (obj2Key === key2) {
            newObj['R_id'] = obj2[obj2Key];
          } else {
            newObj[obj2Key] = obj2[obj2Key];
          }
        });

        newArray.push(newObj); // Push the modified object into the new array
      } else {
        newArray.push({ ...obj1 }); // If no match found, push a copy of obj1 into the new array
      }
    });

    return newArray;
  }

  function joinArrays2(array1, array2, key1, key2) {
    return array1.map(obj1 => {
      const obj2 = array2.find(obj2 => obj2[key2].toLowerCase().trim().replace(/\s+/g, ' ') === obj1[key1].toLowerCase().trim().replace(/\s+/g, ' '));
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if (obj2Key == 'id') {
            obj1['id'] = obj2[obj2Key]
          } else if (obj2Key == 'Threat') {
            obj1['Threat_i'] = obj2[obj2Key];
          }
        });
      } else {

      }
      return { ...obj1 };
    });
  }

  function joinArrays3(array1, array2, key11, key22, key1, key2) {
    return array1.map(obj1 => {
      const obj2 = array2.find(obj2 => obj2[key22].toLowerCase().trim() === obj1[key11].toLowerCase().trim());
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if (obj2Key == key2) {
            obj1['Did'] = [obj2[obj2Key]]
          } else {
            obj1[obj2Key] = obj2[obj2Key];
          }
        });
      }
      return { ...obj1 };
    });
  }



  function joinArrays4(array1, array2, key1, key2, key3, key4) {
    return array1.map(obj1 => {
      const obj2 = array2.find(obj2 => obj2[key2].toLowerCase().trim() === obj1[key1].toLowerCase().trim());
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if (obj2Key == key3) {
            obj1[key4] = obj2[obj2Key]
          } else {
            obj1[obj2Key] = obj2[obj2Key];
          }
        });
      }
      return { ...obj1 };
    });
  }



  // function collectAllData(assum,misuse,damage_scenario,Threats,security_ass) {

  //   // Collect and filter data from all your DataGrids
  //   console.log(misuse,"ASSSSS DATA")
  //   const allData = {
  //     Assumptions: assum,
  //     MisuseCases: misuse,
  //     DamageScenarios:damage_scenario,
  //   //  SecurityGoals:SecGoals,
  //     ThreatScenarios:Threats,
  //   //  ThreatEvaluation: ThreatEvaluation_AP,
  //     SecurityNeeds:security_ass,
  //   //  RiskAssessment: RiskAssessment,
  //     // ...continue for each data category
  //   };
  //   console.log('collect assumption',assumption)

  //   return allData;
  // }


  function collectAllData(assum, misuse, damage_scenario, secgoals, Threats, ThreatEvaluation_AP, security_ass, riskass, transformedRiskAss) {
    // Define the properties you want to keep for each data category
    const assumptionFields = ['id', 'assumption', 'assumption_comment']; // Add more fields as needed
    const misuseFields = ['id', 'muc_description', 'muc_comment']; // Add more fields as needed
    const damageScenarioFields = ['id', 'damage_scenario', 'consequence', 'consequence_DS', 'consequence_reasoning'];
    const secgoalsFields = ['id', 'Asset_description', 'Objective', 'objective_description'];
    const threatDSsFields = ['id', 'Threat', 'affected security goal', 'Did'];
    const threatevaluationFields = ['id', 'Threat', 'Time', 'Expertise', 'Knowledge', 'Access', 'Equipment', 'Sum', 'Attack Potential'];
    const secneedsFields = ['id', 'security_descrption_threat', 'Threat', 'Threat_id'];
    const riskassessmentFields = ['id', 'damage_scenario', 'risk', 'consequence', 'Threat', 'attackPotential', 'risk_of_d']

    const transformedriskassFields = ['damageScenario', 'risk', 'Threat']
    // ...define fields for other data categories similarly

    // Collect and filter data from all your DataGrids
    const allData = {

      Assumptions: assum.map(assump => filterProperties(assump, assumptionFields)),
      MisuseCases: misuse.map(mis => filterProperties(mis, misuseFields)),
      DamageScenarios: damage_scenario.map(damage => filterProperties(damage, damageScenarioFields)),
      SecurityGoals: secgoals.map(secgoalss => filterProperties(secgoalss, secgoalsFields)),
      ThreatScenarios: Threats.map(threatdss => filterProperties(threatdss, threatDSsFields)),
      ThreatEvaluation: ThreatEvaluation_AP.map(te => filterProperties(te, threatevaluationFields)),
      SecurityNeeds: security_ass.map(sec => filterProperties(sec, secneedsFields)),
      RiskAssessment: riskass.map(ra => filterProperties(ra, riskassessmentFields)),
      ManagementSummary: transformedRiskAss.map(tR => filterProperties(tR, transformedriskassFields))
      // ...continue for each data category
    };
    //console.log('collect assumption',assump)

    return allData;
  }

  // Helper function to filter object properties by keys
  function filterProperties(item, fields) {
    let filteredItem = {};
    fields.forEach(field => {
      if (item.hasOwnProperty(field)) {
        filteredItem[field] = item[field];
      }
    });
    return filteredItem;
  }



  const convertToJSON = (dataArray, keysArray, filterKeys, idKey, obj, specifiedKeys) => {
    let sequentialIndex = 1; // Initialize sequential index
    const encounteredValues = new Set(); // Initialize a set to track encountered values
    return dataArray.reduce((result, innerArray) => {
      let combinedKeyValues = "";
      specifiedKeys.forEach(specifiedKey => {
        const value = innerArray[keysArray.indexOf(specifiedKey)];
        combinedKeyValues += value + "|";
      });

      const specifiedKeyValue = innerArray[keysArray.indexOf(specifiedKeys[0])]; // Get value for first specified key
      if (specifiedKeyValue !== "" && specifiedKeyValue !== null && !encounteredValues.has(combinedKeyValues.toLowerCase().trim())) {
        const jsonObject = {};
        filterKeys.forEach(filterKey => {
          const value = innerArray[keysArray.indexOf(filterKey)];
          if (value) {
            jsonObject[filterKey] = value;
          }
        });
        jsonObject[idKey] = obj + sequentialIndex.toString(); // Assign sequential index
        encounteredValues.add(combinedKeyValues.toLowerCase().trim()); // Add the combined key values to the set
        sequentialIndex++; // Increment the sequential index
        result.push(jsonObject);
      }
      return result;
    }, []);
  };





  const convertToJSON1 = (dataArray, keysArray, filterKeys, idKey, obj, specifiedKeys) => {
    let sequentialIndex = 1; // Initialize sequential index
    let sequentialIndex1 = 1;
    const encounteredValues = new Map(); // Initialize a map to track encountered values and their IDs

    return dataArray.reduce((result, innerArray) => {
      let combinedKeyValues = "";
      specifiedKeys.forEach(specifiedKey => {
        const value = innerArray[keysArray.indexOf(specifiedKey)];
        combinedKeyValues += value + "|";
      });

      const specifiedKeyValue = innerArray[keysArray.indexOf(specifiedKeys[0])]; // Get value for first specified key
      if (specifiedKeyValue !== "" && specifiedKeyValue !== null && !encounteredValues.has(combinedKeyValues.toLowerCase().trim())) {
        const jsonObject = {};
        filterKeys.forEach(filterKey => {
          const value = innerArray[keysArray.indexOf(filterKey)];
          if (value) {
            jsonObject[filterKey] = value;
          }
        });

        // Generate asset_id based on asset_description
        const assetDescription = jsonObject["Asset_description"];
        if (assetDescription && !encounteredValues.has(assetDescription.toLowerCase())) {
          const assetId = `A-${sequentialIndex1}`;
          jsonObject["asset_id"] = assetId;
          encounteredValues.set(assetDescription.toLowerCase(), assetId);
          sequentialIndex1++;
        } else if (assetDescription) {
          jsonObject["asset_id"] = encounteredValues.get(assetDescription.toLowerCase());
        }

        jsonObject[idKey] = obj + sequentialIndex.toString(); // Assign sequential index
        encounteredValues.set(combinedKeyValues.toLowerCase().trim(), true); // Add the combined key values to the set
        sequentialIndex++; // Increment the sequential index
        result.push(jsonObject);
      }
      return result;
    }, []);
  };









  function MainTaraPDF(assum, misuse, damage_scenario, secgoals, Threats, ThreatEvaluation_AP, security_ass, riskass, transformedRiskAss, scopeText, technicalText) {
    //setIsGeneratingPdf(true);
    //setPdfGenerationProgress(0);
    //setMessage("Preparing Export...");

    console.log("Entered MainTaraPDF")
    const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });

    const current_date = new Date().toLocaleString();
    const imageHeight = pdf.internal.pageSize.getHeight() / 2;


    new Promise(resolve => setTimeout(resolve, 500));


    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // // Add image and project details on the first page
    // const img = new Image();
    // img.onload = async function () {
    //     pdf.addImage(
    //         this,
    //         "PNG",
    //         0, // X coordinate
    //         0, // Y coordinate
    //         pdf.internal.pageSize.getWidth(), // Image width
    //         imageHeight // Image height
    //     );

    //     // Add project details
    //     pdf.setFont("helvetica", "bold");
    //     pdf.setFontSize(18);
    //     pdf.text(pdf.internal.pageSize.getWidth() / 2, imageHeight + 10, projectName, { align: 'center' });
    //     pdf.setFontSize(12);
    //     pdf.text(pdf.internal.pageSize.getWidth() / 2, imageHeight + 20, "Threat and Risk Analysis", { align: 'center' });
    //     pdf.text(20, imageHeight + 85, `Manager: ${managerName}`); // Manager name
    //     // Add date
    //     pdf.text(
    //         pdf.internal.pageSize.getWidth() - 100,
    //         pdf.internal.pageSize.getHeight() - 20,
    //         current_date
    //     );

    //     // Add scope and technical description on the second page
    //     pdf.addPage();

    let startY = 10; // Starting Y position for the text on the new page

    // Adding Scope heading and text
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(20, startY, "Scope:");
    startY += 10; // Space between heading and text
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(20, startY, scopeText, { maxWidth: pdf.internal.pageSize.getWidth() - 40 });

    // Adjust startY based on the length of scopeText for the Technical Description section
    startY += 20 + (scopeText.split('\n').length + scopeText.length / 50) * 10; // This is an approximation

    // Adding Technical Description heading and text
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(20, startY, "Technical Description:");
    startY += 10; // Space between heading and text
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(20, startY, technicalText, { maxWidth: pdf.internal.pageSize.getWidth() - 40 });

    // Continue with additional pages or data as necessary
    //  };
    //   img.src = image_path;
    delay(500);
    pdf.addPage()








    const allData = collectAllData(assum, misuse, damage_scenario, secgoals, Threats, ThreatEvaluation_AP, security_ass, riskass, transformedRiskAss);

    console.log(allData, "All DATA IS AS BELOW")

    //const totalPages = Object.keys(allData).length; // Assuming 'assets' are the pages you're adding
    let completedPages = 0;

    // const updateProgress = () => {
    //   completedPages++;
    //   const progress = Math.ceil((completedPages / totalPages) * 100);
    //   setPdfGenerationProgress(progress);
    // };








    // Processing the allData sections
    for (const [sectionName, data] of Object.entries(allData)) {
      if (data.length > 0) {
        if (completedPages > 0) pdf.addPage();

        const headers = Object.keys(data[0]);
        const rows = data.map((row) => headers.map((fieldName) => row[fieldName] || ''));
        pdf.text(sectionName, 10, 10);
        autoTable(pdf, { head: [headers], body: rows, startY: 20 });

        completedPages++;
        // updateProgress();
        // await delay(200); // Introduce a delay between each section
      }
    }


    //  const response = await fetch('http://localhost:5003/getPDF');
    //  const blob = await response.blob();

    //  // Convert the fetched blob into a PDF
    //  const reader = new FileReader();
    //  reader.readAsDataURL(blob);
    //  reader.onloadend = () => {
    //      const pdfData = reader.result;
    //      const pdfBytes = atob(pdfData.split(',')[1]);
    //      const pdfDataArray = new Uint8Array(pdfBytes.length);

    //      for (let i = 0; i < pdfBytes.length; i++) {
    //          pdfDataArray[i] = pdfBytes.charCodeAt(i);
    //      }

    //      // Load the fetched PDF
    //      const externalPdf = new jsPDF();

    //      await new Promise((resolve, reject) => {
    //       externalPdf.loadFile(blob, { onComplete: resolve, onError: reject });
    //   });
    //      //externalPdf.loadDocument(pdfDataArray);

    //      // Merge the fetched PDF with the current PDF
    //      pdf.addPage();
    //      pdf.appendPages(externalPdf);






    // pdf.save('Si-TaRA_AP.pdf');

    // console.log(pdf.path('Si-TaRA_AP.pdf'))
    const pdftemp = pdf.output();


    const pdfBlob = new Blob([pdftemp], { type: 'application/pdf' });

    // Create FormData object to send PDF file
    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'example.pdf');
    formData.append('sessionId', localStorage.getItem("sessionId"));
    Axios.post('https://api.si-tara.com/upload', formData, {

      // "sessionID": user_session,

      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      }
    });


    // <div>
    // <iframe src={`http://13.126.50.154:5000/get-pdf/TARA@6zuz28ccr668ei2hog5e`}

    //     title="PDF Viewer"width="100%"height="500px"

    //   />

    // </div>
    // console.log(response.data, "This is pdf response")

    //  await fetchAndDownloadExternalPDF();

  }





  // fetch('http://localhost:5003/getPDF')
  //               .then(response => response.blob())
  //               .then(blob => {
  //                   // Convert the fetched blob into a PDF
  //                   const externalPdf = new jsPDF();
  //                   externalPdf.loadFile(blob, { onComplete: () => {
  //                       // Merge the fetched PDF with the current PDF
  //                       pdf.addPage();
  //                       pdf.appendPages(externalPdf);

  //                       // Save the final merged PDF
  //                       pdf.save('Si-TaRA_AP.pdf');
  //                   }});
  //               })
  //               .catch(error => {
  //                   console.error('Error fetching PDF:', error);
  //               });




  //setMessage("Download Complete!");
  //setPdfGenerationProgress(100);
  //setIsGeneratingPdf(false);
  //}










  //###########################################PDF End#######################################



  const matches = useMediaQuery('(min-width:800px)');






  const handleprojectchange = (event) => {
    if (event.target.value.length > 0) {
      setprojectNameGenerate(true)
      if (/[.#?*/=!@$%^&()<>+-]/.test(event.target.value)) {
        console.log("error")
        setProjError('Input cannot contain special characters: . - / # ? *');
      } else {
        setProjError('')
      }
    } else {
      setprojectNameGenerate(false)
    }
    setprojectName(event.target.value)
  }

  const handleManagerChange = (event) => {
    if (event.target.value.length > 0) {
      setManagerNameGenerate(true)
      if (/[.#?*/=!@$%^&()<>+-]/.test(event.target.value)) {
        console.log("error")
        setMangError('Input cannot contain special characters: . - / # ? *');
      } else {
        setMangError('')
      }
    } else {
      setManagerNameGenerate(false)
    }
    setManagerName(event.target.value)
  }

  const handleDepartmentChange = (event) => {
    if (event.target.value.length > 0) {
      setDepartmentNameGenerate(true)
      if (/[.#?*/=!@$%^&()<>+-]/.test(event.target.value)) {
        console.log("error")
        setDeptError('Input cannot contain special characters: . - / # ? *');
      } else {
        setDeptError('')
      }
    } else {
      setDepartmentNameGenerate(false)
    }
    setDepartmentName(event.target.value)
  }

  const handleCloudChange = (event) => {
    setCloudOption(event.target.value);
  };

  const handleDatabaseChange = (event) => {
    setDatabaseOption(event.target.value)
  };

  const handleApplicationChange = (event) => {
    setApplicationOption(event.target.value)
  };

  const handleAutomotiveChange = (event) => {
    setAutomotiveOption(event.target.value)
  };

  const handleAPVulnChange = () => {
    // const newCheckedState = !isChecked;
    setNewCheckedState(!isAPChecked)
    setIsAPChecked(!isAPChecked);
    localStorage.setItem("vulnStat", !isAPChecked)
    // console.log(newCheckedState)
  };

  const handleLEVulnChange = () => {
    // const newCheckedState = !isChecked;
    setNewCheckedState(!isLEChecked)
    setIsLEChecked(!isLEChecked);
    localStorage.setItem("vulnStat", !isLEChecked)
    // console.log(newCheckedState)
  };

  const handleScopeChange = (event) => {
    if (event.target.value.length > 0) {
      setScopeTextGenerate(true)
      if (/[.#?*/=!@$%^&()<>+-]/.test(event.target.value)) {
        console.log("error")
        setScopeError('Input cannot contain special characters: . - / # ? *');
      } else {
        setScopeError('')
      }
    } else {
      setScopeTextGenerate(false)
    }
    setScopeText(event.target.value)
  }

  const handleTechnicalChange = (event) => {
    if (event.target.value.length > 0) {
      setTechnicalTextGenerate(true)
      if (/[.#?*/=!@$%^&()<>+-]/.test(event.target.value)) {
        console.log("error")
        setTechError('Input cannot contain special characters: . - / # ? *');
      } else {
        setTechError('')
      }
    } else {
      setTechnicalTextGenerate(false)
    }
    setTechnicalText(event.target.value)
  }

  const [LECheckboxes, setLECheckboxes] = React.useState({
    'LE .xlsm': false,
    'LE .PDF': false,
    'LE SCD': false,
    'LE VD': false,
    'LE TR': false,
  });

  const handleLECheckboxChange = (checkboxName) => {
    setLECheckboxes({
      ...LECheckboxes,
      [checkboxName]: !LECheckboxes[checkboxName],
    });
  };

  const [APCheckboxes, setAPCheckboxes] = React.useState({
    'AP .xlsm': false,
    'AP .PDF': false,
    'AP SCD': false,
    'AP AT': false,
    'AP VD': false,
    'AP TR': false,
  });

  const handleAPCheckboxChange = (checkboxName) => {
    setAPCheckboxes({
      ...APCheckboxes,
      [checkboxName]: !APCheckboxes[checkboxName],
    });
  };

  const handleAPMethodology = (event) => {
    isAPMethod(!apMethod)
    isLEMethod1(!leMethod1)
    setGenerate(false)
    if (event) {
      const spanValue = event.target.innerText;
      setSelectedMethodology(spanValue)
    }
  }

  const handleLEMethodology = (event) => {
    isLEMethod(!leMethod)
    isAPMethod1(!apMethod1)
    setGenerate(false)
    if (event) {
      const spanValue = event.target.innerText;
      setSelectedMethodology(spanValue)
    }
  }

  let navigate = useNavigate();

  React.useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (jwtToken === null || jwtToken === undefined || jwtToken === "") {
      navigate("/");
    }
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
        }
      } else {
        // 400 - invalid token || 401 - user not found
        console.log("got 400 or 401")
        navigate("/")
      }
    }).catch((err) => {
      navigate("/")
    })
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Axios.get("https://api.si-tara.com/getUserData", { headers: { 'Access-Control-Allow-Origin': '*', 'x-access-token': localStorage.getItem("token") } }).then((response) => {
  //   if (response.data.passwordChange === false) { navigate('/passwordChange'); }
  // })



  // })

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId')
    navigate("/");
  }

  const cyberSecurityFacts = [
    "The first computer virus was created in 1983 and was called the 'Elk Cloner'.",
    "Cybercrime is projected to cost the world over $10 trillion annually by 2025.",
    "95% of cybersecurity breaches are due to human error.",
    "The most expensive computer virus of all time, MyDoom, caused an estimated financial damage of $38.5 billion.",
    "The most common password is 'password.' It's so secure that even the owner can't remember it's that simple.",
    "There are two types of people: those who have already been hacked and those who are about to be. And both think 'It won't happen to me.'",
    "Hackers wear hoodies not because they're cold, but because the hood acts as an antenna for better Wi-Fi reception.",
    "If you ever feel useless, remember, there are people out there installing antivirus software on their already infected computers.",
    "Cybersecurity experts often say, 'Don't click on suspicious links!' But let's be honest, that's how half of us found our favorite websites.",
    "A computer lets you make more mistakes faster than any other invention in human history, with the possible exceptions of handguns and tequila.",
    "'I've updated my privacy policy' is the internet's version of 'Thoughts and prayers.'",
    "Why did the computer go to therapy? Because it had too many insecure connections.",
    "Phishing emails are like the lottery. You know it's probably a scam, but you still hope for that one time it's not.",
    "Remember, behind every successful hacker is a surprised system admin wondering, 'I thought I updated that software.'",
    // Add as many facts as you like
  ];

  const FunFactPopup = ({ fact }) => {
    // Style this component as needed, maybe as a modal or an unobtrusive popup at the bottom
    return (
      <div style={{ position: "relative", left: 0, right: 0, backgroundColor: "#f0f0f0", padding: "10px", textAlign: "center", fontWeight: 'bold' }}>
        {fact}
      </div>
    );
  };

  useEffect(() => {
    const updateFact = () => {
      // Get a random fact from the array
      const fact = cyberSecurityFacts[Math.floor(Math.random() * cyberSecurityFacts.length)];
      setCurrentFact(fact);
    };

    updateFact(); // Initial fact
    const intervalId = setInterval(updateFact, 10000); // Update the fact every 20 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // Example usage in a useEffect hook:
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkTokenExpiration(token);

      const interval = setInterval(() => {
        checkTokenExpiration(token)
      }, 20000);

      return () => {
        clearInterval(interval)
      }
    }
  }, []);

  // useEffect(() => {

  // })


  const checkTokenExpiration = (token) => {
    try {
      const { exp } = jwtDecode(token)
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (exp < currentTime) {
        // Token has expired, log the user out
        handleLogout();
      }
    } catch (error) {
      // console.error('Error decoding or checking token:', error);
    }
  };


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  }

  const handleClearSearch = () => {
    setSearchQuery(""); // Assuming setSearchQuery is the state setter function for the search query
  }

  const handleFinish = () => {
    setActiveStep(5)
  }

  const handleEditData = () => {
    setActiveStep(6)
  }

  const handleClickChip = (step, chipToAppend) => () => {
    step === "interfaces"
      ? setInterfaces((ifr) => new Set([...ifr, chipToAppend]))
      : step === "cloud"
        ? setCloud((cld) => new Set([...cld, chipToAppend]))
        : step === "processedText"
          ? setArchData((pct) => new Set([...pct, chipToAppend]))
          : step === "database"
            ? setDatabase((dbs) => new Set([...dbs, chipToAppend]))
            : step === "application"
              ? setApplication((appl) => new Set([...appl, chipToAppend]))
              : step === "automotive"
                ? setAutomotive((auto) => new Set([...auto, chipToAppend]))
                : setDevice((dev) => new Set([...dev, chipToAppend]));
  };

  const handleDeleteChip = (step, chipToDelete) => () => {
    step === "interfaces"
      ? setInterfaces((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete))
      : step === "cloud"
        ? setCloud((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete))
        : step === "processedText"
          ? setArchData((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete))
          : step === "database"
            ? setDatabase((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete))
            : step === "application"
              ? setApplication((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete))
              : step === "automotive"
                ? setAutomotive((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete))
                : setDevice((chips) => Array.from(chips).filter((chip) => chip !== chipToDelete));
  };

  function sendDataDB() {
    // alert(selectedValues)

    // localStorage.setItem("sessionId", localStorage.getItem('sessionId'))
    localStorage.setItem("methodology", selectedMethodology)
    localStorage.setItem("docType", (Object.keys(LECheckboxes).filter((checkbox) => LECheckboxes[checkbox]).length > 0 ? Object.keys(LECheckboxes).filter((checkbox) => LECheckboxes[checkbox]) : Object.keys(APCheckboxes).filter((checkbox) => APCheckboxes[checkbox])))
    localStorage.setItem("vulnStat", (!isAPChecked === true) ? false : true)
    localStorage.setItem("LEvulnStat", (!isLEChecked === true) ? false : true)
    console.log(localStorage.getItem("sessionId"))
    Axios.post("https://api.si-tara.com/addData", {
      "interfaces": (Array.from(interfaces).length > 0) ? Array.from(interfaces) : "",
      "cloud": (Array.from(cloud).length > 0) ? Array.from(cloud) : "",
      "DBAssets": (Array.from(database).length > 0) ? Array.from(database) : "",
      "device": (Array.from(device).length > 0) ? Array.from(device) : "",
      "application": (Array.from(application).length > 0) ? Array.from(application) : "",
      "automotive": (Array.from(automotive).length > 0) ? Array.from(automotive) : "",
      "astArch": (archData !== null && Array.from(archData).length > 0) ? Array.from(archData) : "",
      "sessionId": localStorage.getItem("sessionId"),
      // "email": "dummy",
      "methodologies": selectedMethodology,
      "filePath": filePath,
      "ProjectName": projectName,
      "docType": (Object.keys(LECheckboxes).filter((checkbox) => LECheckboxes[checkbox]).length > 0 ? Object.keys(LECheckboxes).filter((checkbox) => LECheckboxes[checkbox]) : Object.keys(APCheckboxes).filter((checkbox) => APCheckboxes[checkbox])),
      "managerName": managerName,
      "dateTime": currentDateTime.toLocaleString(),
      "deptName": departmentName,
      "vulnDoc": newCheckedState,
      "scope": scopeText,
      'techDesc': technicalText
    }, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'x-access-token': localStorage.getItem("token") } })
  }


  useEffect(() => {
    function GetAssets() {
      Axios.get("https://api.si-tara.com/getAssets")
        .then(res => {
          setAwsAsset(res.data.cloud.AWS);
          setAzureAsset(res.data.cloud.AZURE)
          setGcpAsset(res.data.cloud.GCP)
          setInterfaceAsset(res.data.interfaces)
          setreldatasset(res.data.database.Relational)
          setnreldatasset(res.data.database.NonRelational)
          setmemdatasset(res.data.database.InMemory)
          setwebapplication(res.data.application.Web)
          setmobileapplication(res.data.application.Mobile)
          setserverapplication(res.data.application.Server)
          setAutomotiveAsset(res.data.automotive)
        })
    }
    GetAssets()
  }, [])

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const sendEditData = () => {
    const arr = []
    if (Array.from(interfaces).length > 0) {
      interfaces.forEach(function (element) {
        arr.push(element)
      })

    }
    if ((Array.from(cloud).length > 0)) {
      cloud.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(database).length > 0)) {
      database.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(device).length > 0)) {
      device.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(application).length > 0)) {
      application.forEach(function (element) {
        arr.push(element)
      })
    }
    if ((Array.from(automotive).length > 0)) {
      automotive.forEach(function (element) {
        arr.push(element)
      })
    }

    if ((Array.from(processedText).length > 0)) {
      processedText.forEach(function (element) {
        arr.push(element)
      })
    }

    if (archData !== null) {
      if ((Array.from(archData).length > 0)) {
        archData.forEach(function (element) {
          arr.push(element)
        })
      }
    }

    // console.log(archData.data.length>0)
    // console.log(arr)

    // const updateDataTosend = (arr, projectName, managerName) => {
    // setDataTosend({
    //   data: arr,
    //   projectname: projectName,
    //   managername: managerName
    // });
    // };

    const dataTosend = {
      data: arr,
      projectname: projectName,
      managername: managerName
    }
    navigate('/EditData', { state: { data: dataTosend } })

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // setActiveStep(6)
  }


  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const fileType = file.type;
    if (fileType === 'image/png') {
      // If a PNG file is selected, display it in the image tag
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileSrc(e.target.result);
        setFile('image')
      };
      reader.readAsDataURL(file);
    }
    else if (fileType === 'application/pdf') {
      setFileSrc(URL.createObjectURL(file));
      setFile('pdf')
    } else {
      // If any other file type is selected, clear the file source and type
      setFileSrc(null);
      setFile(null);
      setShowPopup(false);
      alert('Please select a PNG or PDF file.');
    }
    handleUpload(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileType = file.type;
    if (fileType === 'image/png') {
      // If a PNG file is selected, display it in the image tag
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileSrc(URL.createObjectURL(file));
        setFile('image')
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf') {
      setFile('pdf')
      setFileSrc(URL.createObjectURL(file));
    } else {
      // If any other file type is selected, clear the file source and type
      setFileSrc(null);
      setFile(null);
      setShowPopup(false);
      alert('Please select a PNG or PDF file.');
    }
    handleUpload(file);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleZoomIn = () => {
    setZoomFactor(prevZoomFactor => prevZoomFactor * 1.2);
  };

  const handleZoomOut = () => {
    setZoomFactor(prevZoomFactor => prevZoomFactor / 1.2);
  };

  const toggleClosePopup = () => {
    setPopupOpen(false);
  };

  const toggleOpenPopup = () => {
    setPopupOpen(true)
  }

  const handleUpload = async (file) => {
    if (!file) {
      setUploadStatus('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProcessingText(true); // Set processing text to true when upload starts

      const response = await Axios.post('https://api.si-tara.com/uploadArch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response data:', response.data);

      if (response.data.assets && Array.isArray(response.data.assets)) {
        setProcessedText(response.data.assets);
        setUnavailableText(response.data.all_text_found)
        setPopupOpen(true);
      } else {
        console.error('Invalid response data structure:', response.data);
        setUploadStatus('Error: Invalid response data structure.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error in uploading file. Please try again.');
    } finally {
      setUploadCompleted(true); // Mark upload as completed
      setProcessingText(false); // Set processing text to false when upload 
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };




  const interfaceFilteredLabels = interfaceasset.filter(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
  const awsFilteredLabels = awsAsset.filter(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
  const azureFilteredLabels = azureAsset.filter(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
  const gcpFilteredLabels = gcpAsset.filter(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
  const automotiveFilteredLabels = automotiveAsset.filter(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
  const automotiveTCMFilteredLabels = automotiveTCMAsset.filter(label => label.toLowerCase().includes(searchQuery.toLowerCase()));

  return isGenerated === "yes" ? (
    <>
      {localStorage.getItem("status") === "1" ? <Header /> : <DisabledHeader />}
      <div>
        <img
          src={svgLogo}
          alt="team"
          height={matches ? "330" : "120"}
          style={{ margin: "20px" }}
        />
      </div>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <React.Fragment>
          <Stack direction="column" alignItems="center" justifyContent="center">
            <>
              <Typography variant="h5" style={{ fontWeight: "bold", margin: "20px" }}>
                <center>Please wait while your SEP documents are being generated, you can download here.</center>
                <PDFViewer3 />
              </Typography>
            </>

          </Stack>
          {localStorage.getItem("status") === "1" ? "" : <FunFactPopup fact={currentFact} />}
          {/* <div style={{ position: "relative", fontWeight: "bold", width:  }}> */}

          {/* <FunFactPopup fact={currentFact} /> */}
          {/* </div> */}
        </React.Fragment>
      </Stack>
    </>
  ) : (
    <>
      <Header />
      <div>
        <img
          src={svgLogo}
          alt="team"
          height={matches ? "330" : "120"}
          style={{ margin: "20px" }}
        />
      </div>
      <Grid container xs={12}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1, marginBottom: 40 }}>
            <Stepper
              activeStep={activeStep}
              nonLinear
              alternativeLabel
              connector={<ColorlibConnector />}
              sx={{ marginBottom: 5 }}
            >
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton onClick={handleStep(index)}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>
                      {label}
                    </StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <>{activeStep === 0 ? (
              <React.Fragment>
                {/* <GetAssets /> */}
                <Stack direction="column" alignItems="center" justifyContent="center">
                  <Stack direction="column" alignItems="center">
                    <Typography variant="h5" style={{ fontWeight: "bold", fontFamily: 'BoschSans' }}>
                      Select Interfaces and Protocols
                    </Typography>
                    {/* <div className="container">
                      <center>

                        <div className="upload-section" onDrop={handleDrop} onDragOver={handleDragOver}>
                          <Stack direction="row" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                            <p>Drag and drop file here, or</p>
                            <div class="a-file-upload-input" style={{ marginLeft: "10px" }}>
                              <center>
                                <label for="file-upload-input-1">
                                  <i class="a-icon boschicon-bosch-ic-upload" title="upload icon"></i>
                                  Upload File
                                </label>
                                <input id="file-upload-input-1" name="file upload input" type="file" onChange={handleFileChange} accept="application/pdf,image/png,image/jpeg" />
                              </center>
                            </div>
                          </Stack>
                          {uploadCompleted && (<Button onClick={toggleOpenPopup}>Show Assets from Architecture</Button>)}


                        </div>
                      </center>
                      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
                      {processingText && (
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                          <p>Processing text...</p>
                          {fileSrc && (
                            <button onClick={handleOpenPopup}>Click to Open</button>
                          )}
                          {showPopup && fileSrc && (
                            <div className="popup-overlay">
                              <div className="popup-content">
                                <span className="close" onClick={handleClosePopup}>&times;</span>
                                {file === 'image' && (
                                  <img
                                    src={fileSrc}
                                    alt="Selected PNG file"
                                    style={{ transform: `scale(${zoomFactor})` }}
                                    height="50%"
                                    width="50%"
                                  />
                                )}
                                {file === 'pdf' && (
                                  <iframe src={fileSrc} style={{ width: '80vh', height: '80vh' }}></iframe>
                                )}
                                {file === 'image' && <div className="zoom-buttons">
                                  <button onClick={handleZoomIn}>Zoom In</button>
                                  <button onClick={handleZoomOut}>Zoom Out</button>
                                </div>}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {(uploadCompleted && isPopupOpen) && (
                        <div>
                          <div class="a-box -floating-shadow-s" style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, backgroundColor: rgb(0, 0, 0, 0.5), zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="popup-content" style={{ alignItems: 'center' }}>
                              <span className="close" onClick={toggleClosePopup}>&times;</span>
                              <Stack direction="row">
                                <div style={{ marginRight: '20px' }}>
                                  <h4>Assets available from Architecture</h4>
                                  {Array.from(processedText).map((text, index) => (
                                    <>
                                      <p key={index}>{text}</p>
                                    </>
                                  ))}
                                </div>
                                <hr class="a-divider a-divider--vertical" />
                                <div style={{ marginRight: '20px' }}>
                                  <h4>Assets not available </h4>
                                  {Array.from(unavailableText).map((text, index) => (
                                    <>
                                      <p key={index}>{text}</p>
                                    </>
                                  ))}
                                </div>
                              </Stack>
                            </div>
                          </div>
                        </div>
                      )}
                    </div> */}

                  </Stack>
                  <>

                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      style={{ margin: "20px 0px", justifyContent: 'center', alignItems: 'center' }}
                    >
                      {/* {Array.from(searchQuery.length > 0 ? interfaceFilteredLabels : interfaceasset).map((chip) => (
                        !Array.from(interfaces).includes(chip) ?
                          <div
                            tabIndex="0"
                            class="a-chip"
                            role="button"

                            aria-labelledby="chip-label-id-default"
                            style={{ backgroundColor: Array.from(interfaces).includes(chip) ? "#007BC0" : "", color: Array.from(interfaces).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={handleClickChip("interfaces", chip)}
                            onDelete={
                              Array.from(interfaces).includes(chip)
                                ? handleDeleteChip("interfaces", chip)
                                : ""
                            }
                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              class="a-chip__label"
                              style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                            >{chip}</span>
                          </div> : <div
                            tabindex="0"
                            class="a-chip -selected"
                            role="button"
                            aria-labelledby="chip-label-id-selected"
                            style={{ backgroundColor: Array.from(interfaces).includes(chip) ? "#007BC0" : "default", color: Array.from(interfaces).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={(Array.from(interfaces).includes(chip)
                              ? handleDeleteChip("interfaces", chip)
                              : "")}

                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-selected"
                              class="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div>

                      ))} */}
                      {Array.from(interfaceasset).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(interfaces).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("interfaces", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("interfaces", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("interfaces", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(interfaces).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}
                    </Stack>
                  </>

                  <Stack direction="row" alignItems="center" >
                    {/* <button type="button" class="a-button a-button--primary -without-icon" disabled={!((archData !== null && typeof archData !== 'undefined' && archData.length > 0) ? (Array.from(archData).length > 0) : (Array.from(interfaces).length > 0) || Array.from(cloud).length > 0 || Array.from(database).length > 0 || Array.from(application).length > 0 || Array.from(automotive).length > 0)} onClick={handleFinish} style={{ margin: '5px', borderRadius: '0.5rem', fontFamily: 'BoschSans' }}>
                      <span class="a-button__label">Finish</span>
                    </button> */}

                    <button
                      type="button"
                      className="a-button a-button--primary -without-icon"
                      disabled={!(
                        Array.from(cloud).length > 0 ||
                        Array.from(database).length > 0 ||
                        (archData !== null &&
                          typeof archData !== "undefined" &&
                          archData.length > 0
                          ? Array.from(archData).length > 0
                          : Array.from(interfaces).length > 0 || Array.from(application).length > 0 || Array.from(automotive).length > 0
                        )
                      )}
                      onClick={handleFinish}
                      style={{
                        margin: "5px",
                        borderRadius: "0.5rem",
                        fontFamily: "BoschSans",
                      }}
                    >
                      <span className="a-button__label">Finish</span>
                    </button>
                  </Stack>
                </Stack>
              </React.Fragment>
            ) : activeStep === 1 ? (
              <React.Fragment>
                <Stack direction="column" alignItems="center" justifyContent="center">
                  <Stack>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      Select Cloud
                    </Typography>
                    <select value={selectedCloud} onChange={handleCloudChange} style={{ backgroundColor: '#E0E2E5', border: 0, margin: "10px 0px", padding: "10px 20px", fontWeight: "600", borderRadius: '0.5rem' }}>
                      <option value="AWS">AWS</option>
                      <option value="AZURE">AZURE</option>
                      <option value="GCP">GCP</option>
                    </select>
                  </Stack>

                  <Stack direction="column" justifyContent="center" alignItems="center" style={{ marginTop: "15px" }}>
                    <SearchForm value={searchQuery} onChange={handleSearch} onClear={handleClearSearch} />
                    {/* <input type="text" placeholder="Search for a chip..." value={searchQuery} onChange={handleSearch} style={{ marginLeft: "20px" }} /> */}
                  </Stack>

                  <div>

                    {selectedCloud === "AWS" && <Stack
                      direction="row"
                      // spacing={1}
                      flexWrap="wrap"
                      style={{ margin: "30px 0px", justifyContent: 'center', alignItems: 'center' }}
                    >
                      {/* {(typeof processedText !== 'undefined' && processedText.length > 0) ?
                        Array.from(searchQuery.length > 0 ? awsFilteredLabels : awsAsset).map(chip => (
                          !Array.from(processedText).includes(chip) ?
                            <div
                              tabIndex="0"
                              className="a-chip"
                              role="button"
                              aria-labelledby="chip-label-id-default"
                              style={{ backgroundColor: Array.from(processedText).includes(chip) ? "#007BC0" : "", color: Array.from(processedText).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                              onClick={handleClickChip("processedText", chip)}
                              onDelete={
                                Array.from(processedText).includes(chip)
                                  ? handleDeleteChip("processedText", chip)
                                  : ""
                              }
                              key={chip}
                              label={chip}
                            >
                              <span
                                id="chip-label-id-default"
                                className="a-chip__label"
                                style={{ userSelect: 'none', fontFamily: 'BoschSans' }}
                              >{chip}</span>
                            </div>
                            :
                            <div
                              tabIndex="0"
                              className="a-chip -selected"
                              role="button"
                              aria-labelledby="chip-label-id-selected"
                              style={{ backgroundColor: Array.from(processedText).includes(chip) ? "#007BC0" : "default", color: Array.from(processedText).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                              onClick={(Array.from(processedText).includes(chip)
                                ? handleDeleteChip("processedText", chip)
                                : "")}
                              key={chip}
                              label={chip}
                            >
                              <span
                                id="chip-label-id-selected"
                                className="a-chip__label"
                                style={{ fontFamily: 'BoschSans' }}
                              >{chip}</span>
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            </div>
                        ))
                        :
                        Array.from(searchQuery.length > 0 ? awsFilteredLabels : awsAsset).map(chip => (
                          !Array.from(cloud).includes(chip) ?
                            <div
                              tabIndex="0"
                              class="a-chip"
                              role="button"
                              aria-labelledby="chip-label-id-default"
                              style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                              onClick={handleClickChip("cloud", chip)}
                              onDelete={
                                Array.from(cloud).includes(chip)
                                  ? handleDeleteChip("cloud", chip)
                                  : ""
                              }
                              key={chip}

                              label={chip}
                            >
                              <span
                                id="chip-label-id-default"
                                class="a-chip__label"
                                style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                              >{chip}</span>
                            </div> : <div
                              tabindex="0"
                              class="a-chip -selected"
                              role="button"
                              aria-labelledby="chip-label-id-selected"
                              style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "default", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                              onClick={(Array.from(cloud).includes(chip)
                                ? handleDeleteChip("cloud", chip)
                                : "")}

                              key={chip}

                              label={chip}
                            >
                              <span
                                id="chip-label-id-selected"
                                class="a-chip__label"
                                style={{ fontFamily: 'BoschSans' }}
                              >{chip}</span>
                              <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                            </div>

                              ))} */}
                      {Array.from(searchQuery.length > 0 ? awsFilteredLabels : awsAsset).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(cloud).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("cloud", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("cloud", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("cloud", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}

                    </Stack>}
                    {selectedCloud === "AZURE" && <Stack
                      direction="row"
                      // spacing={1}
                      flexWrap="wrap"
                      style={{ margin: "30px 0px" }}
                    >
                      {/* {Array.from(searchQuery.length > 0 ? azureFilteredLabels : azureAsset).map(chip => (
                        !Array.from(cloud).includes(chip) ?
                          <div
                            tabIndex="0"
                            class="a-chip"
                            role="button"

                            aria-labelledby="chip-label-id-default"
                            style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={handleClickChip("cloud", chip)}
                            onDelete={
                              Array.from(cloud).includes(chip)
                                ? handleDeleteChip("cloud", chip)
                                : ""
                            }
                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              class="a-chip__label"
                              style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                            >{chip}</span>
                          </div> : <div
                            tabindex="0"
                            class="a-chip -selected"
                            role="button"
                            aria-labelledby="chip-label-id-selected"
                            style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "default", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={(Array.from(cloud).includes(chip)
                              ? handleDeleteChip("cloud", chip)
                              : "")}

                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-selected"
                              class="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div>

                      ))} */}

                      {Array.from(searchQuery.length > 0 ? azureFilteredLabels : azureAsset).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(cloud).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("cloud", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("cloud", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("cloud", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}

                    </Stack>}

                    {selectedCloud === "GCP" && <Stack
                      direction="row"
                      // spacing={1}
                      flexWrap="wrap"
                      style={{ margin: "30px 0px" }}
                    >
                      {/* {Array.from(searchQuery.length > 0 ? gcpFilteredLabels : gcpAsset).map(chip => (

                        !Array.from(cloud).includes(chip) ?
                          <div
                            tabIndex="0"
                            class="a-chip"
                            role="button"

                            aria-labelledby="chip-label-id-default"
                            style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={handleClickChip("cloud", chip)}
                            onDelete={
                              Array.from(cloud).includes(chip)
                                ? handleDeleteChip("cloud", chip)
                                : ""
                            }
                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              class="a-chip__label"
                              style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                            >{chip}</span>
                          </div> : <div
                            tabindex="0"
                            class="a-chip -selected"
                            role="button"
                            aria-labelledby="chip-label-id-selected"
                            style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "default", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={(Array.from(cloud).includes(chip)
                              ? handleDeleteChip("cloud", chip)
                              : "")}

                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-selected"
                              class="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div>

                      ))} */}

                      {Array.from(searchQuery.length > 0 ? gcpFilteredLabels : gcpAsset).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(cloud).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("cloud", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("cloud", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("cloud", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(cloud).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}

                    </Stack>}
                  </div>

                  <Stack direction="row" alignItems="center">

                    {/* <button type="button" class="a-button a-button--primary -without-icon" disabled={!(Array.from(interfaces).length > 0 || (archData !== null && archData.length > 0 && typeof archData !== 'undefined') ? (Array.from(archData).length > 0) : (Array.from(cloud).length > 0) || Array.from(database).length > 0 || Array.from(application).length > 0 || Array.from(automotive).length > 0)} onClick={handleFinish} style={{ margin: '5px', borderRadius: '0.5rem', fontFamily: 'BoschSans' }}>
                      <span class="a-button__label">Finish</span>
                    </button> */}

                    <button
                      type="button"
                      className="a-button a-button--primary -without-icon"
                      disabled={!(
                        Array.from(interfaces).length > 0 ||
                        Array.from(database).length > 0 ||
                        (archData !== null &&
                          typeof archData !== "undefined" &&
                          archData.length > 0
                          ? Array.from(archData).length > 0
                          : Array.from(cloud).length > 0 || Array.from(application).length > 0 || Array.from(automotive).length > 0
                        )
                      )}
                      onClick={handleFinish}
                      style={{
                        margin: "5px",
                        borderRadius: "0.5rem",
                        fontFamily: "BoschSans",
                      }}
                    >
                      <span className="a-button__label">Finish</span>
                    </button>
                  </Stack>
                </Stack>
              </React.Fragment>
            ) : activeStep === 2 ? (
              <React.Fragment>
                <Stack direction="column" alignItems="center" justifyContent="center">
                  <Stack direction="column" justifyContent="center" alignItems="center">
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      Select Database
                    </Typography>
                    <select value={selectedDatabase} onChange={handleDatabaseChange} style={{ backgroundColor: '#E0E2E5', border: 0, margin: "10px 0px", padding: "10px 20px", fontWeight: "600", borderRadius: '0.5rem' }}>
                      <option value="Relational">Relational</option>
                      <option value="Non-Relational">Non-Relational</option>
                      <option value="In-Memory">In-Memory</option>
                    </select>
                    <Stack direction="column" justifyContent="center" alignItems="center" style={{ marginTop: "15px" }}>
                    </Stack>
                  </Stack>

                  {selectedDatabase == 'Relational' && <Stack
                    direction="row"
                    // spacing={1}
                    flexWrap="wrap"
                    style={{ marginBottom: '30px', marginTop: '15px', justifyContent: 'center', alignItems: 'center' }}>
                    {/* {Array.from(reldatasset).map(chip => (

                      !Array.from(database).includes(chip) ?
                        <div
                          tabIndex="0"
                          class="a-chip"
                          role="button"

                          aria-labelledby="chip-label-id-default"
                          style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                          onClick={handleClickChip("database", chip)}
                          onDelete={
                            Array.from(database).includes(chip)
                              ? handleDeleteChip("database", chip)
                              : ""
                          }
                          key={chip}

                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            class="a-chip__label"
                            style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                          >{chip}</span>
                        </div> : <div
                          tabindex="0"
                          class="a-chip -selected"
                          role="button"
                          aria-labelledby="chip-label-id-selected"
                          style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "default", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                          onClick={(Array.from(database).includes(chip)
                            ? handleDeleteChip("database", chip)
                            : "")}

                          key={chip}

                          label={chip}
                        >
                          <span
                            id="chip-label-id-selected"
                            class="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                        </div>

                    ))} */}

                    {<>{Array.from(reldatasset).map(chip => (
                      !Array.from((archData !== null) && archData).includes(chip) && !Array.from(database).includes(chip) ?
                        <div
                          tabIndex="0"
                          className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? '-selected' : ''}`}
                          role="button"
                          aria-labelledby="chip-label-id-default"
                          style={{
                            backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "#007BC0" : "",
                            color: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "white" : "black",
                            userSelect: 'none',
                            marginTop: 10
                          }}
                          onClick={(Array.from((archData !== null) && archData).includes(chip)
                            ? handleClickChip("processedText", chip)
                            : handleClickChip("database", chip))}
                          onDelete={Array.from((archData !== null) && archData).includes(chip)
                            ? handleDeleteChip("processedText", chip)
                            : handleDeleteChip("database", chip)}
                          key={chip}
                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            className="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          {(Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip)) && (
                            <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                          )}
                        </div>
                        :
                        <div
                          tabIndex="0"
                          className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? '-selected' : ''}`}
                          role="button"
                          aria-labelledby="chip-label-id-default"
                          style={{
                            backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "#007BC0" : "",
                            color: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "white" : "black",
                            userSelect: 'none',
                            marginTop: 10
                          }}
                          onClick={(Array.from((archData !== null) && archData).includes(chip)
                            ? handleDeleteChip("processedText", chip)
                            : handleDeleteChip("database", chip))}
                          key={chip}
                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            className="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          {(Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip)) && (
                            <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                          )}
                        </div>
                    ))}</>}
                  </Stack>}


                  {selectedDatabase == 'Non-Relational' && <Stack
                    direction="row"
                    // spacing={1}
                    flexWrap="wrap"
                    style={{ marginBottom: '30px', marginTop: '15px', justifyContent: 'center', alignItems: 'center' }}>
                    {/* {Array.from(reldatasset).map(chip => (
                      !Array.from(database).includes(chip) ?
                        <div
                          tabIndex="0"
                          class="a-chip"
                          role="button"

                          aria-labelledby="chip-label-id-default"
                          style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                          onClick={handleClickChip("database", chip)}
                          onDelete={
                            Array.from(database).includes(chip)
                              ? handleDeleteChip("database", chip)
                              : ""
                          }
                          key={chip}

                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            class="a-chip__label"
                            style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                          >{chip}</span>
                        </div> : <div
                          tabindex="0"
                          class="a-chip -selected"
                          role="button"
                          aria-labelledby="chip-label-id-selected"
                          style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "default", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                          onClick={(Array.from(database).includes(chip)
                            ? handleDeleteChip("database", chip)
                            : "")}

                          key={chip}

                          label={chip}
                        >
                          <span
                            id="chip-label-id-selected"
                            class="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                        </div>

                    ))} */}

                    {Array.from(nreldatasset).map(chip => (
                      !Array.from((archData !== null) && archData).includes(chip) && !Array.from(database).includes(chip) ?
                        <div
                          tabIndex="0"
                          className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? '-selected' : ''}`}
                          role="button"
                          aria-labelledby="chip-label-id-default"
                          style={{
                            backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "#007BC0" : "",
                            color: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "white" : "black",
                            userSelect: 'none',
                            marginTop: 10
                          }}
                          onClick={(Array.from((archData !== null) && archData).includes(chip)
                            ? handleClickChip("processedText", chip)
                            : handleClickChip("database", chip))}
                          onDelete={Array.from((archData !== null) && archData).includes(chip)
                            ? handleDeleteChip("processedText", chip)
                            : handleDeleteChip("database", chip)}
                          key={chip}
                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            className="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          {(Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip)) && (
                            <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                          )}
                        </div>
                        :
                        <div
                          tabIndex="0"
                          className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? '-selected' : ''}`}
                          role="button"
                          aria-labelledby="chip-label-id-default"
                          style={{
                            backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "#007BC0" : "",
                            color: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "white" : "black",
                            userSelect: 'none',
                            marginTop: 10
                          }}
                          onClick={(Array.from((archData !== null) && archData).includes(chip)
                            ? handleDeleteChip("processedText", chip)
                            : handleDeleteChip("database", chip))}
                          key={chip}
                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            className="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          {(Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip)) && (
                            <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                          )}
                        </div>
                    ))}
                  </Stack>}

                  {selectedDatabase == 'In-Memory' && <Stack
                    direction="row"
                    // spacing={1}
                    flexWrap="wrap"
                    style={{ marginBottom: '30px', marginTop: '15px', justifyContent: 'center', alignItems: 'center' }}>
                    {/* {Array.from(memdatasset).map(chip => (
                      !Array.from(database).includes(chip) ?
                        <div
                          tabIndex="0"
                          class="a-chip"
                          role="button"

                          aria-labelledby="chip-label-id-default"
                          style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                          onClick={handleClickChip("database", chip)}
                          onDelete={
                            Array.from(database).includes(chip)
                              ? handleDeleteChip("database", chip)
                              : ""
                          }
                          key={chip}

                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            class="a-chip__label"
                            style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                          >{chip}</span>
                        </div> : <div
                          tabindex="0"
                          class="a-chip -selected"
                          role="button"
                          aria-labelledby="chip-label-id-selected"
                          style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "default", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                          onClick={(Array.from(database).includes(chip)
                            ? handleDeleteChip("database", chip)
                            : "")}

                          key={chip}

                          label={chip}
                        >
                          <span
                            id="chip-label-id-selected"
                            class="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                        </div>

                    ))} */}
                    {Array.from(memdatasset).map(chip => (
                      !Array.from((archData !== null) && archData).includes(chip) && !Array.from(database).includes(chip) ?
                        <div
                          tabIndex="0"
                          className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? '-selected' : ''}`}
                          role="button"
                          aria-labelledby="chip-label-id-default"
                          style={{
                            backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "#007BC0" : "",
                            color: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "white" : "black",
                            userSelect: 'none',
                            marginTop: 10
                          }}
                          onClick={(Array.from((archData !== null) && archData).includes(chip)
                            ? handleClickChip("processedText", chip)
                            : handleClickChip("database", chip))}
                          onDelete={Array.from((archData !== null) && archData).includes(chip)
                            ? handleDeleteChip("processedText", chip)
                            : handleDeleteChip("database", chip)}
                          key={chip}
                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            className="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          {(Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip)) && (
                            <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                          )}
                        </div>
                        :
                        <div
                          tabIndex="0"
                          className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? '-selected' : ''}`}
                          role="button"
                          aria-labelledby="chip-label-id-default"
                          style={{
                            backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "#007BC0" : "",
                            color: Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip) ? "white" : "black",
                            userSelect: 'none',
                            marginTop: 10
                          }}
                          onClick={(Array.from((archData !== null) && archData).includes(chip)
                            ? handleDeleteChip("processedText", chip)
                            : handleDeleteChip("database", chip))}
                          key={chip}
                          label={chip}
                        >
                          <span
                            id="chip-label-id-default"
                            className="a-chip__label"
                            style={{ fontFamily: 'BoschSans' }}
                          >{chip}</span>
                          {(Array.from((archData !== null) && archData).includes(chip) || Array.from(database).includes(chip)) && (
                            <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                          )}
                        </div>
                    ))}
                  </Stack>}
                  <Stack direction="row" alignItems="center">
                    {/* <button type="button" class="a-button a-button--primary -without-icon" disabled={!(Array.from(interfaces).length > 0 || Array.from(cloud).length > 0 || (archData !== null && typeof archData !== 'undefined' && archData.length > 0) ? (Array.from(archData).length > 0) : (Array.from(database).length > 0) || Array.from(application).length > 0)} onClick={handleFinish} style={{ margin: '5px', borderRadius: '0.5rem', fontFamily: 'BoschSans' }}>
                      <span class="a-button__label">Finish</span>
                    </button> */}

                    <button
                      type="button"
                      className="a-button a-button--primary -without-icon"
                      disabled={!(
                        Array.from(interfaces).length > 0 ||
                        Array.from(cloud).length > 0 ||
                        (archData !== null &&
                          typeof archData !== "undefined" &&
                          archData.length > 0
                          ? Array.from(archData).length > 0
                          : Array.from(database).length > 0 || Array.from(application).length > 0 || Array.from(automotive).length > 0
                        )
                      )}
                      onClick={handleFinish}
                      style={{
                        margin: "5px",
                        borderRadius: "0.5rem",
                        fontFamily: "BoschSans",
                      }}
                    >
                      <span className="a-button__label">Finish</span>
                    </button>
                  </Stack>
                </Stack>
              </React.Fragment>
            )


              : activeStep === 3 ? (
                <React.Fragment>
                  <Stack direction="column" alignItems="center" justifyContent="center">
                    <Stack direction="column" justifyContent="center" alignItems="center">
                      <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        Select Application and Servers
                      </Typography>
                      <select value={selectedApplication} onChange={handleApplicationChange} style={{ backgroundColor: '#E0E2E5', border: 0, margin: "10px 0px", padding: "10px 20px", fontWeight: "600", borderRadius: '0.5rem' }}>
                        <option value="Web">WEB</option>
                        <option value="Mobile">MOBILE</option>
                      </select>
                    </Stack>

                    {selectedApplication == 'Web' && <Stack
                      direction="row"
                      // spacing={1}
                      flexWrap="wrap"
                      style={{ marginBottom: '30px', marginTop: '15px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* {Array.from(webapplication).map(chip => (
                        !Array.from(application).includes(chip) ?
                          <div
                            tabIndex="0"
                            class="a-chip"
                            role="button"

                            aria-labelledby="chip-label-id-default"
                            style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={handleClickChip("application", chip)}
                            onDelete={
                              Array.from(application).includes(chip)
                                ? handleDeleteChip("application", chip)
                                : ""
                            }
                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              class="a-chip__label"
                              style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                            >{chip}</span>
                          </div> : <div
                            tabindex="0"
                            class="a-chip -selected"
                            role="button"
                            aria-labelledby="chip-label-id-selected"
                            style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "default", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={(Array.from(application).includes(chip)
                              ? handleDeleteChip("application", chip)
                              : "")}

                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-selected"
                              class="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div>

                      ))} */}
                      {Array.from(webapplication).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(application).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("application", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("application", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("application", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}
                    </Stack>}


                    {selectedApplication == 'Mobile' && <Stack
                      direction="row"
                      // spacing={1}
                      flexWrap="wrap"
                      style={{ marginBottom: '30px', marginTop: '15px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* {Array.from(mobileapplication).map(chip => (

                        !Array.from(application).includes(chip) ?
                          <div
                            tabIndex="0"
                            class="a-chip"
                            role="button"

                            aria-labelledby="chip-label-id-default"
                            style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={handleClickChip("application", chip)}
                            onDelete={
                              Array.from(application).includes(chip)
                                ? handleDeleteChip("application", chip)
                                : ""
                            }
                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              class="a-chip__label"
                              style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                            >{chip}</span>
                          </div> : <div
                            tabindex="0"
                            class="a-chip -selected"
                            role="button"
                            aria-labelledby="chip-label-id-selected"
                            style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "default", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={(Array.from(application).includes(chip)
                              ? handleDeleteChip("application", chip)
                              : "")}

                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-selected"
                              class="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div>

                      ))} */}

                      {Array.from(mobileapplication).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(application).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("application", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("application", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("application", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}
                    </Stack>}

                    {selectedApplication == 'Server' && <Stack
                      direction="row"
                      // spacing={1}
                      flexWrap="wrap"
                      style={{ marginBottom: '30px', marginTop: '15px', justifyContent: 'center', alignItems: 'center' }}>
                      {/* {Array.from(serverapplication).map(chip => (
                        !Array.from(application).includes(chip) ?
                          <div
                            tabIndex="0"
                            class="a-chip"
                            role="button"

                            aria-labelledby="chip-label-id-default"
                            style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={handleClickChip("application", chip)}
                            onDelete={
                              Array.from(application).includes(chip)
                                ? handleDeleteChip("application", chip)
                                : ""
                            }
                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              class="a-chip__label"
                              style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                            >{chip}</span>
                          </div> : <div
                            tabindex="0"
                            class="a-chip -selected"
                            role="button"
                            aria-labelledby="chip-label-id-selected"
                            style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "default", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                            onClick={(Array.from(application).includes(chip)
                              ? handleDeleteChip("application", chip)
                              : "")}

                            key={chip}

                            label={chip}
                          >
                            <span
                              id="chip-label-id-selected"
                              class="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div>

                      ))} */}
                      {Array.from(serverapplication).map(chip => (
                        !Array.from((archData !== null) && archData).includes(chip) && !Array.from(application).includes(chip) ?
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleClickChip("processedText", chip)
                              : handleClickChip("application", chip))}
                            onDelete={Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("application", chip)}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                          :
                          <div
                            tabIndex="0"
                            className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? '-selected' : ''}`}
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            style={{
                              backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "#007BC0" : "",
                              color: Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip) ? "white" : "black",
                              userSelect: 'none',
                              marginTop: 10
                            }}
                            onClick={(Array.from((archData !== null) && archData).includes(chip)
                              ? handleDeleteChip("processedText", chip)
                              : handleDeleteChip("application", chip))}
                            key={chip}
                            label={chip}
                          >
                            <span
                              id="chip-label-id-default"
                              className="a-chip__label"
                              style={{ fontFamily: 'BoschSans' }}
                            >{chip}</span>
                            {(Array.from((archData !== null) && archData).includes(chip) || Array.from(application).includes(chip)) && (
                              <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                            )}
                          </div>
                      ))}
                    </Stack>}
                    <Stack direction="row" alignItems="center">

                      {/* <button type="button" class="a-button a-button--primary -without-icon" disabled={!(Array.from(interfaces).length > 0 || Array.from(cloud).length > 0 || Array.from(database).length > 0 || (archData !== null && typeof archData !== 'undefined' && archData.length > 0) ? (Array.from(archData).length > 0) : (Array.from(application).length > 0) || Array.from(automotive).length > 0)} onClick={handleFinish} style={{ margin: '5px', borderRadius: '0.5rem', fontFamily: 'BoschSans' }}>
                        <span class="a-button__label">Finish</span>
                      </button> */}
                      <button
                        type="button"
                        className="a-button a-button--primary -without-icon"
                        disabled={!(
                          Array.from(interfaces).length > 0 ||
                          Array.from(database).length > 0 ||
                          (archData !== null &&
                            typeof archData !== "undefined" &&
                            archData.length > 0
                            ? Array.from(archData).length > 0
                            : Array.from(application).length > 0 || Array.from(cloud).length > 0 || Array.from(automotive).length > 0
                          )
                        )}
                        onClick={handleFinish}
                        style={{
                          margin: "5px",
                          borderRadius: "0.5rem",
                          fontFamily: "BoschSans",
                        }}
                      >
                        <span className="a-button__label">Finish</span>
                      </button>

                    </Stack>
                  </Stack>
                </React.Fragment>
              ) : activeStep === 4 ? (
                <React.Fragment>
                  {/* <GetAssets /> */}
                  <Stack direction="column" alignItems="center" justifyContent="center">
                    <Stack direction="column" alignItems="center">
                      <Typography variant="h5" style={{ fontWeight: "bold", fontFamily: 'BoschSans' }}>
                        Select Automotive Breaking ECUs
                      </Typography>
                      {/* <select value={selectedAutomotive} onChange={handleAutomotiveChange} style={{ backgroundColor: '#E0E2E5', border: 0, margin: "10px 0px", padding: "10px 20px", fontWeight: "600", borderRadius: '0.5rem' }}>
                        <option value="Powertrain">Powertrain</option>
                        <option value="transmissioncontrolmodule">Transmission Control Module</option>
                      </select>
                      <SearchForm value={searchQuery} onChange={handleSearch} /> */}
                      {/* <input type="text" placeholder="Search for a chip..." value={searchQuery} onChange={handleSearch} style={{ marginLeft: "20px" }} /> */}

                    </Stack>
                    <>

                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        style={{ margin: "30px 0px", justifyContent: 'center', alignItems: 'center' }}
                      >
                        {/* {Array.from(searchQuery.length > 0 ? automotiveFilteredLabels : automotiveAsset).map((chip) => (
                          !Array.from(automotive).includes(chip) ?
                            <div
                              tabIndex="0"
                              class="a-chip"
                              role="button"

                              aria-labelledby="chip-label-id-default"
                              style={{ backgroundColor: Array.from(automotive).includes(chip) ? "#007BC0" : "", color: Array.from(automotive).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                              onClick={handleClickChip("automotive", chip)}
                              onDelete={
                                Array.from(automotive).includes(chip)
                                  ? handleDeleteChip("automotive", chip)
                                  : ""
                              }
                              key={chip}

                              label={chip}
                            >
                              <span
                                id="chip-label-id-default"
                                class="a-chip__label"
                                style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                              >{chip}</span>
                            </div> : <div
                              tabindex="0"
                              class="a-chip -selected"
                              role="button"
                              aria-labelledby="chip-label-id-selected"
                              style={{ backgroundColor: Array.from(automotive).includes(chip) ? "#007BC0" : "default", color: Array.from(automotive).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                              onClick={(Array.from(automotive).includes(chip)
                                ? handleDeleteChip("automotive", chip)
                                : "")}

                              key={chip}

                              label={chip}
                            >
                              <span
                                id="chip-label-id-selected"
                                class="a-chip__label"
                                style={{ fontFamily: 'BoschSans' }}
                              >{chip}</span>
                              <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                            </div>

                        ))} */}
                        {Array.from(searchQuery.length > 0 ? automotiveFilteredLabels : automotiveAsset).map(chip => (
                          !Array.from((archData !== null) && archData).includes(chip) && !Array.from(automotive).includes(chip) ?
                            <div
                              tabIndex="0"
                              className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip) ? '-selected' : ''}`}
                              role="button"
                              aria-labelledby="chip-label-id-default"
                              style={{
                                backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip) ? "#007BC0" : "",
                                color: Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip) ? "white" : "black",
                                userSelect: 'none',
                                marginTop: 10
                              }}
                              onClick={(Array.from((archData !== null) && archData).includes(chip)
                                ? handleClickChip("processedText", chip)
                                : handleClickChip("automotive", chip))}
                              onDelete={Array.from((archData !== null) && archData).includes(chip)
                                ? handleDeleteChip("processedText", chip)
                                : handleDeleteChip("automotive", chip)}
                              key={chip}
                              label={chip}
                            >
                              <span
                                id="chip-label-id-default"
                                className="a-chip__label"
                                style={{ fontFamily: 'BoschSans' }}
                              >{chip}</span>
                              {(Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip)) && (
                                <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                              )}
                            </div>
                            :
                            <div
                              tabIndex="0"
                              className={`a-chip ${Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip) ? '-selected' : ''}`}
                              role="button"
                              aria-labelledby="chip-label-id-default"
                              style={{
                                backgroundColor: Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip) ? "#007BC0" : "",
                                color: Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip) ? "white" : "black",
                                userSelect: 'none',
                                marginTop: 10
                              }}
                              onClick={(Array.from((archData !== null) && archData).includes(chip)
                                ? handleDeleteChip("processedText", chip)
                                : handleDeleteChip("automotive", chip))}
                              key={chip}
                              label={chip}
                            >
                              <span
                                id="chip-label-id-default"
                                className="a-chip__label"
                                style={{ fontFamily: 'BoschSans' }}
                              >{chip}</span>
                              {(Array.from((archData !== null) && archData).includes(chip) || Array.from(automotive).includes(chip)) && (
                                <i className="a-icon a-chip__close ui-ic-close-small" title="close button"></i>
                              )}
                            </div>
                        ))}
                      </Stack>
                    </>

                    <Stack direction="row" alignItems="center" >
                      {/* <button type="button" class="a-button a-button--primary -without-icon" disabled={!(Array.from(interfaces).length > 0 || Array.from(cloud).length > 0 || Array.from(database).length > 0 || Array.from(application).length > 0 || (archData !== null && typeof archData !== 'undefined' && archData.length > 0) ? (Array.from(archData).length > 0) : (Array.from(automotive).length > 0))} onClick={handleFinish} style={{ margin: '5px', borderRadius: '0.5rem', fontFamily: 'BoschSans' }}>
                        <span class="a-button__label">Finish</span>
                      </button> */}

                      <button
                        type="button"
                        className="a-button a-button--primary -without-icon"
                        disabled={!(
                          Array.from(interfaces).length > 0 ||
                          Array.from(database).length > 0 ||
                          (archData !== null &&
                            typeof archData !== "undefined" &&
                            archData.length > 0
                            ? Array.from(archData).length > 0
                            : Array.from(automotive).length > 0 || Array.from(application).length > 0 || Array.from(cloud).length > 0
                          )
                        )}
                        onClick={handleFinish}
                        style={{
                          margin: "5px",
                          borderRadius: "0.5rem",
                          fontFamily: "BoschSans",
                        }}
                      >
                        <span className="a-button__label">Finish</span>
                      </button>
                    </Stack>
                  </Stack>
                </React.Fragment>
              ) : activeStep === 5 ? (
                <React.Fragment>
                  <Stack direction="column" alignItems="center" justifyContent="center" >
                    <p style={{ color: 'red' }}><span style={{ color: 'red' }}>*</span> Mandatory Fields</p>
                    <Stack direction="column" alignItems="center" justifyContent="center" style={{ width: "100%", height: "100%", overflowY: 'auto' }} >
                      <Stack direction="row">
                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                          {/* <Typography
                            variant="h5"
                            style={{ fontWeight: "bold", marginBottom: 20 }}
                          >
                            Enter Project Name
                          </Typography> */}
                          <div class="a-text-field a-text-field--search" style={{ marginBottom: 20 }}>
                            <label for="6">Name <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" id="search-default" style={{ borderRadius: '0.5rem', border: 0 }} placeholder="Enter Project Name" value={projectName} onChange={handleprojectchange} />
                            {projError && <p style={{ color: 'red' }}>{projError}</p>}
                          </div>
                        </Stack>
                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                          <div class="a-text-field a-text-field--search" style={{ marginBottom: 20 }}>
                            <label for="6">Security Manager <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" id="search-default" style={{ borderRadius: '0.5rem', border: 0 }} placeholder="Security Manager Name" value={managerName} onChange={handleManagerChange} />
                            {mangError && <p style={{ color: 'red' }}>{mangError}</p>}
                          </div>
                        </Stack>

                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                          <div class="a-text-field a-text-field--search" style={{ marginBottom: 20 }}>
                            <label for="6">Department <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" id="search-default" style={{ borderRadius: '0.5rem', border: 0 }} placeholder="Enter Department" value={departmentName} onChange={handleDepartmentChange} />
                            {deptError && <p style={{ color: 'red' }}>{deptError}</p>}
                          </div>
                        </Stack>

                      </Stack>
                      <Stack direction="row">
                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                          <div class="a-text-area a-text-area--search" style={{ marginBottom: 20, borderRadius: '5px!important' }}>
                            <label for="6">Technical Description <span style={{ color: 'red' }}>*</span></label>
                            <textarea placeholder="Enter Description Here" value={technicalText} style={{ borderRadius: '0.5rem' }} onChange={handleTechnicalChange}></textarea>
                          </div>
                          {techError && <p style={{ color: 'red' }}>{techError}</p>}

                        </Stack>

                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>

                          <div class="a-text-area a-text-area--search" style={{ marginBottom: 20, borderRadius: '5px!important' }}>
                            <label for="6">Scope <span style={{ color: 'red' }}>*</span></label>
                            <textarea placeholder="Enter Scope Here" value={scopeText} style={{ borderRadius: '0.5rem' }} onChange={handleScopeChange}></textarea>
                          </div>
                          {scopeError && <p style={{ color: 'red' }}>{scopeError}</p>}
                        </Stack>

                      </Stack>

                      <p>{currentDateTime.toLocaleString()}</p>

                      <input type="hidden" name="dateTime" value={currentDateTime.toLocaleString()} />
                      <label style={{ fontSize: 32, fontWeight: "bold" }}>Select Methodology</label>
                      <Stack sx={{ padding: 2, fontWeight: 400 }} spacing={1.5} alignItems='center'>
                        <div style={{ display: 'flex', flexDirection: 'row', alignContent: "space-between" }}>
                          {apMethod ? leMethod1 ? <><div
                            tabIndex="0"
                            class="a-chip"
                            role="button"
                            aria-labelledby="chip-label-id-default"
                            onClick={() => { handleAPMethodology() }}
                            style={{ backgroundColor: apMethod ? "#007BC0" : "", color: apMethod ? "white" : "black", userSelect: 'none' }}>
                            <span id="chip-label-id-default" class="a-chip__label" style={{ userSelect: 'none', fontFamily: 'BoschSans', fontSize: 16, fontWeight: "normal" }}>Attack Potential</span>
                            <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                          </div> <div
                            tabIndex="0"
                            class="a-chip -disabled"
                            role="button"
                            // onClick={handleLEMethodology}
                            style={{ cursor: 'not-allowed' }}
                            aria-labelledby="chip-label-id-disabled"
                            aria-disabled="true">
                              <span
                                id="chip-label-id-disabled"
                                class="a-chip__label"
                                style={{ userSelect: 'none', fontFamily: 'BoschSans', fontSize: 16, fontWeight: "normal" }}

                              >Likelihood Estimation</span>
                            </div></> : "asdcsfv" : leMethod ? apMethod1 ? <><div
                              tabIndex="0"
                              class="a-chip -disabled"
                              role="button"
                              aria-labelledby="chip-label-id-disabled"
                              // onClick={handleAPMethodology}
                              style={{ cursor: "not-allowed" }}>
                              <span
                                id="chip-label-id-disabled"
                                class="a-chip__label"
                                style={{ cursor: 'not-allowed' }}

                              >Attack Potential</span>
                            </div> <div
                              tabIndex="0"
                              class="a-chip"
                              role="button"
                              onClick={handleLEMethodology}
                              style={{ backgroundColor: leMethod ? "#007BC0" : "", color: leMethod ? "white" : "black", userSelect: 'none' }}
                              aria-labelledby="chip-label-id-default">
                                <span
                                  id="chip-label-id-default"
                                  class="a-chip__label"
                                  style={{ userSelect: 'none', fontFamily: 'BoschSans', fontSize: 16, fontWeight: "normal" }}

                                >Likelihood Estimation</span>
                                <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                              </div></> : "" : <><div
                                tabIndex="0"
                                class="a-chip"
                                role="button"
                                aria-labelledby="chip-label-id-default"
                                onClick={handleAPMethodology}
                                style={{ backgroundColor: apMethod ? "#007BC0" : "", color: apMethod ? "white" : "black", userSelect: 'none' }}>
                                <span
                                  id="chip-label-id-default"
                                  class="a-chip__label"
                                  style={{ userSelect: 'none', fontFamily: 'BoschSans', fontSize: 16, fontWeight: "normal" }}

                                >Attack Potential</span>
                              </div> <div
                                tabIndex="0"
                                class="a-chip"
                                role="button"
                                onClick={handleLEMethodology}
                                style={{ backgroundColor: leMethod ? "#007BC0" : "", color: leMethod ? "white" : "black", userSelect: 'none' }}
                                aria-labelledby="chip-label-id-default">
                              <span
                                id="chip-label-id-default"
                                class="a-chip__label"
                                style={{ userSelect: 'none', fontFamily: 'BoschSans', fontSize: 16, fontWeight: "normal" }}

                              >Likelihood Estimation</span>
                            </div></>
                          }

                        </div>

                        {apMethod
                          ?
                          <>
                            <Box style={{ width: '100%' }}>
                              <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row' }}>
                                <Grid item xs={6}>
                                  <Item>
                                    <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                      <input
                                        type="checkbox"
                                        name="group2"
                                        value="AP .xlsm"
                                        checked={APCheckboxes["AP .xlsm"]}
                                        onChange={() => handleAPCheckboxChange('AP .xlsm')}
                                        style={{ marginRight: 5 }}
                                      />
                                      Armadillo Compatible (.xlsm)
                                    </label>
                                  </Item>
                                </Grid>
                                <Grid item xs={6}>
                                  <Item>
                                    <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                      <input
                                        type="checkbox"
                                        name="group2"
                                        value="AP .PDF"
                                        checked={APCheckboxes["AP .PDF"]}
                                        onChange={() => handleAPCheckboxChange('AP .PDF')}
                                        style={{ marginRight: 5 }}
                                      />
                                      TaRA Document (.PDF)
                                    </label>
                                  </Item>
                                </Grid>
                                <Grid item xs={6}>
                                  <Item>
                                    <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                      <input
                                        type="checkbox"
                                        name="group2"
                                        value="AP SCD"
                                        checked={APCheckboxes["AP SCD"]}
                                        onChange={() => handleAPCheckboxChange('AP SCD')}
                                        style={{ marginRight: 5 }}
                                      />
                                      Security Concepts Document (.doc)
                                    </label>
                                  </Item>
                                </Grid>
                                {/* <Grid item xs={6}>
                                  <Item>
                                    <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                      <input
                                        type="checkbox"
                                        name="group2"
                                        value="AP AT"
                                        checked={APCheckboxes["AP AT"]}
                                        onChange={() => handleAPCheckboxChange('AP AT')}
                                        style={{ marginRight: 5 }}
                                      />
                                      Attack Trees
                                    </label>
                                  </Item>
                                </Grid> */}
                                <Grid item xs={6}>
                                  <Item>
                                    <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                      <input
                                        type="checkbox"
                                        value="Vuln"
                                        checked={isAPChecked}
                                        onChange={handleAPVulnChange}
                                        style={{ marginRight: 5 }}
                                        htmlFor={vulnCheckboxName}
                                      />
                                      Vulnerability Document
                                    </label>
                                  </Item>
                                </Grid>
                                {/* <Grid item xs={6}>
                                  <Item>
                                    <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                      <input
                                        type="checkbox"
                                        value="AP TR"
                                        checked={APCheckboxes["AP TR"]}
                                        onChange={() => handleAPCheckboxChange('AP TR')}
                                        style={{ marginRight: 5 }}
                                      />
                                      Traceability Graphs
                                    </label>
                                  </Item>
                                </Grid> */}
                              </Grid>
                            </Box>
                          </>
                          :
                          leMethod
                            ?
                            <>
                              <Box style={{ width: '100%' }}>
                                <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Grid item xs={6}>
                                    <Item>
                                      <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                        <input
                                          type="checkbox"
                                          name="group4"
                                          value="LE .xlsm"
                                          checked={LECheckboxes["LE .xlsm"]}
                                          onChange={() => handleLECheckboxChange('LE .xlsm')}
                                          style={{ marginRight: 5 }}
                                        />
                                        Armadillo Compatible (.xlsm)
                                      </label>
                                    </Item>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Item>
                                      <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                        <input
                                          type="checkbox"
                                          name="group4"
                                          value="LE .PDF"
                                          checked={LECheckboxes["LE .PDF"]}
                                          onChange={() => handleLECheckboxChange('LE .PDF')}
                                          style={{ marginRight: 5 }}
                                        />
                                        TaRA Document (.PDF)
                                      </label>
                                    </Item>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Item>
                                      <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                        <input
                                          type="checkbox"
                                          name="group4"
                                          value="LE SCD"
                                          checked={LECheckboxes["LE SCD"]}
                                          onChange={() => handleLECheckboxChange('LE SCD')}
                                          style={{ marginRight: 5 }}
                                        />
                                        Security Concepts Document (.doc)
                                      </label>
                                    </Item>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Item>
                                      <label style={{ fontWeight: "bold", fontSize: 16 }}>
                                        <input
                                          type="checkbox"
                                          value="Vuln"
                                          checked={isLEChecked}
                                          onChange={handleLEVulnChange}
                                          style={{ marginRight: 5 }}
                                          htmlFor={vulnCheckboxName}
                                        />
                                        Vulnerability Document
                                      </label>
                                    </Item>
                                  </Grid>
                                </Grid>
                              </Box>
                            </>
                            :
                            ''
                        }

                      </Stack>

                      <Typography
                        variant="h7"
                        style={{ fontWeight: "bold", marginBottom: 20 }}
                      >
                        Tara Sheet and Security Artifacts will be generated for following assets
                      </Typography>
                      {Array.from(interfaces).length === 0 ? "" : <><Typography
                        style={{ fontWeight: "bold", marginBottom: 8, fontSize: 17 }}
                      >
                        Interfaces and Protocols
                      </Typography>
                        <Stack direction="row" flexWrap='wrap' style={{ marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                          {Array.from(interfaces).map((chip) => (
                            !Array.from(interfaces).includes(chip) ?
                              <div
                                tabIndex="0"
                                class="a-chip"
                                role="button"

                                aria-labelledby="chip-label-id-default"
                                style={{ backgroundColor: Array.from(interfaces).includes(chip) ? "#007BC0" : "", color: Array.from(interfaces).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={handleClickChip("interfaces", chip)}
                                onDelete={
                                  Array.from(interfaces).includes(chip)
                                    ? handleDeleteChip("interfaces", chip)
                                    : ""
                                }
                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-default"
                                  class="a-chip__label"
                                  style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                                >{chip}</span>
                              </div> : <div
                                tabindex="0"
                                class="a-chip -selected"
                                role="button"
                                aria-labelledby="chip-label-id-selected"
                                style={{ backgroundColor: Array.from(interfaces).includes(chip) ? "#007BC0" : "default", color: Array.from(interfaces).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={(Array.from(interfaces).includes(chip)
                                  ? handleDeleteChip("interfaces", chip)
                                  : "")}

                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-selected"
                                  class="a-chip__label"
                                  style={{ fontFamily: 'BoschSans' }}
                                >{chip}</span>
                                <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                              </div>
                          ))}
                        </Stack></>}

                      {
                        (Array.from(cloud).length !== 0) && <><Typography
                          style={{ fontWeight: "bold", marginBottom: 8, fontSize: 17 }}
                        >
                          Cloud
                        </Typography>
                          <Stack direction="row" flexWrap='wrap' style={{ marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                            {Array.from(cloud).map((chip) => (

                              !Array.from(cloud).includes(chip) ?
                                <div
                                  tabIndex="0"
                                  class="a-chip"
                                  role="button"

                                  aria-labelledby="chip-label-id-default"
                                  style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                  onClick={handleClickChip("cloud", chip)}
                                  onDelete={
                                    Array.from(cloud).includes(chip)
                                      ? handleDeleteChip("cloud", chip)
                                      : ""
                                  }
                                  key={chip}

                                  label={chip}
                                >
                                  <span
                                    id="chip-label-id-default"
                                    class="a-chip__label"
                                    style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                                  >{chip}</span>
                                </div> : <div
                                  tabindex="0"
                                  class="a-chip -selected"
                                  role="button"
                                  aria-labelledby="chip-label-id-selected"
                                  style={{ backgroundColor: Array.from(cloud).includes(chip) ? "#007BC0" : "default", color: Array.from(cloud).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                  onClick={(Array.from(cloud).includes(chip)
                                    ? handleDeleteChip("cloud", chip)
                                    : "")}

                                  key={chip}

                                  label={chip}
                                >
                                  <span
                                    id="chip-label-id-selected"
                                    class="a-chip__label"
                                    style={{ fontFamily: 'BoschSans' }}
                                  >{chip}</span>
                                  <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                                </div>

                            ))}
                          </Stack></>}
                      {(Array.from((archData !== null) && archData).length !== 0) && <><Typography
                        style={{ fontWeight: "bold", marginBottom: 8, fontSize: 17 }}
                      >
                        Assets from Architecture
                      </Typography>
                        <Stack direction="row" flexWrap='wrap' style={{ marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                          {Array.from((archData !== null) && archData).map((chip) => (

                            !Array.from((archData !== null) && archData).includes(chip) ?
                              <div
                                tabIndex="0"
                                class="a-chip"
                                role="button"

                                aria-labelledby="chip-label-id-default"
                                style={{ backgroundColor: Array.from((archData !== null) && archData).includes(chip) ? "#007BC0" : "", color: Array.from((archData !== null) && archData).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={handleClickChip("processedText", chip)}
                                onDelete={
                                  Array.from((archData !== null) && archData).includes(chip)
                                    ? handleDeleteChip("processedText", chip)
                                    : ""
                                }
                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-default"
                                  class="a-chip__label"
                                  style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                                >{chip}</span>
                              </div> : <div
                                tabindex="0"
                                class="a-chip -selected"
                                role="button"
                                aria-labelledby="chip-label-id-selected"
                                style={{ backgroundColor: Array.from((archData !== null) && archData).includes(chip) ? "#007BC0" : "default", color: Array.from((archData !== null) && archData).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={(Array.from((archData !== null) && archData).includes(chip)
                                  ? handleDeleteChip("processedText", chip)
                                  : "")}

                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-selected"
                                  class="a-chip__label"
                                  style={{ fontFamily: 'BoschSans' }}
                                >{chip}</span>
                                <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                              </div>

                          ))}
                        </Stack></>}

                      {Array.from(database).length === 0 ? "" : <><Typography
                        style={{ fontWeight: "bold", marginBottom: 6, fontSize: 17 }}
                      >
                        Database
                      </Typography>
                        <Stack direction="row" flexWrap='wrap' style={{ marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                          {Array.from(database).map((chip) => (

                            !Array.from(database).includes(chip) ?
                              <div
                                tabIndex="0"
                                class="a-chip"
                                role="button"

                                aria-labelledby="chip-label-id-default"
                                style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={handleClickChip("database", chip)}
                                onDelete={
                                  Array.from(database).includes(chip)
                                    ? handleDeleteChip("database", chip)
                                    : ""
                                }
                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-default"
                                  class="a-chip__label"
                                  style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                                >{chip}</span>
                              </div> : <div
                                tabindex="0"
                                class="a-chip -selected"
                                role="button"
                                aria-labelledby="chip-label-id-selected"
                                style={{ backgroundColor: Array.from(database).includes(chip) ? "#007BC0" : "default", color: Array.from(database).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={(Array.from(database).includes(chip)
                                  ? handleDeleteChip("database", chip)
                                  : "")}

                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-selected"
                                  class="a-chip__label"
                                  style={{ fontFamily: 'BoschSans' }}
                                >{chip}</span>
                                <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                              </div>
                          ))}
                        </Stack></>}



                      {Array.from(application).length === 0 ? "" : <><Typography
                        style={{ fontWeight: "bold", marginBottom: 6, fontSize: 14 }}
                      >
                        Application and Servers
                      </Typography>
                        <Stack direction="row" flexWrap='wrap' style={{ marginBottom: 16 }}>
                          {Array.from(application).map((chip) => (

                            !Array.from(application).includes(chip) ?
                              <div
                                tabIndex="0"
                                class="a-chip"
                                role="button"

                                aria-labelledby="chip-label-id-default"
                                style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={handleClickChip("application", chip)}
                                onDelete={
                                  Array.from(application).includes(chip)
                                    ? handleDeleteChip("application", chip)
                                    : ""
                                }
                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-default"
                                  class="a-chip__label"
                                  style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                                >{chip}</span>
                              </div> : <div
                                tabindex="0"
                                class="a-chip -selected"
                                role="button"
                                aria-labelledby="chip-label-id-selected"
                                style={{ backgroundColor: Array.from(application).includes(chip) ? "#007BC0" : "default", color: Array.from(application).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                onClick={(Array.from(application).includes(chip)
                                  ? handleDeleteChip("application", chip)
                                  : "")}

                                key={chip}

                                label={chip}
                              >
                                <span
                                  id="chip-label-id-selected"
                                  class="a-chip__label"
                                  style={{ fontFamily: 'BoschSans' }}
                                >{chip}</span>
                                <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                              </div>
                          ))}
                        </Stack></>}

                      {
                        Array.from(automotive).length === 0 ? "" : <><Typography
                          style={{ fontWeight: "bold", marginBottom: 8, fontSize: 17 }}
                        >
                          Automotive ECUs
                        </Typography>
                          <Stack direction="row" flexWrap='wrap' style={{ marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                            {Array.from(automotive).map((chip) => (

                              !Array.from(automotive).includes(chip) ?
                                <div
                                  tabIndex="0"
                                  class="a-chip"
                                  role="button"

                                  aria-labelledby="chip-label-id-default"
                                  style={{ backgroundColor: Array.from(automotive).includes(chip) ? "#007BC0" : "", color: Array.from(automotive).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                  onClick={handleClickChip("automotive", chip)}
                                  onDelete={
                                    Array.from(automotive).includes(chip)
                                      ? handleDeleteChip("automotive", chip)
                                      : ""
                                  }
                                  key={chip}

                                  label={chip}
                                >
                                  <span
                                    id="chip-label-id-default"
                                    class="a-chip__label"
                                    style={{ userSelect: 'none', fontFamily: 'BoschSans' }}

                                  >{chip}</span>
                                </div> : <div
                                  tabindex="0"
                                  class="a-chip -selected"
                                  role="button"
                                  aria-labelledby="chip-label-id-selected"
                                  style={{ backgroundColor: Array.from(automotive).includes(chip) ? "#007BC0" : "default", color: Array.from(automotive).includes(chip) ? "white" : "black", userSelect: 'none', marginTop: 10 }}
                                  onClick={(Array.from(automotive).includes(chip)
                                    ? handleDeleteChip("automotive", chip)
                                    : "")}

                                  key={chip}

                                  label={chip}
                                >
                                  <span
                                    id="chip-label-id-selected"
                                    class="a-chip__label"
                                    style={{ fontFamily: 'BoschSans' }}
                                  >{chip}</span>
                                  <i class="a-icon a-chip__close ui-ic-close-small" title="close button" ></i>
                                </div>

                            ))}
                          </Stack></>}

                    </Stack>
                    <Stack direction="row" alignItems="center" marginTop="30px">
                      <Button onClick={handleBack}>Back</Button>
                      <button
                        type="button" class="a-button a-button--primary -without-icon"
                        style={{ margin: '5px', fontFamily: 'BoschSans', borderRadius: '0.5rem' }}
                        onClick={() => { getPDFdata(); setIsGenerated("yes"); sendDataDB(); }}
                        disabled={(Array.from(interfaces).length === 0 && Array.from(automotive).length === 0 && Array.from(database).length === 0 && Array.from((archData !== null) && archData).length === 0 && Array.from(cloud).length === 0 && Array.from(application).length === 0 || !(disabledGenerate == false && projectNameGenerate == true && managerNameGenerate == true && departmentNameGenerate == true && scopeTextGenerate == true && technicalTextGenerate == true) || (Object.keys(LECheckboxes).filter((checkbox) => LECheckboxes[checkbox]).length <= 0) && (Object.keys(APCheckboxes).filter((checkbox) => APCheckboxes[checkbox]).length <= 0) && !isAPChecked && !isLEChecked)}
                      >
                        <span class="a-button__label">Generate</span>
                      </button>
                      <button
                        type="button" class="a-button a-button--primary -without-icon"
                        style={{ margin: '5px', fontFamily: 'BoschSans', borderRadius: '0.5rem' }}
                        onClick={() => { sendEditData(); }}
                        disabled={(Array.from(interfaces).length === 0 && Array.from(automotive).length === 0 && Array.from((archData !== null) && archData).length === 0 && Array.from(database).length === 0 && Array.from(cloud).length === 0 && Array.from(application).length === 0 || !(projectNameGenerate == true && managerNameGenerate == true && departmentNameGenerate == true && scopeTextGenerate == true && technicalTextGenerate == true && selectedMethodology === "Attack Potential" ? (apMethod) : (!apMethod)))}
                      >
                        <span class="a-button__label">Edit Tara</span>
                      </button>


                      {/* <button
                        type="button" class="a-button a-button--primary -without-icon"
                        style={{ margin: '5px', fontFamily: 'BoschSans', borderRadius: '0.5rem' }}
                        onClick={() => {
                          getPDFdata();
                          // MainTaraPDF(assumm, misuss, damscenario, secgoalls, ThreatScenarioss, ThreatEvaluation_AP,security_needs, riskass,transformedRiskAss,scopeText,technicalText);

                        }}
                        disabled={(Array.from(interfaces).length === 0 && Array.from(automotive).length === 0 && Array.from(database).length === 0 && Array.from(cloud).length === 0 && Array.from(application).length === 0 || !(projectNameGenerate == true && managerNameGenerate == true && departmentNameGenerate == true && scopeTextGenerate == true && technicalTextGenerate == true && selectedMethodology === "Attack Potential" ? (apMethod) : (!apMethod)))}
                      >
                        <span class="a-button__label">Generate TARA pdf</span>
                      </button> */}



                    </Stack>
                  </Stack>
                </React.Fragment>
              ) : (
                activeStep === 6 && (
                  <EditData_AP data={dataTosend} />)
              )}</>
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid >
    </>
  );
};
export default MainStepper;