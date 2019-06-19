module.controller("BookManagerMgmt", ["$scope", "$http","$filter", function (s, h,f) {
    var userInfo = JSON.parse(localStorage.userInfo);
    var eventInfo = JSON.parse(localStorage.Manage);
    s.myHub = $.connection.chatHub;
    s.Tab1 = 1;
    s.Tab2 = 0;
    s.showDet = 0;
    setActive(4);
    loadBooklist();
    s.rates = [
          { rate: "0", name: "Worst!", color: "Red" },
          { rate: "1", name: "Unsatisfied", color: "Red" },
          { rate: "2", name: "Average", color: "Orange" },
          { rate: "3", name: "Satisfactory", color: "Green" },
          { rate: "4", name: "Perfect!", color: "Green" },
    ];
    s.rateNum = -1;
    function loadBooklist() {
        h.post("../Vendor/getClientBookings?eventType=" + eventInfo[0].type + "&eventID=" + eventInfo[0].id).then(function (r) {
            console.log(r.data);
            s.Pendinglist = r.data;
        })

        h.post("../Vendor/getClientBookingsAccepted?eventType=" + eventInfo[0].type + "&eventID=" + eventInfo[0].id).then(function (r) {
            //console.log(r.data);
            s.Acceptedlist = r.data;
        })
        //console.log(eventInfo[0].type);
        //console.log(eventInfo[0].id);
        
    }
    s.sendMessage = function () {
        
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
                'SenderID': s.BookDetails.BookDetails.userID,
                'RecieverID': s.BookDetails.CompanyDetails.userID
            }
            h.post("../Accounts/getConID?userID=" + s.BookDetails.CompanyDetails.userID).then(function (r) {
                //console.log(r.data);
                s.myHub.server.notifyPM(r.data);
            })
            h.post("../Message/saveMessages", { msg: s.Msg }).then(function (r) {
                swal("Message Sent",'',"success");
            })
            
           
           
          
        });
    }
    function getRatings() {
        h.post("../Vendor/getTotalRate?CompanyID=" + s.BookDetails.CompanyDetails.CompanyID).then(function (r) {
            //console.log(r.data);
            s.TotalRate = r.data;
        }).then(function () {
            if (s.TotalRate.length != 0) {

                s.overallRate = Math.round(s.TotalRate[0].TotalRate / s.TotalRate[0].RateCount);
            }
            else {
                s.overallRate = 0;
            }
        })

    }
    s.showBookDetails = function (data) {
        s.isBookmarked = 0;
        s.showDet = 1;
        s.SelectedRow = data.$$hashKey;
        //console.log(data);
        s.BookDetails = data;
        getRatings();
     
        h.post("../Accounts/checkBookmark?userID=" + s.BookDetails.BookDetails.userID + "&CompanyID=" + s.BookDetails.CompanyDetails.CompanyID).then(function (r) {
                s.BookmarkInfo = r.data;
                if (r.data.length != 0) {
                    s.isBookmarked = 1;
                    //console.log("Bookmarked");
                }
                else {
                    s.isBookmarked = 0;
                    //console.log("not booked");
                }
            })
        
    }
    
    s.cancelBooked = function (data) {
        console.log(data);
       
       
        swal({
            title: "Request Cancelation for this booking?",
            text: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No!",
            closeOnConfirm: false,
        }, function (isConfirm) {
            if (isConfirm) {
                var notifDet = {
                    notifContent: userInfo[0].firstname + " " + userInfo[0].lastname + " requested to cancel the booking",
                    userID: data.CompanyDetails.userID,
                    type: "Book"
                };
                h.post("../Notification/saveNotif", { 'notif': notifDet }).then(function (r) {

                })
                h.post("../Accounts/getConID?userID=" + data.CompanyDetails.userID).then(function (r) {
                    //console.log(r.data);
                    s.myHub.server.notifyBookCancel(r.data);
                })

                h.post("../Vendor/requestCancelBooked", { "booking": data.BookDetails }).then(function () {
                    swal("Request for cancel sent", "Please wait for response", "success");
                    loadBooklist();s
                })
                
            }
            else {

            }
        })
    }

    s.viewTerms = function (data) {
        $('#termsModal').modal("show");
        
        s.BookingTerm = data;
      
    }

    s.AcceptBooking = function () {
        console.log(s.BookingTerm);
        var BookData = { 'booking': s.BookingTerm.BookDetails};
        var notifDet = {
            notifContent: "You are successfully booked with " + userInfo[0].firstname + " " + userInfo[0].lastname,
            userID: s.BookingTerm.CompanyDetails.userID,
            type: "Book"
        };
        h.post("../Notification/saveNotif", { 'notif': notifDet }).then(function (r) {

        })

        h.post("../Accounts/getConID?userID=" + s.BookingTerm.CompanyDetails.userID).then(function (r) {
            console.log(r.data);

            s.myHub.server.notifyAcceptReq(r.data, userInfo[0].firstname + " " + userInfo[0].lastname);

        })

        h.post("../Vendor/AcceptBooking", BookData).then(function (r) {
            swal("Booking Saved Successfully!", "Check your Booked Services Tab ", "success");
            loadBooklist();
            $('#termsModal').modal("hide");
        })
    }

    s.removeBooking = function (data) {
        if (data.BookDetails.BookStatus == 0) {
            //console.log(data);
            swal({
                title: "Cancel booking Request?",
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
                h.post("../Vendor/CancelBooking?bookID="+data.BookDetails.BookID).then(function (r) {
                    swal("Request Cancelled!", "", "success");
                    
                    loadBooklist();

                })


            }
        });
        }
        else if (data.BookDetails.BookStatus == 2) {
            h.post("../Vendor/CancelBooking?bookID=" + data.BookDetails.BookID).then(function (r) {
                swal("Removed!", "", "success");

                loadBooklist();

            })
        }
    }

    s.setBookmark = function () {
        
        h.post("../Accounts/saveBookmark?userID=" + s.BookDetails.BookDetails.userID + "&CompanyID=" + s.BookDetails.CompanyDetails.CompanyID).then(function (r) {
                //console.log(r.data);
                swal({
                    title: "Successfully Bookmarked",
                    timer: 2000,
                    type: "success"
                })
                s.isBookmarked = 1;
            })
        
       
    }

    s.SaveRating = function (data) {
        if (data == null || data.Comment.length == 0) {
            //console.log("null");

            swal({
                title: "Please add a comment",
                timer: 2000,
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
        else {

            //s.RateDetails = data;
            //s.RateDetails.CompanyID = s.VendorDetails.CompanyID;
            //s.RateDetails.userID = userInfo[0].userID;
            //s.RateDetails.DateRated = f('date')(new Date(), 'MMMM dd,yyyy');
            //s.RateDetails.Rating = parseInt(s.rateNum) + 1;
            ////console.log(s.RateDetails);
           
            s.RateDetails = {
                'Comment': data.Comment,
                'CompanyID': s.BookDetails.CompanyDetails.CompanyID,
                'userID': s.BookDetails.BookDetails.userID,
                'DateRated': f('date')(new Date(), 'MMMM dd,yyyy'),
                'Rating':parseInt(s.rateNum) + 1
                    
            }

            var rating = { 'rate': s.RateDetails };
            //console.log(rating);
            h.post("../Vendor/createRate", rating).then(function (r) {
                swal({
                    title: "Feedback will be loaded in a short while",
                    type: "success"
                })
                $('#ReviewRate').modal('hide');
                getRatings();
            })
            h.post("../Accounts/getConID?userID=" + s.BookDetails.CompanyDetails.userID).then(function (r) {
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

    
    s.goTab1 = function () {
        s.Tab1 = 1;
        s.Tab2 = 0;
    }

    s.goTab2 = function () {

        s.Tab1 = 0;
        s.Tab2 = 1;
        if (s.Acceptedlist != undefined) {
            //console.log(s.convertJsonDate(s.Acceptedlist[0].BookDetails.BookDate));
            //console.log(s.subtractEndDate(s.Acceptedlist[0].BookDetails.BookDateEnd));
        }
       
    }

    s.getMoment = function () {
        return moment().format("MMM DD, YYYY");
    }

    s.convertJsonDate = function (date) {
        return moment(date).format('MMM DD,YYYY h:mm a');
    }

    s.subtractEndDate = function (date) {
        return moment(date).subtract(1, 'days').format("MMM DD,YYYY");

    }
}])