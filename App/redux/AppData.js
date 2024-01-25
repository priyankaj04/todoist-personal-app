import {createSlice} from '@reduxjs/toolkit';
import { COLORS } from '../Constants';

const initialValue = {
    appoffers:[],
    benefits:[],
    caremangerdetails:null,
    bookings:{upcomingappointments:[], pastappointments:[]},
    upnextactivity:null,
    completedactivity:[],
    pendingactivity:[],
    ongoingactivity:[],
    awaitingactivity:[],
    self:{},
    reload:'',
    patientDetailed:{
        activitydetails: [],
        consultationdetails: [],
        lspdetails: [],
        patientfiles: [],
    },
    ongoinglabdetails:null,
    codongoinglabdetails:null,
    policydata:null,
    feedback:false,
    gpadetails:null,
    gtldetails:null,
    gmcdetails:null,
    labcart:[],
    googlefit:false,
    healthplan:{},
}

export const AppData = createSlice({
    name:'user',
    initialState:{value:initialValue},
    reducers:{
        setappoffers: (state,action) => {state.value.appoffers = action.payload},
        setBenefits: (state,action) => {state.value.benefits = action.payload},
        setBookings: (state,action) => {state.value.bookings = action.payload},
        setUpnextactivity: (state,action) => {state.value.upnextactivity = action.payload},
        setCompletedactivity: (state,action) => {state.value.completedactivity = action.payload},
        setPendingactivity: (state,action) => {state.value.pendingactivity = action.payload},
        setOngoinactivity: (state,action) => {state.value.ongoingactivity = action.payload},
        setAwaitingactivity: (state,action) => {state.value.awaitingactivity = action.payload},
        setSelf: (state,action) => {state.value.self = action.payload},
        setCaremangerdetails: (state,action) => {state.value.caremangerdetails = action.payload},
        setReload: (state,action) => {state.value.reload = action.payload},
        setPatientDetailed: (state,action) => {state.value.patientDetailed = {...state.value.patientDetailed, ...action.payload}},
        setOngoinglabdetails: (state,action) => {state.value.ongoinglabdetails = action.payload},
        setCodOngoinglabdetails: (state,action) => {state.value.codongoinglabdetails = action.payload},
        setPolicydata: (state,action) => {state.value.policydata = action.payload},
        setFeedback: (state,action) => {state.value.feedback = action.payload},
        setGpadetails: (state,action) => {state.value.gpadetails = action.payload},
        setGmcdetails: (state,action) => {state.value.gmcdetails = action.payload},
        setGtldetails: (state,action) => {state.value.gtldetails = action.payload},
        setLabcart: (state,action) => {state.value.labcart = action.payload},
        setGooglefit: (state,action) => {state.value.googlefit = action.payload},
        setHealthplan: (state,action) => {state.value.healthplan = action.payload}
    }, 
});


export const {
    setappoffers,
    setBenefits,
    setBookings,
    setUpnextactivity,
    setCompletedactivity,
    setPendingactivity,
    setSelf,
    setCaremangerdetails,
    setReload,
    setPatientDetailed,
    setOngoinactivity,
    setAwaitingactivity,
    setOngoinglabdetails,
    setPolicydata,
    setFeedback,
    setGpadetails,
    setGtldetails,
    setLabcart,
    setCodOngoinglabdetails,
    setGooglefit,
    setHealthplan,
    setGmcdetails
} = AppData.actions;

export default AppData.reducer;