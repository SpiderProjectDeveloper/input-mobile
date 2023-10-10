import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Touchable, TouchableOpacity, Pressable } from 'react-native';
import { EditTable } from './EditTable.js';
import { ProjectList } from './ProjectList.js';
import { ProjectDetails } from './ProjectDetails.js';
import { UpperButton } from './UpperButton.js';
import { UpperPrompt } from './UpperPrompt.js';
import { readStorage, writeStorage } from './storage.js';
import { logHelper, makeUrlHelper, formatSpiderDateHelper, groupProjectListHelper, 
	makeFieldsCacheHelper, makeArrayCacheKeyHelper, makeArrayCacheHelper } from './helpers.js';
import {styles, screenHeight, upperHeight, projectDetailsHeight } from './styles.js';
import { settings } from './settings.js';

export default class App extends Component 
{  
  constructor(props) 
	{
    super(props);

    this.state = {
			lang: settings.lang,
      credentials: {
        server: 'localhost', port: '8080', user: 'user', password: 'user'
      },
			parameters: null,
      projectList: null,
			projectChosen: null,
			storageChosen: null,
			status: settings.statusLoginRequired
    };

		this._rawData = null; 
		this._dataFieldsColCache= null;
		this._dataArrayRowCache = null;    

		this._sessId = null;
		this._docHandle = null;
		this._grouppedProjectList = null;

		this.onLogin = this.onLogin.bind(this);
		this.onLogout = this.onLogout.bind(this);
		this.onOpenProject = this.onOpenProject.bind(this);
		this.loadProjects = this.loadProjects.bind(this);
		this.onProjectChosen = this.onProjectChosen.bind(this);
		this.getScheduledPerformance = this.getScheduledPerformance.bind(this);
		this.closeProject = this.closeProject.bind(this);
		this.editTableCellChange = this.editTableCellChange.bind(this);
		this.fetchEditTableCellChange = this.fetchEditTableCellChange.bind(this);

		readStorage('lang').then( lang => { this.setState({lang:lang}) } ).catch( e=>{ }	);
		readStorage('server').
			then( server => { this.setState({ credentials:{...this.state.credentials, server} }) } ).catch( e=>{ } );
		readStorage('port').
			then( port => { this.setState({ credentials:{...this.state.credentials, port} }) } ).catch( e=>{ } );
		readStorage('user').
			then( user => { this.setState({ credentials:{...this.state.credentials, user} }) } ).catch( e=>{ } );
		readStorage('password').
			then( password => { this.setState({ credentials:{...this.state.credentials, password} }) } ).catch( e=>{ } );

		this._editTableRef = React.createRef();

		this._perfStart='';
		this._perfEnd='';
  }

	editTableCellChange( cellValue, cellRow, cellCol ) 
	{
		this.setState( { status: settings.statusDataBeingSaved }, 
			() => { this.fetchEditTableCellChange( cellValue, cellRow, cellCol ) } );
	}

