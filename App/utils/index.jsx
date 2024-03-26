import { requestUserPermission, notificationListener} from  './notification'
import dayjs from 'dayjs';
function getName(firstName= '', lastName= '') {
    
    if (firstName?.length > 0) {

        let last = '';
        if(lastName?.length > 0) {
            last = ' '+lastName.charAt(0).toUpperCase()+lastName.slice(1)
        }

        return firstName.charAt(0).toUpperCase()+firstName.slice(1)+last;
    }

    return firstName;
}

function formatString(inputString) {
    const cleanedString = inputString.replace(/_/g, ' ');
    const formattedString = cleanedString.replace(/\b\w/g, (char) => char.toUpperCase());
    return formattedString;
}

function getYears(dob) {
    return dayjs().diff(dayjs(dob), 'years');
}

function getCapitalLetter(str) {
    if (typeof str !== 'string' || str?.length === 0) {
        return str;
    }
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

function getActivity(activity='') {
    
    if (activity?.length > 0) {

        if(activity?.toLowerCase() === 'intro') return "Intro Communications"
        if(activity?.toLowerCase() === 'questionnaire') return "Questionnaire"
        if(activity?.toLowerCase() === 'orthoconsultation') return "Orthopedic Consultation"
        if(activity?.toLowerCase() === 'skinconsultation') return "Dermatologist Consultation"
        if(activity?.toLowerCase() === 'eyeconsultation') return "Ophthalmologist Consultation"
        if(activity?.toLowerCase() === 'dentalconsultation') return "Dentist Consultation"
        if(activity?.toLowerCase() === 'gynaecconsultation') return "Gynecologist Consultation"
        if(activity?.toLowerCase() === 'homelab') return "Home Lab"
        if(activity?.toLowerCase() === 'lab') return "Lab"
        if(activity?.toLowerCase() === 'scan') return "Scan"
        if(activity?.toLowerCase() === 'pharma') return "Pharma"
        if(activity?.toLowerCase() === 'consultation') return "Consultation"
        if(activity?.toLowerCase() === 'pconsultation') return "Pediatric Consultation"
        if(activity?.toLowerCase() === 'dconsultation') return "Dietician Consultation"
        if(activity?.toLowerCase() === 'dietconsultation') return "Dietician Consultation"
        if(activity?.toLowerCase() === 'gpconsultation') return "General Physician Consultation"
        if(activity?.toLowerCase() === 'habitcoaching') return "Habit Coaching"
        if(activity?.toLowerCase() === 'physiotherapy') return "Physiotherapy"
        if(activity?.toLowerCase() === 'clinicalreview') return "Clinical Review"

        else return "No Activity Name"
    }

    return activity;
}

function getMobile(mobile) {
    if (mobile?.length === 10) {
        return '+91' + mobile;
    } else if (mobile?.length > 10) {
        return '+' + mobile;
    }
}

export { getName, getMobile, getActivity, requestUserPermission, notificationListener, formatString, getYears, getCapitalLetter }