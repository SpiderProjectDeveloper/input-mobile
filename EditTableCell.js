import React, { Component } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { EditTableCellModal } from "./EditTableCellModal.js";
import { 
	isValidNumberHelper, isValidDateTimeSymbolsHelper, isValidSpiderDateHelper, 
	formatSpiderDateHelper, formatDisplayNumberHelper, 
	parseSpiderDateHelper, isEmptyStringHelper, isDifferentNumbersHelper 
} from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class EditTableCell extends Component 
{
  constructor(props) 
	{
    super(props);
		this.castValue = this.formatValue.bind(this);
		this.onChange = this.onChange.bind(this);

		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.renderModal = this.renderModal.bind(this);

		this._ref = React.createRef();

		let type = (typeof(this.props.type) !== 'undefined') ? this.props.type : 'text';

		this._originalValue = this.props.value;
		this.state = {
			row: this.props.row,
			col: this.props.col,
			value: this.props.value,
			type: type,
			editable: (typeof(this.props.editable) !== 'undefined' && this.props.editable !== null) ? this.props.editable : false,
			updated: false,
			displayRounded: true,
			renderModal: false,
		};
  }

	formatValue( value, type ) 
	{
		if( typeof(value) !== 'undefined' && value !== null ) {
			if( type === 'number' ) {
				if( !this.state.updated && this.state.displayRounded ) {
					let count = null;
					[value, count] = formatDisplayNumberHelper( value, this.props.toFixed );
					if( count !== null && count > this.props.toFixed ) value += String.fromCharCode(0x2026);
				} else {
					value = value.toString();
				}
			} else if( type === 'datetime' ) {
				value = formatSpiderDateHelper(value, false);
			} 
		} else { 
			value = '';
		}
		return value;
	}

	onChange(v) 
	{
		let newState = { value: v, updated: false };
		let updated = false;
		let newSpiderValue;
		if( this.state.type === 'number' ) 
		{
			newSpiderValue = parseFloat(v);
			if( isNaN(newSpiderValue) ) newSpiderValue = null; 
			updated = isDifferentNumbersHelper( newSpiderValue, this.props.value );
		} else {
			newSpiderValue = v;
			if( newSpiderValue !== this.props.value ) {
				updated = true;
			}
		}
		
		if( updated ) {
			if( 'editTableCellChange' in this.props ) {
				this.props.editTableCellChange( newSpiderValue, this.state.row, this.state.col );
			}
			newState.updated = true;
		} 
		this.setState( newState );
	}

	render() 
	{		
		let value = this.formatValue( this.state.value, this.props.type );

		if( this.state.editable ) 
		{
			let color = (this.state.updated) ? settings.updatedColor : settings.editableTextColor;
			let extraStyles = { 
				width: this.props.width, color:color, backgroundColor: this.props.bgColor, 
			};
			if( this.state.renderModal ) {
				extraStyles.borderColor = '#7f7f7f';
				extraStyles.backgroundColor = '#efefef';
			}

			return(
				<>
					<Text
						ref = {this._ref}
						style = { [ styles.editTableCell, extraStyles ] } 
						onPress = { () => { this.openModal(); } }
					>
						{value}
					</Text>
					{ this.renderModal() }
				</>
			);
		} else 
		{
			let style = (typeof(this.props.row) === 'undefined' || this.props.type === 'lineNumber') ? 
				styles.editTableHeadCell : styles.editTableReadOnlyCell;			

			return(
						<Text 
							style={ [ style, { width: this.props.width, backgroundColor: this.props.bgColor } ] }
							onPress = { () => { this.setState( { displayRounded: !this.state.displayRounded } ); } }
						>
							{value}
						</Text>
			)
		}
	}

	closeModal() {
		this.setState( { renderModal: false } );
	}

	openModal() {
		this.setState( { renderModal: true } );
	}

	renderModal()
	{
		if( !this.state.renderModal ) return;
		return(
			<EditTableCellModal 
				value = { this.state.value }
				type = { this.props.type } 
				onConfirm = { (v) => { this.closeModal(); this.onChange(v); } }
				onCancel = { () => { this.closeModal(); } }
				title = { this.props.title }
			/>
		);
	}
}