
function DateUtil() {}

DateUtil.convertToDisplayDate = function( dateDb )
{
    var dateArr = dateDb.substring( 0,10 ).split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
}