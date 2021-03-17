import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class UpperPrompt extends Component {

	constructor(props) {
		super(props);

		this.state = {
		}
	}


	render() {		
		let statuses = [settings.statusProjectListBeingLoaded, settings.statusProjectListRequestFailed, 
			settings.statusProjectListLoaded, settings.statusProjectInfoLoaded];

		let status = this.props.status;
		let project = (typeof(this.props.project) !== 'undefined' && this.props.project !== null ) ? this.props.project : null;
		let text = (typeof(this.props.text) !== 'undefined' && this.props.text !== null ) ? this.props.text : null;
	
		let r;
		if( text !== null ) {
			r = (
				<View style={styles.upperPromptContainer}>          
					<Text style={styles.upperPrompt}>{text}</Text>
				</View>
			);
		}
		else if( project === null || !statuses.includes(status) ) {	
			r = (
				<View style={styles.upperPromptContainer}>          
					<Text style={styles.upperPrompt}>{settings.messages[settings.lang][status]}</Text>
				</View>
			);
		}
		else {
			r = (
				<View style={ [ styles.upperPromptContainer, {flexDirection:'row'} ] }>
					{settings.fileIcon}
					<Text style={ [ styles.upperPrompt, {fontStyle:'normal'} ] }>{project}</Text>
				</View>
			)
		}
		return r; 
	}
}
