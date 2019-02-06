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

    try {
        if(!value)return value;
        if(value==="NA")return value;
        if(!parseInt(value)){
            console.log("Invalid number value in Excel : ", value);
        }
    } catch (error) {
        console.log(error.mesaage, value);
    }
    return value;
};

export const validateDate = (value)=>{

    try {
        if(!value)return value;
        if(value==="NA")return value;
        let element = value.replace("**", '');
        if(!Date.parse(element)){
            console.log("Invalid date value in Excel : ", value);
        }
    } catch (error) {
        console.log(error.mesaage, value);
    }
    return value
};

export const validateString = (value)=>{

    try {
        if(!value)return value;
        if(value==="NA")return value;
        if(!(/^[a-zA-Z\s]*$/.test(value))){
            console.log("Invalid string value in Excel : ", value);
        }
    } catch (error) {
        console.log(error.mesaage, value);
    }
    return value;
}


export const validateNumberAndString = (value)=>{

    try {
        if(!value)return value;
        if(value==="NA")return value;
        if(!(/^[A-z0-9\s]*$/.test(value))){
            console.log("Invalid number/string value in Excel : ", value);
        }
    } catch (error) {
        console.log(error.mesaage, value);
    }
    return value
}