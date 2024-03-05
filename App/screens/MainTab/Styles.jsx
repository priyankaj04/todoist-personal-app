import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
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
    shadowOffset: { width: 0, height: 1 },
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
  patientCard: {
    backgroundColor: '#f1f5ff',
    marginBottom: 18,
    minHeight: 80,
    borderRadius: 5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5
  },
  minBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    padding: 5,
    backgroundColor: '#ededed',
    borderRadius: 5,
    paddingHorizontal: 10,
    zIndex: 2
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 5,
    padding: 7,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingHorizontal: 10,
    zIndex: 2,
    width: '100%',
    borderWidth: 1,
    color: '#000',
    flex: 1
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 5,
    padding: 6,
    backgroundColor: '#ededed',
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  //! Dropdown styles
  dropdown: {
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    borderWidth: 1,
    paddingVertical: 2
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000'
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#000'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000'
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: '#000'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#000'
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  selectedStyle: {
    fontSize: 14,
    color: '#000'
  },
  itemContainerStyle: {
    borderBottomWidth: 1,
    borderColor: '#cfcfcf',
  },
  //! Dropdown styles
  card: {
    minHeight: 100,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f2f5f9',
    borderStyle: 'solid',
  },

});

export default styles;