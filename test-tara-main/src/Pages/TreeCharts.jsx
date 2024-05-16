// App.js
import React, { useEffect,useState,useRef, useImperativeHandle, forwardRef } from 'react';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { Promise } from 'bluebird'; // Consider using Bluebird for better control over promise concurrency
import axios from 'axios'
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import html2canvas from 'html2canvas'; 



// ...

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true,  // must be set to allow for model change listening
        'isReadOnly':false,
        //'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 50 }),
        model: new go.TreeModel(
          {
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          }),
        allowCopy: false,
        allowDelete: false,
        //initialAutoScale: go.Diagram.Uniform,
        maxSelectionCount: 1, // users can select only one part at a time
        validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
        "clickCreatingTool.insertPart": function(loc) {  // method override must be function, not =>
          const node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
          if (node !== null) {
            this.diagram.select(node);
            this.diagram.commandHandler.scrollToPart(node);
            this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
          }
          return node;
        },
        layout:
          $(go.TreeLayout,
            {
              treeStyle: go.TreeLayout.StyleLastParents,
              arrangement: go.TreeLayout.ArrangementVertical,
              // properties for most of the tree:
              angle: 90,
              layerSpacing: 35,
              // properties for the "last parents":
              alternateAngle: 90,
              alternateLayerSpacing: 35,
              alternateAlignment: go.TreeLayout.AlignmentBus,
              alternateNodeSpacing: 20
            }),
      });

      function mayWorkFor(node1, node2) {
        if (!(node1 instanceof go.Node)) return false;  // must be a Node
        if (node1 === node2) return false;  // cannot work for yourself
        if (node2.isInTreeOf(node1)) return false;  // cannot work for someone who works for you
        const data1 = node1.data; // Data of the node selected by mouse
        const data2 = node2.data; // Data of the node to be dropped on
        console.log("data1 and data2",data1.category,data2.category);
        if (data1.category === "LeafNode" && data2.category === "LogicNode") return true;
        if (data1.category === "LeafNode" && data2.category === "LeafNode") return false;
        if (data1.category === "LogicNode" && data2.category === "LogicNode") return true;
        if (data1.category === "LogicNode" && data2.category === "LeafNode") return false;
        return true;
      }
    
      // This function provides a common style for most of the TextBlocks.
      // Some of these values may be overridden in a particular TextBlock.
      function textStyle() {
        return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
      }
    
      // This converter is used by the Picture.
      function findHeadShot(pic) {
        if (!pic) return "images/HSnopic.png"; // There are only 16 images on the server
        return "images/HS" + pic;
      }
    


      diagram.addDiagramListener("Modified", e => {
        const button = document.getElementById("SaveButton");
        if (button) button.disabled = !diagram.isModified;
        const idx = document.title.indexOf("*");
        if (diagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.slice(0, idx);
        }
      });

      const levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
      "#008299", "#D24726", "#008A00", "#094AB2"];
  

      diagram.layout.commitNodes = function() {  // method override must be function, not =>
        go.TreeLayout.prototype.commitNodes.call(this);  // do the standard behavior
        // then go through all of the vertexes and set their corresponding node's Shape.fill
        // to a brush dependent on the TreeVertex.level value
        diagram.layout.network.vertexes.each(v => {
          if (v.node) {
            const level = v.level % (levelColors.length);
            const color = levelColors[level];
            const shape = v.node.findObject("SHAPE");
            if (shape) shape.stroke = $(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
          }
        });
      };


      // Template for nodes with type "type1"
    diagram.nodeTemplate=
    $(go.Node, 'Auto',
    {width:150},
    // the Shape will go around the TextBlock
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, 'RoundedRectangle',
      { name: 'SHAPE', fill: '#87ceeb', strokeWidth: 0 },
      // Shape.fill is bound to Node.data.color
      new go.Binding('fill', 'color')),
      $(go.Panel, "Table",
      { defaultAlignment: go.Spot.Left },
      // TextBlock row
      $(go.TextBlock,
        { 
          margin: 12, 
          editable: true, 
          row: 0,  // Place in the first row
          column: 0,
          alignment: go.Spot.Top
        },
        new go.Binding('text').makeTwoWay()
      ),
      $(go.Panel, "Vertical",
          {
            row: 1,  // Assuming this is the row where your toggle button is located
            column: 0,
            alignment: go.Spot.Center, // Align the panel at the center
          },
          // define the panel where the text will appear
          $(go.Panel, "Table",
            {
              minSize: new go.Size(150, NaN),
              margin: new go.Margin(6, 10, 0, 6),
              defaultAlignment: go.Spot.Center,  // Align elements within the panel at the center horizontally
            },
            
            $(go.RowColumnDefinition, { column: 0, width: 30 }), // Column definition for "Ac"
            $(go.RowColumnDefinition, { column: 1, width: 30 }), // Column definition for "Ex"
            $(go.RowColumnDefinition, { column: 2, width: 30 }), // Column definition for "Eq"
            $(go.RowColumnDefinition, { column: 3, width: 30 }), // Column definition for "K"
            $(go.RowColumnDefinition, { column: 4, width: 30 }), // Column definition for "T"
            $(go.TextBlock, "Ac ", textStyle(),
              { row: 0, column: 0 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 1, column: 0,
                editable: true, isMultiline: false,

              },
              new go.Binding("text", "access").makeTwoWay()),
            $(go.TextBlock, "Ex ", textStyle(),
              { row: 0, column: 1 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 1, column: 1,
                editable: true, isMultiline: false,
              },
              new go.Binding("text", "expertise").makeTwoWay()),
            $(go.TextBlock, "Eq ", textStyle(),
              { row: 0, column: 2 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 1, column: 2,
                editable: true, isMultiline: false,
              },
              new go.Binding("text", "equipment").makeTwoWay()),
            $(go.TextBlock, "K ", textStyle(),
              { row: 0, column: 3 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 1, column: 3,
                editable: true, isMultiline: false,
              },
              new go.Binding("text", "knowledge").makeTwoWay()),
            $(go.TextBlock, "T ", textStyle(),
              { row: 0, column: 4 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 1, column: 4,
                editable: true, isMultiline: false,
              },
              new go.Binding("text", "time").makeTwoWay()),
            // TextBlock bindings for values go here
          )
        ),
  
      // Panel (button) row
      $(go.Panel, "Auto",
        {
            row: 3,  // Assuming this is the row where your toggle button is located
            column: 0,
            alignment: go.Spot.Bottom,
            click: function(e, obj) { // Adjusted click handler
              var node = obj.part;
              if (node !== null) {
                var data = node.data;
                var newType = data.logicType === "AND" ? "OR" : "AND";
                e.diagram.model.startTransaction("toggleLogicType");
                e.diagram.model.props.setDataProperty(data, "logicType", newType);
                e.diagram.model.commitTransaction("toggleLogicType");
              }
            }
        },
          $(go.Shape, "Rectangle", { fill: "lightgray", strokeWidth: 0, desiredSize: new go.Size(60, 30) }),
          $(go.TextBlock,
            { margin: 4, font: "bold 12px sans-serif", textAlign: "center", width: 60 },
            new go.Binding("text", "logicType"))
        ),
        
        

      $("TreeExpanderButton",
        {
          margin:4,
          row: 4,  // Third row
          column: 0,
          alignment: go.Spot.Bottom,
          opacity: 0,  // Initially not visible
          "_treeExpandedFigure": "TriangleUp",
          "_treeCollapsedFigure": "TriangleDown",
        },
        new go.Binding("opacity", "isSelected", function(s) { return s ? 1 : 0; }).ofObject(),
        new go.Binding("isTreeExpanded").makeTwoWay()
      ),
      

    ),
    {
      locationSpot: go.Spot.Left,
      selectionAdorned: false
    },
  {
    click: function(e, node) {
      // Check if it's a simple click (left click)
      if (e.event.button===0) {
        e.diagram.startTransaction("toggle selection");
        node.isSelected = !node.isSelected;
        e.diagram.commitTransaction("toggle selection");
      }
    }
  },
  {
    selectionObjectName: "BODY",
    mouseEnter: (e, node) => node.findObject("BUTTON").opacity = node.findObject("BUTTONX").opacity = 1,
    mouseLeave: (e, node) => node.findObject("BUTTON").opacity = node.findObject("BUTTONX").opacity = 0,
    // handle dragging a Node onto a Node to (maybe) change the reporting relationship
    mouseDragEnter: (e, node, prev) => {
      const diagram = node.diagram;
      const selnode = diagram.selection.first();
      if (!mayWorkFor(selnode, node)) return;
      const shape = node.findObject("SHAPE");
      if (shape) {
        shape._prevFill = shape.fill;  // remember the original brush
        shape.fill = "darkred";
      }
    },
    mouseDragLeave: (e, node, next) => {
      const shape = node.findObject("SHAPE");
      if (shape && shape._prevFill) {
        shape.fill = shape._prevFill;  // restore the original brush
      }
    },
    mouseDrop: (e, node) => {
      const diagram = node.diagram;
      const selnode = diagram.selection.first();  // assume just one Node in selection
      if (mayWorkFor(selnode, node)) {
        // find any existing link into the selected node
        const link = selnode.findTreeParentLink();
        if (link !== null) {  // reconnect any existing link
          link.fromNode = node;
        } else {  // else create a new link
          diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
        }
      }
    }
  },
 


  // for sorting, have the Node.text be the data.name
  new go.Binding("text", "name"),
  // bind the Part.layerName to control the Node's layer depending on whether it isSelected
  new go.Binding("layerName", "isSelected", sel => sel ? "Foreground" : "").ofObject(),
  // end Auto Panel
  $("Button",
    $(go.Shape, "PlusLine", { width: 10, height: 10 }),
    {
      name: "BUTTON", alignment: go.Spot.Right, opacity: 0,  // initially not visible
      click: showContextMenu//(e, button) => addEmployee(button.part)
    },
    // button is visible either when node is selected or on mouse-over
    new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
  ),
  new go.Binding("isTreeExpanded").makeTwoWay(),
  $("TreeExpanderButton",
    {
      name: "BUTTONX", alignment: go.Spot.Bottom, opacity: 0,  // initially not visible
      "_treeExpandedFigure": "TriangleUp",
      "_treeCollapsedFigure": "TriangleDown"
    },
    // button is visible either when node is selected or on mouse-over
    new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
  ),
  {
    contextMenu:
      $(go.Adornment, "ContextMenu",
        $(go.Panel, "Vertical",
          $("ContextMenuButton",
            $(go.TextBlock, "Add LeafNode"),
            { click: (e,button)=>addEmployee(button.part)}
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Vacate Position"),
            { 
              click: (e, button) => {
                const node = button.part.adornedPart;
                if (node !== null) {
                  const thisemp = node.data;
                  diagram.startTransaction("vacate");
                  // update the key, name, picture, and comments, but leave the title
                  diagram.model.props.setDataProperty(thisemp, "name", "(Vacant)");
                  diagram.model.props.setDataProperty(thisemp, "pic", "");
                  diagram.model.props.setDataProperty(thisemp, "comments", "");
                  diagram.commitTransaction("vacate");
                }
              }
            }
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Remove Role"),
            { 
              click: (e, button) => {
                // reparent the subtree to this node's boss, then remove the node
                const node = button.part.adornedPart;
                if (node !== null) {
                  diagram.startTransaction("reparent remove");
                  const chl = node.findTreeChildrenNodes();
                  // iterate through the children and set their parent key to our selected node's parent key
                  while (chl.next()) {
                    const emp = chl.value;
                    diagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
                  }
                  // and now remove the selected node itself
                  diagram.model.removeNodeData(node.data);
                  diagram.commitTransaction("reparent remove");
                }
              }
            }
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Remove Department"),
            { 
              click: (e, button) => {
                // remove the whole subtree, including the node itself
                const node = button.part.adornedPart;
                if (node !== null) {
                  diagram.startTransaction("remove dept");
                  diagram.removeParts(node.findTreeParts());
                  diagram.commitTransaction("remove dept");
                }
              }
            }
          )
        )
      )
  }
  )

  diagram.nodeTemplateMap.add("HeadNode",
      $(go.Node, 'Auto',
        {width:150},
        // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          { name: 'SHAPE', fill: '#87ceeb', strokeWidth: 0 },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
          $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          // TextBlock row
          $(go.TextBlock,
            { 
              margin: 12, 
              editable: true, 
              row: 0,  // Place in the first row
              column: 0,
              alignment: go.Spot.Top
            },
            new go.Binding('text').makeTwoWay()
          ),
          $(go.Panel, "Vertical",
              {
                row: 1,  // Assuming this is the row where your toggle button is located
                column: 0,
                alignment: go.Spot.Center, // Align the panel at the center
              },
              // define the panel where the text will appear
              $(go.Panel, "Table",
                {
                  minSize: new go.Size(150, NaN),
                  margin: new go.Margin(6, 10, 0, 6),
                  defaultAlignment: go.Spot.Center,  // Align elements within the panel at the center horizontally
                },
                
                $(go.RowColumnDefinition, { column: 0, width: 30 }), // Column definition for "Ac"
                $(go.RowColumnDefinition, { column: 1, width: 30 }), // Column definition for "Ex"
                $(go.RowColumnDefinition, { column: 2, width: 30 }), // Column definition for "Eq"
                $(go.RowColumnDefinition, { column: 3, width: 30 }), // Column definition for "K"
                $(go.RowColumnDefinition, { column: 4, width: 30 }), // Column definition for "T"
                $(go.TextBlock, "Ac ", textStyle(),
                  { row: 0, column: 0 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 0,
                    editable: true, isMultiline: false,

                  },
                  new go.Binding("text", "access").makeTwoWay()),
                $(go.TextBlock, "Ex ", textStyle(),
                  { row: 0, column: 1 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 1,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "expertise").makeTwoWay()),
                $(go.TextBlock, "Eq ", textStyle(),
                  { row: 0, column: 2 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 2,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "equipment").makeTwoWay()),
                $(go.TextBlock, "K ", textStyle(),
                  { row: 0, column: 3 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 3,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "knowledge").makeTwoWay()),
                $(go.TextBlock, "T ", textStyle(),
                  { row: 0, column: 4 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 4,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "time").makeTwoWay()),
                // TextBlock bindings for values go here
              )
            ),
      
          // Panel (button) row
          $(go.Panel, "Auto",
            {
                row: 3,  // Assuming this is the row where your toggle button is located
                column: 0,
                alignment: go.Spot.Bottom,
                click: function(e, obj) { // Adjusted click handler
                  var node = obj.part;
                  if (node !== null) {
                    var data = node.data;
                    console.log('node data',node.data)
                    var newType = data.logicType === "AND" ? "OR" : "AND";
                    e.diagram.model.startTransaction("toggleLogicType");
                    e.diagram.model.setDataProperty(data, "logicType", newType);
                    e.diagram.model.commitTransaction("toggleLogicType");
                  }
                }
            },
              $(go.Shape, "Rectangle", { fill: "lightgray", strokeWidth: 0, desiredSize: new go.Size(60, 30) }),
              $(go.TextBlock,
                { margin: 4, font: "bold 12px sans-serif", textAlign: "center", width: 60 },
                new go.Binding("text", "logicType"))
            ),
            
            

          $("TreeExpanderButton",
            {
              margin:4,
              row: 4,  // Third row
              column: 0,
              alignment: go.Spot.Bottom,
              opacity: 0,  // Initially not visible
              "_treeExpandedFigure": "TriangleUp",
              "_treeCollapsedFigure": "TriangleDown",
            },
            new go.Binding("opacity", "isSelected", function(s) { return s ? 1 : 0; }).ofObject(),
            new go.Binding("isTreeExpanded").makeTwoWay()
          ),
          

        ),
        {
          locationSpot: go.Spot.Left,
          selectionAdorned: false
        },
      {
        click: function(e, node) {
          // Check if it's a simple click (left click)
          if (e.event.button===0) {
            e.diagram.startTransaction("toggle selection");
            node.isSelected = !node.isSelected;
            e.diagram.commitTransaction("toggle selection");
          }
        }
      },
      {
        selectionObjectName: "BODY",
        mouseEnter: (e, node) =>  node.findObject("BUTTONX").opacity = 1,
        mouseLeave: (e, node) =>  node.findObject("BUTTONX").opacity = 0,
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          const shape = node.findObject("SHAPE");
          if (shape) {
            shape._prevFill = shape.fill;  // remember the original brush
            shape.fill = "darkred";
          }
        },
        mouseDragLeave: (e, node, next) => {
          const shape = node.findObject("SHAPE");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill;  // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();  // assume just one Node in selection
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            const link = selnode.findTreeParentLink();
            if (link !== null) {  // reconnect any existing link
              link.fromNode = node;
            } else {  // else create a new link
              diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
            }
          }
        }
      },
     


      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      // new go.Binding("layerName", "isSelected", sel => sel ? "Foreground" : "").ofObject(),
      // // end Auto Panel
      // $("Button",
      //   $(go.Shape, "PlusLine", { width: 10, height: 10 }),
      //   {
      //     name: "BUTTON", alignment: go.Spot.Right, opacity: 0,  // initially not visible
      //     click: showContextMenu//(e, button) => addEmployee(button.part)
      //   },
      //   // button is visible either when node is selected or on mouse-over
      //   new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
      // ),
      // new go.Binding("isTreeExpanded").makeTwoWay(),
      $("TreeExpanderButton",
        {
          name: "BUTTONX", alignment: go.Spot.Bottom, opacity: 0,  // initially not visible
          "_treeExpandedFigure": "TriangleUp",
          "_treeCollapsedFigure": "TriangleDown"
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
      ),
      {
        contextMenu:
          $(go.Adornment, "ContextMenu",
            $(go.Panel, "Vertical",
              $("ContextMenuButton",
                $(go.TextBlock, "Add LeafNode"),
                { click: (e,button)=>addEmployee(button.part)}
              ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Vacate Position"),
              //   { 
              //     click: (e, button) => {
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         const thisemp = node.data;
              //         diagram.startTransaction("vacate");
              //         // update the key, name, picture, and comments, but leave the title
              //         diagram.model.props.setDataProperty(thisemp, "name", "(Vacant)");
              //         diagram.model.props.setDataProperty(thisemp, "pic", "");
              //         diagram.model.props.setDataProperty(thisemp, "comments", "");
              //         diagram.commitTransaction("vacate");
              //       }
              //     }
              //   }
              // ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Remove Role"),
              //   { 
              //     click: (e, button) => {
              //       // reparent the subtree to this node's boss, then remove the node
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         diagram.startTransaction("reparent remove");
              //         const chl = node.findTreeChildrenNodes();
              //         // iterate through the children and set their parent key to our selected node's parent key
              //         while (chl.next()) {
              //           const emp = chl.value;
              //           diagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
              //         }
              //         // and now remove the selected node itself
              //         diagram.model.removeNodeData(node.data);
              //         diagram.commitTransaction("reparent remove");
              //       }
              //     }
              //   }
              // ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Remove Department"),
              //   { 
              //     click: (e, button) => {
              //       // remove the whole subtree, including the node itself
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         diagram.startTransaction("remove dept");
              //         diagram.removeParts(node.findTreeParts());
              //         diagram.commitTransaction("remove dept");
              //       }
              //     }
              //   }
              // )
            )
          )
      }
      ) 
    );

    diagram.nodeTemplateMap.add("SubMainNode",
      $(go.Node, 'Auto',
        {width:150},
        // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          { name: 'SHAPE', fill: '#87ceeb', strokeWidth: 0 },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
          $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          // TextBlock row
          $(go.TextBlock,
            { 
              margin: 12, 
              editable: true, 
              row: 0,  // Place in the first row
              column: 0,
              alignment: go.Spot.Top
            },
            new go.Binding('text').makeTwoWay()
          ),
          $(go.Panel, "Vertical",
              {
                row: 1,  // Assuming this is the row where your toggle button is located
                column: 0,
                alignment: go.Spot.Center, // Align the panel at the center
              },
              // define the panel where the text will appear
              $(go.Panel, "Table",
                {
                  minSize: new go.Size(150, NaN),
                  margin: new go.Margin(6, 10, 0, 6),
                  defaultAlignment: go.Spot.Center,  // Align elements within the panel at the center horizontally
                },
                
                $(go.RowColumnDefinition, { column: 0, width: 30 }), // Column definition for "Ac"
                $(go.RowColumnDefinition, { column: 1, width: 30 }), // Column definition for "Ex"
                $(go.RowColumnDefinition, { column: 2, width: 30 }), // Column definition for "Eq"
                $(go.RowColumnDefinition, { column: 3, width: 30 }), // Column definition for "K"
                $(go.RowColumnDefinition, { column: 4, width: 30 }), // Column definition for "T"
                $(go.TextBlock, "Ac ", textStyle(),
                  { row: 0, column: 0 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 0,
                    editable: true, isMultiline: false,

                  },
                  new go.Binding("text", "access").makeTwoWay()),
                $(go.TextBlock, "Ex ", textStyle(),
                  { row: 0, column: 1 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 1,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "expertise").makeTwoWay()),
                $(go.TextBlock, "Eq ", textStyle(),
                  { row: 0, column: 2 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 2,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "equipment").makeTwoWay()),
                $(go.TextBlock, "K ", textStyle(),
                  { row: 0, column: 3 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 3,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "knowledge").makeTwoWay()),
                $(go.TextBlock, "T ", textStyle(),
                  { row: 0, column: 4 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 4,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "time").makeTwoWay()),
                // TextBlock bindings for values go here
              )
            ),
      
          // Panel (button) row
          $(go.Panel, "Auto",
            {
                row: 3,  // Assuming this is the row where your toggle button is located
                column: 0,
                alignment: go.Spot.Bottom,
                click: function(e, obj) { // Adjusted click handler
                  var node = obj.part;
                  if (node !== null) {
                    var data = node.data;
                    console.log('node data',node.data)
                    var newType = data.logicType === "AND" ? "OR" : "AND";
                    e.diagram.model.startTransaction("toggleLogicType");
                    e.diagram.model.setDataProperty(data, "logicType", newType);
                    e.diagram.model.commitTransaction("toggleLogicType");
                  }
                }
            },
              $(go.Shape, "Rectangle", { fill: "lightgray", strokeWidth: 0, desiredSize: new go.Size(60, 30) }),
              $(go.TextBlock,
                { margin: 4, font: "bold 12px sans-serif", textAlign: "center", width: 60 },
                new go.Binding("text", "logicType"))
            ),
            
            

          $("TreeExpanderButton",
            {
              margin:4,
              row: 4,  // Third row
              column: 0,
              alignment: go.Spot.Bottom,
              opacity: 0,  // Initially not visible
              "_treeExpandedFigure": "TriangleUp",
              "_treeCollapsedFigure": "TriangleDown",
            },
            new go.Binding("opacity", "isSelected", function(s) { return s ? 1 : 0; }).ofObject(),
            new go.Binding("isTreeExpanded").makeTwoWay()
          ),
          

        ),
        {
          locationSpot: go.Spot.Left,
          selectionAdorned: false
        },
      {
        click: function(e, node) {
          // Check if it's a simple click (left click)
          if (e.event.button===0) {
            e.diagram.startTransaction("toggle selection");
            node.isSelected = !node.isSelected;
            e.diagram.commitTransaction("toggle selection");
          }
        }
      },
      {
        selectionObjectName: "BODY",
        mouseEnter: (e, node) => node.findObject("BUTTONX").opacity = 1,
        mouseLeave: (e, node) => node.findObject("BUTTONX").opacity = 0,
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          const shape = node.findObject("SHAPE");
          if (shape) {
            shape._prevFill = shape.fill;  // remember the original brush
            shape.fill = "darkred";
          }
        },
        mouseDragLeave: (e, node, next) => {
          const shape = node.findObject("SHAPE");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill;  // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();  // assume just one Node in selection
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            const link = selnode.findTreeParentLink();
            if (link !== null) {  // reconnect any existing link
              link.fromNode = node;
            } else {  // else create a new link
              diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
            }
          }
        }
      },
     


      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      new go.Binding("layerName", "isSelected", sel => sel ? "Foreground" : "").ofObject(),
      // end Auto Panel
      $("Button",
        $(go.Shape, "PlusLine", { width: 10, height: 10 }),
        {
          name: "BUTTON", alignment: go.Spot.Right, opacity: 0,  // initially not visible
          click: showContextMenu//(e, button) => addEmployee(button.part)
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
      ),
      new go.Binding("isTreeExpanded").makeTwoWay(),
      $("TreeExpanderButton",
        {
          name: "BUTTONX", alignment: go.Spot.Bottom, opacity: 0,  // initially not visible
          "_treeExpandedFigure": "TriangleUp",
          "_treeCollapsedFigure": "TriangleDown"
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
      ),
      {
        contextMenu:
          $(go.Adornment, "ContextMenu",
            $(go.Panel, "Vertical",
              $("ContextMenuButton",
                $(go.TextBlock, "Add LeafNode"),
                { click: (e,button)=>addEmployee(button.part)}
              ),
              $("ContextMenuButton",
                $(go.TextBlock, "Add LogicNode"),
                { click:  (e,button)=>addEmployee2(button.part) }
              ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Vacate Position"),
              //   { 
              //     click: (e, button) => {
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         const thisemp = node.data;
              //         diagram.startTransaction("vacate");
              //         // update the key, name, picture, and comments, but leave the title
              //         diagram.model.props.setDataProperty(thisemp, "name", "(Vacant)");
              //         diagram.model.props.setDataProperty(thisemp, "pic", "");
              //         diagram.model.props.setDataProperty(thisemp, "comments", "");
              //         diagram.commitTransaction("vacate");
              //       }
              //     }
              //   }
              // ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Remove Role"),
              //   { 
              //     click: (e, button) => {
              //       // reparent the subtree to this node's boss, then remove the node
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         diagram.startTransaction("reparent remove");
              //         const chl = node.findTreeChildrenNodes();
              //         // iterate through the children and set their parent key to our selected node's parent key
              //         while (chl.next()) {
              //           const emp = chl.value;
              //           diagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
              //         }
              //         // and now remove the selected node itself
              //         diagram.model.removeNodeData(node.data);
              //         diagram.commitTransaction("reparent remove");
              //       }
              //     }
              //   }
              // ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Remove Department"),
              //   { 
              //     click: (e, button) => {
              //       // remove the whole subtree, including the node itself
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         diagram.startTransaction("remove dept");
              //         diagram.removeParts(node.findTreeParts());
              //         diagram.commitTransaction("remove dept");
              //       }
              //     }
              //   }
              // )
            )
          )
      }
      ) 
    );
    


  diagram.nodeTemplateMap.add("LogicNode",
      $(go.Node, 'Auto',
        {width:150},
        // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          { name: 'SHAPE', fill: '#87ceeb', strokeWidth: 0 },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
          $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          // TextBlock row
          $(go.TextBlock,
            { 
              margin: 12, 
              editable: true, 
              row: 0,  // Place in the first row
              column: 0,
              alignment: go.Spot.Top
            },
            new go.Binding('text').makeTwoWay()
          ),
          $(go.Panel, "Vertical",
              {
                row: 1,  // Assuming this is the row where your toggle button is located
                column: 0,
                alignment: go.Spot.Center, // Align the panel at the center
              },
              // define the panel where the text will appear
              $(go.Panel, "Table",
                {
                  minSize: new go.Size(150, NaN),
                  margin: new go.Margin(6, 10, 0, 6),
                  defaultAlignment: go.Spot.Center,  // Align elements within the panel at the center horizontally
                },
                
                $(go.RowColumnDefinition, { column: 0, width: 30 }), // Column definition for "Ac"
                $(go.RowColumnDefinition, { column: 1, width: 30 }), // Column definition for "Ex"
                $(go.RowColumnDefinition, { column: 2, width: 30 }), // Column definition for "Eq"
                $(go.RowColumnDefinition, { column: 3, width: 30 }), // Column definition for "K"
                $(go.RowColumnDefinition, { column: 4, width: 30 }), // Column definition for "T"
                $(go.TextBlock, "Ac ", textStyle(),
                  { row: 0, column: 0 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 0,
                    editable: true, isMultiline: false,

                  },
                  new go.Binding("text", "access").makeTwoWay()),
                $(go.TextBlock, "Ex ", textStyle(),
                  { row: 0, column: 1 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 1,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "expertise").makeTwoWay()),
                $(go.TextBlock, "Eq ", textStyle(),
                  { row: 0, column: 2 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 2,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "equipment").makeTwoWay()),
                $(go.TextBlock, "K ", textStyle(),
                  { row: 0, column: 3 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 3,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "knowledge").makeTwoWay()),
                $(go.TextBlock, "T ", textStyle(),
                  { row: 0, column: 4 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    row: 1, column: 4,
                    editable: true, isMultiline: false,
                  },
                  new go.Binding("text", "time").makeTwoWay()),
                // TextBlock bindings for values go here
              )
            ),
      
          // Panel (button) row
          $(go.Panel, "Auto",
            {
                row: 3,  // Assuming this is the row where your toggle button is located
                column: 0,
                alignment: go.Spot.Bottom,
                click: function(e, obj) { // Adjusted click handler
                  var node = obj.part;
                  if (node !== null) {
                    var data = node.data;
                    console.log('node data',node.data)
                    var newType = data.logicType === "AND" ? "OR" : "AND";
                    e.diagram.model.startTransaction("toggleLogicType");
                    e.diagram.model.setDataProperty(data, "logicType", newType);
                    e.diagram.model.commitTransaction("toggleLogicType");
                  }
                }
            },
              $(go.Shape, "Rectangle", { fill: "lightgray", strokeWidth: 0, desiredSize: new go.Size(60, 30) }),
              $(go.TextBlock,
                { margin: 4, font: "bold 12px sans-serif", textAlign: "center", width: 60 },
                new go.Binding("text", "logicType"))
            ),
            
            

          $("TreeExpanderButton",
            {
              margin:4,
              row: 4,  // Third row
              column: 0,
              alignment: go.Spot.Bottom,
              opacity: 0,  // Initially not visible
              "_treeExpandedFigure": "TriangleUp",
              "_treeCollapsedFigure": "TriangleDown",
            },
            new go.Binding("opacity", "isSelected", function(s) { return s ? 1 : 0; }).ofObject(),
            new go.Binding("isTreeExpanded").makeTwoWay()
          ),
          

        ),
        {
          locationSpot: go.Spot.Left,
          selectionAdorned: false
        },
      {
        click: function(e, node) {
          // Check if it's a simple click (left click)
          if (e.event.button===0) {
            e.diagram.startTransaction("toggle selection");
            node.isSelected = !node.isSelected;
            e.diagram.commitTransaction("toggle selection");
          }
        }
      },
      {
        selectionObjectName: "BODY",
        mouseEnter: (e, node) => node.findObject("BUTTONX").opacity = 1,
        mouseLeave: (e, node) => node.findObject("BUTTONX").opacity = 0,
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          const shape = node.findObject("SHAPE");
          if (shape) {
            shape._prevFill = shape.fill;  // remember the original brush
            shape.fill = "darkred";
          }
        },
        mouseDragLeave: (e, node, next) => {
          const shape = node.findObject("SHAPE");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill;  // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();  // assume just one Node in selection
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            const link = selnode.findTreeParentLink();
            if (link !== null) {  // reconnect any existing link
              link.fromNode = node;
            } else {  // else create a new link
              diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
            }
          }
        }
      },
     


      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      new go.Binding("layerName", "isSelected", sel => sel ? "Foreground" : "").ofObject(),
      // end Auto Panel
      $("Button",
        $(go.Shape, "PlusLine", { width: 10, height: 10 }),
        {
          name: "BUTTON", alignment: go.Spot.Right, opacity: 0,  // initially not visible
          click: showContextMenu//(e, button) => addEmployee(button.part)
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
      ),
      new go.Binding("isTreeExpanded").makeTwoWay(),
      $("TreeExpanderButton",
        {
          name: "BUTTONX", alignment: go.Spot.Bottom, opacity: 0,  // initially not visible
          "_treeExpandedFigure": "TriangleUp",
          "_treeCollapsedFigure": "TriangleDown"
        },
        // button is visible either when node is selected or on mouse-over
        new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
      ),
      {
        contextMenu:
          $(go.Adornment, "ContextMenu",
            $(go.Panel, "Vertical",
              $("ContextMenuButton",
                $(go.TextBlock, "Add LeafNode"),
                { click: (e,button)=>addEmployee(button.part)}
              ),
              $("ContextMenuButton",
                $(go.TextBlock, "Add LogicNode"),
                { click:  (e,button)=>addEmployee2(button.part) }
              ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Vacate Position"),
              //   { 
              //     click: (e, button) => {
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         const thisemp = node.data;
              //         diagram.startTransaction("vacate");
              //         // update the key, name, picture, and comments, but leave the title
              //         diagram.model.props.setDataProperty(thisemp, "name", "(Vacant)");
              //         diagram.model.props.setDataProperty(thisemp, "pic", "");
              //         diagram.model.props.setDataProperty(thisemp, "comments", "");
              //         diagram.commitTransaction("vacate");
              //       }
              //     }
              //   }
              // ),
              // $("ContextMenuButton",
              //   $(go.TextBlock, "Remove Role"),
              //   { 
              //     click: (e, button) => {
              //       // reparent the subtree to this node's boss, then remove the node
              //       const node = button.part.adornedPart;
              //       if (node !== null) {
              //         diagram.startTransaction("reparent remove");
              //         const chl = node.findTreeChildrenNodes();
              //         // iterate through the children and set their parent key to our selected node's parent key
              //         while (chl.next()) {
              //           const emp = chl.value;
              //           diagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
              //         }
              //         // and now remove the selected node itself
              //         diagram.model.removeNodeData(node.data);
              //         diagram.commitTransaction("reparent remove");
              //       }
              //     }
              //   }
              // ),
              $("ContextMenuButton",
                $(go.TextBlock, "Remove Department"),
                { 
                  click: (e, button) => {
                    // remove the whole subtree, including the node itself
                    const node = button.part.adornedPart;
                    if (node !== null) {
                      diagram.startTransaction("remove dept");
                      diagram.removeParts(node.findTreeParts());
                      diagram.commitTransaction("remove dept");
                    }
                  }
                }
              )
            )
          )
      }
      ) 
    );


