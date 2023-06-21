import React, { Component } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { isValidNumberHelper, isValidDateTimeSymbolsHelper, isValidSpiderDateHelper, 
	formatSpiderDateHelper, parseSpiderDateHelper, isEmptyStringHelper, logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class EditTableCell extends Component {
  constructor(props) {
    super(props);

		let type = (typeof(this.props.type) !== 'undefined') ? this.props.type : 'text';
		let value = this.castValue(this.props.value, type);

		this._originalValue = value;
		this._updatedValue = value;
		this.state = {
			row: this.props.row,
			col: this.props.col,
			value: value,
			type: type,
			editable: (typeof(this.props.editable) !== 'undefined' && this.props.editable !== null) ? this.props.editable : false,
			updated: false
		};

		this.castValue = this.castValue.bind(this);
		this.setValue = this.setValue.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
  }

	castValue( value, type ) {
		if( typeof(value) !== 'undefined' && value !== null) {
			if( type === 'number' ) {
				value = value.toString();
			} else if( type === 'datetime' ) {
				value = formatSpiderDateHelper(value);
			} else {
				value = value;
			}
		} else { 
			value = '';
		}
		return value;
	}

	setValue( v ) {
		let value = this.castValue(v, this.state.type);
		this._updatedValue = value;
		this.setState({ value:value, updated:true });
	}

	onChange( value ) {
		if( this.props.type === 'number' ) {
			if( !isEmptyStringHelper(value) > 0 ) {
				if( !isValidNumberHelper(value) ) {					
					value = this._updatedValue;
				} else {
					this._updatedValue = value; 
				}
			}
		} else if( this.props.type === 'datetime') {
			if( !isEmptyStringHelper(value) && !isValidDateTimeSymbolsHelper(value) ) {
				value = this._updatedValue;
			} else {
				this._updatedValue = value; 
			}
		} else {
			this._updatedValue = value; 
		}
		this.setState({ value: value });
	}

	onBlur() {
		let newState = { value: this.state.value, updated: false };
		let updated = false;
		let newSpiderValue;
		if( this.state.type === 'number' ) {
			newSpiderValue = (!isEmptyStringHelper(this.state.value)) ? parseFloat(this.state.value) : null;
			if( (this.props.value === null && newSpiderValue !== null) || (newSpiderValue === null && this.props.value !== null) ) {
				updated = true;
			} else if( this.props.value !== null && newSpiderValue !== null ) {
				if( Math.abs(newSpiderValue - this.props.value) > 1e-10 ) {
					updated = true;
				}
			} 
		} else if( this.state.type === 'datetime' ) {
			let newValue = this.state.value;
			if( !isEmptyStringHelper(this.state.value) && !isValidSpiderDateHelper(this.state.value) ) {
				newValue = this._originalValue;
				newState.value = this._originalValue;
			}
			newSpiderValue = (!isEmptyStringHelper(newValue)) ? parseSpiderDateHelper(newValue) : null;
			if( (this.props.value === null && newSpiderValue !== null) || (newSpiderValue === null && this.props.value !== null) ) {
				updated = true;
			} else if( this.props.value !== null && newSpiderValue !== null ) {
				if( Math.abs(newSpiderValue - this.props.value) > 59 ) {
					updated = true;
				}
			}
		} else {
			newSpiderValue = this.state.value;
			if( newSpiderValue !== this.props.value ) {
				updated = true;
			}
		}
		
		if( updated ) {
			//if( 'editTableCellChange' in props)
				this.props.editTableCellChange( newSpiderValue, this.state.row, this.state.col );
			newState.updated = true;
		} 
		this.setState( newState );
	}

	onFocus() {
	}

	render() {
		if( this.state.editable ) {
			let color = (this.state.updated) ? settings.updatedColor : settings.editableTextColor;
			return(
						<TextInput value={this.state.value} 
							style={ [ styles.editTableCell, {width: this.props.width, color:color } ] } 
							onChangeText={(value) => { this.onChange(value) }}
							onBlur={(value) => { this.onBlur(value) }}
							//onFocus={() => { this.onFocus() }} 
						/>
			)
		} else {
			let style = (typeof(this.props.row) === 'undefined') ? styles.editTableHeadCell : styles.editTableReadOnlyCell;
			return(
						<Text style={ [ style, {width: this.props.width} ] }>
							{this.state.value}
						</Text>
			)
		}
	}
}