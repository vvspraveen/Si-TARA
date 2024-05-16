import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Axios from "axios";
import Box from '@mui/material/Box';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import jwtDecode from "jwt-decode";
import {useLocation} from 'react-router-dom'

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'

import image_path from '../img/SiTaRA_Banner.png'
import TreeChart from './TreeCharts';
import Tracebility from './Tracebility1';
import Footer from './Footer';


// Packages imported by sai
import {GridRenderCellParams } from '@mui/x-data-grid';
import { useState,useRef } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Select, MenuItem,OutlinedInput ,ListItemText , Chip} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { useTheme } from '@mui/material/styles';
// ###############################


import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import Header from './Header';
import { index } from 'd3';

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

function EditAssumptionToolbar(props) {
  const { setassumption, setAssumptionModel,setassumption_count,assumption_count, state, gridApiRef } = props;
  const fileInputRef = useRef(null);
  const handleClick = () => {
    const id = 'Asm-'+[assumption_count+1];
    setassumption_count(assumption_count+1);
    setassumption((oldRows) => [...oldRows, { id, assumption: '', assumption_comment  : '', isNew: true }]);
    setAssumptionModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
    const newLastPage = Math.ceil((assumption_count + 1) / 10) - 1;
    setTimeout(() => {
      if (gridApiRef.current) {
        gridApiRef.current.setPage(newLastPage);
      }
    });
  };

  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const text = event.target.result;
          processCSV(text); // Function to process the CSV content
        };
        reader.readAsText(file);
      }
    } else {
      // Handle the case where no file was selected
      console.log('No file selected');
    }
  };


  const onUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  

  const processCSV = (csvText) => {
    const lines = csvText.split(/\r\n|\n/);
    let incorrectFormatAlertShown = false;
    console.log("FUNCTION PRESENT PROCESS CSV")
    const newAssumptions = lines.map((line, index) => {
      // Skip empty lines or headers
      if (!line || (index === 0 && line.toLowerCase().startsWith('assumption'))) {
        return null;
      }

      const columns = line.split(',');
      if (columns.length != 2) {
        if (!incorrectFormatAlertShown) {
          alert("Each line must have 2 columns only!!!");
          incorrectFormatAlertShown = true; 
        }
        console.error(`Line ${index + 1} is not formatted correctly: `, line);
        return null;
      }
      const assumption = columns[0].trim();
      const description = columns[1].trim();
      if (!assumption) {
        return null; // Skip adding this entry if muc_description is empty
      }
      return { assumption, assumption_comment: description,isNew: true, fromCSV: true };
    }).filter(Boolean); // Filter out any null entries

    // Update assumptions array here
    updateAssumptionsArray(newAssumptions);
  };

 
  const updateAssumptionsArray = (newAssumptions) => {
    setassumption((oldAssumptions) => {
      let maxExistingId = assumption_count;
      const oldAssumMap = new Map(oldAssumptions.map(assum => [assum.assumption.toLowerCase(), true]));
      const newAssumSet = new Set(); // To track unique new assumptions
  
      // Filter out new assumptions that are duplicates or already exist
      const filteredAndUniqueNewAssumptions = newAssumptions.filter(assump => {
        const assumLower = assump.assumption.toLowerCase();
        if (newAssumSet.has(assumLower) || oldAssumMap.has(assumLower)) {
          return false; // It's a duplicate or already exists, so skip it
        } else {
          newAssumSet.add(assumLower); // Mark this as seen
          return true; // It's unique and new, so include it
        }
      });
  
      const updatedAssumptions = filteredAndUniqueNewAssumptions.map(assump => {
        maxExistingId++;
        return { ...assump, id: `Asm-${maxExistingId}`, isNew: true };
      });
  
      // If no unique new assumptions were found and there were assumptions to process
      if (updatedAssumptions.length === 0 && newAssumptions.length > 0) {
        alert("All data already exists!!!");
      } else {
        setassumption_count(maxExistingId); // Update the assumption count with the new max ID
      }
  
      return [...oldAssumptions, ...updatedAssumptions];
    });
  };

  
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileUpload}
      />
      <Button
        color="secondary"
        startIcon={<CloudUploadIcon />}
        onClick={onUploadButtonClick}
      >
        Upload CSV
      </Button>
    </GridToolbarContainer>
  );
}
 
// function EditMisuseToolbar(props) {
//   const { setmisuse, setMisuseModel,setMisuse_count,misuse_count, state ,gridApiRef} = props;
 
//   const handleClick = () => {
//     const id = 'MUC-'+[misuse_count+1];
//     setMisuse_count(misuse_count+1)
//     setmisuse((oldRows) => [...oldRows,{ id, muc_description: '', muc_comment  : '', isNew: true } ]);
//     setMisuseModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
//     }));
//     const newLastPage = Math.ceil((misuse_count + 1) / 10) - 1;
//     setTimeout(() => {
//       if (gridApiRef.current) {
//         gridApiRef.current.setPage(newLastPage);
//       }
//     });
//   };
 
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }
 

function EditMisuseToolbar(props) {
  const { setmisuse, setMisuseModel,setMisuse_count,misuse_count, state ,gridApiRef} = props;
  const fileInputRef = useRef(null);

  const handleClick = () => {
    const id = 'MUC-'+[misuse_count+1];
    setMisuse_count(misuse_count+1)
    setmisuse((oldRows) => [...oldRows,{ id, muc_description: '', muc_comment  : '', isNew: true } ]);
    setMisuseModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
    const newLastPage = Math.ceil((misuse_count + 1) / 10) - 1;
    setTimeout(() => {
      if (gridApiRef.current) {
        gridApiRef.current.setPage(newLastPage);
      }
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        processCSV(csvText);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (csvText) => {
    console.log("Function Present in CSV")
    const lines = csvText.split(/\r\n|\n/);
    let incorrectFormatAlertShown = false;
    const newMisuses = lines.map((line, index) => {
      if (!line || (index === 0 && line.toLowerCase().startsWith('muc_description'))) {
        return null;
      }
      
      const columns = line.split(',');
      if (columns.length != 2) {
        if (!incorrectFormatAlertShown) {
          alert("Each line must have 2 columns only!!!");
          incorrectFormatAlertShown = true;
          return false;
        }
        console.error(`Line ${index + 1} is not formatted correctly: `, line);
        return null;
      }
      const muc_description = columns[0].trim();
      const muc_comment = columns[1].trim();
      if(!muc_description){
        return null;
      }
      return { muc_description, muc_comment, isNew: true, fromCSV: true };
    }).filter(item => item !== null);
  
    if (newMisuses.includes(false)) {
      // If the flag `false` is found, it means the alert was shown, so we stop the process
      return;
    }

  
    updateMisuseArray(newMisuses);
  };
  

  const updateMisuseArray = (newMisuses) => {
    setmisuse(oldMisuses => {
      let maxId = misuse_count;
      // Create a map to track descriptions in lowercase
      const descriptionMap = new Map(oldMisuses.map(misuse => [misuse.muc_description.toLowerCase(), true]));
      let allExists = newMisuses.length > 0; // Assume all exists until proven otherwise
  
      const updatedMisuses = newMisuses.filter(misuse => {
        // Check if the description in lowercase is already tracked
        const descLower = misuse.muc_description.toLowerCase();
        if (!descriptionMap.has(descLower)) {
          descriptionMap.set(descLower, true); // Mark this description as seen
          allExists = false; // At least one new misuse case does not exist, so allExists is false
          return true; // Include this misuse case since it's not a duplicate
        }
        return false; // Exclude this misuse case since it's a duplicate
      }).map(misuse => {
        maxId++;
        return { ...misuse, id: `MUC-${maxId}`, isNew: true };
      });
  
      if (allExists) {
        alert("All misuse cases already exist.");
      }
  
      // Update the misuseCount to reflect the possibly adjusted number of items
      setMisuse_count(maxId);
      return [...oldMisuses, ...updatedMisuses];
    });
  };
  
  
  

  const onUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add misuse case
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleFileUpload}
      />
      <Button
        color="secondary"
        startIcon={<CloudUploadIcon />}
        onClick={onUploadButtonClick}
      >
        Upload CSV
      </Button>
    </GridToolbarContainer>
  );
}



// function EditDamageScenarioToolbar(props) {
//   const { setDamageScenario, setDamageScenarioModel,setDamage_count,damage_count, state ,gridApiRef} = props;
 
//   const handleClick = () => {
//     const id = 'DS-'+[damage_count+1];
//     setDamage_count(damage_count+1)
//     setDamageScenario((oldRows) => [...oldRows, { id, damageScenario: '',consequence  : '',consequence_DS:'',consequence_reasoning:'', isNew: true }]);
//     setDamageScenarioModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'damageScenario' },
//     }));
//     const newLastPage = Math.ceil((damage_count + 1) / 10) - 1;
//     setTimeout(() => {
//       if (gridApiRef.current) {
//         gridApiRef.current.setPage(newLastPage);
//       }
//     });
//   };
 
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }

// function EditSecGoalsToolbar(props) {
//   const { setSecGoals, setSecGoalsModel, state } = props;

//   const handleClick = () => {
//     const id = 'A-'+state;
//     setSecGoals((oldRows) => [...oldRows, {id, Asset_description: '',Objective: '',objective_description:'', isNew: true }]);
//     setSecGoalsModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }



// function EditDamageScenarioToolbar(props) {
//   const { setDamageScenario, setDamageScenarioModel,setDamage_count,damage_count, state ,gridApiRef} = props;
//   const fileInputRef = useRef(null);

//   const handleClick = () => {
//         const id = 'DS-'+[damage_count+1];
//         setDamage_count(damage_count+1)
//         setDamageScenario((oldRows) => [...oldRows, { id, damage_scenario: '',consequence  : '',consequence_DS:'',consequence_reasoning:'', isNew: true }]);
//         setDamageScenarioModel((oldModel) => ({
//           ...oldModel,
//           [id]: { mode: GridRowModes.Edit, fieldToFocus: 'damage_scenario' },
//         }));
//         const newLastPage = Math.ceil((damage_count + 1) / 10) - 1;
//         setTimeout(() => {
//           if (gridApiRef.current) {
//             gridApiRef.current.setPage(newLastPage);
//           }
//         });
//       };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const csvText = e.target.result;
//         console.log(csvText,"CSV data")
//         processCSV(csvText);
//       };
//       reader.readAsText(file);
//     }
//   };

//   const processCSV = (csvText) => {
//     const lines = csvText.split(/\r\n|\n/);
//     const newDamageScenarios = lines.map((line, index) => {
//       if (!line || (index === 0 && line.toLowerCase().startsWith('damage_scenario'))) {
//         return null;
//       }
//       const columns = line.split(',');
//       if (columns.length != 4) {
//         alert("4 lines wanted")
//         console.error(`Line ${index + 1} is not formatted correctly: `, line);
//         return null;
//       }
  
//       // const [damageScenario, consequence, reasonDS, reasonConsequence] = columns.map(field => field.trim());
//       const damageScenario = columns[0].trim();
//       const consequence = columns[1].trim();
//       const reasonDS = columns[2].trim();
//       const reasonConsequence = columns[3].trim();
//       console.log(damageScenario,consequence,reasonDS,reasonConsequence,"REQUIRED DATA")
//       return { damageScenario, consequence, reasonDS, reasonConsequence };
//     }).filter(Boolean); // Filter out any null entries
  
//     updateDamageScenarioArray(newDamageScenarios);
//   };
  
  
  
  

//   const updateDamageScenarioArray = (newDamageScenarios) => {
//     setDamageScenario(oldDamageScenarios => {
//       let maxId = damage_count;
//       console.log(maxId,"ID's")
//       const existingTitles = new Map(oldDamageScenarios.map(d => [d.damage_scenario.toLowerCase(), true]));
//       const filteredNewDamageScenarios = newDamageScenarios.filter(d => {
//         const titleLower = d.damageScenario.toLowerCase();
//         if (!existingTitles.has(titleLower)) {
//           existingTitles.set(titleLower, true); // Mark this description as seen
//           return true; // Include this misuse case since it's not a duplicate
//         }
//         return false;
//       }).map(d=>{

//         maxId++;
//         console.log(maxId,"IDDD")
//         // console.log(...d,"DATA")
//         return{...d,id: `DS-${maxId}`,isNew:true};

//       });
  
//       setDamage_count(maxId); // Make sure to use the correct function to update the count
//       console.log(filteredNewDamageScenarios,"SDSD")
//       return [...oldDamageScenarios, ...filteredNewDamageScenarios];
//     });
//   };
  
  

//   const onUploadButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add Damage Scenario
//       </Button>
//       <input
//         type="file"
//         style={{ display: 'none' }}
//         ref={fileInputRef}
//         accept=".csv"
//         onChange={handleFileUpload}
//       />
//       <Button
//         color="secondary"
//         startIcon={<CloudUploadIcon />}
//         onClick={onUploadButtonClick}
//       >
//         Upload CSV
//       </Button>
//     </GridToolbarContainer>
//   );
// }



  function EditDamageScenarioToolbar(props) {
    const { setDamageScenario, setDamageScenarioModel, setDamage_count, damage_count, state, gridApiRef } = props;
    const fileInputRef = useRef(null);

    const handleClick = () => {
      const id = `DS-${damage_count + 1}`;
      setDamage_count(damage_count + 1);
      setDamageScenario((oldRows) => [...oldRows, { id, damage_scenario: '', consequence: '', consequence_DS: '', consequence_reasoning: '', isNew: true }]);
      setDamageScenarioModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'damage_scenario' },
      }));
      const newLastPage = Math.ceil((damage_count + 1) / 10) - 1;
      setTimeout(() => {
        if (gridApiRef.current) {
          gridApiRef.current.setPage(newLastPage);
        }
      });
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvText = e.target.result;
          processCSV(csvText);
        };
        reader.readAsText(file);
      }
    };

    const processCSV = (csvText) => {
      const lines = csvText.split(/\r\n|\n/);
      let incorrectFormatAlertShown = false; // Flag to track if the alert has been shown
    
      const newDamageScenarios = lines.map((line, index) => {
        console.log(line.toLowerCase(),"Looking data")
        if (!line || (index === 0 && line.toLowerCase().includes('damage'))) {
          return null;
        }
        const columns = line.split(',');
        if (columns.length !== 4) {
          if (!incorrectFormatAlertShown) {
            alert("Each line must have 4 columns only!!!");
            incorrectFormatAlertShown = true; // Set the flag to true after showing the alert
          }
          console.error(`Line ${index + 1} is not formatted correctly: `, line);
          return null;
        }
    
        const damage_scenario = columns[0].trim();
        let consequence = columns[1].trim();
        // Assume correctConsequenceSpelling is a function defined somewhere to correct spelling
        consequence = correctConsequenceSpelling(consequence); 
        const consequence_DS = columns[2].trim();
        const consequence_reasoning = columns[3].trim();

        if (!damage_scenario && !consequence) {
          return null; // Skip adding this entry if muc_description is empty
        }
        
        return { damage_scenario, consequence, consequence_DS, consequence_reasoning, isNew: true, fromCSV: true };
      }).filter(Boolean);
    
      updateDamageScenarioArray(newDamageScenarios);
    };
    
    
    // Function to correct the spelling of consequence based on the given criteria
    const correctConsequenceSpelling = (consequence) => {
      const firstChar = consequence.charAt(0).toLowerCase();
      const lastChar = consequence.charAt(consequence.length - 1).toLowerCase();
    
      if (firstChar === 's') {
        if (lastChar === 's') {
          return 'Serious';
        } else if (lastChar === 'e') {
          return 'Severe';
        }
      } else if (firstChar === 'm') {
        return 'Moderate';
      } else if (firstChar === 'n') {
        return 'Negligible';
      }
    
      // If none of the criteria match, return the original string
      return consequence;
    };
    

    const updateDamageScenarioArray = (newDamageScenarios) => {
      setDamageScenario(oldDamageScenarios => {
        let maxId = damage_count;
        const existingTitles = new Map(oldDamageScenarios.map(d => [d.damage_scenario.toLowerCase(), true]));
        let allExist = newDamageScenarios.length > 0; // Start with the assumption that all new scenarios exist.
    
        const filteredNewDamageScenarios = newDamageScenarios.filter(d => {
          const titleLower = d.damage_scenario.toLowerCase();
          if (!existingTitles.has(titleLower)) {
            existingTitles.set(titleLower, true); // This is a new and unique scenario
            allExist = false; // At least one new scenario does not exist, set flag to false
            return true;
          }
          return false; // This scenario already exists, so it's filtered out
        }).map(d => {
          maxId++;
          return { ...d, id: `DS-${maxId}` ,isNew:true};
        });
    
        if (allExist) {
          // If after filtering, no new scenarios were added and there were items to check, show alert.
          alert("All damage scenarios already exist.");
        }
    
        setDamage_count(maxId); // Update the count with the new max ID
        return [...oldDamageScenarios, ...filteredNewDamageScenarios];
      });
    };
    

    const onUploadButtonClick = () => {
      fileInputRef.current.click();
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add Damage Scenario
        </Button>
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileUpload}
        />
        <Button
          color="secondary"
          startIcon={<CloudUploadIcon />}
          onClick={onUploadButtonClick}
        >
          Upload CSV
        </Button>
      </GridToolbarContainer>
    );
  }


// function EditAssetAdditionToolbar(props) {
//   const { setassetaddition, setAssetAdditionModel,setassetaddition_count,assetaddition_count, state ,gridApiRef} = props;
 
//   const handleClick = () => {
//     const id = 'AA-'+[assetaddition_count+1];
//     setassetaddition_count(assetaddition_count+1);
//     setassetaddition((oldRows) => [...oldRows, {id, Asset_description: '',Objective: '',objective_description:'', isNew: true }]);
//     setAssetAdditionModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'Asset_description' },
//     }));

//     const newLastPage = Math.ceil((assetaddition_count + 1) / 10) - 1;
//     setTimeout(() => {
//       if (gridApiRef.current) {
//         gridApiRef.current.setPage(newLastPage);
//       }
//     });
//   };
 
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }

