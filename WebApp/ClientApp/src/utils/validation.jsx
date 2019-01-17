/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

export const validateDateArray = (values)=>{
    for (let index = 0; index < values.length; index++) {
        let element = values[index];
        element = element.replace("**", '');
        if(!Date.parse(element)){
            throw new Error("Invalid date value in Excel");
        }
    }
    return values
};


export const validateNumber = (value)=>{
    if(!parseInt(value)){
        throw new Error("Invalid number value in Excel");
    }
    return value;
};

export const validateDate = (value)=>{
    let element = value.replace("**", '');
    if(!Date.parse(element)){
        throw new Error("Invalid date value in Excel");
    }
    return value
};

export const validateString = (value)=>{
    if(!(/^[a-zA-Z\s]*$/.test(value))){
        throw new Error("Invalid string value in Excel " + value);
    }
    return value;
}


export const validateNumberAndString = (value)=>{
    if(!(/^[A-z0-9\s]*$/.test(value))){
        throw new Error("Invalid string/Number value in Excel");
    }
    return value
}