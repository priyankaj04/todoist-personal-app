import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10,
  },
  header: {
    flexDirection:'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: '600',
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#303030',
  },
  text: {
    fontSize: 14,
    color: '#303030',
  },
  details: {
    fontSize: 12,
    color: '#303030',
  },
  //! Patients
  patientCard: {
    backgroundColor:'#f1f5ff',
    marginBottom:18,
    minHeight:80,
    padding:10,
    borderRadius:5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap:5
  },
  minBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap:5,
    padding:5,
    backgroundColor:'#ffffff',
    borderRadius:5,
    paddingHorizontal:10,
    zIndex:2
  },
  //! Patients

  //! myJobs
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap:5,
    padding:7,
    backgroundColor:'#ffffff',
    borderRadius:5,
    paddingHorizontal:10,
    zIndex:2,
    width:'100%',
    borderWidth: 1,
    color: '#000',
    flex: 1
  },
  //! myJobs

  //! appointments
  
  //! appointments

});

export default styles;