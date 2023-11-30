import React, { Component } from "react";
import { Text, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { parseSpiderDateToJSDateHelper, formatSpiderDateHelper } from './helpers.js'


export class EditDateTime extends Component 
{
  constructor(props) 
	{
    super(props);

    this.state = {
      value: (typeof(this.props.value) !== 'undefined') ? this.props.value : '',
			editable: (typeof(this.props.editable) !== 'undefined') ? this.props.editable : true,
			dateTimePickerValue: null,
    };

		this.setValue = this.setValue.bind(this);
		this.onChange = this.onChange.bind(this);

		this.openDateTimePicker = this.openDateTimePicker.bind(this);
		this.renderDateTimePicker = this.renderDateTimePicker.bind(this);
  }

	setValue( value ) 
	{
		this.setState( { value: value } );
	}

	onChange( e, value ) 
	{
		if( e.type !== 'set' ) {
			this.setState({ dateTimePickerValue: null });
			return;
		}

		value = new Date( value.getTime() - value.getTimezoneOffset()*60000 );

		let spiderDateString = formatSpiderDateHelper( value, true );

		this.setState({value: spiderDateString, dateTimePickerValue: null});
		if( 'setter' in this.props ) {
			this.props.setter( spiderDateString );
		}
	}

	render() 
	{
		if( this.state.editable ) {
			let text = (
				<Text 
					style={ ( typeof(this.props.style) !== 'undefined') ? this.props.style : { color:'darkgray', backgroundColor:'white' } } 
					onPress={ () => { this.openDateTimePicker( this.state.value ); } }						
				>
					{this.state.value}							
				</Text>
			);

			return(
					<View style={ ( typeof(this.props.viewStyle) !== 'undefined') ? this.props.viewStyle : {} }>
						{ text } 
						{ this.renderDateTimePicker() }
					</View>
			);
		} else 
		{
			return(
					<View style={{ width: this.props.width, flexShrink:0 }}>
						<Text 
							style={{}}
							onPress={ (typeof(this.props.onPress) !== 'undefined') ? this.props.onPress : null } 
						>
							{this.state.value}							
						</Text>
					</View>
			)
		}
	}

	openDateTimePicker( value )
	{
		this.setState( { 
			dateTimePickerValue: ( this.state.dateTimePickerValue === null ) ? value : null,
		} );
	}

	renderDateTimePicker()
	{
		if( this.state.dateTimePickerValue !== null)
		{
			let date = parseSpiderDateToJSDateHelper( this.state.dateTimePickerValue );		
			//console.log(date);
			date = new Date( date.getTime() + date.getTimezoneOffset()*60000 );
		
			return(
				<DateTimePicker
					value={date}
					display='default'
					mode={'date'}
					onChange={this.onChange}
				/>			
			);
		}
	}
}