	fetchEditTableCellChange( cellValue, cellRow, cellCol ) 
	{
		let cellCode = this._rawData.fields[cellCol].Code;
		let toSend = { 
			Code: this._rawData.array[cellRow].Code, Level: this._rawData.array[cellRow].Level 
		};
		toSend[ cellCode ] = cellValue;		
		let req = { 
			command:'setActualPerformance', sessId:this._sessId, docHandle: this._docHandle, 
			from: this._perfStart, to: this._perfEnd, array: [ toSend ] 
		};
		logHelper(req);

		fetch( 
			makeUrlHelper(this.state.credentials), 
			{ method:'POST', body: JSON.stringify(req) }
		).then( 
			response => response.json()
		).then( 
			function(d)
			{
				logHelper("new values");
				logHelper(d);
				if( ('errcode' in d) && (d.errcode === 0) ) 
				{
					let cells = [];
					let newDataArray = ('array' in d && d.array !== null) ? d.array : []; 	// Changes in data array to be made after editing a cell
					for( let i = 0 ; i < newDataArray.length ; i++ ) {
						let dataArrayRowCacheKey = makeArrayCacheKeyHelper(newDataArray[i].Level, newDataArray[i].Code);
						if( dataArrayRowCacheKey in this._dataArrayRowCache) {
							let row = this._dataArrayRowCache[dataArrayRowCacheKey];
							for( let fieldKey in newDataArray[i] ) { 	// Iterating through the fields to be changed
								if( fieldKey === 'Code' || fieldKey === 'Level' ) {		// Skipping if the one is a "Code" or a "Level"
									continue;
								}
								if( fieldKey in this._dataFieldsColCache ) {		// 	
									let col = this._dataFieldsColCache[fieldKey];
									let newValue = newDataArray[i][fieldKey];
									if( this._rawData.array[row][fieldKey] !== newValue ) {
										cells.push({ row:row, col:col, value: newValue });
										//delete this._rawData.array[row][code];
										this._rawData.array[row][fieldKey] = newValue;					
									}
								}
							}
						}
					}
					logHelper("cells", cells);
					this._editTableRef.current.updateTableBodyCells(cells);
					this.setState({ status: settings.statusDataLoaded });
				} else {		// If error setting back the old value to the cell changed
					this._editTableRef.current.updateTableBodyCells( [
						{ row:cellRow, col:cellCol, value: this._rawData.array[cellRow][cellCode] }
					]);
					this.setState({ status:settings.statusDataSaveFailed });
				} 
			}.bind(this) 
		).catch( 
			function(e) 
			{		// If error setting back the old value to the cell changed
				this._editTableRef.current.updateTableBodyCells([
					{ row:cellRow, col:cellCol, value: this._rawData.array[cellRow][cellCode] }
				]);
				this.setState({ status:settings.statusDataSaveFailed });
			}.bind(this)
		);
	}

	onProjectChosen(project, storage) 
	{
		this.setState( { projectChosen: project, storageChosen: storage } );
	}

  onOpenProject( projectName, projectVersion, storage, perfStart, perfEnd ) 
	{
		if( this.state.status === settings.statusDataBeingLoaded ) return;

		let fileName = projectName + "." + projectVersion + ".sprj";
		let body = { command:'openFile', sessId:this._sessId, fileName: fileName };
		if( storage !== null && storage !== 'null' ) body.storageCode = storage;

		this.setState( 
			{ status: settings.statusDataBeingLoaded }, 
			function() {
				fetch( 
					makeUrlHelper( this.state.credentials ), 
					{ method:'POST', body: JSON.stringify( body ) }
				).then( response => response.json()).
				then( d => {
					if( !('errcode' in d) || d.errcode != 0 || !('docHandle' in d) ) {
						this.setState({ status: settings.statusDataLoadFailed });        
					} else {
						this._docHandle = d.docHandle;
						this.getScheduledPerformance(d, perfStart, perfEnd);
					}
				}).
				catch( (e) => {
					this.setState({ status: settings.statusDataLoadFailed });				       
				});
			}
		);
  }

  getScheduledPerformance( d, perfStart, perfEnd )
	{
		let req = { 
			command:'getScheduledPerformance', sessId:this._sessId, 
			docHandle: this._docHandle, from: perfStart, to: perfEnd 
		};
    fetch( 
			makeUrlHelper(this.state.credentials), 
			{ method:'POST', body: JSON.stringify(req) }
		).then( 
			response => response.json()
		).then( 
			function(d) 
			{
				logHelper('getScheduledPerformance', d, "errocode", d.errcode);
				if( !('errcode' in d) || d.errcode != 0 ) {
					this.setState({ status:settings.statusDataLoadFailed });
				} else {
					this._perfStart = perfStart;
					this._perfEnd = perfEnd;
					logHelper('fields:', d.fields);
					logHelper('array:', d.array);		
					// Adding an extra column with line numbers
					d.fields.splice( 0, 0, { "Code" : "__lineNumber__", "Name" : "N", "Type" : "lineNumber",
							"editable" : 0, "hidden" : 0, "format" : 0, "widthsym" : 1
					});
					this._dataFieldsColCache = makeFieldsCacheHelper(d);
					this._dataArrayRowCache = makeArrayCacheHelper(d);    
					this._rawData = d;
					this.setState({ status: settings.statusDataLoaded });
				}
	    }.bind(this) 
		).catch( (e) => {
      this.setState({ status:settings.statusDataLoadFailed });
    });
  }
  
