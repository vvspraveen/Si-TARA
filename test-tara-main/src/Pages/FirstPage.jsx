import React, { useEffect } from "react";
import ecylogo from '../img/ecylogo.png'
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { rgb } from "d3";
import { Button, Stack } from "@mui/material";

const FirstPage = () => {

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

    const [uploadStatus, setUploadStatus] = React.useState('');
    const [processedText, setProcessedText] = React.useState([]); // State to store processed text
    const [unavailableText, setUnavailableText] = React.useState([]); // State to store processed text
    const [uploadCompleted, setUploadCompleted] = React.useState(false); // State to track upload completion
    const [processingText, setProcessingText] = React.useState(false); // State to track text processing
    // const [imageSrc, setImageSrc] = React.useState(null);
    // const [pdfSrc, setPdfSrc] = React.useState(null);
    const [fileSrc, setFileSrc] = React.useState(null);
    const [file, setFile] = React.useState(null);
    const [zoomFactor, setZoomFactor] = React.useState(1);
    const [isPopupOpen, setPopupOpen] = React.useState(false);
    const [isArchPopupOpen, setArchPopupOpen] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);

    const [dataTosend, setDataTosend] = React.useState({ data: [] });

    const [projError, setProjError] = React.useState('');
    const [mangError, setMangError] = React.useState('');
    const [deptError, setDeptError] = React.useState('');
    const [scopeError, setScopeError] = React.useState('');
    const [techError, setTechError] = React.useState('');

    const [projectName, setprojectName] = React.useState('')
    const [projectNameGenerate, setprojectNameGenerate] = React.useState(false)

    const [managerName, setManagerName] = React.useState('')
    const [managerNameGenerate, setManagerNameGenerate] = React.useState(false)

    const [departmentName, setDepartmentName] = React.useState('')
    const [departmentNameGenerate, setDepartmentNameGenerate] = React.useState(false)

    const [scopeText, setScopeText] = React.useState('');
    const [scopeTextGenerate, setScopeTextGenerate] = React.useState(false);

    const [technicalText, setTechnicalText] = React.useState('');
    const [technicalTextGenerate, setTechnicalTextGenerate] = React.useState(false);

    const [createTara, setCreateTara] = React.useState(0)

    const [isDisabled, setIsDisabled] = React.useState(false);

    const navigate = useNavigate();

    const handleCreateTara = () => {
        navigate('/main')
        // setCreateTara(1)
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
            setArchPopupOpen(false);
            alert('Please select a PNG or PDF file.');
        }
        handleUpload(file);
    };

    const handleArchFileChange = (event) => {
        const file = event.target.files[0];
        const fileType = file.type;
        if (fileType === 'image/png') {
            // If a PNG file is selected, display it in the image tag
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileSrc(URL.createObjectURL(file));
                setFile('image')
                setPopupOpen(false);
            };
            reader.readAsDataURL(file);
        } else if (fileType === 'application/pdf') {
            setFile('pdf')
            setFileSrc(URL.createObjectURL(file));
            setPopupOpen(false);
        } else {
            // If any other file type is selected, clear the file source and type
            setFileSrc(null);
            setFile(null);
            setArchPopupOpen(false);
            alert('Please select a PNG or PDF file.');
        }
        handleUpload(file);
    };

    const handleFileChange = (event) => {
        alert("Still under Development")
    }

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
        setCreateTara(0)
        setPopupOpen(true)
    }

    const toggleOpenArchPopup = () => {
        setArchPopupOpen(true);
    }

    const toggleCloseArchPopup = () => {
        setArchPopupOpen(false);
    }

    const toggleOpenArchPic = () => {
        setShowPopup(true);
    }

    const toggleCloseArchPic = () => {
        setShowPopup(false);
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
                setArchPopupOpen(true);
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
            setIsDisabled(true)
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleAttackPath = () => {
        navigate("/attackPath")
    }

    // const handleContinue = () => {
    //     navigate('/')
    // };

    const handleContinue = () => {
        const arr = [];
        if (Array.from(processedText).length > 0) {
            processedText.forEach(function (element) {
                arr.push(element);
            });
        }

        console.log(processedText);
        console.log(arr);

        // Update dataTosend state
        setDataTosend({ data: arr });

        // Navigate to another route after the state has been updated
        navigate('/main', { state: { assetData: { data: arr } } });
    }

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

    return (
        <div className="page">
            <Stack style={{height: "100%"}}>
                <header style={{position: "fixed", top: 0, left: 0, width: "100%"}}>
                    {/* Header content goes here */}
                    <Header />
                </header>
                {/* <div className="paper"> */}
                {/* Image for the first paper */}
                {/* <img src={ecylogo} alt="Paper 1 Image" height='50%' width='50%' style={{ backgroundColor: 'black' }} /> */}
                {/* Button for the first paper */}
                {/* <button type="button" class="a-button a-button--primary" onClick={handleCreateTara}>
                <i
                    class="a-icon a-button__icon boschicon-bosch-ic-add"
                    title="create"
                ></i>
                <span class="a-button__label">Create Tara</span>
            </button> */}
                {/* </div> */}
                {/* <div className="paper">
                <img src={ecylogo} alt="Paper 1 Image" height='50%' width='50%' style={{ backgroundColor: 'black' }} />
                <div class="a-file-upload-input" style={{ marginTop: '10px' }}>
                    <label for="file-upload-input-1">
                        <i class="a-icon boschicon-bosch-ic-upload" title="upload icon"></i>
                        Upload File
                    </label>
                    <input id="file-upload-input-1" name="file upload input" type="file" accept="application/pdf,image/png,image/jpeg" />
                </div>
            </div> */}

                <Stack direction="column">

                    <center>
                        <div>
                            <div className="paper" onDrop={handleDrop} onDragOver={handleDragOver}>
                                <Stack direction="row">
                                    {uploadCompleted ? (<div class="a-file-upload-input" style={{ margin: 5 }}>
                                        <label style={{ backgroundColor: isDisabled ? "#ccc" : "#007bc0", color: isDisabled ? "#888" : "white", cursor: isDisabled ? "not-allowed" : "pointer" }}
                                            disabled={isDisabled}>
                                            <i class="a-icon boschicon-bosch-ic-add" title="upload icon"></i>
                                            Create Tara
                                        </label>
                                    </div>) : <div class="a-file-upload-input" style={{ margin: 5 }}>
                                        <label onClick={handleCreateTara} className="label-text" style={{ backgroundColor: "#007bc0", color: "white" }}>
                                            <i class="a-icon boschicon-bosch-ic-add" title="upload icon"></i>
                                            Create Tara
                                        </label>
                                    </div>}

                                    <div class="a-file-upload-input" style={{ margin: 5 }}>
                                        <label onClick={handleAttackPath} className="label-text" style={{ backgroundColor: "#007bc0", color: "white" }}>
                                            <i class="a-icon boschicon-bosch-ic-add" title="upload icon"></i>
                                            Attack Path
                                        </label>
                                    </div>

                                    {/* <img src={ecylogo} alt="Paper 1 Image" height='50%' width='50%' style={{ backgroundColor: 'black' }} /> */}
                                    <div class="a-file-upload-input" style={{ margin: 5 }} >
                                        <center>
                                            {uploadCompleted ? (<Button onClick={toggleOpenArchPopup}>Show Assets from Architecture</Button>) :
                                                <label onClick={toggleOpenPopup}>
                                                    <i class="a-icon boschicon-bosch-ic-upload" title="upload icon"></i>
                                                    Upload Tara
                                                </label>}
                                        </center>
                                    </div>

                                </Stack>
                            </div>

                        </div>

                    </center >

                    {/* {createTara === 1 && 
                (<div class="a-box -floating-shadow-s" style={{ width: "100%", height: "100%" }}>
                    <Stack direction="row">
                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                            <div class="a-text-field">
                                <label for="6">Name <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" id="6" placeholder="Enter Project Name" value={projectName} onChange={handleprojectchange} />
                                
                                {projError && <p style={{ color: 'red' }}>{projError}</p>}
                            </div>
                        </Stack>
                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                            <div class="a-text-field " style={{ marginBottom: 20 }}>
                                <label for="6">Security Manager <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" placeholder="Security Manager Name" value={managerName} onChange={handleManagerChange} />
                                {mangError && <p style={{ color: 'red' }}>{mangError}</p>}
                            </div>
                        </Stack>

                        <Stack direction="column" alignItems="center" style={{ margin: 20 }}>
                            <div class="a-text-field" style={{ marginBottom: 20 }}>
                                <label for="6">Department <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" placeholder="Enter Department" value={departmentName} onChange={handleDepartmentChange} />
                                {deptError && <p style={{ color: 'red' }}>{deptError}</p>}
                            </div>
                        </Stack>

                    </Stack>
                    <Stack direction="row">
                        <Stack direction="column" alignItems="center" style={{ margin: 20, width: "50%" }}>
                            <div class="a-text-area a-text-area--dynamic-height">
                                <label for="6">Technical Description <span style={{ color: 'red' }}>*</span></label>
                                <textarea placeholder="Enter Description Here" value={technicalText} onChange={handleTechnicalChange}></textarea>
                            </div>
                            {techError && <p style={{ color: 'red' }}>{techError}</p>}

                        </Stack>

                        <Stack direction="column" alignItems="center" style={{ margin: 20, width: "50%" }}>

                            <div class="a-text-area a-text-area--dynamic-height" >
                                <label for="6">Scope <span style={{ color: 'red' }}>*</span></label>
                                <textarea placeholder="Enter Scope Here" value={scopeText} onChange={handleScopeChange}></textarea>
                            </div>
                            {scopeError && <p style={{ color: 'red' }}>{scopeError}</p>}
                        </Stack>

                    </Stack>
                    <center><button type="button" class="a-button a-button--primary -without-icon" style={{ margin: "10px" }}><span class="a-button__label">Continue</span></button></center>
                </div>)
                } */}

                    {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
                    {
                        processingText && (
                            <div className="loading-spinner">
                                <center>
                                    <div style={{ display: "flex", alignContent: "center", alignItems: "center" }}>
                                        <Stack direction="row">
                                            <div style={{ display: "flex", alignContent: "center", alignItems: "center", marginLeft: "50px" }}>
                                                <l-line-spinner
                                                    size="40"
                                                    stroke="3"
                                                    speed="1"
                                                    color="black">
                                                </l-line-spinner>
                                                <p style={{ marginLeft: "10px" }}>Processing Architecture Diagram...</p>
                                            </div>
                                        </Stack>
                                    </div>
                                </center>
                                <center>{fileSrc && (
                                    <button class="a-button a-button--primary -without-icon" style={{ margin: "10px" }} onClick={toggleOpenArchPic}><span class="a-button__label">Open Architecture</span></button>
                                )}</center>
                                {(showPopup && fileSrc) && (
                                    <div className="popup-overlay">
                                        <div className="popup-content">
                                            <span className="close" onClick={toggleCloseArchPic}>&times;</span>
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
                                                <iframe src={fileSrc} style={{ width: '80vh', height: '80vh', marginTop: '10px' }}></iframe>
                                            )}
                                            {file === 'image' && <div className="zoom-buttons">
                                                <button onClick={handleZoomIn}>Zoom In</button>
                                                <button onClick={handleZoomOut}>Zoom Out</button>
                                            </div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }
                    {
                        (uploadCompleted && isArchPopupOpen) && (
                            <div>
                                <div class="a-box -floating-shadow-s" style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, backgroundColor: rgb(0, 0, 0, 0.5), zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="popup-content" style={{ alignItems: 'center' }}>
                                        <span className="close" onClick={toggleCloseArchPopup}>&times;</span>
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
                                        <div style={{ margin: '15px' }}>
                                            <center><button type="button" class="a-button a-button--primary -without-icon" style={{
                                                margin: "5px",
                                                borderRadius: "0.5rem",
                                                fontFamily: "BoschSans",
                                            }} onClick={handleContinue}><span className="a-button__label">Continue</span></button></center>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        (isPopupOpen) && (
                            <div>
                                <div class="a-box -floating-shadow-s" style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, backgroundColor: rgb(0, 0, 0, 0.5), zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="popup-content" style={{ alignItems: 'center' }}>
                                        <span className="close" onClick={toggleClosePopup}>&times;</span>
                                        <center><h5>Select any one of the below options</h5></center>
                                        {<Stack direction="row">
                                            {/*<div style={{ marginRight: '20px' }}>
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
                                    </div>*/}
                                            <div class="a-file-upload-input" style={{ marginTop: "10px" }}>
                                                <center>
                                                    <label onClick={handleFileChange}>
                                                        <i class="a-icon boschicon-bosch-ic-upload" title="upload icon"></i>
                                                        Upload .xlsm File
                                                    </label>
                                                    {/* <input id="file-upload-input-1" name="file upload input" type="file" onChange={handleFileChange} accept="application/pdf,image/png,image/jpeg" /> */}
                                                    <h6>Note: Upload .xlsm file</h6>
                                                </center>
                                            </div>
                                            <hr class="a-divider a-divider--vertical" />
                                            <div class="a-file-upload-input" style={{ marginTop: "10px" }}>
                                                <center>
                                                    <label for="file-upload-input-1">
                                                        <i class="a-icon boschicon-bosch-ic-upload" title="upload icon"></i>
                                                        Upload Architecture
                                                    </label>
                                                    <input id="file-upload-input-1" name="file upload input" type="file" onChange={handleArchFileChange} accept="application/pdf,image/png,image/jpeg" />
                                                    <h6>Note: Upload .png or .pdf file</h6>
                                                </center>
                                            </div>
                                        </Stack>}

                                    </div>
                                </div>
                            </div>
                        )
                    }
                </Stack >
            </Stack>
        </div >
    );
}

export default FirstPage;

// import React, { useState } from 'react';
// import Box from './Box';
// import Box1 from './Box1';

// const FirstPage = () => {

//     const [UIDir, setUIDir] = useState(0)
//     const [UIDir1, setUIDir1] = useState(0)

//     const handleUI = () => {
//         setUIDir(1)
//         setUIDir1(0)
//     }

//     const handleUI1 = () => {
//         setUIDir1(2)
//         setUIDir(0)
//     }

//     return (
//         <div >
//             <button onClick={handleUI} >
//                 New UI 1
//             </button>

//             <button onClick={handleUI1}>
//                 New UI 2
//             </button>

//             {
//                 UIDir === 1 && (<div className="container" style={{ direction: "row" }}>
//                     <div className="box-container">
//                         <Box title="Interfaces" />
//                         <Box title="Cloud" />
//                         <Box title="Databases" />
//                         <Box title="Automotive" />
//                     </div>
//                 </div>)
//             }

//             {
//                 UIDir1 === 2 && (<div className="container1" style={{ direction: "row" }}>
//                     <Box1 title="Interfaces" />
//                     <Box1 title="Cloud" />
//                     <Box1 title="Databases" />
//                     <Box1 title="Automotive" />
//                 </div>)
//             }
//         </div>
//     )
// }

// export default FirstPage;
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isExpanded1, setIsExpanded1] = useState(false);
//   const [isExpanded2, setIsExpanded2] = useState(false);
//   const [isExpanded3, setIsExpanded3] = useState(false);
//   const [isExpanded4, setIsExpanded4] = useState(false);

//   const handleBoxClick = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleBoxClick1 = () => {
//     setIsExpanded1(!isExpanded1);
//   };

//   const handleBoxClick2 = () => {
//     setIsExpanded2(!isExpanded2);
//   };

//   const handleBoxClick3 = () => {
//     setIsExpanded3(!isExpanded3);
//   };

//   const handleBoxClick4 = () => {
//     setIsExpanded4(!isExpanded4);
//   };

//   return (
//     <div className="container" >
//       <div
//         className={`box ${isExpanded ? 'expanded' : ''}`}
//         onClick={handleBoxClick}
//         style={{margin: 5}}
//       >
//         Interfaces
//       </div>
//       <div
//         className={`box ${isExpanded1 ? 'expanded' : ''}`}
//         onClick={handleBoxClick1}
//         style={{margin: 5}}
//       >
//         Interfaces 1
//       </div>
//       <div
//         className={`box ${isExpanded2 ? 'expanded' : ''}`}
//         onClick={handleBoxClick2}
//         style={{margin: 5}}
//       >
//         Interfaces 2
//       </div>
//       <div
//         className={`box ${isExpanded3 ? 'expanded' : ''}`}
//         onClick={handleBoxClick3}
//         style={{margin: 5}}
//       >
//         Interfaces 3
//       </div>
//       <div
//         className={`box ${isExpanded4 ? 'expanded' : ''}`}
//         onClick={handleBoxClick4}
//         style={{margin: 5}}
//       >
//         Interfaces 4
//       </div>
//     </div>
//   );
// }


