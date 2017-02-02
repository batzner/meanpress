$(function(){
    const navbarCollapse = $("#navbarCollapse");

    // Close the navbar on clicks if it is opened
    $(document).click(function () {
        const opened = navbarCollapse.hasClass('in');
        if (opened === true) {
            navbarCollapse.collapse('hide');
        }
    });
});

function selectDropdownItem(elem, triggerOnChange=true) {
    const buttonElem = elem.closest('.btn-group').find('button').first();
    const choiceElem = buttonElem.find('.choice');
    // Set the text on the span
    choiceElem.html(elem.text());
    // Set the selected value on the button
    buttonElem.val(elem.data('value'));
    if (triggerOnChange) {
        buttonElem.change();
    }
}