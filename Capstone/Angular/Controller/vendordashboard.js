
module.controller("VendorDashboardMgmt", ["$scope", "$http","$interval", function (s, h,i) {
    var userInfo = JSON.parse(localStorage.userInfo);
    var companyInfo = JSON.parse(localStorage.companyID);
    setActiveV(1);
    var userInfo = JSON.parse(localStorage.userInfo)
    $("#Profilepic").attr("src", userInfo[0].profpath);
    $("#fullname").text(userInfo[0].firstname + " " + userInfo[0].lastname + "    ");


    //console.log("vndrmgmt");
    dashboardinit();
    loaded();
    loadRate();
  
    function dashboardinit() {
        h.post("../Vendor/getIDVendor?CompanyID=" + companyInfo.CompanyID).then(function (r) {
            console.log(r.data);
            s.VendorDetails = r.data[0];
            console.log(s.VendorDetails.RateTotal / s.VendorDetails.RateCounter);
            ratex = s.VendorDetails.RateTotal / s.VendorDetails.RateCounter;
            if (s.VendorDetails.RateTotal !=null) {
                    //console.log(s.TotalRate);
                ratex = s.VendorDetails.RateTotal / s.VendorDetails.RateCounter;
                    if (ratex > 0 && ratex <= 1) {
                        s.Rating = 1;
                    }
                    else if (ratex > 1 && ratex <= 2) {
                        s.Rating = 1;
                    }
                    else if (ratex > 2 && ratex <= 3) {
                        s.Rating = 2;
                    }
                    else if (ratex > 3 && ratex <= 4) {
                        s.Rating = 3;
                    }
                    else if (ratex > 4 && ratex < 5) {
                        s.Rating = 4;
                    }
                    else if (ratex == 5) {
                        s.Rating = 5;
                    }

                }
                else {
                    s.Rating = 0;
                }
            $('#vendordashboardContent').show();
            $('#loadSpinner').hide();
        })
    }

    function loadRate() {
        h.post("../Vendor/getAllRater?userID=" + userInfo[0].userID).then(function (r) {
            console.log(r.data);
            s.RateDetails = r.data;
        })
    }

    

    function loaded() {
        s.load = i(function () {
            if (s.VendorDetails != undefined && s.Rating != undefined && s.TotalRate != undefined && s.RateDetails != undefined) {
                //console.log("loaded");
                i.cancel(s.load);
                $('#vendordashboardContent').show();
                $('#loadSpinner').hide();
            }
        })
    }
}])