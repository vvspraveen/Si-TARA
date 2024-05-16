// Box.js
import React, { useState } from 'react';

function Box1({ title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBoxClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`box1 ${isExpanded ? 'expanded1' : ''}`} onClick={handleBoxClick}>
      <div className="content1">
        <h2>{title}</h2>
        <p>Click to expand</p>
      </div>
    </div>
  );
}

export default Box1;