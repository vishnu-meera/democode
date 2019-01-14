/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import { UserAgentApplication, Logger } from 'msal';
import {clientId, webApiScopes, authority,localStorePrefix} from './config';

const webApiTokenStoreKey = localStorePrefix + 'WebApiToken';



const optionsUserAgentApp = {
    navigateToLoginRequestUrl: true,
	cacheLocation: 'localStorage',
	logger: new Logger((level, message) => {
		const logger = level === 0 ? console.error : level === 1 ? console.warn : console.log;
		logger(`AD: ${message}`);
    })
};

const userAgentApplication = new UserAgentApplication(
	clientId,
	authority,
	tokenReceivedCallback,
    optionsUserAgentApp);
    
function handleWebApiToken(idToken) {
    console.log("handleWebApiToken");
    if (idToken) {
        console.log("handleWebApiToken-not empty");
        localStorage.setItem(webApiTokenStoreKey, idToken);
        localStorage.setItem("userAuthenticated", true);
    }
};

function handleError(error) {
    console.log(`AuthHelper: ${error}`);
};

function getUserAgentApplication() {
	return userAgentApplication;
};

function handleRemoveWebApiToken() {
    localStorage.removeItem(webApiTokenStoreKey);
    localStorage.setItem("userAuthenticated", false);
};

function tokenReceivedCallback(errorMessage, token, error, tokenType) {

    localStorage.setItem("loginRedirect", "tokenReceivedCallback");
    console.log("tokenReceivedCallback===> errorMessage",errorMessage);
    console.log("tokenReceivedCallback===> token",token);
    if (!errorMessage && token) {
        this.acquireTokenSilent(webApiScopes)
            .then(accessToken => {
                console.log("tokenReceivedCallback===> accessToken",accessToken);
                handleWebApiToken(accessToken);
            })
            .catch(error => {
                handleError("tokenReceivedCallback-acquireTokenSilent: " + error);
                // TODO: need to add aquiretokenpopup or similar
            });
    } else {
        handleError("tokenReceivedCallback: " + error);
    }
};


export default class AuthClient {
    constructor(props) {

		// Get the instance of UserAgentApplication.
		this.authClient = getUserAgentApplication();

		this.userProfile = [];
    }
    
    clear = ()=>{
        handleRemoveWebApiToken();
    };

    login = async()=>{
        console.log("LOGIN CALL");
        let accessToken = null;
        let errorMessage = null;
        try {
            console.log("login started===>amma rakshikane");
            let token = await this.authClient.loginPopup();
            accessToken = await this.authClient.acquireTokenSilent(webApiScopes, authority);
            console.log("LOGIN CALL===>token",accessToken);
            handleWebApiToken(accessToken);
        } catch (error) {
            errorMessage = error.message;
            console.log("Authentication error ==> " + "invalid Token");
        }

        return {accessToken,errorMessage};
    };

    async userHasWebApiToken() { 
        const tokenResult = localStorage.getItem(webApiTokenStoreKey);

        if (tokenResult) {
            return true;
        } else {
            return false;
        }
    };

    isAuthenticated = async ()=>{
        let authenticated = await this.userHasWebApiToken();
        let token = null;
        if(authenticated) token= localStorage.getItem(webApiTokenStoreKey);
        console.log("isAuthenticated===>",authenticated,token)
        return {authenticated,token};
    };

    logout = async ()=>{
        localStorage.removeItem(webApiTokenStoreKey);
        localStorage.setItem("userAuthenticated", false);
        let logoutresponse = await this.authClient.logout();
        console.log("logout===>",logoutresponse);
    };
};