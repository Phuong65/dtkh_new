import { debounceTime , distinctUntilChanged , MonoTypeOperatorFunction , pipe } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Is } from '@utilities/is';
import { Dayjs } from 'dayjs';
import dayjs from '@setup/dayjs';
import { IctuConditionParam } from '@models/dto';
import { signal , Signal } from '@angular/core';
import { cloneDeep , isString } from 'lodash-es';
import { ICTUFileHostingService } from '@models/file';
import { getLinkDownload , linkGetFileContentAws } from '@env';
import { tokenGetter } from '@app/app.config';
import { Source } from 'plyr';
import Decimal from 'decimal.js';
import { Numeric } from '@models/common';

type ArrayOrderBy = -1 | 1;

const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export type FileTypeHelperSupportedType = 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'other';

export interface IctuCloudFile {
	location : ICTUFileHostingService;
	id : number,
	name : string,
	mineType : string,
}

export class FileHelper {

	static isImage( mimeType : string ) : boolean {
		return mimeType.startsWith( 'image/' );
	}

	static isVideo( mimeType : string ) : boolean {
		return mimeType.startsWith( 'video/' );
	}

	static isAudio( mimeType : string ) : boolean {
		return mimeType.startsWith( 'audio/' );
	}

	static isPDF( mimeType : string ) : boolean {
		return mimeType === 'application/pdf';
	}

	static isDocument( mimeType : string ) : boolean {
		const docTypes : string[] = [
			'application/pdf' ,
			'application/msword' ,
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document' , // .docx
			'application/vnd.ms-excel' ,
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' , // .xlsx
			'application/vnd.ms-powerpoint' ,
			'application/vnd.openxmlformats-officedocument.presentationml.presentation' , // .pptx
			'text/plain'
		];
		return docTypes.includes( mimeType );
	}

	static getFileType( mimeType : string ) : FileTypeHelperSupportedType {
		switch ( true ) {
			case this.isPDF( mimeType ):
				return 'pdf';
			case this.isImage( mimeType ):
				return 'image';
			case this.isVideo( mimeType ) :
				return 'video';
			case this.isAudio( mimeType ) :
				return 'audio';
			case this.isDocument( mimeType ) :
				return 'document';
			default:
				return 'other';
		}
	}

	static getPlyrSources( file : IctuCloudFile ) : Source[] {
		if ( file ) {
			switch ( this.getFileType( file.mineType ) ) {
				case 'audio':
				case 'video':
					return [ {
						provider : 'html5' ,
						src      : this.getStreamLink( file ) ,
						type     : file.mineType
					} ];
				default:
					return [];
			}
		} else {
			return [];
		}
	}

	private static tokenAttachment( source : string ) : string {
		const url : URL = new URL( source );
		if ( tokenGetter() ) {
			url.searchParams.set( 'token' , tokenGetter() );
		}
		return url.toString();
	}

	static getStreamLink( info : IctuCloudFile ) : string {
		switch ( info.location ) {
			case 'aws':
				return this.tokenAttachment( linkGetFileContentAws( info.name ) );
			case 'local':
				return this.tokenAttachment( getLinkDownload( info.name ) );
			default:
				return '';
		}
	}
}

export class HelperClass {
	/**
	 * sort
	 * @param array : array
	 * @param field : any field chosen to sort
	 * @param orderBy : ArrayOrderBy Direction to sort ascending: 1; descending: -1; default: 1.
	 */
	arraySort<T>( array : Array<T> , field : keyof T , orderBy : ArrayOrderBy = 1 ) : T[] {
		return array.sort( ( left : T , right : T ) : number => {
			if ( left[ field ] < right[ field ] ) {
				return -orderBy;
			}
			if ( left[ field ] > right[ field ] ) {
				return orderBy;
			}
			return 0;
		} );
	}

	arrayShuffle<T>( array : Array<T> ) : T[] {
		for ( let i : number = array.length - 1 ; i > 0 ; i-- ) {
			const j : number            = Math.floor( Math.random() * ( i + 1 ) );
			[ array[ i ] , array[ j ] ] = [ array[ j ] , array[ i ] ];
		}
		return array;
	}

