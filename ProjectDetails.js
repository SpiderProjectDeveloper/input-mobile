import React, { Component } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import { EditField } from './EditField.js';
import { logHelper, formatSpiderDateHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

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
					key={String(i*2)}
					style={{ marginTop:4, marginBottom:4, marginLeft:4, marginRight:0, padding:4, textAlign:'center',
						textDecorationLine:'underline', textDecorationStyle:'dotted',
						color: (!this.props.disabled) ? settings.linkColor : settings.dimColor, 
						backgroundColor: (!this.props.disabled && this.props.projectInfo.versionIndex === i) ? '#efefef' : '#ffffff'
					}}
					onPress={ () => {
						if( !this.props.disabled ) { 
							this.props.onPress(this.props.project, v) 
						}
					}}>{v}
				</Text>
			);
			versions.push(
				<Text 								
					key={String(i*2+1)}
					style={{ marginTop:4, marginBottom:4, marginLeft:0, marginRight:8, padding:4, textAlign:'center',
						backgroundColor: settings.activeButtonBgColor,
						color:(!this.props.disabled) ? settings.linkColor : settings.dimColor
					}}
					onPress={ () => {
						if( !this.props.disabled ) { 
							this.props.onInfo(this.props.project, v, i) 
						}
					}}>{settings.infoIcon}
				</Text>
			);
		}

		if( this.props.projectInfo.date === null ) {
			this._perfStart = formatSpiderDateHelper( new Date(new Date() - 1000*60*60*24*7), true );
			this._perfEnd = formatSpiderDateHelper( new Date(), true );	
		} else {
			this._perfStart = formatSpiderDateHelper( this.props.projectInfo.date );
			this._perfEnd = formatSpiderDateHelper( this.props.projectInfo.date - 60*60*24*7 );	
		}


		let editFieldStyle = (!this.props.disabled) ? 
			styles.performanceDateInput : [styles.performanceDateInput, {color:settings.dimColor}];
		let pinfo = this.props.projectInfo;
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
				{
					(pinfo.versionIndex !== null ) ? (
						<View style={{marginBottom:4}}>
						<Text style={{padding:4}}>
							{`${pinfo.name} (${settings.texts[settings.lang].versionShort} ${pinfo.version})`}
							{(typeof(pinfo.notes) !== 'undefined' && pinfo.notes) ? (' ' + pinfo.notes) : null}
						</Text>
						</View>
					) : null
				}
				<ScrollView horizontal={true} 
					style={{ flexDirection:'row', marginBottom:2, padding:4, backgroundColor:settings.screenBgColor }}>
					{versions}
				</ScrollView>
			</View>
		);
	}
}