
window.fbAsyncInit = function () {
    FB.init({
        appId: '267562477493184',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.12'
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));





module.controller("SearchVendorMgmt", ["$scope", "$http","$interval","$filter","$rootScope", function (s, h,i,f,rs) {
    var userInfo = JSON.parse(localStorage.userInfo);
    var eventInfo = JSON.parse(localStorage.Manage);
    s.BookDate = 0;
    s.BookEnd = 0;
    s.DateSelCounter = true;
    s.showprov = true;
    s.hideFilt = false;

    $('#loadSpinner').hide();
    $('#searchContent').show();
  

    angular.element(document).ready(function () {
       
    });

    BookmarkedVendor();
    
    //console.log();
    loadServices();
    //getAllProv();
    getEventTitle();
    //loaded();
    getCityDav();
    
    s.Selection = 0;
    s.ShowVendorInfo = 0;
    s.cityname = 0;
    s.provname = 0;
    s.TotalRate = 0;
    s.isBookmarked = 0;
    s.Fin = 0;
    s.myHub = $.connection.chatHub;
    

    
   

    $('#timeStart').timepicker({
        zindex: 10052,
        timeFormat: 'h:mm p',
        interval: 30,
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: function (time) {
            var element = $(this), text;
            var timepicker = element.timepicker();
            s.eventStartx=timepicker.format(time);
        }
    });
    $('#timeEnd').timepicker({
        zindex: 10052,
        timeFormat: 'h:mm p',
        interval: 30,
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: function (time) {
            var element = $(this), text;
            var timepicker = element.timepicker();
            s.eventEndx = timepicker.format(time);
        }
    });
    
    s.Img = "";
    s.city = "";
    s.rates = [
          { rate: "0", name: "Worst!",color:"Red" },
          { rate: "1", name: "Unsatisfied", color: "Red" },
          { rate: "2", name: "Average", color: "Orange" },
          { rate: "3", name: "Satisfactory", color: "Green" },
          { rate: "4", name: "Perfect!", color: "Green" },
    ];
    s.rateNum = -1;

    s.loadSchedSel = function () {
        console.log(s.VendorDetails.CompanyID); 
        h.post("../Vendor/getBookingsCalendar?CompanyID=" + s.VendorDetails.CompanyID).then(function (r) {
            s.schedsel = r.data;
            console.log(s.schedsel);
        }).then(function () {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();
            $('#calendar').fullCalendar('destroy');
            $('#calendar').fullCalendar({
                contentHeight: 400,
                selectable: true,
                nextDayThreshold:"00:00:00",
                allDayDefault: false,
                events:s.schedsel,
                timeFormat: '',
                eventAfterRender: function (event, element, view) {
                    var title = element.find('.fc-title');
                    if (event.booksched == "null") {
                        title.html(title.text = "Full Booked");
                    }
                    else {
                        title.html(title.text = event.booksched);
                    }
                },
                dayClick: function (date) {
                    
                },
                select: function (startDate, endDate, allDay,jsEvent,view) {
                    //alert('selected ' + startDate.format() + ' to ' + endDate.subtract('1', 'days').format());
                    s.BookDate = startDate.format();
                    s.BookEnd = endDate.format();
                    s.$apply(function () {
                        s.DateSelCounter = false;
                       
                        var a = moment(s.BookDate);
                        var b = moment(s.BookEnd);
                        s.BookDiff = b.diff(a, 'days');

                       


                        console.log(s.BookDate);

                       
                        
                    })


                },

              
            });


        })
    }


    function IsDateHasEvent(date) {
         s.allEvents = [];
        s.allEvents = $('#calendar').fullCalendar('clientEvents');
        var event = $.grep(s.allEvents, function (v) {
            return +v.start === +date;
        });
        return event.length > 0;
    }

    function isBooked() {
        h.post("../Vendor/ifBooked", { "eventID": eventInfo[0].id, "eventType": eventInfo[0].type, "CompanyID": s.VendorDetails.CompanyID }).then(function (r) {
            if (r.data != 0) {
                console.log(r.data);
                s.ifRated();
                s.Booked = true;
            }
            else {
                s.Booked = false;
            }
        })
    }

    function loadCompanySched() {
        h.post("../Vendor/getBookingsCalendar?CompanyID=" + s.VendorDetails.CompanyID).then(function (r) {
            s.sched = r.data;
            console.log(s.VendorDetails.CompanyID);
            console.log(s.sched);
        }).then(function () {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();
            $('#calendar1').fullCalendar('destroy');
            $('#calendar1').fullCalendar({
                contentHeight: 400,
                selectable: true,
                allDayDefault: false,
                timeFormat: '',
                nextDayThreshold:"00:00:00",
                events: s.sched,
                eventAfterRender: function (event, element, view) {
                    var title = element.find('.fc-title');
                    if (event.booksched == "null") {
                        title.html(title.text = "Full Booked");
                    }
                    else {
                        title.html(title.text = event.booksched);
                    }
                  
                }
            });
        })
    }


    s.SendBookRequest = function (data) {
        
        if (data == undefined) {
            data = "Hello, I would like to request a booking of your services.";
        }
        var bookDet = {
            
            BookMsg: data,
            BookDate: s.BookDate + " " + s.eventStartx,
            BookDateEnd: s.subtractEndDateBook(s.BookEnd) + " " + s.eventEndx,
            eventID: eventInfo[0].id,
            eventType: eventInfo[0].type,
            eventTitle:s.EventName,
            userID: userInfo[0].userID,
            companyID: s.VendorDetails.CompanyID,
            BookStatus: 0,
            BookSched:s.eventStartx+"-"+s.eventEndx

        };
        console.log(bookDet);
        h.post("../Vendor/getSpBook", { 'startD': s.BookDate }).then(function (r) {
            if(r.data.length==0){
                var notifDet = {
                    notifContent: userInfo[0].firstname + " " + userInfo[0].lastname + " requests a booking",
                    userID: s.VendorDetails.userID,
                    type: "Book"
                };

                var notifData = { 'notif': notifDet };
                var BookData = { 'booking': bookDet };
                h.post("../Notification/saveNotif", notifData).then(function (r) {

                })
                h.post("../Accounts/getConID?userID=" + s.VendorDetails.userID).then(function (r) {
                    //console.log(r.data);
                    s.myHub.server.notifyBook(r.data);
                })
                swal("Book Request Sent", "System will notify for response", "success");
                $('#RequestBook').modal("hide");
                h.post("../Vendor/saveBooking", BookData).then(function (r) {
                    //console.log("success");
                    s.BookDate = 0;
                    s.BookEnd = 0;
                })
            }
            else {

           
            
            console.log(r.data);
            
            var sd= moment(r.data[0].BookDate).format('h:mm A');
            var ed=moment(r.data[0].BookDateEnd).format('h:mm A');
            var selsd=s.eventStartx;
            var seled = s.eventEndx;
            var sdd = moment(sd, ["h:mm A"]).format("HH.mm");
            var edd = moment(ed, ["h:mm A"]).format("HH.mm");
            var dt = moment(s.eventStartx, ["h:mm A"]).format("HH.mm");
            var dte = moment(s.eventEndx, ["h:mm A"]).format("HH.mm");
            console.log(sdd);
            console.log(edd);
            console.log(dt);
            console.log(dte)
            if (((sdd <= dt) && (edd >= dt)) || ((sdd <= dte) && (edd >= dte))) {
                swal("Time selected already have a booking", "Please set time", "error");
            }
            else {
                if ((sdd > dt) && (edd < dte)) {
                    swal("Time selected already have a booking", "Please set time", "error");
                }
                else {
                    var notifDet = {
                        notifContent: userInfo[0].firstname + " " + userInfo[0].lastname + " requests a booking",
                        userID: s.VendorDetails.userID,
                        type: "Book"
                    };

                    var notifData = { 'notif': notifDet };
                    var BookData = { 'booking': bookDet };
                    h.post("../Notification/saveNotif", notifData).then(function (r) {

                    })
                    h.post("../Accounts/getConID?userID=" + s.VendorDetails.userID).then(function (r) {
                        //console.log(r.data);
                        s.myHub.server.notifyBook(r.data);
                    })
                    swal("Book Request Sent", "System will notify for response", "success");
                    $('#RequestBook').modal("hide");
                    h.post("../Vendor/saveBooking", BookData).then(function (r) {
                        //console.log("success");
                        s.BookDate = 0;
                        s.BookEnd = 0;
                    })
                }

            }
            }
        })
       
     


        
    }

    s.SendMessage = function (msg) {
        //console.log(msg);
        //console.log(userInfo[0].userID);
        //console.log(s.VendorDetails.userID);

        s.NewMsg = { Msg: msg, SenderID: userInfo[0].userID, RecieverID: s.VendorDetails.userID };
        h.post("../Accounts/getConID?userID=" + s.VendorDetails.userID).then(function (r) {
            //console.log(r.data);
            s.myHub.server.notifyPM(r.data);
        })
        h.post("../Message/saveMessages", { msg: s.NewMsg }).then(function (r) {
            swal({
                title: "Message Sent",
                timer: 4000,
                type: "success"
            })
            $('#SendMessage').modal('hide');
            s.msg = "";

            
        })
        //console.log(s.VendorDetails);
        //console.log(s.NewMsg);
    }

    function ServiceChecklist() {
        setActive(3);
        
        if (rs.ServiceID != undefined) {

            //console.log(rs.ServiceID);
            s.ServiceType = s.ServiceList[rs.ServiceID-1];
            
            h.post("../Vendor/getServVendor?serviceID=" + rs.ServiceID).then(function (r) {
                console.log(r.data);
                s.CompanyList = r.data;
                s.Selection = 1;
                s.ShowVendorInfo = 0;
                s.showprov = false;
                rs.ServiceID = undefined;
            })
            
         }
         else {
             
        }
       
    }

    function BookmarkedVendor() {
        
        if (rs.CompanyName != undefined) {
            console.log(rs.CompanyName);
            h.post("../Vendor/getSpVendor?companyName=" + rs.CompanyName).then(function (r) {
                console.log(r.data);
                s.CompanyList = r.data;
                s.Selection = 1;
                s.ShowVendorInfo = 0;
                s.showprov = false;
                rs.CompanyName = undefined;
                
            })
        }
    }


    bookmarkInfo();
    function bookmarkInfo() {
        
        if (rs.CompanyName != undefined) {
            //console.log(rs.CompanyName);
            
            s.BookmarkTimer = i(function () {
                if (s.CompanyListOrig != undefined && s.Fin == 1) {
                    i.cancel(s.BookmarkTimer);
                    //s.CompanyList = filterName(rs.CompanyName);

                    //console.log(s.CompanyList);
                    s.Selection = 1;
                    s.ShowVendorInfo = 0;
                }
            })

           
        }
       

    }

    function checkBookmark(userid, companyid) {
        h.post("../Accounts/checkBookmark?userID=" + userid + "&CompanyID=" + companyid).then(function (r) {
            s.BookmarkInfo = r.data;
            if (r.data.length != 0) {
                s.isBookmarked = 1;
            }
            else {
                s.isBookmarked = 0;
            }
        })
    }


    s.setBookmark = function (data) {
        if(s.isBookmarked == 0){
        h.post("../Accounts/saveBookmark?userID="+userInfo[0].userID+"&CompanyID="+data.CompanyID).then(function(r){
            //console.log(r.data);
            swal({
                title: "Successfully Bookmarked",
                timer: 2000,
                type:"success"
            })
            s.isBookmarked = 1;
        })
        }
        else {
          
            h.post("../Accounts/removeBookmark?userID=" + userInfo[0].userID + "&CompanyID=" + data.CompanyID).then(function (r) {
                swal({
                    title: "Bookmark Removed",
                    timer: 2000,
                    type:"success"
                })
                s.isBookmarked = 0;
            })

        }
    }


    s.getRatings = function () {
        h.post("../Vendor/getRateNew?CompanyID=" + s.VendorDetails.CompanyID).then(function (r) {
            s.RatingList = r.data;
            //console.log(s.RatingList);
            
          
        })
    }

    s.SaveRating = function (data) {
        if (data == null || data.Comment.length == 0 ) {
            //console.log("null");
            
            swal({
                title: "Please add a comment",
                timer:2000,
                type: "error"

            });
        }
        else if (s.rateNum == -1) {
            swal({
                title: "Please choose a rating",
                timer: 2000,
                type: "error"

            });
        }
        else{
       
            s.RateDetails = data;
            s.RateDetails.CompanyID = s.VendorDetails.CompanyID;
            s.RateDetails.userID = userInfo[0].userID;
            s.RateDetails.DateRated = f('date')(new Date(), 'MMMM dd,yyyy');
            s.RateDetails.Rating = parseInt(s.rateNum)+1;
            //console.log(s.RateDetails);
            var rating = { 'rate': s.RateDetails };
            var notifDet = {
                notifContent: userInfo[0].firstname + " " + userInfo[0].lastname + " has rated your company",
                userID: s.VendorDetails.userID,
                type: "Rate"
            };
            h.post("../Notification/saveNotif", {'notif':notifDet}).then(function (r) {

            })
            h.post("../Vendor/createRate", rating).then(function (r) {
                swal({
                    title: "Feedback will be loaded in a short while",
                    type:"success"
                })
                $('#ReviewRate').modal('hide');
                s.getRatings();
            })
            h.post("../Accounts/getConID?userID=" + s.VendorDetails.userID).then(function (r) {
                //console.log(r.data);
                s.myHub.server.notifyRate(r.data);
            })
        }
    }
   
    s.Starhover = function (data) {
        s.origRate = s.rateNum;
        s.rateNum = data.rate;
    }
    s.Starleave = function (data) {
        s.rateNum = s.origRate;
    }

    s.Starclick = function (data) {
        s.rateNum = data.rate;
        s.origRate = data.rate;
    }

    
    function loadServices() {
        h.post("../Event/getServices").then(function (r) {
            s.ServiceList = r.data;
            
           
          
            //getCompany();
            return ServiceChecklist();
        }).then(function () {
            
                
            
        })
    }

    function getTotalRating(CompanyID) {
        indx = 0;
        CmpnyRate = 0;
        h.post("../Vendor/getRate?CompanyID=" +CompanyID).then(function (r) {
            
            s.Ret = r.data;
        })
       
    }
  

        s.ifRated = function () {
            s.isRated = 0;
            h.post("../Vendor/ifRated", { "userID": userInfo[0].userID, "CompanyID": s.VendorDetails.CompanyID }).then(function (r) {
                //console.log(r.data);
                
                if (r.data != 0) {
                    s.isRated = 1;
                  
                }
            })
        }

        s.searchv = function () {
            swal({
                title: "Search vendor",
                text: "Vendor Name",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "Enter vendor name"
            }, function (inputValue) {
               
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }

                h.post("../Vendor/getSpVendor?companyName="+inputValue).then(function(r){
                    console.log(r.data);
                    s.CompanyList = r.data;
                    s.Selection = 1;
                    s.ShowVendorInfo = 0;
                    s.showprov = false;

                    if (r.data.length > 0) {
                        swal("Search Succcess", "Found " + r.data.length + " Vendor(s)", "success");
                    }
                    else {
                        swal.showInputError("Found 0 Vendor(s)");
                    }
                })
                
                //s.$apply(s.CompanyList = filterName(inputValue));
                ////if(s.CompanyList.length!=0){
                //s.$apply(s.Selection = 1);
                //s.$apply(s.ShowVendorInfo = 0);
                //swal("Search Succcess", "Found " + s.CompanyList.length + " Vendor(s)", "success");
                //}
                //else {
                //    swal.showInputError("Found 0 Vendor(s)");
                //}
                //console.log(s.CompanyList);
            });
           
        }
        s.clearFilt = function () {
            s.Prov = "";
            s.ServiceType = "";
            s.City = "";
            s.Selection = 0;
            s.provname = "";
            s.cityname = "";
            s.showprov = true;
        }

        s.SelChange = function (data) {
            s.showprov = false;
            console.log(data);
            console.log(s.City);
          
            if (s.City == undefined) {

                
                cityParam = "Select City from tbl_cities where provinceID=28";
                
            }
            else {
                cityParam = "'"+s.City.cityName+"'";
            }

            console.log(cityParam);
            //s.ServiceType = data.ServiceType.ServiceName
            h.post("../Vendor/getVendorList", { "city": cityParam,"servtype":data.ID }).then(function (r) {
                console.log(r.data);
                s.CompanyList = r.data;
            })
            
            s.Selection = 1;
            s.ShowVendorInfo = 0;
           
            //s.CompanyList = filterService(data.ServiceName);
            //s.Prov={$$hashKey: "object:106",
            //        name: "Davao del Norte",
            //        provinceID: 28}

            //s.provChange(s.Prov);


            
           
        }

        s.cityChange = function (data) {

            if (data == undefined) {

            }
            else {
                console.log(data);
                if (s.ServiceType == undefined) {
                    servID = 0;
                }
                else {
                    servID = s.ServiceType.ID
                }
                s.Selection = 1;
                s.ShowVendorInfo = 0;

                h.post("../Vendor/getVendorList", { "city": "'" + data.cityName + "'", "servtype": servID }).then(function (r) {
                    console.log(r.data);
                    s.CompanyList = r.data;
                })
            }
        }
        
    
        s.VendorInfo = function (data) {
            console.log(data);
            if (data.PageID != null) {
                s.fbShow(data.PageID);
            }
          
           
            s.ShowVendorInfo = 1;
            s.hideFilt = true;
            s.VendorDetails = data;
            
            isBooked();
            //console.log(s.VendorDetails);
            loadCompanySched();
            checkBookmark(userInfo[0].userID, s.VendorDetails.CompanyID);
            s.RatingList = null;
            h.post("../Vendor/getOwnedService?userID=" + data.userID + "&companyID=" + data.CompanyID).then(function (r) {
                s.OwnComp = r.data;
                console.log(r.data);

              
            })
            h.post("../Accounts/getImg?ID=" + s.VendorDetails.CompanyID).then(function (r) {
                //console.log(r.data);
                s.Img = r.data;
                
                s.getRatings();
            })
            
           
            //s.timer=i(function () {
            //    if (s.Img != "") {
            //        s.ShowVendorInfo = 1;
            //        s.Selection = 0;
                    
                    
            //        i.cancel(s.timer);
            //    }
            //}, 100);

            
            //s.RateTimer = i(function () {
            //    if (s.RatingList != null) {
            //        i.cancel(s.RateTimer);
            //        if (s.RatingList == 0) {
                       
            //            s.VendorDetails.TotalRate = s.TotalRate;
            //        }
            //        else {
            //            //console.log(s.RatingList.length);
            //            indx = 0;
            //            x();
            //            function x() {
            //                if (indx < s.RatingList.length){
            //                    h.post("../Accounts/GetByID?ID=" + s.RatingList[indx].userID).then(function (r) {
                                   
                                   
            //                        s.RatingList[indx].userfname = null;
            //                        s.RatingList[indx].userlname = null;
            //                        s.RatingList[indx].userprofpic = null;
            //                        s.RatingList[indx].userfname = r.data[0].firstname;
            //                        s.RatingList[indx].userlname = r.data[0].lastname;
            //                        s.RatingList[indx].userprofpic = r.data[0].profpath;
            //                        s.TotalRate = s.TotalRate + s.RatingList[indx].Rating;
                                   
            //                    })
                                
            //                    s.changetimer = i(function () {
            //                        if (s.RatingList[indx].userfname != null && s.RatingList[indx].userlname != null && s.RatingList[indx].userprofpic != null) {
            //                            i.cancel(s.changetimer);
            //                            indx++;
            //                            x();
                                        
            //                        }
            //                    }, 100);
                                
            //                }
            //                else {
            //                    indx = 0;
            //                    s.TotalRate = s.TotalRate / s.RatingList.length;
            //                    s.TotalRate = Math.round(s.TotalRate);
            //                    s.VendorDetails.TotalRate = s.TotalRate;
            //                    s.TotalRate = 0;
                                
            //                }
                            
                           
            //            }
            //        //h.post("../Accounts/GetByID?ID=" + s.RatingList[0].userID).then(function (r) {
            //        //    s.RatingList[0].userfname = r.data[0].firstname;
            //        //    s.RatingList[0].userlname = r.data[0].lastname;
            //        //    s.RatingList[0].userprofpic = r.data[0].profpath;
            //        ////    console.log(s.RatingList);
            //        //})
            //        }
            //    }
            //},100)
            
            
           
        }

        s.showdet = function (data) {
            console.log(data);
            s.VendorList();
            rs.CompanyName = data.CompanyInfo.CompanyName;
            BookmarkedVendor();
            s.fbRemove();
        }

        s.VendorList = function () {
            s.Selection = 1;
            s.ShowVendorInfo = 0;
            s.hideFilt = false;
            //console.log("aw");
            s.isBookmarked = 0;
            s.fbRemove();
        }

        function provNamex(provID) {
            return s.province.filter(function (pv) { return (pv.provinceID == provID) })[0].name;

        }

        function filterService(sName) {
            //console.log(s.CompanyListOrig)
            if(s.provname==0){
                return s.CompanyListOrig.filter(function (pv) { return (pv.ServiceName == sName ) });
            }
            else if(s.provname != 0 && s.cityname != 0){
                return s.CompanyListOrig.filter(function (pv) { return (pv.ServiceName == sName && pv.Province == s.provname && pv.City == s.cityname) });
            }
            else if (s.provname != 0 && s.cityname == 0) {
                return s.CompanyListOrig.filter(function (pv) { return (pv.ServiceName == sName && pv.Province == s.provname) });
            }
        }

        function filterlocService() {
            if (s.cityname == 0) {
                return s.CompanyListOrig.filter(function (pv) { return (pv.Province ==s.provname && pv.ServiceName==s.ServiceType.ServiceName) })
            }
            else if (s.cityname != 0) {
                return s.CompanyListOrig.filter(function (pv) { return (pv.Province == s.provname && pv.ServiceName == s.ServiceType.ServiceName && pv.City==s.cityname) })
            }
           
        }

        function filterName(val) {
           return s.CompanyListOrig.filter(function(pv){return (pv.CompanyName== val)})
        }

        function getAllCity() {
            h.post("../Event/getAllCity").then(function (r) {
                s.allcity = r.data;

            })
        }


        function getEventTitle() {
            if (eventInfo[0].type == "Birthdays") {
                h.post("../Event/getBirthdayDet?eventID=" + eventInfo[0].id).then(function (r) {

                    s.EventName = r.data.EventName;

                })
               
            }
            else if (eventInfo[0].type == "Weddings") {
                h.post("../Event/getWeddingDet?eventID=" + eventInfo[0].id).then(function (r) {
                    s.EventName = r.data.EventName;
                })
           
            }
            else if (eventInfo[0].type == "Reunions") {
                h.post("../Event/getReunionDet?eventID=" + eventInfo[0].id).then(function (r) {
                    s.EventName = r.data.EventName;
                })
            
            }
            else if (eventInfo[0].type == "Others") {
                h.post("../Event/getOtherPartyDet?eventID=" + eventInfo[0].id).then(function (r) {
                    s.EventName = r.data.EventName;
                })
            }
        }

        function getCityDav() {
            h.post("../Event/getCity?provName=Davao del Norte").then(function (r) {
                
                s.city = r.data;
            })
        }

        

      
    

        s.vendorSched = function () {
            $('#VendorSched').modal("show");
        }

        $('#RequestBook').on('shown.bs.modal', function () {
            $("#calendar").fullCalendar('render');
          
        });
        $('#VendorSched').on('shown.bs.modal', function () {
            $("#calendar1").fullCalendar('render');

        });

      

        s.convertJsonDate = function (date) {


            return moment(date).format('MMM DD,YYYY');


        }

        s.subtractEndDate = function (date) {
            return moment(date).subtract(1, 'days').format("MMM DD,YYYY");

        }

        s.subtractEndDateBook = function (date) {
            return moment(date).subtract(1, 'days').format("YYYY-MM-DD");
        }

       
    





        s.fbShow = function (pid) {
            
            let fbChatDiv = document.createElement('div');

            fbChatDiv.className = 'fb-customerchat';
            fbChatDiv.setAttribute('page_id', ""+pid+"");
            fbChatDiv.setAttribute('ref', '');
           

            document.body.appendChild(fbChatDiv);

            //FB.CustomerChat.hide();
            FB.XFBML.parse();
        }




        s.fbRemove = function () {
            $('.fb-customerchat').remove();
            $('.fb_dialog').remove();
        }

}])