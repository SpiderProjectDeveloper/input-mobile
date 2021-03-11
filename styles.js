import {StyleSheet} from 'react-native';
import {settings} from './settings.js';

export const styles = StyleSheet.create({
    screenContainer: {
      flex:1, flexDirection:'column', width:'100%', backgroundColor: settings.screenBgColor,     
    },
    upperContainer: {
      flex:1, flexDirection:'row', width:'100%' 
    },
    upperPromptContainer: {
      flex:4, backgroundColor:'#efefef', 
      alignItems:'center', justifyContent: 'center',
			paddingLeft:4, paddingRight:4, minHeight:48     
    },
    upperPrompt: {
      fontStyle:'italic' 
    },
    upperButtonContainer: {
      flex:1, alignContent:'flex-end', alignItems: 'center', justifyContent: 'center', 
      backgroundColor:settings.activeButtonBgColor    
    },
    upperButton: {
      textAlign:'center', color:'white', paddingTop:12, paddingBottom:12
    },
    mainContainer: {
      flex:8, overflow:'scroll', alignItems: 'center', justifyContent: 'center', 
      backgroundColor: settings.screenBgColor,
    },
    container: {
      flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: settings.screenBgColor,
    },
    mainContainerScroll: {
      flex:1, width:'100%', backgroundColor: settings.screenBgColor
    },
    mainContainerScrollItem: {
        flexDirection: 'row', width:'100%', justifyContent: 'space-between', alignItems: 'center', margin: 2, padding: 4 
    },
    loginPageSubHeader: {
      color: '#7f7f7f', 
    },
    input: {
      width: 200, height: 44, padding: 10, borderWidth: 1, borderColor: 'black', borderRadius: 4, marginBottom: 10,
    },
    projectListItemContainer: {
			width:'100%', 
      flexDirection:'row', paddingLeft:24, paddingTop:4, paddingBottom:8, 
			borderStyle:'dotted', borderBottomWidth:1, borderBottomColor:settings.dimColor,			
    },
		projectListItem: { 
      paddingLeft:4, paddingTop:0, color: settings.linkColor 
    },
		projectListChosenItem: { 
      paddingLeft:4, paddingTop:0, color: settings.linkColor, fontWeight:'bold' 
    },
    projectDetailsContainer: {
      flexDirection:'column', backgroundColor:settings.screenBgColor2, marginBottom:8, padding:4
    },
		performanceDatesContainer: {
      flexDirection:'row', padding:0, backgroundColor:settings.screenBgColor2
    },
    performanceDate: {
      flex:5, paddingTop:6, paddingBottom:6, paddingLeft:4, paddingRight:4, backgroundColor:settings.screenBgColor2			     
    },
    performanceDateInput: {
      color:settings.editableTextColor, backgroundColor:'white', textAlign:'center', padding:2
    },  
		editTableCell: {
			marginLeft:-1, marginTop: -1,
			padding:4, borderWidth:1, borderColor:settings.dimColor, 
			textAlign: 'left', fontSize:14 
		},
		editTableHeadCell: {
			marginLeft:-1, marginTop: -1,
			padding:4, borderWidth:1, borderColor:settings.dimColor, 
			textAlign: 'center', fontSize:14, fontWeight:"600", color: settings.textColor 
		},
		editTableReadOnlyCell : { 
			marginLeft:-1, marginTop: -1,
			padding:4, borderWidth:1, borderColor:settings.dimColor, 
			textAlign:'center', fontSize:14, color:settings.notImportantColor 
		},
});
  