// Template for nodes with type "type2"
diagram.nodeTemplateMap.add("LeafNode",
    $(go.Node, 'Auto',
      {width:150},

      // the Shape will go around the TextBlock
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 'RoundedRectangle',
        { name: 'SHAPE', fill: '#59AFBA', strokeWidth: 0 },
        // Shape.fill is bound to Node.data.color
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        { margin: 8, editable: true },  // some room around the text
        new go.Binding('text').makeTwoWay()
      ),
      {
        selectionObjectName: "BODY",
        // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: (e, node, prev) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          const shape = node.findObject("SHAPE");
          if (shape) {
            shape._prevFill = shape.fill;  // remember the original brush
            shape.fill = "darkred";
          }
        },
        mouseDragLeave: (e, node, next) => {
          const shape = node.findObject("SHAPE");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill;  // restore the original brush
          }
        },
        mouseDrop: (e, node) => {
          const diagram = node.diagram;
          const selnode = diagram.selection.first();  // assume just one Node in selection
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            const link = selnode.findTreeParentLink();
            if (link !== null) {  // reconnect any existing link
              link.fromNode = node;
            } else {  // else create a new link
              diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
            }
          }
        }
      },

      $(go.Panel, "horizontal",
        // define the panel where the text will appear
        $(go.Panel, "Table",
          {
            minSize: new go.Size(130, NaN),
            maxSize: new go.Size(150, NaN),
            margin: new go.Margin(6, 10, 0, 6),
            defaultAlignment: go.Spot.Left
          },
          $(go.RowColumnDefinition, { column: 2, width: 4 }),
          $(go.TextBlock, textStyle(),  // the name
            {
              name: "NAMETB",
              row: 0, column: 0, columnSpan: 5,
              font: "12pt Segoe UI,sans-serif",
              editable: true, isMultiline: false,
              minSize: new go.Size(50, 16)
            },
            new go.Binding("text", "name").makeTwoWay()),
          $(go.TextBlock, "Access: ", textStyle(),
              { row: 1, column: 0 }),
          $(go.TextBlock, textStyle(),  // the name
            {
              name: "NAMETB",
              row: 1, column: 1, columnSpan: 5,
              font: "8pt Segoe UI,sans-serif",
              editable: true, isMultiline: false,
              minSize: new go.Size(50, 16)
            },
            new go.Binding("text", "access").makeTwoWay()),
          $(go.TextBlock, "Expertise:", textStyle(),
            { row: 2, column: 0 }),
          $(go.TextBlock, textStyle(),  // the name
          {
            name: "NAMETB",
            row: 2, column: 1, columnSpan: 5,
            font: "8pt Segoe UI,sans-serif",
            editable: true, isMultiline: false,
            minSize: new go.Size(50, 16)
          },
          new go.Binding("text", "expertise").makeTwoWay()),
          $(go.TextBlock, "Equipment: ", textStyle(),
            { row: 3, column: 0 }),
          $(go.TextBlock, textStyle(),  // the name
            {
              name: "NAMETB",
              row: 3, column: 1, columnSpan: 5,
              font: "8pt Segoe UI,sans-serif",
              editable: true, isMultiline: false,
              minSize: new go.Size(50, 16)
            },
            new go.Binding("text", "equipment").makeTwoWay()),
          $(go.TextBlock, "Knowledge: ", textStyle(),
            { row: 4, column: 0 }),
          $(go.TextBlock, textStyle(),  // the name
            {
              name: "NAMETB",
              row: 4, column: 1, columnSpan: 5,
              font: "8pt Segoe UI,sans-serif",
              editable: true, isMultiline: false,
              minSize: new go.Size(50, 16)
            },
            new go.Binding("text", "knowledge").makeTwoWay()),
          $(go.TextBlock, "Time: ", textStyle(),
            { row: 5, column: 0 }),
            $(go.TextBlock, textStyle(),  // the name
            {
              name: "NAMETB",
              row: 5, column: 1, columnSpan: 5,
              font: "8pt Segoe UI,sans-serif",
              editable: true, isMultiline: false,
              minSize: new go.Size(50, 16)
            },
            new go.Binding("text", "time").makeTwoWay()),
        ) // end Table Panel
      ),
      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      {
        contextMenu:
          $(go.Adornment, "ContextMenu",
            $(go.Panel, "Vertical",
              $("ContextMenuButton",
                $(go.TextBlock, "Remove Role"),
                { 
                  click: (e, button) => {
                    // reparent the subtree to this node's boss, then remove the node
                    const node = button.part.adornedPart;
                    if (node !== null) {
                      diagram.startTransaction("reparent remove");
                      const chl = node.findTreeChildrenNodes();
                      // iterate through the children and set their parent key to our selected node's parent key
                      while (chl.next()) {
                        const emp = chl.value;
                        diagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
                      }
                      // and now remove the selected node itself
                      diagram.model.removeNodeData(node.data);
                      diagram.commitTransaction("reparent remove");
                    }
                  }
                }
              )
            )
          )
      }
    ),
    
      
  );


     // Define a link template with a visible layer
    diagram.linkTemplate =
     $(go.Link,       // the whole link panel
       $(go.Shape),
     );

     // Function to show the context menu
    function showContextMenu(e, button) {
      // Create a context menu on the fly or toggle an existing one
      var cxMenu = $(go.Adornment, "Vertical",
          $("ContextMenuButton",
              $(go.TextBlock, "Option 1"),
              { click: (e, button) => addEmployee(button.part) }
          ),
          $("ContextMenuButton",
              $(go.TextBlock, "Option 2"),
              { click: (e, button) => addEmployee2(button.part) }
          )
          // Add more options as needed
      );

      // Show the context menu at the position of the button
      var node = button.part;  // The node to which the button is attached
      var diagram = node.diagram;
      diagram.commandHandler.showContextMenu(cxMenu, button.getDocumentPoint(go.Spot.TopLeft));
    }

    function addEmployee(node) {
      if (!node) return;
      const thisemp = node.data;
      diagram.startTransaction("add employee");
      const newemp = { name: "Attack Name", access: 0,expertise: 0,equipment:0,knowledge:0,time:0, parent: thisemp.key,category:"LeafNode" };
      diagram.model.addNodeData(newemp);
      const newnode = diagram.findNodeForData(newemp);
      if (newnode) newnode.location = node.location;
      diagram.commitTransaction("add employee");
      diagram.commandHandler.scrollToPart(newnode);
    }
    function addEmployee2(node) {
      if (!node) return;
      const thisemp = node.data;
      diagram.startTransaction("add employee");
      const newemp = { text: "Attack Name", parent: thisemp.key,category:"LogicNode",logicType:"OR",access:null,expertise: null,equipment:null,knowledge:null,time:null,color:"#9AD5DF" };
      diagram.model.addNodeData(newemp);
      const newnode = diagram.findNodeForData(newemp);
      if (newnode) newnode.location = node.location;
      diagram.commitTransaction("add employee");
      diagram.commandHandler.scrollToPart(newnode);
    }
    // In your diagram initialization, set the custom LinkingTool
  return diagram;
}






