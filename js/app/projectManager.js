function ProjectManager()
{
    var me = this;

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
    me.PARAM_START_DATE = "@PARAM_START_DATE";
    me.PARAM_END_DATE = "@PARAM_END_DATE";

    me.ORGUNIT_QUERY_URL = RESTUtil.API_BASED_URL + "organisationUnits.json?level=5&fields=name,id&paging=false&filter=name:ilike:";
    me.CATOPTION_QUERY_URL = RESTUtil.API_BASED_URL + "categoryOptions.json?fields=*&paging=false"
                    + "&filter=name:ilike:prj"
                    + "&filter=organisationUnits.id:eq:" +  me.PARAM_ORGUNIT_ID 
                    + "&filter=startDate:ge:" + me.PARAM_START_DATE 
                    + "&filter=startDate:le:" + me.PARAM_END_DATE;
    me.OPTION_SET_QUERY_URL = RESTUtil.API_BASED_URL + "optionSets.json?filter=code:like:ABR&fields=id,displayName,options[id,code,displayName]&paging=false";
    me.PROJECT_TYPE_QUERY_URL = RESTUtil.API_BASED_URL + "categoryOptionGroupSets/sLnFBYhOlKG.json?fields=id,categoryOptionGroups[id,displayName]";
                  
    me.loadedOptionSet = false;
    me.loadedProjectTypeList = false;

    me.catOptionDetailsFormObj;
    me.metaData = [];
    me.catOptionList = [];


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
        Util.setupDialogForm( "Project Details", me.catOptDetailsDivTag, 600, 700 );

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

              me.hideDataTablePage();
            },
            change: function( event, ui ) {
                if( ui.item == null ) {
                    $( this ).val("");
                    $( this ).focus();
                }
            }
          } );
    }

    me.initPeriodList = function()
    {
      var date = new Date();
      var year = eval( date.getFullYear() );

      var startPeriod = year - 10;
      var endPeriod = year + 3;

      me.periodTag.append("<option value=''>[Please choose a option]</option>");
      for( var year=endPeriod; year>=startPeriod; year-- )
      {
        me.periodTag.append("<option value='" + year + "'>" + year + "</option>");
      }

    }

    me.setup_Events = function()
    {
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
    // Retrieve catOption list

    me.retrieveCatOptionsList = function()
    {
      me.catOptionList = [];

      var dateRange = me.getPeriodDateRage( me.periodTag.val() );
      var ouId = me.orgunitTag.attr("ouId");

      var url =  me.CATOPTION_QUERY_URL;
      url = url.replace( me.PARAM_ORGUNIT_ID, ouId );
      url = url.replace( me.PARAM_START_DATE, dateRange.startDate );
      url = url.replace( me.PARAM_END_DATE, dateRange.endDate );

      RESTUtil.retrieveData( url, function( response ){
        
        me.loadingMsgTag.html("Populate data to table ...");
        var categoryOptions = response.categoryOptions;
        me.populateTableData( categoryOptions );
        me.catOptionList = me.resolveCatOptionList( categoryOptions );
      
      }, function(){ // error

      }, function(){
        
        me.loadingMsgTag.html("Retrieving data ...");
        me.hideDataTable();
      
      }, function(){
        me.showDataTable();
      
      });
    }


    // ------------------------------------------------------------------------------------------------
    // Populate data in table / in dialog , set up events for rows in data table

    // Populate data
    me.populateTableData = function( catOptionList ){
      var tbody = me.catOptionListTbTag.find("tbody");
      tbody.find("tr").remove();

      for( var i in catOptionList )
      {
        me.addNewDataRow( catOptionList[i] );
      }
    }

    // Add a new row
    me.addNewDataRow = function( catOptionData ){
      var startDate = ( catOptionData.startDate ) ? DateUtil.convertToDisplayDate( catOptionData.startDate ) : "";
      var endDate = ( catOptionData.endDate ) ? DateUtil.convertToDisplayDate( catOptionData.endDate ) : "";

      var rowTag = $("<tr catOptId='" + catOptionData.id + "' style='cursor:pointer;'></tr>");
      rowTag.append("<td>" + catOptionData.code + "</td>");
      rowTag.append("<td>" + catOptionData.name + "</td>");
      rowTag.append("<td>" + startDate + "</td>");
      rowTag.append("<td>" + endDate + "</td>");

      var attrValues = catOptionData.attributeValues;
      if( attrValues )
      {
        var projectTypeAttrValue = Util.findItemFromList( attrValues, ProjectManager.projectTypesAttrId, "id" );
        var projectType = (projectTypeAttrValue) ? me.getAttrValue( attrValue, ProjectManager.METADTA_TYPE_PROJECT_TYPE ) : "";
        rowTag.append("<td>" + projectType + "</td>");
      }
      else
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
      var rowTag = me.catOptionListTbTag.find("tbody tr[catOptId='" + catOptionData.id + "']");

      var startDate = ( catOptionData.startDate ) ? DateUtil.convertToDisplayDate( catOptionData.startDate ) : "";
      var endDate = ( catOptionData.endDate ) ? DateUtil.convertToDisplayDate( catOptionData.endDate ) : "";

      Util.setTableColumnValue( rowTag, 1, catOptionData.code );
      Util.setTableColumnValue( rowTag, 2, catOptionData.name );
      Util.setTableColumnValue( rowTag, 3, startDate );
      Util.setTableColumnValue( rowTag, 4, endDate );
      

      var attrValues = catOptionData.attributeValues;
      if( attrValues )
      {
        var projectTypeAttrValue = Util.findItemFromList( attrValues, ProjectManager.projectTypesAttrId, "id" );
        var projectType = (projectTypeAttrValue) ? me.getAttrValue( attrValue, ProjectManager.METADTA_TYPE_PROJECT_TYPE ) : "";
        Util.setTableColumnValue( rowTag, 5, projectType );
      }

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
        me.catOptionDetailsFormObj.showUpdateDialogForm( catOptId );
      });
    }

    // ------------------------------------------------------------------------------------------------
    // Supportive methods

    me.getPeriodDateRage = function( period )
    {
      var year = period;
      var startDate = year + "-01-01";
      var endDate = year + "-12-31";

      return {
        "startDate" : startDate,
        "endDate" : endDate
      }
    }

    me.resolveCatOptionList = function( catOptionList )
    {
      var result = [];
      for( var i in catOptionList )
      {
        var catOpt = catOptionList[i];
        result[catOpt.id] = catOpt;
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

    // ------------------------------------------------------------------------------------------------
    // RUN init method

    me.init();

}


ProjectManager.METADTA_TYPE_OPTIONSET = "optionSets";
ProjectManager.METADTA_TYPE_PROJECT_TYPE = "projectType";


ProjectManager.projectTypesAttrId = "xxx";
ProjectManager.implStategiesAttrId = "kKB7KCMbSxR";
ProjectManager.targetPopulationsAttrId = "JEjwUg7H3Vs";
