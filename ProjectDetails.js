import React, { Component } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import { EditField } from './EditField.js';
import { logHelper, makeUrlHelper, isValidTimeInSecondsHelper, formatSpiderDateHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class ProjectDetails extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fetching: false, fetchingOk: null,
			projectInfo: {
				versionIndex: null, version:null, name: null, date: null, notes: null
			}
		}

		this._lastProjectRendered = null;

		this._perfStart = formatSpiderDateHelper( parseInt(Date.now()/1000), true );
		this._perfEnd = formatSpiderDateHelper( parseInt((Date.now() + 1000*60*60*24*7)/1000), true );

		this.perfStartSetter = this.perfStartSetter.bind(this);
		this.perfEndSetter = this.perfEndSetter.bind(this);

		this.perfStartRef = React.createRef();
		this.perfEndRef = React.createRef();

		this.getProjectInfo = this.getProjectInfo.bind(this);
	}

	perfStartSetter(v) {
		this._perfStart = v;
	}
	perfEndSetter(v) {
		this._perfEnd = v;
	}

	/*
	shouldComponentUpdate(nextProps, nextState) {
		if( this.props.project !== nextProps.project || this.props.projectInfo.versionIndex !== nextProps.projectInfo.versionIndex ) {
			return true;
		}
		return false;
	}
	*/

	getProjectInfo(projectName, projectVersion, versionIndex) {
		let fileName = projectName + "." + projectVersion + ".sprj";
		this.setState( { fetching: true, fetchingOk: null, projectInfo:{ versionIndex:null } }, function() {
			fetch( makeUrlHelper(this.props.credentials), {
					method:'POST',
					body: JSON.stringify({ command:'getProjectProp', sessId:this.props.sessId, fileName: fileName})
			}).
			then( response => response.json()).
			then( d => {
				if( !('errcode' in d) || d.errcode != 0 ) {
					this.setState({ fetching: false, fetchingOk: false });        
				} else {
					if( isValidTimeInSecondsHelper(d.project.CurTime) ) {
						this._perfStart = formatSpiderDateHelper( parseInt(d.project.CurTime), true  );
						this._perfEnd = formatSpiderDateHelper( parseInt(d.project.CurTime) + 60*60*24*7, true );			
						this.perfStartRef.current.setValue(this._perfStart);
						this.perfEndRef.current.setValue(this._perfEnd);
					}
					this.setState({ 
						fetching: false, fetchingOk: true,
						projectInfo: { versionIndex: versionIndex, version:d.project.Version,
							name: d.project.Name, date: d.project.CurTime, notes: d.project.Notes } 
					});
				}
			}).
			catch( (e) => {
					this.setState({ fetching: false, fetchingOk: false });
			});
		});
	}


	render() {		
		let pinfo = {...this.state.projectInfo};		
		if( this._lastProjectRendered !== this.props.project ) {
			pinfo.versionIndex = null;
		}
		this._lastProjectRendered = this.props.project;

		let versions=[];
		for( let i = 0 ; i < this.props.versions.length ; i++ ) {
			let v = this.props.versions[i];
			versions.push(
				<Text 								
					key={String(i*2)}
					style={{ marginTop:4, marginBottom:4, marginLeft:4, marginRight:0, padding:4, textAlign:'center',
						backgroundColor: settings.activeButtonBgColor, borderRadius:2,
						color:(!this.props.disabled) ? 'white' : settings.dimColor
				}}
					onPress={ () => {
						if( !this.props.disabled ) { 
							this.props.onPress(this.props.project, v, this._perfStart, this._perfEnd); 
						}
					}}>{v}
				</Text>
			);
			versions.push(
				<Text 								
					key={String(i*2+1)}
					style={{ marginTop:4, marginBottom:4, marginLeft:0, marginRight:8, 
						paddingTop:4, paddingBottom:4, paddingLeft:8, paddingRight:8, textAlign:'center', 
						//textDecorationLine:'underline', textDecorationStyle:'dotted',
						color: (!this.props.disabled) ? settings.linkColor : settings.dimColor, 
						backgroundColor: (!this.props.disabled && pinfo.versionIndex === i) ? '#efefef' : '#ffffff'
					}}
					onPress={ () => {
						if( !this.props.disabled ) { 
							this.getProjectInfo(this.props.project, v, i) 
						}
					}}>{settings.infoIcon}
				</Text>
			);
		}

		let pinfoComponent;
		let projectTextColor = (!this.props.disabled) ? settings.linkColor : settings.dimColor;
		if( this.state.fetching ) {
			pinfoComponent = (
				<View style={{marginBottom:4}}>
					<Text style={{padding:4, fontStyle:'italic', color:settings.textColor}}>
						{settings.messages[this.props.lang][settings.statusProjectInfoBeingLoaded]}
					</Text> 
				</View>
			)
		} else if( this.state.fetchingOk === false ) {
			pinfoComponent = (
				<View style={{marginBottom:4}}>
					<Text style={{padding:4, fontStyle:'italic', color:settings.warningColor}}>
						{settings.messages[this.props.lang][settings.statusProjectInfoLoadFailed]}
					</Text> 
				</View>
			)
		} else if( pinfo.versionIndex !== null ) {
			pinfoComponent = (
				<View horizontal={true} style={{marginBottom:4}}>
					<Text 
						style={{padding:4, color: projectTextColor, textDecorationLine:'underline', textDecorationStyle:'dotted'}}
						onPress={() => {
							if( !this.props.disabled ) { 
								this.props.onPress(this.props.project, this.props.versions[pinfo.versionIndex], this._perfStart, this._perfEnd) 
							}
						}}		
					>
						{`${pinfo.name} (${settings.texts[this.props.lang].versionShort} ${pinfo.version})`}
						{(typeof(pinfo.notes) !== 'undefined' && pinfo.notes) ? (' ' + pinfo.notes) : null}
					</Text>
				</View>
			)
		} else {
			pinfoComponent = null;
		}

		let editFieldStyle = (!this.props.disabled) ? 
			styles.performanceDateInput : [styles.performanceDateInput, {color:settings.dimColor}];

		return(
			<View style={styles.projectDetailsContainer}>
				<View style={styles.performanceDatesContainer}>
					<EditField disabled={this.props.disabled} ref={this.perfStartRef}
						style={editFieldStyle} viewStyle={styles.performanceDate} type={'datetime'}
						value={this._perfStart} setter={this.perfStartSetter} placeholder={'Start Date'} />							
					<EditField disabled={this.props.disabled} ref={this.perfEndRef}
						style={editFieldStyle} viewStyle={styles.performanceDate} type={'datetime'}
						value={this._perfEnd} setter={this.perfEndSetter} placeholder={'End Date'} />
				</View>
				{pinfoComponent}
				<ScrollView horizontal={true} 
					style={{ flexDirection:'row', marginBottom:2, padding:4, backgroundColor:settings.screenBgColor }}>
					{versions}
				</ScrollView>
			</View>
		);
	}
}