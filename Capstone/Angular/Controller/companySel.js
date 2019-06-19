var module = angular.module("myApp", []);

module.controller("CompanyMgmt", ["$scope", "$http", "$filter", "$interval", function (s, h, f, i) {
    var userInfo = JSON.parse(localStorage.userInfo);


    h.post("../Vendor/getCompanyServices?userID=" + userInfo[0].userID).then(function (r) {
        console.log(r.data);
        s.CompanyList = r.data;
    })

    s.manageService = function (data) {
        localStorage.companyID = JSON.stringify({ 'CompanyID': data.CompanyInfo.CompanyID });
        location.href = "/Vendor/Dashboard";
    }

}])