import { requestUserPermission, notificationListener} from  './notification'

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

export { getName, getActivity, requestUserPermission, notificationListener }