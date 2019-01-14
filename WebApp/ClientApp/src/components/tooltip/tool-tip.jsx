
/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/
import React from "react";
import {Tooltip} from 'react-lightweight-tooltip';

const greenRoundedStyle = {
    content: {
      backgroundColor: 'green',
      color: '#000',
    },
    tooltip: {
      backgroundColor: 'green',
      borderRadius: '10px',
    },
    arrow: {
      borderTop: 'solid green 5px',
    },
  };
  
  export default function GreenRoundedTooltip(){
    const self = this;
    console.log("ToolTip==>",this)
    let css = {
        left: "672px",
        top:"289px"
    }
  return (
    <Tooltip

      content={
        [
          'This repo is hosted on ',
          <a href="https://github.com" key="githublink" target="_blank" style={css}>Github</a>,
        ]
      }
      style={greenRoundedStyle}>
      Green tooltip with rounded corners and a link
    </Tooltip>
  );
  }
  
