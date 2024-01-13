import {URL} from './Controller';
const baseURL = URL;

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

  const API_ROUTES = {
    OTP_SEND: `${baseURL}/customer/otp/send`,
    EMAIL_OTP_SEND: `${baseURL}/customer/otp/send/email`,
    UPDATE_MOBILE:`${baseURL}/customer/mobile/update/send`,
    VERIFY_MOBILE_UPDATE:`${baseURL}/customer/mobile/update/verify`,
    OTP_CALL: `${baseURL}/customer/otp/retry`,
    OTP_VERIFY: `${baseURL}/customer/otp/verify`,
    EMAIL_OTP_VERIFY: `${baseURL}/customer/otp/verify/email`,
    VERIFY_MOBILE_UPDATE:`${baseURL}/customer/mobile/update/verify`,
    UPNEXTACTIVITY:`${baseURL}/activity/nextact/{patientid}`,
    CREATE_USER: `${baseURL}/customer/create`,
    CREATE_LIFE:`${baseURL}/patient/createlife`,
    GET_PATIENTS: `${baseURL}/patient/search/mobile/{mobile}`,
    GET_PATIENT_DETAILED: `${baseURL}/patient/detailed/patientid/{patientid}`,
    ACTIVITIES: `${baseURL}/activity/patientid/{patientid}/{activity}`,
    ACTIVITIY: `${baseURL}/activity/activityid/{activityid}`,
    CAREMANAGER: `${baseURL}/staffuser/search/term/{emailid}`,
    JOURNEY: `${baseURL}/journey/{patientid}`,
    DOCTOR_SLOTS: `${baseURL}/slot/doctor/{doctorid}/{slots}`,
    DOCTOR_DETAILS: `${baseURL}/doctor/{doctorid}`,
    GETDEPTDOCTORS: `${baseURL}/doctor/department/{sepeciality}`,
    CUSTOMORDER: `${baseURL}/order/paymentorder/custom`,
    GET_CITIES:'https://api.postalpincode.in/pincode/{pincode}',
    GET_HOMELAB_SLOTS:`${baseURL}/partner/get/slots?pincode={pincode}&slot_date={selecteddate}&address={address}&lat={lat}&long={long}&vendor={vendor}`,
    CREATE_PARTNERLAB_BOOKING:`${baseURL}/partner/create/booking`,
    IS_SERVICEABLE:`${baseURL}/partner/pincode/service?pincode={pincode}`,
    GET_ALL_DOCTORS: `${baseURL}/doctor/all/0`,
    CREATE_CUSTOMER_CONSULTATION: `${baseURL}/customer/booking/create`,
    CREATE_PATIENT: `${baseURL}/patient/create`,
    EDIT_PATIENT: `${baseURL}/patient/{patientid}`,
    BOOKINGS: `${baseURL}/booking/patientid/{patientid}/status/booked`,
    UPDATE_BOOKING: `${baseURL}/booking/update`,
    LAB_SCAN_BOOKING: `${baseURL}/labscanpharmaorder/intent`,
    DELETE_FILE: `${baseURL}/patientfiles`,
    CANCEL_BOOKING: `${baseURL}/booking/update/cancel`,
    HEALTH_CARD: `${baseURL}/patient/createtpacard/{pId}`,
    BENIFITSappoffers: `${baseURL}/corporate/patient/benefits?patientid={patientid}`,
    GETCORPORATEDETAILS: `${baseURL}/corporate/{id}`,
    GETLATLONG: `${baseURL}/others/getlatlong?address={address}`,
    ONGOINGHOMELAB:`${baseURL}/labscanpharmaorder/search/1?patientid={patientid}&status=ongoing&type=lab`,
    CANCELHOMELAB:`${baseURL}/partner/cancel/link`,
    POLICYDATA: `${baseURL}/policy/{id}?type=customer`,
    POLICYDETAILS: `${baseURL}/policy/{id}?type=policydetails`,
    GETAPPDETAILS: `${baseURL}/customer/appdetails`,
    FEEDBACKDATA:`${baseURL}/feedback/search?patientid={patientid}&activityid={activityid}`,
    SAVEFEEDBACK:`${baseURL}/feedback/create`,
    GETPAIDLABS: `${baseURL}/partner/products`,
    PRODUCTDETAILS:`${baseURL}/partner/products/details`,
    PAIDHOMELABORDER:`${baseURL}/partner/homelab/booking`,
    GETHEALTHPLANDETAILS:`${baseURL}/healthplan/patient/{patientid}`,
    PATCHHEALTHPLAN:`${baseURL}/healthplan/patient/{patientid}`,
    FAQS:`${baseURL}/others/faqs`,
    FAQSTYPE:`${baseURL}/others/faqs?type={type}`
  };
  
  export { getService, postService, putService, deleteService, patchService, API_ROUTES };
  