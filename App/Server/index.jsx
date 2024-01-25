import {URL} from './Controller';
const baseURL = URL;
import AsyncStorage from '@react-native-community/async-storage';
import { valuesActions, loginActions } from '../redux';
import jwtDecode from "jwt-decode";

  async function postService(url = '', data = {}) {
    const response = await fetch(url, {
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
  
  async function getService(url = '') {
    const response = await fetch(url, {
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

  async function getTokenService(url = '', token='') {
    const response = await fetch(url, {
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
  
  async function putService(url = '', data = {}) {
    const response = await fetch(url, {
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
  
  async function patchService(url = '', data = {}) {
    const response = await fetch(url, {
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
  
  async function deleteService(url = '', data = {}) {
    const response = await fetch(url, {
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
    VERIFY_USER : `${baseURL}/staffuser/verify`,
    REFRESH_USER : `${baseURL}/staffuser/refreshtokenv2`
  };

  const refreshToken = (dispatch, setLoading)=>{

    AsyncStorage.getItem('refreshToken').then((refreshToken)=>{
      
      if (refreshToken) {

        getTokenService(API_ROUTES.REFRESH_USER, refreshToken ).then((response) => {
          
          if(response?.token){

            let decoded = jwtDecode(response.token);

            dispatch(loginActions.setLoginData({
              email: decoded.email,
              type: decoded.type,
              token: response?.token
            }));
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
  
  export { getService, postService, putService, deleteService, patchService, API_ROUTES, stringInterpolater, refreshToken };
  