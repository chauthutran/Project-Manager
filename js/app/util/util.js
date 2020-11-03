
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

/** 
 * Get a column of table by column index. The index starts from 1 **/
Util.getTableColumnByIdx = function( rowTag, colIdx )
{
	return rowTag.find("td:nth-child('" + colIdx + "')");
}

Util.setTableColumnValue = function( rowTag, colIdx, value )
{
	Util.getTableColumnByIdx( rowTag, colIdx, value );
}

Util.findItemFromList = function( list, value, propertyName )
{
	var item;

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

	return item;
};



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