function EditAssetAdditionToolbar(props) {
  const {
    showToast,
    ThreatDSs,
    SecGoals,
    setThreatDSs,
    setSecGoals,
    setassetaddition,
    setAssetAdditionModel,
    setassetaddition_count,
    assetaddition_count,
    gridApiRef
  } = props;
  const fileInputRef = useRef(null);

  const handleClick = () => {
    const id = 'AA-' + (assetaddition_count + 1);
    setassetaddition_count(assetaddition_count + 1);
    setassetaddition((oldRows) => [...oldRows, {id, Asset_description: '',Objective: '',objective_description:'', isNew: true }]);
    setAssetAdditionModel(oldModel => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'Asset_description' },
    }));

    const newLastPage = Math.ceil((assetaddition_count + 1) / 10) - 1;
    setTimeout(() => {
      if (gridApiRef.current) {
        gridApiRef.current.setPage(newLastPage);
      }
    }, 100);
  };



  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        processCSV(csvText);
      };
      reader.readAsText(file);
    }
  };



  const processCSV = (csvText) => {
    const lines = csvText.split(/\r\n|\n/);
    let incorrectFormatAlertShown = false;
    let combinedAssetAdditions = [];
  
    lines.forEach((line, index) => {
      if (!line.trim() || index === 0) return; // Skip header and empty lines
  
      // Splitting by commas outside of quotes
      const columns = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!columns || columns.length !== 3) {
        if (!incorrectFormatAlertShown) {
          alert("Each line must have exactly 3 columns.");
          incorrectFormatAlertShown = true;
        }
        console.error(`Incorrect format at line ${index + 1}: ${line}`);
        return;
      }
  
      let [Asset_description, rawObjectives, objective_description] = columns.map(col => col.replace(/^"|"$/g, '').trim());
      // Assuming objectives are split by commas and enclosed in quotes
      const objectives = rawObjectives.split(',');
  
      objectives.forEach(objective => {
        const correctedObjective = correctObjectiveSpelling(objective.trim());
        if(Asset_description!=""&&(correctedObjective!="Unknown"||correctedObjective!="")){
          combinedAssetAdditions.push({
            Asset_description,
            Objective: correctedObjective,
            objective_description,
            isNew: true,
            fromCSV: true
          });
        }
      });
    });
  
    if (combinedAssetAdditions.length) {
      updateAssetAdditionArray(combinedAssetAdditions);
    }
  };
  
  
  

  const correctObjectiveSpelling = (obj) => {
    const firstChar = obj.charAt(0).toLowerCase();
  
    if (firstChar === 'c') {
      return 'Confidentiality'
    } else if (firstChar === 'i') {
      return 'Integrity';
    } else if (firstChar === 'a') {
      return 'Availability';
    }
  
    // If none of the criteria match, return the original string
    return 'Unknown';
  };

  const updateAssetAdditionArray = (newAssetAdditions) => {
    setassetaddition(oldAssetAdditions => {
      let maxId = assetaddition_count;
      // Track combinations of Asset_description and objective
      const uniqueCombinationMap = new Map(
        oldAssetAdditions.map(item => [`${item.Asset_description.toLowerCase()}|${item.Objective.toLowerCase()}`, true])
      );
      let allExist = newAssetAdditions.length > 0;
  
      const updatedAssetAdditions = newAssetAdditions.filter(item => {
        // Combine Asset_description and objective for a unique identifier
        const combination = `${item.Asset_description.toLowerCase()}|${item.Objective.toLowerCase()}`;
        if (!uniqueCombinationMap.has(combination)) {
          uniqueCombinationMap.set(combination, true);
          allExist = false; // At least one new combination does not exist, so allExist is false
          return true; // This is a new, unique combination
        }
        return false; // This combination already exists, so it's a duplicate
      }).map(item => {
        maxId++;
        return { ...item, id: `AA-${maxId}` ,isNew:true};
      });
  
      if (allExist) {
        alert("All asset additions with their respective objectives already exist.");
      }
  
      setassetaddition_count(maxId);

     console.log(oldAssetAdditions, "The old assets are as followss")
     console.log(updatedAssetAdditions, "The updated assets are as followss")


      
     updatedAssetAdditions.forEach(newAsset => { 
      const idNumber2 = parseInt(newAsset.id.split("-")[1]);
      if (newAsset) {
          const newSecGoal = {
              id: `A-${idNumber2}`,
              Asset_description: newAsset.Asset_description,
              Objective: newAsset.Objective,
              objective_description: newAsset.objective_description,
          };


          if (!newAsset.Asset_description || newAsset.Asset_description.trim() === '') {
            return false; // Returning false to prevent the grid from updating the row
          }
         
          // Check if the 'Objective' field is empty
          if (!newAsset.Objective || newAsset.Objective.trim() === '') {
            return false; // Returning false to prevent the grid from updating the row
          }
       
          // Check if the 'objective_description' field is empty
          if (!newAsset.objective_description || newAsset.objective_description.trim() === '') {
            return false; // Returning false to prevent the grid from updating the row
          }

          setSecGoals(prevSecGoals => [...prevSecGoals, newSecGoal]);

          var newthreatvalue;

          if(newAsset.Objective == "Confidentiality"){
            newthreatvalue = "Extraction of "+newAsset.Asset_description;
          }
          else if(newAsset.Objective == "Integrity"){
            newthreatvalue = "Manipulation of "+newAsset.Asset_description;
          }
          else if(newAsset.Objective == "Availability"){
            newthreatvalue = "Blocking "+newAsset.Asset_description;
          }
          else{
            newthreatvalue = "Unknown";
          }

          const newthreatDSs = {
              id:`Th-${idNumber2}`,
              Threat: newthreatvalue,
              affected_security_goal: newAsset.Objective+" of "+newAsset.Asset_description,
              Did: ""
          };

          setThreatDSs(prevThreatDSs => [...prevThreatDSs, newthreatDSs]);

        }
      });
  
      
      return [...oldAssetAdditions, ...updatedAssetAdditions];
    });
    alert("Small Reminder to Map threats and Damage Scenario's in ThreatDSs and Write Attack potentials in ThreatEvaluation_AP field")
    showToast("Assets,SecGoals,Threats", '11.5px', '11.5px',"U");
      
  };
  

  const onUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Asset
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleFileUpload}
      />
      <Button
        color="secondary"
        startIcon={<CloudUploadIcon />}
        onClick={onUploadButtonClick}
      >
        Upload CSV
      </Button>
    </GridToolbarContainer>
  );
}



// function EditThreatEvaluationAPToolbar(props) {
//   const { setThreatEvaluation_AP, setThreatEvaluation_APModel,setThreatEvaluation_AP_count,ThreatEvaluation_AP_count, state } = props;
 
//   const handleClick = () => {
//     const id = 'Th-'+[ThreatEvaluation_AP_count+1];
//     setThreatEvaluation_AP_count(ThreatEvaluation_AP_count+1);
//     setThreatEvaluation_AP((oldRows) => [...oldRows, {id, Threat: '', isNew: true }]);
//     setThreatEvaluation_APModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: 'Threat' },
//     }));
//   };
 
//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }


