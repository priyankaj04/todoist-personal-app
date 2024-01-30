import AsyncStorage from '@react-native-community/async-storage';
import { valuesActions, loginActions } from '../redux';
import jwtDecode from "jwt-decode";

async function postService( baseUrl = '', url = '', data = {}) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function getService(baseUrl = '', url = '') {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function getTokenService(baseUrl = '', url = '', token='') {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/json",
      "Authorization":'Bearer '+token
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function putService(baseUrl = '', url = '', data = {}) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function patchService(baseUrl = '', url = '', data = {}) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function deleteService(baseUrl = '', url = '', data = {}) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

const stringInterpolater = (stringToReplace, data) => {
  return stringToReplace.replace(
    /{\w+}/g,
    (placeholder) =>
      data[placeholder.substring(1, placeholder.length - 1)] || placeholder,
  );
};

const API_ROUTES = {
  VERIFY_USER : '/staffuser/verify',
  REFRESH_USER : '/staffuser/refreshtokenv2',
  STAFF_DETAILS : '/staffuser/search/term/{email}',
  GET_MY_PATIENTS : '/patient/search/cm/{email}',
  GET_PATIENTS : '/patient/search/any/{text}?show=all',
};

const refreshToken = (baseUrl, dispatch, setLoading)=>{

  AsyncStorage.getItem('refreshToken').then((refreshToken)=>{
    
    if (refreshToken) {

      getTokenService(baseUrl, API_ROUTES.REFRESH_USER, refreshToken ).then((response) => {
        
        if(response?.token){

          let decoded = jwtDecode(response.token);

          dispatch(loginActions.setLoginData({
            email: decoded.email,
            type: decoded.type,
            token: response?.token
          }));

          getCmDetails(baseUrl, dispatch, decoded.email);

        }else{

            dispatch(valuesActions.statusNot1(response.msg));
        }
      }).catch((error) => {

          dispatch(valuesActions.error(error));
      }).finally(()=>{
        setLoading(false)
      })
    }
  })
}

const getCmDetails = (baseUrl, dispatch, email )=>{

  getService(baseUrl, stringInterpolater(API_ROUTES.STAFF_DETAILS, {email: email}))
  .then((res)=>{

    if(res.status === 1 && res.data?.[0]){

      dispatch(loginActions.setCmDetails(res.data?.[0]));
    }else{

      dispatch(valuesActions.statusNot1('Get cm details error'));
    }
    
  }).catch((err)=>{

    dispatch(valuesActions.error(err));
  })
}

export { getService, postService, putService, deleteService, patchService, API_ROUTES, stringInterpolater, refreshToken, getCmDetails };
  