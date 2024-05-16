import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './App.css';
import Header from './Header';

function App() {
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedQueue, setSelectedQueue] = useState([]);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);

  useEffect(() => {
    fetchTableNames();
  }, []);

  const fetchTableNames = async () => {
    try {
      const response = await axios.get('https://api.si-tara.com/fetch_collection_names');
      console.log(response); // Logging the response to resolve the warning
    } catch (error) {
      console.error('Error fetching table names:', error);
    }
  };

  const fetchData = async (tableName) => {
    try {
      if (!tableName) {
        return;
      }
      const response = await axios.get(`https://api.si-tara.com/fetch_data/${tableName}`);
      setTableData(prevState => ({ ...prevState, [tableName]: response.data }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
      setLoading(false);
    }
  };

  const tableNamesMapping = {
    application_and_servers: 'Applications and Servers',
    aws: 'AWS',
    azure: 'AZURE',
    database_s: 'Database',
    gcp: 'GCP',
    interface: 'Interfaces and Protocols',
    automotive: 'Automotive ECUs',
  };

  const orderedTables = [
    'interface',
    'aws',
    'azure',
    'gcp',
    'database_s',
    'application_and_servers',
    'automotive',
  ];

  const handleTableChange = (tableName) => {
    setSelectedAsset('');
    setShowAssetDropdown(true);
    setSelectedButton(tableName);
    if (!tableData[tableName]) {
      fetchData(tableName);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedAsset(event.target.value);
  };

  const handleAddToQueue = () => {
    if (selectedAsset && !selectedQueue.includes(selectedAsset)) {
      setSelectedQueue(prevQueue => [...prevQueue, selectedAsset]);
    }
  };

  const handleRemoveFromQueue = (assetToRemove) => {
    setSelectedQueue(prevQueue => prevQueue.filter(asset => asset !== assetToRemove));
  };

  const handleDownloadPDF = async () => {
    if (selectedQueue.length === 0) {
      return;
    }

    const doc = new jsPDF();
    let yPos = 10;

    for (let i = 0; i < selectedQueue.length; i++) {
      const asset = selectedQueue[i];
      if (i !== 0) {
        doc.addPage();
        yPos = 10; // Reset yPos to the top of the page
      }
      (function (yPos) { // Closure to capture the current value of yPos
        for (const tableName in tableData) {
          const selectedTableData = tableData[tableName].filter(entry => entry.Asset === asset);
          selectedTableData.forEach(entry => {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(20, yPos, `Asset: ${asset}`);
            yPos += 10;

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(20, yPos, 'Attack Path:');
            yPos += 5;

            const attackPathLines = entry.Attack_Path.split('\n');
            attackPathLines.forEach(line => {
              const remainingSpace = doc.internal.pageSize.height - yPos;
              const splitText = doc.splitTextToSize(line, 170);
              if (remainingSpace < splitText.length * 5) {
                doc.addPage();
                yPos = 10; // Reset yPos to the top of the page
              }
              if (/^\d+\./.test(line)) {
                doc.setFont('helvetica', 'bold');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              doc.text(25, yPos, splitText);
              yPos += (splitText.length * 5) + 2;
            });

            yPos += 5;
          });
          yPos += 10; // Add some space between assets
        }
      })(yPos); // Pass yPos to the closure
    }

    doc.save(`Combined_Attack_Paths.pdf`);
  };

  let assetPreview = null;

  if (selectedAsset && tableData[selectedButton]) {
    const selectedTableData = tableData[selectedButton].filter(entry => entry.Asset === selectedAsset);
    assetPreview = (
      <div>
        <h3>{selectedAsset}</h3>
        {selectedTableData.map((entry, index) => (
          <div key={index} className="attack-path">
            <p className="attack-path-header">Attack Path:</p>
            {entry.Attack_Path.split('\n').map((line, i) => (
              <p key={i} style={{ paddingLeft: /^\d+\./.test(line) ? '0' : '40px' }}>
                {/^\d+\./.test(line) ? <strong>{line}</strong> : line.replace(/-/g, '').replace(/\n/g, '')}
              </p>
            ))}
          </div>
        ))}

      </div>
    );
  }


  return (
    <div className="container2">
      <Header />
      <h1>Attack Paths</h1>
      <div className="table-buttons">
        {orderedTables.map((table, index) => (
          <button
            key={index}
            data-table={table}
            className={selectedButton === table ? 'selected' : ''}
            onClick={() => handleTableChange(table)}
          >
            {tableNamesMapping[table] || table}
          </button>
        ))}
      </div>
      {showAssetDropdown && (
        <div className="asset-container">
          <label htmlFor="assetDropdown">Select Asset:</label>
          <select id="assetDropdown" value={selectedAsset} onChange={handleDropdownChange}>
            <option value="">Select an asset</option>
            {tableData[selectedButton]?.map((entry, index) => (
              <option key={index} value={entry.Asset}>
                {entry.Asset}
              </option>
            ))}
          </select>
          <div>
            <button onClick={handleAddToQueue} class="a-button a-button--primary -without-icon" disabled={!selectedAsset} style={{ margin: "10px", borderRadius: "10px" }}><span class="a-button__label">Add Asset</span></button>
          </div>
        </div>
      )}
      <div className="selected-queue">
        <h3>Selected Assets:</h3>
        {selectedQueue.map((asset, index) => (
          <div key={index} className="selected-asset">
            <button class="a-button a-button--primary -without-icon" style={{ margin: "10px", borderRadius: "10px" }}>
              {/* <span>{asset}</span> */}
              <span onClick={() => handleRemoveFromQueue(asset)} style={{ top: "10px", right: "10px", cursor: "pointer" }} class="a-button__label">{asset} &times;</span>
            </button>
          </div>
        ))}
      </div>
      <div className="download-button-container">
        <button onClick={handleDownloadPDF} disabled={selectedQueue.length === 0}>Download PDF</button>
      </div>
      {assetPreview && (
        <div className="asset-preview">
          {assetPreview}
        </div>
      )}
      {loading ? (
        <p className="loading-error">Loading...</p>
      ) : error ? (
        <p className="loading-error">{error}</p>
      ) : null}
    </div>
  );
}

export default App;