function EditSecurityNeedToolbar(props) {
  const { setSecurityNeeds, setSecurityNeedsModel,setSecurityNeed_count,SecurityNeed_count, state ,gridApiRef} = props;
 
  const handleClick = () => {
    const id = 'SN-R-'+[SecurityNeed_count+1];
    setSecurityNeed_count(SecurityNeed_count+1);
    setSecurityNeeds((oldRows) => [...oldRows, {id,security_description_threat:'' ,Threat: '',Threat_T:'',affected_security_goal:'',Did:'',Threat_id:'',isNew: true }]);
    setSecurityNeedsModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'security_description_threat' },
    }));
    const newLastPage = Math.ceil((SecurityNeed_count + 1) / 10) - 1;
    setTimeout(() => {
      if (gridApiRef.current) {
        gridApiRef.current.setPage(newLastPage);
      }
    }, 100);
  };

 
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function findMinimumSumObjects(objects) {
  // Create an object to store the minimum sum object for each unique combination of Name and Security_properties
  const minSumObjects = {};
  var count=1
  // Iterate through the array of objects
  objects.forEach(obj => {
      const key = obj.security_properties + ' of ' + obj.name     ;
      const sum = parseInt(obj.access,10) + parseInt(obj.equipment,10) + parseInt(obj.expertise,10) + parseInt(obj.knowledge,10) + parseInt(obj.time,10);

      // If the key doesn't exist or the current sum is smaller than the existing sum, update the object
      if (!minSumObjects[key] || sum < minSumObjects[key].sum) {
        minSumObjects[key] = {
          id: 'T'+[count],
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
    { min: 20, max: 24, attackPotential: 'Enhanced Basic'},
    {min:25, max:Infinity, attackPotential:'Basic'}
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
    obj['Attack_Potential'] = attackPotential;
  });

  return minSumObjectsArray;
}

function concatenateArrays(dataObject) {
  let concatenatedArray = [];
  for (let key in dataObject) {
      concatenatedArray = concatenatedArray.concat(dataObject[key]);
  }
  return concatenatedArray;
}

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

function EditData_AP() {

  
  const navigate = useNavigate();

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
  const location = useLocation()
  const {data}=location.state || {}




  const childRef = useRef(null);
  const gridApiRef = useRef(null);

  const [value, setValue] = React.useState(0);
  const [assumption,setassumption]=React.useState([])
  const [assumption_count,setassumption_count]=React.useState(0)
  const [Assumption_Model,setAssumptionModel]=React.useState({})
  const [misuse,setmisuse]=React.useState([])
  const [misuse_count, setMisuse_count]=React.useState(0)
  const [Misuse_Model,setMisuseModel]=React.useState({})
  const [damageScenario,setDamageScenario]=React.useState([])
  const [damage_count,setDamage_count]=React.useState(0)
  const [DamageScenario_Model,setDamageScenarioModel]=React.useState({})

  
  // const [SecControls,setSecControls]=React.useState([])
  // const [SecControls_count,setSecControls_count]=React.useState(0)
  // const [SecControls_Model,setSecControls_Model]=React.useState({})
  const [attackTreesData,setattackTreesData]=useState([])
  const [dataOmkar,setData]=useState([])





  const [SecGoals,setSecGoals]=React.useState([])
  const [SecGoals_count,setSecGoals_count]=React.useState(0)
  const [SecGoals_Model,setSecGoalsModel]=React.useState({})
  const [Threat,setThreat]=React.useState([])
  const [Threat_Model, setThreatModel]=React.useState({})
  const [ThreatDSs,setThreatDSs]=React.useState([])
  const [ThreatDSs_Model,setThreatDSsModel]=React.useState({})
  const [ThreatEvaluation_AP,setThreatEvaluation_AP]=React.useState([])
  const [ThreatEvaluation_AP_Model,setThreatEvaluation_APModel]=React.useState({})
  const [RiskAssessment,setRiskAssessment]=React.useState([])
  const [RiskAssesment_Model,setRiskAssesmentModel]=React.useState({})
  const [SecurityNeeds, setSecurityNeeds]=React.useState([])
  const [SecurityNeeds_Model,setSecurityNeedsModel]=React.useState({})
  const [threatDamageAssociations, setThreatDamageAssociations] = useState([]);
  const [updatedAssociations, setUpdatedAssociations] = useState([]);
  const [Tracebility_data, setTracebility_data]=useState({})
  const [pdfGenerationProgress, setPdfGenerationProgress] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [message, setMessage] = useState("");
  const [assets,setassets]=useState(data["data"].map(item=>item.toLowerCase()))
  const [projectName,setprojectName]=useState(data["projectname"])
  const [ManagerName,setManagerName]=useState(data["managername"])
  const [userEmail, setUserEmail] = useState("")


  const [ThreatEvaluation_AP_count,setThreatEvaluation_AP_count]=React.useState(0)
  const [SecurityNeed_count,setSecurityNeed_count]=React.useState(0)
  const [ThreatEvaluation_AP_History,setThreatEvaluation_AP_History]=React.useState(0)
  const [initialDataLoaded, setInitialDataLoaded] = useState(true);


  // const [SecurityControls_AP_History,setSecurityControls_AP_History] = React.useState(0)
  const [initialDataLoadedd,setInitialDataLoadedd] = useState(true);


  const [AssetsList, setAssetsList] = useState(true);

 
  const [assetaddition,setassetaddition]=React.useState([])
  const [assetaddition_count,setassetaddition_count]=React.useState(0)
  const [AssetAddition_Model,setAssetAdditionModel]=React.useState({})

  const [newlyModifiedAssetIds, setNewlyModifiedAssetIds] = useState([]);

  const [newlyDeletedAssetIds, setnewlyDeletedAssetIds] = useState([]); 


  const [newlyAddedAssetIds, setNewlyAddedAssetIds] = useState([]);





  function removeUndefinedParent(obj) {
    Object.keys(obj).forEach(key => {
      obj[key].forEach(item => {
        if (item.parent === undefined || item.parent === null) {
          delete item.parent;
        }
      });
    });
  }

  const convertToTreeDataFormat1 = (dataArray) => {
    const treeData = [];
  
    // Group data by name (ensuring each object is grouped separately)
    const groupedData = dataArray.reduce((acc, item) => {
      const key = item.name; // Use the original "name" value as key
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      acc[key].push(item);
      return acc;
    }, {});
  
    // Process each group
    const moduleArrays = Object.keys(groupedData).map((key) => {
      const currentGroup = groupedData[key];
  
      const currentTree = {
        name: key, // Use the original "name" value as name
        data: [],
      };
  
      currentGroup.forEach((item) => {
        const getNode = (text, parent, color) => {
          const existingNode = currentTree.data.find((node) => node.text === text && node.parent === parent);
          if (existingNode) {
            return existingNode.key;
          }
  
          const newNode = { key: currentTree.data.length, parent, text, color };
          currentTree.data.push(newNode);
          return newNode.key;
        };
  
        const getLeafNode = (access, equipment, expertise, knowledge, time, parent, color) => {
          const existingNode = currentTree.data.find((node) => node.access === access && node.expertise === expertise && node.equipment === equipment && node.knowledge === knowledge && node.time === time && node.parent === parent);
          if (existingNode) {
            return existingNode.key;
          }
  
          const newNode = { key: currentTree.data.length, parent, access, equipment, expertise, knowledge, time, color };
          currentTree.data.push(newNode);
          return newNode.key;
        }
  
        const nameNode = getNode(item.name, null, '#F3C8C5');
        const securityNode = getNode(item.security_properties, nameNode, ' #F0D096');
        const attackNode = getNode(item.attack, securityNode, '#9AD5DF');
        getLeafNode(item.access, item.equipment, item.expertise, item.knowledge, item.time, attackNode, '#59AFBA');
      });
  
      treeData.push(currentTree);
      return currentTree.data;
    });
  
    // Flatten the resulting arrays
    const flattenedData = treeData.flatMap((tree) => tree.data);
  
    // Remove the parent: null pair only for nodes with key: 0
    const finalData = flattenedData.map((node) => {
      if (node.key === 0) {
        return { key: node.key, text: node.text, color: node.color, category: "Type" };
      }
      return { ...node, category: "LeafNode" };
    });
  
    // Separate arrays for each module
    const moduleData = Object.fromEntries(Object.keys(groupedData).map((key, index) => {
      const moduleArray = moduleArrays[index].map((node) => {
        if (node.key === 0 ) {
          return { key: node.key, text: node.text, color: node.color, category: "HeadNode", logicType: "OR" };
        }
        if ('access' in node) {
          return { ...node, category: "LeafNode", name: "AttackName" };
        }
        return { ...node, category: "LogicNode", logicType: "OR" }
      });
      return [key.toLowerCase().trim(), moduleArray];
    }));
  
    return moduleData;
  };




  const showToast = (messageWord, fontSize = '15px', paddingSize = '15px',action) => {
    var msg
    if(action=="U"){
      msg="updated"
    }
    else if(action=="D"){
      msg="deleted"
    }
    else if(action=="UP"){
      msg="Uploaded"
    }
    toast(`${messageWord} ${msg} Successfully!!🎉`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        fontSize: fontSize,
        padding: paddingSize,
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkTokenExpiration(token);
      setUserEmail(jwtDecode(token).email)
      const interval = setInterval(() => {
        checkTokenExpiration(token)
      }, 20000);
      return () => {
        clearInterval(interval)
      }
    } else {
      handleLogout()
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate("/");
  }

  const checkTokenExpiration = (token) => {
    try {
      const { exp } = jwtDecode(token)
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (exp < currentTime) {
        // Token has expired, log the user out
        handleLogout();
      }
    } catch (error) {
      console.error('Error decoding or checking token:', error);
    }
  };

  function updateParentValues(objects) {
    // Deep clone objects to avoid mutating the original data
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Recursively update object values based on children and logicType
    function updateObject(currentObj, clonedObjects) {
        let children = clonedObjects.filter(obj => obj.parent === currentObj.key);

        // Base case: If no children, nothing to update
        if (children.length === 0) {
            return;
        }

        // Update all child objects first
        children.forEach(child => {
            updateObject(child, clonedObjects);
        });

        // Determine new values for current object based on logicType
        if (currentObj.logicType === 'OR') {
            // For OR logic, calculate the sum of access, equipment, expertise, time, and knowledge for each child
            const properties = ['access', 'equipment', 'expertise', 'knowledge', 'time'];
            let minSum = Infinity;
            let minChildIndex = -1;

            children.forEach((child, index) => {
                let sum = properties.reduce((acc, prop) => acc + parseInt(child[prop], 10), 0);
                if (sum < minSum) {
                    minSum = sum;
                    minChildIndex = index;
                }
            });

            // Update current object with values from child with the minimum sum
            properties.forEach(prop => {
                currentObj[prop] = children[minChildIndex][prop];
            });
        } else if (currentObj.logicType === 'AND') {
            // For AND logic, sum the values of all children
            const properties = ['access', 'equipment', 'expertise', 'knowledge', 'time'];
            properties.forEach(prop => {
                let values = children.map(child => parseInt(child[prop], 10));
                let newValue = Math.max(...values);
                currentObj[prop] = newValue.toString();
            });
        }
    }

    // Work with a cloned version of the original objects
    let clonedObjects = objects.map(obj => clone(obj));

    // Find and update objects without a 'parent' property
    clonedObjects.filter(obj => obj.parent === undefined).forEach(rootObj => {
        updateObject(rootObj, clonedObjects);
    });

    return clonedObjects;
}


  useEffect(()=>{

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
          "affected_security_goal",
          "damage_scenario_copy",
          "security_description_assumption",
          "security_needed_assumption",
          "security_need_bosch",
          "requirement",
          "security_description_threat",
          "Threat_T"
      ];


      axios.post(`https://api.si-tara.com/EditDataNew`,{'asset_list':assets}).then(response=>{
        
        const data=response.data
        const assum=convertToJSON(data, keys, ["assumption", "assumption_comment"],"id","Asm-",["assumption"])
        setassumption(assum)
        setassumption_count(assum.length)

        const asset=convertToJSON(data, keys, ["Asset_description", "Objective","objective_description"],"id","AA-",["Asset_description", "Objective"])
        setassetaddition(asset)
        setassetaddition_count(asset.length)
        
        const misuse=convertToJSON(data, keys, ["muc_description", "muc_comment"],"id","MUC-",["muc_description"])
        setmisuse(misuse)
        setMisuse_count(misuse.length)

        const damage_scenario=convertToJSON(data, keys, ["damage_scenario", "consequence","consequence_DS","consequence_reasoning"],"id","DS-",["damage_scenario"])
      
        setDamageScenario(damage_scenario)
        setDamage_count(damage_scenario.length)

        const secgoals=convertToJSON(data, keys, ["Asset_description", "Objective","objective_description"],"id","A-",["Asset_description","Objective"])
        setSecGoals(secgoals)
        setSecGoals_count(secgoals.length)

        const Threats=convertToJSON(data, keys, ["Threat", "affected_security_goal","damage_scenario_copy"],"id","Th-",["Threat"])

        const combined_damage_Threat=joinArrays3(Threats,damage_scenario,"damage_scenario_copy","damage_scenario","Did","id")

        setThreatDSs(joinArrays3(Threats,damage_scenario,"damage_scenario_copy","damage_scenario","Did","id"))

        console.log(Threats,'The Threats are as you see ')

        const security_ass=convertToJSON(data, keys, ["Threat_T", "security_description_threat"],"id","SN-R-",["security_description_threat","Threat_T"])

       setSecurityNeeds(joinArrays4(security_ass,Threats,"Threat_T","Threat","id","Threat_id"))

        setThreatEvaluation_AP(convertToJSON(data, keys, ["Threat"],"id","Th-",["Threat"]))

        console.log(InitialtransformToRiskAssessmentFormat(combined_damage_Threat),"This is the required format for risk")
        setThreatDamageAssociations(InitialtransformToRiskAssessmentFormat(combined_damage_Threat))
        setUpdatedAssociations(InitialtransformToRiskAssessmentFormat(combined_damage_Threat))       




      })

      axios.post(`https://api.si-tara.com/attackTrees`,{'attacktrees_list':assets}).then(response=>{
        console.log('attack trees response',response.data)
        setattackTreesData(response.data)
        var moduleDataMain={}
        for (const key in response.data) {
          // Outputs: key1, key2, key3
          
          var arrayOfObjects = convertToTreeDataFormat1(response.data[key]);
          console.log('convertdatatoarray',convertToTreeDataFormat1(response.data[key]))
          moduleDataMain={...moduleDataMain,...arrayOfObjects}
          // const combinedResult = combineArraysOfObjects(arrayOfObjects);

          // moduleDataMain[key]=combinedResult
        }
        removeUndefinedParent(moduleDataMain);
        Object.entries(moduleDataMain).forEach(([key, datamain]) => {
          moduleDataMain[key]=updateParentValues(datamain)
        })
        
        setData(moduleDataMain)
      })






  },[])
  // console.log(SecurityNeeds,"SecNeeds Data##############W")






  
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//               // Security Goals with Security Controls Data Fetching

  

//           //     const [ranOnce, setRanOnce] = useState(false);


//           useEffect(()=>{

//             const keys = [
//               "asset",
//               "security_goal",
//               "security_control",
//               "security_control_description",
//               "security_description_threat",
//               "security_description_threat_copy",
//               "security_ass"
//           ];
          
          
          
//           axios.post(`http://localhost:5000/EditDataSecControl`,{'asset_list':assets}).then(response=>{
            
//             const data=response.data
          
//             console.log(data,"THe seccontrols data")
          
          
          
          
          
            
//             const seccontrols=convertToJSON(data,keys,["security_control","security_control_description","security_goal"],"id","S-",["security_control"])
          
//           //    const combined_securityneed_seccontrols=joinArraysSC(seccontrols,SecurityNeeds,"security_goal","security_description_threat","Sid","id")
          
          
//           if(SecurityControls_AP_History){
//           setSecControls(oldsecuritycontrolsData(joinArraysSC(seccontrols,SecurityNeeds,"security_goal","security_description_threat","Sid","id"),SecurityControls_AP_History))
          
//           console.log("history 1st time")
          
//           }
//           else{
//           setSecControls(joinArraysSC(seccontrols,SecurityNeeds,"security_goal","security_description_threat","Sid","id"))
          
//           console.log("initialdataloadedd is set to false")
//           }
          
          
          
//               console.log("Outside seccontrols")
          
//            //  if(initialDataLoadedd)
//            //  setSecControls(joinArraysSC(seccontrols,SecurityNeeds,"security_goal","security_description_threat","Sid","id"))
           
//           // setSecControls(prevSecControls => [...prevSecControls, ...joinArraysSC(seccontrols, SecurityNeeds, "security_goal", "security_description_threat", "Sid", "id")]);
//           // setSecControls(seccontrols)
            
//           // const uniqueSecControls = SecControls.filter((control, index, self) =>
//           //     index === self.findIndex((c) => (
//           //       c.id === control.id
//           //     ))
//           //   );
          
//           //         // Remove duplicates from SecControls after setting the state
//           // setSecControls(uniqueSecControls);
          
          
          
          
          
          
//           setSecControls_count(SecControls.length)
          
          
          
          
//             console.log(ThreatDSs, "The threatdsss are as follows")
//             console.log(SecurityNeeds,"The security Needs are as follows")
//             console.log(seccontrols,"The seccontrols are as followss")
          
//           })
          
//           },[SecurityNeeds])




          // useEffect(() =>{

            
          //       // Assuming SecControls is an array of objects with an id property

          //       if (SecControls.length > 0) {
          //         // Filter out unique records based on their id property
          //         const uniqueSecControls = SecControls.filter((control, index, self) =>
          //         index === self.findIndex(c => c.id === control.id)
          //         );
  
  
  
          //         setSecControls(uniqueSecControls)
  
          //         }             




          // },[SecControls])





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










  console.log(ThreatEvaluation_AP,"Threat evaluation DATA")
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
  // useEffect(()=>{
  //   axios.post(`https://si-tara-nginx-dev-v1.ma48hj4jdd4hk.ap-south-1.cs.amazonlightsail.com/attackTrees`,{'attacktrees_list':assets}).then(response=>{
  //       if(ThreatDSs.length!=0){
  //         var temparr=(response.data).push(...ThreatDSs)
  //         temparr=[...new Set(temparr)]
  //         console.log(response.data,"Response data")
  //         console.log(ThreatDSs,"Threatdss data inside useeffect")
  //         setThreatEvaluation_AP(joinArrays2(findMinimumSumObjects(concatenateArrays(response.data)),ThreatDSs,"Threat","Threat"))
  //         setThreatEvaluation_AP_count (ThreatEvaluation_AP.length)
          
  //       }
  //     })

  // },[ThreatDSs])


  useEffect(() => {
    if (!initialDataLoaded) {
      console.log(ThreatEvaluation_AP,"Setting history from thrt eval ap")
      setThreatEvaluation_AP_History(ThreatEvaluation_AP);
      console.log(ThreatEvaluation_AP_History,"HISTORY DATA IN USE EFFECT")
    }
  }, [ThreatEvaluation_AP]); 


  useEffect(() => {
    console.log('ThreatEvaluation_AP_History updated:', ThreatEvaluation_AP_History);
    // Do something with the updated history
  }, [ThreatEvaluation_AP_History]); // This effect runs whenever ThreatEvaluation_AP_History changes.
  




  // useEffect(() => {
  //   console.log(initialDataLoadedd,"This is sec controls initial data loadedd")
  //   if (!initialDataLoadedd) {
  //     console.log(SecControls,"Setting history from security eval ap")
  //     setSecurityControls_AP_History(SecControls);
  //     console.log(SecurityControls_AP_History,"HISTORY DATA IN SECCONTROLS USE EFFECT")
  //   }
  // }, [SecControls]); 

  // useEffect(() => {
  //   console.log('SecurityControls_AP_History updated:', SecurityControls_AP_History);
  //   // Do something with the updated history
  // }, [SecurityControls_AP_History]); // This effect runs whenever SecurityControls_AP_History changes.
  







  useEffect(() => {
    const tempAssetsList = {};
  
    let uniqueId = 1;
  
    assetaddition.forEach(asset => {
      const key = asset.Asset_description.trim().toLowerCase();
      if (!tempAssetsList[key]) {
        tempAssetsList[key] = {
          id: `Asset-${uniqueId++}`, 
          Asset: asset.Asset_description,
          Objective: [asset.Objective],
        };
      } else {
        if (!tempAssetsList[key].Objective.includes(asset.Objective)) {
          tempAssetsList[key].Objective.push(asset.Objective);
        }
      }
    });
  
    const newAssetsList = Object.values(tempAssetsList).map(asset => ({
      ...asset,
      Objective: asset.Objective.join(', '),
    }));
  
    setAssetsList(newAssetsList);
  }, [assetaddition]);


  const findrootnodes=(dataOmkar,key)=>{
    const temp=[]
      dataOmkar[key].map(item=>{
        if(!item.hasOwnProperty('parent')){
          temp.push({'text':item.text,'key':item.key})
        }
      })
    return temp;
  }

  const threatName=(parentKey,cia,key)=>{
    const parent=findrootnodes(dataOmkar,key)
    const par=parent.find(obj => obj.key === parentKey);
    if(cia==='Confidentiality'){
      return `Extraction of ${par.text}`
    }else if(cia==='Integrity'){
      return `Manipulation of ${par.text}`
    }else if(cia==='Availability'){
      return `Blocking ${par.text}`
    }
  }
  
  

  useEffect(() => {
    if (ThreatDSs.length !== 0 && assets.length !== 0) {
      console.log(ThreatEvaluation_AP,"THREAT EVALUATION AP DATA BEFORE CALLING API END POINT")
      console.log(ThreatEvaluation_AP_History,"HISTORY DATA BEFORE CALLING API")
      axios.post(`https://api.si-tara.com/attackTrees`, { 'attacktrees_list': assets })
        .then(response => {
          const temparr1=findMinimumSumObjects(concatenateArrays(response.data))
          console.log(temparr1,"TEMP ARR 1 DATA")
          console.log(concatenateArrays(response.data))
          console.log(ThreatDSs,"Threatdss data in useeffect")
          console.log(ThreatEvaluation_AP_History,"History in use effect")
          // Combine the response arrays with the ThreatDSs array
          const combinedData = [...ThreatDSs, ...temparr1];
          console.log(combinedData, "Combined data");

          // Deduplicate based on the 'Threat' property, with priority given to items in temparr1
          const uniqueThreatsMap = new Map();

          // Iterate over ThreatDSs first, so temparr1 can overwrite duplicates
          ThreatDSs.forEach(item => {
            const lowerCaseThreat = item.Threat.toLowerCase();
            uniqueThreatsMap.set(lowerCaseThreat, item);
          });

          // Iterate over temparr1 second, to overwrite any duplicates from ThreatDSs
          temparr1.forEach(item => {
            const lowerCaseThreat = item.Threat.toLowerCase();
            uniqueThreatsMap.set(lowerCaseThreat, item); // This will overwrite the ThreatDSs entry if there is a duplicate
          });

          const uniqueCombinedData = Array.from(uniqueThreatsMap.values());


 
          console.log(uniqueCombinedData,"Uniquecombined data")
 
          // Continue with the unique array
          const updatedThreatEvaluation = joinArrays2(uniqueCombinedData, ThreatDSs, "Threat", "Threat");
          
          console.log(updatedThreatEvaluation,"This is old one")
          if(ThreatEvaluation_AP_History){
            setThreatEvaluation_AP(oldthreatevalData(updatedThreatEvaluation,ThreatEvaluation_AP_History))
          }
          else{
          setThreatEvaluation_AP(updatedThreatEvaluation);
          setInitialDataLoaded(false);
          }
          // setThreatEvaluation_AP_count(updatedThreatEvaluation.length); 
          console.log(updatedThreatEvaluation,"THREAT EVALUATION AP DATA AFTER CALLING API END POINT")
        })
        .catch(error => {
          console.error("Error fetching ThreatEvaluation_AP data:", error);
        });
    }
  }, [ThreatDSs,assetaddition]);

  useEffect(()=>{
    if(ThreatEvaluation_AP){
      let updatedThreat=ThreatEvaluation_AP;
      if(dataOmkar!={}){
        console.log('shrinivas is working',dataOmkar)
        Object.entries(dataOmkar).forEach(([key, datamain]) => {
          datamain.map(data=>{
            if(data.text=='Confidentiality' || data.text=='Integrity' || data.text=='Availability'){
              const threatname=threatName(data.parent,data.text,key)
             
              updatedThreat.map(item=>{
               
                if(item.Threat.toLowerCase().trim()===threatname.toLowerCase().trim()){
                  item.Access=data.access
                  item.Equipment=data.equipment
                  item.Expertise=data.expertise
                  item.Time=data.time
                  item.Knowledge=data.knowledge
                  item.Sum=parseInt(data.access,10)+parseInt(data.equipment,10)+parseInt(data.expertise,10)+parseInt(data.time,10)+parseInt(data.knowledge,10)
                }
              })
            }
          })
        });
       
      }
      const ranges = [
        { min: 0, max: 9, attackPotential: 'Beyond High' },
        { min: 10, max: 13, attackPotential: 'High' },
        { min: 14, max: 19, attackPotential: 'Moderate' },
        { min: 20, max: 24, attackPotential: 'Enhanced Basic'},
        {min:25, max:Infinity, attackPotential:'Basic'}
        // Set Infinity as the max for the last range
      ];
   
      updatedThreat.forEach(obj => {
        let attackPotential = 'Unknown'; // Default value
       
        // Find the range that matches the sum
        const range = ranges.find(range => obj.Sum >= range.min && obj.Sum <= range.max);
       
        // If a range is found, set the attack potential accordingly
        if (range) {
          attackPotential = range.attackPotential;
        }
       
        // Assign the attack potential to the object
        obj['Attack_Potential'] = attackPotential;
      });
      setThreatEvaluation_AP_History(updatedThreat)
      setThreatEvaluation_AP(updatedThreat)
      let riskassment_Ap=RiskAssessment
      if(riskassment_Ap.length>0 && updatedThreat){
        console.log('shrinivas entered riskassemet_ap')
        riskassment_Ap.forEach(obj1 => {
          const obj2 = updatedThreat.find(obj2 => obj2["Threat"].toLowerCase().trim() === obj1["Threat"].toLowerCase().trim());
          if(obj2){
            console.log('found obj2 with updated threat')
            obj1.attackPotential= obj2.Attack_Potential
            obj1.risk_of_d= getRisk_D(obj2.Attack_Potential, obj1.consequence)
          }
        });
      }
      setRiskAssessment(riskassment_Ap)
    }
   
  },[dataOmkar])

  const checkforobjective=(assetName)=>{
    let objective=[]
    let data=dataOmkar[assetName]
    data.forEach(item=>{
      if(item.text==='Confidentiality' || item.text==='Integrity' || item.text==='Availability'){
        objective.push({obj:item.text,key:item.key})
      }
    })
    return objective
  }

  function deleteObjectByKey(objects, keyToDelete) {
    // Find the index of the object with the specified key
    const indexToDelete = objects.findIndex(obj => obj.key === keyToDelete);

    // If the object with the keyToDelete is found
    if (indexToDelete !== -1) {
        // Delete the object
        objects.splice(indexToDelete, 1);

        // Find child objects with the keyToDelete as their parent and delete them recursively
        for (let i = objects.length - 1; i >= 0; i--) {
            if (objects[i].parent === keyToDelete) {
                deleteObjectByKey(objects, objects[i].key);
            }
        }
    }
  }

  useEffect(()=>{
    if(AssetsList.length>0){
      AssetsList.map(asset=>{
        let objective = asset.Objective.split(',').map(item => item.trim());
        objective.forEach(objec=>{
          let temp=null
          console.log('attack threatEvaluation',ThreatEvaluation_AP_History)
          if(objec==='Confidentiality' && ThreatEvaluation_AP_History.length>0){
            temp=ThreatEvaluation_AP_History.find(it=>it.Threat.toLowerCase().trim()===`Extraction of ${asset.Asset}`.toLowerCase().trim())
            console.log('temp of confidentiality',temp)
          }else if(objec==='Integrity' && ThreatEvaluation_AP_History.length>0){
            temp=ThreatEvaluation_AP_History.find(it=>it.Threat===`Manipulation of ${asset.Asset}`)
          }else if(objec==='Availability' && ThreatEvaluation_AP_History.length>0){
            temp=ThreatEvaluation_AP_History.find(it=>it.Threat===`Blocking ${asset.Asset}`)
          }
          if(dataOmkar!={}){
            let data=dataOmkar
            console.log('shrinivas dataOmkar before',data)
            if (!data.hasOwnProperty(asset.Asset.toLowerCase().trim())) {
             data[asset.Asset.toLowerCase().trim()]=[{
              key:0,
              text: asset.Asset,
              color:'#F3C8C5',
              category:"HeadNode",
              logicType:"OR",
              access:'99',
              equipment:'99',
              expertise:'99',
              time:'99',
              knowledge:'99'
             }]
             if(temp!=null){
              data[asset.Asset.toLowerCase().trim()].push({
                key:data[asset.Asset.toLowerCase().trim()].length,
                parent:0,
                text: objec,
                color:'#F0D096',
                category:"SubMainNode",
                logicType:"OR",
                access: temp.Access,
                equipment:temp.Equipment,
                expertise:temp.Expertise,
                time:temp.Time,
                knowledge:temp.Knowledge
               })
              }else{
                data[asset.Asset.toLowerCase().trim()].push({
                  key:data[asset.Asset.toLowerCase().trim()].length,
                  parent:0,
                  text: objec,
                  color:'#F0D096',
                  category:"SubMainNode",
                  logicType:"OR",
                  access: '99',
                  equipment: '99',
                  expertise:'99',
                  time:'99',
                  knowledge:'99'
                 })
              }
            } else {
              let foundObject = data[asset.Asset.toLowerCase().trim()].find(obj => obj.text === objec);
              if(foundObject==undefined){
                if(temp!=null){
                  data[asset.Asset.toLowerCase().trim()].push({
                    key:data[asset.Asset.toLowerCase().trim()].length,
                    parent:0,
                    text: objec,
                    color:'#F0D096',
                    category:"LogicNode",
                    logicType:"OR",
                    access: temp.Access,
                    equipment:temp.Equipment,
                    expertise:temp.Expertise,
                    time:temp.Time,
                    knowledge:temp.Knowledge
                   })
                  }else{
                    data[asset.Asset.toLowerCase().trim()].push({
                      key:data[asset.Asset.toLowerCase().trim()].length,
                      parent:0,
                      text: objec,
                      color:'#F0D096',
                      category:"LogicNode",
                      logicType:"OR",
                      access: '99',
                      equipment: '99',
                      expertise:'99',
                      time:'99',
                      knowledge:'99'
                     })
                  }
              }
            }
            console.log('shrinivas dataOmkar',data)
            setData(data)
          }
        })
        let dataobjective=checkforobjective(asset.Asset.toLowerCase().trim())
        console.log('objective assetName',objective,asset.Asset)
        console.log('dataobject assetName',dataobjective,asset.Asset)
        dataobjective.forEach(item=>{
          console.log('item',item)
          if(objective.includes(item.obj)){
            console.log('objective')
          }else{
            let object=dataOmkar
            deleteObjectByKey(object[asset.Asset.toLowerCase().trim()],item.key)
            if(object[asset.Asset]==[]){
              delete object[asset.Asset]
            }
            setData(object)
          }
        })
      })
    }
    console.log('asset list',AssetsList)
  },[AssetsList,dataOmkar])


  // function oldsecuritycontrolsData(array1,array2) {
  //   const combinedMap = new Map();
  
  //   array1.forEach(item => {
  //     combinedMap.set(item.security_control.toLowerCase(), item);
  //   });
  //   array2.forEach(item => {
  //     combinedMap.set(item.security_control.toLowerCase(), item); // Items in array2 overwrite items in array1
  //   });
  
  //   // Get a set of valid threats from ThreatDSs
  //   const validSecurityControlssSet = new Set(getSecurityControls().map(item => item.security_control.toLowerCase()));
  
  //   // Filter the combined array to include only items that have threats present in ThreatDSs
  //   const filteredCombinedArray = Array.from(combinedMap.values()).filter(item => validSecurityControlssSet.has(item.security_control.toLowerCase()));
  
  //   console.log(filteredCombinedArray, "COMBINED ARRAY IN oldsecuritycontrolsData AFTER FILTERING");
  //   return filteredCombinedArray;
  
  // }




  function oldthreatevalData(array1, array2) {
    // First, combine the arrays with priority given to items in array2
    const combinedMap = new Map();
  
    array1.forEach(item => {
      combinedMap.set(item.Threat.toLowerCase(), item);
    });
    array2.forEach(item => {
      combinedMap.set(item.Threat.toLowerCase(), item); // Items in array2 overwrite items in array1
    });
  
    // Get a set of valid threats from ThreatDSs
    const validThreatsSet = new Set(getThreatDSs().map(item => item.Threat.toLowerCase()));
  
    // Filter the combined array to include only items that have threats present in ThreatDSs
    const filteredCombinedArray = Array.from(combinedMap.values()).filter(item => validThreatsSet.has(item.Threat.toLowerCase()));
  
    console.log(filteredCombinedArray, "COMBINED ARRAY IN oldthreatevalData AFTER FILTERING");
    return filteredCombinedArray;
  }
  
  


  function joinArrays1(array1, array2, key, key1, key2) {
    console.log(array1,array2,key,key1,key2,"DATA inside Join Array1")
    let newArray = [];
 
    array1.forEach(obj1 => {
      const obj2 = array2.find(obj2 => obj2[key1].toLowerCase().trim() === obj1[key].toLowerCase().trim());
      if (obj2) {
        let newObj = { ...obj1 }; // Create a copy of obj1
 
        // Append all keys from obj2 to newObj
        Object.keys(obj2).forEach(obj2Key => {
          if (obj2Key === key2) {
            newObj['R_id'] = obj2[obj2Key];
          } else if(obj2Key==='security_description_threat' || obj2Key==='Threat_id'){
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

  
  function joinArrays2(array1, array2,key1,key2) {
    // console.log(array1,array2,key1,key2,"WANTED DATA@#$%^&*&^%$#$%^&*&^%$#%^&*")
    return array1.map(obj1 => {
      const obj2 =array2.find(obj2 => obj2[key2].toLowerCase().trim().replace(/\s+/g,' ') === obj1[key1].toLowerCase().trim().replace(/\s+/g, ' '));
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if(obj2Key=='id'){
            obj1['id']=obj2[obj2Key]
          }else if(obj2Key=='Threat'){
            obj1['Threat_i'] = obj2[obj2Key];
          }
        });
      }else{

      }
      return { ...obj1 };
    });
  }
  function joinArrays3(array1, array2, key11,key22,key1,key2) {
    return array1.map(obj1 => {
      const obj2 =array2.find(obj2 => obj2[key22].toLowerCase().trim() === obj1[key11].toLowerCase().trim());
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if(obj2Key==key2){
            obj1['Did']=[obj2[obj2Key]]
          }else{
            obj1[obj2Key] = obj2[obj2Key];
          }
        });
      }
      return { ...obj1 };
    });
  }


  function joinArraysSC(array1, array2, key11,key22,key1,key2) {
    return array1.map(obj1 => {
      const obj2 =array2.find(obj2 => obj2[key22].toLowerCase().trim() === obj1[key11].toLowerCase().trim());
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if(obj2Key==key2){
            obj1['Sid']=[obj2[obj2Key]]
          }else{
            obj1[obj2Key] = obj2[obj2Key];
          }
        });
      }
      return { ...obj1 };
    });
  }



  function joinArrays4(array1, array2,key1,key2,key3,key4) {
    setSecurityNeed_count(array1.length)
    return array1.map(obj1 => {
      const obj2 =array2.find(obj2 => obj2[key2].toLowerCase().trim() === obj1[key1].toLowerCase().trim());
      if (obj2) {
        // Append all keys from obj2 to obj1
        Object.keys(obj2).forEach(obj2Key => {
          if(obj2Key==key3){
            obj1[key4]=obj2[obj2Key]
          }else{
            obj1[obj2Key] = obj2[obj2Key];
          }
        });
      }
      return { ...obj1 };
    });
  }

  

  useEffect(() => {
    const data=joinArrays1(RiskAssessment,SecurityNeeds,"Threat","Threat_T","id")


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
              name: result.security_description_threat,
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

    setTracebility_data({nodes:nodes,links:links})
   
  }, [RiskAssessment,SecurityNeeds]);


  // function MultiSelectDropdown({ options, value, onChange }) {
  //   const handleChange = (event) => {
  //     onChange(event.target.value);
  //   };
  
  //   return (
  //     <Select
  //       labelId="multi-select-dropdown"
  //       id="multi-select"
  //       multiple
  //       value={value}
  //       onChange={handleChange}
  //       renderValue={(selected) => selected.join(', ')}
  //     >
  //       {options.map((option) => (
  //         <MenuItem key={option.value} value={option.value}>
  //           {option.label}
  //         </MenuItem>
  //       ))}
  //     </Select>
  //   );
  // }

  function MultiSelectDropdown({ options, value, onChange }) {
    const theme = useTheme();
  
    const handleChange = (event) => {
      onChange(event.target.value);
    };
  
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: 48 * 4.5 + theme.spacing(1), // Control the max height of the menu
          width: 'auto', // Set width to auto to accommodate longer text
        },
      },
      getContentAnchorEl: null, // This will make the menu grow from the bottom upwards
    };
  
    return (
      <Select
        labelId="multi-select-dropdown"
        id="multi-select"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        MenuProps={MenuProps}
        renderValue={(selected) => selected.join(', ')}
        style={{ width: '100%' }} // Make the select full width
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            style={{ 
              whiteSpace: 'normal', // Allows text to wrap
              maxWidth: '250px' // Adjust the maxWidth as needed
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }
  


  //############################### Assumption Part ################################################
  
  const assumption_columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = Assumption_Model[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleAssumptionSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleAssumptionCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleAssumptionEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleAssumptionDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'assumption',
      headerName: 'Assumption',
      width: 500,
      editable: true,
    },
    {
      field: 'assumption_comment',
      headerName: 'Comments',
      width: 500,
      editable: true,
    }
  ];
  

  const handleAssumptionRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleAssumptionEditClick = (id) => () => {
    setAssumptionModel({ ...Assumption_Model, [id]: { mode: GridRowModes.Edit } });
  };

  const handleAssumptionSaveClick = (id) => () => {
    const updatedRows = assumption.map(row => {
      if (row.id === id) {
        // When saving, we confirm the row's existence, so clear `isNew` and `fromCSV`
        return { ...row, isNew: false, fromCSV: false };
      }
      return row;
    });
    setassumption(updatedRows);
    setAssumptionModel({ ...Assumption_Model, [id]: { mode: GridRowModes.View } });

  };

  const handleAssumptionDeleteClick = (id) => () => {
    setassumption(assumption.filter((row) => row.id !== id));
    showToast("Assumption", '15px', '15px',"D");
    
  };

  const handleAssumptionCancelClick = (id) => () => {
    setAssumptionModel({
      ...Assumption_Model,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = assumption.find((row) => row.id === id);
    if (editedRow.isNew&&!editedRow.fromCSV) {
      setassumption(assumption.filter((row) => row.id !== id));
    }
  };


  // const processAssumptionRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setassumption(assumption.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  const processAssumptionRowUpdate = (newRow) => {
    // Check if the 'assumption' field is empty
    if (!newRow.assumption || newRow.assumption.trim() === '') {
      alert('Assumption cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    }
   
    // Check if an assumption with the same description already exists (excluding the current row)
    const existingassumptions = getAssumptions();
     const duplicate = existingassumptions.find(as =>
      as.assumption.trim().toLowerCase() === newRow.assumption.trim().toLowerCase() &&
      as.id !== newRow.id
  );
 
  if (duplicate) {
    alert(`This assumption is already exists. Existing ID: ${duplicate.id}`);
    return false;
  }
 
    // If validation passes, proceed with the update
    const updatedRow = { ...newRow, isNew: false };
    setassumption(assumption.map((row) => (row.id === newRow.id ? updatedRow : row)));
    showToast("Assumptions", '15px', '15px',"U");
    return updatedRow;
  };
  


  const handleAssumptionRowModesModelChange = (newRowModesModel) => {
    setAssumptionModel(newRowModesModel);
  };


  //############################## Assumption End ################################################




  //############################### Asset Addition Part ################################################




  const assetaddition_columns = [



    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = AssetAddition_Model[id]?.mode === GridRowModes.Edit;
 
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleAssetAdditionSaveClick(id)}t
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleAssetAdditionCancelClick(id)}
              color="inherit"
            />,
          ];
        }
 
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleAssetAdditionEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleAssetAdditionDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Asset_description',
      headerName: 'Name',
      width: 250,
      editable: true,
    },
    {
      field: 'Objective',
      headerName: 'Security Properties',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions:['Confidentiality','Integrity','Availability'],
    },
    {
      field: 'objective_description',
      headerName: 'Description',
      width: 500,
      editable: true,
    }
  ];
 
 
  const handleAssetAdditionRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
 
  const handleAssetAdditionEditClick = (id) => () => {
    setAssetAdditionModel({ ...AssetAddition_Model, [id]: { mode: GridRowModes.Edit } });

    
  };
 

  const handleAssetAdditionSaveClick = (id) => () => {
    
    console.log('asset addition model',AssetAddition_Model)
    const updatedRows = assetaddition.map(row => {
      if (row.id === id) {
        return { ...row, isNew: false, fromCSV: false };
      }
      return row;
    });

    const existingassets = getAssetAdditionData();
      const duplicate = existingassets.find(aa=> aa.id === id
      );

      const idNumber = parseInt(id.split("-")[1]);

      console.log(duplicate,"The duplicate value is as follows")
      
      console.log(idNumber,"This is the id we are looking in asset addition")

      if (duplicate) {
        setassetaddition(updatedRows);
        setAssetAdditionModel({ ...AssetAddition_Model, [id]: { mode: GridRowModes.View } });
        setNewlyModifiedAssetIds(prevIdss => [...prevIdss, idNumber]);
      } else {
        setassetaddition(updatedRows);
        setAssetAdditionModel({ ...AssetAddition_Model, [id]: { mode: GridRowModes.View } });
        setNewlyAddedAssetIds(prevIds => [...prevIds, id]);
      }
    };


    const handleAssetAdditionDeleteClick = (id) => () => {
      const assetIdNumeric = id.split('-')[1];
      
      const deleteAsset = () => {
          setassetaddition(currentAssets => currentAssets.filter(asset => asset.id !== id));
          setSecGoals(currentSecGoals => currentSecGoals.filter(sg => sg.id !== `A-${assetIdNumeric}`));
  
          const relatedThreatDSss = ThreatDSs.find(td => td.id === `Th-${assetIdNumeric}`);
          if (relatedThreatDSss) {
              const updatednewthreatDSs = {
                  ...relatedThreatDSss,
                  Threat: relatedThreatDSss.Threat,
                  affected_security_goal: relatedThreatDSss.affected_security_goal,
                  Did: []
              };
              setThreatDSs(ThreatDSs.map(td => td.id === relatedThreatDSss.id ? updatednewthreatDSs : td));
          }
  
          setThreatDSs(currentThreatDSs => currentThreatDSs.filter(td => td.id !== `Th-${assetIdNumeric}`));
          setThreatEvaluation_AP(currentThreatEval => currentThreatEval.filter(te => te.id !== `Th-${assetIdNumeric}`));
          setUpdatedAssociations(currentassoc => currentassoc.filter(ua => ua.threatId !== `Th-${assetIdNumeric}`));
          setThreatDamageAssociations(currentthdam => currentthdam.filter(ctd => ctd.threatId !== `Th-${assetIdNumeric}`));
          deletethreat_in_secneed(`Th-${assetIdNumeric}`)
          setRiskAssessment(currentrisk => currentrisk.filter(ra => ra.id !== `R-${assetIdNumeric}`));
  
          showToast("Asset, SecGoal, Threat ", '11.5px', '11.5px', "D");
      };
  
      // Ask for confirmation
      if (window.confirm("Are you sure you want to delete this asset?")) {
          // If user confirms, execute deletion logic
    
          deleteAsset();
      }
  };


  // const handleAssetAdditionDeleteClick = (id) => () => {

    

  //   const assetIdNumeric = id.split('-')[1];
  //   setassetaddition(currentAssets => currentAssets.filter(asset => asset.id !== id));
  //   setSecGoals(currentSecGoals => currentSecGoals.filter(sg => sg.id !== `A-${assetIdNumeric}`));
  //   // const deletedThreatIds = ThreatDSs.filter(td => td.id === `Th-${assetIdNumeric}`).map(td => td.id);
  //   setThreatDSs(currentThreatDSs => currentThreatDSs.filter(td => td.id !== `Th-${assetIdNumeric}`));
  //   deletethreat_in_secneed(`Th-${assetIdNumeric}`)
  //   setThreatEvaluation_AP(currentThreatEval => currentThreatEval.filter(te => te.id !==`Th-${assetIdNumeric}`));
  //   setRiskAssessment(currentrisk => currentrisk.filter(ra => ra.id !==`R-${assetIdNumeric}`));
  //   console.log(RiskAssessment,"RISKASSESSMENT DATA")
    
  
  //   showToast("Asset,SecGoal,Threat are", '11.5px', '11.5px', "D");
  // };

  


  const deletethreat_in_secneed = (ThreatID) => {
    // Map over SecurityNeeds to update the Threat_id and Threat fields
    setSecurityNeeds(prevNeeds => {
      return prevNeeds.map(sn => {
        // If the current SecurityNeed's Threat_id matches the ThreatID we want to delete
        if (sn.Threat_id === ThreatID) {
          return {
            ...sn,
            Threat_id: '', // Clear the Threat_id
            Threat: ''     // Clear the associated Threat name
          };
        }
        // For all other SecurityNeeds, return them unchanged
        return sn;
      });
    });
  };
  
 
  const handleAssetAdditionCancelClick = (id) => () => {
    setAssetAdditionModel({
      ...AssetAddition_Model,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
 
    const editedRow = assetaddition.find((row) => row.id === id);
    if (editedRow.isNew&&!editedRow.fromCSV) {
      setassetaddition(assetaddition.filter((row) => row.id !== id));
    }
  };


 
  const processAssetAdditionRowUpdate = (newRow) => {
    // Check if the 'Asset_description' field is empty
    if (!newRow.Asset_description || newRow.Asset_description.trim() === '') {
      alert('Asset Name cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    }
   
    // Check if the 'Objective' field is empty
    if (!newRow.Objective || newRow.Objective.trim() === '') {
      alert('Security_Property cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    }
 
    // Check if the 'objective_description' field is empty
    if (!newRow.objective_description || newRow.objective_description.trim() === '') {
      alert('Asset Description cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    }


    const existingassets = getAssetAdditionData();
      const duplicate = existingassets.find(aa =>
          aa.Asset_description.trim().toLowerCase() === newRow.Asset_description.trim().toLowerCase() &&
          aa.Objective.trim().toLowerCase() ===newRow.Objective.trim().toLowerCase() &&
          aa.id !== newRow.id
      );
  
      if (duplicate) {
        alert(`This Asset with security property already exists. Existing ID: ${duplicate.id}`);
        return false;
      }
 
    // If validation passes, proceed with the update
    const updatedRow = { ...newRow, isNew: false };
    setassetaddition(assetaddition.map((row) => (row.id === newRow.id ? updatedRow : row)));
      alert("Small Reminder to Map threats and Damage Scenario's in ThreatDSs and update Attack potentials in Attack trees. Default value for Attack Potential of Every Asset is \"99\"!!")
      showToast("Assets,SecGoals,Threats", '11.5px', '11.5px',"U");

    console.log(assetaddition,"THe new asset is as followssssssssssss")
    return updatedRow;
  };
 
 

  
  const handleAssetAdditionRowModesModelChange = (newRowModesModel) => {
    setAssetAdditionModel(newRowModesModel);
    

    newlyModifiedAssetIds.forEach(id =>{  
      const prevAsset = assetaddition.find(asset => asset.id === `AA-${id}`);
      if(prevAsset){
        // Update Asset Addition Model to View mode

        console.log("previous asset entered")

        setAssetAdditionModel({ ...AssetAddition_Model, [id]: { mode: GridRowModes.View } });

    // Update the related Security Goal
    const relatedSecGoal = SecGoals.find(sg => sg.id === `A-${id}`); // Update this condition to match how you link assets to security goals
    if (relatedSecGoal) {
      const updatedSecGoal = {
        ...relatedSecGoal,

        Asset_description: prevAsset.Asset_description,
              Objective: prevAsset.Objective,
              objective_description: prevAsset.objective_description
        // Update the necessary fields of the Security Goal based on the updated asset
        // For example: Objective: assetToUpdate.Objective
      };
      // Update the state that holds the Security Goals
      setSecGoals(SecGoals.map(sg => sg.id === relatedSecGoal.id ? updatedSecGoal : sg));
    }





    var newthreatvalue;

          if(prevAsset.Objective == "Confidentiality"){
            newthreatvalue = "Extraction of "+prevAsset.Asset_description;
          }
          else if(prevAsset.Objective == "Integrity"){
            newthreatvalue = "Manipulation of "+prevAsset.Asset_description;
          }
          else if(prevAsset.Objective == "Availability"){
            newthreatvalue = "Blocking "+prevAsset.Asset_description;
          }
          else{
            newthreatvalue = "Unknown";
          }


          const relatedThreatDSs = ThreatDSs.find(td => td.id == `Th-${id}`);

          if(relatedThreatDSs){
            
            const updatednewthreatDSs = {
              ...relatedThreatDSs,
              Threat: newthreatvalue,
              affected_security_goal: prevAsset.Objective+" of "+prevAsset.Asset_description,
              Did: ThreatDSs.Did
          };


          setThreatDSs(ThreatDSs.map(td => td.id === relatedThreatDSs.id ? updatednewthreatDSs : td));

          }

      }




    });


    // Process newly added assets for SecGoals
    newlyAddedAssetIds.forEach(id => {
      const newAsset = assetaddition.find(asset => asset.id === id);
      const idNumber2 = parseInt(id.split("-")[1]);
      if (newAsset) {
          const newSecGoal = {
              id: `A-${idNumber2}`,
              Asset_description: newAsset.Asset_description,
              Objective: newAsset.Objective,
              objective_description: newAsset.objective_description,
          };


          if (!newAsset.Asset_description || newAsset.Asset_description.trim() === '') {
            return false; // Returning false to prevent the grid from updating the row
          }
         
          // Check if the 'Objective' field is empty
          if (!newAsset.Objective || newAsset.Objective.trim() === '') {
            return false; // Returning false to prevent the grid from updating the row
          }
       
          // Check if the 'objective_description' field is empty
          if (!newAsset.objective_description || newAsset.objective_description.trim() === '') {
            return false; // Returning false to prevent the grid from updating the row
          }

          setSecGoals(prevSecGoals => [...prevSecGoals, newSecGoal]);

          var newthreatvalue;

          if(newAsset.Objective == "Confidentiality"){
            newthreatvalue = "Extraction of "+newAsset.Asset_description;
          }
          else if(newAsset.Objective == "Integrity"){
            newthreatvalue = "Manipulation of "+newAsset.Asset_description;
          }
          else if(newAsset.Objective == "Availability"){
            newthreatvalue = "Blocking "+newAsset.Asset_description;
          }
          else{
            newthreatvalue = "Unknown";
          }

          const newthreatDSs = {
              id:`Th-${idNumber2}`,
              Threat: newthreatvalue,
              affected_security_goal: newAsset.Objective+" of "+newAsset.Asset_description,
              Did: ""
          };

          setThreatDSs(prevThreatDSs => [...prevThreatDSs, newthreatDSs]);



      }
  });

  setNewlyModifiedAssetIds([]);
  setnewlyDeletedAssetIds([]);
  // Clear the tracking state after processing
  setNewlyAddedAssetIds([]);

    console.log(assetaddition,"THe new asset is as rowmodes change followssssssssssss")
    
  };
 
 
  //############################## Asset Addition End ################################################




 //##################################### progress bar #######################################

 const ProgressBar = ({ progress, message }) => {
  const progressBarContainerStyle = {
    position: 'fixed', // Fixed position regardless of scrolling
    top: '50%', // Centered top to bottom
    left: '50%', // Centered left to right
    transform: 'translate(-50%, -50%)', // Adjust the positioning to truly center
    zIndex: 1000, // Ensure it's on top of other elements
    width: '50%', // Width of the bar (adjust as needed)
    backgroundColor: '#ddd',
    borderRadius: '5px', // Optional: if you want rounded corners
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Optional: shadow for visibility
    textAlign: 'center', // Align text in the center of the bar
  };

  const progressBarStyle = {
    height: '20px',
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: '5px',
  };

  const progressFillStyle = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: 'blue',
    borderRadius: '5px',
    color: 'white',
    display: 'flex',
    alignItems: 'center', // Align text vertically
    justifyContent: 'center', // Align text horizontally
  };

  return (
    <div style={progressBarContainerStyle}>
      <div style={{ marginBottom: '5px' }}>{message}</div>
      <div style={progressBarStyle}>
        <div style={progressFillStyle}>{progress}%</div>
      </div>
    </div>
  );
};

 //######################################end ##############################################
  //############################### misuse case Part ################################################

  const muc_columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = Misuse_Model[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleMisuseSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleMisuseCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleMisuseEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleMisuseDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'muc_description',
      headerName: 'Descritption',
      width: 500,
      editable: true,
    },
    {
      field: 'muc_comment',
      headerName: 'Comments',
      width: 500,
      editable: true,
    }
  ];
  const handleMisuseRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleMisuseEditClick = (id) => () => {
    setMisuseModel({ ...Misuse_Model, [id]: { mode: GridRowModes.Edit } });
  };

  // const handleMisuseSaveClick = (id) => () => {
  //   setMisuseModel({ ...Misuse_Model, [id]: { mode: GridRowModes.View } });
  // };


  const handleMisuseSaveClick = (id) => () => {
    const updatedRows = misuse.map(row => {
      if (row.id === id) {
        // When saving, we confirm the row's existence, so clear `isNew` and `fromCSV`
        return { ...row, isNew: false, fromCSV: false };
      }
      return row;
    });
  
    setmisuse(updatedRows);
    setMisuseModel({ ...Misuse_Model, [id]: { mode: GridRowModes.View } });
  };
  


  const handleMisuseDeleteClick = (id) => () => {
    setmisuse(misuse.filter((row) => row.id !== id));
    showToast("Misuse Case", '13px', '13px',"D");
  }

  // const handleMisuseCancelClick = (id) => () => {
  //   setMisuseModel({
  //     ...Misuse_Model,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   });

  //   const editedRow = misuse.find((row) => row.id === id);
  //   if (editedRow.isNew) {
  //     setmisuse(misuse.filter((row) => row.id !== id));
  //   }
  // };


  const handleMisuseCancelClick = (id) => () => {
    setMisuseModel({
      ...Misuse_Model,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  
    const editedRow = misuse.find((row) => row.id === id);
    // Change the condition to also check for the `fromCSV` flag
    if (editedRow.isNew && !editedRow.fromCSV) {
      setmisuse(misuse.filter((row) => row.id !== id));
    }
  };
  





  const processMisuseRowUpdate = (newRow) => {
    // Check if the 'muc_description' field is empty
    if (!newRow.muc_description || newRow.muc_description.trim() === '') {
      alert('Misuse case description cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    }
 
    const existingMisuseCases = getmisusecases();
    const duplicate = existingMisuseCases.find(mc =>
        mc.muc_description.trim().toLowerCase() === newRow.muc_description.trim().toLowerCase() &&
        mc.id !== newRow.id
    );
 
    if (duplicate) {
      alert(`This misuse case description already exists. Existing ID: ${duplicate.id}`);
      return false;
    }
    showToast("Misuse Cases", '13px', '13px',"U");

    // If validation passes, proceed with the update
    const updatedRow = { ...newRow, isNew: false };
    setmisuse(misuse.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };  

  

  const handleMisuseRowModesModelChange = (newRowModesModel) => {
    setMisuseModel(newRowModesModel);

  };


  //############################################### misuse End ##############################


  //########################################## Damage Scenario #############################

  const damage_columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = DamageScenario_Model[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleDamageSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleDamageCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleDamageEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDamageDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'damage_scenario',
      headerName: 'Damage Scenario',
      width: 500,
      editable: true,
    },
    {
      field: 'consequence',
      headerName: 'Consequence',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions:['Serious','Severe','Moderate','Negligible'], 
    },
    {
      field: 'consequence_DS',
      headerName: 'Reasoning for the DS analysis',
      width: 500,
      editable: true,
    },
    {
      field: 'consequence_reasoning',
      headerName: 'Reasoning for the consequence value',
      width: 500,
      editable: true,
    },
  ];

  const handleDamageRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDamageEditClick = (id) => () => {
    setDamageScenarioModel({ ...DamageScenario_Model, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDamageSaveClick = (id) => () => {
    const updatedRows = damageScenario.map(row => {
      if (row.id === id) {
        return { ...row, isNew: false, fromCSV: false };
      }
      return row;
    });
    setDamageScenario(updatedRows);
    setDamageScenarioModel({ ...DamageScenario_Model, [id]: { mode: GridRowModes.View } });
  };

  const handleDamageDeleteClick = (id) => () => {
    deleteDamageScenario(id);
    setDamageScenario(damageScenario.filter((row) => row.id !== id));
    showToast("Damage Scenario", '12px', '12px',"D");
  };

  const handleDamageCancelClick = (id) => () => {
    setDamageScenarioModel({
      ...DamageScenario_Model,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = damageScenario.find((row) => row.id === id);
    if (editedRow.isNew&&!editedRow.fromCSV) {
      setDamageScenario(damageScenario.filter((row) => row.id !== id));
    }
  };

  const deleteDamageScenario = (damageScenarioId) => {
    setDamageScenario(prevScenarios => prevScenarios.filter(ds => ds.id !== damageScenarioId));
 
    setThreatDamageAssociations(prevAssociations => prevAssociations.filter(assoc => assoc.damageScenarioId !== damageScenarioId));
 
    const updatedThreatDSs = ThreatDSs.map(row => {
      const updatedDid = Array.isArray(row.Did) ? row.Did.filter(id => id !== damageScenarioId) : [];
      return {
        ...row,
        Did: updatedDid
      };
    });
 
    setThreatDSs(updatedThreatDSs);
  };

    const processDamageRowUpdate = (newRow) => {
      if (!newRow.damage_scenario || newRow.damage_scenario.trim() === '') {
        alert('Damage Scenario cannot be blank');
        return false;
      }
  
      if (!newRow.consequence || newRow.consequence.trim() === '') {
        alert('Consequence cannot be blank');
        return false;
      }
  
      const existingScenarios = getDamageScenarios();
      const duplicate = existingScenarios.find(ds =>
          ds.damage_scenario.trim().toLowerCase() === newRow.damage_scenario.trim().toLowerCase() &&
          ds.id !== newRow.id
      );
  
      if (duplicate) {
        alert(`This damage scenario already exists. Existing ID: ${duplicate.id}`);
        return false;
      }
  
      const updatedRow = { ...newRow, isNew: false };
      setDamageScenario(damageScenario.map((row) => (row.id === newRow.id ? updatedRow : row)));
      showToast("Damage Scenarios", '13px', '13px',"U");
      return updatedRow;
  };

  const handleDamageRowModesModelChange = (newRowModesModel) => {
    setDamageScenarioModel(newRowModesModel);
  };
  
  <DataGrid
  // ... other props
  processRowUpdate={processDamageRowUpdate}
  onRowEditStop={handleDamageRowEditStop}
  onRowModesModelChange={handleDamageRowModesModelChange}
/>

  //############################################ Damage Scenario End ##################################################



  //############################################ SecGoals_Controls Part #############################################################
 
  const getSecurityNeeds = () => {
    return SecurityNeeds
        .filter(sn => sn && sn.security_description_threat && sn.security_description_threat.trim() !== '') // Check if sn and sn.security_description_threat are defined
        .map(sn => ({
            id: sn.id,
            security_description_threat: sn.security_description_threat,
            Threat:sn.Threat
        }));
};
 
 
 
  // const secControls_columns = [
  //   { field: 'id', headerName: 'ID', width: 90 },
  //   {
  //     field: 'security_control',
  //     headerName: 'Security Control',
  //     width: 500,
  //     editable: false,
  //   },
  //   {
  //     field: 'security_control_description',
  //     headerName: 'Security Control Description',
  //     width: 500,
  //     editable: false,
  //   },


  //   {
  //     field: 'Sid',
  //     headerName: 'Security Goals',
  //     width: 300,
  //     editable: true,
  //     renderCell: (params) => {
  //       return (
  //         <MultiSelectDropdown
  //           options={getSecurityNeeds().map((option) => ({
  //             value: option.id,
  //             label: `${option.id} - ${option.security_description_threat}`,
  //           }))}
  //           value={params.value || []} // Use the current value from the row data
  //           onChange={(newSelectedOptions) => {
  //             handleSelectChangenew(params.id, newSelectedOptions);
  //             showToast("Security Goal Mapping","11px","12px","U"); // Call your showToast function
  //           }}
  //         />
  //       );
  //     },
  //   },


  // ];
  







  //############################################ SecGoals Part #############################################################
  const seC_columns = [
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   headerName: 'Actions',
    //   width: 100,
    //   cellClassName: 'actions',
    //   getActions: ({ id }) => {
    //     const isInEditMode = SecGoals_Model[id]?.mode === GridRowModes.Edit;

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           icon={<SaveIcon />}
    //           label="Save"
    //           sx={{
    //             color: 'primary.main',
    //           }}
    //           onClick={handleSecGoalsSaveClick(id)}
    //         />,
    //         <GridActionsCellItem
    //           icon={<CancelIcon />}
    //           label="Cancel"
    //           className="textPrimary"
    //           onClick={handleSecGoalsCancelClick(id)}
    //           color="inherit"
    //         />,
    //       ];
    //     }

    //     return [
    //       <GridActionsCellItem
    //         icon={<EditIcon />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={handleSecGoalsEditClick(id)}
    //         color="inherit"
    //       />,
    //       <GridActionsCellItem
    //         icon={<DeleteIcon />}
    //         label="Delete"
    //         onClick={handleSecGoalsDeleteClick(id)}
    //         color="inherit"
    //       />,
    //     ];
    //   },
    // },
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Asset_description',
      headerName: 'Asset_description',
      width: 250,
      editable: true,
    },
    {
      field: 'Objective',
      headerName: 'Objective',
      width: 120,
      editable: true,
    },
    {
      field: 'objective_description',
      headerName: 'Description',
      width: 500,
      editable: true,
    }
  ];
  
  
  // const handleSecGoalsRowEditStop = (params, event) => {
  //   if (params.reason === GridRowEditStopReasons.rowFocusOut) {
  //     event.defaultMuiPrevented = true;
  //   }
  // };

  // const handleSecGoalsEditClick = (id) => () => {
  //   setSecGoalsModel({ ...SecGoals_Model, [id]: { mode: GridRowModes.Edit } });
  // };

  // const handleSecGoalsSaveClick = (id) => () => {
  //   setSecGoalsModel({ ...SecGoals_Model, [id]: { mode: GridRowModes.View } });
  // };

  // const handleSecGoalsDeleteClick = (id) => () => {
  //   // console.log("Function Called by Asset Addition")
  //   setSecGoalsModel(SecGoals.filter((row) => row.id !== id));
  //   showToast("Security Goal", '13px', '13px',"D");
  // };

  // const handleSecGoalsCancelClick = (id) => () => {
  //   setSecGoalsModel({
  //     ...SecGoals_Model,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   });

  //   const editedRow = SecGoals.find((row) => row.id === id);
  //   if (editedRow.isNew) {
  //     setSecGoals(SecGoals.filter((row) => row.id !== id));
  //   }
  // };

  // const processSecGoalsRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setSecGoals(SecGoals.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  // const handleSecGoalsRowModesModelChange = (newRowModesModel) => {
  //   setSecGoalsModel(newRowModesModel);
  // };

  //################################################### SecGoals End ################################

  //################################################### Assets List part ################################
  const AssetsList_columns=[
  { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Asset',
      headerName: 'Asset_description',
      width: 250,
      editable: false,
    },
    {
      field: 'Objective',
      headerName: 'Objective',
      width: 300,
      editable: false,
    },
  ];




  //################################################### Assets List End ################################

  //################################################### ThreatDSs part ################################
  
  // const  geScenarioIDs = () => {
  //   return damageScenario.map(ds => ds.id);
  // };
  const getDamageScenarios = () => {
    return damageScenario
        .filter(ds => ds && ds.damage_scenario && ds.damage_scenario.trim() !== '') // Check if ds and ds.damage_scenario are defined
        .map(ds => ({
            id: ds.id,
            damage_scenario: ds.damage_scenario,
            consequence:ds.consequence
        }));
};




const getAssumptions = () =>{
  return assumption
      .filter(as => as&& as.assumption && as.assumption.trim() !=='')
      .map(as=> ({
        id: as.id,
        assumption: as.assumption,
        assumption_comment:as.assumption_comment
      }));
};


const getThreatEvaluation_AP = () =>{
  return ThreatEvaluation_AP
      .filter(te => te&& te.Threat && te.Threat.trim() !=='')
      .map(th=> ({
        id: th.id,
        Threat: th.Threat,
        Time:th.Time,
        Expertise:th.Expertise,
        Knowledge:th.Knowledge,
        Access:th.Access,
        Equipment:th.Equipment,
        Sum:th.Sum,
        Attack_Potential:th.Attack_Potential
      }));
};


// const getThreatEvaluation_AP = () =>{
//   return ThreatEvaluation_AP
//       .filter(te => te&& te.Threat && te.Threat.trim() !=='')
//       .map(as=> ({
//         id: te.id,
//         Threat: te.Threat,
//         Time:te.Time,
//         Expertise:te.Expertise,
//         Knowledge:te.Knowledge,
//         Access:te.Access,
//         Equipment:te.Equipment
//       }));
// };


const getAssetAdditionData = () => {
  return assetaddition
    .filter(aa => aa && aa.Asset_description && aa.Asset_description.trim() !== '') // Check if aa and aa.Asset_description are defined
    .map(aa => ({
      id: aa.id,
      Asset_description: aa.Asset_description,
      Objective: aa.Objective,
      objective_description: aa.objective_description
    }));
};
 
const getmisusecases = () =>{
  return misuse
      .filter(mc => mc&&mc.muc_description && mc.muc_description.trim() !=='')
      .map(mc=> ({
        id:mc.id,
        muc_description: mc.muc_description,
        muc_comment:mc.muc_comment
      }));
};
console.log(ThreatDSs,"Threat DSS array")
const getThreatDSs = () =>{
  return ThreatDSs
    .filter(tds=> tds&&tds.Threat && tds.Threat.trim() !=='')
    .map(tds=>({
      id:tds.id,
      Threat:tds.Threat,
      affected_security_goal:tds.affected_security_goal,
      did:tds.Did
    }));
};


// const getSecurityControls = () =>{
//   return SecControls
//     .filter(scs=> scs&&scs.security_control && scs.security_control.trim() !=='')
//     .map(scs=>({
//       id:scs.id,
//       security_control:scs.security_control,
//       security_control_description:scs.security_control_description,
//       security_goal:scs.security_goal
//     }));
//   };




const getThreatDSsByID = (ThreatID) => {
  return ThreatDSs
    .filter(tds => tds.id === ThreatID)
    .map(tds => ({
      id: tds.id,
      Threat: tds.Threat,
      affected_security_goal: tds.affected_security_goal,
      did: tds.Did
    }));
};


  const ThreatDSs_columns = [

    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Threat',
      headerName: 'Threat',
      width: 250,
      editable: false,
    },
    {
      field: 'affected_security_goal',
      headerName: 'affected security goal',
      width: 300,
      editable: false,
    },

    {
      field: 'Did',
      headerName: 'Damage Scenarios',
      width: 300,
      editable: true,
      renderCell: (params) => {
        return (
          <MultiSelectDropdown
            options={getDamageScenarios().map((option) => ({
              value: option.id,
              label: `${option.id} - ${option.damage_scenario}`,
            }))}
            value={params.value || []} // Use the current value from the row data
            onChange={(newSelectedOptions) => {
              handleSelectChange(params.id, newSelectedOptions);
              showToast("Damage Scenario Mapping","11px","12px","U"); // Call your showToast function
            }}
          />
        );
      },
    },

  ];


  const calculateRiskOfD = (consequence) => {
    switch (consequence) {
        case 'Serious':
            return 'Very High';
        case 'Severe':
            return 'High';
        case 'Moderate':
            return 'Low';
        case 'Negligible':
            return 'Very Low';
        default:
            return 'Unknown';
    }
};

const transformToRiskAssessmentFormat = (associations, ThreatEvaluation_AP) => {
 
  if (!Array.isArray(ThreatEvaluation_AP)) {
    return [];
  }
 
  return associations.map((assoc, index) => {
    // Log the current assoc.threat value
 
    // Attempt to find the matching threat evaluation
    const threatEval = ThreatEvaluation_AP.find(te => {
      return te && te.Threat_i && te.Threat_i.toLowerCase() === assoc.threat.toLowerCase();
    });
 
 
    const attack_Potential = threatEval ? threatEval["Attack_Potential"] : 'Unknown';
    if( assoc.threat=='Blocking BLE API'){

    }
   
    return {
      id: `R-${index+1}`, // Assuming you want to prefix the ID with 'R-'
      damage_scenario: assoc.damageScenario,
      D_id: assoc.damageScenarioId,
      consequence:assoc.cons,
      Threat: assoc.threat,
      risk: calculateRiskOfD(assoc.cons),
      attackPotential: attack_Potential,
      risk_of_d: getRisk_D(attack_Potential, assoc.cons),
    };
  });
};
 
 
  useEffect(() => {
    if (updatedAssociations || ThreatEvaluation_AP) {

      setRiskAssessment(transformToRiskAssessmentFormat(updatedAssociations,ThreatEvaluation_AP));

    }
  }, [updatedAssociations,ThreatEvaluation_AP]);

  useEffect(() => {
    if (threatDamageAssociations) {
      console.log(threatDamageAssociations,"THREATDAMAGE ASSOCIATIONS")
        setThreatDamageAssociations(prevAssociations => {
          // Map the previous associations with the damage scenarios and update if necessary
          const updatedAssociations = prevAssociations.map(assoc => {
              // Find the corresponding damage scenario
              const damageScenario = getDamageScenarios().find(ds => ds.id === assoc.damageScenarioId);
      
              // If the damage scenario is found and the consequence has changed, update it
              if (damageScenario && damageScenario.consequence !== assoc.cons) {
                  return {
                      ...assoc,
                      cons: damageScenario.consequence
                  };
              }
      
              return assoc; // Return the original association if no change is needed
          });
      
          // Log the updated associations

      
          // Update the Risk Assessment with the new format
          setUpdatedAssociations(updatedAssociations)
          console.log(updatedAssociations,"UPDATED ASSOCIATIONS Data")
          //setRiskAssessment(transformToRiskAssessmentFormat(updatedAssociations,ThreatEvaluation_AP));
          
      
          // Return the updated associations for the state update
          return updatedAssociations;
      });
    }
  }, [damageScenario]);



///////// Useeffect by praveen for riskassessment////////////////////////////////



// useEffect(() => {
  
// }, [ThreatDSs]);



// useEffect(() => {

// console.log(ThreatDSs,"Use effect ThreatDSs")  

// ThreatDSs.forEach(th=>{
//   if (!th) {
//     console.error(`Threat with ID ${id} not found.`);
//     return; // Exit the function if no threat is found
//   }
  

// // Create a new array where for each selected damage scenario, we create a new object with the threat
// const newAssociations1 ={  
  
//     threatId: th.id,
//     threat: th.Threat,
//     damageScenarioId: th.Did,
//     damageScenario: getDamageScenarios().find(ds => ds.id === th.Did)?.damage_scenario,
//     cons: getDamageScenarios().find(ds => ds.id === th.Did)?.consequence,
//     // Add any additional details you need from the damage scenario  
// };



// // Here you can decide how to store these new associations
// // For example, you might want to add them to a state that holds all associations
// setThreatDamageAssociations(prevAssociations1 => {
//   // Filter out any existing associations for this threat
//   const filteredAssociations1 = prevAssociations1.filter(assoc => assoc.threatId !== th.id);

//   // Combine the old (filtered) associations with the new associations
//   const updatedAssociations1 = [...filteredAssociations1, ...newAssociations1];



//   // Update the Risk Assessment with the new format
//   //setRiskAssessment(transformToRiskAssessmentFormat(updatedAssociations));
//   setUpdatedAssociations(updatedAssociations1)

//   // Return the updated associations for the state update
//   return updatedAssociations1;
// });



// });




// },[ThreatDSs]);




  useEffect(() => {
    // Function to update securityneed entries based on changes in ThreatDSs
    const updateSecurityNeeds = () => {
      const updatedSecurityNeeds = SecurityNeeds.map((securityNeed) => {
        // Find the corresponding entry in ThreatDSs
        const threatDS = ThreatDSs.find(tds => tds.Threat === securityNeed.Threat);
        // If found, update the relevant fields in securityneed
        if (threatDS) {
          return {
            ...securityNeed,
            affected_security_goal: threatDS.affected_security_goal,
            Did: threatDS.Did,
            // Add other fields that need to be updated
          };
        }
        // If not found, return the security need as is
        return securityNeed;
      });
      // Set the updated security needs to state
      setSecurityNeeds(updatedSecurityNeeds);
    };
  
    // Call the update function
    updateSecurityNeeds();
  }, [ThreatDSs]); // Depend on ThreatDSs so the effect runs when it changes
  


//   const handleSelectChangenew = (id, newSelectedOptions) => {
//     // Find the current threat row to get the threat details
//     const idNumbernew = parseInt(id.split("-")[1]);
//     const currentSecurityNeed = SecurityNeeds.find(row => row.id === `SN-R-${idNumbernew}`);
//     if (!currentSecurityNeed) {
//       console.error(`SecurityNeed with ID SN-R-${idNumbernew} not found.`);
//       return; // Exit the function if no threat is found
//     }



//         // Create a new array where for each selected security need, we create a new object with the security control
//         const newassoc = newSelectedOptions.map(SecurityNeedId => {
//           return {
//             threatId: currentSecurityNeed.id,
//             threat: currentSecurityNeed.security_description_threat,
//             SecurityNeedId: SecurityNeedId,
//             security_description_threat: getSecurityNeeds().find(sn => sn.id === SecurityNeedId)?.security_description_threat,
//             Threat: getSecurityNeeds().find(sn => sn.id === SecurityNeedId)?.Threat,
//             // Add any additional details you need from the damage scenario
//           };
//         });
     
   
        
//         setSecControls(prevAssociations => {
//           // Filter out any existing associations for this threat
//           const filteredAssociations = prevAssociations.filter(assoc => assoc.id !== currentSecurityNeed.id);
       
//           // Combine the old (filtered) associations with the new associations
//           const updatedAssociations = [...filteredAssociations, ...newassoc];
//           console.log(newassoc,"Printing new assoc data")
       
    
       
//           // Update the Risk Assessment with the new format
//           //setRiskAssessment(transformToRiskAssessmentFormat(updatedAssociations));
//           // Return the updated associations for the state update
//           return updatedAssociations;
//         });

//         setInitialDataLoadedd(false);
//         console.log(SecControls,"THis is updated seccontrols array")
       
//         const updatedRows = SecControls.map(row =>
//           row.id === id ? { ...row, Sid: newSelectedOptions } : row
//         );
//         setSecControls(updatedRows);
    







// }


  const handleSelectChange = (id, newSelectedOptions) => {
    // Find the current threat row to get the threat details
    const currentThreat = ThreatDSs.find(row => row.id === id);
    if (!currentThreat) {
      console.error(`Threat with ID ${id} not found.`);
      return; // Exit the function if no threat is found
    }
  

  





    // Create a new array where for each selected damage scenario, we create a new object with the threat
    const newAssociations = newSelectedOptions.map(damageScenarioId => {
      return {
        threatId: currentThreat.id,
        threat: currentThreat.Threat,
        damageScenarioId: damageScenarioId,
        damageScenario: getDamageScenarios().find(ds => ds.id === damageScenarioId)?.damage_scenario,
        cons: getDamageScenarios().find(ds => ds.id === damageScenarioId)?.consequence,
        // Add any additional details you need from the damage scenario
      };
    });
 
 
    // Here you can decide how to store these new associations
    // For example, you might want to add them to a state that holds all associations
    setThreatDamageAssociations(prevAssociations => {
      // Filter out any existing associations for this threat
      const filteredAssociations = prevAssociations.filter(assoc => assoc.threatId !== currentThreat.id);
   
      // Combine the old (filtered) associations with the new associations
      const updatedAssociations = [...filteredAssociations, ...newAssociations];
   

   
      // Update the Risk Assessment with the new format
      //setRiskAssessment(transformToRiskAssessmentFormat(updatedAssociations));
      setUpdatedAssociations(updatedAssociations)
   
      // Return the updated associations for the state update
      return updatedAssociations;
    });
   
 
    // Also, update the existing ThreatDSs row to store the new selections for the dropdown
    const updatedRows = ThreatDSs.map(row =>
      row.id === id ? { ...row, Did: newSelectedOptions } : row
    );
    setThreatDSs(updatedRows);
  };

//   <DataGrid
//   // ...other props
//   components={{
//     Toolbar: CustomToolbar,
//   }}
//   columns={ThreatDSs_columns}
//   // ...other props
// />

  //################################################### ThreatDss End ################################


  //#################################################Threat Evalution Part############################
  // const ThreatEvaluation_AP_columns = [
  //   { 
  //     field: 'id', headerName: 'ID', width: 90
  //   },
  //   {
  //     field: 'Threat',
  //     headerName: 'Threat',
  //     width: 300,
  //     editable: false,
  //   },
  //   {
  //     field: 'Time',
  //     headerName: 'T',
  //     width: 10,
  //     editable: false,
  //     preProcessEditCellProps: (params) => {
  //       const isInteger = /^-?\d+$/; // Regex for integer validation
  //       const hasError = !isInteger.test(params.props.value);
  //       return { ...params.props, error: hasError };
  //     },
  //   },
  //   {
  //     field: 'Expertise',
  //     headerName: 'EX',
  //     width: 10,
  //     editable: false,
  //   },
  //   {
  //     field: 'Knowledge',
  //     headerName: 'K',
  //     width: 10,
  //     editable: false,
  //   },
  //   {
  //     field: 'Access',
  //     headerName: 'A',
  //     width: 10,
  //     editable: false,
  //   },
  //   {
  //     field: 'Equipment',
  //     headerName: 'Eq',
  //     width: 10,
  //     editable: false,
  //   },
  //   {
  //     field: 'Sum',
  //     headerName: 'Sum',
  //     width: 60,
  //     editable: false,
  //   },
  //   {
  //     field: 'Attack Potential',
  //     headerName: 'Attack Potential',
  //     width: 300,
  //     editable: false,
  //   },
  //   console.log(ThreatEvaluation_AP,"ThreatEvaluation_AP_DATA")
  // ];

  //#################################################Threat Evaluation Part############################
  const ThreatEvaluation_AP_columns = [
 
 
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   headerName: 'Actions',
    //   width: 100,
    //   cellClassName: 'actions',
    //   getActions: ({ id }) => {
    //     const isInEditMode = ThreatEvaluation_AP_Model[id]?.mode === GridRowModes.Edit;
 
    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           icon={<SaveIcon />}
    //           label="Save"
    //           sx={{
    //             color: 'primary.main',
    //           }}
    //           onClick={handleThreatEvaluation_APSaveClick(id)}
    //         />,
    //         <GridActionsCellItem
    //           icon={<CancelIcon />}
    //           label="Cancel"
    //           className="textPrimary"
    //           onClick={handleThreatEvaluation_APCancelClick(id)}
    //           color="inherit"
    //         />,
    //       ];
    //     }
 
    //     return [
    //       <GridActionsCellItem
    //         icon={<EditIcon />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={handleThreatEvaluation_APEditClick(id)}
    //         color="inherit"
    //       />,
    //       // <GridActionsCellItem
    //       //   icon={<DeleteIcon />}
    //       //   label="Delete"
    //       //   onClick={handleThreatEvaluation_APDeleteClick(id)}
    //       //   color="inherit"
    //       // />,
    //     ];
    //   },
    // },
 
 
 
 
 
 
    {
      field: 'id', headerName: 'ID', width: 90
    },
    {
      field: 'Threat',
      headerName: 'Threat',
      width: 300,
      editable: false,
    },
    {
      field: 'Time',
      headerName: 'T',
      width: 10,
      editable: false,
      preProcessEditCellProps: (params) => {
        const isInteger = /^-?\d+$/; // Regex for integer validation
        const hasError = !isInteger.test(params.props.value);
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'Expertise',
      headerName: 'EX',
      width: 10,
      editable: false,
    },
    {
      field: 'Knowledge',
      headerName: 'K',
      width: 10,
      editable: false,
    },
    {
      field: 'Access',
      headerName: 'A',
      width: 10,
      editable: false,
    },
    {
      field: 'Equipment',
      headerName: 'Eq',
      width: 10,
      editable: false,
    },
    {
      field: 'Sum',
      headerName: 'Sum',
      width: 60,
      editable: false,
    },
    {
      field: 'Attack_Potential',
      headerName: 'Attack Potential',
      width: 300,
      editable: false,
    },    
  ];
 
 
 
  const handleThreatEvaluation_APRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
 
  const handleThreatEvaluation_APEditClick = (id) => () => {
    setThreatEvaluation_APModel({ ...ThreatEvaluation_AP, [id]: { mode: GridRowModes.Edit } });
  };
 
  const handleThreatEvaluation_APSaveClick = (id) => () => {

    setThreatEvaluation_APModel({ ...ThreatEvaluation_AP, [id]: { mode: GridRowModes.View } });
};

 
  const handleThreatEvaluation_APDeleteClick = (id) => () => {
    setThreatEvaluation_AP(ThreatEvaluation_AP.filter((row) => row.id !== id));
    showToast("Threat", '15px', '15px',"D");
  };
 
  const handleThreatEvaluation_APCancelClick = (id) => () => {
    setThreatEvaluation_APModel({
      ...ThreatEvaluation_AP_Model,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
 
    const editedRow = ThreatEvaluation_AP.find((row) => row.id === id);
    if (editedRow.isNew) {
      setThreatEvaluation_APModel(ThreatEvaluation_AP.filter((row) => row.id !== id));
    }
  };
 
  // const processAssumptionRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setassumption(assumption.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };
 
  const processThreatEvaluation_APRowUpdate = (newRow) => {
    // Check if the 'Threat' field is empty
    if (!newRow.Threat || newRow.Threat.trim() === '') {
      alert('Threat cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    } 
    
    
    // Calculate the sum of the specified properties
    const sum = parseInt(newRow.Time,10)+parseInt(newRow.Expertise,10)+parseInt(newRow.Knowledge,10)+parseInt(newRow.Access,10)+parseInt(newRow.Equipment,10);

    if(isNaN(sum)){
      alert(`Please fill all the corresponding attack potentials for ${newRow.Threat}`);
      return false;
    }

    // Define the ranges for attack potential
    const ranges = [
        { min: 0, max: 9, attackPotential: 'Beyond High' },
        { min: 10, max: 13, attackPotential: 'High' },
        { min: 14, max: 19, attackPotential: 'Moderate' },
        { min: 20, max: 24, attackPotential: 'Enhanced Basic' },
        { min: 25, max: Infinity, attackPotential: 'Basic' }
    ];

    // Determine the attack potential based on the sum
    const attackPotential = ranges.find(range => sum >= range.min && sum <= range.max)?.attackPotential || 'Unknown';

    console.log(sum,"SUM DATA AFTER SAVING")
    console.log(attackPotential,"ATTACK POTENTIAL DATA AFTER SAVING")
    console.log(ThreatEvaluation_AP,"MAIN DATA")

    const updatedRow = {
      ...newRow,
      Sum: sum, // Set the Threat_id field to the found ID
      Attack_Potential: attackPotential,
      isNew: false
    };

    setThreatEvaluation_AP(ThreatEvaluation_AP.map((row) => (row.id === newRow.id ? updatedRow : row)));
    showToast("Threat Evaluation", '13px', '13px',"U");
    return updatedRow;
  };
 
 
 
  const handleThreatEvaluation_APRowModesModelChange = (newRowModesModel) => {
    setThreatEvaluation_APModel(newRowModesModel);
  };
 
 
 
  //#################################################Threat Evaluation End#############################


  //################################################### sec need part ################################

  const getThreatNames = () => {
    return getThreatDSs().map(tds => tds.Threat);
  };

  const security_columns = [


    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = SecurityNeeds_Model[id]?.mode === GridRowModes.Edit;
 
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSecurityNeedSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleSecurityNeedCancelClick(id)}
              color="inherit"
            />,
          ];
        }
 
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleSecurityNeedEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleSecurityNeedDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },


    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'security_description_threat',
      headerName: 'Security Description Threat',
      width: 500,
      editable: true,
    },
    {
      field: 'Threat',
      headerName: 'Threat',
      width: 300,
      editable: true,
      type: 'singleSelect',
      valueOptions: getThreatNames(),
    },
    {
      field: 'Threat_id',
      headerName: 'Threat_ID',
      width: 90,
      editable: false,
    }
  ];

  const handleSecurityNeedRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
 
  const handleSecurityNeedEditClick = (id) => () => {
    setSecurityNeedsModel({ ...SecurityNeeds, [id]: { mode: GridRowModes.Edit } });
  };
 
  const handleSecurityNeedSaveClick = (id) => () => {
    setSecurityNeedsModel({ ...SecurityNeeds, [id]: { mode: GridRowModes.View } });
  };
 
  const handleSecurityNeedDeleteClick = (id) => () => {
    setSecurityNeeds(SecurityNeeds.filter((row) => row.id !== id));
    showToast("Security Need", '13px', '13px',"D");
  };
 
  const handleSecurityNeedCancelClick = (id) => () => {
    setSecurityNeedsModel({
      ...SecurityNeeds_Model,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
 
    const editedRow = SecurityNeeds.find((row) => row.id === id);
    if (editedRow.isNew) {
      setSecurityNeedsModel(SecurityNeeds.filter((row) => row.id !== id));
    }
  };



 
  // const processAssumptionRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setassumption(assumption.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };
  

  const findAffectedSecurityGoalByThreat = (threatName) => {
    const filteredThreatDSs = getThreatDSs(); // Get the filtered list of ThreatDSs
    const matchingThreatDS = filteredThreatDSs.find(tds => tds.Threat === threatName);
    return matchingThreatDS ? matchingThreatDS.affected_security_goal : null;
  };

  const findDamageScenarioIdByThreat = (threatName) => {
    const filteredThreatDSs = getThreatDSs(); // Get the filtered list of ThreatDSs
    const matchingThreatDS = filteredThreatDSs.find(tds => tds.Threat === threatName);
    return matchingThreatDS ? matchingThreatDS.did : null;
  };
  

  const processSecurityNeedRowUpdate = (newRow) => {
    // Check if the 'Threat' field is empty
    if (!newRow.Threat || newRow.Threat.trim() === '') {
      alert('Sec Need cannot be blank'); // Replace with your preferred error handling
      return false; // Returning false to prevent the grid from updating the row
    }
    
    // Fetch affected security goal and damage scenario ID by threat name
    const affectedSecurityGoal = findAffectedSecurityGoalByThreat(newRow.Threat);
    const damageScenarioId = findDamageScenarioIdByThreat(newRow.Threat);
    newRow.Threat_T=newRow.Threat
    // Find the corresponding Threat ID from the threat name
    const threatId = getThreatDSs().find(tds => tds.Threat === newRow.Threat)?.id;
    
    // Log the data
    console.log(damageScenarioId, "DID DATA");
    
    // If validation passes, proceed with the update
    const updatedRow = {
      ...newRow,
      Threat_id: threatId, // Set the Threat_id field to the found ID
      affected_security_goal: affectedSecurityGoal,
      Did: damageScenarioId,
      isNew: false
    };
  
    // Update the state with the new row data
    setSecurityNeeds(SecurityNeeds.map((row) => (row.id === newRow.id ? updatedRow : row)));
    showToast("Security Needs", '13px', '13px',"U");
    return updatedRow;
  };
  
 
 
 
  const handleSecurityNeedRowModesModelChange = (newRowModesModel) => {
    setSecurityNeedsModel(newRowModesModel);
    console.log(SecurityNeeds,"SEC NEEDS DATA INSIDE SEC NEED")
  };
// #################################################### sec need end###########################################
// ################################################ Risk part #################################################

const risk_columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'damage_scenario',
      headerName: 'Damage Scenario(D)',
      width: 300,
      editable: false,
    },
    {
      field: 'risk',
      headerName: 'Risk Of D',
      width: 100,
      editable: false,
      renderCell: (params) => {
        const riskValue = params.value;
        let bgColor = '';
        if (riskValue === 'Very Low') {
          bgColor = '#a3ed98';
        } else if (riskValue === 'Low') {
          bgColor = '#24a80f';
        } else if (riskValue === 'High') {
          bgColor = '#f24b3f';
        } else if(riskValue ==='Very High'){
          bgColor='#fc1605';
        }
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              backgroundColor: bgColor,
              color: 'black'
            }}
          >
            {riskValue}
          </div>
        );
      },
    },



    {
      field: 'consequence',
      headerName: 'Consequence Of D',
      width: 150,
      editable: false,
      // renderCell: (params) => {    //Color coding for block
      //   const riskValue = params.value;
      //   let bgColor = '';
      //   if (riskValue === 'Negligible') {
      //     bgColor = '#24a80f';
      //   } else if (riskValue === 'Moderate') {
      //     bgColor = 'orange';
      //   } else if (riskValue === 'Severe') {
      //     bgColor = '#f24b3f';
      //   } else if(riskValue ==='Serious'){
      //     bgColor='#fc1605';
      //   }
      //   return (
      //     <div
      //       style={{
      //         display: 'flex',
      //         justifyContent: 'center',
      //         alignItems: 'center',
      //         height: '100%',
      //         width: '100%',
      //         backgroundColor: bgColor,
      //         color: 'black'
      //       }}
      //     >
      //       {riskValue}
      //     </div>
      //   );
      // },
    },
    {
        field: 'Threat',
        headerName: 'Threats T causing the Damage Scenario D',
        width: 300,
        editable: false,
    },
    {
        field: 'attackPotential',
        headerName: 'Attackpotential of T',
        width: 150,
        editable: false,
    },
    {
      field: 'risk_of_d',
      headerName: 'Risk of (D,T)',
      width: 150,
      editable: false,
      renderCell: (params) => {
        const riskValue = params.value;
        let bgColor = '';
        if (riskValue === 'Low') {
          bgColor = '#24a80f';
        } else if (riskValue === 'Medium') {
          bgColor = 'orange';
        } else if (riskValue === 'High') {
          bgColor = '#f24b3f';
        } else if(riskValue ==='Very High'){
          bgColor='#fc1605';
        }
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              backgroundColor: bgColor,
              color: 'black'
            }}
          >
            {riskValue}
          </div>
        );
      },
    }
    
   
  ];
  //################################################### Risk End ################################


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
          if (specifiedKeyValue !== "" && specifiedKeyValue!==null &&  !encounteredValues.has(combinedKeyValues.toLowerCase().trim())) {
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

// Function to perform the join with renaming 'name' to 'name2' in array2
// Function to perform the join with appending 'name' from array2 to array1
function joinArrays(array1, array2, key,key1,key2) {
  return array1.map(obj1 => {
    const obj2 = array2.find(obj2 => obj2[key] === obj1[key]);
    if (obj2) {
      // Append 'name' from array2 with a different key (e.g., 'Did')
      obj1[key1] = obj2[key2];
      return { ...obj1 };
    }
    return obj1;

  });
}

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Stack>
      <Header/>
      <Box
          sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '85vh',width:'100%'}}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={!isGeneratingPdf ? handleChange : null}
            aria-label="Vertical tabs example"
            sx={{ border: 1, borderColor: 'divider',padding:5 }}
          >
           <Tab label="Assumptions" {...a11yProps(0)} sx={{ textTransform: 'none' }} />
            <Tab label="Misuse Cases" {...a11yProps(1)} sx={{ textTransform: 'none' }} />
            <Tab label="Damage Scenarios" {...a11yProps(2)} sx={{ textTransform: 'none' }} />
            <Tab label="SecGoals" {...a11yProps(3)} sx={{ textTransform: 'none' }} />
            <Tab label="Threat DSs" {...a11yProps(4)} sx={{ textTransform: 'none' }} />
            <Tab label="Threat Evaluation" {...a11yProps(5)} sx={{ textTransform: 'none' }} />
            <Tab label="Attack Trees" {...a11yProps(6)} sx={{ textTransform: 'none' }} />
            <Tab label="Risk Assesment" {...a11yProps(7)} sx={{ textTransform: 'none' }} />
            <Tab label="Security Needs" {...a11yProps(8)} sx={{ textTransform: 'none' }} />
            <Tab label="Traceability" {...a11yProps(9)} sx={{ textTransform: 'none' }} />
            <Tab label="Add Asset" {...a11yProps(10)} sx={{ textTransform: 'none' }} />
            <Tab label="Assets List" {...a11yProps(11)} sx={{ textTransform: 'none' }} />
            {/* <Tab label="Security Controls" {...a11yProps(12)} sx={{ textTransform: 'none' }} /> */}
            return (
          <div style={{marginTop:'9rem',textAlign:'center'}}>
            <Button onClick={() => {
              exportAllDataToPDF();
              toast("Data is being exported to PDF");
            }}
            >
            Export PDF
            </Button>

            <ToastContainer />
          </div>

          {/* <div style={{marginTop:'1rem',textAlign:'center'}}>
          <Button onClick={() => {
              // Example call within a component
            importAllData();

              
            }}
            >
            Import Excel
            </Button>

            </div> */}
          
          {isGeneratingPdf && <ProgressBar progress={pdfGenerationProgress} message="Downloading PDF..." />}
        );
          </Tabs>
          <TabPanel value={value} index={0}>
            
            <Stack
            component="form"
            sx={{
                width: '75rem',
            }}
            noValidate
            autoComplete="off"
            >
                <DataGrid
                    rows={assumption}
                    columns={assumption_columns}
                    editMode="row"
                    apiRef={gridApiRef}
                    rowModesModel={Assumption_Model}
                    onRowModesModelChange={handleAssumptionRowModesModelChange}
                    onRowEditStop={handleAssumptionRowEditStop}
                    processRowUpdate={processAssumptionRowUpdate}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 100,
                        },
                      },
                    }}
                    pageSizeOptions={[100]}
                    slots={{
                      toolbar:(props) => <EditAssumptionToolbar {...props} state={assumption.length+1} gridApiRef={gridApiRef} />,
                    }}
                    slotProps={{
                      toolbar: { setassumption, setAssumptionModel,setassumption_count,assumption_count },
                    }}
                />

                
            </Stack>

          </TabPanel>
          <TabPanel value={value} index={1}>
            <Stack
              component="form"
              sx={{
                  width: '75rem',
              }}
              noValidate
              autoComplete="off"
              >
                  <DataGrid
                    rows={misuse}
                    columns={muc_columns}
                    editMode="row"
                    apiRef={gridApiRef}
                    rowModesModel={Misuse_Model}
                    onRowModesModelChange={handleMisuseRowModesModelChange}
                    onRowEditStop={handleMisuseRowEditStop}
                    processRowUpdate={processMisuseRowUpdate}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                    pageSizeOptions={[10]}
                    slots={{
                      toolbar:(props) => <EditMisuseToolbar {...props} state={misuse.length+1} gridApiRef={gridApiRef} />,
                    }}
                    slotProps={{
                      toolbar: { setmisuse, setMisuseModel,setMisuse_count,misuse_count },
                    }}
                  />
              </Stack>
          </TabPanel>
          <TabPanel value={value} index={2}>
              <Stack
                      component="form"
                      sx={{
                          width: '75rem',
                      }}
                      noValidate
                      autoComplete="off"
                      >
                      <DataGrid
                          rows={damageScenario}
                          columns={damage_columns}
                          editMode="row"
                          apiRef={gridApiRef}
                          rowModesModel={DamageScenario_Model}
                          onRowModesModelChange={handleDamageRowModesModelChange}
                          onRowEditStop={handleDamageRowEditStop}
                          processRowUpdate={processDamageRowUpdate}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 10,
                              },
                            },
                          }}
                          pageSizeOptions={[10]}
                          slots={{
                            toolbar:(props) => <EditDamageScenarioToolbar {...props} state={damageScenario.length+1} gridApiRef={gridApiRef}/>,
                          }}
                          slotProps={{
                            toolbar: { setDamageScenario, setDamageScenarioModel,setDamage_count,damage_count },
                          }}
                      />
                  </Stack>
          </TabPanel>
          <TabPanel value={value} index={3}>
              <Stack
                  component="form"
                  sx={{
                      width: '75rem',
                  }}
                  noValidate
                  autoComplete="off"
                  >
                    <DataGrid
                        rows={SecGoals}
                        columns={seC_columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 10,
                            },
                          },
                        }}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick
                    />
                </Stack>
          </TabPanel>
          <TabPanel value={value} index={4}>
              <Stack
                      component="form"
                      sx={{
                          width: '75rem',
                      }}
                      noValidate
                      autoComplete="off"
                      >
                        <DataGrid
                            rows={ThreatDSs}
                            columns={ThreatDSs_columns}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                              },
                            }}
                            pageSizeOptions={[10]}
                            disableRowSelectionOnClick
                        />
                    </Stack>
          </TabPanel>
          {/* <TabPanel value={value} index={5}>
                  <Stack
                      component="form"
                      sx={{
                          width: '75rem',
                      }}
                      noValidate
                      autoComplete="off"
                      >
                        <DataGrid
                            rows={ThreatEvaluation_AP}
                            columns={ThreatEvaluation_AP_columns}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                              },
                            }}
                            pageSizeOptions={[10]}
                            disableRowSelectionOnClick
                        />
                    </Stack>
          </TabPanel> */}

          <TabPanel value={value} index={5}>
              <Stack
                  component="form"
                  sx={{
                      width: '75rem',
                  }}
                  noValidate
                  autoComplete="off"
                  >
                    <DataGrid
                        rows={ThreatEvaluation_AP}
                        columns={ThreatEvaluation_AP_columns}
                        editMode="row"
                rowModesModel={ThreatEvaluation_AP_Model}
                onRowModesModelChange={handleThreatEvaluation_APRowModesModelChange}
                onRowEditStop={handleThreatEvaluation_APRowEditStop}
                processRowUpdate={processThreatEvaluation_APRowUpdate}
                onProcessRowUpdateError={(error) => {
                  // Handle the error here, e.g., log it or show a notification to the user
                  console.error('Error updating row:', error);
                }}
 
 
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 10,
                            },
                          },
                        }}
                        pageSizeOptions={[10]}
 
 
                        //disableRowSelectionOnClick
                    />
                </Stack>
      </TabPanel>

          <TabPanel value={value} index={6}>
          {value === 6 && <TreeChart ref={childRef} assets={AssetsList.map(item=>item.Asset.toLowerCase().trim())} attackTreesData={attackTreesData} dataOmkar={dataOmkar} setData={setData} />}
          </TabPanel>
          <TabPanel value={value} index={7}>
                    <Stack
                      component="form"
                      sx={{
                          width: '75rem',
                      }}
                      noValidate
                      autoComplete="off"
                      >
                        <DataGrid
                            rows={RiskAssessment}
                            columns={risk_columns}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                              },
                            }}
                            pageSizeOptions={[10]}
                            disableRowSelectionOnClick
                        />
                    </Stack>
          </TabPanel>
          <TabPanel value={value} index={8}>
                  <Stack
                      component="form"
                      sx={{
                          width: '75rem',
                      }}
                      noValidate
                      autoComplete="off"
                      >
                        <DataGrid
                            rows={SecurityNeeds}
                            columns={security_columns}
                            editMode="row"
                            apiRef={gridApiRef}
                            rowModesModel={SecurityNeeds_Model}
                            onRowModesModelChange={handleSecurityNeedRowModesModelChange}
                            onRowEditStop={handleSecurityNeedRowEditStop}
                            processRowUpdate={processSecurityNeedRowUpdate}
                            onProcessRowUpdateError={(error) => {
                              // Handle the error here, e.g., log it or show a notification to the user
                              console.error('Error updating row:', error);
                            }}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                              },
                            }}
                            pageSizeOptions={[10]}
                            slots={{
                              toolbar:(props) => <EditSecurityNeedToolbar {...props} state={SecurityNeeds.length+1} gridApiRef={gridApiRef}/>,
                            }}
                            slotProps={{
                              toolbar: { setSecurityNeeds, setSecurityNeedsModel,setSecurityNeed_count,SecurityNeed_count },
                            }}
                        />
                    </Stack>
          </TabPanel>
          <TabPanel value={value} index={9}>
                <Tracebility data={Tracebility_data}/>
          </TabPanel>
      <TabPanel value={value} index={10}>
         
        <Stack
        component="form"
        sx={{
            width: '75rem',
        }}
        noValidate
        autoComplete="off"
        >
            <DataGrid
                rows={assetaddition}
                columns={assetaddition_columns}
                editMode="row"
                apiRef={gridApiRef}
                rowModesModel={AssetAddition_Model}
                onRowModesModelChange={handleAssetAdditionRowModesModelChange}
                onRowEditStop={handleAssetAdditionRowEditStop}
                processRowUpdate={processAssetAdditionRowUpdate}
                onProcessRowUpdateError={(error) => {
                  // Handle the error here, e.g., log it or show a notification to the user
                  console.error('Error updating row:', error);
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10]}
                slots={{
                  toolbar:(props) => <EditAssetAdditionToolbar {...props} state={assetaddition.length+1} gridApiRef={gridApiRef}/>,
                }}
                slotProps={{
                  toolbar: { showToast,ThreatDSs,SecGoals,setThreatDSs,setSecGoals,setassetaddition, setAssetAdditionModel,setassetaddition_count,assetaddition_count },
                }}
            />
 
           
        </Stack>
 
      </TabPanel>
          <TabPanel value={value} index={11}>
                  <Stack
                      component="form"
                      sx={{
                          width: '75rem',
                      }}
                      noValidate
                      autoComplete="off"
                      >
                        <DataGrid
                            rows={AssetsList}
                            columns={AssetsList_columns}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                              },
                            }}
                            pageSizeOptions={[10]}
                            disableRowSelectionOnClick
                        />
                    </Stack>
              </TabPanel>

              {/* <TabPanel value={value} index={12}>
              <Stack
                  component="form"
                  sx={{
                      width: '75rem',
                  }}
                  noValidate
                  autoComplete="off"
                  >
                    <DataGrid
                        rows={SecControls}
                        columns={secControls_columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 10,
                            },
                          },
                        }}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick
                    />
                </Stack>
          </TabPanel> */}

        </Box>
      </Stack>
        
        

    </div>
  );

  function collectAllData() {
    // Define the properties you want to keep for each data category
    const assumptionFields = ['id', 'assumption', 'assumption_comment']; // Add more fields as needed
    const misuseFields = ['id', 'muc_description', 'muc_comment']; // Add more fields as needed
    const damageScenarioFields= ['id' , 'damage_scenario','consequence','consequence_DS','consequence_reasoning'];
    const secgoalsFields=['id','Asset_description','Objective','objective_description'];
    const threatDSsFields=['id','Threat','affected_security_goal','Did'];
    const threatevaluationFields=['id','Threat','Time','Expertise','Knowledge','Access','Equipment','Sum','Attack_Potential'];
    const secneedsFields=['id','security_description_threat','Threat','Threat_id'];
    const riskassessmentFields=['id','damage_scenario','risk','consequence','Threat','attackPotential','risk_of_d']
    const assetslist=['id','Asset','Objective']
    // ...define fields for other data categories similarly
   
    // Collect and filter data from all your DataGrids
    const allData = {
      Assumptions: assumption.map(assump => filterProperties(assump, assumptionFields)),
      MisuseCases: misuse.map(mis => filterProperties(mis, misuseFields)),
      DamageScenarios:damageScenario.map(damage=>filterProperties(damage,damageScenarioFields)),
      SecurityGoals:SecGoals.map(secgoals=>filterProperties(secgoals,secgoalsFields)),
      ThreatScenarios:ThreatDSs.map(threatdss=>filterProperties(threatdss,threatDSsFields)),
      ThreatEvaluation: ThreatEvaluation_AP.map(te => filterProperties(te, threatevaluationFields)),
      SecurityNeeds:SecurityNeeds.map(sec=>filterProperties(sec,secneedsFields)),
      RiskAssessment: RiskAssessment.map(ra => filterProperties(ra, riskassessmentFields)),
      assetslist:AssetsList.map(al=>filterProperties(al,assetslist))
      // ...continue for each data category
    };
   
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

  function addWatermark(pdf) {
    const totalPages = pdf.internal.getNumberOfPages();
    const watermark = "Si-TaRA"; // Your watermark text
  
    pdf.setTextColor(230 , 230, 230); // Set watermark color
    pdf.setFontSize(60); // Set watermark size
    pdf.setFont('Helvetica', 'normal'); // Set watermark font
  
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      const pageSize = pdf.internal.pageSize;
      const pageWidth = pageSize.getWidth();
      const pageHeight = pageSize.getHeight();
      pdf.text(watermark, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45 // Rotate text diagonally
      });
    }
  }
  



