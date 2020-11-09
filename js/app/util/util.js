
// -------------------------------------------
// -- Utility Class/Methods

function Util() {}


Util.setDisable = function( elementTag )
{
	elementTag.attr("disabled","true");
}

Util.setEnable = function( elementTag )
{
	elementTag.removeAttr("disabled");
}

/** For TABLE */
/** 
 * Get a column of table by column index. The index starts from 1 **/
Util.getTableColumnByIdx = function( rowTag, colIdx )
{
	return rowTag.find("td:nth-child(" + colIdx + ")");
}

Util.setTableColumnValue = function( rowTag, colIdx, value )
{
	Util.getTableColumnByIdx( rowTag, colIdx).html( value );
}

// -------------------------------------------------------------------------------------------------------
/**  For  Array */
Util.findItemFromList = function( list, value, propertyName )
{
	var item;

	if( list )
	{
		// If propertyName being compare to has not been passed, set it as 'id'.
		if ( propertyName === undefined )
		{
			propertyName = "id";
		}

		for( i = 0; i < list.length; i++ )
		{
			var listItem = list[i];

			if ( listItem[propertyName] == value )
			{
				item = listItem;
				break;
			}
		}
	}

	return item;
};


Util.sortByKey = function( array, key, noCase, order, emptyStringLast ) {
	return array.sort( function( a, b ) {
		
		var x = a[key]; 
		var y = b[key];

		if ( x === undefined ) x = "";
		if ( y === undefined ) y = "";

		if ( noCase !== undefined && noCase )
		{
			x = x.toLowerCase();
			y = y.toLowerCase();
		}

		if ( emptyStringLast !== undefined && emptyStringLast && ( x == "" || y == "" ) ) 
		{
			if ( x == "" && y == "" ) return 0;
			else if ( x == "" ) return 1;
			else if ( y == "" ) return -1;
		}
		else
		{
			if ( order === undefined )
			{
				return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
			}
			else
			{
				if ( order == "Acending" ) return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
				else if ( order == "Decending" ) return ( ( x > y ) ? -1 : ( ( x < y ) ? 1 : 0 ) );
			}
		}
	});
};

Util.removeFromArray = function( list, propertyName, value )
{
	var index;

	if( list )
	{
		$.each( list, function( i, item )
		{
			if ( item[ propertyName ] == value ) 
			{
				index = i;
				return false;
			}
		});
	
		if ( index !== undefined ) 
		{
			list.splice( index, 1 );
		}
	}
	

	return index;
};


// -----------------------------------------------------------------------------------------------------------
// For DIALOG

Util.setupDialogForm = function( title, dialogDivTag, width, height )
{
	dialogDivTag.dialog({
		title: title
		,autoOpen: false
		,width: width
		,height: height
		,modal: true
	});
}
