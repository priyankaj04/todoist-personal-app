import {createSlice} from '@reduxjs/toolkit';
import { getService, postService, putService, deleteService, patchService, API_ROUTES, stringInterpolater, refreshToken } from '../Server'

const initialValue = {
    loginData:{},
    devEnv:false,
    noOtp:false,
    baseUrl:`https://api.circle.care/v1`,
    cmDetails:{}
}

export const LoginDetails = createSlice({
    name:'user',
    initialState:{value:initialValue},
    reducers:{
        setLoginData: (state,action) => {state.value.loginData = action.payload},
        logOut: (state,action) => {state.value.loginData = {}},
        toggleDevEnv: (state,action) => {
            state.value.devEnv = !state.value.devEnv;
            state.value.baseUrl = `https://${!state.value.devEnv?'dev':''}api.circle.care/v1`
        },
        toggleNoOtp: (state,action) => {state.value.noOtp = !state.value.noOtp},
        setCmDetails: (state,action) => {state.value.cmDetails = action.payload}
    }, 
});


export const {setLoginData, logOut, toggleDevEnv, toggleNoOtp, setCmDetails} = LoginDetails.actions;

export default LoginDetails.reducer;