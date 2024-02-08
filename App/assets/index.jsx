const ImageBaseUrl = (image) => {
  return({uri: `https://circlehealth-assets.s3.ap-south-1.amazonaws.com/APP_ASSESTS/${image}.png` })
  };
  
 const getProfileIcon = (gender, age)=>{
  if(gender == 'male'){
    if(age <= 18) return ImageBaseUrl(S3Images.boy);
    else if( age > 18 && age <= 50) return ImageBaseUrl(S3Images.man);
    else return ImageBaseUrl(S3Images.father);
  }
  else{
    if(age <= 18) return ImageBaseUrl(S3Images.girl);
    else if( age > 18 && age <= 50) return ImageBaseUrl(S3Images.woman);
    else return ImageBaseUrl(S3Images.mother);
  }
 }


export default {
  ImageBaseUrl,
  getProfileIcon
};
