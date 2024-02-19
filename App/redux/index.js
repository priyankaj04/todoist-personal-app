import { configureStore } from "@reduxjs/toolkit";
import Login from './Login';
import Values from "./Values";
import { useDispatch, useSelector } from 'react-redux';

import { setLoginData, logOut, toggleDevEnv, toggleNoOtp, setCmDetails, setCpVersion } from './Login';
import { setAlert, statusNot1, error, setToggleTheme } from "./Values";

const store = configureStore({
    reducer: {
      Login,
      Values
    },
})

const myDispatch = () => {
  const dispatch = useDispatch();
  return dispatch;
};

const mySelector = (selector) => {
  return useSelector(selector);
};

const loginActions = { setLoginData, logOut, toggleDevEnv, toggleNoOtp, setCmDetails, setCpVersion }
const valuesActions = { setAlert, statusNot1, error, setToggleTheme, logOut }

export {
  myDispatch,
  mySelector,
  store,
  loginActions,
  valuesActions
}
