import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView } from 'react-native';
import { EditTable } from './EditTable.js';
import { EditField } from './EditField.js';
import { logHelper, getStatusTextHelper, makeUrlHelper, formatSpiderDateHelper } from './helpers.js';
import {styles} from './styles.js';
import {settings} from './settings.js';

export default class  App extends Component  {  
  constructor(props) {
    super(props);
    
    this.state = {
      credentials: {
        server: '192.168.1.28', port: '8080', user: 'user', password: 'user'
      },
      projectList: null,
      status: settings.statusLoginRequired
    };

		this._sessId = null;
    this._rawData = null; 
		this._docHandle = null;
		this._perfStart = formatSpiderDateHelper( new Date(new Date() - 1000*60*60*24*7) );
		this._perfEnd = formatSpiderDateHelper(new Date());

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onOpenProject = this.onOpenProject.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.onSaveProject = this.onSaveProject.bind(this);
    this.onExitWithoutSave = this.onExitWithoutSave.bind(this);
    this.onCancelExitingWithoutSave = this.onCancelExitingWithoutSave.bind(this);
    this.onBackToProjects = this.onBackToProjects.bind(this);
    this.getScheduledPerformance = this.getScheduledPerformance.bind(this);
    this.setData = this.setData.bind(this);
    this.closeProject = this.closeProject.bind(this);
		this.editTableCellChange = this.editTableCellChange.bind(this);

		this.perfStartSetter = this.perfStartSetter.bind(this);
		this.perfEndSetter = this.perfEndSetter.bind(this);
  }

	perfStartSetter(v) {
		this._perfStart = v;
	}
	perfEndSetter(v) {
		this._perfEnd = v;
	}

	editTableCellChange( value, row, col ) {		
		let code = this._rawData.fields[col].Code;
		if( value === null ) {
			delete this._rawData.array[row][code];
		} else {
			this._rawData.array[row][code] = value;
		}
		this.setState({ status:settings.statusDataChanged });
	}

