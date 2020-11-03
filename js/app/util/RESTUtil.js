
function RESTUtil() {}

RESTUtil.API_BASED_URL = "../../../api/";

RESTUtil.retrieveData = function( url, actionSuccess, actionError, loadingStart, loadingEnd ) 
{
	return $.ajax({
		type: "GET"
		,dataType: "json"
		,url: url
		,async: true
		,success: actionSuccess
		,error: actionError
		,beforeSend: function( xhr ) {
			if ( loadingStart !== undefined ) loadingStart();
		}
	})
	.always( function( data ) {
		if ( loadingEnd !== undefined ) loadingEnd();
	});
}



RESTUtil.submitData = function( submitType, jsonData, url, actionSuccess, actionError, loadingStart, loadingEnd )
{			
	$.ajax({
		type: submitType
		,url: url
		,data: JSON.stringify( jsonData )
		,datatype: "json"
		,contentType: "application/json; charset=utf-8"
		,async: true
		,success: actionSuccess
		,error: actionError		
		,beforeSend: function( xhr ) {
			if ( loadingStart !== undefined ) loadingStart();
		}
	})
	.done( function( data ) {
		if ( loadingEnd !== undefined ) loadingEnd();
	});
}

