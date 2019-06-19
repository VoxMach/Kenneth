var module = angular.module("myApp", [])
.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);

        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        })
    }

    return {
        link:fn_link
    }
}])

module.controller("WizardMgmt", ["$scope", "$http","$interval", function (s, h,i) {
    loadServices();
    var formdata = new FormData();
    s.CompanyDetails = {};
    getAllProv();
    getAllCity();
    s.test = "sada";
    s.isSaving = 0;
    loadUser();
    function loadServices() {
        h.post("../Event/getServices").then(function (r) {
            s.ServiceList = r.data;
            //console.log(s.ServiceList);
            s.ServiceType = r.data[0];
            
        })
    }

    function loadUser() {
        if (localStorage.username) {
            h.post("../Accounts/GetByUser?username=" + localStorage.username).then(function (r) {
                localStorage.userInfo = JSON.stringify(r.data);
               
                
            })
        }
    }

    

    function getAllProv() {
        h.post("../Event/getProvince").then(function (r) {
            s.province = r.data;
            //console.log(s.province);
            

        })
    }
    function getAllCity() {
        h.post("../Event/getAllCity").then(function (r) {
            s.allcity = r.data;

        })
    }

    s.provChange = function (val) {
        //console.log(val);

        h.post("../Event/getCity?provName=" + val.name).then(function (r) {
            //console.log(r.data);
            s.city = r.data;
        })

    }

    s.getTheFiles = function ($files) {
        s.imagesrc = [];
        s.imagex = $files;
        s.CompID = 1;
        console.log(s.CompID);
        var userInfo = JSON.parse(localStorage.userInfo);
        var userid = userInfo[0].userID;
        
        for (var i = 0; i < $files.length; i++) {
            var reader = new FileReader();
            reader.filename = $files[i].name;

            reader.onload = function (event) {
                var image = {};
                image.Name = event.target.filename;
                image.Size = (event.total / 1024).toFixed(2);
                image.Src = event.target.result;
                
                s.imagesrc.push(image);
                s.$apply();
            }
            reader.readAsDataURL($files[i]);    
        }
        
       
        
    }



    s.uploadFiles = function () {
        angular.forEach(s.imagex, function (value, key) {

            formdata.append(key, value);
            formdata.append("CompanyID", s.CompID);
            console.log(formdata.get("CompanyID"));
        })
       
        console.log(s.imagex);
        var userInfo = JSON.parse(localStorage.userInfo);
        var userid =userInfo[0].userID;
        var request = {
            method: 'POST',
            url: '/Accounts/Upload',
            data: formdata,
            headers: {
                'Content-Type':undefined
            }
        };
        h(request).then(function(r){
            s.IsFinished = r.data;
        });
    }

    s.reset = function () {
        angular.forEach(
            angular.element("input [type = 'file']"),
            function (inputElem) {
                angular.element(inputElem).val(null);
            }
            );
        s.imagesrc = [];
        formdata = new FormData();
    }




    //console.log("wizard!");
        
       
    s.aw="Sadas";
        s.steps = [
          {step: "1",name: "Service Type",},
          {step: "2",name: "Profile Details",},
          {step: "3",name: "Sample Works",},
        ];
        s.currentStep = 1;

        //console.log(s.currentStep);

        s.NextStep1 = function (data) {
            s.CompanyDetails.CompanyInfo = [];
            s.currentStep = 2;
            
                s.CompanyDetails.ServiceType = data;
                s.CompanyDetails.ServiceType.ServiceType = s.CompanyDetails.ServiceType.ID;
                s.CompanyDetails.CompanyInfo.Prov={$$hashKey: "object:55",
                                                    name: "Davao del Norte",
                                                    provinceID: 28}
                //console.log(s.CompanyDetails);
                s.provChange(s.CompanyDetails.CompanyInfo.Prov);
           
        }

        s.NextStep2 = function (data) {

            if (data.StartPrice > data.EndPrice) {
                swal("Starting Price is greater than End Price!", "", "error");
            }
            else {
                s.CompanyDetails.CompanyInfo = data;
                console.log(data);

                s.currentStep = 3;
            }
          
        }




        s.Onchx = function (data) {
            s.ServiceType = data;
           
        }

        s.BackStep = function () {
            
            s.currentStep = s.currentStep - 1;
            //console.log(s.CompanyDetails);
        }

        

        s.isLastStep = function () {    
            return s.currentStep == 3;
        };

        s.SaveCompany = function () {
            s.isSaving = 1;
            //console.log(s.imagesrc);
            var userInfo = JSON.parse(localStorage.userInfo);
            var userid = userInfo[0].userID;
            var Companydet = angular.merge(s.CompanyDetails.CompanyInfo, s.CompanyDetails.ServiceType);
            Companydet.Province = s.CompanyDetails.CompanyInfo.Prov.name;
            Companydet.City = s.CompanyDetails.CompanyInfo.City.cityName;
            Companydet.userID = userid;
            //console.log(Companydet);
            var cmpny = { 'cmpny': Companydet };
            
            h.post("../Accounts/createCompany", cmpny).then(function (r) {
                
                s.CompID = r.data.CompanyID;
                
                
                s.CompanyCreateTimer = i(function () {
                    if (s.CompID != null) {
                        i.cancel(s.CompanyCreateTimer);
                        s.uploadFiles();
                        s.uploadTimer = i(function () {
                            if (s.IsFinished != 1) {
                                //console.log("uploading");
                            }
                            else {
                                i.cancel(s.uploadTimer);
                               
                                swal({
                                    title: "Registered successfully ",
                                    text: "Company Registered",
                                    type: "success"

                                },
                                                function () {
                                                    localStorage.companyID = JSON.stringify({ 'CompanyID': s.CompID });
                                                    location.href = "/Vendor/Dashboard";
                                                });
                            }
                        })
                    }
                    else {
                        //console.log("nul");
                    }
                })
                
                
               
            })
            //s.uploadFiles();
            
        }
        
        


}]) 

angular.module('dropzone', []).directive('dropzone', function () {
    return function (scope, element, attrs) {
        var config, dropzone;

        config = scope[attrs.dropzone];

        // create a Dropzone for the element with the given options
        dropzone = new Dropzone(element[0], config.options);

        // bind the given event handlers
        angular.forEach(config.eventHandlers, function (handler, event) {
            dropzone.on(event, handler);
        });
    };
});

angular.module('app', ['dropzone']);

angular.module('app').controller('SomeCtrl', function ($scope) {
    $scope.dropzoneConfig = {
        'options': { // passed into the Dropzone constructor
            'url': 'upload.php'
        },
        'eventHandlers': {
            'sending': function (file, xhr, formData) {
            },
            'success': function (file, response) {
            }
        }
    };
});