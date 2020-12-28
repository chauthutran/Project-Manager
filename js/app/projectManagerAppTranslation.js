
function ProjectManagerAppTranslation( _exeFunc )
{
	var me = this;
	me.exeFunc = _exeFunc;


	// -----------------------------------------------------------------------------------------------------------------------------------
	// IDs
      
	me.ID_OPTIONSET_TERMS = "wvmkakUiSin";

	me.ID_OPTIONSET_COUNTRIES_GRANTS_BILATERAL_ENTITIES = "JYxH2FHaiX0";
	me.ID_OPTIONSET_COUNTRIES_INT_FOUNDATION_NGO = "Q7z8N3vInmO";
	me.ID_OPTIONSET_COUNTRIES_MULTILATERIAL_ENTITIES = "Lmdrr8Nt9Yb";
	me.ID_OPTIONSET_CURRENCY = "NKBEx7GtFJK";
	me.ID_OPTIONSET_IMPL_STRATEGIES = "SU52yMajLXm";
	me.ID_OPTIONSET_TARGET_POPULATIONS = "e3RJ6M8qB1h";



	// -----------------------------------------------------------------------------------------------------------------------------------
	// URL Queries

  	me.OPTION_SET_QUERY_URL = RESTUtil.API_BASED_URL + "optionSets.json?filter=id:in:[" + me.ID_OPTIONSET_COUNTRIES_GRANTS_BILATERAL_ENTITIES 
					+ "," + me.ID_OPTIONSET_COUNTRIES_INT_FOUNDATION_NGO
					+ "," + me.ID_OPTIONSET_COUNTRIES_MULTILATERIAL_ENTITIES 
					+ "," + me.ID_OPTIONSET_IMPL_STRATEGIES 
					+ "," + me.ID_OPTIONSET_TARGET_POPULATIONS 
					+ "," + me.ID_OPTIONSET_CURRENCY 
					+ "," + me.ID_OPTIONSET_TERMS
					+ "]&fields=options[code,displayName]&paging=false";



	me.OPTIONSET_KEY = "OPTIONSET";

	me.tableTag = $("body");


	// ----------------------------------------------------------------------------------------------
	// Init method

	me.init = function()
	{
		me.translateOptionSetList();
	}

	// ----------------------------------------------------------------------------------------------
	// Supportive methods

	me.translateOptionSetList = function()
	{
		var url = me.OPTION_SET_QUERY_URL;
		me.loadMetadata( url, function( response ){

			var optionSets = response.optionSets;
			for( var i in optionSets )
			{
				var options = optionSets[i].options;
				for( var j in options )
				{
					var option = options[j];
					var value = me.getTransValue ( me.OPTIONSET_KEY, option );
					me.tableTag.find("[keyword='opt_c:" + option.code + "']").html( value );
					me.tableTag.find("[keyword-placeholder='opt_c:" + option.code + "']").attr( "placeholder", value );

					ProjectManagerAppTranslation.KEYWORDS[option.code] = option.displayName;
				}
			}
			
			me.exeFunc();
		} );

	}

	me.loadMetadata = function( url, exeFunc )
	{ 
          $.ajax({
			type: "GET"
			,url: url
			,contentType: "application/json;charset=utf-8"
			,beforeSend: function( xhr ) 
			{
				//me.hideReportTag();
			}
			,success: function( response ) 
			{		
				exeFunc( response );
			}
			,error: function(response)
			{
				// me.showReportTag();
			}
		  }).always( function( data ) 
		  {
            // me.showReportTag();
          });

    }
	
	me.getTransValue = function( key, data )
	{
        if( key == me.OPTIONSET_KEY )
		{ 
			return data.displayName;
		}
	}


	// ----------------------------------------------------------------------------------------------
	// init

	me.init();

}


// {"<option_code>" : "<option_displayName>" }
ProjectManagerAppTranslation.KEYWORDS = {};

ProjectManagerAppTranslation.translate = function( keyword, defaultValue )
{
	var value = ProjectManagerAppTranslation.KEYWORDS[keyword];

	return (value) ? value : defaultValue;
}