
function CatOptionDetailsForm( _metaData, _catOptionDetailsData )
{
    var me = this;
    
    me.metaData = _metaData;
    me.catOptionData = _catOptionDetailsData;

	me.CATEGORY_OPTION_URL = "../api/categoryOptions/";

    me.catOptDetailsDivTag = $("#catOptDetailsDiv");
	me.nameTag =  me.catOptsDetailsDivTag.find("#name");
	me.shortNameTag =  me.catOptsDetailsDivTag.find("#shortName");
	me.codeTag =  me.catOptsDetailsDivTag.find("#code");
	me.startDateTag =  me.catOptsDetailsDivTag.find("#startDate");
	me.endDateTag =  me.catOptsDetailsDivTag.find("#endDate");
	me.onGoingTag =  me.catOptsDetailsDivTag.find("#onGoing");

	me.projectTypeTag =  me.catOptsDetailsDivTag.find("#projectType");
	me.projectTypeOptionDivTag = $("#projectTypeOptionDiv");
	me.implStategiesTbTag =  me.catOptsDetailsDivTag.find("#implStategies");
	me.targetPopulationsTbTag =  me.catOptsDetailsDivTag.find("#targetPopulations");

	me.editBtnTag =  me.catOptsDetailsDivTag.find("#editBtn");
    me.saveBtnTag =  me.catOptsDetailsDivTag.find("#saveBtn");
    me.cancelBtnTag = me.catOptsDetailsDivTag.find("#cancelBtn");

	// For implStrategies Dialog
	me.implStrategiesShowDialogBtnTag =  me.catOptsDetailsDivTag.find("#implStrategiesShowDialogBtn");
	me.searchImplStrategiesDialogDivTag =  me.catOptsDetailsDivTag.find("#searchImplStrategiesDialogDiv");
	me.implStrategiesGroupTag =  me.catOptsDetailsDivTag.find("#implStrategiesGroup");
	me.implStrategiesOOptionTag =  me.catOptsDetailsDivTag.find("#implStrategiesOOption");
	me.addImplStrategiesBtnTag =  me.catOptsDetailsDivTag.find("#addImplStrategiesBtn");
	me.closeImplStrategiesBtnTag =  me.catOptsDetailsDivTag.find("#closeImplStrategiesBtn");

	// For Target Populations Dialog
	me.targetPopulationsShowDialogBtnTag =  me.catOptsDetailsDivTag.find("#targetPopulationsShowDialogBtn");
	me.searchTargetPopulationsDialogDivTag =  me.catOptsDetailsDivTag.find("#searchTargetPopulationsDialogDiv");
	me.targetPopulationsOOptionTag =  me.catOptsDetailsDivTag.find("#targetPopulationsOOption");
	me.addTargetPopulationsBtnTag =  me.catOptsDetailsDivTag.find("#addTargetPopulationsBtn");
	me.closeTargetPopulationsBtnTag =  me.catOptsDetailsDivTag.find("#closeTargetPopulationsBtn");


	me.catOptionTag = $("#category-OPZj38sNHhm");c// me.catOptionData.id


	me.implStrategiesOptSetId = "SU52yMajLXm";
	me.targetPopulationsOptSetId = "e3RJ6M8qB1h";

	me.projectTypesAttrId = "xxx";
	me.implStategiesAttrId = "kKB7KCMbSxR";
	me.targetPopulationsAttrId = "JEjwUg7H3Vs";

	me.catOptionData;
	me.implStategiesList;
	me.targetPopulationsList;
	me.projectTypeList;

	me.catOptionloaded = false;
	me.optionSetsloaded = false;
	me.projectTypesloaded = false;


	me.init = function()
	{
        me.initilizeForm();
        me.populateCatOptionDetails();

		me.saveBtnTag.hide();

        
        me.setup_Events_ImpStrategies();
        me.setup_Events_TargetPopulations();
        me.setup_Events_CatOptionDetails();
        
		Util.setupDialogForm( "Implement Strategies", me.searchImplStrategiesDialogDivTag, 500, 410 );
        Util.setupDialogForm( "Target Populations", me.searchTargetPopulationsDialogDivTag, 350, 320 );
        
        
        me.disableForm();
	}

	me.checkMadatoryField = function()
	{
		var flag = true;
		 me.catOptsDetailsDivTag.find("input[mandatory],select[mandatory]").each( function(){
			if( $(this).val() == "" )
			{
				$(this).parent().append("<span class='error'>Please enter value for this field</span>");
				flag = false;
			}
			else
			{
				$(this).parent().find("span.error").remove();
			}
		});

		return flag;
	}

	// ----------------------------------------------------------------------------------------------
    // init form, set up meta data for Main Form and for DIALOG

    me.initilizeForm = function()
    {
        me.projectTypes_PopulateRadios();

        // Populate data for impStrategiesDialog
        me.impStrategiesDialog_PopulateCheckBoxes(  me.metaData["optionSets"] );

         // Populate data for targetPopulationsDialog
        me.targetPopulationsDialog_PopulateCheckboxes( me.metaData["optionSets"] );
    }
    

	// ----------------------------------------------------------------------------------------------
    // Set up events
    
    me.setup_Events = function()
    {
        me.setup_Events_CatOptionDetails();
        me.setup_Events_ImpStrategies();
        me.setup_Events_TargetPopulations();
    }

	me.setup_Events_CatOptionDetails = function()
	{
		// Set date picker for DATE fields
		DateUtil.setDateRageFields( me.startDateTag, me.endDateTag );

		// Edit form button
		me.editBtnTag.click( function(){
			
			me.enableForm();

			if( me.onGoingTag.prop("checked") )
			{
				Util.setDisable( me.endDateTag );
			}
		});

		// Save form button
		me.saveBtnTag.click( function(){
			if( me.checkMadatoryField() )
			{
				me.saveCatOptionData();
			}
		});

        me.cancelBtnTag.click(function(){
            Util.disableForm();
        })
		// OnGoing checkbox
		me.onGoingTag.click( function(){
			if( $(this).prop("checked") )
			{
				Util.setDisable( me.endDateTag );
				me.endDateTag.val("");
			}
			else
			{
				Util.setEnable( me.endDateTag );
			}
		});
	}

	me.setup_Events_ImpStrategies = function()
	{
		// ------------------------------------------------------------------------------------------
		// Show dialog form
		me.implStrategiesShowDialogBtnTag.click( function(){
			
			// Reset Dialog
			me.impStrategiesDialog_ResetForm();

			// Set "logicHide" for selected options
			me.impStrategiesDialog_SetLogicHideAttr();

			// Hide Group options if all options are in the selected list
			me.impStrategiesDialog_CheckToHideGroupOptions();

			// Close Dialog
			me.searchImplStrategiesDialogDivTag.dialog( "open" );
		});

		me.implStrategiesGroupTag.change( function(){
			me.implStrategiesOOptionTag.find("div.option").hide();
			me.implStrategiesOOptionTag.find("div.option input").prop("checked", false);

			if( $(this).val() != "" )
			{
				me.implStrategiesOOptionTag.find("div[code^='" + $(this).val() + "']").show();
				me.implStrategiesOOptionTag.find("div[logicHide]").hide();
			}

		});

		me.addImplStrategiesBtnTag.click( function(){
			var selectedOptions = me.implStrategiesOOptionTag.find("input:checked");
			for( var i=0; i<selectedOptions.length; i++ )
			{
				var option = $(selectedOptions[i])
				var optionData = Util.findItemFromList( me.implStategiesList, option.val(), "code" );
			
				// Create option button in list
				me.createOptionBtn( me.implStategiesTbTag , optionData, true );
				
				// Hide the option in selector in Dialog
				me.implStrategiesOOptionTag.find("option[value='" + optionData.code + "']").hide();

				// Check if we need to hide the Group selector in Dialog
				var groupCode = optionData.code.split(".")[0];
				var noGroupOptionVisible = me.implStrategiesOOptionTag.find("div.option input[value^='" + groupCode + "']:checked").length;
				if( noGroupOptionVisible == 0 )
				{
					me.implStrategiesGroupTag.find("option[value='" + groupCode + "']").hide();
				}
			}

			me.searchImplStrategiesDialogDivTag.dialog( "close" );
		});

		me.closeImplStrategiesBtnTag.click( function(){
			me.searchImplStrategiesDialogDivTag.dialog( "close" );
		});


		me.implStategiesTbTag.find("button").each( function(){
			var buttonTag = $(this);
			buttonTag.click( function(){
				var dataValue = buttonTag[0].innerText;
				var ok = confirm("Are you sure you want to delete '" + dataValue + "' ?");
				if( ok )
				{
					buttonTag.remove();
				}
			})
		});

	}
	
	me.setup_Events_TargetPopulations = function()
	{
		// ----------------------------------------------------------------------------------------------
		// For impl Strategies
		
		me.targetPopulationsShowDialogBtnTag.click( function(){
			// Reset Dialog
			me.targetPopulationsDialog_ResetForm();

			// Hide for selected options
			me.targetPopulationsDialog_HideSelectedOption();

			// Open Dialog
			me.searchTargetPopulationsDialogDivTag.dialog( "open" );
		});

		me.addTargetPopulationsBtnTag.click( function(){
			var selectedOptions = me.targetPopulationsOOptionTag.find("input:checked");
			for( var i=0; i<selectedOptions.length; i++ )
			{
				var option = $(selectedOptions[i])
				var optionData = Util.findItemFromList( me.targetPopulationsList, option.val(), "code" );
			
				// Create option button in list
				me.createOptionBtn( me.targetPopulationsTbTag , optionData, false );
				
				// Hide the option in selector in Dialog
				me.targetPopulationsOOptionTag.find("option[value='" + optionData.code + "']").hide();
			}

			me.searchTargetPopulationsDialogDivTag.dialog( "close" );
		});

		me.closeTargetPopulationsBtnTag.click( function(){
			me.searchTargetPopulationsDialogDivTag.dialog( "close" );
		});


		me.targetPopulationsTbTag.find("button").each( function(){
			var buttonTag = $(this);
			buttonTag.click( function(){
				var dataValue = buttonTag[0].innerText;
				var ok = confirm("Are you sure you want to delete '" + dataValue + "' ?");
				if( ok )
				{
					buttonTag.remove();
				}
			})
		});

	}


	// ----------------------------------------------------------------------------------------------
    // For Project Types
    

	// Populate radios for "ProjectTypes"
	me.projectTypes_PopulateRadios = function()
	{
        me.projectTypeList = me.metaData["projectType"];
        for( var i in me.projectTypeList )
        {
            var catOptionGroup = me.projectTypeList[i];
            var radioTag = me.createRadioOpt( catOptionGroup, response.id );
            me.projectTypeOptionDivTag.append( radioTag );

            // Fill selected value for INPUT of Project Type when a radio input is checked
            radioTag.find("input").click( function(){
                if( $(this).prop("checked") )
                {
                    me.projectTypeTag.val( radioTag.closest("div.option").find("label").html() );
                }
            })
        }
	}


	// ----------------------------------------------------------------------------------------------
    // Populate catOption details data
    

    // Populate data for "Project Details" part
	me.populateCatOptionDetails = function()
	{
        me.nameTag.val( me.catOptionData.name );
        me.shortNameTag.val( me.catOptionData.shortName );
        me.codeTag.val( me.catOptionData.code );

        if( me.catOptionData.startDate )
        {
            var displayStartDate = DateUtil.converToDisplayDate( me.catOptionData.startDate );
            me.startDateTag.val( displayStartDate );
        }

        if( me.catOptionData.endDate )
        {
            var displayEndDate = DateUtil.converToDisplayDate( me.catOptionData.endDate );
            me.endDateTag.val( displayEndDate );

            me.onGoingTag.prop("checked", false);
            Util.setEnable( me.endDateTag );
        }
        else
        {
            me.onGoingTag.prop("checked", true);
            Util.setDisable( me.endDateTag );
        }

        // Populate attribute values
        me.populateAttrValues( me.catOptionData.attributeValues );

	}

    // Populate 
	me.populateAttrValues = function( attributeValues )
	{
		for( var i in attributeValues )
		{
			var attrValue = attributeValues[i];
			var attrId = attrValue.attribute.id;
			var value = attrValue.value;

			var valueList = value.split(",");
			if( attrId == me.implStategiesAttrId )
			{
				me.populateAttrValues_ImpStrategies( valueList );
			}
			else if( attrId == me.targetPopulationsAttrId )
			{
				me.populateAttrValues_TargetPopulations( valueList );
			}
			else if( attrId == me.projectTypesAttrId )
			{
				me.populateAttrValues_ProjectType( value )
			}
		}
	}

	me.populateAttrValues_ImpStrategies = function( valueList )
	{
		for( var j in valueList )
		{
			var optionData = Util.findItemFromList( me.implStategiesList, valueList[j], "code" );
			me.createOptionBtn( me.implStategiesTbTag , optionData, true );
		}
	}

	me.populateAttrValues_TargetPopulations = function( valueList )
	{
		for( var j in valueList )
		{
			var optionData = Util.findItemFromList( me.targetPopulationsList, valueList[j], "code" );
			me.createOptionBtn( me.targetPopulationsTbTag , optionData, false );
		}
	}

	me.populateAttrValues_ProjectType = function( value )
	{
		var catOptionData = Util.findItemFromList( me.projectTypeList, value, "id" );
		me.projectTypeOptionDivTag.find("input").prop("checked", false );

		if( catOptionData )
		{
			me.projectTypeTag.val( catOptionData.displayName );
			me.projectTypeOptionDivTag.find("input[value='" + value + "']").prop("checked", true );
		}
		else
		{
			me.projectTypeTag.val("");
		}
	}
	

	// ----------------------------------------------------------------------------------------------
	// For saving data

	me.saveCatOptionData = function()
	{
		var jsonData = me.generateJsonData();
		var url = me.CATEGORY_OPTION_URL + me.catOptionTag.val(); //

		RESTUtil.submitData( url, "PUT", jsonData, function(){ // actionSuccess

			me.catOptionData = jsonData;

			me.disableForm();

			alert("Save data successfully !");

		}, function(){ // actionError

			alert("There is some issue while saving data here.");
		});
	}
	

	// ----------------------------------------------------------------------------------------------
	// For impStrategiesDialog
	
	me.impStrategiesDialog_ResetForm = function()
	{
		me.implStrategiesGroupTag.val("");
		me.implStrategiesOOptionTag.find("div.option").hide();
		me.implStrategiesOOptionTag.find("div.option input").prop("checked", false);
	}

	me.impStrategiesDialog_SetLogicHideAttr = function()
	{
		me.implStategiesTbTag.find("button").each( function(){
			var code = $(this).attr("code");
			me.implStrategiesOOptionTag.find("div[code='" + code + "']").attr("logicHide", true);
		});
	}

	me.impStrategiesDialog_CheckToHideGroupOptions = function()
	{
		me.implStrategiesGroupTag.find("option[value!='']").each( function(){
			var groupCode = $(this).val();
			var selectedNo = me.implStategiesTbTag.find("button[code^='" + groupCode + "']").length;
			var optionNo = me.implStrategiesOOptionTag.find("div.option[code^='" + groupCode + "']").length;

			if( selectedNo != 0 && selectedNo == optionNo )
			{
				$(this).hide();
			}
			else
			{
				$(this).show();
			}
		});
	}

	me.impStrategiesDialog_PopulateCheckBoxes = function( optionSets )
	{
		for( var i in optionSets )
		{
			var optionSet = optionSets[i];
			if( optionSet.id == me.implStrategiesOptSetId )
			{
				var options = optionSet.options;
				me.implStategiesList = options;

				var groupCodes = [];
				for( var i in options )
				{
					var option = options[i];
					var groupCode = option.code.split(".")[0];
					if( groupCodes.indexOf( groupCode ) < 0 )
					{
						me.implStrategiesGroupTag.append("<option value='" + groupCode + "'>" + groupCode + "</option>");
						groupCodes.push( groupCode );
					}

					var checkboxTag = me.createCheckBoxOption( option );
					me.implStrategiesOOptionTag.append( checkboxTag );
				}

				me.implStrategiesOOptionTag.find("div.option").hide();

				return;
			}
		}
	}

	// ----------------------------------------------------------------------------------------------
	// For targetPopulationsDialog

	me.targetPopulationsDialog_ResetForm = function()
	{
		me.targetPopulationsOOptionTag.find("div.option input").prop("checked", false);

	}

	me.targetPopulationsDialog_HideSelectedOption = function()
	{
		me.targetPopulationsTbTag.find("button").each( function(){
			var code = $(this).attr("code");
			me.targetPopulationsOOptionTag.find("div[code='" + code + "']").hide();
		});
	}

	me.targetPopulationsDialog_PopulateCheckboxes = function( optionSets )
	{
		for( var i in optionSets )
		{
			var optionSet = optionSets[i];
			if( optionSet.id == me.targetPopulationsOptSetId )
			{
				var options = optionSet.options;
				me.targetPopulationsList = options;

				for( var i in options )
				{
					var option = options[i];
					var checkboxTag = me.createCheckBoxOption( option );
					me.targetPopulationsOOptionTag.append( checkboxTag );
				}

				return;
			}
		}
	}
    

	// ----------------------------------------------------------------------------------------------
	// Supportive methods

	me.generateJsonData = function()
	{
		var jsonData = JSON.parse( JSON.stringify( me.catOptionData ) );
		jsonData.name = me.nameTag.val();
		jsonData.shortName = me.shortNameTag.val();
		jsonData.code = me.codeTag.val();

		// Start date
		if( me.startDateTag.val() != "" )
		{
			jsonData.startDate = DateUtil.converToDbDate( me.startDateTag.val() );
		}
		else
		{
			delete jsonData.startDate;
		}
		
		// End date
		if( !me.onGoingTag.prop("checked") && me.endDateTag.val() != "" )
		{
			jsonData.endDate = DateUtil.converToDbDate( me.endDateTag.val() );
		}
		else
		{
			delete jsonData.endDate;
		}



		// Get data for Implement and TargerPopulations
		var attributeValues = JSON.parse( JSON.stringify( jsonData.attributeValues ) );
		jsonData.attributeValues = [];


		// -----------------------------------------------------------------------------------------------------
		// Get attribute values of Implement Strategies
		var codeList = [];
		me.implStategiesTbTag.find("button").each( function(){
			codeList.push( $(this).attr("code") );
		});

		if( codeList != "" )
		{
			var attrValue = { "attribute": { "id" : me.implStategiesAttrId }, "value" : codeList.join(",") };
			jsonData.attributeValues.push( attrValue );
		}	


		// -----------------------------------------------------------------------------------------------------
		// Get attribute values of Target Populations
		codeList = [];
		me.targetPopulationsTbTag.find("button").each( function(){
			codeList.push( $(this).attr("code") );
		});

		if( codeList != "" )
		{
			var attrValue = { "attribute": { "id" : me.targetPopulationsAttrId }, "value" : codeList.join(",") };
			jsonData.attributeValues.push( attrValue );
		}	


		// // -----------------------------------------------------------------------------------------------------
		// // Get ProjectType
		// if( me.projectTypeTag.val() != "" )
		// {
		// 	var attrValue = { "attribute": { "id" : me.projectTypesAttrId }, "value" : me.projectTypeOptionDivTag.find("radio:checked").val() };
		// 	jsonData.attributeValues.push( attrValue );
		// }


		return jsonData;

	}

	me.createOptionBtn = function( table, optionData, isAddRow )
	{
		if( optionData )
		{
			var buttonTag = $("<button class='btn btn-default' code='" + optionData.code + "'>" + optionData.code + " " + optionData.displayName + " <i class='fa fa-close' style='float: right;'></i></button>");

			if( isAddRow )
			{
				var rowTag = $("<tr></tr>");
				var colTag = $("<td></td>");
				colTag.append( buttonTag );
				rowTag.append( colTag );
				table.find("tbody").append( rowTag );
			}
			else
			{
				table.find("tbody td:first").append( buttonTag );
			}
		}
	}

	me.createRadioOpt = function( optionData, radioOptName )
	{
		var divTag = $("<div class='option radio'></div>");

		var inputTag = $("<input type='radio' value='" + optionData.id + "'  id='" + optionData.id + "' name='" + radioOptName + "'> ");
    	var labelTag = $("<label style='color: black;' for='" + optionData.id + "'>" + optionData.displayName + "</label>" );
		
		divTag.append( inputTag );
		divTag.append( labelTag );

		return divTag;
	}

	me.createCheckBoxOption = function( optionData )
	{
		var divTag = $("<div class='option checkbox' code='" + optionData.code + "'></div>");

		var id = optionData.code.split(".").join("_"); // Used to set events when we click on lables, input fields will be checked / unchecked
		var inputTag = $("<input type='checkbox' value='" + optionData.code + "'  id='" + id + "' > ");
    	var labelTag = $("<label for='" + id + "'>" + optionData.displayName + "</label>" );
		
		divTag.append( inputTag );
		divTag.append( labelTag );

		return divTag;
	}
	
	me.disableForm = function()
	{
		 me.catOptsDetailsDivTag.find("input,select, button").attr("disabled", "disabled");
		me.projectTypeOptionDivTag.hide();
		me.implStrategiesShowDialogBtnTag.hide();
		me.targetPopulationsShowDialogBtnTag.hide();

		me.editBtnTag.removeAttr("disabled");
		me.projectTypeTag.show();
		me.editBtnTag.show();
		me.saveBtnTag.hide();
	}
	
	me.enableForm = function()
	{
		 me.catOptsDetailsDivTag.find("input,select,button").removeAttr("disabled" );
		me.projectTypeTag.hide();
		me.editBtnTag.hide();

		me.projectTypeOptionDivTag.show();
		me.implStrategiesShowDialogBtnTag.show();
		me.targetPopulationsShowDialogBtnTag.show();
		me.saveBtnTag.show();
	}
	
	// ----------------------------------------------------------------------------------------------
	// Run init method

	me.init();

}