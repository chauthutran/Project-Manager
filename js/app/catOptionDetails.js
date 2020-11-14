
function CatOptionDetailsForm( _projectManagerObj  )
{
    var me = this;
    
    me.projectManagerObj = _projectManagerObj;
    me.metaData;
    me.catOptionData;

	me.PROJECT_NAME_PREFIX = "PRJ - ";
	me.PARAM_CATEGORY_OPTION_GROUP_ID = "@PARAM_CATEGORY_OPTION_GROUP_ID";
	me.PARAM_CATEGORY_OPTION_ID = "@PARAM_CATEGORY_OPTION_ID";

	me.CATEGORY_OPTION_UPDATE_URL = RESTUtil.API_BASED_URL + "categories/OPZj38sNHhm/categoryOptions/" + me.PARAM_CATEGORY_OPTION_ID;

	me.CATEGORY_OPTION_URL = RESTUtil.API_BASED_URL + "categoryOptions/";
	me.CAT_OPTION_GROUP_QUERY_URL = RESTUtil.API_BASED_URL + "categoryOptionGroups/" + me.PARAM_CATEGORY_OPTION_GROUP_ID  + "/categoryOptions/" + me.PARAM_CATEGORY_OPTION_ID;

    me.catOptDetailsDivTag = $("#catOptDetailsDiv");
	me.nameTag =  me.catOptDetailsDivTag.find("#name");
	me.shortNameTag =  me.catOptDetailsDivTag.find("#shortName");
	me.codeTag =  me.catOptDetailsDivTag.find("#code");
	me.startDateTag =  me.catOptDetailsDivTag.find("#startDate");
	me.endDateTag =  me.catOptDetailsDivTag.find("#endDate");
	me.onGoingTag =  me.catOptDetailsDivTag.find("#onGoing");

	me.projectTypeTag =  me.catOptDetailsDivTag.find("#projectType");
	me.projectTypeOptionDivTag = $("#projectTypeOptionDiv");
	me.implStategiesTbTag =  me.catOptDetailsDivTag.find("#implStategies");
	me.targetPopulationsTbTag =  me.catOptDetailsDivTag.find("#targetPopulations");

	me.editBtnTag =  me.catOptDetailsDivTag.find("#editBtn");
    me.saveBtnTag =  me.catOptDetailsDivTag.find("#saveBtn");
    me.cancelBtnTag = me.catOptDetailsDivTag.find("#cancelBtn");

	// For implStrategies Dialog
	me.implStrategiesShowDialogBtnTag =  me.catOptDetailsDivTag.find("#implStrategiesShowDialogBtn");
	me.searchImplStrategiesDialogDivTag =  me.catOptDetailsDivTag.find("#searchImplStrategiesDialogDiv");
	me.implStrategiesGroupTag =  me.catOptDetailsDivTag.find("#implStrategiesGroup");
	me.implStrategiesOOptionTag =  me.catOptDetailsDivTag.find("#implStrategiesOOption");
	me.addImplStrategiesBtnTag =  me.catOptDetailsDivTag.find("#addImplStrategiesBtn");
	me.closeImplStrategiesBtnTag =  me.catOptDetailsDivTag.find("#closeImplStrategiesBtn");

	// For Target Populations Dialog
	me.targetPopulationsShowDialogBtnTag =  me.catOptDetailsDivTag.find("#targetPopulationsShowDialogBtn");
	me.searchTargetPopulationsDialogDivTag =  me.catOptDetailsDivTag.find("#searchTargetPopulationsDialogDiv");
	me.targetPopulationsOOptionTag =  me.catOptDetailsDivTag.find("#targetPopulationsOOption");
	me.addTargetPopulationsBtnTag =  me.catOptDetailsDivTag.find("#addTargetPopulationsBtn");
	me.closeTargetPopulationsBtnTag =  me.catOptDetailsDivTag.find("#closeTargetPopulationsBtn");

	me.implStrategiesOptSetId = "SU52yMajLXm";
	me.targetPopulationsOptSetId = "e3RJ6M8qB1h";

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
        me.metaData = me.projectManagerObj.metaData;

        me.initilizeForm();
        me.setup_Events();
	}

	me.showUpdateDialogForm = function( catOptId )
	{
		me.resetForm();

        me.catOptionData = me.projectManagerObj.catOptionList[catOptId];
        if( me.catOptionData )
        {
            me.populateCatOptionDetails();
		}

		// Disabel all input fields and buttons which were generated in "Implementation Strategies" and "Target Populations"
        me.disableForm();

        // Open FROM as dialog
		Util.openDialog( me.catOptDetailsDivTag, true );
		// $(".fullscreen-btn").closest("button").click();  // Make full screen as soon as the form is opened
		
		// me.catOptDetailsDivTag.closest(".ui-dialog").css( "top", 45 );
	}

	
	me.showAddDialogForm = function( )
	{
		me.resetForm();

		me.catOptionData = undefined;

		// Disabel all input fields and buttons which were generated in "Implementation Strategies" and "Target Populations"
        me.enableForm();

        // Open FROM as dialog
		Util.openDialog( me.catOptDetailsDivTag, true );
		// $(".fullscreen-btn").closest("button").click();  // Make full screen as soon as the form is opened
		
		// me.catOptDetailsDivTag.closest(".ui-dialog").css( "top", 45 );
	}

	// ----------------------------------------------------------------------------------------------
    // init form, set up meta data for Main Form and for DIALOG

    me.initilizeForm = function()
    {
		me.resetForm();
        me.projectTypes_PopulateRadios();
        me.setup_DialogForms();
    }
    
	me.resetForm = function()
	{
		// Reset Form
		me.catOptDetailsDivTag.find("input[type!='radio'],select").val("");
		me.catOptDetailsDivTag.find("input[type='radio']").prop("checked", false);
		me.implStategiesTbTag.find("tbody").find("tr").remove();
		me.targetPopulationsTbTag.find("tbody tr td button").remove();
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
			if( ValidationUtil.checkMandatoryValidation( me.catOptDetailsDivTag ) )
			{
				me.saveCatOptionData();
			}
		});

        me.cancelBtnTag.click(function(){
			Util.closeDialog( me.catOptDetailsDivTag );
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
			Util.openDialog( me.searchImplStrategiesDialogDivTag );
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
			Util.closeDialog( me.searchImplStrategiesDialogDivTag );
		});

		me.closeImplStrategiesBtnTag.click( function(){
			Util.closeDialog( me.searchImplStrategiesDialogDivTag );
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
			Util.openDialog( me.searchTargetPopulationsDialogDivTag );
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

			Util.closeDialog( me.searchTargetPopulationsDialogDivTag );
		});

		me.closeTargetPopulationsBtnTag.click( function(){
			Util.closeDialog( me.searchTargetPopulationsDialogDivTag );
		});

	}

	// ----------------------------------------------------------------------------------------------
    // Set up DIALOG forms for Implementation Strategies and Target Populations

    me.setup_DialogForms = function()
    {
        // Populate data for impStrategiesDialog
        me.impStrategiesDialog_PopulateCheckBoxes(  me.metaData[ProjectManager.METADTA_TYPE_OPTIONSET] );
        Util.setupDialogForm( "Implement Strategies", me.searchImplStrategiesDialogDivTag, 500, 410, false );
        
        // Populate data for targetPopulationsDialog
        me.targetPopulationsDialog_PopulateCheckboxes( me.metaData[ProjectManager.METADTA_TYPE_OPTIONSET] );
        Util.setupDialogForm( "Target Populations", me.searchTargetPopulationsDialogDivTag, 350, 320, false );
    }

	// ----------------------------------------------------------------------------------------------
    // For Project Types
    
	// Populate radios for "ProjectTypes"
	me.projectTypes_PopulateRadios = function()
	{
        me.projectTypeList = me.metaData[ProjectManager.METADTA_TYPE_PROJECT_TYPE].categoryOptionGroups;
        for( var i in me.projectTypeList )
        {
            var catOptionGroup = me.projectTypeList[i];
            var radioTag = me.createRadioOpt( catOptionGroup, me.metaData[ProjectManager.METADTA_TYPE_PROJECT_TYPE].id );
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
		var name = me.resolveCatOptionNameToDisplay( me.catOptionData.name );
        me.nameTag.val( name );
        me.shortNameTag.val( me.catOptionData.shortName );
        me.codeTag.val( me.catOptionData.code );

        if( me.catOptionData.startDate )
        {
            var displayStartDate = DateUtil.convertToDisplayDate( me.catOptionData.startDate );
            me.startDateTag.val( displayStartDate );
        }

        if( me.catOptionData.endDate )
        {
            var displayEndDate = DateUtil.convertToDisplayDate( me.catOptionData.endDate );
            me.endDateTag.val( displayEndDate );
            me.onGoingTag.prop("checked", false);
        }
        else
        {
            me.onGoingTag.prop("checked", true);
        }

		me.populateProjectTypeValue();

        // Populate attribute values
        me.populateAttrValues( me.catOptionData.attributeValues );

	}
	
	me.populateProjectTypeValue = function()
	{
		var selectedCatOption = me.catOptionData.id;
		for( var i in me.projectTypeList )
		{
			var projectType = me.projectTypeList[i];
			var foundOption = Util.findItemFromList( projectType.categoryOptions, selectedCatOption, "id" );
			if( foundOption )
			{
				me.projectTypeOptionDivTag.find("input[value='" + projectType.id + "']").prop("checked", true );
				me.projectTypeTag.val( projectType.displayName );
				return;
			}
		}
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
	

	// ----------------------------------------------------------------------------------------------
	// For saving data
	
	me.saveCatOptionData = function()
	{
		MsgManager.appBlock("Saving project ...");

		if( me.catOptionData ) // Update catOption
		{
			me.savingProcessTotal =  me.projectTypeList.length;
			me.updateCatOptionData();
		}
		else
		{
			// Add / delete the catOption in CatOptionGroups ( me.projectTypeList ), +1 for adding the new project in "CatOption Project"
			me.savingProcessTotal =  me.projectTypeList.length + 1 ; 
			me.addCatOptionData();
		}
	}
	
	// Update an existing catOption
	me.updateCatOptionData = function()
	{
		var jsonData = me.generateJsonData();
		var url = me.CATEGORY_OPTION_URL + me.catOptionData.id;

		RESTUtil.submitData( "PUT", jsonData, url, function(){ // actionSuccess

			me.disableForm();
            me.projectManagerObj.catOptionList[me.catOptionData.id] = jsonData;

			me.updateCatOptionInGroup( jsonData );

		}, function( errResponse ){ // actionError

			me.saveError( errResponse );
		});
    }
	
	// Add new a catOption
    me.addCatOptionData = function()
	{
		var jsonData = me.generateJsonData();
		var url = me.CATEGORY_OPTION_URL;

		RESTUtil.submitData( "POST", jsonData, url, function( response ){ // actionSuccess

            var catOptId = response.response.uid;
            jsonData.id = catOptId;
            me.projectManagerObj.catOptionList[catOptId] = jsonData;
			me.projectManagerObj.addNewDataRow( jsonData );
			
			me.updateCatOptionInGroup( jsonData );
			me.addCatOptionToCategoryProject( jsonData );


		}, function( errResponse ){ // actionError

			me.saveError( errResponse );
		});
	}
	
	// Add CatOption in category "ABR - Projects [A-C]"
	me.addCatOptionToCategoryProject = function( catOptionData )
	{
		var url = me.CATEGORY_OPTION_UPDATE_URL;
		url = url.replace( me.PARAM_CATEGORY_OPTION_ID, catOptionData.id );

		RESTUtil.submitData( "POST",{} , url, function(){ // actionSuccess

			me.checkSavingStatus( catOptionData );

		}, function( error ){ // error
			me.saveError( errResponse );
			// MsgManager.appUnblock();
			// alert("Error occured while updating a project type.\n" + error.statusText );
		});
	}

	// Add/Delete the ProjectType of catOption by ProjectType list
	me.updateCatOptionInGroup = function( catOptionData ){
		me.savingProcessIdx = 0;
		var projectTypeTags = me.projectTypeOptionDivTag.find("input");
		projectTypeTags.each( function(){
			if( $(this).prop("checked") )
			{
				me.saveCatOptionInGroup( "POST", $(this).val(), catOptionData );
			}
			else
			{
				me.saveCatOptionInGroup( "DELETE", $(this).val(), catOptionData );
			}
		});
		
	}

	// Add/Update Project Type with one ProgramType
	me.saveCatOptionInGroup = function( requestMethod, groupId, catOptionData )
	{
		var url = me.CAT_OPTION_GROUP_QUERY_URL;
		url = url.replace( me.PARAM_CATEGORY_OPTION_GROUP_ID, groupId );
		url = url.replace( me.PARAM_CATEGORY_OPTION_ID, catOptionData.id );

		RESTUtil.submitData( requestMethod,{} , url, function(){ // actionSuccess

			var projectTypeCatOptionList = Util.findItemFromList( me.metaData[ProjectManager.METADTA_TYPE_PROJECT_TYPE].categoryOptionGroups, groupId, "id" ).categoryOptions;
			if( projectTypeCatOptionList == undefined )
			{
				projectTypeCatOptionList = [];
			}

			if( requestMethod == "POST" )
			{
				var foundItem = Util.findItemFromList( projectTypeCatOptionList, catOptionData.id, "id" );
				if( !foundItem )
				{
					projectTypeCatOptionList.push( catOptionData );
				}

			}
			else if( requestMethod == "DELETE" )
			{
				projectTypeCatOptionList = Util.removeFromArray( projectTypeCatOptionList, "id", catOptionData.id );
			}

			me.checkSavingStatus( catOptionData );

		}, function( error ){ // error
			
			MsgManager.appUnblock();
			alert("Error occured while updating a project type.\n" + error.statusText );
		});
	}

	me.checkSavingStatus = function( catOptionData )
	{
		// ---------------------------------------------------------------------------------------------------------
		// Check if all catOptionGroups were added/updated

		me.savingProcessIdx++;

		if( me.savingProcessIdx == me.savingProcessTotal )
		{
			me.projectManagerObj.addOrUpdateDataRowInTable( catOptionData );

			MsgManager.appUnblock();
			Util.closeDialog( me.catOptDetailsDivTag );

			alert("Save data successfully !");
		}
	}

	me.saveError = function( errResponse )
	{
		var message = "There are some issue while saving data.";

		var errorReports = errResponse.responseJSON.response.errorReports;
		if( errorReports.length > 0 )
		{
			for( var i in errorReports )
			{
				var errorReport = errorReports[i];
				message+= "\n - " + errorReport.message;
			}
		}

		alert( message );
		MsgManager.appUnblock();
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
        var jsonData = {};
        if( me.catOptionData ) 
        {
            jsonData = JSON.parse( JSON.stringify( me.catOptionData ) );
        }
		else // Assign to selected orgunit in case adding a new catOption
		{
			jsonData.organisationUnits = [];
			jsonData.organisationUnits.push( {"id" : me.projectManagerObj.orgunitTag.attr("ouId")});
		}
		
		jsonData.name = me.resolveCatOptionNameToSaving( me.nameTag.val() );
		jsonData.shortName = me.shortNameTag.val();
		jsonData.code = me.codeTag.val();

		// Start date
		if( me.startDateTag.val() != "" )
		{
			jsonData.startDate = DateUtil.convertToDbDate( me.startDateTag.val() );
		}
		else if( jsonData.startDate )
		{
			delete jsonData.startDate;
		}
		
		// End date
		if( !me.onGoingTag.prop("checked") && me.endDateTag.val() != "" )
		{
			jsonData.endDate = DateUtil.convertToDbDate( me.endDateTag.val() );
		}
		else if( jsonData.endDate )
		{
			delete jsonData.endDate;
		}

		
		// Get data for Implement and TargerPopulations
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

		return jsonData;

	}

	
	me.resolveCatOptionNameToDisplay = function( name )
	{
		return name.replace( me.PROJECT_NAME_PREFIX, "" );
	}

	me.resolveCatOptionNameToSaving = function( name )
	{
		return me.PROJECT_NAME_PREFIX + name;
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

			// Add event for the button
			buttonTag.click( function(){
				var dataValue = buttonTag[0].innerText;
				var ok = confirm("Are you sure you want to delete '" + dataValue + "' ?");
				if( ok )
				{
					if( isAddRow ) 
					{
						buttonTag.closest("tr").remove();
					}
					else
					{
						buttonTag.remove();
					}
				}
			});
		}
	}

	me.createRadioOpt = function( optionData, radioOptName )
	{
		var divTag = $("<div class='option radio'></div>");

		var inputTag = $("<input type='radio' value='" + optionData.id + "'  id='" + optionData.id + "' name='" + radioOptName + "' style='margin-left: 0px;'> ");
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
		me.catOptDetailsDivTag.find("input,select,button").attr("disabled", "disabled");
		me.projectTypeOptionDivTag.hide();
		me.implStrategiesShowDialogBtnTag.hide();
		me.targetPopulationsShowDialogBtnTag.hide();

		me.editBtnTag.removeAttr("disabled");
		me.cancelBtnTag.removeAttr("disabled");
		me.projectTypeTag.show();
		me.cancelBtnTag.show();
		me.editBtnTag.show();
		me.saveBtnTag.hide();
	}
	
	me.enableForm = function()
	{
		me.catOptDetailsDivTag.find("input,select,button").removeAttr("disabled" );
		me.projectTypeTag.hide();
		me.editBtnTag.hide();

		me.projectTypeOptionDivTag.show();
		me.implStrategiesShowDialogBtnTag.show();
		me.targetPopulationsShowDialogBtnTag.show();
		me.cancelBtnTag.show();
        me.saveBtnTag.show();
	}
	

	// ----------------------------------------------------------------------------------------------
	// Run init method

	me.init();

}