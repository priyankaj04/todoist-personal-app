import {createSlice} from '@reduxjs/toolkit';

const initialValue = {
    loginData:{}
}

export const LoginDetails = createSlice({
    name:'user',
    initialState:{value:initialValue},
    reducers:{
        setLoginData: (state,action) => {state.value.loginData = action.payload},
    }, 
});


export const {setLoginData} = LoginDetails.actions;

export default LoginDetails.reducer;