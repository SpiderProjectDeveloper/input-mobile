import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Pressable } from 'react-native';
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class ProjectList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			chosen: null,
		}
	}

	render() {		
		if( typeof(this.props.list) === 'undefined' || this.props.list === null || this.props.list.legnth === 0 ) {
			return(
				<>
					{settings.loadingIcon}
				</>
			);
		}
		let projects = [];
		let i=0;
		for( let prj in this.props.list ) {
			let style = (this.props.chosen !== prj) ? styles.projectListItem : styles.projectListChosenItem;
			projects.push(
				<View key={String(i)} style={styles.mainContainerScrollItem}>
					<Pressable style={styles.projectListItemContainer}
						onPress={ () => { 
							if( !this.props.disabled ) {
								this.props.onPress(prj) 
							}
						} }					
					>
						{settings.fileIcon}
						<Text style={style}>{prj}</Text>
					</Pressable>	
				</View>
			);
			i++;
		}
		return (
			<ScrollView style={styles.mainContainerScroll}>{projects}</ScrollView>
		)
	}
}
