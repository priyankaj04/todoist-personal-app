import { configureStore } from "@reduxjs/toolkit";
import Login from './Login';
import Values from "./Values";
import AppData from "./AppData";
import { useDispatch, useSelector } from 'react-redux';

import { setLoginData } from './Login';
import { setAlert, statusNot1, error } from "./Values";
import {} from "./AppData";

const store = configureStore({
    reducer: {
      Login,
      Values,
      AppData
    },
})

const myDispatch = () => {
  const dispatch = useDispatch();
  return dispatch;
};

const mySelector = (selector) => {
  return useSelector(selector);
};

const loginActions = { setLoginData }
const valuesActions = { setAlert, statusNot1, error }
const appDataActions = {}

export {
  myDispatch,
  mySelector,
  store,
  loginActions,
  valuesActions,
  appDataActions,
}
