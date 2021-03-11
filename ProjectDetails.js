import React, { Component } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import { EditField } from './EditField.js';
import { logHelper, formatSpiderDateHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

function getVersionButtonWidth() {
	return Math.floor( Math.min(settings.window.height, settings.window.width) / 5);
}

export class ProjectDetails extends Component {

	constructor(props) {
		super(props);

		this._perfStart = formatSpiderDateHelper( new Date(new Date() - 1000*60*60*24*7), true );
		this._perfEnd = formatSpiderDateHelper( new Date(), true );

		this.perfStartSetter = this.perfStartSetter.bind(this);
		this.perfEndSetter = this.perfEndSetter.bind(this);
	}

	perfStartSetter(v) {
		this._perfStart = v;
	}
	perfEndSetter(v) {
		this._perfEnd = v;
	}


	render() {		

		let versions=[];
		for( let i = 0 ; i < this.props.versions.length ; i++ ) {
			let v = this.props.versions[i];
			versions.push(
				<Text 								
					key={String(i)}
					style={{ 
						marginTop:4, marginBottom:4, marginLeft:4, marginRight:4, padding:4, textAlign:'center',
						textDecorationLine:'underline', textDecorationStyle:'dotted',
						color:(!this.props.disabled) ? settings.linkColor : settings.dimColor
					}}
					onPress={ () => {
						if( !this.props.disabled ) { 
							this.props.onPress(this.props.project, v) 
						}
				} }>{v}</Text>
			)
		}

		let editFieldStyle = (!this.props.disabled) ? 
			styles.performanceDateInput : [styles.performanceDateInput, {color:settings.dimColor}];
		return(
			<View style={styles.projectDetailsContainer}>
				<View style={styles.performanceDatesContainer}>
					<EditField disabled={this.props.disabled} 
						style={editFieldStyle} viewStyle={styles.performanceDate} type={'datetime'}
						value={this._perfStart} setter={this.perfStartSetter} placeholder={'Start Date'} />							
					<EditField disabled={this.props.disabled}
						style={editFieldStyle} viewStyle={styles.performanceDate} type={'datetime'}
						value={this._perfEnd} setter={this.perfEndSetter} placeholder={'End Date'} />
				</View>
				<ScrollView horizontal={true} 
					style={{ flexDirection:'row', marginBottom:2, padding:4, backgroundColor:settings.screenBgColor }}>
					{versions}
				</ScrollView>
			</View>
		);
	}
}