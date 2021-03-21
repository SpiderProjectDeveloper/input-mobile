import React from 'react';
import { View, Text } from 'react-native';
import { settings } from './settings.js';
import { styles } from './styles.js';

export function logHelper(...s) {
	if( settings.log ) {
		console.log(s);
	}
}

export function makeUrlHelper( cr ) {
  return 'http://' + cr.server + ':' + cr.port;
}

export function formatSpiderDateHelper( date, dateOnly=false, format={format:'DMY', dateDelim:'.', timeDelim:':'} ) {
  let spiderDateString = null;
  
  if( typeof(date) === 'undefined' || date === null || date === '' ) {
      return '';
  }

	if( typeof(date) === 'string' ) {
		date = parseInt(date);
	}
  if( typeof(date) === 'number' ) { 	// Not 'object' implies seconds
    date = new Date( parseInt(date) * 1000 );
  }
  let year = date.getUTCFullYear(); 
  let month = (date.getUTCMonth()+1);
  if( month < 10 ) {
    month = "0" + month;
  }
  let day = date.getUTCDate();
  if( day < 10 ) {
    day = "0" + day;
  }
  if( format.format !== 'MDY' ) {  // day-month-year
    spiderDateString = day + format.dateDelim + month + format.dateDelim + year; 
  } else {
    spiderDateString = month + format.dateDelim + day + format.dateDelim + year;		 
  }
  if( !dateOnly ) {
    let hours = date.getUTCHours();
    if( hours < 10 ) {
      hours = "0" + hours;
    }
    let minutes = date.getUTCMinutes();
    if( minutes < 10 ) {
      minutes = "0" + minutes;
    }
    spiderDateString += " " + hours + format.timeDelim +  minutes;
  }
  return( spiderDateString ); 
}


export function isValidSpiderDateHelper(value) {
	let re =  new RegExp( /^ *([0-9]{2})[\.\-\:\\\/]{1}([0-9]{2})[\.\-\:\\\/]{1}([0-9]{2,4}) *$/);
	let e = re.exec(value);
	if( e === null ) {
		re =  new RegExp( /^ *([0-9]{2})[\.\-\:\\\/]{1}([0-9]{2})[\.\-\:\\\/]{1}([0-9]{2,4}) +([0-9]{2})[\.\-\:\\\/]{1}([0-9]{2}) *$/);
		e = re.exec(value);
		if( e === null ) {
			return false;
		}
	}
	if( e.length != 4 && e.length != 6 ) {
		return false;
	}
	let d = parseInt(e[1], 10);
	let m = parseInt(e[2], 10);
	let y = parseInt(e[3], 10);

	if( d < 1 || d > 31 ) {
		return false;
	}
	if( m < 1 || m > 12 ) {
		return false;
	}
	if( (y < 1900 && y > 99) || y > 2500 ) {
		return false;
	}

	if( e.length === 6 ) {
		let hr = parseInt(e[4], 10);
		let mn = parseInt(e[5], 10);
		if( hr < 0 || hr > 23 ) {
			return false;
		}
		if( mn < 0 || mn > 59 ) {
			return false;
		}		
	}
	return true;
}

export function parseSpiderDateHelper( dateString, format={ format:'DMY' } ) {
	if( typeof(dateString) === 'undefined' ) {
		return null;
	}
	if( dateString == null ) {
		return null;
	}
	let date = null;
	let y=null, m=null, d=null, hr=null, mn=null;
	let parsedFull = dateString.match( /([0-9]+)[\.\/\-\:]([0-9]+)[\.\/\-\:]([0-9]+)[ T]+([0-9]+)[\:\.\-\/]([0-9]+)/ );
	if( parsedFull !== null ) {
		if( parsedFull.length == 6 ) {
			y = parsedFull[3];
			if( y.length == 2 )		// If a 2-digit year format
				y = "20" + y;
			if( format.format === 'DMY' ) {
				m = parsedFull[2];
				d = parsedFull[1];				
			} else if( format.format === 'MDY' ){
				d = parsedFull[2];
				m = parsedFull[1];								
			} else {
				return null;
			}
			hr = parsedFull[4];
			mn = parsedFull[5];
			date = new Date(Date.UTC(y, m-1, d, hr, mn, 0, 0));
		}
	} else {
		let parsedShort = dateString.match( /([0-9]+)[\.\/\-\:]([0-9]+)[\.\/\-\:]([0-9]+)/ );
		if( parsedShort !== null ) {
			if( parsedShort.length == 4 ) {
				y = parsedShort[3];
				if( y.length == 2 )		// If a 2-digit year format
					y = "20" + y;
				if( format.format === 'DMY' ) {
					m = parsedShort[2];
					d = parsedShort[1];					
				} else if( format.format === 'MDY' ) {
					d = parsedShort[2];
					m = parsedShort[1];										
				} else {
					return null;
				}
				hr = 0;
				mn = 0;
				date = new Date(Date.UTC(y, m-1, d, hr, mn, 0, 0, 0, 0));
			}
		}
	}
	if( date === null ) {
		return null;
	}
	return date.getTime() / 1000;
}


export function isValidNumberHelper( value ) {
	let re = new RegExp(/^ *[0-9]+(\.[0-9]*)? *$/,'i');
	return re.test(value);
}

export function isValidDateTimeSymbolsHelper( value ) {
	let re = new RegExp(/[^0-9\.\:\-\\\/ ]/,'i'); // Testing invalid date time characters
	return !re.test(value);
}

export function isValidTimeInSecondsHelper( value ) {
	let re = new RegExp(/^[0-9]+$/,'i'); // Testing invalid date time characters
	return re.test(value);
}


export function isEmptyStringHelper( s ) {
	for( let i = 0 ; i < s.length ; i++ ) {
		let c = s[i];
		if( c !== ' ' && c !== '\t' && c !== '\r' && c !== '\n' ) {
			return false;
		} 
	}
	return true;
}


export function groupProjectListHelper( srcList ) {
	if( typeof(srcList) === 'undefined' || srcList === null ) {
		return {};
	}
	let re = new RegExp(/^(.*)\.([0-9]+)\.sprj$/, 'i');
	let dstList = {};
	for( let i = 0 ; i < srcList.length ; i++ ) {
		let s = srcList[i];
		let m = s.match(re);
		if( m === null || m.length !== 3 ) {
			continue;
		}
		let key = m[1];
		if( !(key in dstList) ) {
			dstList[ key ] = [];
		}
		dstList[ key ].push(m[2]);
	}	
	for( let key in dstList ) {
		dstList[ key ].reverse();
	}	
	return dstList;
}