async function importAllData() {
  // toast("Data is being imported");
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx, .xlsm, .xls';
  fileInput.style.display = 'none';

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast("No file selected");
      return;
    }

    // Reading the file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, {type: 'array'});


    // ######################################## Methodology Testing################################
    const aboutSheet = workbook.Sheets['About'];

    // Check if 'About' sheet is not undefined
    if (!aboutSheet) {
      alert("The 'About' sheet does not exist in the workbook");
      return;
    }

    // Access cell B19 value
    const cellRef = 'B19'; // Cell reference
    const desiredCell = aboutSheet[cellRef];

    // Check if the cell does not exist
    if (!desiredCell) {
      alert("Cell B19 does not exist Wether it is AP or LE in 'About' sheet");
      return;
    }

    // Extract the value
    const cellValue = desiredCell.v; // Get the value from the cell
    if(cellValue==="Attack Potential"){

  // ####################################Assumptions Sheet#######################################
 
 
  const assumptionsSheet = workbook.Sheets['Assumptions'];
  if (assumptionsSheet) {
    let range = XLSX.utils.decode_range(assumptionsSheet['!ref']);
    range.s.r = 11; // Start from the 11th row (zero-indexed)
    range.s.c = 1;  // Start from the second column (zero-indexed)
 
    let assumptionsData = XLSX.utils.sheet_to_json(assumptionsSheet, {
      range: XLSX.utils.encode_range(range),
      blankrows: false,
      header: ["Assumptions", "Comments"],
      defval: ""
    });
 
    let firstBlankRowIndex = assumptionsData.findIndex(row => !row.Assumptions && !row.Comments);
    if (firstBlankRowIndex !== -1) {
      assumptionsData = assumptionsData.slice(0, firstBlankRowIndex);
    }
 
    setassumption(prev => {
      const updatedAssumptionsMap = new Map();
      let maxExistingId = assumption_count;
 
      // Update existing assumptions
      prev.forEach(assumption => {
        updatedAssumptionsMap.set(assumption.assumption.toLowerCase(), assumption);
      });
 
      // Add or update new assumptions
      assumptionsData.forEach(newAssump => {
        const lowerCaseAssumption = newAssump.Assumptions.toLowerCase();
        if (updatedAssumptionsMap.has(lowerCaseAssumption)) {
          const existingAssump = updatedAssumptionsMap.get(lowerCaseAssumption);
          if (existingAssump.assumption_comment !== newAssump.Comment) {
            updatedAssumptionsMap.set(lowerCaseAssumption, {
              ...existingAssump,
              assumption_comment: newAssump.Comment
            });
          }
        } else {
          maxExistingId += 1;
          updatedAssumptionsMap.set(lowerCaseAssumption, {
            id: `Asm-${maxExistingId}`,
            assumption: newAssump.Assumptions,
            assumption_comment: newAssump.Comments,
            isNew: true,
            fromCSV:true,
          });
        }
      });
 
      // Check if we have added or updated data
      const hasNewOrUpdatedData = maxExistingId > assumption_count;
      if (hasNewOrUpdatedData) {
        setassumption_count(maxExistingId);
      } else {
        alert("All Assumptions data already exists!!!");
      }
 
      // Convert the updated assumptions map back to an array
      return Array.from(updatedAssumptionsMap.values());
    });
 
    // toast("Data imported successfully");
  } else {
    toast("Assumptions sheet not found in the file.");
  }
 



  // #################################### Misuse Cases Sheet#######################################
  const MisuseSheet = workbook.Sheets['MUCs'];
  if (MisuseSheet) {
    let range = XLSX.utils.decode_range(MisuseSheet['!ref']);
    range.s.r = 32;
    range.s.c = 1;

    let misusedata = XLSX.utils.sheet_to_json(MisuseSheet, {
      range: XLSX.utils.encode_range(range),
      blankrows: false,
      header: ["MUC Description", "Comment"], // Explicitly specify headers as they appear starting from the 2nd column
      defval: "" // Default value for empty cells
    });
    console.log(misusedata,"misuse data")
    let firstBlankRowIndex = misusedata.findIndex(row => !row["MUC Description"] && !row.Comment);
    console.log(firstBlankRowIndex,"FirstBlank")
    if (firstBlankRowIndex !== -1) {
      misusedata = misusedata.slice(0, firstBlankRowIndex);
      console.log(misusedata,"misuse data")
    }

    setmisuse(prev => {
      const updatedmisusemap = new Map();
      let maxExistingId = misuse_count;
 
      // Update existing assumptions
      prev.forEach(misuse => {
        updatedmisusemap.set(misuse.muc_description.toLowerCase(), misuse);
      });
 
      // Add or update new assumptions
      misusedata.forEach(newmisuse => {
        const lowerCaseMisuse = newmisuse["MUC Description"].toLowerCase();
        if (updatedmisusemap.has(lowerCaseMisuse)) {
          const existingmisuse = updatedmisusemap.get(lowerCaseMisuse);
          if (existingmisuse["Comment"] !== newmisuse.Comment) {
            updatedmisusemap.set(lowerCaseMisuse, {
              ...existingmisuse,
              muc_comment: newmisuse.Comment
            });
          }
        } else {
          maxExistingId += 1;
          updatedmisusemap.set(lowerCaseMisuse, {
            id: `MUC-${maxExistingId}`,
            muc_description: newmisuse["MUC Description"],
            muc_comment: newmisuse.Comment,
            isNew: true,
            fromCSV: true,
          });
        }
      });
     
      // Check if we have added or updated data
      const hasNewOrUpdatedData = maxExistingId > misuse_count;
      if (hasNewOrUpdatedData) {
        setMisuse_count(maxExistingId);
      } else {
        console.log("ASDFASDFASDF")
        alert("All Misuse data already exists!!!");
      }
 
      // Convert the updated assumptions map back to an array
      return Array.from(updatedmisusemap.values());
    });
    // toast("Data imported successfully");
  } else {
    toast("Misuse sheet not found in the file.");
  }

   // #################################### Damage Scenario's Sheet#######################################
   let updatedDamageScenarios = [];
   let trulyUniqueScenarios =[];
   let finaldamageScenarios = [];
   const correctConsequenceSpelling = (consequence) => {
    const firstChar = consequence.charAt(0).toLowerCase();
    const lastChar = consequence.charAt(consequence.length - 1).toLowerCase();
 
    if (firstChar === 's') {
      if (lastChar === 's') {
        return 'Serious';
      } else if (lastChar === 'e') {
        return 'Severe';
      }
    } else if (firstChar === 'm') {
      return 'Moderate';
    } else if (firstChar === 'n') {
      return 'Negligible';
    }
 
    // If none of the criteria match, return the original string
    return consequence;
  };
   const damageSheet = workbook.Sheets['DSsConsequences'];
   if (damageSheet) {
     let range = XLSX.utils.decode_range(damageSheet['!ref']);
     range.s.r = 22;
     range.s.c = 1;

     let damageData = XLSX.utils.sheet_to_json(damageSheet, {
       range: XLSX.utils.encode_range(range),
       blankrows: false,
       header: ["Damage Scenario", "Consequence","Reasoning for the relevance of the DS for this analysis","Reasoning for the choice of the consequence value"], // Explicitly specify headers as they appear starting from the 2nd column
       defval: "" // Default value for empty cells
     });
     console.log(damageData,"damage data")
     let firstBlankRowIndex = damageData.findIndex(row => !row["Damage Scenario"] && !row.Consequence && !row["Reasoning for the relevance of the DS for this analysis"] && !row["Reasoning for the choice of the consequence value"]);
     console.log(firstBlankRowIndex,"FirstBlank")
     if (firstBlankRowIndex !== -1) {
       damageData = damageData.slice(0, firstBlankRowIndex);
     }
     // Adjust the mapping to create a unique identifier for each item,
      // Step 1: Map and initially deduplicate updatedDamageScenarios
      updatedDamageScenarios = damageData.map((item, index) => ({
        id: `DS-${damage_count + index + 1}`,
        damage_scenario: item["Damage Scenario"] || '',
        consequence: correctConsequenceSpelling(item.Consequence) || '',
        consequence_DS: item["Reasoning for the relevance of the DS for this analysis"] || '',
        consequence_reasoning: item["Reasoning for the choice of the consequence value"] || '',
      })).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.damage_scenario === value.damage_scenario
        ))
      );

      // Step 2: Deduplicate against existing state before updating
      const existingIds = new Set(damageScenario.map(ds => ds.damage_scenario.trim().toLowerCase()));

      trulyUniqueScenarios = updatedDamageScenarios.filter(ds =>
        !existingIds.has(ds.damage_scenario.trim().toLowerCase())
      );



      if (trulyUniqueScenarios.length > 0) {
        setDamageScenario(prev => [...prev, ...trulyUniqueScenarios]);
        setDamage_count(damage_count + trulyUniqueScenarios.length);
        finaldamageScenarios = [...damageScenario, ...trulyUniqueScenarios];
        console.log(trulyUniqueScenarios)
        console.log(updatedDamageScenarios)
        console.log(damageScenario)
        console.log(finaldamageScenarios,"WOW")
        console.log(getDamageScenarios(), "Damage Scenario's Data after duplication and setting");
   

    } else {
        alert("All damage scenario's data already exists.");
    }



     

    //  toast("Data imported successfully");
   } else {
     toast("Damage Scenario's sheet not found in the file.");
   }


   console.log(finaldamageScenarios,"WOWWW")
   const getfinaldamageScenarios = () => {
    console.log(finaldamageScenarios,"WOWWW Enti")
    return finaldamageScenarios
            .filter(ds => ds && ds.damage_scenario && ds.damage_scenario.trim() !== '') // Check if ds and ds.damage_scenario are defined
            .map(ds => ({
                id: ds.id,
                damage_scenario: ds.damage_scenario,
                consequence:ds.consequence
            }));
    };  
   // #################################### Sec Goals Sheet#######################################
  let flattenedThreatDSs =[];
  let newthreatDSs = [];
  let trulyUniqueSecGoalsData=[];
  const correctObjectiveSpelling = (obj) => {
  const firstChar = obj.charAt(0).toLowerCase();

  if (firstChar === 'c') {
    return 'Confidentiality';
  } else if (firstChar === 'i') {
    return 'Integrity';
  } else if (firstChar === 'a') {
    return 'Availability';
  }

  return obj; // If none of the criteria match, return the original string
};

