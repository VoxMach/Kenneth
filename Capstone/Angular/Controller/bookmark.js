module.controller("BookmarkMgmt", ["$scope", "$http","$interval","$filter","$rootScope", function (s, h,i,f,rs) {
    var userInfo = JSON.parse(localStorage.userInfo);
    setActive(5);
    
    s.ServiceList=0;
    s.ShowVendorInfo = 0;
    s.isBookmarked = 1;
    loadBookmark();
    s.myHub = $.connection.chatHub;
    s.rates = [
         { rate: "0", name: "Worst!", color: "Red" },
         { rate: "1", name: "Unsatisfied", color: "Red" },
         { rate: "2", name: "Average", color: "Orange" },
         { rate: "3", name: "Satisfactory", color: "Green" },
         { rate: "4", name: "Perfect!", color: "Green" },
    ];
    s.rateNum = -1;
    
    function loadBookmark() {

        h.post("../Vendor/getCustomBookmark?userID=" + userInfo[0].userID).then(function (r) {
            console.log(r.data);
            s.BookmarkDetails = r.data;
        })


        //indx = 0;
        //s.TotalRate = 0;
        //h.post("../Accounts/getFullBookmarks?userID=" + userInfo[0].userID).then(function (r) {
        //    s.BookmarkDetails = r.data;
        //    console.log(s.BookmarkDetails);
        //}).then(function (r) {
        //    s.ListTimer = i(function () {
        //        if (s.BookmarkDetails.length == undefined) {
        //            //console.log("empty");
        //        }
        //        else {
                    
        //            i.cancel(s.ListTimer);
        //            getRates();
        //            function getRates() {

        //                if (indx < s.BookmarkDetails.length) {
        //                    h.post("../Vendor/getTotalRate?CompanyID=" + s.BookmarkDetails[indx].CompanyID).then(function (r) {
                                
        //                        s.TotalRate=r.data;
                                    
        //                    }).then(function () {
        //                        if(s.TotalRate.length !=0){
                                
        //                        s.BookmarkDetails[indx].Rating = Math.round(s.TotalRate[0].TotalRate / s.TotalRate[0].RateCount);
        //                        }
        //                        else {
        //                            s.BookmarkDetails[indx].Rating = 0;
        //                        }
        //                    }).then(function () {
                               
        //                        indx++;
        //                        getRates();
        //                    })
        //                }
        //                else {
        //                    indx = 0;
        //                }
        //            }


        //        }
        //    })
        //})
    }

    
    
    s.Remove = function (data) {
        //console.log(data);
        swal({
            title: "Are you sure?",
            text: "Are you sure you want to remove bookmark?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Remove it!",
            closeOnConfirm: false
        }, function () {
            h.post("../Accounts/removeBookmarkByID?BookmarkID=" + data.BookmarkID).then(function (r) {
                loadBookmark();
            })
            swal("Removed", "Bookmark removed successfully", "success");
        });
        
    }

    s.setBookmark = function (data) {
        if (s.isBookmarked == 0) {
            h.post("../Accounts/saveBookmark?userID=" + userInfo[0].userID + "&CompanyID=" + data.CompanyID).then(function (r) {
                //console.log(r.data);
                swal({
                    title: "Successfully Bookmarked",
                    timer: 2000,
                    type: "success"
                })
                s.isBookmarked = 1;
            })
        }
        else {
            //console.log(s.BookmarkInfo[0].BookmarkID);
            h.post("../Accounts/removeBookmark?userID=" + userInfo[0].userID + "&CompanyID=" + data.CompanyID).then(function (r) {
                swal({
                    title: "Bookmark Removed",
                    timer: 2000,
                    type: "success"
                })
                s.isBookmarked = 0;
            })

        }
    }

    s.VendorList = function () {
        s.ShowVendorInfo = 0;
        loadBookmark();

    }

    s.VendorInfo = function (data) {
        //console.log(data);
        rs.CompanyName = data.CompanyName;
        //s.ShowVendorInfo = 1;
        
        //s.currentID = data.CompanyID;
        //s.OverallRating = data.Rating;
        //h.post("../Vendor/getVendorInfo?CompanyID=" + data.CompanyID).then(function (r) {

        //    s.VendorDetails = r.data[0];
        ////    console.log(s.VendorDetails);
        //    return h.post("../Accounts/getImg?ID=" + s.VendorDetails.userID);
        //}).then(function (r) {
        ////    console.log(r.data);
        //    s.Img = r.data;
        //})

        //h.post("../Vendor/getRateNew?CompanyID=" + data.CompanyID).then(function (r) {
        //    s.RatingList = r.data;
        ////    console.log(s.RatingList);


        //})

        //h.post("../Accounts/checkBookmark?userID=" + userInfo[0].userID + "&CompanyID=" + data.CompanyID).then(function (r) {
        //    s.BookmarkInfo = r.data;
        //    if (r.data.length != 0) {
        //        s.isBookmarked = 1;
        //    }
        //    else {
        //        s.isBookmarked = 0;
        //    }
        //})


        
       
    }
    s.getRatings = function () {
        h.post("../Vendor/getRateNew?CompanyID=" + s.currentID).then(function (r) {
            s.RatingList = r.data;
            //console.log(s.RatingList);


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

            s.RateDetails = data;
            s.RateDetails.CompanyID = s.VendorDetails.CompanyID;
            s.RateDetails.userID = userInfo[0].userID;
            s.RateDetails.DateRated = f('date')(new Date(), 'MMMM dd,yyyy');
            s.RateDetails.Rating = parseInt(s.rateNum) + 1;
            //console.log(s.RateDetails);
            var rating = { 'rate': s.RateDetails };
            h.post("../Vendor/createRate", rating).then(function (r) {
                swal({
                    title: "Feedback will be loaded in a short while",
                    type: "success"
                })
                $('#ReviewRate').modal('hide');
                s.getRatings();
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
        //console.log(s.NewMsg);
    }
    


}])