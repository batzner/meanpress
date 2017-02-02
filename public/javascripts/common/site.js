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