const secgoalSheet = workbook.Sheets['SecGoals'];
if (secgoalSheet) {
  let range = XLSX.utils.decode_range(secgoalSheet['!ref']);
  range.s.r = 14;
  range.s.c = 1;

  let secgoalsData = XLSX.utils.sheet_to_json(secgoalSheet, {
    range: XLSX.utils.encode_range(range),
    blankrows: false,
    header: ["Asset Description", "Objective","Description"],
    defval: ""
  });

  console.log(secgoalsData,"Secgoals data");

  let firstBlankRowIndex = secgoalsData.findIndex(row => !row["Asset Description"] && !row.Objective && !row.Description);
  console.log(firstBlankRowIndex,"FirstBlank");
 
  if (firstBlankRowIndex !== -1) {
    secgoalsData = secgoalsData.slice(0, firstBlankRowIndex);
  }

  const correctedSecGoalsData = secgoalsData.map(item => ({
    ...item,
    Objective: correctObjectiveSpelling(item.Objective),
    compositeKey: `${item["Asset Description"].toLowerCase()}|${correctObjectiveSpelling(item.Objective).toLowerCase()}`
  }));
 
  // Fetch existing data and generate composite keys
  const existingAssetAdditionData = getAssetAdditionData(); // Assuming this function exists and is similar for assetaddition and secGoals
  const existingCompositeKeys = new Set(existingAssetAdditionData.map(aa => `${aa.Asset_description.toLowerCase()}|${aa.Objective.toLowerCase()}`));

  // Filter uniqueSecGoalsData to exclude existing entries
  trulyUniqueSecGoalsData = correctedSecGoalsData.filter(item =>
    !existingCompositeKeys.has(item.compositeKey)
  );
 
  // Proceed with mapping only truly unique data
  const updatedAssetAddition = trulyUniqueSecGoalsData.map((item, index) => ({
    id: `AA-${assetaddition_count + index + 1}`,
    Asset_description: item["Asset Description"] || '',
    Objective: item.Objective || '',
    objective_description: item.Description,
  }));
 
  // Update the state with truly unique data
  const updatedSecGoals = trulyUniqueSecGoalsData.map((item, index) => ({
        id: `A-${assetaddition_count + index + 1}`,
        Asset_description: item["Asset Description"] || '',
        Objective: item.Objective || '',
        objective_description: item.Description,
      }));
     


    const getThreatvalue = (Objective,Asset_description) => {
      console.log(Objective,Asset_description,"Arguments Data")
      if(Objective == "Confidentiality"){
        return "Extraction of "+Asset_description;
      }
      else if(Objective == "Integrity"){
        return "Manipulation of "+Asset_description;
        }
      else if(Objective == "Availability"){
        return "Blocking "+Asset_description;
        }
      else{
        return "Unknown";
        }
       };

  // Assuming getThreatvalue function exists and works as intended
  newthreatDSs = trulyUniqueSecGoalsData.map((item, index) => ({
    id: `Th-${assetaddition_count + index + 1}`,
    Threat: getThreatvalue(item.Objective, item["Asset Description"]),
    affected_security_goal: `${item.Objective} of ${item["Asset Description"]}`,
    Did: ""
  }));
  if(trulyUniqueSecGoalsData.length>0){
    setassetaddition(prev => [...prev, ...updatedAssetAddition]);
    setSecGoals(prev => [...prev, ...updatedSecGoals]);
    flattenedThreatDSs = newthreatDSs.flat();
    setThreatDSs(prevThreatDSs => [...prevThreatDSs, ...newthreatDSs]);
    setassetaddition_count(assetaddition_count + updatedAssetAddition.length);
    setSecGoals_count(SecGoals_count + updatedAssetAddition.length);
  }
  else{
    alert("All Threats data already exists.");
  }

  console.log(newthreatDSs, "Unique threats imported data");
  console.log(updatedAssetAddition, "Imported Asset Addition Data");

} else {
  toast("Sec Goals sheet not found in the file.");
}



  // #################################### ThreatDss Sheet#######################################
