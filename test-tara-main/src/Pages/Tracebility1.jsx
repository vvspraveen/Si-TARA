// import React, { useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import './TracebilityGraph.css';
// import { jsPDF } from 'jspdf';

// function Tracebility1({data}) {
 
//   // const svgToCanvas = (callback) => {
//   //   const svgElement = document.querySelector('#graph-container svg');
//   //   const serializer = new XMLSerializer();
//   //   const svgStr = serializer.serializeToString(svgElement);
  
//   //   // Create a blob from the SVG string
//   //   const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
//   //   const url = URL.createObjectURL(svgBlob);
  
//   //   const img = new Image();
//   //   img.onload = () => {
//   //     // Set canvas size to match image size
//   //     const canvas = document.createElement('canvas');
//   //     canvas.width = img.width;
//   //     canvas.height = img.height;
  
//   //     const ctx = canvas.getContext('2d');
//   //     ctx.drawImage(img, 0, 0);
  
//   //     // Proceed with callback
//   //     callback(canvas);
  
//   //     // Clean up URL
//   //     URL.revokeObjectURL(url);
//   //   };
//   //   img.onerror = () => {
//   //     console.error('Error loading SVG image');
//   //   };
//   //   img.src = url;
//   // };

//   // New function to export the graph as a PDF
//   const exportToPDF = () => {
//     const nodeColors = {
//       'Damage Scenario': '#00709a',
//       'Risk': '#e6858d',
//       'Threat': '#e6df85',
//       'Security Goals': '#22a89e',
//       // 'Security Controls': '#ff8c8c'
//     };
  
//     // Calculate the bounds of the graph to determine scaling
//     const bounds = data.nodes.reduce((acc, node) => {
//       return {
//         minX: Math.min(node.x, acc.minX),
//         maxX: Math.max(node.x + node.width, acc.maxX),
//         minY: Math.min(node.y, acc.minY),
//         maxY: Math.max(node.y + node.height, acc.maxY),
//       };
//     }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  
//     const pdfWidth = 800;
//     const pdfHeight = 700;
//     // Use full bounds to calculate width and height
//     const graphWidth = bounds.maxX - bounds.minX;
//     const graphHeight = bounds.maxY - bounds.minY;
//     const scaleX = pdfWidth / graphWidth;
//     const titleAndHeadingsHeight = 60;
//     const columnWidth = graphWidth / Object.keys(nodeColors).length;
//     const scaleY = (pdfHeight - titleAndHeadingsHeight) / graphHeight;
//     const scaleFactor = Math.min(scaleX, scaleY) * 0.95; // Apply a uniform scale factor
    
//     // Calculate offsets to center the graph
//     const offsetX = (pdfWidth - graphWidth * scaleFactor) / 2;
//     const offsetY = (pdfHeight - graphHeight * scaleFactor) / 2 + titleAndHeadingsHeight;
//     const pdf = new jsPDF({
//       orientation: 'landscape',
//       unit: 'pt',
//       format: [pdfWidth, pdfHeight],
//     });
  
//     // Set the title for the graph
//     const title = "Traceability Graph";
//     const titleFontSize = 22;
//     pdf.setTextColor('#000000');
//     pdf.setFontSize(titleFontSize);
//     pdf.text(title, pdfWidth / 2, titleFontSize + 10, { align: 'center' });


//     const drawColumnHeadings = () => {
//       Object.keys(nodeColors).forEach((heading, index) => {
//         // Calculate the center of the current column
//         const columnCenterX = (bounds.minX + (index + 0.5) * columnWidth) * scaleFactor + offsetX;
//         const columnCenterY = titleFontSize + 20; // Adjust the y-coordinate as needed
  
//         // Draw the heading above the center of the column
//         pdf.setTextColor('#000000');
//         pdf.setFontSize(12); // Smaller font size for headings
//         pdf.text(heading, columnCenterX, columnCenterY, { align: 'center' });
//       });
//     };


//     drawColumnHeadings();
  
