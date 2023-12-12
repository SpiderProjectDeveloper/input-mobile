import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { EditTableCell } from "./EditTableCell.js";
import { EditTableHeadCell } from "./EditTableHeadCell.js";
import { EditTableBody } from './EditTableBody.js';
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class EditTable extends Component 
{
	constructor(props) 
	{
		super(props);

		let showAssignments = this.props.data.performanceInputSettings.f_PerformanceShowAssignments;
		showAssignments = (showAssignments === 'no') ? false : true;

		this.state = {
			showAssignments: showAssignments
		};

		let widths=[];
		let types=[];
		let editables=[];
		let editablesA=[];
		for( let i = 0 ; i < this.props.data.fields.length ; i++ ) 
		{
			let f = this.props.data.fields[i];
			if( 'hidden' in f && f.hidden === 1 ) continue;

			let w = settings.defaultCellWidth;
			if( typeof(f.Type) === 'string' ) {
				if( f.Type === 'datetime' ) {
					w = settings.tableCellFontSize*14;
				} else if( f.Type === 'number' ) {
					w = settings.tableCellFontSize*8;
				} else if( f .Type === 'text' ) {
					w = settings.tableCellFontSize*8;
				} else if( f.Type === 'lineNumber' ) {
					w = settings.tableCellFontSize*3;
				}
			}
			widths.push(w);
			
			let editable = (typeof(f.editable) === 'undefined') ? false : ((f.editable === 1 || f.editable === true) ? true : false);
			editables.push(editable);

			let editableA = (typeof(f.editableAssign) === 'undefined') ? editable : ((f.editableAssign === 1 || f.editableAssign === true) ? true : false);
			editablesA.push(editableA);

			let type = (typeof(f.Type) === 'undefined') ? 'text' : f.Type;
			types.push(type);			
		}
		this._widths = widths;
		this._editables = editables;
		this._editablesA = editablesA;
		this._types = types;

		this._tableBodyRef = React.createRef();
		this.updateTableBodyCells = this.updateTableBodyCells.bind(this); 
		
		this.updateShowAssignments = this.updateShowAssignments.bind(this);
	}

	updateShowAssignments( value ) 
	{
		//console.log('updateShowAssignments' + value);
		this.setState( { showAssignments: value } );
	}

	updateTableBodyCells( cells ) 
	{
		for( let i = 0 ; i < cells.length ; i++ ) 
		{
			let c = cells[i];
			this._tableBodyRef.current.updateCell( c.row, c.col, c.value );
		}
	}
	
	//shouldComponentUpdate(nextProps, nextState) {
	//	return false;
	//}

	render() 
	{
		if( typeof(this.props.data) === 'undefined' || this.props.data === null || 
				typeof(this.props.data.array) === 'undefined' || this.props.data.array === null || this.props.data.array.length === 0 ||
				typeof(this.props.data.fields) === 'undefined' || this.props.data.fields === null || this.props.data.fields.length === 0 )
		{
			return(
				<Text style={{ padding:48, textAlign:'center', alignSelf:'center', alignItems: 'center', justifyContent: 'center'}}>
					{settings.messages[this.props.lang].emptyTable}
				</Text>);
		}

		let headCells = [];
		for( let i = 0 ; i < this.props.data.fields.length ; i++ ) 
		{
			let f = this.props.data.fields[i];
			if( 'hidden' in f && f.hidden === 1 ) continue;

			let w = this._widths[i]
			if( f.Type == 'lineNumber' ) {
				headCells.push(
					<EditTableHeadCell key={i} col={i} width={ w } value = {f.Name} 
						onShowAssignments = {this.updateShowAssignments} 
						showAssignments = {this.state.showAssignments}
					/>
				);
				continue;
			}
			headCells.push(
				<EditTableHeadCell key={i} col={i} width={ w } value = {f.Name} />
			);
		}

		return(
				<ScrollView horizontal={true}>
					<View style={{flexDirection:'column'}}>
						<View style={{ flexDirection:'row' }}>{headCells}</View>
						<EditTableBody ref={this._tableBodyRef}
							data={this.props.data} 
							types={this._types} 
							widths={this._widths} 
							editables={this._editables}
							editablesA={this._editablesA}
							editTableCellChange={this.props.editTableCellChange}
							showAssignments={this.state.showAssignments} />
					</View>
				</ScrollView>
		);
	}
}