  setData(data) {
    if( data === null ) {
      data = {
        fields: [ 
          {Code: "OperCode", Name:"Oper Code"}, {Code: "Start", Name:"Start", Type:'datetime' }, 
          {Code: "Fin", Name:"Fin", Type:'datetime', editable:true}, 
					{Code: "VolDone", Name:"Vol Done", Type:'number', editable:true}, 
          {Code: "DurDone", Name:"Dur Done"}, {Code: "WorkLoadDone", Name:"WorkLoad Done", editable:true}
        ],
        array: [ 
          { OperCode: "1", Start: 1168318900, Fin: 1168318900, VolDone: 50, DurDone:15}, { OperCode: "2", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "3", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "4", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15},
          { OperCode: "1", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "2", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "3", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "4", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "1", Start: 1168318900, Fin: 1168318900, VolDone: 50, DurDone:15}, { OperCode: "2", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "3", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "4", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15},
          { OperCode: "1", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "2", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "3", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "4", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "1", Start: 1168318900, Fin: 1168318900, VolDone: 50, DurDone:15}, { OperCode: "2", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, 
          { OperCode: "3", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}, { OperCode: "4", Start: 1168318800, Fin: 1168318700, VolDone: 50, DurDone:15}
        ]
      };
    }
    logHelper('fields:', data.fields);
    logHelper('array:', data.array);
    
    this._rawData = data;

    this.setState({ status: settings.statusDataLoaded });
  }

  onSaveProject() {
		if( this.state.status === settings.statusDataBeingSaved || this.state.status === settings.statusDataBeingUnloaded) 
			return;
    this.setState( { status: settings.statusDataBeingSaved }, function() {
			logHelper('saveProject:', { command: 'setActualPerformance', sessId: this._sessId, 
				docHandle: this._docHandle, array: this._rawData.array });
			fetch( makeUrlHelper(this.state.credentials), 
				{ 
					method: 'POST', 
					body: JSON.stringify({ 
						command: 'setActualPerformance', sessId: this._sessId, docHandle: this._docHandle, 
						array: this._rawData.array
					})
				}).
			then( response => response.json()).
			then( d => {
				logHelper(d);
				if( !('errcode' in d) || d.errcode != 0 ) {
					throw new Error('');
				} else {
					return fetch(makeUrlHelper(this.state.credentials), { 
						method: 'POST', 
						body: JSON.stringify({ command: 'saveFile', sessId: this._sessId, docHandle: this._docHandle })
					});
				}
			}).
			then( response => response.json()).
			then( d => {
				logHelper(d);
				if( !('errcode' in d) || d.errcode != 0 ) {
					throw new Error('');
				} else {
					this.setState({ status: settings.statusDataLoaded });
				}
			}).
			catch( (e) => {
				logHelper(e);
				this.setState({ status: settings.statusDataSaveFailed });
			});
		});
  }

  onOpenProject( index ) {
		if( this.state.status === settings.statusDataBeingLoaded )
			return;
    this.setState( { status: settings.statusDataBeingLoaded }, function() {
			fetch( makeUrlHelper(this.state.credentials), {
					method:'POST',
					body: JSON.stringify({ command:'openFile', sessId:this._sessId, fileName: this.state.projectList[index]})
			}).
			then( response => response.json()).
			then( d => {
				if( !('errcode' in d) || d.errcode != 0 ) {
					this.setState({ status: settings.statusDataLoadFailed });        
				} else {
					this._docHandle = d.docHandle;
					this.getScheduledPerformance(d);
				}
			}).
			catch( (e) => {
				if( settings.fakeConnection ) {
					this._docHandle = '00000000';
					this.getScheduledPerformance(null);
				} else {
					this.setState({ status: settings.statusDataLoadFailed });
				}        
			});
		});
  }

  getScheduledPerformance( d ) {
    fetch( makeUrlHelper(this.state.credentials), {
        method:'POST',
        body: JSON.stringify({ 
          command:'getScheduledPerformance', sessId:this._sessId, docHandle: this._docHandle, 
          from: this._perfStart, to: this._perfEnd })
    }).
    then( response => response.json()).
    then( d => {
      this.setData(d);
    }).
    catch( (e) => {
			if( settings.fakeConnection )
				this.setData(null);
			else 
      	this.setState({ status:settings.statusDataLoadFailed });
    });
  }
  
  loadProjects(d) {
		if( this.state.status === settings.statusProjectListBeingLoaded )
			return;
    this.setState({ status: settings.statusProjectListBeingLoaded }, function() {
			this._sessId = d.sessId; 
			fetch( makeUrlHelper(this.state.credentials), 
				{
					method: 'POST',
					body: JSON.stringify({command:'getFiles', sessId:this._sessId, user:this.state.user})
				}
			).
			then( response => response.json()).
			then( d => {
				if( !('errcode' in d) || d.errcode != 0 ) {
					this.setState({ status: settings.statusProjectListRequestFailed });
				} else {
					this.setState({ status: settings.statusProjectListLoaded, projectList:d.array });
				}
			}).
			catch( (e) => {
				if( settings.fakeConnection )
					this.setState({ status: settings.statusProjectListLoaded, projectList: ['project #1', 'project #2'] });
				else
					this.setState({status: settings.statusProjectListRequestFailed});
			});
		});
  }
    
  onLogin() {
    // To login here...
    this.setState( { loggedIn:true, status: settings.statusLoggingIn } );
    fetch( makeUrlHelper(this.state.credentials), {
        method: 'POST',
        body: JSON.stringify({command:'login', 
          user:this.state.credentials.user, password:this.state.credentials.password})
    }).
    then( response => response.json()).
    then( d => {
      if( !('errcode' in d) ) {
        this.setState({ status: settings.statusLoginRequestFailed });
      } 
      if( d.errcode != 0 ) {
        this.setState({ status: settings.statusLoginFailed });
      } else {
        this.loadProjects(d);
      }  
    }).
    catch( (e) => {
			if( settings.fakeConnection ) 
				this.loadProjects({sessId:0});
			else 
      	this.setState({ status: settings.statusLoginRequestFailed });
    });
  }

  onLogout() {
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

  closeProject() {
		if( this.state.status === settings.statusDataBeingUnloaded )
			return;
		// this._rawData = null; // Make it slower when uncommented
		logHelper('setting status data being unloaded');
    this.setState( { status: settings.statusDataBeingUnloaded }, function() {
			logHelper({command:'closeFile', sessId:this._sessId, docHandle:this._docHandle });
			fetch( makeUrlHelper(this.state.credentials), 
				{
					method: 'POST',
					body: JSON.stringify({command:'closeFile', sessId:this._sessId, docHandle:this._docHandle })
				}
			).
			then( response => response.json()).
			then( d => {
				logHelper('closeProject:', d)
				this.setState( { status: settings.statusProjectListLoaded } );
			}).
			catch( (e) => {
				this.setState( { status: settings.statusProjectListLoaded } );
			});
		});
  }

  onBackToProjects() {
    if( this.state.status === settings.statusDataChanged || this.state.status === settings.statusDataSaveFailed ) {
      this.setState( { status: settings.statusExitingWithoutSave } );
      return;
    }
    // To logout...
    this.closeProject();
  }

  onExitWithoutSave() {
    this.closeProject(); 
  }

  onCancelExitingWithoutSave() {
    this.setState({ status: settings.statusDataChanged });
  }

  render() {
    let status = getStatusTextHelper( this.state.status );
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
            <View style={styles.upperPromptContainer}>          
              <Text style={styles.upperPrompt}>{status}</Text>
            </View>
						{ 
						(this.state.status !== settings.statusLoggingIn ) ?
							(<View style={styles.upperButtonContainer}>          
								<Text title={'Logout'} style={styles.upperButton} onPress={this.onLogin}>{settings.loginButton}</Text>
							</View>) : null 
						}
          </View>
          <View style={styles.mainContainer}>
            <Text style={styles.loginPageSubHeader}>{settings.texts[settings.lang].server}</Text>
            <TextInput value={this.state.credentials.server} style={styles.input} placeholder={settings.serverText} 
              onChangeText={ (server) => this.setState({ credentials: {...this.state.credentials, server} }) } />
            <Text style={styles.loginPageSubHeader}>{settings.texts[settings.lang].port}</Text>
            <TextInput value={this.state.credentials.port} style={styles.input} placeholder={settings.portText} 
              onChangeText={(port) => this.setState({ credentials: {...this.state.credentials, port} }) }/>
            <Text style={ [styles.loginPageSubHeader, {paddingTop:24 } ] }>{settings.texts[settings.lang].user}</Text>

            <TextInput value={this.state.credentials.user} style={styles.input} placeholder={settings.userText} 
              onChangeText={(user) => this.setState({ credentials: {...this.state.credentials, user} }) } />
            <Text style={styles.loginPageSubHeader}>{settings.texts[settings.lang].password}</Text>
            <TextInput value={this.state.credentials.password} placeholder={settings.passwordText} style={styles.input} 
              onChangeText={(password) => this.setState({ credentials: {...this.state.credentials, password} }) } />
          </View>
        </View>
      );
    } else if( listViewStatuses.includes(this.state.status ) ) {
      // LIST OF PROJECTS
      let upperView = (
        <View style={styles.upperContainer}>
          <View style={styles.upperPromptContainer}>          
            <Text style={styles.upperPrompt}>{status}</Text>
          </View>
					{
					(this.state.status !== settings.statusDataBeingLoaded && this.state.status !== settings.statusDataBeingUnloaded) ?
          	(<View style={styles.upperButtonContainer}>          
            	<Text title={'Logout'} style={styles.upperButton} onPress={this.onLogout}>{settings.logoutButton}</Text>
          	</View>) : null
					}
        </View>
      );
			let main;
      if( [settings.statusProjectListLoaded, settings.statusDataLoadFailed ].includes(this.state.status) ) { 
        let projects = [];
        for( let i = 0 ; i < this.state.projectList.length ; i++ ) {
          projects.push(
            <View key={'__myProjectListItemView'+String(i)}  style={styles.mainContainerScrollItem}>
              <View style={styles.projectListItemContainer}>
								{settings.fileIcon}
								<Text key={'__myProjectListItemText'+String(i)} 
								style={styles.projectListItem}
                onPress={() => this.onOpenProject(i)}>{this.state.projectList[i]}</Text>
							</View>	
            </View>);
        }
				main = (
					<View style={styles.mainContainer}>
						<ScrollView style={styles.mainContainerScroll}>{projects}</ScrollView>
          </View>
				)
      } else {
        main = (<View style={ styles.mainContainer}>{settings.loadingIcon}</View>)
      }
			let dateStatuses = [settings.statusDataBeingLoaded, settings.statusProjectListBeingLoaded, settings.statusDataBeingUnloaded]
      let dates = ( !(dateStatuses.includes(this.state.status)) ) ?
        (<View style={styles.performanceDatesContainer}>
          <EditField style={styles.performanceDateInput} viewStyle={styles.performanceDate} type={'datetime'}
						value={this._perfStart} setter={this.perfStartSetter} placeholder={'Start Date'} />							
					<EditField style={styles.performanceDateInput} viewStyle={styles.performanceDate} type={'datetime'}
						value={this._perfEnd} setter={this.perfEndSetter} placeholder={'End Date'} />
        </View>) : null;
      view = (
        <View style={styles.screenContainer}>
          {upperView}
          {dates}
          {main}
        </View>
      );  
    } else {
      // DATA TABLE
      let editTableView;
      if(this._rawData !== null /*&& this.state.status !== settings.statusDataBeingUnloaded*/ ) {
        editTableView = (
					<View style= {[ styles.mainContainer, { alignItems: 'flex-start', justifyContent: 'flex-start'} ]}>
						<EditTable data={this._rawData} editTableCellChange={this.editTableCellChange}/>
					</View>
				)
      } else {
        editTableView = <View style={styles.mainContainer}>{settings.loadingIcon}</View>
      }
      let upperView;
      if( this.state.status === settings.statusExitingWithoutSave ) {
        upperView = (
          <View style={styles.upperContainer}>
            <View style={ [ styles.upperButtonContainer, {backgroundColor: settings.warningColor} ] }>
              <Text title={settings.yesButton} style={ styles.upperButton } 
                onPress={this.onExitWithoutSave}>{settings.yesButton}</Text>
            </View>
            <View style={styles.upperPromptContainer}>          
	            <Text style={styles.upperPrompt}>{status}</Text>
            </View>
            <View style={styles.upperButtonContainer}>          
	            <Text title={settings.noButton} style={styles.upperButton} 
  	            onPress={this.onCancelExitingWithoutSave}>{settings.noButton}</Text>
            </View>
          </View>
        );
      } else {
        let saveButtonBgColor = 
          ([settings.statusDataChanged, settings.statusDataSaveFailed].includes(this.state.status)) ?
            settings.activeButtonBgColor : settings.inactiveButtonBgColor;
        upperView = (
          <View style={styles.upperContainer}>
						{ 
							(this.state.status !== settings.statusDataBeingSaved && this.state.status !== settings.statusDataBeingUnloaded) ?
            		(<View style={[ styles.upperButtonContainer, {backgroundColor:saveButtonBgColor} ]}>
              		<Text title={settings.saveButton} style={styles.upperButton} onPress={this.onSaveProject}>
                		{settings.saveButton}</Text>
            		</View>) : null
						}
            <View style={styles.upperPromptContainer}>          
              <Text style={styles.upperPrompt}>{status}</Text>
            </View>
						{
							(this.state.status !== settings.statusDataBeingSaved && this.state.status !== settings.statusDataBeingUnloaded) ?
								(<View style={styles.upperButtonContainer}>          
									<Text title={settings.projectsButton} style={styles.upperButton} 
										onPress={this.onBackToProjects}>{settings.backToProjectsButton}</Text>
								</View>) : null
						}
         </View>
        );
      }
      view = (
        <View style={styles.screenContainer}>
          {upperView}
          {editTableView}
        </View>
      );  
    }
    return(
      <>{ view }<StatusBar hidden={true}/></>      
    );
  }
}