//     // Draw the nodes with the recalculated positions and sizes
//     data.nodes.forEach(node => {
//       const x = (node.x - bounds.minX) * scaleFactor + offsetX;
//       const y = (node.y - bounds.minY) * scaleFactor + offsetY;
//       const width = node.width * scaleFactor;
//       const height = node.height * scaleFactor;
//       const color = nodeColors[node.type] || '#000';
  
//       pdf.setFillColor(color);
//       pdf.rect(x, y, width, height, 'F');
  
//       // Adjust the font size if necessary
//       const fontSize = 10; // Adjust as needed
//       pdf.setFontSize(fontSize);
//       pdf.setTextColor('#000000');
//       pdf.text(node.name, x + width / 2, y + height / 2, { align: 'center', maxWidth: width - 10 });
//     });
  
//     // Draw the links with the recalculated positions
//     data.links.forEach(link => {
//       const source = data.nodes.find(n => n.id === link.source);
//       const target = data.nodes.find(n => n.id === link.target);
//       if (!source || !target) return;
  
//       const startX = (source.x - bounds.minX + source.width / 2) * scaleFactor + offsetX;
//       const startY = (source.y - bounds.minY + source.height / 2) * scaleFactor + offsetY;
//       const endX = (target.x - bounds.minX + target.width / 2) * scaleFactor + offsetX;
//       const endY = (target.y - bounds.minY + target.height / 2) * scaleFactor + offsetY;
  
//       pdf.setDrawColor('#333333');
//       pdf.setLineWidth(1);
//       pdf.line(startX, startY, endX, endY);
//     });
  
//     pdf.save('traceability-graph.pdf');
//   };
  
  

  
  

//   useEffect(() => {
//     renderGraph(data);
//   }, [data]);

//   function wrapAndTruncateText(selection, maxWidth, maxHeight) {
//     selection.each(function(d) {
//         const textElement = d3.select(this);
//         let words = textElement.text().split(/\s+/);
//         let line = [];
//         let lineNumber = 0;
//         let lineHeight = 1.2; // ems, adjust as needed for your font-size
//         let x = textElement.attr('x');
//         let y = textElement.attr('y');
//         let dy = 0; // we reset dy because we will calculate the line position dynamically
//         let tspan = textElement.text(null).append('tspan')
//             .attr('x', x)
//             .attr('y', y)
//             .attr('dy', `${dy}em`);

//         for (let i = 0; i < words.length; i++) {
//             let testLine = line.concat(words[i]);
//             tspan.text(testLine.join(" "));
//             if (tspan.node().getComputedTextLength() > maxWidth && i > 0) {
//                 line.pop(); // remove last word
//                 tspan.text(line.join(" ")); // set the text for tspan before breaking
//                 if ((lineNumber + 1) * lineHeight * parseInt(textElement.style('font-size')) < maxHeight) {
//                     line = [words[i]]; // start a new line with the last word
//                     tspan = textElement.append('tspan') // add another tspan for the next line
//                         .attr('x', x)
//                         .attr('y', y)
//                         .attr('dy', `${++lineNumber * lineHeight}em`)
//                         .text(words[i]);
//                 } else {
//                     tspan.text(tspan.text() + '...'); // add ellipses and break out of loop
//                     break;
//                 }
//             } else {
//                 line.push(words[i]); // the word fits in the current line, keep it
//             }
//         }
//     });
// }



//     function renderGraph(data) {
//       d3.select('#graph-container').selectAll("*").remove();     
//       const contentHeight = d3.select('#graph-container').node().getBoundingClientRect().height;
//       const maxHeight = 700;
//        // Adjust the left margin as needed
//       d3.select('#graph-container').style('height', `${Math.min(contentHeight, maxHeight)}px`);   
        
//         // wrap all text
//         const padding = 80;
//         let maxX = Math.max(...data.nodes.map(node => node.x + node.width / 2));
//         let maxY = Math.max(...data.nodes.map(node => node.y + node.height / 2));
//         maxX += padding;
//         maxY += padding;

