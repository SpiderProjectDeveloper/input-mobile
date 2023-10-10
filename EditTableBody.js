import React, { Component } from 'react';
import { Pressable, View, Text, TextInput, ScrollView, ColorPropType } from 'react-native';
import { EditTableCell } from "./EditTableCell.js";
import { decodeSPColorToHtml } from './helpers.js';
import { settings } from './settings.js';
import { styles } from './styles.js';

class ScrollVisualHelper extends Component 
{
	constructor(props) {
		super(props);

		this.state = {
			fetching: false,
		}

		this._visible = null;
		this.onPress = this.onPress.bind(this);
	}

	onPress() {
		this.props.onScrollHandler();
	}

	shouldComponentUpdate( nextProps, nextState ) {
		if( this._visible === nextProps.visible && (this.state.fetching === nextState.fetching) ) {
			return false;
		}
		return true;
	}

	render() 
	{
		this._visible = this.props.visible;
		if( !this.props.visible ) {
			return null;
		}
		let scrollCells=[];
		for( let i = 0 ; i < this.props.data.fields.length ; i++ ) 
		{				
			let f = this.props.data.fields[i];
			if( 'hidden' in f && f.hidden === 1 ) continue;
			
			scrollCells.push(
				<Pressable key={i} onPress={this.onPress}>          
					<Text key={i}  
						style={ [ styles.editTableReadOnlyCell, {width: this.props.widths[i]} ] }>
						{ 
							(!this.state.fetching) ? '...' : 'wait...'
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


export class EditTableBody extends Component 
{
	constructor(props) 
	{
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

		this._refs = null;
		this.updateCell = this.updateCell.bind(this);
	}

	updateCell( row, col, value ) 
	{
		if( this._refs !== null ) {
			let key = 'r' + row + 'c' + col;
			if( key in this._refs ) {
				this._refs[key].current.setValue( value );
			}
		}
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

	scrollUp() 
	{
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

	scrollDown() 
	{
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

	shouldComponentUpdate(nextProps, nextState) 
	{
		return ( nextState.scrollTop !== this.state.scrollTop || nextProps.showAssignments != this.props.showAssignments );
	}

	render() 
	{
		this._refs = {};
		let rows=[];
		for( let irow = this.state.scrollTop ; irow <= this.state.scrollBottom ; irow++ ) 
		{
			let rowData = this.props.data.array[irow];
			if( !this.props.showAssignments ) if( rowData.Level === 'A' ) continue;

			let bgColor = decodeSPColorToHtml( rowData['f_ColorBack'], "#ffffff" );

			let rowCells=[];
			for( let icol = 0 ; icol < this.props.data.fields.length ; icol++ ) 
			{				
				let f = this.props.data.fields[icol];
				if( 'hidden' in f && f.hidden === 1 ) continue;

				let toFixed = 2; // this.props.data.fields['toFixed']
				let value;
				if( f.Code === '__lineNumber__' ) {
					value = irow;
				} else {
					if( typeof(rowData[f.Code]) !== 'undefined' && rowData[f.Code] !== null ) {
						value = rowData[f.Code];
					} else {
						value = null;
					}
				}
				
				let ref=null;
				if( 'editable' in f && f.editable ) {
					ref = React.createRef();
					this._refs[ 'r'+irow+'c'+icol ] = ref;
				}

				rowCells.push( 
					<EditTableCell 
						key= { icol } { ...( (ref !== null) ? {ref:ref} : {} ) } 
						editTableCellChange= { this.props.editTableCellChange }
						row = { irow } col = { icol } value = { value } 
						width = { this.props.widths[icol] } 
						editable = { this.props.editables[icol] } 
						type = { this.props.types[icol] }
						bgColor = { bgColor }
						toFixed= { toFixed }
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