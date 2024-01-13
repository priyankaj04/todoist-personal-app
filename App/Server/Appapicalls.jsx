import {URL} from './Controller';
const baseURL = URL;
import {Sentry} from '../Utils'

export const getDepartmentDoctorList = (dept) => {
    const url = URL+'/doctor/search/dept/' + dept;
    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}
export const bookUserAppointment = (body) => {

    const url = URL+'/customer/booking/create' ;
    let reqbody = body; 

    const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer'
        },
        body:JSON.stringify(reqbody)
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const raiseBookingRequest = (body) => {

    const url = URL+'/customer/booking/request' ;
    
    let reqbody = body; 
    
    reqbody.status = 'booked';
    const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer'
        },
        body:JSON.stringify(reqbody)
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const raiseBookingAsap = (patientid,sepeciality,activityname) => {

    const url = URL+'/customer/booking/request' ;
    
    let reqbody = {
        "slotid": "asap",
        "selected_dept":sepeciality,
        "patientid": patientid,
        "activityname":activityname
    }

    reqbody.status = 'booked';
    const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer'
        },
        body:JSON.stringify(reqbody)
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const createIPClaim = (reqbody,token) => {

    const url = URL+'/ipclaims/customer/create' ;

    // console.log('CALVIN URL',url) 
    // console.log('CALVIN TOKEN',token)
    // console.log('CALVIN BODY',reqbody)
   
    reqbody.status = 'booked';
    const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer '+token
        },
        body:JSON.stringify(reqbody)
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const getAllIPClaims = (token) => {
    const url = URL+'/ipclaims/claims'

    
    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":'Bearer '+token
        },
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log("getAllIPClaims",error);
            Sentry.captureException(error);
        });
}

export const getIpClaim = (id,token) => {
    const url = URL+'/ipclaims/claims/' + id;
    
    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":'Bearer '+token
        },
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}


export const UpdateIpClaim = (id,body,token) => {
    const url = URL+'/ipclaims/claims/' + id;
    
    const fetchOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer '+token
        },
        body:JSON.stringify(body)
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log("UpdateIpClaim Error", error);
            Sentry.captureException(error);
    });
}

export const UploadIPFile = (id,body,token) => {
    const url = URL+'/ipclaims/file/add/' + id;
    
    const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer '+token
        },
        body:JSON.stringify(body)
    };
    // console.log(url,fetchOptions);
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log("UpdateIpClaim Error", error);
            Sentry.captureException(error);
    });
}

export const updateAppDetails = (mobile,body) => {
    const url = URL+'/customer/id/'+mobile 
    
    const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer'
        },
        body:JSON.stringify(body)
    };
    // console.log(url,fetchOptions);
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log("UpdateIpClaim Error", error);
            Sentry.captureException(error);
    });
}

export const deleteIpfile = (id,body,token) => {
    const url = URL+'/ipclaims/file/delete/' + id;

    if (typeof body === 'undefined') {
        body = {};
    }

 
    const fetchOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer '+token
        },
        body:JSON.stringify(body)
    };

    return fetch(url, fetchOptions)
        .then((response) =>response.json())
        .catch((error) => {
            console.log("UpdateIpClaim Error", error);
            Sentry.captureException(error);
    });
}

export const deleteClaim = (claimid,token) => {
    const url = URL+'/ipclaims/delete/' + claimid;
    
    const fetchOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer '+token
        }
    };
    // console.log(url,fetchOptions);
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log("DeleteipClaim Error", error);
            Sentry.captureException(error);
    });
}

export const getRefreshedToken = (refreshToken) => {
    const url = URL+'/customer/get/accesstoken'
    
    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":'Bearer '+refreshToken
        },
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const getRaiseEmergency = (patientid) => {
    const url = URL+'/ipclaims/emergency/' + patientid;
    
    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":'Bearer'
        },
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const getPatientfiles = (patientid) => {
    const url = URL+'/patientfiles/patientid/' + patientid;
    
    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":'Bearer'
        },
    };
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            Sentry.captureException(error);
        });
}

export const deletePatientfiles = (body) => {
    const url = URL+'/patientfiles'
    
    const fetchOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization":'Bearer'
        },
        body:JSON.stringify(body)
    };
    
    return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.log("UpdateIpClaim Error", error);
            Sentry.captureException(error);
    });
}

export const patchCancelBooking = (body) => {
    const url = URL + "/booking/update/cancel";
    const fetchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  
    console.log(fetchOptions, url);
    return fetch(url, fetchOptions)
      .then((response) => response.json())
      .catch((error) => {
        console.log("error", error);
        Sentry.captureException(error);
        return { status: 0, msg: error.message };
      });
  };