/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

export const appUri = 'https://localhost:44385/admin';

//export const clientId = 'afd49bec-86d2-4c42-9714-42b62fdc19bb'; //==>dev
export const clientId = '0882836d-18e5-4c08-8797-e97da70407c4'; 

export const redirectUri = appUri + "/"; 
export const instanceId = 'https://login.microsoftonline.com/';

//export const webApiScopes = ["api://afd49bec-86d2-4c42-9714-42b62fdc19bb/access_as_user"];//==>dev
export const webApiScopes = ["api://0882836d-18e5-4c08-8797-e97da70407c4/access_as_user"]

//export const authority = "https://login.microsoftonline.com/9ec16324-e534-4d84-81de-59a03f343e20";  //==>dev
export const authority = "https://login.microsoftonline.com/b57dde4f-d0a9-4044-971e-0dc136c593d8"; 
export const localStorePrefix = "env1_"; //Local Store Prefix.

