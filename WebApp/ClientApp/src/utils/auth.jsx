import ls from 'local-storage';

const Msal = require('msal');
const applicationConfig = {
    clientID: 'afd49bec-86d2-4c42-9714-42b62fdc19bb'
};
const graphScopes = ["user.read"];
const jwtDecode = require('jwt-decode');
let  userAgentApplication ;

const authCallback = function(errorDesc, token, error, tokenType) {
    if (token) {
        console.log("Authentication token ===> ",token)
    }
    else {
        console.log("Authentication error ==> " + error + ":" + errorDesc);
    }
};



export default class Auth {
    getUserAgentApplication = ()=>{
        if(!userAgentApplication)
            userAgentApplication = new Msal.UserAgentApplication(applicationConfig.clientID, null, authCallback);
        console.log("getUserAgentApplication===>",userAgentApplication);
        return userAgentApplication;
    }

    userAgentApplication = (userAgentApplication)?userAgentApplication:this.getUserAgentApplication();

    clear = ()=>{
        ls.clear();
    };

    login = async ()=>{
        let token = null;
        let accessToken = null;
        let errorMessage = null;
        let userAgentApplication = this.getUserAgentApplication();
        try {
            console.log("login started===>amma rakshikane",userAgentApplication);
            token =  await userAgentApplication.loginPopup(graphScopes);
            accessToken = await userAgentApplication.acquireTokenSilent(graphScopes);
            const {exp} = jwtDecode(accessToken);
            console.log("token Access ==>",accessToken);
            ls.set("token",accessToken);
            ls.set("userAuthenticated",true);
        } catch (error) {
            errorMessage = error.message;
            console.log("Authentication error ==> " + "invalid Token");
        }
    
        return {accessToken,errorMessage};
    };

    logout = async ()=>{
        ls.clear();
        let userAgentApplication = this.getUserAgentApplication();
        let logoutresponse = await userAgentApplication.logout();
        console.log("logout===>",logoutresponse);
    };

    isAuthenticated = async ()=>{
        let authenticated = ls.get("userAuthenticated");;
        let token = ls.get("token");
        
        try {
            if(token){

                console.log("isAuthenticated==>", token);
                const {exp} = jwtDecode(token);
                let now = new Date().getTime();
                now = now/1000;
    
                if(!exp<now){
                    console.log("isAuthenticated==> authentication success");
                    return {authenticated,token}
                }
            }
        } catch (error) {
            console.log("isAuthenticated==> authentication failed",error,token);
        }

        authenticated = false;
        token = "";
        ls.set("token",token);
        ls.set("userAuthenticated",authenticated);
        return {authenticated,token};
    };
}