  loadProjects(d) 
	{
		if( this.state.status === settings.statusProjectListBeingLoaded ) return;

    this.setState(
			{ status: settings.statusProjectListBeingLoaded }, 
			function() 
			{
				this._sessId = d.sessId; 
				fetch( 
					makeUrlHelper(this.state.credentials), 
					{
						method: 'POST',
						body: JSON.stringify({command:'getFiles', sessId:this._sessId, user:this.state.user})
					}
				).then( 
					response => response.json()
				).then( d => {
					if( !('errcode' in d) || d.errcode != 0 ) {
						this.setState({ status: settings.statusProjectListRequestFailed });
					} else {
						this._grouppedProjectList = groupProjectListHelper(d.array);
						this.setState({ status: settings.statusProjectListLoaded, projectList:d.array });
					}
				}).catch( (e) => {
					this.setState({status: settings.statusProjectListRequestFailed});
				});
			}
		);
  }
    
  onLogin() 
	{
    // To login here...
    this.setState( { loggedIn:true, status: settings.statusLoggingIn } );
    fetch( makeUrlHelper(this.state.credentials), {
        method: 'POST',
				mode: "cors", 	// !! Debug only, to be removed...
        body: JSON.stringify({command:'login', 
          user:this.state.credentials.user, password:this.state.credentials.password})
    }).
    then( response => response.json() ).
    then( d => {
      if( !('errcode' in d) ) {
        this.setState({ status: settings.statusLoginRequestFailed });
      } 
      if( d.errcode != 0 ) {
        this.setState({ status: settings.statusLoginFailed });
      } else {
				this.setState( { parameters: d.parameters } )
        this.loadProjects(d);
      }  
    }).
    catch( (e) => {
      this.setState({ status: settings.statusLoginRequestFailed });
    });
  }

  onLogout() 
	{
    this.setState( { status: settings.statusLoggingOut } );
    fetch( makeUrlHelper(this.state.credentials), 
      {
        method: 'POST',
        body: JSON.stringify({ command:'logout', sessId:this._sessId })
      }
    ).
    then( response => response.json()).
    then( d => {
      ;
    }).
    catch( (e) => {
      ;
    });
    this.setState( { status: settings.statusLoginRequired } );
  }

  closeProject() 
	{
		if( this.state.status === settings.statusDataBeingUnloaded )
			return;
    this.setState( { status: settings.statusDataBeingUnloaded }, function() {
			fetch( makeUrlHelper(this.state.credentials), 
				{
					method: 'POST',
					body: JSON.stringify({command:'closeFile', sessId:this._sessId, docHandle:this._docHandle })
				}
			).
			then( response => response.json()).
			then( d => {
				this.setState( { status: settings.statusProjectListLoaded } );
			}).
			catch( (e) => {
				this.setState( { status: settings.statusProjectListLoaded } );
			});
		});
  }


