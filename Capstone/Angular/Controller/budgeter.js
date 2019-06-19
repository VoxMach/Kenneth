module.controller("BudgetMgmt", ["$scope", "$http","$interval", function (s, h,i) {
    var userInfo = JSON.parse(localStorage.userInfo);
    var eventInfo = JSON.parse(localStorage.Manage);
    //console.log("budgeet");
    setActive(6);
    s.Csts = 0;
    s.Budget = 0;
    s.Paid = 0;
    s.RmPymnt = 0;
    
    loadBudgetDet();
    eventBudget();
    
    function loadDonut() {
       s.FDonut= Morris.Donut({
            element: 'BudgetDonut',
            data: donutData(),
            resize: true,
            colors: ['#85ce85','green','red']

       });

       

        s.SDonut=Morris.Donut({
            element: 'BudgetDonut1',
            data:  DonutDataPayment(),
            resize: true,
            colors: ['#65aee4', 'blue', 'red'],
            formatter: function (x, data) { return data.formatted; }
            
        });
    }

    function donutData() {
        ////console.log(s.Rmbdgt);
        ////console.log(s.Csts);
        if(s.Budget >= s.Csts){
        return [
            { label: "Budget Left",  value: s.Rmbdgt },
            { label:"Cost Estimate", value:s.Csts},

        ]
        }
        else {
            return [
                { label: 'Budget Left', value:0 },
                { label: 'Cost Estimate', value: s.Budget },
                { label:"Overcost",value: s.Rmbdgt*-1}
            ]
        }

      
    }

    function DonutDataPayment() {
        if (s.Csts == 0 && s.RmPymnt == 0) {
            return [{ value: 100, label: "No Estimations ", formatted: "" }]
        }
        else{
        if (s.Csts >= s.Paid) {
            return [
           { label: "To Pay", value: s.RmPymnt, formatted: s.RmPymnt },
           { label: "Paid", value: s.Paid, formatted: s.Paid },

            ]
        }
        else {
            return [
                { label: "To Pay", value: 0 ,formatted: "0" },
                { label: "Cost Paid", value: s.Csts,formatted:s.Csts },
                {label:"Overpay",value:s.RmPymnt*-1,formatted:s.RmPymnt*-1}
            ]
        }
        }
    }

    function RemainBudget() {
        s.Rmbdgt = s.Budget - s.Csts;
        ////console.log(s.Rmbdgt);
    }

    function RemainPayment() {
        s.RmPymnt = s.Csts - s.Paid;
        
    }

    s.PrgMiniStyle = function (data) {
        var Pperc = ((data.BudgetDetails.Paid * 100) / data.BudgetDetails.CostEstimate);
       
       
        
        if (Pperc) {
            if (Pperc <= 100) {
                return { 'width': Pperc + '%' };
            }
            else if (Pperc > 100) {
                return {'width':(Pperc-100)+'%','background':'red'}
            }
            
        }
        else {
            return { 'width': "0%" };

        }
        
    }

    s.PrgMiniStyle2 = function (data) {
        var Pperc = ((data.BudgetDetails.Paid * 100) / data.BudgetDetails.CostEstimate);

        if (Pperc!=0) {
            if(Pperc <= 100){
            var Cperc = 100 - Pperc;
            return { 'width': Cperc + '%','background':'green' };
            }
            else if (Pperc > 100) {
                Cperc = 200 - Pperc;
                return { 'width': Cperc + '%', 'background': '#f8ac59' };
            }
        }
        else {
            
            return { 'width': "100%", 'background': 'green' };
        }
       

        
    }

    function loadBudgetDet() {
        
        h.post("../Event/getBudgetlist?eventID=" + eventInfo[0].id + "&userID=" + userInfo[0].userID + "&eventType=" + eventInfo[0].type).then(function (r) {
            s.BudgetList = r.data;
            //console.log(s.BudgetList);
        })

       
    }

    
    function eventBudget() {
        h.post("../Event/getEventBudget?eventID=" + eventInfo[0].id + "&eventType=" + eventInfo[0].type).then(function (r) {
            s.Budget = r.data;
            RemainBudget();
            return loadDonut();
        }).then(function () {
            costTotal();
          
        }).then(function () {
            paidTotal();
        })
    }
    function costTotal() {
        h.post("../Event/costTotal?eventID=" + eventInfo[0].id + "&eventType=" + eventInfo[0].type).then(function (r) {
            ////console.log(r.data[0].cost);
            s.Csts = r.data[0].cost;
            RemainBudget();
            s.FDonut.setData(donutData());
            paidTotal();
            
        })
    }

    function paidTotal() {
        h.post("../Event/paidTotal?eventID=" + eventInfo[0].id + "&eventType=" + eventInfo[0].type).then(function (r) {
            ////console.log(r.data[0].cost);
            s.Paid = r.data[0].paid;
            //console.log(s.Paid);
            RemainPayment();
            s.SDonut.setData(DonutDataPayment());
            


        })
    }

    s.updateBudget = function () {
        swal({
            title: "Change Event Budget",
            text: "Write something..",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "Enter Budget"
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
            else if (isNaN(inputValue)==true) {
                swal.showInputError("Value must be a number!");
                return false
            }
            
            h.post("../Event/updateEventBudget", { "eventID": eventInfo[0].id, "eventType": eventInfo[0].type, "budget": inputValue }).then(function (r) {
                //console.log(r.data);
                swal("Event budget", "Update Scuccesfull", "success");
                h.post("../Event/getEventBudget?eventID=" + eventInfo[0].id + "&eventType=" + eventInfo[0].type).then(function (r) {
                    s.Budget = r.data;
                    RemainBudget();
                    return costTotal();
                }).then(function () {
                    return paidTotal();
                })
            })




        });
    }

    s.changeCost = function (data,value) {
        //console.log(value)
        if (value == null) {
            value = 0;
        }
        //console.log(data.BudgetDetails);
        h.post("../Event/updateBudgetCost", { "eventID": eventInfo[0].id, "eventType": eventInfo[0].type ,"value":value,"budget":data.BudgetDetails}).then(function (r) {
            loadBudgetDet();
            return costTotal();
        }).then(function () {
            
        })
       
    }

    s.changePaid = function (data, value) {

        //console.log(data);
        //console.log(value);
        if (value == null||value =='') {
            value = 0;
        }
        //console.log(data.BudgetDetails);
        h.post("../Event/updatePaidCost", { "eventID": eventInfo[0].id, "eventType": eventInfo[0].type, "value": value, "budget": data.BudgetDetails }).then(function (r) {
            loadBudgetDet();
            return paidTotal();
        })

    }
    
   
}])