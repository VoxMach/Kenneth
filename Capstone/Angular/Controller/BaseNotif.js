module.controller("BaseNotifMgmt", ["$scope", "$http","$filter", function (s, h,f) {

    var userInfo = JSON.parse(localStorage.userInfo);
    
   
    if (userInfo[0].usertype == "customer") {
        s.customer = 1;
    }
    else {
        var companyInfo = JSON.parse(localStorage.companyID);
        s.customer = 0;
    }
    //console.log("eewwew");
    getNotif();
    getMessageCount();
   
    function getNotif(){
    h.post("../Notification/getNotif?userID=" + userInfo[0].userID).then(function (r) {
        //console.log(r.data);
        s.Notifications = r.data;
        filterSeen();
        
    })
    }
    s.notifSeen = function () {
        s.Count = 0;
        $('#notifCount').text(0);
        h.post("../Notification/getNotif?userID=" + userInfo[0].userID).then(function (r) {
            
            s.Notifications = r.data;
            
            return h.post("../Notification/updateNotif?userID=" + userInfo[0].userID)
        })
      
    }

    function getMessageCount() {
        h.post("../Notification/getMessagesCount?userID=" + userInfo[0].userID).then(function (r) {
            //console.log(r.data);
            s.MsgCount = r.data;
        })
    }

    s.convertJsonDate = function (date) {


        return moment(date).format('MMM DD,YYYY');


    }
    getPageID();
    function getPageID() {
        s.pageID = 0;
        if (userInfo[0].usertype == "vendor") {
            h.post("../Vendor/getPageID", { 'companyID': companyInfo.CompanyID }).then(function (r) {
                console.log(r.data);
                if (r.data.length > 0) {
                    s.pageID = 1;
                }
               
            })
        }
    }

    s.addPageID = function () {
        $('#myModal').modal("hide");
        swal({
            title: "Enter Page ID",
            text: "Write something..",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "Enter Page ID"
        }, function (inputValue) {

            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            else if (inputValue == 0) {
                swal.showInputError("Value cannot be 0!");
                return false
            }

            h.post("../Vendor/setPageID", { 'companyID': companyInfo.CompanyID, 'pageID': inputValue });
           
            swal("Page ID Integrated", "You can receive messages in your messenger now", "success");
          




        });
    }

    s.showFbModal = function () {
        $('#myModal').modal("show");
    }

    s.compareDate=function(date) {
        
        return (moment(date).fromNow());
    }

    function filterSeen() {
        s.Count = (s.Notifications.filter(function (pv) { return (pv.seen == 0) })).length;
       
    }

    s.changeEvent = function () {
        location.href = "/event/Index";
    }
    s.changeEvent2 = function () {
        location.href = "/vendor/Companylist";
    }

    s.animateContent = function (id) {
        
        //console.log("notif" + id);
       
        $('#notif' + id).animate(
            {
                marginLeft: '-50px',
                fontSize: '16px'
            }
            );
        //$('#notif'+id).animate({
        //    opacity: 0, // animate slideUp
        //    marginLeft: '-200px'
        //})
    }

    s.deanimateContent = function (id) {
        $('#notif' + id).animate(
           {
               marginLeft: '0px',
               fontSize: '16px'
           }
           );
    }

    s.DynUrl = function (data) {
        if (data.type == "uBook") {
            return "../Vendor/Book"
        }
        else {
            return "../Event/Checklist"
        }
      
    }
}])