/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from 'react';
import { css } from 'react-emotion';
import { HashLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default function Spinner(){
 

    return (
        <div className='sweet-loading text-center'>
        <HashLoader
          className={override}
          sizeUnit={"px"}
          size={125}
          color={'#45ddc0'}
          loading={this.state.loading}
        />
      </div> 
    );
}