	arrayShuffleIndex<T>( array : Array<T> ) : T[] {
		const randomIndex : string[] = Object.keys( array );
		return this.arrayShuffle( randomIndex ).reduce( ( _reducer : Array<T> , index : string ) : Array<T> => {
			_reducer.push( array[ parseInt( index , 10 ) ] );
			return _reducer;
		} , new Array<T>() );
	}

	sortWidthTwoConditions<T>( array : T[] , fieldFirst : keyof T , fieldSecond : keyof T ) : T[] {
		return array.sort( ( left : T , right : T ) : number => {
			if ( left[ fieldFirst ] < right[ fieldFirst ] ) {
				return -1;
			} else if ( left[ fieldFirst ] > right[ fieldFirst ] ) {
				return 1;
			}
			if ( left[ fieldSecond ] < right[ fieldSecond ] ) {
				return -1;
			} else if ( left[ fieldSecond ] > right[ fieldSecond ] ) {
				return 1;
			}
			return 0;
		} );
	}

	tryParseJSON<T>( str : string , fallback? : T ) : T {
		try {
			const obj = JSON.parse( str );
			/**
			 * Handle non-exception-throwing cases:
			 * Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			 * but… JSON.parse(null) returns null, and typeof null === "object",
			 * so we must check for that, too. Thankfully, null is falsy, so this suffices:
			 * */
			return ( obj && typeof obj === 'object' ) ? obj : ( fallback ?? null );
		} catch ( e ) {
			return ( fallback ?? null );
		}
	}

	maybeJSON( str : string ) : boolean {
		try {
			JSON.parse( str );
			return true;
		} catch ( e ) {
			return false;
		}
	}

	/**
	 * remove accents
	 * Converts all accent characters to ASCII characters.
	 * @param title - input (string)
	 * @return a slug converted from string input.
	 * */
	removeAccents( title : string ) : string {
		let str : string    = title ? title.replace( /^\s+|\s+$/g , '' ).toLowerCase() : '';
		const from : string = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;';
		const to : string   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------';
		for ( let i : number = 0 ; i <= from.length ; i++ ) {
			str = str.replace( new RegExp( from.charAt( i ) , 'g' ) , to.charAt( i ) );
		}
		str = str.replace( /[^a-z\d -]/g , '' ).replace( /\s+/g , '-' ).replace( /-+/g , '-' );
		return str;
	}