//         const svgWidth = maxX;
//         const svgHeight = maxY;
//         const lineHeight = 200;
//         const headingY = 350;
//         const headingX = 360;
//         const nodeHeight = 250;
//         const topMargin = 200; // Space for the heading
//         const bottomMargin = 50; // Space after the last node
//         const marginLeft = 350; // Adjust the left margin as needed
//         const marginRight = 100; // Adjust the right margin as needed
//         const extraSpace = 1200; // Additional space towards the right
//         const viewBox = `-${marginLeft} 0 ${maxX + marginLeft + marginRight + extraSpace} ${50}`;


//         // console.log(svgWidth)
   
//         const svg = d3
//         .select('#graph-container')
//         .append('svg')
//         .attr('preserveAspectRatio', 'xMinYMin meet')
//         .attr('width', '90%')
//         .attr('height', svgHeight) // Set the SVG height to the svgHeight variable
//         .attr('viewBox', viewBox) // Make sure the viewBox includes all content
//         .append('g')
//         .attr('transform', 'translate(50,0)');
   
//         const nodeColors = {
//           'Damage Scenario': '#00709a',
//           'Risk': ' #e6858d',
//           'Threat': '#e6df85',
//           'Security Goals': '#22a89e',
//           // 'Security Controls': '#ff3333',
//         };
   
   
//         svg.append('text')
//           .attr('x', svgWidth / 2) // Centered
//           .attr('y', topMargin) // Below the top of the SVG
//           .attr('text-anchor', 'middle')
//           .style('font-size', '80px')
//           .style('font-weight', 'bold')
//           .text("Tracebility graph");
   
   
         
       
//         // After rendering the graph
//         d3.select('body').on('keydown', function (event) {
//           if (event.key === 'Alt') {
//             event.preventDefault(); // Prevents the default action of the Alt key
//           }
//         });
       
       
//         // Function to calculate node width based on text length
//         const calculateNodeWidth = (text, fontSize) => {
//           const canvas = document.createElement('canvas');
//           const context = canvas.getContext('2d');
//           context.font = `${fontSize}px Arial`; // Set the font size
//           const textWidth = context.measureText(text).width;
//           const padding = 10; // Adjust padding as needed
//           return textWidth + padding * 2; // Add padding to the text width
//         };
        
   
//         data.nodes.forEach((node) => {
//           const minFontSize = 20;
//           const maxFontSize = 30;
//           const initialFontSize = Math.min(
//             node.width / node.name.length,
//             maxFontSize
//           );
   
//           node.fontSize = Math.max(initialFontSize, minFontSize);
//           node.width = calculateNodeWidth(node.name, node.fontSize);
//           node.height = node.fontSize * 12;
//           node.column = node.type
//         });
   
//         let maxNodeWidth = Math.max(...data.nodes.map(node => calculateNodeWidth(node.name)));
   
//         const typePositions = {
//           'Damage Scenario': -255,
//           'Risk': 1050,
//           'Threat': 2500,
//           'Security Goals': 4000,
//           // 'Security Controls': 5500
//         };
//         const nodesByType = {
//           'Damage Scenario': [],
//           'Risk': [],
//           'Threat': [],
//           'Security Goals': [],
//           // 'Security Controls': []
//         };
//         const verticalGap = 20;
//         const horizontalGap = 40;
//         data.nodes.forEach((node) => {
//           node.x += marginLeft;
//           nodesByType[node.type].push(node);
//         });
   
//         Object.keys(nodesByType).forEach((type, typeIndex) => {
//           let yOffset = topMargin + headingY; // Start position for the first type
        
//           nodesByType[type].forEach((node, index) => {
//             node.x = typePositions[type] + (marginLeft+horizontalGap); // x is constant for each type column
//             node.y = yOffset + (nodeHeight + verticalGap) * index; // y increases with index
//             node.width = maxNodeWidth; // Set width to maximum width calculated
//             node.height = nodeHeight;
//           });

//           yOffset += nodesByType[type].length * (nodeHeight + verticalGap);
//     });
   
//         Object.keys(typePositions).forEach((type) => {
//           svg
//             .append('text')
//             .attr('x', typePositions[type]+250)
//             .attr('y', headingY)
//             .attr('text-anchor', 'middle')
//             .style('font-size', '80px')
//             .style('font-weight', 'bold')
//             .text(type);
//         });
        
   
//         data.links.forEach((link) => {
//           if (typeof link.source === 'string') {
//             link.source = data.nodes.find((n) => n.id === link.source);
//           }
//           if (typeof link.target === 'string') {
//             link.target = data.nodes.find((n) => n.id === link.target);
//           }
//         });
   
