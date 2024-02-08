import {createSlice} from '@reduxjs/toolkit';

const initialValue= {
                        alert:{
                            text : '',
                            style : '',
                            show : false,
                            type : ''
                        },
                        toggleTheme: false
                    }

export const SharedValues = createSlice({
    name:'user',
    initialState:{value:initialValue},
    reducers:{
        setAlert: (state,action) => { state.value.alert = action.payload; },
        statusNot1:(state,action) => {
            state.value.alert = {
                text : action.payload,
                style : 'warning',
                show : true,
                type : 'statusnot1'
            }
        },
        error:(state,action) => {
            console.log('ERROR',action.payload?.error)
            state.value.alert = {
                text : `Something went wrong, please try again! if problem persists contact product team`,
                style : 'warning',
                show : true,
                type : 'error'
            }
        },
        setToggleTheme: (state,action) => { state.value.toggleTheme = !state.value.toggleTheme; }
    }, 
});

export const { setAlert, statusNot1, error, setToggleTheme } = SharedValues.actions;

export default SharedValues.reducer;