  render() 
	{
    let loginViewStatuses = [ settings.statusLoginRequired, settings.statusLoginFailed, 
      settings.statusLoginRequestFailed, settings.statusLoggingIn ];
    let listViewStatuses = [ settings.statusProjectListBeingLoaded, settings.statusProjectListRequestFailed, 
      settings.statusProjectListLoaded, settings.statusDataBeingLoaded, settings.statusDataLoadFailed ];
		
		let view;
    if( loginViewStatuses.includes( this.state.status ) ) {
      // LOGIN VIEW
      view = (
        <View style={styles.screenContainer}>
          <View style={styles.upperContainer}>
						{
						(this.state.status !== settings.statusLoggingIn) ? 
							(<UpperButton 
								onPress={ () => { 
									let lang = (this.state.lang === 'en') ? 'ru' : 'en';
									this.setState({ lang: lang }); 
									writeStorage('lang', lang);
								} } 
								text={this.state.lang} />) : null
						}	
						<UpperPrompt lang={this.state.lang} status={this.state.status} project={this.state.projectChosen}/>
						{ 
						(this.state.status !== settings.statusLoggingIn ) ? 
							(<UpperButton onPress={this.onLogin} text={settings.loginButton} />) : null //(<Pressable onPress={this.onLogin} style={styles.upperButtonContainer}><Text title={'Login'} style={styles.upperButton}>{settings.loginButton}</Text></Pressable>) : null 
						}
          </View>
          <View style={styles.mainContainer}>
            <Text style={styles.loginPageSubHeader}>{settings.texts[this.state.lang].server}</Text>
            <TextInput value={this.state.credentials.server} style={styles.input} placeholder={settings.serverText} 
              onChangeText={ (server) => { 
								this.setState({ credentials: {...this.state.credentials, server} });
								writeStorage( 'server', server ); 
							} 
							}/>
            <Text style={styles.loginPageSubHeader}>{settings.texts[this.state.lang].port}</Text>
            <TextInput value={this.state.credentials.port} style={styles.input} placeholder={settings.portText} 
              onChangeText={ (port) => {
								this.setState({ credentials: {...this.state.credentials, port} }) 
								writeStorage( 'port', port ); 
							}
							}/>
            <Text style={ [styles.loginPageSubHeader, {paddingTop:24 } ] }>{settings.texts[this.state.lang].user}</Text>
            <TextInput value={this.state.credentials.user} style={styles.input} placeholder={settings.userText} 
              onChangeText={ (user) => {
								this.setState({ credentials: {...this.state.credentials, user} });
								writeStorage( 'user', user ); 
							} 
							}/>
            <Text style={styles.loginPageSubHeader}>{settings.texts[this.state.lang].password}</Text>
            <TextInput value={this.state.credentials.password} placeholder={settings.passwordText} style={styles.input} 
              onChangeText={ (password) => { 
								this.setState({ credentials: {...this.state.credentials, password} })
								writeStorage( 'password', password ); 
							} 
							}/>
          </View>
        </View>
      );
    } else if( listViewStatuses.includes(this.state.status ) ) 
		{
      // LIST OF PROJECTS
      let upperView = (
        <View style={styles.upperContainer}>
					<UpperPrompt lang={this.state.lang} status={this.state.status} project={this.state.projectChosen}/>
					{
					(this.state.status !== settings.statusDataBeingLoaded && this.state.status !== settings.statusDataBeingUnloaded) ?
						<UpperButton onPress={this.onLogout} text={settings.logoutButton} /> : null // (<View style={styles.upperButtonContainer}><Text title={'Logout'} style={styles.upperButton} onPress={this.onLogout}>{settings.logoutButton}</Text></View>) : null
					}
        </View>
      );
			let disabled = (this.state.status === settings.statusDataBeingLoaded);
			let main = (
				//<View style={styles.mainContainer}>
					<ProjectList list={this._grouppedProjectList} 
						height={ (screenHeight - upperHeight - projectDetailsHeight) }
						onPress={this.onProjectChosen} 
						chosen={this.state.projectChosen} 
						storageChosen={this.state.storageChosen}
						disabled={disabled} /> 
				//</View>
			);
			let dateStatuses = [settings.statusProjectListBeingLoaded];
      let projectDetails = ( !dateStatuses.includes(this.state.status) && this.state.projectChosen !== null ) ?
        (<ProjectDetails 
					lang={this.state.lang} 
					disabled={disabled} 
					parameters={this.state.parameters}
					project={this.state.projectChosen} 
					storage={this.state.storageChosen}
					versions={this._grouppedProjectList[this.state.storageChosen][this.state.projectChosen]}
					credentials={this.state.credentials} 
					sessId={this._sessId} 
					onPress={this.onOpenProject} />) : null;
      view = (
        <View style={styles.screenContainer}>
          {upperView}
          {projectDetails}
          {main}
        </View>
      );  
    } else {
      // DATA TABLE
      let editTableView;
      if(this._rawData !== null /*&& this.state.status !== settings.statusDataBeingUnloaded*/ ) {
        editTableView = (
					<View style= {[ styles.mainContainer, { alignItems: 'flex-start', justifyContent: 'flex-start'} ]}>
						<EditTable ref={this._editTableRef} lang={this.state.lang} 
							data={this._rawData} editTableCellChange={this.editTableCellChange}/>
					</View>
				)
      } else {
        editTableView = <View style={styles.mainContainer}>{settings.loadingIcon}</View>
      }
      let upperView = (
				<View style={styles.upperContainer}>
					<UpperPrompt lang={this.state.lang} status={this.state.status} project={this.state.projectChosen}/>
					{
						(this.state.status !== settings.statusDataBeingSaved && this.state.status !== settings.statusDataBeingUnloaded) ?
							(<UpperButton onPress={this.closeProject} text={settings.backToProjectsButton}/>) : null
					}
				</View>
			);
      
      view = (
        <View style={styles.screenContainer}>
          {upperView}
          {editTableView}
        </View>
      );  
    }
    return(
      <>
				{view}
				<StatusBar hidden={true}/>
			</>      
    );
  }
}