//         const linkGenerator = d3
//         .linkHorizontal()
//         .x(d => d.x)
//         .y(d => d.y)
//         .source(d => ({ x: d.source.x + maxNodeWidth / 2, y: d.source.y + nodeHeight / 2-150}))
//         .target(d => ({ x: d.target.x - maxNodeWidth / 2, y: d.target.y + nodeHeight / 2-150}));
      
//         const elementsGroup = svg.append('g');
   
//         const link = elementsGroup
//           .selectAll('.link')
//           .data(data.links)
//           .enter()
//           .append('path')
//           .attr('class', 'link')
//           .attr('d', linkGenerator)
//           .style('stroke', '#003311')
//           .style('fill', 'none')
//           .style('stroke-width', 6);
   
//         const node = elementsGroup
//         .selectAll('.node')
//         .data(data.nodes)
//         .enter()
//         .append('rect')
//         .attr('class', 'node')
//         .attr('width', maxNodeWidth)
//         .attr('height', nodeHeight)
//         .attr('rx', 30) // Set the x-axis radius for rounded corners
//         .attr('ry', 30)
//         .style('fill', (d) => nodeColors[d.type])
//         .attr('x', (d) => d.x - maxNodeWidth / 2)
//         .attr('y', (d) => d.y - nodeHeight / 2)

//         const maxLines = 2;
//         const lineHeightPixels = 50; // height per line of text in pixels, adjust as needed
//         const maxTextHeight = maxLines * lineHeightPixels;
//         const label = elementsGroup
//         .selectAll('.label')
//         .data(data.nodes)
//         .enter()
//         .append('text')
//         .attr('class', 'label')
//         .attr('data-width', (d) => d.width) // Assuming each node has a width attribute
//         .text((d) => d.name)
//         .attr('x', (d) => d.x)
//         .attr('y', (d) => d.y)
//         .style('font-weight', 'bold')
//         .style('font-size','50px')
//         .style('text-anchor', 'middle')
//         .style('alignment-baseline', 'middle')
//         .call(wrapAndTruncateText, 800, maxTextHeight)
//         .each(function(d) {
//           // Append a title element which is used for the tooltip text
//           d3.select(this).append('title').text(d.name);
//         });
  
   
//         label.each(function (d) {
//           const bbox = this.getBBox();
//           const padding = 4;
//           d.width = Math.max(d.width);
//           d.height = Math.max(d.height, bbox.height + padding * 2);
//         });
   
//         elementsGroup
//           .selectAll('.node')
//           .attr('width', (d) => d.width)
//           .attr('height', (d) => d.height);
   
//         const nodeElements = {};
//         node.each(function (d) {
//           nodeElements[d.id] = this;
//         });
   
//         const linkElements = {};
//         link.each(function (d) {
//           linkElements[d.index] = this;
//         });
   
//         function highlightPath(nodeData) {
//           // Remove any existing highlighted or bold classes
//           elementsGroup.selectAll('.node, .link').classed('highlighted bold', false);
        
//           // Highlight and bold the selected node
//           d3.select(nodeElements[nodeData.id]).classed('highlighted bold', true);
        
//           const visitedNodes = new Set();
        
//           function highlightPathDFS(node) {
//             visitedNodes.add(node.id);
        
//             data.links.forEach((link) => {
//               if (link.source.id === node.id && !visitedNodes.has(link.target.id)) {
//                 d3.select(linkElements[link.index]).classed('highlighted bold', true);
//                 d3.select(nodeElements[link.target.id]).classed('highlighted bold', true);
//                 highlightPathDFS(link.target);
//               } else if (link.target.id === node.id && !visitedNodes.has(link.source.id)) {
//                 d3.select(linkElements[link.index]).classed('highlighted bold', true);
//                 d3.select(nodeElements[link.source.id]).classed('highlighted bold', true);
//                 highlightPathDFS(link.source);
//               }
//             });
//           }
        
