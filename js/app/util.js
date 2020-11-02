
// -------------------------------------------
// -- Utility Class/Methods

function Util() {}

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
