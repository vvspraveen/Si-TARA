// Box.js
import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Axios from "axios";

function Box({ title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [interfaces, setInterfaces] = React.useState(new Set());
  const [cloud, setCloud] = React.useState(new Set());
  const [database, setDatabase] = React.useState(new Set());
  const [application, setApplication] = React.useState(new Set());
  const [automotive, setAutomotive] = React.useState(new Set());
  const [device, setDevice] = React.useState(new Set());

  const [activeStep, setActiveStep] = React.useState(0);

  const [awsAsset, setAwsAsset] = React.useState([]);
  const [azureAsset, setAzureAsset] = React.useState([]);
  const [gcpAsset, setGcpAsset] = React.useState([]);

  const [automotiveAsset, setAutomotiveAsset] = React.useState([]);
  const [automotiveTCMAsset, setAutomotiveTCMAsset] = React.useState([]);

  const [reldatasset, setreldatasset] = React.useState([]);
  const [nreldatasset, setnreldatasset] = React.useState([]);
  const [memdatasset, setmemdatasset] = React.useState([]);

  const [webapplication, setwebapplication] = React.useState([]);
  const [mobileapplication, setmobileapplication] = React.useState([]);
  const [serverapplication, setserverapplication] = React.useState([]);


  const [interfaceasset, setInterfaceAsset] = React.useState([]);

  const [archData, setArchData] = React.useState([]);

  React.useEffect(() => {
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

  const handleFinish = () => {
    setActiveStep(5)
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


  const handleBoxClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`box ${isExpanded ? 'expanded' : ''}`} onClick={handleBoxClick}>
      {(title === "Interfaces" && isExpanded) && <span className="close">&times;</span>}
      <div className="content">
        <h2>{title}</h2>
        {
          (title === "Interfaces" && isExpanded) && (<Stack direction="column" alignItems="center" justifyContent="center">
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
          </Stack>)
        }
        <p>Click to expands</p>
      </div>
    </div>
  );
}

export default Box;
