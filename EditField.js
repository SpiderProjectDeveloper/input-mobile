import React, { Component } from "react";
import { Text, TextInput, View } from "react-native";
import { isValidSpiderDateHelper } from './helpers.js';

export class EditField extends Component {
  constructor(props) {
    super(props);

		this._value = (typeof(this.props.value) !== 'undefined') ? this.props.value : '';
    this.state = {
      value: this._value,
      type: (typeof(this.props.type) !== 'undefined') ? this.props.type : 'text',
			editable: (typeof(this.props.editable) !== 'undefined') ? this.props.editable : true
    };
		this._propValue = this.props.value;

		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.setValue = this.setValue.bind(this);
  }

	setValue( value ) {
		this._value = value;
		this.setState( { value:value } );
	}

	onChange( value ) {
		if( this.props.type === 'number' ) {
			if( value.length > 0 ) {
				let re = new RegExp(/^ *[0-9]+(\.[0-9]*)? *$/,'i');
				if( !re.test(value) ) {
					value = this._value;
				} else {
					this._value = value; 
				}
			}
		} else if( this.props.type === 'datetime') {
			if( value.length > 0 ) {
				let re = new RegExp(/[^0-9\.\:\-\\\/ ]/,'i'); // Testing invalid date time characters
				if( re.test(value) ) {
					value = this._value;
				} else {
					if( isValidSpiderDateHelper(value) ) {
						this._value = value; 
					}
				} 
			}
		} else {
			this._value = value; 
		}
		this.setState({value: value});
	}

	onBlur( value ) {
		this.setState({ value:this._value });
		if( 'setter' in this.props ) {
			this.props.setter( this._value );
		}
	}

	onFocus() {
		this.setState({ value:this._value });
	}

	render() {
		let value = this.state.value;
		if( this.state.editable ) {
			return(
					<View style={ ( typeof(this.props.viewStyle) !== 'undefined') ? this.props.viewStyle : {} }>
						<TextInput value={value} 
							editable={this.state.editable}
							placeholder={ ( typeof(this.props.placeholder) !== 'undefined') ? 
								this.props.placeholder : 'Please, enter a value' }
							style={ ( typeof(this.props.style) !== 'undefined') ? this.props.style : { color:'darkgray', backgroundColor:'white'} } 
							onChangeText={(value) => { this.onChange(value) }}
							onBlur={(value) => { this.onBlur(value) }}
							onFocus={() => { this.onFocus() }} />
					</View>
			)
		} else {
			return(
					<View style={{ width: this.props.width, flexShrink:0 }}>
						<Text style={{}}>{this.state.value}</Text>
					</View>
			)
		}
	}
}