	encodeHTML( text : string ) : string {
		const replacer : { [ T : string ] : string } = {
			'&'  : '&amp;' ,
			'<'  : '&lt;' ,
			'>'  : '&gt;' ,
			'\'' : '&apos;'
		};
		return text ? text.replace( /[&<>'"]/g , ( tag : string ) : string => ( replacer[ tag ] || tag ) ) : '';
	}

	decodeHTML( text : string ) : string {
		return text.replace( /&apos;/g , '\'' ).replace( /&quot;/g , '"' ).replace( /&gt;/g , '>' ).replace( /&lt;/g , '<' ).replace( /&amp;/g , '&' );
	}

	showPhoneNumbersSafety( phone : string , numberToShow = 4 ) : string {
		return phone && phone.length ? new Array( phone.length - numberToShow + 1 ).join( '*' ) + phone.slice( -numberToShow ) : '';
	}

	showEmailAddressSafety( email : string ) : string {
		if ( !email || email.length < 5 ) {
			return '';
		}
		const arrEmail : string[] = email.split( '@' );
		if ( arrEmail[ 0 ].length < 2 ) {
			return email;
		}
		const trailingCharsIntactCount2 : number = Math.floor( arrEmail[ 0 ].length / 2 );
		arrEmail[ 0 ]                            = arrEmail[ 0 ].slice( 0 , trailingCharsIntactCount2 ) + new Array( arrEmail[ 0 ].length - trailingCharsIntactCount2 + 1 ).join( '*' );
		return arrEmail.join( '@' );
	}

	getYoutubeIdFromUrl( url : string ) : string {
		if ( Is.empty( url ) ) {
			return '';
		}
		const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		return url.match( regex ) ? RegExp.$2 : url;
	}

	// removeAscent ( str : string ) : string {
	// 	if ( str === null || str === undefined ) {
	// 		return str;
	// 	}
	// 	str = str.toLowerCase();
	// 	str = str.replace( /[àáạảãâầấậẩẫăằắặẳẵ]/g , 'a' );
	// 	str = str.replace( /[èéẹẻẽêềếệểễ]/g , 'e' );
	// 	str = str.replace( /[ìíịỉĩ]/g , 'i' );
	// 	str = str.replace( /[òóọỏõôồốộổỗơờớợởỡ]/g , 'o' );
	// 	str = str.replace( /[ùúụủũưừứựửữ]/g , 'u' );
	// 	str = str.replace( /[ỳýỵỷỹ]/g , 'y' );
	// 	str = str.replace( /đ/g , 'd' );
	// 	return str;
	// }

	formatSQLTimeStamp( date : Date ) : string {
		const d = new Date( date.toUTCString() );
		return this.formatSQLDateTime( d );
	}

	formatSQLDateTime( date : Date ) : string {
		const YYYY : string = date.getFullYear().toString();
		const MM : string   = ( date.getMonth() + 1 ).toString().padStart( 2 , '0' );
		const DD : string   = date.getDate().toString().padStart( 2 , '0' );
		const hh : string   = date.getHours().toString().padStart( 2 , '0' );
		const mm : string   = date.getMinutes().toString().padStart( 2 , '0' );
		const ss : string   = date.getSeconds().toString().padStart( 2 , '0' );
		return `${ YYYY }-${ MM }-${ DD } ${ hh }:${ mm }:${ ss }`;
	}

	/**
	 * convert form Date object to sql DATETIME format
	 * @param date : Date
	 * @return string // YYYY-MM-DD
	 * */
	formatSQLDate( date : Date ) : string {
		const y : string = date.getFullYear().toString( 10 );
		const m : string = ( date.getMonth() + 1 ).toString().padStart( 2 , '0' );
		const d : string = date.getDate().toString().padStart( 2 , '0' );
		return `${ y }-${ m }-${ d }`;
	}

	strToSQLDate( input : string ) : string {
		const date : Date | null = input ? this.dateFormatWithTimeZone( input ) : null;
		return date ? this.formatSQLDate( date ) : '';
	}

	uniqueId() : string {
		const head : string = Date.now().toString( 36 );
		const tail : string = Math.random().toString( 36 ).substr( 2 );
		return head + tail;
	}

	randomString( length = 16 , alphabet : string = DEFAULT_ALPHABET ) : string {
		const buf = new Uint8Array( length );
		// Dùng Web Crypto nếu có (trình duyệt / Angular 19 có)
		if ( typeof crypto !== 'undefined' && crypto.getRandomValues ) {
			crypto.getRandomValues( buf );
		} else {
			// Fallback (ít an toàn hơn)
			for ( let i : number = 0 ; i < length ; i++ ) buf[ i ] = Math.floor( Math.random() * 256 );
		}
		let out : string = '';
		const n : number = alphabet.length;
		for ( let i : number = 0 ; i < length ; i++ ) {
			out += alphabet[ buf[ i ] % n ];
		}
		return out;
	}

	generateUniqueStrings( count : number , length = 16 , alphabet : string = DEFAULT_ALPHABET ) : string[] {
		const set                  = new Set<string>();
		// Giới hạn số lần thử để tránh vòng lặp vô hạn khi count quá lớn
		const maxAttempts : number = count * 10;
		let attempts : number      = 0;
		while ( set.size < count && attempts < maxAttempts ) {
			set.add( this.randomString( length , alphabet ) );
			attempts++;
		}

		if ( set.size < count ) {
			throw new Error( 'Không thể tạo đủ chuỗi duy nhất. Tăng độ dài hoặc giảm số lượng.' );
		}

		return [ ... set ];
	}

	copyToClipboard( text : string ) : void {
		if ( navigator.clipboard?.writeText ) {
			void navigator.clipboard.writeText( text );
		}
	}

	shallowClone( obj : Object ) : Object {
		return Object.assign( {} , obj );
	}

	countWords( str : string ) : number {
		return str.split( /[^a-zA-Z-]+/ ).filter( Boolean ).length;
	}

	randomIntegerInRange( min : number , max : number ) : number {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}

	minDate( dates : Date[] ) : Date {
		const arrNumber = dates.filter( Boolean ).map( d => d.getTime() );
		return new Date( Math.min( ... arrNumber ) );
	}

	maxDate( dates : Date[] ) : Date {
		const arrNumber = dates.filter( Boolean ).map( d => d.getTime() );
		return new Date( Math.max( ... arrNumber ) );
	}

	isSameDate( dateOne : Date , dateTwo : Date ) : boolean {
		return dateOne.toISOString() === dateTwo.toISOString();
	}

	isBeforeDate( dateOne : Date , dateTwo : Date ) : boolean {
		return dateOne < dateTwo;
	}

	isAfterDate( dateOne : Date , dateTwo : Date ) : boolean {
		return dateOne > dateTwo;
	}

	isBrowserTabFocused : () => boolean = () : boolean => !document.hidden;

	generateCode( length : number = 16 , dictionary : string = '' ) : string {
		const permittedChars : string       = dictionary || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ&';
		const permittedCharsLength : number = permittedChars.length;
		let result : string                 = '';
		const usedList : number[]           = [];
		for ( let i : number = 0 ; i < length ; i++ ) {
			let position : number = Math.floor( Math.random() * permittedCharsLength );
			if ( usedList.includes( position ) ) {
				while ( usedList.includes( position ) ) {
					position = Math.floor( Math.random() * permittedCharsLength );
				}
			}
			usedList.unshift( position );
			usedList.length = 5;
			result          = ''.concat( result , permittedChars[ position ] );
		}
		return result;
	}

	/**
	 * capitalizedString
	 * Uppercase first letter of the words
	 * */
	capitalizedString( data : string ) : string {
		return data[ 0 ].toUpperCase() + data.slice( 1 );
	}

	dateFormatWithTimeZone( date : Date | string , timeZone : string = 'Asia/Ho_Chi_Minh' ) : Date {
		return typeof date === 'string' ? new Date( new Date( date ).toLocaleString( 'en-US' , { timeZone } ) ) : new Date( date.toLocaleString( 'en-US' , { timeZone } ) );
	}

	/**
	 * convert variable from string to number safety
	 * @var str - input string
	 * @var _default - default result if conversion failed.
	 * */
	toNumber( str : string , _default : number = 0 ) : number {
		try {
			const num : number = parseInt( str , 10 );
			return !Number.isNaN( num ) ? num : _default;
		} catch ( e ) {
			return _default;
		}
	}

	createArray<T>( length : number , fill : T ) : T[] {
		return Array.from( { length } , ( _ : any ) : T => fill );
	}

	createNumberArray( length : number ) : number[] {
		return Array.from( { length } , ( _ : any , index : number ) : number => index );
	}

	formatVndCurrency( num : number ) : string {
		return num.toLocaleString( 'vi-VN' , { style : 'currency' , currency : 'VND' } );
	}

	formatVnNumber( num : number ) : string {
		return num.toLocaleString( 'vi-VN' );
	}

	/**
	 * reverseStrDateFormat
	 * reverse dd/mm/yyyy => yyyy/mm/dd
	 * reverse yyyy/mm/dd => dd/mm/yyyy
	 * */
	reverseStrDateFormat( input : string ) : string {
		return input ? input.replace( /[-_.]/g , '/' ).split( '/' ).reverse().join( '/' ) : '';
	}

	/*	base64ToFile ( base64 : string , fileName : string ) : File {
	 const bytes           = base64.split( ',' )[ 0 ].indexOf( 'base64' ) >= 0 ? atob( base64.split( ',' )[ 1 ] ) : ( <any> window ).unescape( base64.split( ',' )[ 1 ] );
	 const mime : string   = base64.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];
	 const max             = bytes.length;
	 const ia : Uint8Array = new Uint8Array( max );
	 for ( let i : number = 0 ; i < max ; i++ ) {
	 ia[ i ] = bytes.charCodeAt( i );
	 }
	 return new File( [ ia ] , fileName , { lastModified : new Date().getTime() , type : mime } );
	 }*/

	base64ToFile( base64 : string , fileName : string ) : File {
		const arr : string[]                      = base64.split( ',' );
		const mimeMatch : RegExpMatchArray | null = arr[ 0 ].match( /:(.*?);/ );
		const mime : string                       = mimeMatch ? mimeMatch[ 1 ] : 'application/octet-stream';
		const bstr : string                       = atob( arr[ 1 ] );
		let n : number                            = bstr.length;
		const u8arr                               = new Uint8Array( n );

		while ( n-- ) {
			u8arr[ n ] = bstr.charCodeAt( n );
		}
		return new File( [ u8arr ] , fileName , { lastModified : new Date().getTime() , type : mime } );
	}

	blobToFile( blob : Blob , fileName : string ) : File {
		return new File( [ blob ] , fileName , { lastModified : new Date().getTime() , type : blob.type } );
	}

	base64URLEncode( str : string ) : string {
		const utf8Arr : Uint8Array   = new TextEncoder().encode( str );
		const base64Encoded : string = btoa( String.fromCharCode( ... new Uint8Array( utf8Arr ) ) );
		return base64Encoded.replace( /\+/g , '-' ).replace( /\//g , '_' ).replace( /=+$/ , '' );
	}

	base64URLDecode( str : string ) : string {
		const base64Encoded : string     = str.replace( /-/g , '+' ).replace( /_/g , '/' );
		const padding : string           = str.length % 4 === 0 ? '' : '='.repeat( 4 - ( str.length % 4 ) );
		const base64WithPadding : string = base64Encoded + padding;
		return atob( base64WithPadding ).split( '' ).map( char => String.fromCharCode( char.charCodeAt( 0 ) ) ).join( '' );
	}

	matchSqlDateTime( str : string ) : boolean {
		return str ? /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z$/.test( str ) : false;
	}

	isSqlDateTime( str : string , strict : boolean = false ) : boolean {
		return str ? ( strict ? this.matchSqlDateTime( str ) : /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g.test( str ) ) : false;
	}

	formatSqlDateTime( str : string , format : string = 'dd/MM/YYYY hh:mm:ss' ) : string {
		return dayjs( str ).format( format );
	}

	toFixed( value : number , digits? : number ) : string {
		const precision : number = digits || 0;
		const power : number     = Math.pow( 10 , precision );
		const absValue : number  = Math.abs( Math.round( value * power ) );
		let result : string      = ( value < 0 ? '-' : '' ) + String( Math.floor( absValue / power ) );
		if ( precision > 0 ) {
			const fraction : string = String( absValue % power );
			const padding : string  = new Array( Math.max( precision - fraction.length , 0 ) + 1 ).join( '0' );
			result += '.' + padding + fraction;
		}
		return result;
	}

	wasMomentExpired( expired : Dayjs ) : boolean {
		return dayjs().isAfter( expired );
	}

	/**
	 * Remove one or more consecutive slashes at the end of a string.
	 * @param str input string.
	 * */
	removeSlashes( str : string ) : string {
		return str ? str.trim().replace( /\/+$/ , '' ) : '';
	}

	/**
	 * Remove one or more consecutive slashes at the end of a string.
	 * @param str input string.
	 * */
	removeLastSlashes( str : string ) : string {
		return str ? str.trim().replace( /\/+$/ , '' ) : '';
	}

	/**
	 * Copy all object’s attributes safety
	 * @param obj input need to be an Object Or array.
	 * */
	cloneObject<T>( obj : T ) : T {
		return typeof Is.object( obj ) || Is.array( obj ) ? JSON.parse( JSON.stringify( obj ) ) : obj;
	}

	/**
	 * Kiểm tra chuỗi có phải Base64 hợp lệ hay không
	 * */
	isBase64( str : string ) : boolean {
		const base64Regex = /^[A-Za-z0-9+/=]+$/;
		// Đảm bảo rằng độ dài của chuỗi là bội số của 4 và có đúng dấu "=" ở cuối nếu cần
		return base64Regex.test( str ) && str.length % 4 === 0;
	}

	/**
	 * Mã hóa chuỗi thành Base64
	 * @param str - string
	 * */
	encodeBase64( str : string ) : string {
		if ( isString( str ) ) {
			// Chuyển đổi chuỗi thành mảng các byte (UTF-8)
			const bytes : Uint8Array<ArrayBuffer> = new TextEncoder().encode( str );

			// Chuyển mảng byte thành chuỗi nhị phân (binary string)
			const binString : string = String.fromCodePoint( ... bytes );

			// Mã hóa sang Base64
			return btoa( binString );
		}
		throw new Error( 'input is not string' );
	}

	/**
	 * Giải mã Base64 về chuỗi ban đầu
	 * @param base64 - string
	 * */
	decodeBase64( base64 : string ) : string {
		if ( this.isBase64( base64 ) ) {
			// Giải mã Base64 thành chuỗi nhị phân
			const binString : string = atob( base64 );

			// Chuyển chuỗi nhị phân thành mảng các byte
			const bytes : Uint8Array<ArrayBuffer> = Uint8Array.from( binString , ( m : string ) : number => m.codePointAt( 0 ) );

			// Chuyển mảng byte về lại chuỗi Unicode
			return new TextDecoder().decode( bytes );
		}
		throw new Error( 'input is not base64 string' );
	}

	/**
	 * Cập nhật hoặc thêm một phần tử vào mảng.
	 *
	 * @template T - Kiểu phần tử trong mảng
	 * @param {Array<T>} list - Mảng gốc chứa các phần tử
	 * @param {T} item - Phần tử cần thêm hoặc cập nhật
	 * @param {keyof T} field - Trường dùng để kiểm tra trùng lặp
	 * @returns {Array<T>} - Trả về một mảng mới (deep clone) đã được cập nhật hoặc thêm
	 *
	 * ### Mô tả:
	 * 1. Tạo bản sao sâu (deep clone) của mảng gốc để tránh thay đổi dữ liệu ban đầu.
	 * 2. Tìm index của phần tử trong mảng dựa trên giá trị `field`.
	 * 3. Nếu tìm thấy:
	 *    - Cập nhật phần tử tại index đó bằng cách merge các trường từ `item`.
	 * 4. Nếu không tìm thấy:
	 *    - Thêm `item` vào cuối mảng.
	 * 5. Trả về mảng mới.
	 */
	upsertItem<T>( list : T[] , item : T , field : keyof T ) : T[] {
		const _deepClonedList : T[] = cloneDeep( list );
		const index : number        = _deepClonedList.findIndex( ( e : T ) : boolean => e[ field ] === item[ field ] );
		if ( index !== -1 ) {
			_deepClonedList[ index ] = { ... _deepClonedList[ index ] , ... item };
		} else {
			_deepClonedList.push( item );
		}
		return _deepClonedList;
	}

	/**
	 * Loại bỏ toàn bộ thẻ html và chỉ dữ lại phần text bên trong
	 *
	 * @param {String} value - Phần tử cần thêm hoặc cập nhật
	 * @returns {String} - Trả về phần text nguyên bản sau khi đã loại bỏ các thẻ html
	 *
	 */
	stripHtml( value : string ) : string {
		if ( !value ) return '';
		const div : HTMLDivElement = document.createElement( 'div' );
		div.innerHTML              = value;
		return div.textContent || div.innerText || '';
	}

	/**
	 * Convert Numeric -> Decimal (có validate)
	 */
	toDecimal( value : Numeric ) : Decimal {
		if ( value instanceof Decimal ) {
			return value;
		}

		if ( typeof value === 'number' ) {
			if ( !Number.isFinite( value ) ) {
				throw new TypeError( `Invalid number: ${ value }` );
			}
			return new Decimal( value );
		}

		if ( typeof value === 'string' ) {
			const normalized : string = value.trim().replace( /^\.-/ , '-' ) // ".-0.5" -> "-0.5"
			                                  .replace( /^\./ , '0.' ); // ".5" -> "0.5"

			if ( !/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test( normalized ) ) {
				throw new TypeError( `Invalid numeric string: ${ value }` );
			}

			return new Decimal( normalized );
		}

		throw new TypeError( `Unsupported type: ${ value }` );
	}

	/**
	 * Multiply multiple values with high precision using Decimal.
	 *
	 * @param values - List of values (number | string | Decimal)
	 * @returns Decimal
	 *
	 * @example
	 * multiply(2, '3', new Decimal(4)) => Decimal(24)
	 */
	multiply( ... values : readonly Numeric[] ) : Decimal {
		if ( values.length === 0 ) {
			return new Decimal( 0 );
		}
		return values.reduce<Decimal>( ( accumulator : Decimal , currentValue : Numeric ) => {
			const decimalValue = this.toDecimal( currentValue );
			return accumulator.mul( decimalValue );
		} , new Decimal( 1 ) );
	}

	/**
	 * Multiply multiple values with high precision using Decimal. The result is a number.
	 *
	 * @param values - List of values (number | string | Decimal)
	 * @returns number
	 */
	multiplyToNumber( ... values : readonly Numeric[] ) : number {
		return this.multiply( ... values ).toNumber();
	}

	/**
	 * Adds multiple values with high precision using Decimal.
	 *
	 * @param values - List of values (number | string | Decimal)
	 * @returns Decimal
	 *
	 * @example
	 * add(2, '3', new Decimal(4)) => Decimal(9)
	 */
	add( ... values : readonly Numeric[] ) : Decimal {
		if ( values.length === 0 ) {
			return new Decimal( 0 );
		}

		return values.reduce<Decimal>( ( accumulator : Decimal , currentValue : Numeric ) => {
			const decimalValue = this.toDecimal( currentValue );
			return accumulator.add( decimalValue );
		} , new Decimal( 0 ) );
	}

	/**
	 * Adds multiple values with high precision using Decimal. The result is a number.
	 *
	 * @param values - List of values (number | string | Decimal)
	 * @returns Number
	 *
	 */
	addToNumber( ... values : readonly Numeric[] ) : number {
		return this.add( ... values ).toNumber();
	}
}

export const Helper : HelperClass = Object.freeze<HelperClass>( new HelperClass() );

export const paramsConditionBuilder : ( conditions : IctuConditionParam[] , params? : HttpParams | null ) => HttpParams = ( conditions : IctuConditionParam[] , params : HttpParams | null = null ) : HttpParams => {
	const initHttpParams : HttpParams = params || new HttpParams();
	return conditions.reduce( ( httpParams : HttpParams , condition : IctuConditionParam , i : number ) : HttpParams => {
		const key : string   = 'condition[' + i + '][key]';
		const value : string = 'condition[' + i + '][value]';
		httpParams           = httpParams.append( key , condition.conditionName || '' );
		httpParams           = httpParams.append( value , condition.value || '' );
		if ( condition[ 'condition' ] ) {
			const compare : string = 'condition[' + i + '][compare]';
			httpParams             = httpParams.append( compare , condition.condition || '' );
		}
		if ( condition[ 'orWhere' ] ) {
			const type : string = 'condition[' + i + '][type]';
			httpParams          = httpParams.append( type , condition[ 'orWhere' ] );
		}
		return httpParams;
	} , initHttpParams );
};

export const paramsBuilder : ( params : { [ T : string ] : string | number | boolean } ) => HttpParams = ( params : {
	[ T : string ] : string | number | boolean
} ) : HttpParams => {
	let httpParams : HttpParams = new HttpParams();
	const prmNames : string[]   = params ? Object.keys( params ) : [];
	if ( prmNames.length ) {
		prmNames.forEach( ( k : string ) : any => httpParams = httpParams.set( k , params[ k ] ) );
	}
	return httpParams;
};

export const parseArgs : <T>( input : Partial<T> , _default : T ) => T = <T>( input : Partial<T> , _default : Partial<T> ) : T => Object.assign( _default , input ) as T;

function valueChangesOperator<T>( dueTime : number = 500 ) : MonoTypeOperatorFunction<T> {
	return pipe( debounceTime( dueTime ) , distinctUntilChanged() );
}

export const appendElementStyle : ( element : HTMLElement , styles : Partial<CSSStyleDeclaration> ) => HTMLElement = ( element : HTMLElement , styles : Partial<CSSStyleDeclaration> ) : HTMLElement => {
	Object.assign( element.style , styles );
	return element;
};
declare var window : any;

export const linkStaticResource : ( path : string ) => string = ( path : string ) : string => {
	// const parsedUrl = new URL( window.location.href );
	return window.location.origin + '/' + path;
};

export const staticResource : ( path : string ) => Signal<string> = ( path : string ) : Signal<string> => {
	return signal<string>( linkStaticResource( path ) );
};

const writeToClipboard : ( userText : string ) => Promise<void> = async ( userText : string ) : Promise<boolean | any> => {
	try {
		await navigator.clipboard.writeText( userText );
		return true;
	} catch ( error ) {
		return error;
	}
};

const readFromClipboard : () => Promise<string | any> = async () : Promise<string | any> => {
	try {
		return await navigator.clipboard.readText();
	} catch ( error ) {
		return error;
	}
};

/**************************************************************
 * format bytes
 * @param bytes (File size in bytes)
 * @param decimals (Decimals point)
 *************************************************************/
export function formatBytes( bytes : number , decimals : number = 2 ) : string {
	if ( !bytes || bytes === 0 ) {
		return '0 Bytes';
	}
	const k                = 1024;
	const dm : number      = decimals <= 0 ? 0 : decimals;
	const sizes : string[] = [ 'Bytes' , 'KB' , 'MB' , 'GB' , 'TB' , 'PB' , 'EB' , 'ZB' , 'YB' ];
	const i : number       = Math.floor( Math.log( bytes ) / Math.log( k ) );
	return parseFloat( ( bytes / Math.pow( k , i ) ).toFixed( dm ) ) + ' ' + sizes[ i ];
}

export const getMonthRange : ( day : Date ) => [ Date , Date ] = ( day : Date ) : [ Date , Date ] => {
	const firstDay : Date = dayjs( day ).startOf( 'month' ).toDate();
	const lastDay : Date  = dayjs( day ).endOf( 'month' ).toDate();
	return [ firstDay , lastDay ];
};

export function formatMenuName( title : string , depth : number ) : string {
	return depth > 0 ? `${ '— '.repeat( depth ) }${ title }` : title;
}

export function sortMenus<T extends { id : number; parent_id : number; title : string }>( items : T[] ) : T[] {
	const children : Map<number , T[]> = new Map<number , T[]>();
	for ( const item of items ) {
		const group : T[] = children.get( item.parent_id ) || [];
		group.push( item );
		children.set( item.parent_id , group );
	}
	const result : T[] = [];
	const visited : Set<number> = new Set<number>();
	const visit = ( parentId : number ) : void => {
		const group : T[] = children.get( parentId ) || [];
		group.sort( ( a : T , b : T ) : number => a.title.localeCompare( b.title , 'vi' ) );
		for ( const item of group ) {
			if ( visited.has( item.id ) ) continue;
			visited.add( item.id );
			result.push( item );
			visit( item.id );
		}
	};
	visit( 0 );
	for ( const item of items ) {
		if ( !visited.has( item.id ) ) {
			visited.add( item.id );
			result.push( item );
			visit( item.id );
		}
	}
	return result;
}
