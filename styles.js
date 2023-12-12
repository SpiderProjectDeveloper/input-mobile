﻿import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {settings} from './settings.js';

export const headerHeight = 60;
export const projectDetailsHeight = 120;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    screenContainer: {
      flex:1, flexDirection:'column', 
			backgroundColor: settings.screenBgColor,     
    },
    upperContainer: {
      // flex:1, flexGrow: 1, 
			height: headerHeight,
			flexDirection:'row', width:'100%' 
    },
    upperPromptContainer: {
      flex:4, backgroundColor:'#efefef', 
      alignItems:'center', justifyContent: 'center',
			paddingLeft:4, paddingRight:4,
    },
    upperPrompt: {
      fontStyle:'italic', 
			fontSize: 14,
    },
    upperButtonContainer: {
      //flex:1, alignContent:'flex-end', 
			width: 60, height: headerHeight,
			alignItems: 'center', justifyContent: 'center', 
      backgroundColor:settings.activeButtonBgColor    
    },
    upperButton: {
      textAlign:'center', color:'white', fontSize:18, paddingTop:12, paddingBottom:12
    },
    mainContainer: {			
      //flex:8, flexGrow: 8, 
			overflow:'scroll', flexDirection:'column', 
			alignItems: 'center', justifyContent: 'center', 
      backgroundColor: settings.screenBgColor
    },
    container: {
      flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: settings.screenBgColor
    },
    mainContainerScroll: {
      //flex: 6, flexGrow: 8, 
			flexDirection:'column', 
			backgroundColor: settings.screenBgColor
    },
    mainContainerScrollItem: {
        flexDirection: 'row', width:'100%', margin: 2, padding: 4, 
				justifyContent: 'space-between', alignItems: 'center' 
    },
    loginPageSubHeader: {
      color: '#7f7f7f'
    },
    input: {
      width: 200, padding: 10, 
			borderWidth: 1, borderColor: 'black', borderRadius: 4, marginBottom: 10
    },
    projectListItemContainer: {
			width:'100%', 
      flexDirection:'row', paddingLeft: 24, paddingTop: 4, paddingBottom: 8, 
			borderStyle:'dotted', borderBottomWidth:1, borderBottomColor:settings.dimColor
    },
		projectListItem: { 
      padding: 4, color: settings.linkColor 
    },
		projectListChosenItem: { 
      padding: 4, color: settings.linkColor, backgroundColor: '#efefef' 
    },
    projectDetailsContainer: {
      //flex: 1, flexGrow: 2, flexShrink: 1, 
			flexDirection:'column', 
			height: projectDetailsHeight,
			backgroundColor:settings.screenBgColor2, marginBottom: 8, padding: 0
    },
		performanceDatesContainer: {
      flexDirection: 'row', padding: 0, backgroundColor: settings.screenBgColor2
    },
    performanceDate: {
      flex: 5, margin:2, paddingTop: 0, paddingBottom: 6, paddingLeft: 4, paddingRight: 4, 
			backgroundColor: settings.screenBgColor2			     
    },
    performanceDateInput: {
      color:settings.editableTextColor, backgroundColor:'white', textAlign:'center', padding:0
    },  
		editTableCell: {
			marginLeft:-1, marginTop: -1, padding:1, 
			borderWidth:1, borderColor:settings.dimColor, 
			textAlign: 'left', fontSize:14 
		},
		editTableDatetimeCell: {
			marginLeft:-1, marginTop: -1, padding:1, 
			borderWidth:1, borderColor:settings.dimColor, 
		},
		editTableDatetimeText: {
			padding:2, textAlign: 'left', fontSize:14 
		},		
		editTableHeadCellContainer: {
			flexDirection:'column', 
			marginLeft:-1, marginTop: -1, padding: 0,
			borderWidth:1, borderColor:settings.dimColor, 
			textAlign: 'center', boxSizing: 'border-box' 
		},
		editTableHeadCell: {
			marginLeft:-1, marginTop: -1, padding:1, 
			textAlign: 'center', fontSize:14, fontWeight:"600", 
			color: settings.textColor 
		},
		editTableLineNumberCell: {
			padding:0, textAlign: 'center', fontSize:14, fontWeight:"600", 
			color: settings.dimColor 
		},
		editTableHeadCellControl: {
			padding:1, textAlign: 'center', fontSize:14, fontWeight:"600", 
			color: settings.activeButtonBgColor 
		},
		editTableReadOnlyCell : { 
			marginLeft:-1, marginTop: -1, padding: 2, 
			borderWidth: 1, borderColor: settings.dimColor, 
			textAlign: 'center', fontSize: 14, color: settings.notImportantColor 
		},

		centeredView: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 20,
		},
		modalView: {
			margin: 20,
			backgroundColor: 'white',
			borderRadius: 20,
			padding: 20,
			alignItems: 'center',
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
		},	
});
  