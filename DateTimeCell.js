import React, { Component } from "react";
import { View, Text, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import { 
	isValidSpiderDateHelper, formatSpiderDateHelper, parseSpiderDateHelper, 
	isEmptyStringHelper, parseSpiderDateToJSDateHelper,
	getSpiderDate, getSpiderTime 
} from './helpers.js'
import { settings } from './settings.js';
import { styles } from './styles.js';

export class DateTimeCell extends Component 
{
  constructor(props) 
	{
    super(props);
		this.castValue = this.castValue.bind(this);
		this.setValue = this.setValue.bind(this);
		this.onChange = this.onChange.bind(this);

		this._ref = React.createRef();

		let value = this.castValue(this.props.value);
		let editable = (typeof(this.props.editable) !== 'undefined' && this.props.editable !== null) ? this.props.editable : false;
		this._originalValue = value;
		this._updatedValue = value;
		this.state = {
			row: this.props.row,
			col: this.props.col,
			value: value,
			editable: editable,
			updated: false,
			beingEdited: false,
			dateTimePickerValue: null,
			dateTimePickerMode: null
		};

		this.openDateTimePicker = this.openDateTimePicker.bind(this);
		this.renderDateTimePicker = this.renderDateTimePicker.bind(this);
  }

	castValue( value ) 
	{
		value = formatSpiderDateHelper(value);
		return value;
	}

	setValue( v ) 
	{
		let value = this.castValue(v);
		this._updatedValue = value;
		this.setState({ value:value, updated:true });
	}

	onChange( e, v ) 
	{
		if( e.type !== 'set' ) {
			this.setState({ dateTimePickerValue: null });
			return;
		}

		v = new Date( v.getTime() - v.getTimezoneOffset()*60000 );

		let newValue = formatSpiderDateHelper( v );
		
		let newState = { 
			value: newValue, updated: false, beingEdited: false, dateTimePickerValue: null 
		};
		let updated = false;
		let newSpiderValue;
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
		
		
		if( updated ) {
			this.props.editTableCellChange( newSpiderValue, this.state.row, this.state.col );
			newState.updated = true;
		} 
		this.setState( newState );
	}

	render() 
	{		
		let date = getSpiderDate( this.state.value );
		let time = getSpiderTime( this.state.value );

		if( this.state.editable ) 
		{
			let color = (this.state.updated) ? settings.updatedColor : settings.editableTextColor;
			let extraStyles = { width: this.props.width, color:color, 
				backgroundColor: this.props.bgColor, 
				flexDirection: "row", justifyContent: 'space-between' 
			};

			return(
				<View style={ [ styles.editTableDatetimeCell, extraStyles ] }>
					<Text 
						style={ [ styles.editTableDatetimeText ] } 
						onPress={ (e) => { this.openDateTimePicker( 'date' ); } }						
					>
						{date}							
					</Text>
					<Text 
						style={ [ styles.editTableDatetimeText ] } 
						onPress={ (e) => { this.openDateTimePicker( 'time' ); } }						
					>
						{time}							
					</Text>					
					{ this.renderDateTimePicker() }
				</View>
			);
		} else 
		{ 
			let style = styles.editTableReadOnlyCell;			

			return(
				<Text style={ [ style, { width: this.props.width, backgroundColor: this.props.bgColor } ] }>
					{ this.state.value }
				</Text>
			);
		}
	}

	openDateTimePicker( mode )
	{
		this.setState( { 
			dateTimePickerValue: this.state.value,
			dateTimePickerMode: mode
		} );
	}

	renderDateTimePicker()
	{
		if( this.state.dateTimePickerValue !== null)
		{
			let date = parseSpiderDateToJSDateHelper( this.state.dateTimePickerValue );		
			date = new Date( date.getTime() + date.getTimezoneOffset()*60000 );
			//console.log(date);
			//console.log(new Date(date.toISOString().slice(0, -1)));
			//date = new Date(date.toISOString().slice(0, -1));
			return(
				<DateTimePicker
					value = {date}
					display = {this.state.dateTimePickerMode==='date' ? 'calendar' : 'clock'}
					mode = {this.state.dateTimePickerMode}
					onChange = {this.onChange}
				/>			
			);
/*		
      return (
				<DateTimePickerModal
					isVisible = {true}
					mode = {this.state.dateTimePickerMode}
					onConfirm = { (d) => { this.onChange( null, d ); } }
					onCancel = { () => {} }
				/>
			);
*/
		}
	}
}