import React, { Component } from "react";
import { Modal, Text, TextInput, Pressable, TouchableOpacity, View } from "react-native";
import { 
	isValidNumberHelper, isValidDateTimeSymbolsHelper, isValidSpiderDateHelper, 
	formatSpiderDateHelper, formatDisplayNumberHelper, 
	parseSpiderDateHelper, isEmptyStringHelper, isDifferentNumbersHelper 
} from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class EditTableCellModal extends Component 
{
  constructor(props) 
	{
    super(props);

		this.onChange = this.onChange.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);

		this._ref = React.createRef();
		this._updatedValue = this.props.value;

		let value = this.props.value;
		if( typeof(value) === 'undefined' || value === null ) { 
			value = '';
		} else if( typeof(value !== 'string') ) {
			value = value.toString();
		}
		this.state = {
			type:  (typeof(this.props.type) !== 'undefined') ? this.props.type : 'text',
			value: value,
			visible: true,
		};
  }

	onConfirm() {
		this.props.onConfirm( this.state.value );
	}

	onCancel() {
		this.props.onCancel();
	}

	onChange( value ) 
	{
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

	render() 
	{		
		let value = this.state.value;

		return(
			<View style={styles.centeredView}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.visible}
					onRequestClose={() => {
						//this.setState( { visible: false } );
						this.props.onCancel();
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={{ paddingTop:12, paddingBottom:24 }}>{this.props.title}</Text>
							<TextInput 
								ref = {this._ref}
								value = { value } 
								autoFocus = { true }
								style={ [ styles.editTableCell, { minWidth: 200 } ] } 
								onChangeText={(value) => { this.onChange(value); }}
								selectTextOnFocus = {true}
							/>
							<View style= { { flexDirection: 'row', marginTop: 20 } }>
								<Pressable
									style = { {} }
									onPress={ () => { 
										this.onCancel(); 
									} }>
									<Text style = { 
										{ marginRight: 4, paddingHorizontal:30, paddingBottom:12, textAlign: 'center', 
											fontSize: 32, color:'#ffffff', backgroundColor: settings.activeButtonBgColor } 
									}>
										{settings.cancelButton}
									</Text>
								</Pressable>	
								<Pressable
									style = { {} }
									onPress={ () => { 
										this.onConfirm();									 
									} }>
									<Text style = { 
										{ marginLeft: 4, paddingHorizontal:30, paddingBottom:12, textAlign: 'center', 
											fontSize: 32, color:'#ffffff', backgroundColor: settings.activeButtonBgColor } 
									}>
										{settings.confirmButton}
									</Text>
								</Pressable>	
							</View>
						</View>
					</View>				
				</Modal>
			</View>
		);
	}
}
