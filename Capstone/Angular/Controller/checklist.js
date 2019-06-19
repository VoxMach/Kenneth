
module.controller("ChecklistMgmt",["$scope", "$http","$rootScope", function (s, h,rs){
   
    var userInfo = JSON.parse(localStorage.userInfo);
    var eventInfo = JSON.parse(localStorage.Manage);
    s.toggleComp = true;
    s.toggleExc = true;
   
    setActive(2);
    checkData();
    loadUserTask();
    loadDays();
   
    function loadDays(){
        h.post("../Event/getEventDate",{"eventID":eventInfo[0].id,"eventType":eventInfo[0].type}).then(function(r){
            //console.log(r.data);


            var a = moment();
            var b = moment(r.data);
            //console.log(a);
            //console.log(b);
            //console.log(moment().format('MMM Do YYYY'));
            //console.log((b.diff(a, 'years')));
            //console.log((b.diff(a, 'months')) + 1);
            //console.log((b.diff(a, 'days')));
            s.YearDiff = b.diff(a, 'years');
            s.MonthDiff = (b.diff(a, 'months')) + 1;
            s.DayDiff = b.diff(a, 'days');
            s.DateTillEvent = s.DayDiff + 1 + " days to go until event";
            //console.log(s.DateTillEvent);
            toastr.options.closeButton = true;
            toastr.options.showMethod = 'slideDown';
            toastr.options.hideMethod = 'slideUp';
            toastr.options.progressBar = true;;
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.options.preventDuplicates=true,
            toastr.options.positionClass = "toast-bottom-right";
            toastr.info(s.DateTillEvent);

        })
    }
    
    function checkData() {
        //console.log("checklist");
      
    }

    s.search = function (data) {
        
       
        rs.ServiceID = data.ServiceID;
       
       
       
    }


    function progval() {
        //console.log("fired");
        s.TotalList = 0;
        s.FinishedCount = 0;
        angular.forEach(s.checklistDet, function (value, key) {
            if (value.IsFinished == 0) {
                s.TotalList++;
            }
            else if (value.IsFinished == 1) {
                s.TotalList++;
                s.FinishedCount++;
            }
        })

        s.ProgressVal = parseInt((s.FinishedCount * 100) / s.TotalList);
        s.ProgressVal = s.ProgressVal + "%";
        
        
    }
    //function getAllTask() {
    //    h.post("../Event/getTaskList?type=" + eventInfo[0].type).then(function (r) {
    //        s.TaskList = r.data;
    ////        console.log(s.TaskList);
    //    })
    //}
    //function filtere(ID) {
    //    return s.TaskList.filter(function (pv) { return (pv.TaskID == ID) })[0].TaskName;
    //}
    function loadUserTask() {
        h.post("../Event/getUserTasklist?UserID=" + userInfo[0].userID + "&type=" + eventInfo[0].type + "&EventID=" + eventInfo[0].id).then(function (r) {
            indx = 0;

            s.checklistDet = r.data;
            
            for (indx; indx < s.checklistDet.length; indx++) {
                var tname = s.checklistDet[indx].TaskName.Data[0];
                s.checklistDet[indx].TaskName = tname;
                
                s.checklistDet[indx].ServiceID = s.checklistDet[indx].ServiceID.Data[0];
                if (s.checklistDet[indx].IsFinished == 1) {
                    s.checklistDet[indx].CheckStatus = true;
                }
                else if (s.checklistDet[indx].IsFinished == 0) {
                    s.checklistDet[indx].CheckStatus = false;
                }
            }
            
            //console.log(s.checklistDet);
           
           
            progval();  
        })
        
    }

    s.showNotes = function (data) {
        //console.log(data);
        if (data.IsFinished == 0) {
           
        }
        else if(data.IsFinished==2){
           
        }
        else if(data.IsFinished == 1){
            s.noteData = data;
            $("#noteModal").modal()
        
            
        }
        
    }

    s.MarkFinished = function (data) {
        
        if (data.CheckStatus == true) {
            data.IsFinished = 1;
            swal({
                title: "Add notes",
                text: "Write notes on this action",
                type: "input",
                inputPlaceholde:"Notes.."
            }, function (value) {
                data.notes = value;
                updateFunc();
            })

            var Checkdata = { 'details': data };

            h.post("../Event/updateChecklist", Checkdata).then(function (r) {
                ////console.log(r.data);
                //console.log(s.checklistDet);
            })

            progval();
        }
        else {
            data.IsFinished = 0;
            data.notes = null;
            updateFunc();
        }
       
        
        
        //console.log(data);
        function updateFunc() {
            var Checkdata = { 'details': data };

            h.post("../Event/updateChecklist", Checkdata).then(function (r) {
                //console.log(r.data);
                //console.log(s.checklistDet);
            })

            progval();
        }
            
        
    }

    

    s.ExcludeInclude = function (data) {
       
        if (data.IsFinished == 0) {
       
        data.CheckStatus = false;
        data.IsFinished = 2;
        
        var Checkdata = { 'details': data };
        h.post("../Event/updateChecklist", Checkdata).then(function (r) {
            
        })
        }
        else if (data.IsFinished == 2) {
            data.CheckStatus = false;
            data.IsFinished = 0;
            var Checkdata = { 'details': data };
            h.post("../Event/updateChecklist", Checkdata).then(function (r) {

            })
        }
        progval();
    }

    s.FilterCond = function (x) {
        if (s.toggleComp == true && s.toggleExc == true) {
            if (x.IsFinished == 1 || x.IsFinished == 0 || x.IsFinished == 2) {
                return true;
            }
        }
        else if (s.toggleComp == true && s.toggleExc == false) {
            if (x.IsFinished == 1 || x.IsFinished == 0) {
                return true;
            }
        }
        else if (s.toggleComp == false && s.toggleExc == true) {
            if (x.IsFinished == 0 || x.IsFinished == 2) {
                return true;
            }
        }
        else if (s.toggleComp == false && s.toggleExc == false) {
            if (x.IsFinished == 0) {
                return true;
            }
        }
    }

    
}])