if(trulyUniqueSecGoalsData.length>0){


let updatedThreatDSs = [];


let damageScenarios=[];


console.log(trulyUniqueScenarios.length,"Comparing Length%^&^%^&*&^&*")
if (trulyUniqueScenarios.length > 0) {
// Initialize tempds with trulyUniqueScenarios
let tempds = [...trulyUniqueScenarios];

// Fetch current damage scenarios
let currentDamageScenarios = getDamageScenarios();

// Attempt to merge currentDamageScenarios into tempds
currentDamageScenarios.forEach(newRow => {
    const isDuplicate = tempds.some(ds =>
        ds.damage_scenario.trim().toLowerCase() === newRow.damage_scenario.trim().toLowerCase()
    );
   
    if (!isDuplicate) {
        tempds.push(newRow);
    }
});

console.log(tempds, "Merged Data");

damageScenarios = tempds;
}

else{
damageScenarios=getDamageScenarios();
}

console.log(damageScenarios, "Initial Damage Scenarios data");

const damageScenarioIdMap = damageScenarios.reduce((acc, ds) => {
console.log(ds, "Current Damage Scenario object being processed");
if (ds && ds.damage_scenario) {
  const key = ds.damage_scenario.trim().toLowerCase();
  console.log(key,"key value")
  acc[key] = ds.id;
} else {
  // Log a warning if a damage scenario object is missing or improperly formatted
  console.log("Warning: A damage scenario object is missing or lacks a 'damageScenario' property.", ds);
}
return acc;
}, {});

console.log(damageScenarioIdMap, "Final Damage Scenario ID Map");


// Attempt to access the 'ThreatsDSs' sheet from the workbook
const ThreatDSs_sheet = workbook.Sheets['ThreatsDSs'];

if (ThreatDSs_sheet) {
// Define the range and extract data from the sheet
let range = XLSX.utils.decode_range(ThreatDSs_sheet['!ref']);
// Adjust starting row and column indices as needed
range.s.r = 16; // Starting from the 17th row (0-indexed)
range.s.c = 1;  // Starting from the 2nd column (0-indexed)

// Convert the desired range of the sheet to JSON
let threatsData = XLSX.utils.sheet_to_json(ThreatDSs_sheet, {
  range: XLSX.utils.encode_range(range),
  blankrows: false,
  header: ["Threat", "Affected Security Goal", "DS-ID","Damage Scenarios"],
  defval: ""
});

// Filter out any rows without a Threat or Damage Scenario
threatsData = threatsData.filter(row => row["Threat"] && row["Damage Scenarios"]);


// Assume setThreatDSs updates your state, and threatsData comes from the Excel file.
const threatsDataFromExcel = threatsData.map(threat => {
const damageScenarioName = threat["Damage Scenarios"].trim().toLowerCase();
const dsId = damageScenarioIdMap[damageScenarioName];
return {
  ...threat,
  Did: dsId ? [dsId] : [""]
};
});

setThreatDSs(prevThreatDSs => {
updatedThreatDSs = prevThreatDSs.map(threatInState => {
  const matchingThreatsFromExcel = threatsDataFromExcel.filter(excelThreat =>
    excelThreat.Threat.trim().toLowerCase() === threatInState.Threat.trim().toLowerCase());

  const dids = matchingThreatsFromExcel.reduce((acc, curr) => {
    curr.Did.forEach(did => {
      if (!acc.includes(did)) {
        acc.push(did);
      }
    });
    return acc;
  }, []);

  if (dids.length > 0) {
    return { ...threatInState, Did: dids };
  } else {
    return threatInState;
  }


});

console.log(updatedThreatDSs,"NEW UPDATED THREATSSS")


console.log(ThreatDSs, "The new threats are for risk assessment")

console.log(updatedAssociations,"This is format for updatedAssociations")

console.log(threatDamageAssociations,"This is format for ThreatDamageAssociations")

console.log(RiskAssessment,"This is format for riskk assessment")


updatedThreatDSs.forEach(th => {
  if (!th) {
    console.error(`Threat with ID ${th.id} not found.`);
    return; // Exit the function if no threat is found
  }

    console.log(getfinaldamageScenarios())
  // Create a new association object for the current threat and damage scenario
  const newAssociation = {
    threatId: th.id,
    threat: th.Threat,
    damageScenarioId: th.Did,
    damageScenario: getfinaldamageScenarios().find(ds => th.Did.includes(ds.id))?.damage_scenario,
    cons: getfinaldamageScenarios().find(ds => th.Did.includes(ds.id))?.consequence,
    // Add any additional details you need from the damage scenario  
  };

  if(typeof newAssociation.cons == "undefined" || typeof newAssociation.damageScenario == "undefined"){
    return;
  }
  console.log(newAssociation,"The new association is as followss")
  // Update the state with the new association or update existing association
  setThreatDamageAssociations(prevAssociations => {
    // Check if an association for this threat already exists
    const existingAssociationIndex = prevAssociations.findIndex(assoc => assoc.threatId === th.id);


    if (existingAssociationIndex !== -1) {
      // If an association exists, replace it with the new association
     // const updatedAssociations = [...prevAssociations];
     // updatedAssociations[existingAssociationIndex] = newAssociation;
    //  setUpdatedAssociations(updatedAssociations);
      return updatedAssociations;
    } else {
      // If no association exists, add the new association to the list

      setUpdatedAssociations([...prevAssociations, newAssociation]);
      return [...prevAssociations, newAssociation];
    }
  });
});




// updatedThreatDSs.forEach(th=>{
//   if (!th) {
//     console.error(`Threat with ID ${id} not found.`);
//     return; // Exit the function if no threat is found
//   }
  

// // Create a new array where for each selected damage scenario, we create a new object with the threat
// const newAssociations1 ={  
  
//     threatId: th.id,
//     threat: th.Threat,
//     damageScenarioId: th.Did,
//     damageScenario: getDamageScenarios().find(ds => ds.id === th.Did)?.damage_scenario,
//     cons: getDamageScenarios().find(ds => ds.id === th.Did)?.consequence,
//     // Add any additional details you need from the damage scenario  
// };

// // Here you can decide how to store these new associations
// // For example, you might want to add them to a state that holds all associations
// setThreatDamageAssociations(prevAssociations1 => {
//   // Filter out any existing associations for this threat
//   const filteredAssociations1 = prevAssociations1.filter(assoc => assoc.threatId !== th.id);

//   // Combine the old (filtered) associations with the new associations
//   const updatedAssociations1 = [...filteredAssociations1, ...newAssociations1];



//   // Update the Risk Assessment with the new format
//   //setRiskAssessment(transformToRiskAssessmentFormat(updatedAssociations));
//   setUpdatedAssociations(updatedAssociations1)

//   // Return the updated associations for the state update
//   return updatedAssociations1;
// });


//})









return updatedThreatDSs;
});



console.log(ThreatDSs,"This is new threatDSSSss")









}

else{
toast("Sec Goals sheet not found in the file.");
}
}
// #################################### Threat Evaluation Sheet#######################################

