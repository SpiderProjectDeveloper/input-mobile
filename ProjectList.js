import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Pressable } from 'react-native';
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

export class ProjectList extends Component 
{

	constructor(props) {
		super(props);

		this.state = {
			chosen: null,
		}
	}

	render() {		
		if( typeof(this.props.list) === 'undefined' || this.props.list === null || this.props.list.legnth === 0 ) {
			return(
				<View style={styles.mainContainer}>
					{settings.loadingIcon}
				</View>
			);
		}
		let projects = [];
		let i=0;
		for( let storageKey in this.props.list ) 
		{
			for( let fileNameKey in this.props.list[storageKey] ) 
			{
				let style = (this.props.chosen !== fileNameKey) ? styles.projectListItem : styles.projectListChosenItem;
				let title = fileNameKey;
				if(storageKey !== 'null' ) {
					title = storageKey + ": " + title;
				}
				projects.push(
					<View key={String(i)} style={styles.mainContainerScrollItem}>
						<Pressable style={styles.projectListItemContainer}
							onPress={ () => { 
								if( !this.props.disabled ) {
									this.props.onPress(fileNameKey, storageKey) 
								}
							} }					
						>
							{settings.fileIcon}
							<Text style={style}>{ title }</Text>
						</Pressable>	
					</View>
				);
				i++;
			}
		}
			return (
				//<ScrollView style={styles.mainContainerScroll}>{projects}</ScrollView>
				<ScrollView style={ [ styles.mainContainerScroll, { height: this.props.height } ] }>
					{projects}
				</ScrollView>
			)
	}
}
