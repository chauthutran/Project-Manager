function ProjectManager()
{
    var me = this;

    me.backToMainPageTag = $("[name='backToMainPage']");
    me.updateCatOptionComboBtnTag = $("#updateCatOptionComboBtn");

    me.orgunitTag = $("#orgunit");
    me.periodTag = $("#period");
    me.periodTag = $("#period");
    me.searchBtnTag = $("#searchBtn");
    me.paramFormTag = $("div.param-area");

    me.addNewCatOptionBtnTag = $("#addNewCatOptionBtn");
;
    me.loadingDivTag = $("#loadingDiv");
    me.loadingMsgTag = $("#loadingMsg");
    me.catOptionListTbTag = $("#catOptionListTb");
    me.catOptDetailsDivTag = $("#catOptDetailsDiv");
     

    me.PARAM_ORGUNIT_ID = "@PARAM_ORGUNIT_ID";
    me.PARAM_PERIOD_START_DATE = "@PARAM_PERIOD_START_DATE";
    me.PARAM_PERIOD_END_DATE = "@PARAM_PERIOD_END_DATE";

    me.optionSet_ImplementationStrategies = "SU52yMajLXm";
    me.optionSet_TargetPopulations = "e3RJ6M8qB1h";

    me.CATEGORY_OPTION_COMBO_UPDATE_URL = RESTUtil.API_BASED_URL + "maintenance/categoryOptionComboUpdate";

    me.ORGUNIT_QUERY_URL = RESTUtil.API_BASED_URL + "organisationUnits.json?level=5&fields=name,id&paging=false&filter=name:ilike:";
    me.OPTION_SET_QUERY_URL = RESTUtil.API_BASED_URL + "optionSets.json?filter=id:in:[" + me.optionSet_ImplementationStrategies + "," + me.optionSet_TargetPopulations + "]" 
                        + "&fields=id,displayName,options[id,code,displayName]&paging=false";
    me.PROJECT_TYPE_QUERY_URL = RESTUtil.API_BASED_URL + "categoryOptionGroupSets/sLnFBYhOlKG.json?fields=id,categoryOptionGroups[id,displayName,categoryOptions[id,name]]";
    me.CATOPTION_QUERY_URL = RESTUtil.API_BASED_URL + "categoryOptions.json?fields=*&paging=false"
                        + "&filter=categories.id:in:[OPZj38sNHhm]"
                        + "&filter=organisationUnits.id:eq:" +  me.PARAM_ORGUNIT_ID;
    

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------
    // Filter Query

    me.loadedOptionSet = false;
    me.loadedProjectTypeList = false;

    me.catOptionDetailsFormObj;
    me.metaData = [];
    me.originalList;
    me.catOptionList;


    // ------------------------------------------------------------------------------------------------
    // Init method

    me.init = function()
    {
        MsgManager.appUnblock();

        me.retrieveOptionSets();
        me.retrieveProjectTypeList();
        me.setAutoCompleteForOrgUnit();
        me.initPeriodList();


        // Set up DIALOG form for showing / updating / adding a catOption details
        Util.setupDialogForm( "Project Details", me.catOptDetailsDivTag, 600, 700, true );

        me.setup_Events();
    }


    // ------------------------------------------------------------------------------------------------
    // Set up init data & Event

    me.setAutoCompleteForOrgUnit = function()
    {
        me.orgunitTag.autocomplete({
            source: function( request, response ) {
              var searchKey =  me.orgunitTag.val();
              RESTUtil.retrieveData( me.ORGUNIT_QUERY_URL + searchKey, function( data ){
                var ouList = $.map( data.organisationUnits, function ( item ) {
                          return {
                              label: item.name,
                              value: item.name,
                              id: item.id
                          };
                      } );
    
                response( ouList );
              });
            },
            minLength: 2,
            select: function( event, ui ) {
              me.orgunitTag.attr( "ouId", ui.item.id );
              me.orgunitTag.autocomplete( 'close' );
              me.resetForm();
            },
            change: function( event, ui ) {
                if( ui.item == null ) {
                    $( this ).val("");
                    $( this ).focus();
                   
                    me.resetForm();
                }
            }
          } );
    }


    me.initPeriodList = function()
    {
      var date = new Date();
      var year = eval( date.getFullYear() );

      var startPeriod = year - 20;
      var endPeriod = year + 3;

      me.periodTag.append("<option value=''>[Please choose a option]</option>");
      for( var year=endPeriod; year>=startPeriod; year-- )
      {
        me.periodTag.append("<option value='" + year + "'>" + year + "</option>");
      }

    }

    me.setup_Events = function()
    {
      me.backToMainPageTag.click( function(){
        window.location.href = "../../..";
      });

      me.updateCatOptionComboBtnTag.click( function()
      {
        me.updateCatOptionCombinations();
      });
      
      me.periodTag.change( function(){
        me.hideDataTablePage();
      });

      me.searchBtnTag.click( function(){
        if( ValidationUtil.checkMandatoryValidation( me.paramFormTag ) )
        {
          me.retrieveCatOptionsList();
        }
      });

      me.addNewCatOptionBtnTag.click(function(){
        me.catOptionDetailsFormObj.showAddDialogForm();
      })
    }

    me.resetForm = function()
    {
      me.originalList = undefined;
      me.catOptionList = undefined;
      
      me.hideDataTablePage();
    }

    // ------------------------------------------------------------------------------------------------
    // Retrieve meta data to initilize the app

    me.retrieveOptionSets = function()
    {
      RESTUtil.retrieveData( me.OPTION_SET_QUERY_URL, function( response ){
        me.metaData[ProjectManager.METADTA_TYPE_OPTIONSET] = response.optionSets;
        me.loadedOptionSet = true;
        me.afterMetadataLoad();
      });
    }

    me.retrieveProjectTypeList = function()
    {
      RESTUtil.retrieveData( me.PROJECT_TYPE_QUERY_URL, function( response ){
        me.metaData[ProjectManager.METADTA_TYPE_PROJECT_TYPE] = response;
        me.loadedProjectTypeList = true;
        me.afterMetadataLoad();
      });
    }
    

    me.afterMetadataLoad = function()
    {
      if( me.loadedOptionSet && me.loadedProjectTypeList )
      {
        me.catOptionDetailsFormObj = new CatOptionDetailsForm( me );
        MsgManager.appUnblock();
      }
    }


    // ------------------------------------------------------------------------------------------------
    // Update catOptionCombo
  

    me.updateCatOptionCombinations = function()
    {
      MsgManager.appBlock("Updating category option combos ... ");
      var url = me.CATEGORY_OPTION_COMBO_UPDATE_URL;

      RESTUtil.submitData( "PUT",{} , url, function(){ // actionSuccess

        alert( "Updated category option combos.")

      }, function( error ){ // error
        
        MsgManager.appUnblock();
        alert("Error occured while updating catOptionCombos.\n" + error.statusText );
      });
    }


    // ------------------------------------------------------------------------------------------------
    // Retrieve catOption list by Orgunits

    me.retrieveCatOptionsList = function()
    {
      me.processCatOptions = 0;
      me.originalList = [];
      me.catOptionList = [];

      me.loadingMsgTag.html("Retrieving data ...");
      me.hideDataTable();

      var ouId = me.orgunitTag.attr("ouId");
      var url =  me.CATOPTION_QUERY_URL;
      url = url.replace( me.PARAM_ORGUNIT_ID, ouId );

      RESTUtil.retrieveData( url, function( response ){
        me.originalList = response.categoryOptions;

        me.catOptionList = me.resolveCatOptionList( me.originalList );

        me.populateTableDataByPeriod( me.originalList );
        me.showDataTable();
      });

    }


    me.filterCatOptionListByDate = function( categoryOptions )
    {
      var validList = [];
      for( var i in categoryOptions )
      {
        var categoryOption = categoryOptions[i];
        if( categoryOption.id=="AKO3MeLP66A" )
        {
          var fasdfdasf= 0 ;
        }
        if( me.checkValidCatOptionByPeriod( categoryOption ) )
        {
          validList.push( categoryOption );
        }
      }

      return validList;
    }

    me.checkValidCatOptionByPeriod = function( categoryOption )
    {
      var selectedPeriod = me.periodTag.val();

      // Case #1: if CatOption has startDate and endDate
      if( categoryOption.startDate && categoryOption.endDate )
      {
        var startYear = me.getYearFromDateStr( categoryOption.startDate );
        var endYear = me.getYearFromDateStr( categoryOption.endDate );

        return ( selectedPeriod >= startYear &&  selectedPeriod <= endYear ) ;
      }
      // Case #2: If catOption as startDate ony
      else if( categoryOption.startDate )
      {
        var startYear = me.getYearFromDateStr( categoryOption.startDate );
        return ( selectedPeriod >= startYear );
      }
      // Case #3: If catOption as endDate ony
      else if( categoryOption.endDate )
      {
        var endYear = me.getYearFromDateStr( categoryOption.endDate );
        return ( selectedPeriod <= endYear ) ;
      }
      // Case #4: If catOption is no any date
      else
      {
        return true;
      }
    }

    me.getYearFromDateStr = function( dateStr )
    {
      return dateStr.split( "-" )[0];
    }

    // ------------------------------------------------------------------------------------------------
    // Populate data in table / in dialog , set up events for rows in data table

    // Populate data
    me.populateTableDataByPeriod = function( catOptionList )
    {
      var validCatOptionList = me.filterCatOptionListByDate( catOptionList );

      var tbody = me.catOptionListTbTag.find("tbody");
      tbody.find("tr").remove();

      for( var i in validCatOptionList )
      {
        me.addNewDataRow( validCatOptionList[i] );
      }
    }

    me.addOrUpdateDataRowInTable = function( catOptionData )
    {
      var rowTag = me.getRowInDataTable(  catOptionData.id );
      if( me.checkValidCatOptionByPeriod( catOptionData ) )
      {
        if( rowTag ) // The row is existing in table --> Do updating
        {
          me.updateDataRow( catOptionData );
        }
        else 
        {
          me.addNewDataRow( catOptionData ); // The row dosen't exist in table --> Do adding
        }
      }
      else
      {
        me.removeDataRow( catOptionData ); // catOptionData with  startDate / endData is invalid --> Remove the row
      }
    }

    // Add a new row
    me.addNewDataRow = function( catOptionData ){
      var code = ( catOptionData.code ) ? catOptionData.code : "";
      var startDate = ( catOptionData.startDate ) ? DateUtil.convertToDisplayDate( catOptionData.startDate ) : "";
      var endDate = ( catOptionData.endDate ) ? DateUtil.convertToDisplayDate( catOptionData.endDate ) : "";

      var rowTag = $("<tr catOptId='" + catOptionData.id + "' style='cursor:pointer;'></tr>");
      rowTag.append("<td>" + code + "</td>");
      rowTag.append("<td>" + catOptionData.name + "</td>");
      rowTag.append("<td>" + startDate + "</td>");
      rowTag.append("<td>" + endDate + "</td>");

      // For Project Type
      var projectTypeList = me.metaData[ProjectManager.METADTA_TYPE_PROJECT_TYPE].categoryOptionGroups;
      var hasProjectType = false;
      for( var i in projectTypeList )
      {
        var projectType = projectTypeList[i];
        var foundOption = Util.findItemFromList( projectType.categoryOptions, catOptionData.id, "id" );
        if( foundOption )
        {
          rowTag.append("<td>" +  projectType.displayName + "</td>");
          hasProjectType = true;
        }
      }
      
      if( !hasProjectType )
      {
        rowTag.append("<td></td>");
      }

      
      rowTag.append("<td></td>");
      rowTag.append("<td></td>");
      rowTag.append("<td></td>");

      me.setup_DataTable_Row_Events( rowTag );

      var tbody = me.catOptionListTbTag.find("tbody");
      tbody.append( rowTag );
    }

    // Update an existing row
    me.updateDataRow = function( catOptionData )
    {
      var rowTag = me.getRowInDataTable( catOptionData.id );

      var startDate = ( catOptionData.startDate ) ? DateUtil.convertToDisplayDate( catOptionData.startDate ) : "";
      var endDate = ( catOptionData.endDate ) ? DateUtil.convertToDisplayDate( catOptionData.endDate ) : "";

      Util.setTableColumnValue( rowTag, 1, catOptionData.code );
      Util.setTableColumnValue( rowTag, 2, catOptionData.name );
      Util.setTableColumnValue( rowTag, 3, startDate );
      Util.setTableColumnValue( rowTag, 4, endDate );
      
       // For Project Type
       var projectTypeList = me.metaData[ProjectManager.METADTA_TYPE_PROJECT_TYPE].categoryOptionGroups;
       for( var i in projectTypeList )
       {
         var projectType = projectTypeList[i];
         var foundOption = Util.findItemFromList( projectType.categoryOptions, catOptionData.id, "id" );
         if( foundOption )
         {
            Util.setTableColumnValue( rowTag, 5,  projectType.displayName );
            hasProjectType = true;
         }
       }

    }

    me.removeDataRow = function( catOptionData )
    {
      me.getRowInDataTable( catOptionData.id ).remove();
      delete me.catOptionList[catOptionData.id];
    }

    me.getAttrValue = function( attrValue, metaDataType )
    {
      var dataList = me.metaData[ metaDataType ];
     
      if( metaDataType == ProjectManager.METADTA_TYPE_OPTIONSET )
      {
        var foundItem = Util.findItemFromList( dataList, attrValue, "code" );
        return (foundItem ) ? foundItem.name : "";
      }
      else if( metaDataType == ProjectManager.METADTA_TYPE_PROJECT_TYPE )
      {
        dataList = dataList.categoryOptionGroups;
        var foundItem = Util.findItemFromList( dataList, attrValue, "id" );
        return (foundItem ) ? foundItem.name : "";
      }
      
      return "";
    }

    // Set events for each row of table after populate data
    me.setup_DataTable_Row_Events = function( rowTag )
    {
      rowTag.click( function(){
        var catOptId = rowTag.attr("catOptId");
        me.fasdfsdfasdffd
        me.catOptionDetailsFormObj.showUpdateDialogForm( catOptId );
      });
    }

    // ------------------------------------------------------------------------------------------------
    // Supportive methods

    me.resolveCatOptionList = function( catOptionList )
    {
      var result = [];
      for( var i in catOptionList )
      {
        var catOpt = catOptionList[i];
        if( result[catOpt.id] == undefined )
        {
          result[catOpt.id] = catOpt;
        }
      }

      return result;
    }

    me.showDataTable = function()
    {
      me.loadingDivTag.hide();
      me.catOptionListTbTag.show("fast");
      me.addNewCatOptionBtnTag.show();
    }

    me.hideDataTable = function()
    {
      me.loadingDivTag.show();
      me.catOptionListTbTag.hide();
      me.addNewCatOptionBtnTag.hide();
    }

    me.hideDataTablePage = function()
    {
      me.loadingDivTag.hide();
      me.catOptionListTbTag.hide();
    }

    me.hideDataTablePage = function()
    {
      me.loadingDivTag.hide();
      me.catOptionListTbTag.hide();
      me.addNewCatOptionBtnTag.hide();
    }

    me.getRowInDataTable = function( catOptId )
    {
      return me.catOptionListTbTag.find("tbody tr[catOptId='" +catOptId + "']");
    }

    // ------------------------------------------------------------------------------------------------
    // RUN init method

    me.init();

}


ProjectManager.METADTA_TYPE_OPTIONSET = "optionSets";
ProjectManager.METADTA_TYPE_PROJECT_TYPE = "projectType";


ProjectManager.projectTypesAttrId = "xxx";
ProjectManager.implStategiesAttrId = "kKB7KCMbSxR";
ProjectManager.targetPopulationsAttrId = "JEjwUg7H3Vs";