let AllThreats=[];
const normalizeThreatName = (name) => {
  console.log(name,"Getting values to normalize")
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
};
 
const ThreatEvaluation_sheet = workbook.Sheets['ThreatEvaluation_AP'];
 
if (ThreatEvaluation_sheet) {
  let range = XLSX.utils.decode_range(ThreatEvaluation_sheet['!ref']);
  range.s.r = 52;
  range.s.c = 1;  
 
  let ThreatEvalData = XLSX.utils.sheet_to_json(ThreatEvaluation_sheet, {
    range: XLSX.utils.encode_range(range),
    blankrows: false,
    header: ["Threat", "T", "Ex","K","A","Eq"],
    defval: ""
  });

  console.log(ThreatEvalData,"thrt eval data check after immediate")
 
  if (flattenedThreatDSs.length > 0) {
    // Initialize tempds with trulyUniqueScenarios
    let tempTh = [...flattenedThreatDSs];
   
    // Fetch current damage scenarios
    let currentThreats = getThreatEvaluation_AP();
 
 
    currentThreats.forEach(newRow => {
        const isDuplicate = tempTh.some(th =>
            th.Threat.trim().toLowerCase() === newRow.Threat.trim().toLowerCase()
        );
       
        if (!isDuplicate) {
            tempTh.push(newRow);
        }
    });
 
    console.log(tempTh, "Merged Data");
 
    // If you meant to update the global damageScenarios variable:
    AllThreats = tempTh;
  }
 
  else{
  AllThreats=getThreatEvaluation_AP();
  }
 
  console.log(AllThreats,"Updated ThreatDSS value")
 
  ThreatEvalData = ThreatEvalData.filter(row => row["Threat"]);
  const updatedThreatEvaluation = AllThreats.map(threatInState => {
    const threatname=threatInState.Threat
    const normalizedStateThreat = normalizeThreatName(threatInState.Threat);
    const threatFromExcel = ThreatEvalData.find(excelThreat =>
      normalizeThreatName(excelThreat.Threat) === normalizedStateThreat);
    
      console.log(ThreatEvalData,"thrt eval data check")
   
    if (threatFromExcel) {
      const sum = parseInt(threatFromExcel.T,10)+parseInt(threatFromExcel.Ex,10)+parseInt(threatFromExcel.K,10)+parseInt(threatFromExcel.A,10)+parseInt(threatFromExcel.Eq,10);
 
 
      const ranges = [
        { min: 0, max: 9, attackPotential: 'Beyond High' },
        { min: 10, max: 13, attackPotential: 'High' },
        { min: 14, max: 19, attackPotential: 'Moderate' },
        { min: 20, max: 24, attackPotential: 'Enhanced Basic' },
        { min: 25, max: Infinity, attackPotential: 'Basic' }
      ];
 
    const attackPotential = ranges.find(range => sum >= range.min && sum <= range.max)?.attackPotential || 'Unknown';
      return {
        ...threatInState,
        Threat_i:threatname,
        Time: threatFromExcel.T,
        Expertise: threatFromExcel.Ex,
        Knowledge: threatFromExcel.K,
        Access: threatFromExcel.A,
        Equipment: threatFromExcel.Eq,
        Sum: sum,
        Attack_Potential: attackPotential,
        isNew: false
      };
    } else {
     
      return {
        ...threatInState,
        Threat_i:threatname
      }
    }
  });
 
  setThreatEvaluation_AP_History(prevthreateval =>[...prevthreateval,...updatedThreatEvaluation]);
 
} else {
  toast("Threat Evaluation sheet not found in the file.");
}

 // ####################################################### Sec Need Sheet ############################################

