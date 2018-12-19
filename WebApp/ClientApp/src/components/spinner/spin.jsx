/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from 'react';
import { css } from 'react-emotion';
import { HashLoader,PropagateLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: auto;
    width: 80%;
    padding: 30px;
`;

export default function Spinner(){
 

    return (
        <div className={override}>
        <PropagateLoader
          sizeUnit={"px"}
          size={20}
          color={'#45ddc0'}
          loading={this.state.loading}
        />
      </div> 
    );
}