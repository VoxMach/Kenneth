
module.controller("DashboardMgmt", ["$scope", "$http","$interval", function (s, h,i) {
    var eventInfo = JSON.parse(localStorage.Manage);
    var userInfo=JSON.parse(localStorage.userInfo);

       
    getEventDet();
    ChecklistDonut();
    BookmarkCount();
    loaded();
    getBudget();
    function getBudget() {
        h.post("../Event/getRemainBudget", { "eventID": eventInfo[0].id, "eventType": eventInfo[0].type }).then(function (r) {
            //console.log(r.data);
            s.budgetinfo=r.data;
        }).then(function () {
            s.RemainBudget = s.budgetinfo[0].Budget - s.budgetinfo[0].Cost;
        })
    }
    function loaded() {
        s.load = i(function () {
            if (s.CheckPct == undefined && s.DateTillEvent == undefined && s.EventDet==undefined && s.bookmarkCount ==undefined) {
                //console.log("empy")
            }
            else {
               
                i.cancel(s.load);
                //console.log("loaded");
                $('#loadSpinner').hide();
                $('#dashboardContent').show();
                $('#dashboardContent2').show();
                
            }
        })
    }
    function ChecklistDonut() {

        h.post("../Event/getUnfinishedCount?eventID=" + eventInfo[0].id).then(function (r) {
            s.unfin = r.data;

            return h.post("../Event/getFinishedCount?eventID=" + eventInfo[0].id);
        }).then(function (r) {
            s.fin = r.data;
        }).then(function () {
            
            Morris.Donut({
                element: 'ChecklistChart',
                data: [
                    
                    { label: "Incomplete", value: s.unfin, labelColor: 'gray' },
                    { label: "Completed", value: s.fin, labelColor: 'green' },
                   
                ],
                resize: true,
                colors: [
                   
                    'gray',
                    'green'
   
                ],


            })

            s.CheckPct=(parseInt((s.fin * 100)/(s.fin+s.unfin)));
        })
        
        
    }
    function getEventDet() {
        if (eventInfo[0].type == "Birthdays") {
            h.post("../Event/getBirthdayDet?eventID=" + eventInfo[0].id).then(function (r) {
                s.EventDet = r.data;
                
               
                //console.log(s.EventDet);
                var a = moment();
                var b = moment(r.data.EventDate);
                //console.log(a);
                //console.log(b);
                //console.log(moment().format('MMM Do YYYY'));
                //console.log((b.diff(a, 'years')));
                //console.log((b.diff(a, 'months')) + 1);
                //console.log((b.diff(a, 'days')));
                s.YearDiff = b.diff(a, 'years');
                s.MonthDiff = (b.diff(a, 'months')) + 1;
                s.DayDiff = b.diff(a, 'days');

                //if (s.YearDiff > 0) {
                ////    //console.log(s.YearDiff + " " + (s.MonthDiff - (s.YearDiff * 12)));
                //    s.DateTillEvent = s.YearDiff + " years & " + (s.MonthDiff - (s.YearDiff * 12))+" months";
                //}
                //else if(s.DayDiff>30) {
                //    //console.log((s.MonthDiff - 1) + " " + ((s.DayDiff - ((s.MonthDiff - 1) * 30)) + 1));
                //    s.DateTillEvent = (s.MonthDiff - 1) + " months & " + ((s.DayDiff - ((s.MonthDiff - 1) * 30)) + 1)+" days";
                //}
                //else {
                //    //console.log(s.DayDiff+1);
                //    s.DateTillEvent = s.DayDiff + 1+" days";
                //}
                
                s.DateTillEvent = s.DayDiff+1+" days";
                
                
                
            
                s.EventDet.EventDate = convertJsonDate(s.EventDet.EventDate);
                
            })
            h.post("../Event/getChecklist?eventID=" + eventInfo[0].id).then(function (r) {
                s.ChecklistDet = r.data;
                //console.log(s.ChecklistDet);
            })
        }
    }
    function BookmarkCount() {
        h.post("../Vendor/getBookmarkCount?userID=" + userInfo[0].userID).then(function (r) {
            s.bookmarkCount = r.data;
        })
    }

    function convertJsonDate(date) {

        
        return moment(date).format('MMM Do YYYY');


    }
}])