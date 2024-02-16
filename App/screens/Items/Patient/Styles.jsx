import { StyleSheet } from 'react-native';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const styles = StyleSheet.create({
  statusBar:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom:8
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    columnGap:10
  },
  column:{
    flexDirection: 'column',
    alignItems: 'center',
    columnGap:10
  },
  scrollContainer:{
    marginHorizontal:12,
    flex:1,
  },
  profilePic:{
    height: 100,
    width: 100,
    padding:20,
    borderRadius:50,
    borderWidth: 1,
    borderColor:'#000',
    backgroundColor:'#eff5ff'
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
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap:5,
    padding:6,
    backgroundColor:'#ededed',
    color: '#000',
    borderRadius:5,
    paddingHorizontal:10,
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
  accordionItem: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 5
  },
  header: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color:'#000'
  },
  content: {
    padding: 10,
  },
  pdf:{
    flex: 1,
    height: '100%',
    width: '100%',
    borderRadius: 8,
  },
});

export default styles;