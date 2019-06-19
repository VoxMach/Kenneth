$(function () {
    var userInfo = JSON.parse(localStorage.userInfo);
    if (userInfo[0].userType == "customer") {
        var eventInfo = JSON.parse(localStorage.Manage);
    }
    else {

    }




    
    var userInfo = JSON.parse(localStorage.userInfo)
    $("#Profilepic").attr("src", userInfo[0].profpath);
    $("#fullname").text(userInfo[0].firstname + " " + userInfo[0].lastname + "    ");

    var myHub = $.connection.chatHub;
    var userInfo = JSON.parse(localStorage.userInfo);
    $.connection.hub.start().done(function () {
        
        myHub.server.saveConID();

    })
    console.log($('#MessageNotif span').text());
    myHub.client.saveConnection = function (connectionId) {
        
        console.log(connectionId);
        $.post("../Accounts/saveConID",
        {
            userID:userInfo[0].userID,
            conID:connectionId

        },
        function (r)
        {
            localStorage.userInfo = JSON.stringify(r);
        })

    }

    window.onbeforeunload = function () {
        $.post("../Accounts/onDisconnect",
            { userId: userInfo[0].userID },
            function (result) {

            }
        )
    }

   

    myHub.client.sendPM = function (fullname, msg, profpath, sender, date, receiver,ConvoToken) {
        console.log(sender);
        console.log(ConvoToken);
        
        if (sender != userInfo[0].userID) {
            $('#chatDiv'+ConvoToken).append(
                '<div class="chat-message right animated fadeInUp" id="Mess" >' +
                '<img class="message-avatar" src="' + profpath + '" alt="">' +
                '<div class="message" style="border-radius:20px">' +
                '<a class="message-author" href="#" style="font-weight:bold;">' + fullname + ' </a>' +
                '<span class="message-date">' + convertJsonDate(date) + ' </span>' +
                '<span class="message-content">' + msg + '</span>' +
                '</div>' +
                '</div>'
                )

        }
        else if (sender == userInfo[0].userID) {
            $('#chatDiv'+ConvoToken).append(
                '<div class="chat-message left animated fadeInUp" style="background:#c9d7dc54;border-radius:100px" id="Mess">' +
                '<img class="message-avatar" src="' + profpath + '" alt="">' +
                '<div class="message" style="border-radius:20px">' +
                '<a class="message-author" href="#" style="font-weight:bold;">' + fullname + ' </a>' +
                '<span class="message-date">' + convertJsonDate(date) + ' </span>' +
                '<span class="message-content">' + msg + '</span>' +
                '</div>' +
                '</div>'
                )
        }

        
       
        $("#message").val('').focus();
        try{
            $('#chatDiv' + ConvoToken).scrollTop($('#chatDiv' + ConvoToken)[0].scrollHeight);
        }
        catch(err){
            console.log("not set");
        }
        $(document).scrollTop($(document)[0].scrollHeight);

    }


    myHub.client.notifyPM = function () {
        $('#MsgCounter').text(parseInt($('#MsgCounter').text()) + 1);


        Snarl.addNotification({
            title: 'New Message',
            text: '1 new message received',
            icon: '<i class="fa fa-envelope"></i>',
            timeout: 3000,
            action:"../Message/ChatView"
        });
    }

    myHub.client.notifyRate = function () {
        $('#notifCount').text(parseInt($('#notifCount').text()) + 1);
       

       
        Snarl.addNotification({
            title: 'New Feedback',
            text: '1 Rate Feedback received',
            icon: '<i class="fa fa-star"></i>',
            timeout: 5000,
            action:"../Vendor/Dashboard"
        });
    }

    myHub.client.notifyBook = function () {
        $('#notifCount').text(parseInt($('#notifCount').text()) + 1);



        Snarl.addNotification({
            title: 'New Booking Request',
            text: '1 Pending Booking',
            icon: '<i class="fa fa-calendar"></i>',
            timeout: 5000,
            action: "../Vendor/Bookings"
        });
    }

    myHub.client.notifyBookCancel = function () {
        $('#notifCount').text(parseInt($('#notifCount').text()) + 1);



        Snarl.addNotification({
            title: 'New Book Cancellation Request',
            text: '1 Pending Request',
            icon: '<i class="fa fa-calendar"></i>',
            timeout: 5000,
            action: "../Vendor/Bookings"
        });
    }

    myHub.client.notifyAcceptReq = function (companyname) {
        $('#notifCount').text(parseInt($('#notifCount').text()) + 1);



        Snarl.addNotification({
            title: companyname+' have responded to your request',
            text: '1 Booking response',
            icon: '<i class="fa fa-calendar"></i>',
            timeout: 5000,
            action: "../Vendor/Book"
        });
    }

    myHub.client.notifyDeclineReq = function (companyname) {
        $('#notifCount').text(parseInt($('#notifCount').text()) + 1);



        Snarl.addNotification({
            title: companyname + ' have declined your request',
            text: '1 Booking Declined',
            icon: '<i class="fa fa-trash"></i>',
            timeout: 5000,
            action: "../Vendor/Book"
        });
    }

    function convertJsonDate(date) {
        var date2 = new Date(parseInt(date.substr(6)));
        return moment().format('DD MMM h:mm a');
    }



})

