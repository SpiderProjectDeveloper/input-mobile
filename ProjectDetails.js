import React, { Component } from 'react';
import { View, ScrollView, Text, FlatList } from 'react-native';
import { EditField } from './EditField.js';
import { 
	makeUrlHelper, isValidTimeInSecondsHelper, formatSpiderDateHelper, readDictValue 
} from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class ProjectDetails extends Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
			fetching: false, fetchingOk: null,
			projectInfo: {
				versionIndex: null, version:null, name: null, date: null, notes: null,
				input: {from: null, to: null, showAssign: null }
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

	getProjectInfo(projectName, projectVersion, versionIndex) 
	{
		let fileName = projectName + "." + projectVersion + ".sprj";
		this.setState( { fetching: true, fetchingOk: null, projectInfo:{ versionIndex:null } }, function() {
			fetch( makeUrlHelper(this.props.credentials), {
					method:'POST',
					body: JSON.stringify({ command:'getProjectProp', sessId:this.props.sessId, fileName: fileName})
			}).
			then( response => response.json()).
			then( d => {
				if( !('errcode' in d) || d.errcode != 0 ) 
				{
					this.setState({ fetching: false, fetchingOk: false });        
				} else 
				{
					let from = readDictValue( d.performanceInputSettings, 'f_PerformanceInputStart', 'number' );
					let to = readDictValue( d.performanceInputSettings, 'f_PerformanceInputFin', 'number' );;
					let showAssignments = readDictValue( d.performanceInputSettings, 'f_PerformanceShowAssignments', 'string' );
					showAssignments = ( showAssignments === 'yes' ) ? true : false;

					let isDates = isValidTimeInSecondsHelper(from) && isValidTimeInSecondsHelper(to);
					if( isDates ) {
						this._perfStart = formatSpiderDateHelper( from, true  );
						this._perfEnd = formatSpiderDateHelper( to, true );			
					} else {
						if( isValidTimeInSecondsHelper(d.project.CurTime) ) {
							this._perfStart = formatSpiderDateHelper( parseInt(d.project.CurTime), true  );
							let addDays = (this.props.parameters.performanceFromCurTime === 'yes') ? this.props.performanceDays : null;
							let days = (addDays) ? addDays : 60*60*24*7;
							this._perfEnd = formatSpiderDateHelper( parseInt(d.project.CurTime) + days, true );			
						} else {
							this._perfStart = '';
							this._perfEnd = '';	
						}
					}
					this.perfStartRef.current.setValue(this._perfStart);
					this.perfEndRef.current.setValue(this._perfEnd);

					this.setState({ 
						fetching: false, fetchingOk: true,
						projectInfo: { versionIndex: versionIndex, version:d.project.Version,
							name: d.project.Name, date: d.project.CurTime, notes: d.project.Notes,
							input: { from: from, to: to, showAssignments: showAssignments } } 
					});
				}
			}).
			catch( (e) => {
					this.setState({ fetching: false, fetchingOk: false });
			});
		});
	}


	render() 
	{		
		this.props.versions.sort( (a, b) => { 
			let va = parseInt(a.version); 
			let vb = parseInt(b.version); 
			if( isNaN(va) && isNaN(vb) ) return -1;
			if( isNaN(vb) ) return -1;
			if( isNaN(va) ) return 1;
			return(vb - va); 
		} );

		let pinfo = {...this.state.projectInfo};		
		if( this._lastProjectRendered !== this.props.project ) {
			pinfo.versionIndex = null;
		}
		this._lastProjectRendered = this.props.project;

		let pinfoComponent = null;
		let projectTextColor = (!this.props.disabled) ? settings.linkColor : settings.dimColor;
		if( this.state.fetching || this.state.fetchingOk===false || pinfo.versionIndex === null) 
		{
			let text, color; 
			if(this.state.fetching) {
				text = settings.messages[this.props.lang][settings.statusProjectInfoBeingLoaded];
				color = settings.textColor;
			} else if( this.state.fetchingOk === false ) {
				text = settings.messages[this.props.lang][settings.statusProjectInfoLoadFailed];
				color = settings.warningColor;
			} else {
				text = settings.messages[this.props.lang][settings.promptTapToRequestProjectInfo];
				color = settings.textColor;
			}
			//text = splitText( text );
			pinfoComponent = (
				//<View key={-1} style={{ marginBottom: 4 }}>
					<Text style={{ padding: 4, color: color }} numberOfLines={1}>
						{text}
					</Text> 
				//</View>
			)
		} else if( pinfo.versionIndex !== null ) 
		{
			let editable = pinfo.input.from !== null && pinfo.input.to !== null;
			let icon = (editable) ? String.fromCharCode( 0x270E ) : String.fromCharCode( 0x3f );
			let text = `${icon} [${pinfo.version}] ${pinfo.name}`;
			if( typeof(pinfo.notes) !== 'undefined' && pinfo.notes ) {
				text += ' ' + pinfo.notes;
			}
			pinfoComponent = (
				//<View key={-1} horizontal={true} style={{ marginBottom:4 }}>
					<Text
						style = {{ 
							padding:4, color: projectTextColor, 
							textDecorationLine:'underline', textDecorationStyle:'dotted' 
						}}
						numberOfLines={1}
						onPress = { (!editable && false) ? null : () => {
							if( !this.props.disabled ) { 
								this.props.onPress(
									this.props.project, this.props.versions[pinfo.versionIndex].version, 
									this.props.storage, this._perfStart, this._perfEnd 
								);
							}
						} }		
					>{text}</Text>
				//</View>
			);
		} 

		let versions= [];
		for( let i = 0 ; i < this.props.versions.length ; i++ ) 
		{
			let v = this.props.versions[i].version;
			//if( pinfoComponent !== null && (i===pinfo.versionIndex || (pinfo.versionIndex===null && i===0) ) ) 
			//{
			//	versions.push( pinfoComponent );
			//}
			versions.push(
				<Text 								
					key={String(i*2)}
					style={{ 
						marginTop:4, marginBottom:4, marginLeft:4, marginRight:0, padding:4, 
						textAlign:'center', fontSize: 14,
						backgroundColor: settings.activeButtonBgColor, borderRadius:2,
						color:(!this.props.disabled) ? 'white' : settings.dimColor
					}}
					onPress={ () => 
					{
						if( !this.props.disabled ) 
						{ 
							this.props.onPress(
								this.props.project, v, this.props.storage, this._perfStart, this._perfEnd
							); 
						}
					}}
				>{v}</Text>
			);
			versions.push(
				<Text 								
					key={String(i*2+1)}
					style={{ 
						marginTop:4, marginBottom:4, marginLeft:0, marginRight:8, 
						paddingTop:4, paddingBottom:4, paddingLeft:8, paddingRight:8, 
						textAlign:'center', fontSize: 14,
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
				<ScrollView horizontal={true} 
					style={{ 
						flex:1, flexDirection:'row', marginBottom:2, padding:4, 
						backgroundColor:settings.screenBgColor
						//height: '50px', maxHeight: '50px'
					}}
				>
					{versions}
				</ScrollView>
				{pinfoComponent}
			</View>
		);
	}
}
