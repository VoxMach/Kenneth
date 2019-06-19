
var module = angular.module("myApp", []);


  window.fbAsyncInit = function() {
      FB.init({
          appId            : '267562477493184',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.12'
      });
  };

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));




module.controller("EventMgmt", ["$scope", "$http","$filter","$interval", function (s, h, f,i) {
    
    s.fbShow = function () {
        var pid = 360089608171191;
        let fbChatDiv = document.createElement('div');

        fbChatDiv.className = 'fb-customerchat';
        fbChatDiv.setAttribute('page_id', ""+pid+"");
        fbChatDiv.setAttribute('ref', '');
        fbChatDiv.setAttribute('id', s.counteeer);

        document.body.appendChild(fbChatDiv);
      
        //FB.CustomerChat.hide();
        FB.XFBML.parse();
    }

    
    

    s.fbRemove = function () {
        $('.fb-customerchat').remove();
        $('.fb_dialog').remove();
    }

    var userInfo = JSON.parse(localStorage.userInfo);
    
    s.loaded = 0;
    loaded();
    getAllProv();
    //getTaskList();
    function loaded() {
        s.load = i(function () {
            if (s.BdayDetails == undefined && s.WeddingDetails ==undefined && s.ReunionDetails==undefined && s.OtherPartyDetails == undefined) {
                //console.log("empty");
            }
            else {
                i.cancel(s.load);
                //console.log("eey");
                s.loaded = 1;
                $('#eventContent').show();
            }
        })
    }
    function getAllProv() {
        h.post("../Event/getProvince").then(function (r) {
            s.province = r.data;
            //console.log(s.province);
            getAllCity();
            
        })
    }
    function getAllCity() {
        h.post("../Event/getAllCity").then(function (r) {
            s.allcity = r.data;
            getBday();
            getWedding();
            getReunion();
            getOtherParty()
        })
    }
    function getTaskList() {
        h.post("../Event/getAllTask").then(function (r) {
            s.TaskList=r.data;
            //console.log(r.data);
            filter();
        })
    }
    
    function provNamex(provID) {
        return s.province.filter(function (pv) { return (pv.provinceID == provID) })[0].name;

    }
    function cityNamex(cityID) {
        return s.allcity.filter(function (pv) { return (pv.cityID == cityID) })[0].cityName;
    }

    s.provChange = function (val) {
        //console.log(val);

        h.post("../Event/getCity?provName=" + val.name).then(function (r) {
            //console.log(r.data);
            s.city = r.data;
        })
        
    }

   
    function getBday() {
        indx = 0;
        h.post("../Event/getBirthday?userID=" + userInfo[0].userID).then(function (r) {
            
            
            s.BdayDetails = r.data;
           
            for (var i = 0; i < s.BdayDetails.length; i++) {
                var ms = s.BdayDetails[i].EventDate.substring(6, s.BdayDetails[i].EventDate.length - 2);
                var newDate = formatDate(ms);
                s.BdayDetails[i].EventDate = newDate;
            }
          
            function x(){
            if (indx < s.BdayDetails.length) {
                s.BdayDetails[indx].ProvNamee = provNamex(s.BdayDetails[indx].ProvID);
                s.BdayDetails[indx].CityNamee = cityNamex(s.BdayDetails[indx].CityID);
               
                indx++;
                x();
            }
            else {
                indx = 0;
            }
    }
                x();
                //console.log(provNamex(8));
            //console.log(s.BdayDetails);
            
        })
    }

    function getWedding() {
        indx = 0;
        h.post("../Event/getWeddings?userID=" + userInfo[0].userID).then(function (r) {


            s.WeddingDetails = r.data;

            for (var i = 0; i < s.WeddingDetails.length; i++) {
                var ms = s.WeddingDetails[i].EventDate.substring(6, s.WeddingDetails[i].EventDate.length - 2);
                var newDate = formatDate(ms);
                s.WeddingDetails[i].EventDate = newDate;
            }
            function x() {
                if (indx < s.WeddingDetails.length) {
                    s.WeddingDetails[indx].ProvNamee = provNamex(s.WeddingDetails[indx].ProvinceID);
                    s.WeddingDetails[indx].CityNamee = cityNamex(s.WeddingDetails[indx].CityID);
                    indx++;
                    x();
                }
                else {
                    indx = 0;
                }
            }
            x();
            //console.log(s.WeddingDetails);
        })
    }

    function getReunion() {
        indx = 0;
        h.post("../Event/getReunions?userID=" + userInfo[0].userID).then(function (r) {
            s.ReunionDetails = r.data;

            for (var i = 0; i < s.ReunionDetails.length; i++) {
                var ms = s.ReunionDetails[i].EventDate.substring(6, s.ReunionDetails[i].EventDate.length - 2);
                var newDate = formatDate(ms);
                s.ReunionDetails[i].EventDate = newDate;
            }
            function x() {
                if (indx < s.ReunionDetails.length) {
                    s.ReunionDetails[indx].ProvNamee = provNamex(s.ReunionDetails[indx].ProvID);
                    s.ReunionDetails[indx].CityNamee = cityNamex(s.ReunionDetails[indx].CityID);
                    indx++;
                    x();
                }
                else {
                    indx = 0;
                }
            }
            x();
         
            //console.log(s.ReunionDetails);
        })
    }
  
    function getOtherParty() {
        indx = 0;
        h.post("../Event/getOtherParty?userID=" + userInfo[0].userID).then(function (r) {
            s.OtherPartyDetails = r.data;

            for (var i = 0; i < s.OtherPartyDetails.length; i++) {
                var ms = s.OtherPartyDetails[i].EventDate.substring(6, s.OtherPartyDetails[i].EventDate.length - 2);
                var newDate = formatDate(ms);
                s.OtherPartyDetails[i].EventDate = newDate;
            }
            function x() {
                if (indx < s.OtherPartyDetails.length) {
                    s.OtherPartyDetails[indx].ProvNamee = provNamex(s.OtherPartyDetails[indx].ProvID);
                    s.OtherPartyDetails[indx].CityNamee = cityNamex(s.OtherPartyDetails[indx].CityID);
                    indx++;
                    x();
                }
                else {
                    indx = 0;
                }
            }
            x();

            //console.log(s.OtherPartyDetails);
        })
    }


    function formatDate(ms) {

        var date = new Date(parseInt(ms));
        var hour = date.getHours();
        var mins = date.getMinutes() + '';
        var time = "AM";

        // find time 
        if (hour >= 12) {
            time = "PM";
        }
        // fix hours format
        if (hour > 12) {
            hour -= 12;
        }
        else if (hour == 0) {
            hour = 12;
        }
        // fix minutes format
        if (mins.length == 1) {
            mins = "0" + mins;
        }
        // return formatted date time string
        var fulldatee = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
        var yourdate = fulldatee.split("/").reverse();
        var tmp = yourdate[2];
        yourdate[2] = yourdate[1];
        yourdate[1] = tmp;
        yourdate = yourdate.join("-");

        return yourdate;
    }
    
   
  
    s.createWedding = function (data) {
        if (data.EventName && data.GroomFirstN && data.GroomLastN && data.BrideFirstN && data.BrideLastN && data.EventDate && data.EstimatedBudget && data.CityID && data.ProvinceID != null){

            var WedData = { 'wed': data };
           
            //console.log("createWed");
            
        data.CityID = data.CityID.cityID;
        data.ProvinceID = data.ProvinceID.provinceID;
        data.userID = userInfo[0].userID;
        //console.log(data);
        
           
        h.post("../Event/createWedding", WedData).then(function (r) {
            
            $('#modal-form').modal("hide");
            $('#modal-form').on('hidden.bs.modal', function (e) {
                $(this)
                  .find("input,textarea,select")
                     .val('')
                     .end()
                  .find("input[type=checkbox], input[type=radio]")
                     .prop("checked", "")
                     .end();
            })
            toastr.options.closeButton = true;
            toastr.options.showMethod = 'slideDown';
            toastr.options.hideMethod = 'slideUp';
            toastr.options.progressBar = true;
            toastr.success("Successfully created an event!");
            getWedding();
            $('#WeddingForm').hide();
            $('#BirthdayForm').hide();
            $('#ReunionForm').hide();
            $('#OtherForm').hide();
            s.checkWedID = r.data.WeddingID;
            //console.log(r.data);
            
            sessionStorage.setItem("New",s.checkWedID);

            h.post("../Event/getTaskList?type=Weddings").then(function (r) {
                createIndx = 0;
                s.WedTaskList = r.data;
                function constructChecklist() {
                    if (createIndx < r.data.length) {
                        s.WedTaskList[createIndx].isFinished = 0;
                        s.WedTaskList[createIndx].userID = userInfo[0].userID;
                        //s.WedTaskList[createIndx].eventType = "Weddings";
                        s.WedTaskList[createIndx].eventID = sessionStorage.getItem("New");
                        
                        
                        createIndx++;
                        constructChecklist();

                    } else {
                        createIndx = 0;
                    }
                }
                
                constructChecklist();
                
                var ChecklistData = { 'checklistdata': s.WedTaskList };
                h.post("../Event/setChecklist", ChecklistData).then(function (r) {
                    
                })


                
            })

            //h.post("../Event/getServiceListWedding").then(function (r) {
            //    createIndx = 0;
            //    console.log(r.data);
              
            //})
            //s.budget = [{
            //    "ServiceName": "Transpo",
            //    "BookCompany": 49,
            //    "CostEstimate": 50,
            //    "Paid": 4,
            //    "eventID": 1,
            //    "eventType": "Bday",
            //    "userID":1

            //}]
            s.budgetWed = [{ "ServiceName": "Caterer" },
                        { "ServiceName": "Cakes" },
                        { "ServiceName": "Venues" },
                        { "ServiceName": "Photographers" },
                        { "ServiceName": "Videographers" },
                        { "ServiceName": "Florists" },
                        { "ServiceName": "Music" },
                        { "ServiceName": "Hotels" },
                        { "ServiceName": "Transportation" },
                        { "ServiceName": "Jewelers" },
                        { "ServiceName": "Bridal Salon" },
                        { "ServiceName": "Menswear" },
                        { "ServiceName": "Artists" },
                        { "ServiceName": "Hosts" },
                        { "ServiceName": "Party Rentals" },
            ]

            //console.log(s.budget);
            h.post("../Event/setBudget", { "budget": s.budgetWed, "eventID": s.checkWedID, "eventType": "Weddings", "userID": userInfo[0].userID }).then(function (r) {
                //console.log("succe");
            })


            
           
            //
            //h.post("../Event/setBudget",bd ).then(function (r) {
            //    console.log(r.data);
            //})



        })
        
        //function constructChecklist() {s
        //    if (createIndx < TaskList.length) {
        //        TaskList.
        //    }
        //}
           
        
            


        }
        
    }

    s.createBday = function (data) {
        if (data.EventName && data.CelebFirstN && data.CelebLastN && data.CityID && data.CurAge && data.EstimatedBudget && data.EventDate && data.EventName && data.ProvID != null) {
           
            data.CityID = data.CityID.cityID;
            data.ProvID = data.ProvID.provinceID;
            data.userID = userInfo[0].userID;
            var BdayData = { 'BdayData': data };
            //console.log(data);

            h.post("../Event/createBday", BdayData).then(function (r) {
                //console.log("success");
                $('#modal-form').modal("hide");
                $('#modal-form').on('hidden.bs.modal', function (e) {
                    $(this)
                      .find("input,textarea,select")
                         .val('')
                         .end()
                      .find("input[type=checkbox], input[type=radio]")
                         .prop("checked", "")
                         .end();
                })
                toastr.options.closeButton = true;
                toastr.options.showMethod = 'slideDown';
                toastr.options.hideMethod = 'slideUp';
                toastr.options.progressBar = true;
                toastr.success("Successfully created an event!");
                getBday();
                $('#WeddingForm').hide();
                $('#BirthdayForm').hide();
                $('#ReunionForm').hide();
                $('#OtherForm').hide();
                //console.log(r.data);
                s.checkBdayID = r.data.BirthdayID;
                sessionStorage.setItem("New", r.data.BirthdayID);

                h.post("../Event/getTaskList?type=Birthdays").then(function (r) {
                    createIndx = 0;
                    s.BdayTasklist = r.data;
                    function constructChecklist() {
                        if (createIndx < r.data.length) {
                            s.BdayTasklist[createIndx].isFinished = 0;
                            s.BdayTasklist[createIndx].userID = userInfo[0].userID;
                            //s.WedTaskList[createIndx].eventType = "Weddings";
                            s.BdayTasklist[createIndx].eventID = sessionStorage.getItem("New");


                            createIndx++;
                            constructChecklist();

                        } else {
                            createIndx = 0;
                        }
                    }

                    constructChecklist();
                    //console.log(s.BdayTasklist);
                    var ChecklistData = { 'checklistdata': s.BdayTasklist };
                    h.post("../Event/setChecklist", ChecklistData).then(function (r) {
                        //console.log(r.data);
                    })


                    s.budgetWed = [
                        { "ServiceName": "Caterer" },
                        { "ServiceName": "Cakes" },
                        { "ServiceName": "Venues" },
                        { "ServiceName": "Photographers" },
                        { "ServiceName": "Videographers" },
                        { "ServiceName": "Music" },
                        { "ServiceName": "Entertainment" },
                        { "ServiceName": "Balloons" },
                        { "ServiceName": "Artists" },
                        { "ServiceName": "Hosts" },
                        { "ServiceName": "Party Rentals" },

                    ]

                    //console.log(s.budget);
                    h.post("../Event/setBudget", { "budget": s.budgetWed, "eventID": s.checkBdayID, "eventType": "Birthdays", "userID": userInfo[0].userID }).then(function (r) {
                        //console.log("succe");
                    })



                })
            })
        }
       
    }

    s.createFamReunion = function (data) { 
        if (data.EventName && data.EventDate && data.ProvID && data.CityID && data.EstimatedBudget != null) {
            data.ReunionType = "Family";
            data.ProvID = data.ProvID.provinceID;
            data.CityID = data.CityID.cityID;
            data.userID = userInfo[0].userID;
            var ReunionData = { 'ReunionData': data };           
            //console.log(data);

            h.post("../Event/createReunion", ReunionData).then(function (r) {
                //console.log("success");
                $('#modal-form').modal("hide");
                $('#modal-form').on('hidden.bs.modal', function (e) {
                    $(this)
                      .find("input,textarea,select")
                         .val('')
                         .end()
                      .find("input[type=checkbox], input[type=radio]")
                         .prop("checked", "")
                         .end();
                })
                toastr.options.closeButton = true;
                toastr.options.showMethod = 'slideDown';
                toastr.options.hideMethod = 'slideUp';
                toastr.options.progressBar = true;
                toastr.success("Successfully created an event!");
                getReunion();
                $('#WeddingForm').hide();
                $('#BirthdayForm').hide();
                $('#ReunionForm').hide();
                $('#OtherForm').hide();
                //console.log(r.data);
                s.checkFamID = r.data.ReunionID;
                sessionStorage.setItem("New", r.data.ReunionID);

                h.post("../Event/getTaskList?type=Reunions").then(function (r) {
                    createIndx = 0;
                    s.ReunionTaskList = r.data;
                    //console.log(s.ReunionTaskList);
                    function constructChecklist() {
                        if (createIndx < r.data.length) {
                            s.ReunionTaskList[createIndx].isFinished = 0;
                            s.ReunionTaskList[createIndx].userID = userInfo[0].userID;
                            //s.WedTaskList[createIndx].eventType = "Weddings";
                            s.ReunionTaskList[createIndx].eventID = sessionStorage.getItem("New");


                            createIndx++;
                            
                            constructChecklist();

                        } else {
                            createIndx = 0;
                        }
                    }

                    constructChecklist();
                    //console.log(s.ReunionTaskList);
                    var ChecklistData = { 'checklistdata': s.ReunionTaskList };
                    h.post("../Event/setChecklist", ChecklistData).then(function (r) {
                        //console.log(r.data);
                    })
                })

                s.budgetWed = [
                        { "ServiceName": "Caterer" },
                        { "ServiceName": "Venues" },
                        { "ServiceName": "Photographers" },
                        { "ServiceName": "Videographers" },
                        { "ServiceName": "Music" },
                        { "ServiceName": "Balloons" },
                        { "ServiceName": "Artists" },
                        { "ServiceName": "Hosts" },
                        { "ServiceName": "Party Rentals" },

                ]

                //console.log(s.budget);
                h.post("../Event/setBudget", { "budget": s.budgetWed, "eventID": s.checkFamID, "eventType": "Reunions", "userID": userInfo[0].userID }).then(function (r) {
                    //console.log("succe");
                })

            })
        }
      
    }

    s.createClassReunion = function (data) {
        
        //console.log(data);
        if (data.EventName && data.EventDate && data.ProvID && data.CityID && data.EstimatedBudget && data.Class && data.SchoolName != null) {
            data.ReunionType = "Class";
            data.ProvID = data.ProvID.provinceID;
            data.CityID = data.CityID.cityID;
            data.userID = userInfo[0].userID;
            var ReunionData = { 'ReunionData': data };
            //console.log(data.Class);

            h.post("../Event/createReunion", ReunionData).then(function (r) {
                //console.log("success");
                $('#modal-form').modal("hide");
                $('#modal-form').on('hidden.bs.modal', function (e) {
                    $(this)
                      .find("input,textarea,select")
                         .val('')
                         .end()
                      .find("input[type=checkbox], input[type=radio]")
                         .prop("checked", "")
                         .end();
                })
                toastr.options.closeButton = true;
                toastr.options.showMethod = 'slideDown';
                toastr.options.hideMethod = 'slideUp';
                toastr.options.progressBar = true;
                toastr.success("Successfully created an event!");
                getReunion();
                $('#WeddingForm').hide();
                $('#BirthdayForm').hide();
                $('#ReunionForm').hide();
                $('#OtherForm').hide();
                s.checkClassID = r.data.ReunionID;
                sessionStorage.setItem("New", r.data.ReunionID);

                h.post("../Event/getTaskList?type=Reunions").then(function (r) {
                    createIndx = 0;
                    s.ReunionTaskList = r.data;
                    function constructChecklist() {
                        if (createIndx < r.data.length) {
                            s.ReunionTaskList[createIndx].isFinished = 0;
                            s.ReunionTaskList[createIndx].userID = userInfo[0].userID;
                            //s.WedTaskList[createIndx].eventType = "Weddings";
                            s.ReunionTaskList[createIndx].eventID = sessionStorage.getItem("New");


                            createIndx++;
                            constructChecklist();

                        } else {
                            createIndx = 0;
                        }
                    }

                    constructChecklist();
                    //console.log(s.ReunionTaskList);
                    var ChecklistData = { 'checklistdata': s.ReunionTaskList };
                    h.post("../Event/setChecklist", ChecklistData).then(function (r) {
                        //console.log(r.data);
                    })
                })


                s.budgetWed = [
                       { "ServiceName": "Caterer" },
                       { "ServiceName": "Venues" },
                       { "ServiceName": "Photographers" },
                       { "ServiceName": "Videographers" },
                       { "ServiceName": "Music" },
                       { "ServiceName": "Balloons" },
                       { "ServiceName": "Artists" },
                       { "ServiceName": "Hosts" },
                       { "ServiceName": "Party Rentals" },

                ]

                //console.log(s.budget);
                h.post("../Event/setBudget", { "budget": s.budgetWed, "eventID": s.checkClassID, "eventType": "Reunions", "userID": userInfo[0].userID }).then(function (r) {
                    //console.log("succe");
                })
            })
        }
    }


    s.createParty = function (data) {
        if(data.EventName && data.EventDate && data.CityID && data.ProvID && data.EstimatedBudget != null){
            //console.log(data);
            data.ProvID = data.ProvID.provinceID;
            data.CityID = data.CityID.cityID;
            data.userID = userInfo[0].userID;
            var PartyData = { 'PartyData': data };
            
            h.post("../Event/createOtherParty", PartyData).then(function (r) {
                //console.log("success");
                $('#modal-form').modal("hide");
                $('#modal-form').on('hidden.bs.modal', function (e) {
                    $(this)
                      .find("input,textarea,select")
                         .val('')
                         .end()
                      .find("input[type=checkbox], input[type=radio]")
                         .prop("checked", "")
                         .end();
                })
                toastr.options.closeButton = true;
                toastr.options.showMethod = 'slideDown';
                toastr.options.hideMethod = 'slideUp';
                toastr.options.progressBar = true;
                toastr.success("Successfully created an event!");
                getOtherParty();
                $('#WeddingForm').hide();
                $('#BirthdayForm').hide();
                $('#ReunionForm').hide();
                $('#OtherForm').hide();
                s.checkOtherID = r.data.PartyID;
                sessionStorage.setItem("New", r.data.PartyID);

                h.post("../Event/getTaskList?type=Others").then(function (r) {
                    createIndx = 0;
                    s.OthersTaskList = r.data;
                    function constructChecklist() {
                        if (createIndx < r.data.length) {
                            s.OthersTaskList[createIndx].isFinished = 0;
                            s.OthersTaskList[createIndx].userID = userInfo[0].userID;
                            //s.WedTaskList[createIndx].eventType = "Weddings";
                            s.OthersTaskList[createIndx].eventID = sessionStorage.getItem("New");


                            createIndx++;
                            constructChecklist();

                        } else {    
                            createIndx = 0;
                        }
                    }

                    constructChecklist();
                    //console.log(s.OthersTaskList);
                    var ChecklistData = { 'checklistdata': s.OthersTaskList };
                    h.post("../Event/setChecklist", ChecklistData).then(function (r) {
                        //console.log(r.data);
                    })
                })


                s.budgetWed = [
                       { "ServiceName": "Caterer" },
                       { "ServiceName": "Venues" },
                       { "ServiceName": "Photographers" },
                       { "ServiceName": "Videographers" },
                       { "ServiceName": "Cakes" },
                       { "ServiceName": "Music" },
                       { "ServiceName": "Florists" },
                       { "ServiceName": "Balloons" },
                       { "ServiceName": "Entertainment" },
                       { "ServiceName": "Artists" },
                       { "ServiceName": "Hosts" },
                       { "ServiceName": "Hotel" },
                       { "ServiceName": "Menswear" },
                       { "ServiceName": "Party Rentals" },

                ]

                //console.log(s.budget);
                h.post("../Event/setBudget", { "budget": s.budgetWed, "eventID": s.checkOtherID, "eventType": "Others", "userID": userInfo[0].userID }).then(function (r) {
                    //console.log("succe");
                })

            })
        }
    }




    s.manageEvent = function (data) {
        //console.log(data);
        var id;
        if (data.Type == "Birthdays") {
            id=data.BirthdayID
        }
        else if (data.Type == "Weddings") {
            id = data.WeddingID;
            
        }
        else if (data.Type == "Reunions") {
            id = data.ReunionID;
            
        }
        else if (data.Type == "Others") {
            id = data.PartyID;
        }
        s.ManageDetails = [{ id: id, type: data.Type }];
        h.post("../Event/setEventSession");
        localStorage.Manage = JSON.stringify(s.ManageDetails);
        location.href = "/../Event/Checklist";
    }


    s.Logout = function () {
        //console.log("logoutfunct");
        
        h.post("../Accounts/Logout").then(function (r) {
            localStorage.clear();
            location.href = "/LandingPage/Index";
        })
        
    }

    
}])


