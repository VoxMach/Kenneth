
var module = angular.module("myApp", []);


module.controller("UserMgmt", ["$scope", "$http", function (s, h) {
    s.clientSpin = 0;
    s.vendorSpin = 0;

    //if (JSON.parse(localStorage.userInfo) != null) {
    //    location.href = "../user/dashboard";
    //}
    //console.log("sadas");


    toastr.options.closeButton = true;
    toastr.options.showMethod = 'slideDown';
    toastr.options.hideMethod = 'slideUp';
    toastr.options.progressBar = true;;
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.preventDuplicates = true,
    toastr.options.positionClass = "toast-bottom-left";
    toastr.warning("Hi welcome to EventAide, This website is currently in its Testing Phase");


    s.ClientLogin = function (data) {
        console.log(data)
       if(data != undefined){
           console.log("ey");
        s.clientSpin = 1;
        $('#clientSpinner').show();

        h.post("../accounts/Login?username=" + data.username + "&password=" + data.password+"&type=customer")
        .then(function (r) {
            
            if (r.data == "notfound") {
                $('#clientSpinner').hide();
                s.clientSpin = 0;
                swal("Account Does not Exist", "Please retype", "error");
                s.client = {};
               
                
                
            }
            else {
                localStorage.userInfo = JSON.stringify(r.data);
                location.href = "../event/index";
            }
        })
       }
       else {
           swal("Fields Empty", "Please fill out all the fields", "error")
       }
    }

    s.VendorLogin = function (data) {
        if(data !=undefined){
        s.vendorSpin = 1;
        $('#vendorSpinner').show();
        h.post("../accounts/Login?username=" + data.username + "&password=" + data.password + "&type=vendor")
        .then(function (r) {
            if (r.data == "notfound") {
                $('#vendorSpinner').hide();
                s.vendorSpin = 0;
                swal("Account Does not Exist", "Please retype", "error");
                s.data = {};

            }
            else {
                //console.log(r.data);
                localStorage.userInfo = JSON.stringify(r.data);
                //console.log(r.data[0].userID);
                h.post("../Accounts/checkCompany?userID="+r.data[0].userID).then(function (r) {
                    //console.log(r.data);
                    if (r.data == 0) {
                        location.href = "../Accounts/RegisterCompany";
                    }
                    else {
                        
                        //location.href = "../Vendor/Dashboard";
                        
                        location.href = "../Vendor/CompanyList";
                    }
                })
                
                
            }
        })
        }
        else {

            swal("Fields Empty", "Please fill out all the fields", "error")
          
        }
    }

    

    s.Register = function (data) {
        //console.log(data);
        
    }
    s.Change = function () {
        //console.log("sdasd");
    }
   
    s.Logout = function () {
        //console.log("logoutfunct");

        h.post("../Accounts/Logout").then(function (r) {
            localStorage.clear();
            location.href = "/LandingPage/Index";
        })

    }



}])