// render function...
const  TreeChart=forwardRef((props, ref)=> {
    // const [props.dataOmkar,props.setData]=useState(null)
    const [selectedValue, setSelectedValue] = useState('')
    const [selectedAsset,setSelectedAsset]=useState([])
    const originalNodeColors = new go.Map();
    let isHighlightActive = false;
    
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


    // const diagramRef = useRef(null);
    async function captureDiagramImage() {
      console.log('entered the capturediagramImage function')
      return new Promise((resolve, reject) => {
        setTimeout(async function () {
          console.log('entered the timeout function')
          const diagram = await diagramRef.current.getDiagram();
          
          // const diagramBounds = diagram.documentBounds;
          const svgElement = diagram.makeSvg({ scale: 1, background: "white" });
    
          // Serialize SVG to a string
          const svgXML = new XMLSerializer().serializeToString(svgElement);
    
          // Convert SVG string to Blob
          const svgBlob = new Blob([svgXML], { type: "image/svg+xml;charset=utf-8" });
          const URL = window.URL || window.webkitURL || window;
          const blobURL = URL.createObjectURL(svgBlob);
    
          const image = new Image();
          image.onload = () => {
            // Create a canvas and draw the image on it to convert it to a bitmap
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
    
            // Convert canvas to image data URL (PNG)
            const imageData = canvas.toDataURL('image/png');
            resolve(imageData);
          };
    
          image.onerror = (error) => {
            reject(error);
          };
    
          image.src = blobURL;
        }, 2000);
      });
    };


    async function captureAllAssetsData(assets) {
      
      const allAssetsData = [];
      
      console.log('entered captureAllAssetsData')
      for (const asset of props.assets) {
          // Some mechanism to ensure that diagramRef.current is set to the current asset's diagram
          // This might involve simulating user interaction, changing application state, etc.
          console.log('entered in for loop')
           // Wait until props.dataOmkar is not null for the current asset
          while (!props.dataOmkar || !props.dataOmkar[asset]) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 100ms before checking again
          }
          console.log('props.dataOmkar',props.dataOmkar)
          console.log('shrinivas asset',asset)
          await setSelectedValue(asset)
          await setSelectedAsset(props.dataOmkar[asset])
          console.log('after selectedasset')
          try {
              console.log('entered in try catch')
              const imageData = await captureDiagramImage();
              
              allAssetsData.push(imageData);
              console.log('TreeChart',allAssetsData)
          } catch (error) {
              console.error("Error capturing data for asset:", asset, error);
          }
      }
  
      return allAssetsData;
  }


    useImperativeHandle(ref, () => ({
      captureAllAssetsData: captureAllAssetsData
    }));
    

    const handleSelectChange = (event) => {
      setSelectedValue(event.target.value);
      setSelectedAsset(props.dataOmkar[event.target.value])
    };


    const diagramRef=useRef(null)
    function findRootNodeKeys(diagram) {
      const rootNodeKeys = new Set();
      diagram.nodes.each(node => {
          if (!node.data.hasOwnProperty('parent')) {
              rootNodeKeys.add(node.key);
          }
      });
      return rootNodeKeys;
  }
  
  async function highlightNodeAndChildren(diagram, node) {
    // Highlight the current node
    highlightNode(node);

    const logicType = node.data.logicType;
    if (logicType === 'OR') {
        const children = findChildren(diagram, node);
        const properties = ['access', 'equipment', 'expertise', 'time', 'knowledge'];


        for (const child of children) {
            const childNode = diagram.findNodeForKey(child.key);
            if (childNode) {
                const childData = childNode.data;

                if (node.data['access']===childData.access && node.data['expertise']===childData.expertise && node.data['equipment']===childData.equipment && node.data['time']===childData.time && node.data['knowledge']===childData.knowledge) {
                    await highlightNodeAndChildren(diagram, childNode);
                    return;
                   // Exit function after finding the matching child
                }
            }
        }
    } else if (logicType === 'AND') {
        const children = findChildren(diagram, node);

        for (const child of children) {
            const childNode = diagram.findNodeForKey(child.key);
            if (childNode) {
                await highlightNodeAndChildren(diagram, childNode);
            }
        }
    }
}
  
  function findChildren(diagram, node) {
      const children = [];
      diagram.links.each(link => {
          if (link.data.parent === node.key) {
              const childNode = diagram.findNodeForKey(link.data.key);
              if (childNode) {
                  children.push(childNode);
              }
          }
      });
      return children;
  }
  
  function highlightNode(node) {
      // Store original color if it's not already stored
      console.log('isHighlightactive',originalNodeColors.has(node))
      if (isHighlightActive && !originalNodeColors.has(node)) {
          originalNodeColors.set(node, node.findObject("SHAPE").fill);
          console.log('entered evaluate part')
          // Highlight the node
          node.findObject("SHAPE").fill = "red";
      }else{
          node.findObject("SHAPE").fill = originalNodeColors.get(node);
          originalNodeColors.delete(node);
          console.log('entered ddevaluate part')
    }
      
  }
  
  function unhighlightNode(node) {
      // Unhighlight the node if highlighting is active
      if (isHighlightActive && originalNodeColors.has(node)) {
          node.findObject("SHAPE").fill = originalNodeColors.get(node);
      }
  }
     async function highlightPath(name) {
      if(name==='evaluate'){
        isHighlightActive=true
      }else{
        isHighlightActive=false
      }
       try {
         setTimeout(async function(){
             const diagram = await diagramRef.current.getDiagram();
             const rootNodeKeys = findRootNodeKeys(diagram);
             console.log('rootNodekey',rootNodeKeys)
             for (const key of rootNodeKeys) {
             
                 const node = diagram.findNodeForKey(key);
                 if (node) {
                     await highlightNodeAndChildren(diagram, node);
                 }
             }
         }, 5000);
        }catch (error) {
              console.error('Error highlighting path:', error);
          }
      }
    
    
    //   } catch (error) {
    //     console.error('Error highlighting path:', error);
    //   }
    // };
    
    // function highlightNode(node) {
    //   // Store original color if it's not already stored
    //   if (!originalNodeColors.has(node)) {
    //     originalNodeColors.set(node, node.findObject("SHAPE").fill);
    //   }
    //   // Highlight the node
    //   node.findObject("SHAPE").fill = "red";
    // }
    
    // function unhighlightNode(node) {
    //   // Unhighlight the node if highlighting is active
    //   if (isHighlightActive && originalNodeColors.has(node)) {
    //     node.findObject("SHAPE").fill = originalNodeColors.get(node);
    //   }
    // }
    
    // function highlightPathToRoot(node) {
    //   // Traverse from the leaf node to the root
    //   let current = node;
    //   while (current !== null) {
    //     // Highlight current node
    //     highlightNode(current);
    
    //     // Move to parent node
    //     const parent = current.findTreeParentNode();
    //     current = parent;
    //   }
    // }
  
  // Function to reset colors to normal
  const resetColors = () => {
    const diagram = diagramRef.current.getDiagram();
    diagram.startTransaction("resetColors");
  
    diagram.nodes.each(function(node) {
      if (originalNodeColors.has(node)) {
        node.findObject("SHAPE").fill = originalNodeColors.get(node);
      }
    });
  
    diagram.commitTransaction("resetColors");
  
    // Reset the originalNodeColors map
    originalNodeColors.clear();
  };
  
    useEffect(()=>{

      
      setSelectedValue(props.assets[0])
      setSelectedAsset(props.dataOmkar[props.assets[0]])
      // axios.post(`https://si-tara-nginx-dev-v1.ma48hj4jdd4hk.ap-south-1.cs.amazonlightsail.com/attackTrees`,{'attacktrees_list':props.assets}).then(response=>{
      
      //   setBle(props.attackTreesData)
      //   console.log('props.attackTreesData',props.attackTreesData)
      //   // Example usage
      //   var moduleDataMain={}
      //   for (const key in props.attackTreesData) {
      //     // Outputs: key1, key2, key3
          
      //     var arrayOfObjects = convertToTreeDataFormat(props.attackTreesData[key]);
      //     console.log(key,arrayOfObjects)
      //     const combinedResult = combineArraysOfObjects(arrayOfObjects);
      //     console.log(key,combinedResult)
      //     moduleDataMain[key]=combinedResult
      //   }
      //   removeUndefinedParent(moduleDataMain);
      //   props.setData(moduleDataMain)
      //   setSelectedValue("ble")
      //   setSelectedAsset(moduleDataMain["ble"])
      //   for (const key in moduleDataMain){
      //     console.log(key)
      //   }
      //   console.log(moduleDataMain["ble"])
      // })

      
    },[]);

    function waitForTransactionToFinish(diagram) {
      return new Promise(resolve => {
        diagram.addDiagramListener("TransactionFinished", e => {
          if (e.diagram === diagram) {
            resolve();
          }
        });
      });
    }

    async function handleModelChange(e) {
      
      console.log('Transaction started...');
      if(e.diagram!=undefined){
        await waitForTransactionToFinish(e.diagram);
      }
      console.log('Transaction finished. Proceeding...');
      console.log('event',e)
      const newModel = {
        nodeDataArray: e.modifiedNodeData
      };
      let array1=props.dataOmkar[selectedValue]
      if('removedNodeKeys' in e){
        array1 = array1.filter(obj => e.removedNodeKeys.indexOf(obj.key) === -1);

      }else if('insertedNodeKeys' in e && 'modifiedNodeData' in e){
        e.modifiedNodeData.forEach(obj => {
          // Check if the key "key" value is not present in array1
          if (!array1.some(item => item.key === obj.key)) {
            // If not present, add the object to array1
            array1.push(obj);
          }
        });

      }else if('modifiedNodeData' in e){
        // Iterate through modifiedNodeData
        e.modifiedNodeData.forEach(modifiedObj => {
          // Find the corresponding object in array1
          let index = array1.findIndex(obj => obj.key === modifiedObj.key);
          
          // If a matching object is found, update its content
          if (index !== -1) {
            array1[index] = { ...array1[index], ...modifiedObj };
          }
        });
        console.log('modified Node Data')
      }
      let array2=updateParentValues(array1);
      console.log("array1",array2)
      setSelectedAsset(array2)
      props.setData(prevData => {
          return {
            ...prevData,
            [selectedValue]: array2
          };
      });
      
    }
    useEffect(()=>{
      console.log('props.dataomkar',props.dataOmkar)
    },[props.dataOmkar])

    // Place the CalculateRisk function here
      function CalculateRisk(time, expertise, knowledge, access, equipment) {
        const sum = time + expertise + knowledge + access + equipment;
      
        if (sum >= 0 && sum <= 13) {
          return "high";
        } else if (sum >= 14 && sum <= 19) {
          return "medium";
        } else if (sum >= 20 && sum <= 24) {
          return "low";
        } else {
          return "very low";
        }
      }


      const convertToTreeDataFormat = (dataArray) => {
        const treeData = [];
      
        // Group data by name
        const groupedData = dataArray.reduce((acc, item) => {
          const key = item.Name;
      
          if (!acc[key]) {
            acc[key] = [];
          }
      
          acc[key].push(item);
          return acc;
        }, {});
      
        // Process each group
        const moduleArrays = Object.keys(groupedData).map((name) => {
          const currentGroup = groupedData[name];
      
          const currentTree = {
            name,
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
            const getLeafNode=(access,equipment,expertise,knowledge,time,parent,color)=>{
              const existingNode = currentTree.data.find((node) => node.access === access && node.expertise===expertise && node.equipment===equipment && node.knowledge===knowledge && node.time===time && node.parent === parent);
              if (existingNode) {
                return existingNode.key;
              }
      
              const newNode = { key: currentTree.data.length, parent,access,equipment,expertise,knowledge,time, color };
              currentTree.data.push(newNode);
              return newNode.key;
            }
          
      
            const nameNode = getNode(item.name, null, '#F3C8C5');
            const securityNode = getNode(item.security_properties, nameNode, ' #F0D096');
            const attackNode = getNode(item.attack, securityNode, '#9AD5DF');
            getLeafNode(item.access, item.equipment,item.expertise,item.knowledge,item.time, attackNode, '#59AFBA');
          });
      
          treeData.push(currentTree);
          return currentTree.data;
        });
      
        // Flatten the resulting arrays
        const flattenedData = treeData.flatMap((tree) => tree.data);
        
        // Remove the parent: null pair only for nodes with key: 0
        const finalData = flattenedData.map((node) => {
          if (node.key === 0) {
            return { key: node.key, text: node.text, color: node.color,category:"Type"};
          }
          return {...node,category:"LeafNode"};
        });
      
        // Separate arrays for each module
        const moduleData = Object.fromEntries(Object.keys(groupedData).map((name, index) => {
          const moduleArray = moduleArrays[index].map((node) => {
            if (node.key === 0) {
              return { key: node.key, text: node.text, color: node.color,category:"LogicNode",logicType:"OR" };
            }
            if('access' in node){
              return {...node,category:"LeafNode",name:"AttackName"};
            }
            return {...node,category:"LogicNode",logicType:"OR"}
            
          });
          return [name.replace(/\s/g, ''), moduleArray];
        }));
      
        return moduleData ;
      };

      if (!props.dataOmkar) {
        // Data is not available yet, render a loading state or return null
        return <div>Loading...</div>;
      }
  return (
    <>
      <div>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={selectedValue}
            onChange={handleSelectChange}
            sx={{width:200}}
          >
            {/* <MenuItem value="">
              <em>--Select--</em>
            </MenuItem> */}
            {props.assets.map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </Select>
        {/* <label htmlFor="mySelect">Select an option:</label>
        <select id="mySelect" value={selectedValue} onChange={handleSelectChange}>
          <option value="">-- Select --</option>
          {props.assets.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select> */}
        <Button sx={{marginLeft:3}} onClick={async () => await highlightPath('evaluate')} variant="contained">Evaluate</Button>
        <Button sx={{marginLeft:3}} onClick={async () => await highlightPath('Deevaluate')} variant="contained">Devaluate</Button>
        {/* <button onClick={async () => await highlightPath()}>Evaluate</button> */}
      </div>
      <div >
      <ReactDiagram
        ref={diagramRef}
        key={JSON.stringify(selectedAsset)}
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={selectedAsset}
        onModelChange={handleModelChange}
        style={{ width: '80vw', height: '100vh' }}
      />
      </div>
    </>
  );
})


export default TreeChart