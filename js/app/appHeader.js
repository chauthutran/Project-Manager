function AppHeader()
{
    var me = this;

    me.SYSTEM_SETTING_QUERY_URL = RESTUtil.API_BASED_URL + "systemSettings.json";
    
    me.dhisHeaderTextTag = $("[name='dhisHeaderText'");
    me.backToPageTag = $("[name='backToPageTag'");
    
    me.init = function()
    {
        me.retrieveDhisSystemSetting();
        me.setup_Events();
    }

    // -----------------------------------------------------------------------------------------------------------
    // Retrieve SystemSettings information

    me.retrieveDhisSystemSetting = function()
    {
        RESTUtil.retrieveData( me.SYSTEM_SETTING_QUERY_URL, function( data ){
            me.dhisHeaderTextTag.html( data.applicationTitle );
        });
        
    }

    me.setup_Events = function()
    {
        me.backToPageTag.click = function()
        {
            location.href = "../../../dhis-web-commons-about/redirect.action";
        }
    }
    // -----------------------------------------------------------------------------------------------------------
    // RUN init

    me.init();
}