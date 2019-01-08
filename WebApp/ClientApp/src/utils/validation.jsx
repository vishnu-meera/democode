const errorMessage = "error data";

export const validateDateArray = (values)=>{
    for (let index = 0; index < values.length; index++) {
        let element = values[index];
        //console.log("element before==>",element);
        element = element.replace("**", '');
        //console.log("element after==>",element);
        if(!Date.parse(element)){
            throw new Error("Invalid date value in Excel");
        }
    }
    return values
};


export const validateNumber = (value)=>{
    if(!parseInt(value)){
        //console.log("Incorrect data: ", value);
        throw new Error("Invalid nu,ber value in Excel");
    }else{
        //console.log("Correct data: ", value);
        return value;
    }
};

export const validateDate = (value)=>{
    let element = value.replace("**", '');
    if(!Date.parse(element)){
        throw new Error("Invalid date value in Excel");
    }
    return value
};
