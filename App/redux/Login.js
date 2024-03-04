import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
    loginData:{email:'priyanka@circlehealth.in'},
    devEnv:false,
    noOtp:false,
    baseUrl:`https://api.circle.care/v1`,
    corporateDetails:{},
    cpVersion:null
}

export const LoginDetails = createSlice({
    name:'user',
    initialState:{value:initialValue},
    reducers:{
        setLoginData: (state,action) => {state.value.loginData = action.payload},
        logOut: (state,action) => {state.value.loginData = {}},
        toggleDevEnv: (state,action) => {
            state.value.devEnv = !state.value.devEnv;
            state.value.baseUrl = `https://${state.value.devEnv?'dev':''}api.circle.care/v1`
        },
        toggleNoOtp: (state,action) => {state.value.noOtp = !state.value.noOtp},
        setCorporateDetails: (state, action) => { state.value.corporateDetails = action.payload},
        setCpVersion: (state,action) => {state.value.cpVersion = action.payload}
    }, 
});


export const { setLoginData, logOut, toggleDevEnv, toggleNoOtp, setCorporateDetails, setCpVersion} = LoginDetails.actions;

export default LoginDetails.reducer;