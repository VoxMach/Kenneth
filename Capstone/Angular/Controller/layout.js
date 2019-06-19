
module.controller("LayoutMgmt", ["$scope", function (s) {
    var userInfo = JSON.parse(localStorage.userInfo);

    s.Type = userInfo[0].usertype;
}])