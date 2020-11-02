function ProjectManager()
{
    var me = this;

    me.orgunitTag = $("#orgunit");
    me.periodTag = $("#period");
    me.periodTag = $("#period");
    me.searchBtnTag = $("#searchBtn");
    me.paramFormTag = $("div.param-area");

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

    me.metaData = [];
    me.catOptionList = [];


    // ------------------------------------------------------------------------------------------------
    // Init method

    me.init = function()
    {
        me.retrieveOptionSets();
        me.retrieveProjectTypeList();
        me.setAutoCompleteForOrgUnit();
        me.initPeriodList();


        // Set up DIALOG form for showing / updating / adding a catOption details
        Util.setupDialogForm( "Project Details", me.catOptDetailsDivTag, 600, 700 );
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

              // $.ajax( {
              //   url: me.ORGUNIT_QUERY_URL + searchKey,
              //   dataType: "json",
              //   success: function( data ) {
              //     var ouList = $.map( data.organisationUnits, function ( item ) {
              //         return {
              //             label: item.name,
              //             value: item.name,
              //             id: item.id
              //         };
              //     } );

              //     response( ouList );
              //   }
              // });
            },
            minLength: 2,
            select: function( event, ui ) {
              me.orgunitTag.attr( "ouId", ui.item.id );
              me.orgunitTag.autocomplete( 'close' );
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
      var endPeriod = year + 10;

      me.periodTag.append("<option value=''>[Please choose a option]</option>");
      for( var year=endPeriod; year>=startPeriod; year--- )
      {
        me.periodTag.append("<option value='" + year + "'>" + year + "</option>");
      }

    }

    me.setup_Events = function()
    {
      me.searchBtnTag.click( function(){
        if( me.checkMandatoryValidation( me.paramFormTag ) )
        {
          me.retrieveCatOptionsList();
        }
      });
    }

    // ------------------------------------------------------------------------------------------------
    // Check validation

    me.checkMandatoryValidation = function( formTag )
    {
      var valid = true;
      formTag.find("input[mandatory='true'],select[mandatory='true']").each( function(){
        if( $(this).val() == "" )
        {
          me.addErrorSpanTag( $(this) );
          valid = false;
        }
        else
        {
          me.removeErrorSpanTag( $(this) );
        }
      });

      return valid;
    }

    me.addErrorSpanTag = function( fieldTag )
    {
      var spanTag = $("<span class='error'>This field is required.</span>");
      spanTag.insertAfter( fieldTag );

      fieldTag.addClass("error");
    }

    me.removeErrorSpanTag = function( fieldTag )
    {
      fieldTag.parent().find(".error").remove();
      fieldTag.removeClass("error")
    }

    // ------------------------------------------------------------------------------------------------
    // Retrieve meta data to initilize the app

    me.retrieveOptionSets = function()
    {
      RESTUtil.retrieveData( me.OPTION_SET_QUERY_URL, function( response ){
        me.metaData["optionSets"] = response.optionSets;
        me.loadedOptionSet = true;
        me.afterMetadataLoad();
      });
    }

    me.retrieveProjectTypeList = function()
    {
      RESTUtil.retrieveData( me.PROJECT_TYPE_QUERY_URL, function( response ){
        me.metaData["projectType"] = response.categoryOptionGroups;
        me.loadedProjectTypeList = true;
        me.afterMetadataLoad();
      });
    }
    
    me.afterMetadataLoad = function()
    {
      if( me.loadedOptionSet && me.loadedProjectTypeList )
      {
        // TODO - Hide Form Loading here ....
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
        var categoryOptions = response.categoryOptions;
        me.populateTableData( categoryOptions );
        me.catOptionList = me.resolveCatOptionList( categoryOptions );
      });
    }


    // ------------------------------------------------------------------------------------------------
    // Populate data in table / in dialog , set up events for rows in data table

    // Populate data
    me.populateTableData = function( catOptionList ){
      var tbody = me.catOptionListTbTag.find("tbody");

      for( var i in catOptionList )
      {
        var catOpt = catOptionList[i];
        var startDate = ( catOpt.startDate ) ? DateUtil.convertToDisplayDate( catOpt.startDate ) : "";
        var endDate = ( catOpt.endDate ) ? DateUtil.convertToDisplayDate( catOpt.endDate ) : "";

        var rowTag = $("<tr catOptId='" + catOpt.id + "'></tr>");
        rowTag.append("<td>" + catOpt.code + "<td>");
        rowTag.append("<td>" + catOpt.name + "<td>");
        rowTag.append("<td>" + startDate + "<td>");
        rowTag.append("<td>" + endDate + "<td>");

        me.setup_DataTable_Row_Events( rowTag );

        tbody.append( rowTag );

      }
    }

    // Set events for each row of table after populate data
    me.setup_DataTable_Row_Events = function( rowTag )
    {
      rowTag.click( function(){
        var catOptId = rowTag.attr("catOptId");
        var catOptionData = me.catOptionList[catOptId];

        new CatOptionDetailsForm( me.metaData, catOptionData );
        me.catOptDetailsDivTag.dialog( "open" );
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

    // ------------------------------------------------------------------------------------------------
    // RUN init method

    me.init();

}