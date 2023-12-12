import { settings } from './settings.js';

export function logHelper(...s) {
	if( settings.log ) {
		console.log(s);
	}
}

export function makeUrlHelper( cr ) {
  return 'http://' + cr.server + ':' + cr.port;
}

export function formatSpiderDateHelper( 
	date, dateOnly = false, format = {format:'DMY', dateDelim:'.', timeDelim:':'} ) 
{
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


export function isValidSpiderDateHelper(value) 
{
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

export function parseSpiderDateHelper( dateString, format={ format:'DMY' } ) 
{
	let date = parseSpiderDateToJSDateHelper( dateString, format );
	if( date === null ) return null;

	return date.getTime() / 1000;
}

export function parseSpiderDateToJSDateHelper( dateString, format={ format:'DMY' } ) 
{
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
	
	return date;
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


export function isEmptyStringHelper( s ) 
{
	if( s === undefined || s === null ) return true;

	if( typeof(s) !== 'string' ) s = s.toString();		

	for( let i = 0 ; i < s.length ; i++ ) {
		let c = s[i];
		if( c !== ' ' && c !== '\t' && c !== '\r' && c !== '\n' ) {
			return false;
		} 
	}
	return true;
}


export function groupProjectListHelper( src ) 
{
	if( typeof(src) === 'undefined' || src === null ) {
		return {};
	}
	let re = new RegExp(/^(.*)\.([0-9]+)\.sprj$/, 'i');
	let dest = {};
	for( let entry of src ) 
	{
		let key = null, version = null, storage=null;
		if( typeof(entry) === 'object' ) 
		{
			if( entry.storageCode === undefined || entry.fileName === undefined ) continue;
			let m = entry.fileName.match(re);
			if( m === null || m.length !== 3 ) continue;
			key = m[1];
			version = m[2];
			storage = entry.storageCode;
		} else if( typeof(entry) === 'string' )
		{
			let m = entry.match(re);
			if( m === null || m.length !== 3 ) continue;
			key = m[1];
			version = m[2];
			storage = null;
		}
		if( key === null || version === null ) continue;
		
		if( !(storage in dest) ) {
			dest[storage] = {};
		}
		if( !(key in dest[storage]) ) {
			dest[storage][ key ] = [];
		}
		dest[storage][ key ].push( { version: version, storage: storage } );
	}	

	for( let storageKey in dest ) 
	{
		for( let fileNameKey in dest[storageKey] ) 
		{
			dest[ storageKey ][fileNameKey].sort( (a, b) => {
				let v1 = parseInt( a.version ), v2 = parseInt( b.version );
				return ( isNaN(v1) || isNaN(v2) ) ? 0 : v1 - v2; 
			} );
		}
	}	
	return dest;
}

export function makeFieldsCacheHelper( data ) {
	let fieldsCache = {};
	for( let i = 0 ; i < data.fields.length ; i++ ) {
		fieldsCache[ data.fields[i].Code ] = i;
	}
	return fieldsCache; 
}

export function makeArrayCacheKeyHelper( level, code ) {
	if( typeof(level) === 'undefined' || level === null || (typeof(level) === 'string' && level.length === 0) ) {
		level = 'none';
	}
	return '_' + level + '_' + code;
}

export function makeArrayCacheHelper( data ) {
	let dataCache = {};
	for( let i = 0 ; i < data.array.length ; i++ ) {
		let d = data.array[i];
		let key = makeArrayCacheKeyHelper( d.Level, d.Code );
		dataCache[key] = i;
	}	
	return dataCache;
}


export function formatDisplayNumberHelper( value, toFixed )
{
	if( value === 'undefined' || value === null ) return [ '', null ];

	if( toFixed === undefined || toFixed === null ) toFixed = 2;

	let typeOfValue = typeof(value);
	if( typeOfValue !== 'number') 
	{
		if( typeOfValue === 'string' ) 
		{
			if( value === '' ) return [ '', null ];
			let floatValue = parseFloat( value );
			if( isNaN( floatValue ) ) return [ value, null ];
			let splitted = value.split('.');
			let count = ( splitted.length === 2 ) ? splitted[1].length : 0;
			return [ floatValue.toFixed( toFixed ), count ];
		}
		return [ value, null ];
	}

	return [ value.toFixed( toFixed ), countDecimalDigits( value ) ];
}

export function countDecimalDigits( value )
{
	if( value === null || value === undefined || isNaN(value) ) return null;
	if( typeof(value) === 'string' ) {
		value = parseFloat(value);
		if( isNaN(value) ) return null;
	} 	
	value = Math.abs(value);
	value = value - Math.floor(value);
	let count = 0;
	while( value > 0 ) {
		value = value * 10;
		value = value - Math.floor(value);
		count++;
	}

	return count;
}


export function isDifferentNumbersHelper( n1, n2 )
{
	if( (n1 === null || n1 === undefined) && (n2 !== null && n2 !== undefined) ) return true;
	if( (n2 === null || n2 === undefined) && (n1 !== null && n1 !== undefined) ) return true;
	if( (n1 === null || n1 === undefined) && (n1 === null || n2 === undefined) ) return false;

	if( typeof(n1) === 'string' ) n1 = parseFloat(n1);
	if( typeof(n2) === 'string' ) n2 = parseFloat(n2);

	if( (isNaN(n1) && !isNaN(n2)) || (!isNaN(n1) && isNaN(n2)) ) return true;
	if( isNaN(n1) && isNaN(n2) ) return false;

	return ( Math.abs(n1 - n2) > 1e-10 );
}

export function splitText( text, breakIf=14 ) 
{
	if( text.length < breakIf ) return text;
	let insertBreak = ( text, pos ) => {
		return text.substr(0, pos) + '\n' + text.substr(pos+1, text.length - pos - 1);
	};

	let mid = Math.floor(text.length/2);
	for( let i=0 ; (mid+i) < text.length - 2  && mid-i >= 2 ; i++ )
	{
		if( text[mid+i] === ' ' ) {
			text = insertBreak( text, mid+i ); 
			break;
		}
		if( text[mid-i] === ' ' ) {
			text = insertBreak( text, mid-i ); 
			break;
		}
	}
	return text;
}


export function readDictValue( dict, key, type )
{
	if( dict === undefined || dict === null ) return null;
	if( !( key in dict ) ) return null;
	if( dict[key] === null ) return null;
	if( typeof(dict[key]) !== type ) return null;
	return dict[key];
}


function digitsOnly( str ) 
{
	let l = str.length;
	if( l == 0 ) return false;
	
	for( let i = 0 ; i < l ; i++ ) 
	{
		if( str[i] === ' ' ) continue;
		if( (str[i] < '0' || str[i] > '9') ) return false;
	}
	return true;
}


export function decodeSPColorToHtml( decColor, defaultColor=null ) 
{
	if( typeof(decColor) !== 'undefined' && decColor !== '' && decColor !== null ) 
	{		
		if( decColor ) 
		{
			if( digitsOnly(decColor) ) 
			{
				decColor = Number(decColor);
				if( decColor > 0xFFFFFF ) {
					return defaultColor;
				}
				let c1 = (decColor & 0xFF0000) >> 16;
				let c1text = c1.toString(16);
				if( c1text.length == 1 ) {
					c1text = "0" + c1text;
				}
				let c2 = (decColor & 0x00FF00) >> 8;
				let c2text = c2.toString(16);
				if( c2text.length == 1 ) {
					c2text = "0" + c2text;
				}
				let c3 = (decColor & 0x0000FF);	  
				let c3text = c3.toString(16);
				if( c3text.length == 1 ) {
					c3text = "0" + c3text;
				}
				return '#' + c3text + c2text + c1text;
			}
		}
	}
	return defaultColor;
}

export function getSpiderDate( datetime )
{
	let datetimepair = datetime.split(' ');
	return datetimepair[0];
}

export function getSpiderTime( datetime )
{
	let datetimepair = datetime.split(' ');
	if( datetimepair.length < 2 ) return null;
	return datetimepair[1];
}