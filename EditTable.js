import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { EditTableCell } from "./EditTableCell.js";
import { EditTableBody } from './EditTableBody.js';
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class EditTable extends Component {

	constructor(props) {
		super(props);

		let widths=[];
		let types=[];
		let editables=[];
		for( let i = 0 ; i < this.props.data.fields.length ; i++ ) {
			let f = this.props.data.fields[i];
			let w = settings.defaultCellWidth;
			if( typeof(f.Type) === 'string' ) {
				if( f.Type === 'datetime' ) {
					w = settings.tableCellFontSize*14;
				} else if( f.Type === 'number' ) {
					w = settings.tableCellFontSize*8;
				} else if( f .Type === 'text' ) {
					w = settings.tableCellFontSize*8;
				} 
			}
			widths.push(w);
			
			let editable = (typeof(f.editable) === 'undefined') ? false : ((f.editable === 1 || f.editable === true) ? true : false);
			editables.push(editable);

			let type = (typeof(f.Type) === 'undefined') ? 'text' : f.Type;
			types.push(type);			
		}
		this._widths = widths;
		this._editables = editables;
		this._types = types;
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		if( typeof(this.props.data) === 'undefined' || this.props.data === null || 
				typeof(this.props.data.array) === 'undefined' || this.props.data.array === null || this.props.data.array.length === 0 ||
				typeof(this.props.data.fields) === 'undefined' || this.props.data.fields === null || this.props.data.fields.length === 0 )
		{
			return (<View><Text>No data...</Text></View>);
		}

		let headCells = [];
		for( let i = 0 ; i < this.props.data.fields.length ; i++ ) {
			let f = this.props.data.fields[i];
			let w = this._widths[i]
			headCells.push(
				<EditTableCell key={i} col={i} width={ w } value = {f.Name} editable = {false} />
			);
		}

		return(
				<ScrollView horizontal={true}>
					<View style={{flexDirection:'column'}}>
						<View style={{ flexDirection:'row' }}>{headCells}</View>
						<EditTableBody data={this.props.data} types={this._types} widths={this._widths} editables={this._editables}
							editTableCellChange={this.props.editTableCellChange}/>
					</View>
				</ScrollView>
		);
	}
}