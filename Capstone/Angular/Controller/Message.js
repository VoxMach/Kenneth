module.controller("MessageMgmt", ["$scope", "$http", "$interval",function (s, h, i) {
    
    var userInfo = JSON.parse(localStorage.userInfo);
    s.userID = userInfo[0].userID;
    s.dispName=userInfo[0].firstname+" "+userInfo[0].lastname;
    s.Msg = {};
    s.ChatConID = 0;
    s.Msg.RecieverID = 0;
    s.MessageList = [];
    s.MessageList.Date = {};
    s.SetConvo = "";
    s.SetConvo.Name = 0;
    s.ChatDivID = 0;
    
    
    //s.$on("$destroy", function (event) {
    //    i.cancel(s.checkMsg);
    //})

    s.myHub = null;
    s.myHub = $.connection.chatHub;


    s.myHub = $.connection.chatHub;
    InitContacts();
    

    function InitContacts() {
        h.post("../Accounts/getContacts?userID=" + userInfo[0].userID).then(function (r) {
            indx = 0;
            s.Contacts = r.data;
            
            console.log(s.Contacts);
            if (s.Contacts.length != 0) {


                s.ContactTimer = i(function () {
                    if (s.Contacts == null || s.Contacts == undefined) {
                        //console.log("empty");
                    }
                    else {
                        i.cancel(s.ContactTimer);
                        x();
                        function x() {
                            if (indx < s.Contacts.length) {
                                s.Contacts[indx].prio = s.Contacts.length-indx;


                                if (s.Contacts[indx].SenderID == userInfo[0].userID) {
                                    if (userInfo[0].usertype == "customer") {
                                        h.post("../Accounts/getUserDet?ID=" + s.Contacts[indx].RecieverID).then(function (r) {
                                            console.log(r.data);
                                            s.Contacts[indx].Name = r.data.firstname + " " + r.data.lastname;
                                            s.Contacts[indx].dispImg = r.data.profpath;
                                            
                                        
                                           
                                            return h.post("../Accounts/checkOnline?userID=" + s.Contacts[indx].RecieverID);
                                        }).then(function (r) {
                                            s.Contacts[indx].Status = r.data;
                                            s.Contacts[indx].isActive = 0;
                                        }).then(function () {
                                            indx++;
                                            x();
                                        })
                                    }
                                    else if (userInfo[0].usertype == "vendor") {
                                        h.post("../Accounts/getUserDet?ID=" + s.Contacts[indx].RecieverID).then(function (r) {

                                            s.Contacts[indx].Name = r.data.firstname + " " + r.data.lastname;
                                            s.Contacts[indx].dispImg = r.data.profpath;
                                            s.Contacts[indx].Status = r.data.status;
                                            s.Contacts[indx].isActive = 0;
                                        }).then(function () {
                                            indx++;
                                            x();
                                        })
                                    }

                                }
                                else {
                                    if (userInfo[0].usertype == "customer") {
                                        h.post("../Message/getLastMsg?ConvToken=" + s.Contacts[indx].ConversationToken + "&RecieverID=" + userInfo[0].userID).then(function (r) {

                                            s.Contacts[indx].MsgStatus = r.data.MessageStatus;
                                        })
                                        h.post("../Accounts/getCompanyDet?ID=" + s.Contacts[indx].SenderID).then(function (r) {
                                            s.Contacts[indx].Name = r.data[0].CompanyName;

                                            return h.post("../Accounts/getDispImg?ID=" + s.Contacts[indx].SenderID);
                                        }).then(function (r) {
                                            s.Contacts[indx].dispImg = r.data[0];
                                            return h.post("../Accounts/checkOnline?userID=" + s.Contacts[indx].SenderID);
                                        }).then(function (r) {
                                            s.Contacts[indx].Status = r.data;
                                            s.Contacts[indx].isActive = 0;
                                        }).then(function () {
                                            indx++;
                                            x();
                                        })
                                    }
                                    else if (userInfo[0].usertype == "vendor") {
                                        h.post("../Message/getLastMsg?ConvToken=" + s.Contacts[indx].ConversationToken+"&RecieverID="+userInfo[0].userID).then(function (r) {
                                            
                                            s.Contacts[indx].MsgStatus = r.data.MessageStatus;
                                        })
                                        h.post("../Accounts/getUserDet?ID=" + s.Contacts[indx].SenderID).then(function (r) {
                                            //console.log(s.Contacts[indx]);
                                            s.Contacts[indx].Name = r.data.firstname + " " + r.data.lastname;
                                            s.Contacts[indx].dispImg = r.data.profpath;
                                            s.Contacts[indx].Status = r.data.status;
                                            s.Contacts[indx].isActive = 0;
                                        }).then(function () {
                                            indx++;
                                            x();
                                        })
                                    }
                                }



                            }
                            else {
                                indx = 0;
                            }
                        }
                    }
                    
                })

            }

        })
    }

    s.deleteMsg = function () {
        console.log(s.SetConvo);
        swal({
            title: "Delete all messages with this user?",
            text: "Messages can't be retrieved once deleted",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, Delete all!',
            cancelButtonText: "No!"
        }, function (isConfirm) {
            if (isConfirm) {
                h.post("../Message/deleteMsg", { 'conversationToken': s.SetConvo.ConversationToken }).then(function (r) {
                    swal("Messages Deleted!", "", "success");
                    s.MessageList = "";
                })
             
            }
        })
    }

    s.newMsg = function () {
        s.Msg.Msg = s.message;
        s.Msg.SenderID = s.userID;
     
        s.SetConvo.prio = s.max+1;
        //console.log(s.Contacts);
        if (s.Msg.RecieverID != 0) {
            h.post("../Accounts/getConID?userID=" + s.Msg.RecieverID).then(function (r) {
                s.ChatConID = r.data;
                return h.post("../Message/saveMessages", { msg: s.Msg })
                
            }).then(function (r) {
                s.MsgDate = r.data.date;
               
                return h.post("../Accounts/checkOnline?userID=" + s.Msg.RecieverID);
            }).then(function (r) {
                
                
                    if (userInfo[0].usertype == "customer") {
                        var fullname = userInfo[0].firstname + " " + userInfo[0].lastname;
                        s.myHub.server.sendPM(fullname, s.Msg.Msg, userInfo[0].profpath, s.Msg.SenderID, s.MsgDate, s.ChatConID, s.SetConvo.ConversationToken);
                       
                    }
                    else {
                        h.post("../Accounts/getCompanyDet?ID=" + userInfo[0].userID).then(function (r) {
                            //console.log("afasghadh");
                            s.fullname = r.data[0].CompanyName;
                            //console.log(fullname + " " + s.Msg.Msg + " " + userInfo[0].profpath + " " + s.Msg.SenderID + " " + s.MsgDate + " " + s.ChatConID, s.SetConvo.ConversationToken);
                            
                            return h.post("../Accounts/getProfImg?ID=" + userInfo[0].userID);



                        }).then(function (r) {
                            return s.myHub.server.sendPM(s.fullname, s.Msg.Msg, r.data, s.Msg.SenderID, s.MsgDate, s.ChatConID, s.SetConvo.ConversationToken);
                        })
                    }

                  

                    //s.myHub.server.callEx(s.ChatConID);
                  
            })


        }
        else {
            
            h.post("../Message/saveMessages", { msg: s.Msg });
        }




    }

    s.setChatmate = function (data) {
       
        console.log(data);
        h.post("../Message/messageSeen?ConvToken=" + data.ConversationToken).then(function (r) {
            data.MsgStatus = "seen";
        })
        $("#message").val('').focus();
        s.ListCounter = 0;
        s.SetConvo = data;
        //console.log(s.SetConvo);
        s.max = Math.max.apply(Math, s.Contacts.map(function (item) { return item.prio; }));
        
        angular.forEach(s.MessageList, function (value, key) {
            $(".chat-message right animated fadeInUp").remove();
            $(".chat-message left animated fadeInUp").remove();
            $("#Mess").empty();
            $("#Mess").remove();
        })
       
        
        //$(".message-avatar").remove();
        //$(".message").remove();
        
        
        
        angular.forEach(s.Contacts, function (value, key) {
            if (s.Contacts[key].ConversationToken == data.ConversationToken) {
                data.isActive = 1;
            }
            else{
                s.Contacts[key].isActive = 0;
            }
        })

        if (data.Status == "Online") {
            if (data.SenderID == s.userID) {
                s.Msg.RecieverID = data.RecieverID;
                h.post("../Accounts/getConID?userID=" + data.RecieverID).then(function (r) {
                    s.ChatConID = r.data;
                
                })
            }
            else if (data.RecieverID == s.userID) {
                s.Msg.RecieverID = data.SenderID;
                h.post("../Accounts/getConID?userID=" + data.SenderID).then(function (r) {
                    s.ChatConID = r.data;
                    //console.log(s.ChatConID);

                })

            }
        }
        else {
            if (data.SenderID == s.userID) {
                s.Msg.RecieverID = data.RecieverID;
               
            }
            else if (data.RecieverID == s.userID) {
                s.Msg.RecieverID = data.SenderID;
               

            }
            
        }


        if (data.SenderID < data.RecieverID) {
            ConvoToken = data.SenderID + "-" + data.RecieverID;
            h.post("../Message/getMessages?ConvoToken=" + ConvoToken).then(function (r) {
               
                console.log(r.data);
                s.MessageList = r.data;

                return formatdate();

            }).then(function () {
                getImg();
                getNames();
                s.ChatDivID=s.MessageList[0].ConversationToken
            }).then(function () {
                s.ListCounter = 1;
                var containerDiv= document.getElementsByClassName("chat-discussion");
                containerDiv.scrollTop = containerDiv.scrollHeight;

                
            })
        }
        else if (data.SenderID > data.RecieverID) {
            ConvoToken = data.RecieverID + "-" + data.SenderID;
            h.post("../Message/getMessages?ConvoToken=" + ConvoToken).then(function (r) {
                //console.log(r.data);
                s.MessageList = r.data;
                console.log(s.MessageList);


                return formatdate();
            }).then(function () {
                getImg();
                getNames();
                s.ChatDivID= s.MessageList[0].ConversationToken
            }).then(function () {
                s.ListCounter = 1;
                var containerDiv = document.getElementsByClassName("chat-discussion");
                containerDiv.scrollTop = containerDiv.scrollHeight;
                
            })

            
        }

        

        s.checkMsg = i(function () {

            h.post("../Message/getMessagesMobile?ConvToken=" + data.ConversationToken).then(function (r) {
                console.log(r.data.length);
                if (r.data.length > 0)  {
                    console.log(r.data);
                    console.log(r.data[0].firstname);
               
                $('#chatDiv' + data.ConversationToken).append(
               '<div class="chat-message right animated fadeInUp" id="Mess" >' +
               '<img class="message-avatar" src="' + r.data[0].profpath + '" alt="">' +
               '<div class="message" style="border-radius:20px">' +
               '<a class="message-author" href="#" style="font-weight:bold;">' + r.data[0].firstname+" "+r.data[0].lastname + ' </a>' +
               '<span class="message-date">' + convertJsonDate(r.data[0].Date) + ' </span>' +
               '<span class="message-content">' + r.data[0].Msg + '</span>' +
               '</div>' +
               '</div>'
                    )
                    
                return h.post("../Message/setSeen?msgid=" + r.data[0].MsgID);
                }
            })
            
        },4000)
        
        console.log(data.ConversationToken);

        
        
        

    }


    function formatdate() {
        angular.forEach(s.MessageList, function (value, key) {
            s.MessageList[key].Date = convertJsonDate(s.MessageList[key].Date);
            console.log(s.MessageList[key].Date);
        })
    }

    function getImg() {
        s.CustomerImg = "/Uploads/Default.png";
        s.VendorImg = "/Uploads/Default.png";
        if (s.MessageList.length > 0) {



            if (userInfo[0].usertype == "customer") {
                
                s.CustomerImg = userInfo[0].profpath;
                if (s.MessageList[0].SenderID == s.userID) {
                    h.post("../Accounts/getProfImg?ID=" + s.MessageList[0].RecieverID).then(function (r) {
                        s.VendorImg = r.data[0];
                       
                    })
                }
                else if (s.MessageList[0].RecieverID == s.userID) {
                    h.post("../Accounts/getProfImg?ID=" + s.MessageList[0].SenderID).then(function (r) {
                        s.VendorImg = r.data;

                    })
                }

            }
            else if (userInfo[0].usertype == "vendor") {
              
                console.log(s.MessageList[0].SenderID);
                if (s.MessageList[0].SenderID == s.userID) {
                    //console.log(s.MessageList[0].RecieverID);
                    
                    h.post("../Accounts/getProfImg?ID=" + s.MessageList[0].RecieverID).then(function (r) {
                        //console.log(r.data);
                        s.CustomerImg = r.data;
                        return h.post("../Accounts/getProfImg?ID=" + s.MessageList[0].SenderID);
                    }).then(function (r) {
                        console.log(r.data);
                        s.VendorImg = r.data;
                    })
                }
                else if (s.MessageList[0].RecieverID == s.userID) {
                   
                    //console.log(s.MessageList[0].SenderID);
                    h.post("../Accounts/getProfImg?ID=" + s.MessageList[0].SenderID).then(function (r) {
                       
                        s.CustomerImg = r.data;
                        //console.log(r.data);
                        return h.post("../Accounts/getProfImg?ID=" + s.MessageList[0].RecieverID);
                    }).then(function (r) {
                       
                        s.VendorImg = r.data;
                    })
                }

            }
        }

    }

    function getNames() {
        s.CustomerName = "";
        s.VendorName = "";
        
        if (s.MessageList.length) {
            if (userInfo[0].usertype == "customer") {
                s.CustomerName = userInfo[0].firstname + " " + userInfo[0].lastname;
                s.VendorName = s.SetConvo.Name;
                
            }
            else if (userInfo[0].usertype == "vendor") {
                h.post("../Accounts/getCompanyDet?ID=" + s.userID).then(function (r) {
                    s.VendorName = s.dispName ;
                    s.CustomerName = s.SetConvo.Name;

                })
               
                
               
            }

        }
    }

    s.setImg = function (data) {
        
        if (userInfo[0].usertype == "customer") {
            if (data.SenderID == s.userID) {
                return s.CustomerImg;

            }
            else {
                return s.VendorImg;
            }
        }
        else if (userInfo[0].usertype == "vendor") {
            if (data.SenderID == s.userID) {
                return s.VendorImg;
            }
            else {
                return s.CustomerImg;
            }

        }
        
       
    }

    
    
    s.setName = function (data) {
        ////console.log("ey");
        if (userInfo[0].usertype == "customer") {
            if (data.SenderID == s.userID) {
                return s.CustomerName;

            }
            else {
                return s.VendorName;
            }
        }
        else if (userInfo[0].usertype == "vendor") {
            if (data.SenderID == s.userID) {
                return s.VendorName;
            }
            else {
                return s.CustomerName;
            }

        }
    }

    s.setScrollMessage = function (indx) {
        
        if (s.ListCounter==1){
            if (s.MessageList.length - 1 == indx) {
               
                $("#chatDiv" + s.ChatDivID).scrollTop($("#chatDiv" + s.ChatDivID)[0].scrollHeight);
               
                
                //var containerDiv = document.getElementsByClassName("chat-discussion");
                //containerDiv.scrollTop = containerDiv.scrollHeight;
            }
            else {
               //\\__//\\__//\\
            }
        
        }
    }
    

    console.log(convertJsonDate("2019-02-25 16:39:43.463"));

    function convertJsonDate(date) {


        return moment(date).format('DD MMM h:mm a');
       

    }







}])