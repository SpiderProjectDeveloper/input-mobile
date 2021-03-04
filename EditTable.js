import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { EditTableCell } from "./EditTableCell.js";
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class EditTable extends Component {

	constructor(props) {
		super(props);

		if( this.props.data === null ) {
			this._head = null
			this._body = null
		}

		let headCells=[];
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

			headCells.push(
				<EditTableCell key={i} col={i} width={ w } value = {f.Name} editable = {false} />
			);
		}
		this._head = (
			<View style={{ flexDirection:'row' }}>
				{headCells}
			</View>
		);

		let rows=[];
		for( let irow = 0 ; irow < this.props.data.array.length ; irow++ ) {
			let rowData = this.props.data.array[irow];
			let rowCells=[];
			for( let icol = 0 ; icol < this.props.data.fields.length ; icol++ ) {
				let f = this.props.data.fields[icol];
				let value = (typeof(rowData[f.Code]) !== 'undefined' && rowData[f.Code] !== null) ? rowData[f.Code] : null;
				rowCells.push( 
					<EditTableCell key={icol} editTableCellChange={this.props.editTableCellChange}
						row={irow} col={icol} value={value} 
						width={ widths[icol] } editable={ editables[icol] } type={ types[icol] }
					/>
				);
			}
			rows.push(<View key={irow} style={{flexDirection:'row'}}>{rowCells}</View>);
		}	
		this._body = (
			<ScrollView style={{flexDirection:'column'}}>
				{rows}
			</ScrollView>
		);
	}

	render() {
		logHelper('render edit table')
		return(
				<ScrollView horizontal={true}>
					<View style={{flexDirection:'column'}}>
						{this._head}
						{this._body}
					</View>
				</ScrollView>
		);
	}
}