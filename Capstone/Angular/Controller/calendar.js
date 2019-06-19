module.controller("CalendarMgmt", ["$scope", "$http","$interval", function (s, h,i) {
    var userInfo = JSON.parse(localStorage.userInfo);
    var companyInfo = JSON.parse(localStorage.companyID);
    setActiveV(2);
    //console.log("kalindar!");
    s.CompanyID = companyInfo.CompanyID;
    loadCalendarEvents();
    function loadCalendarEvents() {
        h.post("../Vendor/getCompanyID?userID=" + userInfo[0].userID).then(function (r) {
          

            return h.post("../Vendor/getBookingsCalendar?CompanyID=" + s.CompanyID);
        }).then(function (r) {
            s.Eventlist = r.data;
            console.log(s.Eventlist);
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();


            $('#calendar').fullCalendar({
                contentHeight: 450,
                header: {
                    left:'prev,next today',
                    right: 'month,agendaWeek,agendaDay'
                },
                selectable: true,
                displayEventEnd:true,
                editable: true,
                allDay: false,
                displayEventTime:true,
                events: s.Eventlist,
                nextDayThreshold:"00:00:00",
              
                eventAfterRender:function(event,element,view){
                    if (event.eventType == "Birthdays") {
                        element.css('background-color', '#1c84c6');
                        //var title = element.find('.fc-title');
                        //title.html(title.text="ey");
                        
                    }
                    else if (event.eventType == "Weddings") {
                        element.css('background-color', '#1ab394');
                    }
                    else if (event.eventType == "Reunions") {
                        element.css('background-color', '#af15b3');
                    }
                    else if (event.eventType == "Others") {
                        element.css('background-color', 'orange');
                    }
                    else if (event.eventType == "Custom") {
                        element.css('background-color', 'black');
                    }
                },
                eventDrop: function (event) {
                    var booksched;
                    if (event.end == null) {
                        console.log("ey");
                        event.BookDate = event.start.format();
                        event.BookDateEnd = moment(event.BookDate).add(1, "h").format("YYYY-MM-DDTHH:mm:ss");
                        var startx=((moment(event.BookDate).format("HH:mm a")));
                        var endx=((moment(event.BookDateEnd).format("HH:mm a")));
                        booksched = startx + "-" + endx;
                    }
                    else {
                      
                       
                        event.BookDate = event.start.format();
                        event.BookDateEnd = event.end.format();
                        var startx = (moment(event.BookDate).format("HH:mm a"));
                        var endx = (moment(event.BookDateEnd).format("HH:mm a"));
                         booksched = startx + "-" + endx;
                        console.log(booksched);
                        console.log(event.start.format());
                    }
                       
                    
                    
                    //console.log(event);
                    h.post("../Vendor/updateSchedule?BookID=" + event.BookID + "&startd=" + event.BookDate + "&endd=" + event.BookDateEnd + "&booksched=" + booksched).then(function (r) {
                       
                    })
                    
                },
                eventResize: function (event) {
                    event.BookDate = event.start.format();
                    event.BookDateEnd = event.end.format();
                    var startx=(moment(event.BookDate).format("hh:mm A"));
                    var endx = (moment(event.BookDateEnd).format("hh:mm A"));
                    var booksched = startx + "-" + endx;
                    console.log(booksched);
                    event.BookDate = event.start.format();
                    event.BookDateEnd = event.end.format();
                    alert(endx);
                   
                    h.post("../Vendor/updateSchedule?BookID=" + event.BookID + "&startd=" + event.BookDate + "&endd=" + event.BookDateEnd+"&booksched="+booksched).then(function (r) {

                    })

                },
                eventClick: function (event) {
                    //s.$apply(s.EventDet(event));
                    //if (event.eventType == "Custom") {
                    //    alert("Custom event");
                    //}
                    //else{
                    //    $("#SendMessage").modal();
                    //}
                },

                select: function (startDate, endDate, allDay) {
                    //console.log(event);
                    s.Bookschedval = null;
                    swal({
                        title: "Add Event",
                        text: "Enter Event Name",
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

                       
                        if (startDate.hasTime()) {
                            s.Bookschedval = startDate.format("hh:mm a") + "-" + endDate.format("hh:mm a");
                        }
                        else {

                        }
                       
                        h.post("../Vendor/saveCustomSchedule?title="+inputValue+"&startD="+startDate.format()+"&endD="+endDate.format()+"&CompanyID="+s.CompanyID+"&BookSched="+s.Bookschedval).then(function (r) {

                            return h.post("../Vendor/getBookingsCalendar?CompanyID=" + s.CompanyID);
                           
                        }).then(function (r) {

                            swal("Nice!", "Custom schedule added successfully", "success");
                            s.Eventlist = r.data;
                            $("#calendar").fullCalendar('removeEvents');
                            $("#calendar").fullCalendar('addEventSource', s.Eventlist);
                            $("#calendar").fullCalendar('rerenderEvents');
                        })
                       
                    });
                },
               
                
                

                
            });
           
            //console.log(s.Eventlist);
        })
    }
   
    s.refreshlist = function (data) {
        s.Eventlist=data;
        //console.log(data);
    }


    s.EventDet = function (data) {
        s.BookDetails = data;
        //console.log(s.convertJsonDate(s.BookDetails.start.format()));
        //console.log(s.subtractEndDate(s.BookDetails.end.format()));
       

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

  
    s.convertJsonDate = function (date) {


        return moment(date).format('MMM DD,YYYY');


    }

    s.subtractEndDate = function (date) {
        return moment(date).subtract(1, 'days').format("MMM DD,YYYY");

    }

   
}])