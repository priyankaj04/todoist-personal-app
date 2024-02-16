const ImageBaseUrl = (image) => {
  return({uri: `https://circlehealth-assets.s3.ap-south-1.amazonaws.com/APP_ASSESTS/${image}.png` })
  };
  
 const getProfileIcon = (gender, age)=>{
  if(gender == 'male'){
    if(age <= 18) return ImageBaseUrl('boy');
    else if( age > 18 && age <= 50) return ImageBaseUrl('man');
    else return ImageBaseUrl('father');
  }
  else{
    if(age <= 18) return ImageBaseUrl('girl');
    else if( age > 18 && age <= 50) return ImageBaseUrl('woman');
    else return ImageBaseUrl('mother');
  }
 }


export default {
  ImageBaseUrl,
  getProfileIcon
};
