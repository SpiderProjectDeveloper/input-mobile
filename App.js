import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Touchable, TouchableOpacity, Pressable } from 'react-native';
import { EditTable } from './EditTable.js';
import { ProjectList } from './ProjectList.js';
import { ProjectDetails } from './ProjectDetails.js';
import { UpperButton } from './UpperButton.js';
import { UpperPrompt } from './UpperPrompt.js';
import { logHelper, makeUrlHelper, formatSpiderDateHelper, groupProjectListHelper } from './helpers.js';
import {styles} from './styles.js';
import {settings} from './settings.js';

export default class  App extends Component  {  
  constructor(props) {
    super(props);
    
    this.state = {
			lang: settings.lang,
      credentials: {
        server: 'localhost', port: '8080', user: 'user', password: 'user'
      },
      projectList: null,
			projectChosen: null,
			status: settings.statusLoginRequired
    };
		this._sessId = null;
    this._rawData = null; 
		this._docHandle = null;
		this._perfStart = formatSpiderDateHelper( new Date(new Date() - 1000*60*60*24*7) );
		this._perfEnd = formatSpiderDateHelper(new Date());
		this._grouppedProjectList = null;

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onOpenProject = this.onOpenProject.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.onSaveProject = this.onSaveProject.bind(this);
		this.onProjectChosen = this.onProjectChosen.bind(this);
    this.onExitWithoutSave = this.onExitWithoutSave.bind(this);
    this.onCancelExitingWithoutSave = this.onCancelExitingWithoutSave.bind(this);
    this.onBackToProjects = this.onBackToProjects.bind(this);
    this.getScheduledPerformance = this.getScheduledPerformance.bind(this);
    this.setData = this.setData.bind(this);
    this.closeProject = this.closeProject.bind(this);
		this.editTableCellChange = this.editTableCellChange.bind(this);
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

	onProjectChosen(prj) {
		this.setState( {projectChosen: prj} );
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
			logHelper('saveProject:', { command: 'setActualPerformance', sessId: this._sessId, docHandle: this._docHandle, array: this._rawData.array });
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
				if( !('errcode' in d) || d.errcode != 0 ) {
					throw new Error('');
				} else {
					this.setState({ status: settings.statusDataLoaded });
				}
			}).
			catch( (e) => {
				this.setState({ status: settings.statusDataSaveFailed });
			});
		});
  }


  onOpenProject( projectName, projectVersion ) {
		if( this.state.status === settings.statusDataBeingLoaded )
			return;
		let fileName = projectName + "." + projectVersion + ".sprj";
		this.setState( { status: settings.statusDataBeingLoaded }, function() {
			fetch( makeUrlHelper(this.state.credentials), {
					method:'POST',
					body: JSON.stringify({ command:'openFile', sessId:this._sessId, fileName: fileName})
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
				this.setState({ status: settings.statusDataLoadFailed });				       
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
					this._grouppedProjectList = groupProjectListHelper(d.array);
					this.setState({ status: settings.statusProjectListLoaded, projectList:d.array });
				}
			}).
			catch( (e) => {
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
						<UpperButton onPress={ () => { 
								settings.lang = (this.state.lang === 'en') ? 'ru' : 'en';
								this.setState({ lang: (this.state.lang === 'en') ? 'ru' : 'en' }) 
							} } 
							text={settings.lang} />
						<UpperPrompt status={this.state.status} project={this.state.projectChosen}/>
						{ 
						(this.state.status !== settings.statusLoggingIn ) ? 
							(<UpperButton onPress={this.onLogin} text={settings.loginButton} />) : null //(<Pressable onPress={this.onLogin} style={styles.upperButtonContainer}><Text title={'Login'} style={styles.upperButton}>{settings.loginButton}</Text></Pressable>) : null 
						}
          </View>
          <View style={styles.mainContainer}>
            <Text style={styles.loginPageSubHeader}>{settings.texts[this.state.lang].server}</Text>
            <TextInput value={this.state.credentials.server} style={styles.input} placeholder={settings.serverText} 
              onChangeText={ (server) => this.setState({ credentials: {...this.state.credentials, server} }) } />
            <Text style={styles.loginPageSubHeader}>{settings.texts[this.state.lang].port}</Text>
            <TextInput value={this.state.credentials.port} style={styles.input} placeholder={settings.portText} 
              onChangeText={(port) => this.setState({ credentials: {...this.state.credentials, port} }) }/>
            <Text style={ [styles.loginPageSubHeader, {paddingTop:24 } ] }>{settings.texts[this.state.lang].user}</Text>

            <TextInput value={this.state.credentials.user} style={styles.input} placeholder={settings.userText} 
              onChangeText={(user) => this.setState({ credentials: {...this.state.credentials, user} }) } />
            <Text style={styles.loginPageSubHeader}>{settings.texts[this.state.lang].password}</Text>
            <TextInput value={this.state.credentials.password} placeholder={settings.passwordText} style={styles.input} 
              onChangeText={(password) => this.setState({ credentials: {...this.state.credentials, password} }) } />
          </View>
        </View>
      );
    } else if( listViewStatuses.includes(this.state.status ) ) {
      // LIST OF PROJECTS
      let upperView = (
        <View style={styles.upperContainer}>
					<UpperPrompt status={this.state.status} project={this.state.projectChosen}/>
					{
					(this.state.status !== settings.statusDataBeingLoaded && this.state.status !== settings.statusDataBeingUnloaded) ?
						<UpperButton onPress={this.onLogout} text={settings.logoutButton} /> : null // (<View style={styles.upperButtonContainer}><Text title={'Logout'} style={styles.upperButton} onPress={this.onLogout}>{settings.logoutButton}</Text></View>) : null
					}
        </View>
      );
			let disabled = (this.state.status === settings.statusDataBeingLoaded);
			let main = (
				<View style={styles.mainContainer}>
					<ProjectList list={this._grouppedProjectList} 
						onPress={this.onProjectChosen} chosen={this.state.projectChosen} disabled={disabled} /> 
				</View>);
			let dateStatuses = [settings.statusProjectListBeingLoaded];
      let dates = ( !dateStatuses.includes(this.state.status) && this.state.projectChosen !== null ) ?
        (<ProjectDetails project={this.state.projectChosen} 
					disabled={disabled}
					versions={this._grouppedProjectList[this.state.projectChosen]}
					credentials={this.state.credentials} sessId={this._sessId} 
					onPress={this.onOpenProject} />) : null;
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
						<UpperButton onPress={this.onExitWithoutSave} text={settings.yesButton} style={{backgroundColor:settings.warningColor}}/>
            <UpperPrompt status={this.state.status} project={this.state.projectChosen}/>
						<UpperButton onPress={this.onCancelExitingWithoutSave} text={settings.noButton}/>
          </View>
        );
      } else {
        let bgColor = 
          ([settings.statusDataChanged, settings.statusDataSaveFailed].includes(this.state.status)) ?
            settings.activeButtonBgColor : settings.inactiveButtonBgColor;
        upperView = (
          <View style={styles.upperContainer}>
						{ 
							(this.state.status !== settings.statusDataBeingSaved && this.state.status !== settings.statusDataBeingUnloaded) ?
            		(<UpperButton onPress={this.onSaveProject} text={settings.saveButton} style={{backgroundColor:bgColor}}/>) : null
						}
            <UpperPrompt status={this.state.status} project={this.state.projectChosen}/>
						{
							(this.state.status !== settings.statusDataBeingSaved && this.state.status !== settings.statusDataBeingUnloaded) ?
								(<UpperButton onPress={this.onBackToProjects} text={settings.backToProjectsButton}/>) : null
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
      <>
				{view}
				<StatusBar hidden={true}/>
			</>      
    );
  }
}
