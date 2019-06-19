

function setActive(num) {
    $('#Dashboard').removeClass();
    $('#Checklist').removeClass();
    $('#FindVendor').removeClass();
    $('#BookManager').removeClass();
    $('#Bookmarks').removeClass();
    $('#Budgeter').removeClass();
    if (num == 1) {
        $('#Dashboard').addClass("Active");
    }
    else if (num == 2) {
        $('#Checklist').addClass("Active");
    }
    else if (num == 3) {
        $('#FindVendor').addClass("Active");
    }
    else if (num == 4) {
        $('#BookManager').addClass("Active");
    }
    else if (num == 5) {
        $('#Bookmarks').addClass("Active");
    }
    else if (num == 6) {
        $('#Budgeter').addClass("Active");
    }
     
    else {
        console.log("err");
    }
   
}

function setActiveV(num) {
    $('#DashboardVendor').removeClass();
    $('#CalendarVendor').removeClass();
    $('#BookVendor').removeClass();
    if (num == 1) {
        $('#DashboardVendor').addClass("Active");
    }
    else if (num == 2) {
        $('#CalendarVendor').addClass("Active");
    }
    else if (num == 3) {
        $('#BookVendor').addClass("Active");
    }
    else {
        console.log("err");
    }

}

function logout() {
    $.post("../Accounts/Logout", function () {

        localStorage.clear();
       
        location.href = "/LandingPage/Index";
    })
}


