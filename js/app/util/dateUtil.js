
function DateUtil() {}

DateUtil.monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
DateUtil.dayNamesMin = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

DateUtil.setDateRageFields = function( startDate, endDate )
{
	var dates = $('#' + startDate.attr("id") + ', #' + endDate.attr("id")).datepicker(
	{
		dateFormat: "dd-mm-yy",
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		monthNamesShort: DateUtil.monthShortNames,
		dayNamesMin: DateUtil.dayNamesMin,
		showAnim: '',
		createButton: false,
		constrainInput: true,
        yearRange: '-100:+100',
		onSelect: function(selectedDate)
		{
			var option = this.id == startDate.attr("id") ? "minDate" : "maxDate";
			var instance = $(this).data("datepicker");
			var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
			dates.not(this).datepicker("option", option, date);
		}
	});

	startDate.attr("readonly", true );
	endDate.attr("readonly", true );
	$( ".ui-datepicker-trigger").hide();
	// addRemoveDateButton( startDate.attr("id"), false ); // This method "addRemoveDateButton" is in common.js of DHIS
	// addRemoveDateButton( endDate.attr("id"), false  );// This method "addRemoveDateButton" is in common.js of DHIS
	
    $("#ui-datepicker-div").hide();
}

/**
 * dateDb : 2020-01-20
 * Result : 20-01-2020
 * **/
DateUtil.convertToDisplayDate = function( dateDb )
{
    var dateArr = dateDb.substring( 0,10 ).split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
}


/**
 * dateDb : 20-01-2020
 * Result : 2020-01-20
 * **/
DateUtil.convertToDbDate = function( displayDate )
{
    var dateArr = displayDate.substring( 0,10 ).split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
}