import React, { Component } from 'react';
import { Pressable, View, Text, TextInput, ScrollView } from 'react-native';
import { EditTableCell } from "./EditTableCell.js";
import { logHelper } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

class ScrollVisualHelper extends Component {

	constructor(props) {
		super(props);

		this.state = {
			fetching: false,
		}

		this._visible = null;
	}

	shouldComponentUpdate( nextProps, textState ) {
		if( this._visible === nextProps.visible ) {
			return false;
		}
		return true;
	}

	render() {
		this._visible = this.props.visible;
		if( !this.props.visible ) {
			return null;
		}
		let scrollCells=[];
		for( let i = 0 ; i < this.props.data.fields.length ; i++ ) {				
			scrollCells.push(
				<Pressable key={i} onPress={this.props.onScrollHandler}>          
					<Text key={i}  
						style={ [ styles.editTableReadOnlyCell, {width: this.props.widths[i]} ] }>
						{ 
							'...'
							//(this.props.dir === 'up' ) ? settings.nextPageUpButton : settings.nextPageDownButton
						}
					</Text>
				</Pressable>
			);
		}
		return (
			<View style={{flexDirection:'row'}}>{scrollCells}</View>
		);
	}
};


export class EditTableBody extends Component {

	constructor(props) {
		super(props);

		this._scrollSize = 12; 
		this._scrollMax = this.props.data.array.length - 1;
		this._scroll = (settings.editTableInitialLoad <= this._scrollMax);
		this._scrollAllowed = true;
		this.state = {
			scrollTop: 0,
			scrollBottom: (this._scroll) ? (settings.editTableInitialLoad - 1) : this._scrollMax
		}
		if( this._scroll ) {
			this._onScroll = this._onScroll.bind(this);
		}
		this.scrollUp = this.scrollUp.bind(this);
		this.scrollDown = this.scrollDown.bind(this);
	}

	
	componentDidUpdate() {
		this._scrollAllowed = true;
	}

	_onScroll( {layoutMeasurement, contentOffset, contentSize} ) {
		return;
		if( typeof(layoutMeasurement) === 'undefined' || layoutMeasurement === null ||
			typeof(contentOffset) === 'undefined' || contentOffset === null || 
			typeof(contentSize) === 'undefined' || contentSize === null ) { 
			return;
		} 
		const padding = 0;
  	if( contentOffset.y <= padding ) {
			this.scrollUp();
		} else if( layoutMeasurement.height + contentOffset.y >= contentSize.height - padding ) {
			this.scrollDown();
		}
  }

	scrollUp() {
		if( !this._scrollAllowed || !(this.state.scrollTop > 0) ) {
			return;
		}
		let newTop = this.state.scrollTop - this._scrollSize;
		if( newTop < 0 ) {
			newTop = 0;
		}
		this._scrollAllowed = false;
		this.setState({ scrollTop: newTop, scrollBottom: (newTop + settings.editTableInitialLoad - 1) });
	}

	scrollDown() {
		if( !this._scrollAllowed || !(this.state.scrollBottom < this._scrollMax) ) {
			return;
		}
		if( this.state.scrollBottom < this._scrollMax ) {
			let newBottom = this.state.scrollBottom + this._scrollSize;
			if( newBottom > this._scrollMax ) {
				newBottom = this._scrollMax;
			}
			this._scrollAllowed = false;
			this.setState({ scrollTop: (newBottom - settings.editTableInitialLoad + 1), scrollBottom: newBottom });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if( nextState.scrollTop !== this.state.scrollTop ) {
			return true;
		}
		return false;
	}

	render() {
		let rows=[];
		for( let irow = this.state.scrollTop ; irow <= this.state.scrollBottom ; irow++ ) {
			let rowData = this.props.data.array[irow];
			let rowCells=[];
			for( let icol = 0 ; icol < this.props.data.fields.length ; icol++ ) {
				let f = this.props.data.fields[icol];
				let value = (typeof(rowData[f.Code]) !== 'undefined' && rowData[f.Code] !== null) ? rowData[f.Code] : null;
				rowCells.push( 
					<EditTableCell key={icol} editTableCellChange={this.props.editTableCellChange}
						row={irow} col={icol} value={value} 
						width={ this.props.widths[icol] } editable={ this.props.editables[icol] } type={ this.props.types[icol] }
					/>
				);
			}
			rows.push(<View key={irow} style={{flexDirection:'row'}}>{rowCells}</View>);
		}	

		return(
			<ScrollView style={{flexDirection:'column'}} 
				onScroll={ ({nativeEvent}) => { this._onScroll(nativeEvent) } } scrollEventThrottle={16}>

				<ScrollVisualHelper visible={(this.state.scrollTop > 0)} 
					dir={'up'} widths={this.props.widths} data={this.props.data} onScrollHandler={this.scrollUp}/>

				{rows}							
	
				<ScrollVisualHelper visible={(this.state.scrollBottom < this._scrollMax)} 
					dir={'down'} widths={this.props.widths} data={this.props.data} onScrollHandler={this.scrollDown}/>

			</ScrollView>						
		);
	}
}