import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from './styles.js';

export class EditTableHeadCell extends Component 
{
  constructor(props) 
	{
    super(props);

		this._ref = React.createRef();

		this.state = {
			row: 0,
			col: this.props.col,
			value: this.props.value,
		};
  }

	render() 
	{		
		let value = this.state.value;

		if( this.props.onShowAssignments ) 
		{
			let icon = this.props.showAssignments ? String.fromCharCode(0x2612) : String.fromCharCode(0x2610);
			return(
				<View style={ [ styles.editTableHeadCellContainer, {flexDirection:'column', width: this.props.width} ] }>
					<Text style={ [ styles.editTableHeadCell, {width: this.props.width - 2} ] } >
						{value}
					</Text>
					<Text 
						style={ [ styles.editTableHeadCellControl, {width: this.props.width - 2} ] } 
						onPress = { () => { this.props.onShowAssignments( !this.props.showAssignments ); } }
					>{ icon + ' A' }</Text>
				</View>
			);
		}

		return(
			<View style={ [ styles.editTableHeadCellContainer, {width: this.props.width} ] }>
					<Text style={ [ styles.editTableHeadCell, {width: this.props.width - 2} ] } >
						{value}
					</Text>
			</View>
		);
	}
}