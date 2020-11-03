function ValidationUtil() {}

ValidationUtil.checkMandatoryValidation = function( formTag )
{
  var valid = true;
  formTag.find("input[mandatory='true'],select[mandatory='true']").each( function(){
    if( $(this).val() == "" )
    {
        ValidationUtil.addErrorSpanTag( $(this) );
        valid = false;
    }
    else
    {
        ValidationUtil.removeErrorSpanTag( $(this) );
    }
  });

  return valid;
}

ValidationUtil.addErrorSpanTag = function( fieldTag )
{
  if( fieldTag.parent().find(".error").length == 0 )
  {
    var spanTag = $("<div class='error'>This field is required.</div>");
    spanTag.insertAfter( fieldTag );

    fieldTag.addClass("errorField");
  }
}

ValidationUtil.removeErrorSpanTag = function( fieldTag )
{
  fieldTag.parent().find(".error").remove();
  fieldTag.removeClass("errorField")
}
