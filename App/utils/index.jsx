function getName(firstName= '', lastName= '') {
    
    if (firstName?.length > 0) {

        let last = '';
        if(lastName.length > 0) {
            last = ' '+lastName.charAt(0).toUpperCase()+lastName.slice(1)
        }

        return firstName.charAt(0).toUpperCase()+firstName.slice(1)+last;
    }

    return firstName;
}

export { getName }