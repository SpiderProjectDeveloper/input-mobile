import React, { Component } from 'react';
import { TouchableOpacity, Pressable, Text } from 'react-native';
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class UpperButton extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		if( typeof(this.props.visible) !== 'undefined' && this.props.visible !== null && this.props.visible === false ) {
			return null;
		}
		let style = (this.props.style === 'undefined') ? styles.upperButtonContainer : [ styles.upperButtonContainer, this.props.style ]
		return(
			<Pressable onPress={this.props.onPress} style={style}>          
				<Text 
					title={ (typeof(this.props.title) !== undefined) ? this.props.title : null } 
					style={styles.upperButton}
				>{this.props.text}</Text>
			</Pressable>
		);
	}
}