// const secneed_sheet = workbook.Sheets['SecurityNeeds_AP'];
// if (secneed_sheet) {
//   let range = XLSX.utils.decode_range(secneed_sheet['!ref']);
//   range.s.r = 57; // Starting from the 58th row (0-indexed)
//   range.s.c = 1;  // Starting from the 2nd column (0-indexed)
  
//   let secneeddata = XLSX.utils.sheet_to_json(secneed_sheet, {
//     range: XLSX.utils.encode_range(range),
//     blankrows: false,
//     header: ["Security Need Description", "Threat T"],
//     defval: ""
//   });

//   const threatsWithIDs = AllThreats;

//   // Map over the security needs and add threat IDs where applicable
//   const enrichedSecNeedData = secneeddata.map((need,index) => {
//     // Find the matching threat in the threatsWithIDs array
//     const matchingThreat = threatsWithIDs.find(tds => 
//       tds.Threat.trim().toLowerCase() === need["Threat T"].trim().toLowerCase());
//       console.log(matchingThreat,"ID's Data")

//     // Return a new object that includes the security need and the threat ID (if found)
//     return {
//       id:`SN-R-${SecurityNeed_count+index+1}`,
//       security_description_threat: need["Security Need Description"],
//       Threat: need["Threat T"],
//       Threat_T: Threat,
//       Threat_id: matchingThreat ? matchingThreat.id : null
//     };
//   });

//   // Update your state with the enriched security needs data
//   setSecurityNeeds(prevsecneeds => [...prevsecneeds,...enrichedSecNeedData]);
//   setSecurityNeed_count(SecurityNeed_count+enrichedSecNeedData.length)
//   toast("Data imported successfully");
// }
// else{
//   toast("Sec Need sheet not found in the file.");

// }

const secneed_sheet = workbook.Sheets['SecurityNeeds_AP'];
if (secneed_sheet) {
  let range = XLSX.utils.decode_range(secneed_sheet['!ref']);
  range.s.r = 57; // Starting from the 58th row (0-indexed)
  range.s.c = 1;  // Starting from the 2nd column (0-indexed)
  
  let secneeddata = XLSX.utils.sheet_to_json(secneed_sheet, {
    range: XLSX.utils.encode_range(range),
    blankrows: false,
    header: ["Security Need Description", "Threat T"],
    defval: ""
  });

  const threatsWithIDs = AllThreats; // Assuming AllThreats is an array with your threat data
  const currentSecurityNeeds = getSecurityNeeds(); // Assuming this fetches your current state
  const currentDescriptions = new Set(currentSecurityNeeds.map(sn => sn.security_description_threat.trim().toLowerCase()));

  // Filter out the data that already exists
  const filteredSecNeedData = secneeddata.filter(need => {
    const description = need["Security Need Description"].trim().toLowerCase();
    return !currentDescriptions.has(description);
  });

  // Map over the filtered security needs and add threat IDs where applicable
  const enrichedSecNeedData = filteredSecNeedData.map((need, index) => {
    const matchingThreat = threatsWithIDs.find(tds => 
      tds.Threat.trim().toLowerCase() === need["Threat T"].trim().toLowerCase());
    console.log(matchingThreat, "ID's Data");

    return {
      id:`SN-R-${SecurityNeed_count + index + 1}`,
      security_description_threat: need["Security Need Description"],
      Threat: need["Threat T"],
      Threat_T: need["Threat T"], // Ensure that Threat is defined somewhere in your code
      Threat_id: matchingThreat ? matchingThreat.id : null
    };
  });

  if (enrichedSecNeedData.length > 0) {
    setSecurityNeeds(prevsecneeds => [...prevsecneeds, ...enrichedSecNeedData]);
    setSecurityNeed_count(SecurityNeed_count + enrichedSecNeedData.length);
    toast("Data imported successfully");
  } else {
    alert("All Security Needs data already exists.");
  }
} else {
  toast("Sec Need sheet not found in the file.");
}
}
else{
  alert("This XLSM is not AP method!!! Please check and try again")
}



};

  document.body.appendChild(fileInput); 
  fileInput.click();
  fileInput.remove();
}




  


  
  async function exportAllDataToPDF() {
    setValue(6);
    setIsGeneratingPdf(true);
    setPdfGenerationProgress(0);
    setMessage("Preparing Export...");
  
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  
    const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });

    const current_date = new Date().toLocaleString();

    const imageHeight = pdf.internal.pageSize.getHeight() / 2;

    //Add the image
    const img = new Image();
    img.onload = function () {
      pdf.addImage(
        this,
        "PNG",
        0, // X coordinate
        0, // Y coordinate
        pdf.internal.pageSize.getWidth(), // Image width
        imageHeight // Image height
      );

      // Add text elements
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(pdf.internal.pageSize.getWidth()/2, imageHeight + 10,projectName,{align:'center'}); // Project title
      pdf.setFontSize(12);
      pdf.text(pdf.internal.pageSize.getWidth()/2, imageHeight + 20, "Threat and Risk Analysis",{align:'center'}); // Project subtitle
      pdf.text(20, imageHeight + 85, `Manager: ${ManagerName}`); // Manager name
      pdf.text(
        pdf.internal.pageSize.getWidth() - 100,
        pdf.internal.pageSize.getHeight() - 20,
        current_date// Date
      );

    };
    img.src = image_path;
    await delay(500);
    pdf.addPage()

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const allData = collectAllData();


  

     // Calculate image height to cover first half of the page with padding
  
    const totalPages = Object.keys(allData).length + assets.length; // Assuming 'assets' are the pages you're adding
    console.log(assets.length,"total pages value***")
    let completedPages = 0;
  
    const updateProgress = () => {
      completedPages++;
      const progress = Math.ceil((completedPages / totalPages) * 100);
      setPdfGenerationProgress(progress);
    };

    
  
    // Processing the allData sections
    for (const [sectionName, data] of Object.entries(allData)) {
      if (data.length > 0) {
        if (completedPages > 0) pdf.addPage();
        const headers = Object.keys(data[0]);
        const rows = data.map((row) => headers.map((fieldName) => row[fieldName] || ''));
        pdf.text(sectionName, 10, 10);
        autoTable(pdf, { head: [headers], body: rows, startY: 20 });
        updateProgress();
        await delay(200); // Introduce a delay between each section
      }
    }
    pdf.addPage();
    // Processing the images from childRef
    if (childRef.current) {
      const loadAndAddImage = async (imageData, index) => {
        const img = new Image();
        img.src = imageData;
        await new Promise((resolve, reject) => {
          img.onload = () => {
            if (index > 0) pdf.addPage();
            pdf.text(`${AssetsList[index].Asset}'s Attack Tree`, 10, 10);
            const imageWidth = img.width;
            const imageHeight = img.height;
            const scaleX = (pageWidth - 2 * margin) / imageWidth;
            const scaleY = (pageHeight - 2 * margin) / imageHeight;
            const scale = Math.min(scaleX, scaleY);
            const x = margin + (pageWidth - 2 * margin - imageWidth * scale) / 2;
            const y = margin + (pageHeight - 2 * margin - imageHeight * scale) / 2;
            pdf.addImage(imageData, 'PNG', x, y, imageWidth * scale, imageHeight * scale);
            updateProgress();
            resolve();
          };
          img.onerror = () => {
            reject(new Error('Image loading error'));
          };
        });
        await delay(200); // Introduce a delay after each image is loaded
      };
  
      const imageDataArray = await childRef.current.captureAllAssetsData(assets);
      for (let i = 0; i < imageDataArray.length; i++) {
        await loadAndAddImage(imageDataArray[i], i);
      }
    } else {
      console.error('No childRef found');
    }
  
    pdf.save('Si-TaRA_AP.pdf');
    setMessage("Download Complete!");
    setPdfGenerationProgress(100);
    setIsGeneratingPdf(false);
  }

  // async function exportAllDataToPDF() {
  //   setValue(6);
  //   setIsGeneratingPdf(true);
  //   setPdfGenerationProgress(0);
  //   setMessage("Preparing Export...");
  
  //   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  //   const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });
  //   const current_date = new Date().toLocaleString();
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   const imageHeight = pageHeight / 2;
  //   const margin = 10;
  
  //   // Add the initial image and text setup
  //   let completedPages = 0;
  
  //   const img = new Image();
  //   img.onload = async function () {
  //     pdf.addImage(this, "PNG", 0, 0, pageWidth, imageHeight);
  //     pdf.setFont("helvetica", "bold");
  //     pdf.setFontSize(18);
  //     pdf.text(pageWidth / 2, imageHeight + 10, projectName, { align: 'center' }); // Project title
  //     pdf.setFontSize(12);
  //     pdf.text(pageWidth / 2, imageHeight + 20, "Threat and Risk Analysis", { align: 'center' }); // Project subtitle
  //     pdf.text(20, imageHeight + 85, `Manager: ${ManagerName}`); // Manager name
  //     pdf.text(pageWidth - 100, pageHeight - 20, current_date); // Date
  //     completedPages++; // Update progress for the title page
  //     updateProgress();
  //   };
  //   img.src = image_path;
  //   await delay(500); // Wait for image to load
  
  //   const allData = collectAllData();
  //   const assetsData = await childRef.current ? childRef.current.captureAllAssetsData(assets) : [];
  //   const totalPages = Object.keys(allData).length + assets.length + 1; // +1 for the initial image/text page
  
  //   const updateProgress = () => {
  //     const progress = Math.floor((completedPages / totalPages) * 100);
  //     setPdfGenerationProgress(progress);
  //   };
  
  //   // Processing the allData sections
  //   for (const [sectionName, data] of Object.entries(allData)) {
  //     if (data.length > 0) {
  //       pdf.addPage(); // Add a new page for each data section
  //       const headers = Object.keys(data[0]);
  //       const rows = data.map(row => headers.map(fieldName => row[fieldName] || ''));
  //       pdf.text(sectionName, margin, 15);
  //       autoTable(pdf, { head: [headers], body: rows, startY: 25 });
  //       completedPages++; // Update progress after each section
  //       updateProgress();
  //       await delay(200);
  //     }
  //   }
  
  //   // Processing the images from childRef
  //   for (let i = 0; i < assetsData.length; i++) {
  //     pdf.addPage();
  //     pdf.text(`${assets[i]}'s Attack Tree`, margin, 15);
  //     const imgData = new Image();
  //     imgData.src = assetsData[i];
  //     await new Promise((resolve, reject) => {
  //       imgData.onload = () => {
  //         const imageWidth = imgData.width;
  //         const imageHeight = imgData.height;
  //         const scaleX = (pageWidth - 2 * margin) / imageWidth;
  //         const scaleY = (pageHeight - 2 * margin) / imageHeight;
  //         const scale = Math.min(scaleX, scaleY);
  //         const x = margin + (pageWidth - 2 * margin - imageWidth * scale) / 2;
  //         const y = margin + (pageHeight - 2 * margin - imageHeight * scale) / 2;
  //         pdf.addImage(assetsData[i], 'PNG', x, y, imageWidth * scale, imageHeight * scale);
  //         completedPages++; // Update progress after each image
  //         updateProgress();
  //         resolve();
  //       };
  //       imgData.onerror = () => {
  //         reject(new Error('Image loading error'));
  //       };
  //     });
  //     await delay(200);
  //   }
  
  //   pdf.save('Si-TaRA_AP.pdf');
  //   setMessage("Download Complete!");
  //   setPdfGenerationProgress(100);
  //   setIsGeneratingPdf(false);
  // }
  
}


// Inside your component's return statement, add the export button


export default EditData_AP