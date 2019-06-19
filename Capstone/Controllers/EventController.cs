using Capstone.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Capstone.Controllers
{
    public class EventController : Controller
    {
        EventAideEntities db = new EventAideEntities();
        // GET: Event
        public ActionResult Index()
        {
            return View();
        }
       

        public ActionResult Dashboard()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }

        public ActionResult Checklist()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult SearchVendor()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult ChecklistPartial()
        {
            return View();
        }
        public ActionResult DashboardPartial()
        {
            return View();
        }
        public ActionResult SearchVendorPartial()
        {
            return View();
        }
        public ActionResult Budget()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult BudgetPartial()
        {
            return View();
        }
        

        [HttpPost]
        public ActionResult getBirthdayDet(int eventID)
        {
            var BdayDet = db.tbl_bday.Where(x => x.BirthdayID == eventID)
                .Join(db.tbl_provinces, x => x.ProvID, y => y.provinceID, (x, y) => new { x, y })
                .Join(db.tbl_cities, x => x.x.CityID, y => y.cityID, (x, y) => new { x, y })
                .Select(cnstrct => new
                {
                    BirthdayID = cnstrct.x.x.BirthdayID,
                    EventName = cnstrct.x.x.EventName,
                    CelebFirstN = cnstrct.x.x.CelebFirstN,
                    CelebLastN = cnstrct.x.x.CelebLastN,
                    CurAge = cnstrct.x.x.CurAge,
                    EventDate = cnstrct.x.x.EventDate,
                    EstimatedBudget = cnstrct.x.x.EstimatedBudget,
                    ProvName = cnstrct.x.y.name,
                    CityName = cnstrct.y.cityName
                }).First();
            return Json(BdayDet, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getWeddingDet(int eventID)
        {
            var WeddingDet = db.tbl_wedding.Where(x => x.WeddingID == eventID)
                 .Join(db.tbl_provinces, x => x.ProvinceID, y => y.provinceID, (x, y) => new { x, y })
                 .Join(db.tbl_cities, x => x.x.CityID, y => y.cityID, (x, y) => new { x, y })
                 .Select(cnstrct => new
                 {
                     BrideFirstN = cnstrct.x.x.BrideFirstN,
                     BrideLastN = cnstrct.x.x.BrideLastN,
                     CityName = cnstrct.y.cityName,
                     EstimatedBudget = cnstrct.x.x.EstimatedBudget,
                     EventDate = cnstrct.x.x.EventDate,
                     EventName = cnstrct.x.x.EventName,
                     GroomFirstN = cnstrct.x.x.GroomFirstN,
                     GroomLastN = cnstrct.x.x.GroomLastN,
                     ProvName = cnstrct.x.y.name,
                     WeddingID = cnstrct.x.x.WeddingID,
                     userID = cnstrct.x.x.userID
                 }).First();
            return Json(WeddingDet, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getReunionDet(int eventID)
        {
            var ReunionDet = db.tbl_reunion.Where(x => x.ReunionID == eventID).Select(x => x)
                .Join(db.tbl_provinces, x => x.ProvID, y => y.provinceID, (x, y) => new { x, y })
                 .Join(db.tbl_cities, x => x.x.CityID, y => y.cityID, (x, y) => new { x, y })
                 .Select(cnstrct => new
                 {
                     CityName = cnstrct.y.cityName,
                     Class = cnstrct.x.x.Class,
                     EstimatedBudget = cnstrct.x.x.EstimatedBudget,
                     EventDate = cnstrct.x.x.EventDate,
                     EventName = cnstrct.x.x.EventName,
                     ProvName = cnstrct.x.y.name,
                     ReunionID = cnstrct.x.x.ReunionID,
                     ReunionType = cnstrct.x.x.ReunionType,
                     SchoolName = cnstrct.x.x.SchoolName,
                     userID = cnstrct.x.x.userID
                 }).First();
            return Json(ReunionDet, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getOtherPartyDet(int eventID)
        {
            var OtherPartyDet = db.tbl_otherParty.Where(x => x.PartyID == eventID).Select(x => x)
                .Join(db.tbl_provinces, x => x.ProvID, y => y.provinceID, (x, y) => new { x, y })
                 .Join(db.tbl_cities, x => x.x.CityID, y => y.cityID, (x, y) => new { x, y })
                 .Select(cnstrct => new
                 {
                     CityName = cnstrct.y.cityName,
                     EstimatedBudget = cnstrct.x.x.EstimatedBudget,
                     EventDate = cnstrct.x.x.EventDate,
                     EventName = cnstrct.x.x.EventName,
                     PartyID = cnstrct.x.x.PartyID,
                     userID = cnstrct.x.x.userID
                 }).First();
            return Json(OtherPartyDet, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEventDate(int eventID, string eventType)
        {
            if (eventType == "Weddings")
            {
                var eventdet = db.tbl_wedding.Where(x => x.WeddingID == eventID).Select(x=>x.EventDate).First();
               
                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Birthdays")
            {
                var eventdet = db.tbl_bday.Where(x => x.BirthdayID == eventID).Select(x => x.EventDate).First();

                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Reunions")
            {
                var eventdet = db.tbl_reunion.Where(x => x.ReunionID == eventID).Select(x => x.EventDate).First();

                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Others")
            {
                var eventdet = db.tbl_otherParty.Where(x => x.PartyID == eventID).Select(x => x.EventDate).First();

                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            return Json("Empty", JsonRequestBehavior.AllowGet);
        }
        public ActionResult getBirthday(int userID)
        {
            var Bdaylist = db.tbl_bday.Where(x => x.userID == userID).Select(x => x).ToList();
            
            return Json(Bdaylist, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult getWeddings(int userID)
        {
            var Wedlist = db.tbl_wedding.Where(x => x.userID == userID).Select(x => x).ToList();
            return Json(Wedlist, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getReunions(int userID)
        {
            var Reunionlist = db.tbl_reunion.Where(x => x.userID == userID).Select(x => x).ToList();
            return Json(Reunionlist, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getOtherParty(int userID)
        {
            var OtherParty = db.tbl_otherParty.Where(x => x.userID == userID).Select(x => x).ToList();
            return Json(OtherParty, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getProvince()
        {
            var prov = db.tbl_provinces.Select(x => x).ToList();
           
            //var prov = db.tbl_provinces.Where(x => x.name == "Abra" && x.provinceID == 1).Select(e => new { e.provinceID, e.name }).ToList();
            
            return Json(prov, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getProvinceName(int ProvID)
        {
            var provname = db.tbl_provinces.Where(x => x.provinceID == ProvID).Select(x => x.name).ToList();
            
            return Json(provname, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getCity(string provName)
        {
            int provID = db.tbl_provinces.Where(x => x.name == provName).Select(x=> x.provinceID).FirstOrDefault();
            var city = db.tbl_cities.Where(x => x.provinceID == provID).Select(e => new { e.cityID, e.cityName }).ToList();
            return Json(city, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getAllCity()
        {
            var cityname = db.tbl_cities.Select(x=>x).ToList();
            return Json(cityname, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult createWedding(tbl_wedding wed)
        {
            db.tbl_wedding.Add(wed);
            db.SaveChanges();
            return Json(wed, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]

        public ActionResult createBday(tbl_bday BdayData)
        {
            db.tbl_bday.Add(BdayData);
            db.SaveChanges();
            return Json(BdayData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult createReunion(tbl_reunion ReunionData)
        {
            db.tbl_reunion.Add(ReunionData);
            db.SaveChanges();
            return Json(ReunionData, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult createOtherParty(tbl_otherParty PartyData)
        {
            db.tbl_otherParty.Add(PartyData);
            db.SaveChanges();
            return Json(PartyData, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]

        public ActionResult manageEvent(int id, string type)
        {
            if (type == "Birthdays")
            {
                var BdayDet = db.tbl_bday.Where(x => x.BirthdayID == id).Select(x => x).ToList();

                return Json(BdayDet, JsonRequestBehavior.AllowGet);
            }
            return Json("Error",JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getAllTask()
        {
            var Tasks = db.tbl_Task.Select(x => x).ToList();
            return Json(Tasks, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getTasklist(string type)
        {
            var Tasks = db.tbl_Task.Where(x => x.EventType == type).Select(x=> x).ToList();
            return Json(Tasks, JsonRequestBehavior.AllowGet);
        }

        
        [HttpPost]
        public ActionResult setChecklist(List<tbl_checklist> checklistdata){
            for (int x = 0; x < checklistdata.Count ; x++)
            {
                db.tbl_checklist.Add(checklistdata[x]);
            }
            db.SaveChanges();
                return Json(checklistdata, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getUserTasklist(int UserID, string type, int EventID)
        {
            int indx = 0;
            var UserTask = db.tbl_checklist.Where(x => x.userID == UserID & x.eventType == type & x.eventID == EventID).Select(x => x).ToList();
            foreach (var value in UserTask)
            {
                //Kenneth
                //UserTask[indx].TaskName = getTaskName((int)value.TaskID);
                //UserTask[indx].ServiceID = getTaskService((int)value.TaskID);
                //Kenneth/
                //Moralde
                UserTask[indx].TaskName = db.tbl_Task.Where(x => x.TaskID == value.TaskID).Select(x => x.TaskName).ToList();
                db.tbl_Task.Where(x => x.TaskID == value.TaskID).Select(x => x.TaskName).ToList();
                //Moralde/
                indx++;
            }
            return Json(UserTask, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getChecklist(int eventID)
        {
            var checklist = db.tbl_checklist.Where(x => x.eventID == eventID).Select(x => x).ToList();
            return Json(checklist, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult getTaskName(int TaskID)
        {
            var taskname = db.tbl_Task.Where(x => x.TaskID == TaskID).Select(x => x.TaskName).ToList();
            return Json(taskname,JsonRequestBehavior.AllowGet);
        }
         public ActionResult getTaskService(int TaskID)
         {
             var serviceID = db.tbl_Task.Where(x => x.TaskID == TaskID).Select(x => x.ServiceID).ToList();
             return Json(serviceID, JsonRequestBehavior.AllowGet);
         }

         
         public ActionResult getUnfinishedCount(int eventID)
         {
             var unfincount = db.tbl_checklist.Where(x => x.eventID == eventID && x.IsFinished==0).Select(x=>x).Count();
             return Json(unfincount, JsonRequestBehavior.AllowGet);
         }
         public ActionResult getFinishedCount(int eventID)
         {
             var fincount = db.tbl_checklist.Where(x => x.eventID == eventID && x.IsFinished == 1).Select(x => x).Count();
             return Json(fincount, JsonRequestBehavior.AllowGet);
         }
        public ActionResult updateChecklist(tbl_checklist details)
        {
            db.Entry(details).State = EntityState.Modified;
            db.SaveChanges();
            return Json(details, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ex()
        {
            var x= getTasklist("Weddings");
            return Json(x, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult getServices()
        {
            var Services = db.tbl_services.Select(x => x).ToList();
            return Json(Services, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getServiceDet(int ServiceID)
        {
            var Services = db.tbl_services.Where(x => x.ID == ServiceID).First();
            return Json(Services, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getServiceName(int ID)
        {
            var servname = db.tbl_services.Where(x => x.ID == ID).Select(x => x.ServiceName).First();
            return Json(servname, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getRemainBudget(int eventID,string eventType)
        {
            var det = db.tbl_bday.Where(x => x.BirthdayID == eventID).Join(db.tbl_budgeter, x => x.BirthdayID, y => y.eventID, (x, y) => new { x, y }).GroupBy(x=>x.x.EstimatedBudget)
                 .Select(cnstrct => new 
                 {
                     Budget=cnstrct.Key,
                     Cost=cnstrct.Sum(y=>y.y.CostEstimate)
                 });
            return Json(det, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]

        public ActionResult setBudget( List<tbl_budgeter> budget,int eventID,string eventType,int userID)
        {
           
            
            for (int x = 0; x < budget.Count(); x++)
            {
                budget[x].eventID = eventID;
                budget[x].eventType = eventType;
                budget[x].CostEstimate = 0;
                budget[x].Paid = 0;
                budget[x].userID = userID;
                db.tbl_budgeter.Add(budget[x]);
            }

            db.SaveChanges();

            return Json(budget, JsonRequestBehavior.AllowGet);
        }

        public ActionResult updateEventBudget(int eventID, string eventType,int budget)
        {
            if (eventType == "Weddings")
            {
                var eventdet = db.tbl_wedding.Where(x => x.WeddingID == eventID).First();
                eventdet.EstimatedBudget = budget;
                db.SaveChanges();
                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Birthdays")
            {
                var eventdet = db.tbl_bday.Where(x => x.BirthdayID == eventID).First();
                eventdet.EstimatedBudget = budget;
                db.SaveChanges();
                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Reunions")
            {
                var eventdet = db.tbl_reunion.Where(x => x.ReunionID == eventID).First();
                eventdet.EstimatedBudget = budget;
                db.SaveChanges();
                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Others")
            {
                var eventdet = db.tbl_otherParty.Where(x => x.PartyID == eventID).First();
                eventdet.EstimatedBudget = budget;
                db.SaveChanges();
                return Json(eventdet, JsonRequestBehavior.AllowGet);
            }
            return Json("Empty", JsonRequestBehavior.AllowGet);
        }

        public ActionResult getBudgeter(int eventID,string eventType,int userID)
        {
            var Budgetdet = db.tbl_Task.Where(x => x.EventType == "Weddings").Join(db.tbl_services, x => x.ServiceID, y => y.ID, (x, y) => new { x, y })
                        .Select(cnstrct => new
                        {
                            ServiceName = cnstrct.y.ServiceName
                        }).ToList();
            List<tbl_budgeter> budgeterList = new List<tbl_budgeter>();
            for (int x = 0; x < Budgetdet.Count; x++)
            {
                budgeterList[x].ServiceName = Budgetdet[x].ServiceName;
                budgeterList[x].CostEstimate = 0;
                budgeterList[x].Paid = 0;
                budgeterList[x].eventID = eventID;
                budgeterList[x].eventType = eventType;
                budgeterList[x].userID = userID;
                db.tbl_budgeter.Add(budgeterList[x]);
                
            }
            db.SaveChanges();
            return Json(Budgetdet, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getBudgetlist(int eventID,int userID,string eventType)
        {
            var list = db.tbl_budgeter.Where(x => x.eventID == eventID && x.userID == userID && x.eventType == eventType)
                                    .GroupJoin(db.tbl_company, x => x.BookCompany, y => y.CompanyID, (x, y) => new { x, y })
                                    
                                    .Select(cnstrct => new
                                    {
                                        BudgetDetails = cnstrct.x,
                                        CompanyDetails = cnstrct.y
                                    }).ToList();

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEventBudget(int eventID, string eventType)
        {
       
            if (eventType == "Weddings")
            {
                 var det = db.tbl_wedding.Where(x => x.WeddingID == eventID).Select(x => x.EstimatedBudget).First();
                 return Json(det, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Birthdays")
            {
                var det = db.tbl_bday.Where(x => x.BirthdayID == eventID).Select(x => x.EstimatedBudget).First();
                return Json(det, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Reunions")
            {
                var det = db.tbl_reunion.Where(x => x.ReunionID == eventID).Select(x => x.EstimatedBudget).First();
                return Json(det, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Others")
            {
                var det = db.tbl_otherParty.Where(x => x.PartyID == eventID).Select(x => x.EstimatedBudget).First();
                return Json(det, JsonRequestBehavior.AllowGet);
            }
            return Json("Empty", JsonRequestBehavior.AllowGet);
        }


        public ActionResult costTotal(int eventID, string eventType)
        {
            var totalcost = db.tbl_budgeter.Where(x => x.eventID == eventID && x.eventType == eventType).GroupBy(i => 1).Select(x => new { cost = x.Sum(y => y.CostEstimate) });
            return Json(totalcost, JsonRequestBehavior.AllowGet);
        }

        public ActionResult paidTotal(int eventID, string eventType)
        {
            var totalpaid = db.tbl_budgeter.Where(x => x.eventID == eventID && x.eventType == eventType).GroupBy(i => 1).Select(x => new { paid = x.Sum(y => y.Paid) });
            return Json(totalpaid, JsonRequestBehavior.AllowGet);
        }

        public ActionResult updateBudgetCost(int eventID, string eventType, int value,tbl_budgeter budget)
        {
            budget.CostEstimate = value;
            db.Entry(budget).State = EntityState.Modified;
            db.SaveChanges();
            

            return Json("", JsonRequestBehavior.AllowGet);  
        }

        

        public ActionResult updatePaidCost(int eventID, string eventType, int value, tbl_budgeter budget)
        {
            budget.Paid  = value;
            db.Entry(budget).State = EntityState.Modified;
            db.SaveChanges();


            return Json("", JsonRequestBehavior.AllowGet);
        }

        public ActionResult updateClientBudget(int eventID, string eventType, string serviceName, int userID,int price,int CompanyID)
        {
            try { 
            var clientBudget = db.tbl_budgeter.Where(x => x.eventID == eventID && x.eventType == eventType && x.ServiceName == serviceName && x.userID == userID).FirstOrDefault();
            
            {
                clientBudget.CostEstimate = price;
                clientBudget.BookCompany = CompanyID;
                db.Entry(clientBudget).State = EntityState.Modified;
                db.SaveChanges();
                return Json(clientBudget, JsonRequestBehavior.AllowGet);
            }
            }
            catch (Exception e)
            {
                return Json("", JsonRequestBehavior.AllowGet);
            }

           
        }

        public object setEventSession()
        {
            return Session["Event"] = 1;
        }
    }

       
}