//           highlightPathDFS(nodeData);
//         }
   
//         elementsGroup.selectAll('.node, .link').on('click', function (event, d) {
//           highlightPath(d);
//         });
   
//         svg
//           .append('style')
//           .text(`
//           .node.highlighted, .link.highlighted {
//               fill: white;
//               stroke: #595959;
//               stroke-width: 8px;
//           }
//           .link.highlighted {
//               stroke: red;
//               stroke-width: 3px;
//           }
//       `);
   
//         d3.selectAll('#graph-container svg:not(:first-child)').remove();;
//       }

//     useEffect(() => {
//         renderGraph(data)
//     }, [data]);
//     console.log("data of ds",data)

//     return (
//       <div>
//         <div id="graph-container" style={{ width: '100%', height: '90vh' }}></div>
//         {/* <button onClick={exportToPDF} style={{ marginTop: '20px' }}>Export to PDF</button> */}
//       </div>
//     );
// }

// export default Tracebility1





import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TracebilityGraph.css';
import { jsPDF } from 'jspdf';

function Tracebility1({data}) {
 
  // const svgToCanvas = (callback) => {
  //   const svgElement = document.querySelector('#graph-container svg');
  //   const serializer = new XMLSerializer();
  //   const svgStr = serializer.serializeToString(svgElement);
  
  //   // Create a blob from the SVG string
  //   const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  //   const url = URL.createObjectURL(svgBlob);
  
  //   const img = new Image();
  //   img.onload = () => {
  //     // Set canvas size to match image size
  //     const canvas = document.createElement('canvas');
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  
  //     const ctx = canvas.getContext('2d');
  //     ctx.drawImage(img, 0, 0);
  
  //     // Proceed with callback
  //     callback(canvas);
  
  //     // Clean up URL
  //     URL.revokeObjectURL(url);
  //   };
  //   img.onerror = () => {
  //     console.error('Error loading SVG image');
  //   };
  //   img.src = url;
  // };

  // New function to export the graph as a PDF
  const exportToPDF = () => {
    const nodeColors = {
      'Damage Scenario': '#00709a',
      'Risk': '#e6858d',
      'Threat': '#e6df85',
      'Security Goals': '#22a89e',
      // 'Security Controls': '#ff8c8c'
    };
  
    // Calculate the bounds of the graph to determine scaling
    const bounds = data.nodes.reduce((acc, node) => {
      return {
        minX: Math.min(node.x, acc.minX),
        maxX: Math.max(node.x + node.width, acc.maxX),
        minY: Math.min(node.y, acc.minY),
        maxY: Math.max(node.y + node.height, acc.maxY),
      };
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  
    const pdfWidth = 800;
    const pdfHeight = 700;
    // Use full bounds to calculate width and height
    const graphWidth = bounds.maxX - bounds.minX;
    const graphHeight = bounds.maxY - bounds.minY;
    const scaleX = pdfWidth / graphWidth;
    const titleAndHeadingsHeight = 60;
    const columnWidth = graphWidth / Object.keys(nodeColors).length;
    const scaleY = (pdfHeight - titleAndHeadingsHeight) / graphHeight;
    const scaleFactor = Math.min(scaleX, scaleY) * 0.95; // Apply a uniform scale factor
    
    // Calculate offsets to center the graph
    const offsetX = (pdfWidth - graphWidth * scaleFactor) / 2;
    const offsetY = (pdfHeight - graphHeight * scaleFactor) / 2 + titleAndHeadingsHeight;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [pdfWidth, pdfHeight],
    });
  
    // Set the title for the graph
    const title = "Traceability Graph";
    const titleFontSize = 22;
    pdf.setTextColor('#000000');
    pdf.setFontSize(titleFontSize);
    pdf.text(title, pdfWidth / 2, titleFontSize + 10, { align: 'center' });


    const drawColumnHeadings = () => {
      Object.keys(nodeColors).forEach((heading, index) => {
        // Calculate the center of the current column
        const columnCenterX = (bounds.minX + (index + 0.5) * columnWidth) * scaleFactor + offsetX;
        const columnCenterY = titleFontSize + 20; // Adjust the y-coordinate as needed
  
        // Draw the heading above the center of the column
        pdf.setTextColor('#000000');
        pdf.setFontSize(12); // Smaller font size for headings
        pdf.text(heading, columnCenterX, columnCenterY, { align: 'center' });
      });
    };


    drawColumnHeadings();
  
    // Draw the nodes with the recalculated positions and sizes
    data.nodes.forEach(node => {
      const x = (node.x - bounds.minX) * scaleFactor + offsetX;
      const y = (node.y - bounds.minY) * scaleFactor + offsetY;
      const width = node.width * scaleFactor;
      const height = node.height * scaleFactor;
      const color = nodeColors[node.type] || '#000';
  
      pdf.setFillColor(color);
      pdf.rect(x, y, width, height, 'F');
  
      // Adjust the font size if necessary
      const fontSize = 10; // Adjust as needed
      pdf.setFontSize(fontSize);
      pdf.setTextColor('#000000');
      pdf.text(node.name, x + width / 2, y + height / 2, { align: 'center', maxWidth: width - 10 });
    });
  
    // Draw the links with the recalculated positions
    data.links.forEach(link => {
      const source = data.nodes.find(n => n.id === link.source);
      const target = data.nodes.find(n => n.id === link.target);
      if (!source || !target) return;
  
      const startX = (source.x - bounds.minX + source.width / 2) * scaleFactor + offsetX;
      const startY = (source.y - bounds.minY + source.height / 2) * scaleFactor + offsetY;
      const endX = (target.x - bounds.minX + target.width / 2) * scaleFactor + offsetX;
      const endY = (target.y - bounds.minY + target.height / 2) * scaleFactor + offsetY;
  
      pdf.setDrawColor('#333333');
      pdf.setLineWidth(1);
      pdf.line(startX, startY, endX, endY);
    });
  
    pdf.save('traceability-graph.pdf');
  };
  
  

  
  

  useEffect(() => {
    renderGraph(data);
  }, [data]);

  function wrapAndTruncateText(selection, maxWidth, maxHeight) {
    selection.each(function(d) {
        const textElement = d3.select(this);
        let words = textElement.text().split(/\s+/);
        let line = [];
        let lineNumber = 0;
        let lineHeight = 1.2; // ems, adjust as needed for your font-size
        let x = textElement.attr('x');
        let y = textElement.attr('y');
        let dy = 0; // we reset dy because we will calculate the line position dynamically
        let tspan = textElement.text(null).append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', `${dy}em`);

        for (let i = 0; i < words.length; i++) {
            let testLine = line.concat(words[i]);
            tspan.text(testLine.join(" "));
            if (tspan.node().getComputedTextLength() > maxWidth && i > 0) {
                line.pop(); // remove last word
                tspan.text(line.join(" ")); // set the text for tspan before breaking
                if ((lineNumber + 1) * lineHeight * parseInt(textElement.style('font-size')) < maxHeight) {
                    line = [words[i]]; // start a new line with the last word
                    tspan = textElement.append('tspan') // add another tspan for the next line
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', `${++lineNumber * lineHeight}em`)
                        .text(words[i]);
                } else {
                    tspan.text(tspan.text() + '...'); // add ellipses and break out of loop
                    break;
                }
            } else {
                line.push(words[i]); // the word fits in the current line, keep it
            }
        }
    });
}



    function renderGraph(data) {
      d3.select('#graph-container').selectAll("*").remove();     
      const contentHeight = d3.select('#graph-container').node().getBoundingClientRect().height;
      const maxHeight = 700;
       // Adjust the left margin as needed
      d3.select('#graph-container').style('height', `${Math.min(contentHeight, maxHeight)}px`);   
        
        // wrap all text
        const padding = 80;
        let maxX = Math.max(...data.nodes.map(node => node.x + node.width / 2));
        let maxY = Math.max(...data.nodes.map(node => node.y + node.height / 2));
        maxX += padding;
        maxY += padding;

        const svgWidth = maxX;
        const svgHeight = maxY;
        const lineHeight = 200;
        const headingY = 350;
        const headingX = 360;
        const nodeHeight = 250;
        const topMargin = 200; // Space for the heading
        const bottomMargin = 50; // Space after the last node
        const marginLeft = 350; // Adjust the left margin as needed
        const marginRight = 100; // Adjust the right margin as needed
        const extraSpace = 1200; // Additional space towards the right
        const viewBox = `-${marginLeft} 0 ${maxX + marginLeft + marginRight + extraSpace} ${50}`;


        // console.log(svgWidth)
   
        const svg = d3
        .select('#graph-container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('width', '90%')
        .attr('height', svgHeight) // Set the SVG height to the svgHeight variable
        .attr('viewBox', viewBox) // Make sure the viewBox includes all content
        .append('g')
        .attr('transform', 'translate(50,0)');
   
        const nodeColors = {
          'Damage Scenario': '#00709a',
          'Risk': ' #e6858d',
          'Threat': '#e6df85',
          'Security Goals': '#22a89e',
          'Security Controls': '#ff3333',
        };
   
   
        svg.append('text')
          .attr('x', svgWidth / 2) // Centered
          .attr('y', topMargin) // Below the top of the SVG
          .attr('text-anchor', 'middle')
          .style('font-size', '80px')
          .style('font-weight', 'bold')
          .text("Tracebility graph");
   
   
         
       
        // After rendering the graph
        d3.select('body').on('keydown', function (event) {
          if (event.key === 'Alt') {
            event.preventDefault(); // Prevents the default action of the Alt key
          }
        });
       
       
        // Function to calculate node width based on text length
        const calculateNodeWidth = (text, fontSize) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          context.font = `${fontSize}px Arial`; // Set the font size
          const textWidth = context.measureText(text).width;
          const padding = 10; // Adjust padding as needed
          return textWidth + padding * 2; // Add padding to the text width
        };
        
   
        data.nodes.forEach((node) => {
          const minFontSize = 20;
          const maxFontSize = 30;
          const initialFontSize = Math.min(
            node.width / node.name.length,
            maxFontSize
          );
   
          node.fontSize = Math.max(initialFontSize, minFontSize);
          node.width = calculateNodeWidth(node.name, node.fontSize);
          node.height = node.fontSize * 12;
          node.column = node.type
        });
   
        let maxNodeWidth = Math.max(...data.nodes.map(node => calculateNodeWidth(node.name)));
   
        const typePositions = {
          'Damage Scenario': -255,
          'Risk': 1050,
          'Threat': 2500,
          'Security Goals': 4000,
          // 'Security Controls': 5500
        };
        const nodesByType = {
          'Damage Scenario': [],
          'Risk': [],
          'Threat': [],
          'Security Goals': [],
          // 'Security Controls': []
        };
        const verticalGap = 20;
        const horizontalGap = 40;
        data.nodes.forEach((node) => {
          node.x += marginLeft;
          nodesByType[node.type].push(node);
        });
   
        Object.keys(nodesByType).forEach((type, typeIndex) => {
          let yOffset = topMargin + headingY; // Start position for the first type
        
          nodesByType[type].forEach((node, index) => {
            node.x = typePositions[type] + (marginLeft+horizontalGap); // x is constant for each type column
            node.y = yOffset + (nodeHeight + verticalGap) * index; // y increases with index
            node.width = maxNodeWidth; // Set width to maximum width calculated
            node.height = nodeHeight;
          });

          yOffset += nodesByType[type].length * (nodeHeight + verticalGap);
    });
   
        Object.keys(typePositions).forEach((type) => {
          svg
            .append('text')
            .attr('x', typePositions[type]+250)
            .attr('y', headingY)
            .attr('text-anchor', 'middle')
            .style('font-size', '80px')
            .style('font-weight', 'bold')
            .text(type);
        });
        
   
        data.links.forEach((link) => {
          if (typeof link.source === 'string') {
            link.source = data.nodes.find((n) => n.id === link.source);
          }
          if (typeof link.target === 'string') {
            link.target = data.nodes.find((n) => n.id === link.target);
          }
        });
   
        const linkGenerator = d3
        .linkHorizontal()
        .x(d => d.x)
        .y(d => d.y)
        .source(d => ({ x: d.source.x + maxNodeWidth / 2, y: d.source.y + nodeHeight / 2-150}))
        .target(d => ({ x: d.target.x - maxNodeWidth / 2, y: d.target.y + nodeHeight / 2-150}));
      
        const elementsGroup = svg.append('g');
   
        const link = elementsGroup
          .selectAll('.link')
          .data(data.links)
          .enter()
          .append('path')
          .attr('class', 'link')
          .attr('d', linkGenerator)
          .style('stroke', '#003311')
          .style('fill', 'none')
          .style('stroke-width', 6);
   
        const node = elementsGroup
        .selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('rect')
        .attr('class', 'node')
        .attr('width', maxNodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 30) // Set the x-axis radius for rounded corners
        .attr('ry', 30)
        .style('fill', (d) => nodeColors[d.type])
        .attr('x', (d) => d.x - maxNodeWidth / 2)
        .attr('y', (d) => d.y - nodeHeight / 2)

        const maxLines = 2;
        const lineHeightPixels = 50; // height per line of text in pixels, adjust as needed
        const maxTextHeight = maxLines * lineHeightPixels;
        const label = elementsGroup
        .selectAll('.label')
        .data(data.nodes)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('data-width', (d) => d.width) // Assuming each node has a width attribute
        .text((d) => d.name)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .style('font-weight', 'bold')
        .style('font-size','50px')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'middle')
        .call(wrapAndTruncateText, 800, maxTextHeight)
        .each(function(d) {
          // Append a title element which is used for the tooltip text
          d3.select(this).append('title').text(d.name);
        });
  
   
        label.each(function (d) {
          const bbox = this.getBBox();
          const padding = 4;
          d.width = Math.max(d.width);
          d.height = Math.max(d.height, bbox.height + padding * 2);
        });
   
        elementsGroup
          .selectAll('.node')
          .attr('width', (d) => d.width)
          .attr('height', (d) => d.height);
   
        const nodeElements = {};
        node.each(function (d) {
          nodeElements[d.id] = this;
        });
   
        const linkElements = {};
        link.each(function (d) {
          linkElements[d.index] = this;
        });
   
        function highlightPath(nodeData) {
          // Remove any existing highlighted or bold classes
          elementsGroup.selectAll('.node, .link').classed('highlighted bold', false);
        
          // Highlight and bold the selected node
          d3.select(nodeElements[nodeData.id]).classed('highlighted bold', true);
        
          const visitedNodes = new Set();
        
          function highlightPathDFS(node) {
            visitedNodes.add(node.id);
        
            data.links.forEach((link) => {
              if (link.source.id === node.id && !visitedNodes.has(link.target.id)) {
                d3.select(linkElements[link.index]).classed('highlighted bold', true);
                d3.select(nodeElements[link.target.id]).classed('highlighted bold', true);
                highlightPathDFS(link.target);
              } else if (link.target.id === node.id && !visitedNodes.has(link.source.id)) {
                d3.select(linkElements[link.index]).classed('highlighted bold', true);
                d3.select(nodeElements[link.source.id]).classed('highlighted bold', true);
                highlightPathDFS(link.source);
              }
            });
          }
        
          highlightPathDFS(nodeData);
        }
   
        elementsGroup.selectAll('.node, .link').on('click', function (event, d) {
          highlightPath(d);
        });
   
        svg
          .append('style')
          .text(`
          .node.highlighted, .link.highlighted {
              fill: white;
              stroke: #595959;
              stroke-width: 8px;
          }
          .link.highlighted {
              stroke: red;
              stroke-width: 3px;
          }
      `);
   
        d3.selectAll('#graph-container svg:not(:first-child)').remove();;
      }

    useEffect(() => {
        renderGraph(data)
    }, [data]);
    console.log("data of ds",data)

    return (
      <div>
        <div id="graph-container" style={{ width: '75vw', height: '90vh' }}></div>
        <button onClick={exportToPDF} style={{ marginTop: '20px' }}>Export to PDF</button>
      </div>
    );
}

export default Tracebility1
