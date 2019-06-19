module.controller("BookingMgmt", ["$scope", "$http","$interval", function (s, h,i) {
    var userInfo = JSON.parse(localStorage.userInfo);
    var companyInfo = JSON.parse(localStorage.companyID);
    s.BdayCounter = 0;
    s.CompanyID=0;
    s.WeddingCounter = 0;
    s.ReunionCounter = 0;
    s.OtherCounter = 0;
    s.SelectedRow = null;
    s.Tab1 = 1;
    s.Tab2 = 0;
    setActiveV(3);
    //console.log("Boook!");
    s.myHub = $.connection.chatHub;
    
    initBooklist();
    initBookings();
    
    function initBooklist() {
        h.post("../Vendor/getCompanyID?userID=" + userInfo[0].userID).then(function (r) {
            s.CompanyID = companyInfo.CompanyID;
            console.log(s.CompanyID);
            return h.post("../Vendor/getPendingBookings?CompanyID=" + s.CompanyID);
        }).then(function (r) {
            console.log(r.data);
            s.Pendinglist = r.data;
            h.post("../Vendor/getVendorInfo?CompanyID=" + s.CompanyID).then(function (r) {
                //console.log(r.data);
                s.CompanyDetails = r.data;
            })
            
        })
       
    }

    function initBookings() {
        s.IDinterval = i(function () {
            if (s.CompanyID == 0) {
                //console.log("empty")
            }
            else {
                
                i.cancel(s.IDinterval);
                h.post("../Vendor/getBookings?CompanyID=" + companyInfo.CompanyID).then(function (r) {
                    s.BookingList = r.data;
                    //console.log(s.BookingList);
                })
            }
        })
    }

    s.showBookDetails = function (data) {
        //console.log(data);
        s.SelectedRow = data.$$hashKey;
        s.BookDetails = data;
        $("#EventDetDiv").fadeOut(1);
        $("#EventDetDiv").fadeIn(1000);
        if (s.BookDetails.eventType == "Birthdays") {
            h.post("../Event/getBirthdayDet?eventID=" + s.BookDetails.eventID).then(function (r) {
                s.BdayDet = r.data;
                s.BdayDet.EventDate = s.convertJsonDate(s.BdayDet.EventDate);
               
                s.WeddingCounter = 0;
                s.ReunionCounter = 0;
                s.OtherCounter = 0;
                s.BdayCounter = 1;
                //console.log(s.BdayDet);
            })
        }
        else if (s.BookDetails.eventType == "Weddings") {
            h.post("../Event/getWeddingDet?eventID=" + s.BookDetails.eventID).then(function (r) {
                s.WedDet = r.data;
                s.WedDet.EventDate = s.convertJsonDate(s.WedDet.EventDate);
                //console.log(s.WedDet);
                s.BdayCounter = 0;
                s.ReunionCounter = 0;
                s.OtherCounter = 0;
                s.WeddingCounter = 1;
            })
           
        }
        else if (s.BookDetails.eventType == "Reunions") {
            h.post("../Event/getReunionDet?eventID=" + s.BookDetails.eventID).then(function (r) {
                s.ReunDet = r.data;
                s.ReunDet.EventDate = s.convertJsonDate(s.ReunDet.EventDate);
                //console.log(r.data);
                //console.log("reun");
                s.BdayCounter = 0;
                s.WeddingCounter = 0;
                s.OtherCounter = 0;
                s.ReunionCounter = 1;
            })
            
        }
        else if (s.BookDetails.eventType == "Others") {
            h.post("../Event/getOtherPartyDet?eventID=" + s.BookDetails.eventID).then(function (r) {
                s.OtherDet = r.data;
                s.OtherDet.EventDate = s.convertJsonDate(s.OtherDet.EventDate);
                //console.log(s.OtherDet);
                //console.log("other");
                s.BdayCounter = 0;
                s.WeddingCounter = 0;
                s.ReunionCounter = 0;
                s.OtherCounter = 1;
            })
            
        }
    }
    s.sendMessage = function () {
        //console.log(s.BookDetails);
        //console.log("ey");
        swal({
            title: "Send Message",
            text: "Write something..",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "Write something"
        }, function (inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            s.Msg = {
                'Msg': inputValue,
                'SenderID': userInfo[0].userID,
                'RecieverID': s.BookDetails.userID
            }
            h.post("../Accounts/getConID?userID=" + s.BookDetails.userID).then(function (r) {
                //console.log(r.data);
                s.myHub.server.notifyPM(r.data);
            })
            h.post("../Message/saveMessages", { msg: s.Msg }).then(function (r) {
                swal("Message Sent", '', "success");
            })




        });
    }

    s.showTermModal = function (data) {
        $('#termscond').modal("show");
        s.bookterm = data;
        s.term.termInp = "";
        s.dateTerm = "";
    }

    s.calcDate = function (data) {
        //console.log(moment(s.bookterm.BookDate).subtract(data.termInp, data.termType).format("MMM DD, YYYY"));
        s.bookterm.CancelDate = moment(s.bookterm.BookDate).subtract(data.termInp, data.termType).format("MMM DD, YYYY");
        console.log(s.bookterm);
        
        
    }

    s.AcceptBooking = function (data) {
        console.log(data);
        s.bookterm.Terms = data;
        console.log(s.bookterm);
        //console.log(s.CompanyDetails);
       
        //updateClientBudget(data);
        var BookData = { 'booking': s.bookterm };
        var notifDet = {
            notifContent: s.CompanyDetails[0].CompanyName + " has responded to your request",
            userID: s.bookterm.userID,
            type: "uBook"
        };
        h.post("../Notification/saveNotif", { 'notif': notifDet }).then(function (r) {

        })
        h.post("../Accounts/getConID?userID=" + s.bookterm.userID).then(function (r) {
            console.log(r.data);
            
            s.myHub.server.notifyAcceptReq(r.data, s.CompanyDetails[0].CompanyName);
        })

        h.post("../Vendor/SetBooking", BookData).then(function (r) {
            swal("Response Sent!", "", "success");
                initBooklist();
                initBookings();
                $('#termscond').modal("hide");
        })

        //h.post("../Vendor/AcceptBooking", BookData).then(function (r) {
        //    swal("Booking Saved Successfully!", "Go to Calendar Section to see updated booking schedule", "success");
        //    initBooklist();
        //    initBookings();
        //})
    }

    function updateClientBudget(data)
    {
        
        console.log(data.eventID);
        if (s.CompanyDetails[0].ServiceName =="Reception Venues") {
            var servname = "Venues";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID,'price':s.CompanyDetails[0].EndPrice,'CompanyID':s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Caterers") {
            var servname = "Caterer";
            
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Photographers") {
            var servname = "Photographers";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Videographers") {
            var servname = "Videographers";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Bridal Salon") {
            var servname = "Bridal Salon";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Menswear (Tuxedo Rentals and Accesories)") {
            var servname = "Menswear";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Hotels") {
            var servname = "Hotels";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Florists") {
            var servname = "Florists";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Cakes and Pastries") {
            var servname = "Cakes";
            console.log(data.eventID + " " + data.eventType + " " + servname + " " + data.userID + " " + s.CompanyDetails[0].EndPrice + " " + s.CompanyDetails[0].CompanyID)
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Jewelers") {
            var servname = "Jewelers";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Artists (Makeup Artists, Face painters, Calligraphers)") {
            var servname = "Artists";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Transportation") {
            var servname = "Transportation";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Band/DJ/Music") {
            var servname = "Music";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Entertainment (Clowns, Magicians , Dancers, Variety Acts)") {
            var servname = "Entertainment";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Party Rentals") {
            var servname = "Party Rentals";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Hosts (Master of Ceremony)") {
            var servname = "Hosts";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
        else if (s.CompanyDetails[0].ServiceName == "Balloons") {
            var servname = "Balloons";
            h.post("../Event/updateClientBudget", { 'eventID': data.eventID, 'eventType': data.eventType, 'serviceName': servname, 'userID': data.userID, 'price': s.CompanyDetails[0].EndPrice, 'CompanyID': s.CompanyDetails[0].CompanyID }).then(function (r) {
                //console.log(r.data);
            })
        }
    }


    s.AcceptCancel = function (data) {
        swal({
            title: "Accept the cancellation?",
            text: "Accepting will remove the client to the book list",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm:false,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No!"
        },function(isConfirm){
            if (isConfirm) {
                var notifDet = {
                    notifContent: s.CompanyDetails[0].CompanyName + " has accepted your cancellation",
                    userID: data.userID,
                    type: "uBook"
                };
                h.post("../Notification/saveNotif", { 'notif': notifDet }).then(function (r) {

                })
                h.post("../Accounts/getConID?userID=" + data.userID).then(function (r) {
                    //console.log(r.data);
                    s.myHub.server.notifyAcceptReq(r.data, s.CompanyDetails[0].CompanyName);
                })

                h.post("../Vendor/CancelBooking?bookID=" + data.BookID).then(function (r) {
                    swal("Booking Removed!", "", "success");

                    initBooklist();
                    initBookings();

                })


            }
        })
    }
    s.DeclineBooking = function (data) {
        var BookData = { 'booking': data };
        //swal({
        //    title: "Decline this booking?",
        //    text: "Are you sure?",
        //    type: "warning",
        //    showCancelButton: true,
        //    confirmButtonColor: '#DD6B55',
        //    confirmButtonText: 'Yes, I am sure!',
        //    cancelButtonText: "No!"
        //}).then(function () {
        //    swal({
        //        title: "Booking Declined",
        //        timer: 4000,
        //        type: "success"
        //    })
        //})

        swal({
                title: "Decline this booking?",
                text: "Are you sure?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, I am sure!',
                cancelButtonText: "No!",
                closeOnConfirm: false,
                
        },
        function (isConfirm) {

            if (isConfirm) {
                var notifDet = {
                    notifContent: s.CompanyDetails[0].CompanyName + " has declined your booking",
                    userID: data.userID,
                    type: "uBook"
                };
                h.post("../Notification/saveNotif", { 'notif': notifDet }).then(function (r) {

                })
                h.post("../Accounts/getConID?userID=" + data.userID).then(function (r) {
                    //console.log(r.data);
                    s.myHub.server.notifyDeclineReq(r.data, s.CompanyDetails[0].CompanyName);
                })

                h.post("../Vendor/DeclineBooking", BookData).then(function (r) {
                    swal("Booking Declined!", "", "success");
                    s.BdayCounter = 0;
                    s.WeddingCounter = 0;
                    s.ReunionCounter = 0;
                    s.OtherCounter = 0;
                    initBooklist();
                    
                })
               

            } 
 });
    }

    s.DeclineCancel = function (data) {
        swal({
            title: "Decline Request?",
            text: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No!",
            closeOnConfirm: false,

        },
       function (isConfirm) {

           if (isConfirm) {
               var BookData = { 'booking': data };
               var notifDet = {
                   notifContent: s.CompanyDetails[0].CompanyName + " has declined your cancellation",
                   userID: data.userID,
                   type: "uBook"
               };
               h.post("../Notification/saveNotif", { 'notif': notifDet }).then(function (r) {

               })
               h.post("../Accounts/getConID?userID=" + data.userID).then(function (r) {
                   //console.log(r.data);
                   s.myHub.server.notifyDeclineReq(r.data, s.CompanyDetails[0].CompanyName);
               })
                h.post("../Vendor/AcceptBooking", BookData).then(function (r) {
                   swal("Request Denied", "", "success");
                   initBooklist();
                   initBookings();
               })


           }
       });
    }

    s.goTab1 = function () {
        s.Tab1 = 1;
        s.Tab2 = 0;
    }
    
    s.goTab2 = function () {
        s.Tab1 = 0;
        s.Tab2 = 1;
        
    }

        s.convertJsonDate=function(date) {


            return moment(date).format('MMM DD,YYYY h:mm a');
       

        }

    s.subtractEndDate = function (date) {
        return moment(date).subtract(1, 'days').format("MMM DD,YYYY");
        
    }
    
}])