using Capstone.Models;
using Capstone.Models.CustomModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Capstone.Controllers
{
    public class VendorController : Controller
    {
        EventAideEntities db = new EventAideEntities();
        // GET: Vendor
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }

        public ActionResult VendorDashboardPartial()
        {
            return View();
        }
        public ActionResult Calendar()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult CalendarPartial()
        {
            return View();
        }
        public ActionResult Book()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult BookPartial()
        {
            return View();
        }
        public ActionResult Bookings()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult BookingsPartial()
        {
            return View();
        }
        public ActionResult Bookmarks()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }
        public ActionResult BookmarksPartial()
        {
            return View();
        }
        
        public ActionResult List()
        {
            return View();
        }

        public ActionResult Info()
        {
            return View();
        }

        public ActionResult CompanyList()
        {
            return View();
        }
        public ActionResult getPageID(int companyID)
        {
            var pid = db.tbl_company.Where(x => x.CompanyID == companyID).Select(x => x.PageID).First();
            return Json(pid, JsonRequestBehavior.AllowGet);
        }
        public ActionResult setPageID(int companyID,string pageID)
        {
            var company = db.tbl_company.Where(x => x.CompanyID == companyID).First();
            company.PageID = pageID;
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }
        

        public ActionResult getCompanyServices(int userID)
        {
            var companies = db.tbl_company.Where(x => x.userID == userID).Select(x => x)
                            .Join(db.tbl_services, x => x.ServiceType, y => y.ID, (x, y) => new { x, y })
                            .Join(db.tbl_dispImg, x => x.x.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                            .Select(cnstrct => new
                            {
                                CompanyInfo=cnstrct.x.x,
                                DispImg=cnstrct.y.FilePath,
                                ServiceType=cnstrct.x.y.ServiceName
                            })
                            .ToList();
            return Json(companies, JsonRequestBehavior.AllowGet);

        }
        public ActionResult getCompanyID(int userID)
        {
            var cid = db.tbl_company.Where(x => x.userID == userID).Select(x => x.CompanyID).First();
            return Json(cid, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getOwnedService(int userID, int companyID)
        {
            var ownlist = db.tbl_company.Where(x => x.userID == userID & x.CompanyID != companyID)
                         .Join(db.tbl_dispImg, x => x.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                         .Join(db.tbl_services, x => x.x.ServiceType, y => y.ID, (x, y) => new { x,y})
                         .Select(cnstrct => new
                         {
                            CompanyInfo=cnstrct.x.x,
                            Img=cnstrct.x.y.FilePath,
                            ServiceName=cnstrct.y.ServiceName
                         });

            return Json(ownlist, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getVendorList( string city,int servtype)
        {
            if (servtype == 0)
            {
                string query = "Select tbl_company.*,tbl_dispImg.*,B.*,ServiceName from tbl_company " +
                           "inner join tbl_dispImg on tbl_company.CompanyID = tbl_dispImg.CompanyID " +
                           "inner join tbl_services on tbl_company.ServiceType =tbl_services.ID" +
                          " left join (Select CompanyID, Sum(Rating) as RateTotal, Count(Rating) as RateCounter from tbl_rating group by CompanyID) as B on " +
                          "tbl_company.CompanyID=B.CompanyID where City in (" + city + ") and ServiceType= any (select ID from tbl_services)";
                var comp = db.Database.SqlQuery<CompanyInfo>(query).ToList();
                return Json(comp, JsonRequestBehavior.AllowGet);
            }
            else

            {
                string query = "Select tbl_company.*,tbl_dispImg.*,B.*,ServiceName from tbl_company " +
                           "inner join tbl_dispImg on tbl_company.CompanyID = tbl_dispImg.CompanyID " +
                           "inner join tbl_services on tbl_company.ServiceType =tbl_services.ID" +
                          " left join (Select CompanyID, Sum(Rating) as RateTotal, Count(Rating) as RateCounter from tbl_rating group by CompanyID) as B on " +
                          "tbl_company.CompanyID=B.CompanyID where City in (" + city + ") and ServiceType=" + servtype;
                var comp = db.Database.SqlQuery<CompanyInfo>(query).ToList();
                return Json(comp, JsonRequestBehavior.AllowGet);

            }
           

         
        }

        public ActionResult getServVendor(int serviceID)
        {
            string query = "Select tbl_company.*,tbl_dispImg.*,B.*,ServiceName from tbl_company " +
                          "inner join tbl_dispImg on tbl_company.CompanyID = tbl_dispImg.CompanyID " +
                          "inner join tbl_services on tbl_company.ServiceType =tbl_services.ID" +
                         " left join (Select CompanyID, Sum(Rating) as RateTotal, Count(Rating) as RateCounter from tbl_rating group by CompanyID) as B on " +
                         "tbl_company.CompanyID=B.CompanyID where ServiceType=" + serviceID;
            var comp = db.Database.SqlQuery<CompanyInfo>(query).ToList();
            return Json(comp, JsonRequestBehavior.AllowGet);

        }

        public ActionResult getCustomBookmark(int userID)
        {
            string query = "select BookmarkID,City,tbl_bookmarks.CompanyID,CompanyName,Province,RateTotal,RateCounter,ServiceName,tbl_bookmarks.userID,FilePath from tbl_bookmarks " +
                            "inner join tbl_Company on tbl_bookmarks.companyID=tbl_company.CompanyID " +
                            "left join (Select CompanyID, Sum(Rating) as RateTotal, Count(Rating) as RateCounter from tbl_rating group by CompanyID) as B on tbl_company.CompanyID=B.CompanyID " +
                            "inner join tbl_services on tbl_company.ServiceType=tbl_services.ID " +
                            "inner join tbl_dispImg on tbl_company.CompanyID = tbl_dispImg.CompanyID " +
                            "where tbl_bookmarks.userID=" + userID;
            var bk = db.Database.SqlQuery<BookmarkInfo>(query).ToList();
            return Json(bk, JsonRequestBehavior.AllowGet);

        }

        public ActionResult getIDVendor(int CompanyID)
        {
            string query = "Select tbl_company.*,FilePath,B.*,ServiceName from tbl_company "+
                            "left join (Select CompanyID, Sum(Rating) as RateTotal, Count(Rating) as RateCounter from tbl_rating group by CompanyID) as B on tbl_company.CompanyID=B.CompanyID "+
                            "inner join tbl_dispImg on tbl_company.CompanyID = tbl_dispImg.CompanyID " +
                            "inner join tbl_services on tbl_company.ServiceType =tbl_services.ID "+
                            "where tbl_Company.CompanyID="+CompanyID;
            var comp = db.Database.SqlQuery<CompanyInfo>(query).ToList();
            return Json(comp, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getAllRater(int userID)
        {
            string query = "select tbl_user.firstname,tbl_user.lastname,tbl_user.profpath,tbl_rating.DateRated,tbl_rating.Comment,tbl_rating.Rating from tbl_user " +
                            "inner join tbl_company on tbl_user.userID=tbl_company.userID " +
                            "inner join tbl_rating on tbl_company.CompanyID=tbl_rating.CompanyID " +
                            "where tbl_user.userID=" + userID;
            var rater = db.Database.SqlQuery<RateInfo>(query).ToList();
            return Json(rater, JsonRequestBehavior.AllowGet);
        }
        

        public ActionResult getSpVendor(string companyName)
        {
            string query = "Select tbl_company.*,tbl_dispImg.*,B.*,ServiceName from tbl_company " +
                          "inner join tbl_dispImg on tbl_company.CompanyID = tbl_dispImg.CompanyID " +
                          "inner join tbl_services on tbl_company.ServiceType =tbl_services.ID" +
                         " left join (Select CompanyID, Sum(Rating) as RateTotal, Count(Rating) as RateCounter from tbl_rating group by CompanyID) as B on " +
                         "tbl_company.CompanyID=B.CompanyID where CompanyName like '%" + companyName + "%'";
            var comp = db.Database.SqlQuery<CompanyInfo>(query).ToList();
            return Json(comp, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getVendorInfo(int CompanyID)
        {
            var vendor = db.tbl_company.Where(x => x.CompanyID == CompanyID)
                       .Join(db.tbl_services, x => x.ServiceType, y => y.ID, (x, y) => new { x, y })
                       .Join(db.tbl_dispImg, x => x.x.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Select(cnstrct => new
                       {
                           CompanyID=cnstrct.x.x.CompanyID,
                           CompanyName=cnstrct.x.x.CompanyName,
                           Sypnosis=cnstrct.x.x.Sypnosis,
                           Province=cnstrct.x.x.Province,
                           City=cnstrct.x.x.City,
                           ContactNo=cnstrct.x.x.ContactNo,
                           StartPrice=cnstrct.x.x.StartPrice,
                           EndPrice=cnstrct.x.x.EndPrice,
                           userID=cnstrct.x.x.userID,
                           ServiceName=cnstrct.x.y.ServiceName,
                           FilePath=cnstrct.y.FilePath
                       });

            return Json(vendor, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getBookmarkCount(int userID)
        {
            var bcount = db.tbl_bookmarks.Where(x => x.userID == userID).Select(x => x).Count();
            return Json(bcount, JsonRequestBehavior.AllowGet);
        }
        public ActionResult createRate(tbl_rating rate)
        {
            db.tbl_rating.Add(rate);
            db.SaveChanges();
            return Json(rate, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ifRated(int userID, int CompanyID)
        {
            var isRated = db.tbl_rating.Where(x => x.userID == userID && x.CompanyID == CompanyID).Count();
            return Json(isRated, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ifBooked(int eventID, string eventType, int CompanyID)
        {
            var isBooked = db.tbl_bookings.Where(x => x.eventID == eventID && x.eventType == eventType && x.companyID == CompanyID && x.BookStatus!=0).Count();
            return Json(isBooked, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getRate(int CompanyID)
        {
            var Rates = db.tbl_rating.Where(x => x.CompanyID == CompanyID).Select(x => x).ToList();
            return Json(Rates,JsonRequestBehavior.AllowGet);
        }

        public ActionResult getRateNew(int CompanyID)
        {
            var Rates = db.tbl_rating.Where(x => x.CompanyID == CompanyID).Join(db.tbl_user, x => x.userID, y => y.userID, (x, y) =>
                new { x, y })
                .Select(cnstrct => new
                {
                    Comment = cnstrct.x.Comment,
                    CompanyID = cnstrct.x.CompanyID,
                    DateRated = cnstrct.x.DateRated,
                    RateID = cnstrct.x.RateID,
                    Rating = cnstrct.x.Rating,
                    userID = cnstrct.x.userID,
                    userfname = cnstrct.y.firstname,
                    userlname = cnstrct.y.lastname,
                    userprofpic = cnstrct.y.profpath
                }).ToList();

            return Json(Rates, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getTotalRate(int CompanyID)
        {
            var Rates = db.tbl_rating.Where(x => x.CompanyID == CompanyID).GroupBy(i=>1).Select(x => new{TotalRate = x.Sum(y=>y.Rating) , RateCount=x.Count()});
            return Json(Rates, JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveBooking(tbl_bookings booking)
        {
            db.tbl_bookings.Add(booking);
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }
        public ActionResult saveCustomSchedule(string title,string startD,string endD,int CompanyID,string BookSched)
        {
            tbl_bookings booking = new tbl_bookings();
            booking.eventTitle = title;
            booking.BookDate = startD;
            booking.BookDateEnd = endD;
            booking.eventType = "Custom";
            booking.companyID = CompanyID;
            booking.BookStatus = 1;
            booking.BookSched = BookSched;
            db.tbl_bookings.Add(booking);
            db.SaveChanges();
            return Json(booking, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getPendingBookings(int CompanyID)
        {
            var booklist = db.tbl_bookings.Where(x => x.companyID == CompanyID && (x.BookStatus == 0 || x.BookStatus==3 || x.BookStatus==4)).Join(db.tbl_user, x => x.userID, y => y.userID, (x, y) =>
                new { x, y }).Select(cnstrct => new
                {
                    BookDate = cnstrct.x.BookDate,
                    BookDateEnd = cnstrct.x.BookDateEnd,
                    BookID = cnstrct.x.BookID,
                    BookMsg = cnstrct.x.BookMsg,
                    BookStatus = cnstrct.x.BookStatus,
                    companyID = cnstrct.x.companyID,
                    eventID = cnstrct.x.eventID,
                    eventType = cnstrct.x.eventType,
                    eventTitle = cnstrct.x.eventTitle,
                    userID = cnstrct.x.userID,
                    userpic = cnstrct.y.profpath,
                    userfname = cnstrct.y.firstname,
                    userlname = cnstrct.y.lastname,
                    booksched=cnstrct.x.BookSched
                }).ToList();

            return Json(booklist, JsonRequestBehavior.AllowGet);
        }

        public ActionResult updateSchedule(int BookID,string startd,string endd,string booksched)
        {
            var bookdet = db.tbl_bookings.Where(x => x.BookID == BookID).First();
            bookdet.BookSched = booksched;
            bookdet.BookDate = startd;
            bookdet.BookDateEnd = endd;
            db.SaveChanges();
            return Json(bookdet, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getSpBook(string startD)
        {
            string query = "Select * from tbl_bookings where BookDate like '"+startD+"%'";
            var comp = db.Database.SqlQuery<BookInfo>(query).ToList();
            return Json(comp, JsonRequestBehavior.AllowGet);


        }

        public ActionResult getBookings(int CompanyID)
        {
            var booklist = db.tbl_bookings.Where(x => x.companyID == CompanyID && x.BookStatus == 1 ).Join(db.tbl_user, x => x.userID, y => y.userID, (x, y) =>
                new { x, y }).Select(cnstrct => new
                {
                    BookDate = cnstrct.x.BookDate,
                    BookDateEnd = cnstrct.x.BookDateEnd,
                    BookID = cnstrct.x.BookID,
                    BookMsg = cnstrct.x.BookMsg,
                    BookStatus = cnstrct.x.BookStatus,
                    companyID = cnstrct.x.companyID,
                    eventID = cnstrct.x.eventID,
                    eventType = cnstrct.x.eventType,
                    eventTitle = cnstrct.x.eventTitle,
                    userID = cnstrct.x.userID,
                    userpic = cnstrct.y.profpath,
                    userfname = cnstrct.y.firstname,
                    userlname = cnstrct.y.lastname,
                    
                }).ToList();
            return Json(booklist, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getClientBookings(string eventType, int eventID)
        {
            if (eventType == "Birthdays")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Birthdays" && x.eventID == eventID && x.BookStatus != 1)
                        .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                        .Select(cnstrct => new
                        {
                            BookDetails = cnstrct.x.x.x,
                            CompanyDetails = cnstrct.x.x.y,
                            dispImg = cnstrct.x.y.FilePath,
                            serviceName = cnstrct.y.ServiceName,
                        });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }
            else if(eventType=="Weddings"){
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Weddings" && x.eventID == eventID && x.BookStatus != 1)
                        .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x,y})
                        .Select(cnstrct => new {
                            BookDetails=cnstrct.x.x.x,
                            CompanyDetails=cnstrct.x.x.y,
                            dispImg=cnstrct.x.y.FilePath,
                            serviceName=cnstrct.y.ServiceName,
                        });

   
             return Json(booklist, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Reunions")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Reunions" && x.eventID == eventID && x.BookStatus != 1)
                        .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                        .Select(cnstrct => new
                        {
                            BookDetails = cnstrct.x.x.x,
                            CompanyDetails = cnstrct.x.x.y,
                            dispImg = cnstrct.x.y.FilePath,
                            serviceName = cnstrct.y.ServiceName,
                        });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Others")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Others" && x.eventID == eventID && x.BookStatus != 1)
                        .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                        .Select(cnstrct => new
                        {
                            BookDetails = cnstrct.x.x.x,
                            CompanyDetails = cnstrct.x.x.y,
                            dispImg = cnstrct.x.y.FilePath,
                            serviceName = cnstrct.y.ServiceName,
                        });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }

            return Json("ERORR", JsonRequestBehavior.AllowGet);

        }

        public ActionResult getClientBookingsAccepted(string eventType, int eventID)
        {
            if (eventType == "Birthdays")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Birthdays" && x.eventID == eventID && (x.BookStatus == 1 || x.BookStatus==3))
                       .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                       .Select(cnstrct => new
                       {
                           BookDetails = cnstrct.x.x.x,
                           CompanyDetails = cnstrct.x.x.y,
                           dispImg = cnstrct.x.y.FilePath,
                           serviceName = cnstrct.y.ServiceName
                       });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Weddings")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Weddings" && x.eventID == eventID && (x.BookStatus == 1 || x.BookStatus == 3))
                        .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                        .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                        .Select(cnstrct => new
                        {
                            BookDetails = cnstrct.x.x.x,
                            CompanyDetails = cnstrct.x.x.y,
                            dispImg = cnstrct.x.y.FilePath,
                            serviceName=cnstrct.y.ServiceName
                        });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Reunions")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Reunions" && x.eventID == eventID && (x.BookStatus == 1 || x.BookStatus == 3))
                       .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                       .Select(cnstrct => new
                       {
                           BookDetails = cnstrct.x.x.x,
                           CompanyDetails = cnstrct.x.x.y,
                           dispImg = cnstrct.x.y.FilePath,
                           serviceName = cnstrct.y.ServiceName
                       });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }
            else if (eventType == "Others")
            {
                var booklist = db.tbl_bookings.Where(x => x.eventType == "Others" && x.eventID == eventID && (x.BookStatus == 1 || x.BookStatus == 3))
                       .Join(db.tbl_company, x => x.companyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Join(db.tbl_dispImg, x => x.y.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                       .Join(db.tbl_services, x => x.x.y.ServiceType, y => y.ID, (x, y) => new { x, y })
                       .Select(cnstrct => new
                       {
                           BookDetails = cnstrct.x.x.x,
                           CompanyDetails = cnstrct.x.x.y,
                           dispImg = cnstrct.x.y.FilePath,
                           serviceName = cnstrct.y.ServiceName
                       });


                return Json(booklist, JsonRequestBehavior.AllowGet);
            }


            return Json("ERORR", JsonRequestBehavior.AllowGet);
        }

        public ActionResult getBookingsCalendar(int CompanyID)
        {
            //var booklist = db.tbl_bookings.Where(x => x.companyID == CompanyID && x.BookStatus == 1).Join(db.tbl_user, x => x.userID, y => y.userID, (x, y) =>
            //    new { x, y }).Select(cnstrct => new
            //    {
            //        start = cnstrct.x.BookDate,
            //        end = cnstrct.x.BookDateEnd,
            //        BookID = cnstrct.x.BookID,
            //        BookMsg = cnstrct.x.BookMsg,
            //        BookStatus = cnstrct.x.BookStatus,
            //        companyID = cnstrct.x.companyID,

            //        eventID = cnstrct.x.eventID,
            //        eventType = cnstrct.x.eventType,
            //        title = cnstrct.x.eventTitle,
            //        userID = cnstrct.x.userID,
            //        userpic = cnstrct.y.profpath,
            //        userfname = cnstrct.y.firstname,
            //        userlname = cnstrct.y.lastname
            //    }).ToList();

            var booklist = db.tbl_bookings.Where(x => x.companyID == CompanyID && x.BookStatus == 1)
                .GroupJoin(db.tbl_user,foo => foo.userID,bar => bar.userID,(x, y) => new { x, y })
                .SelectMany(x => x.y.DefaultIfEmpty(),
                       (cnstrct, y) => new { 
                       start=cnstrct.x.BookDate,
                       end=cnstrct.x.BookDateEnd,
                       BookID = cnstrct.x.BookID,
                       BookMsg = cnstrct.x.BookMsg,
                       BookStatus = cnstrct.x.BookStatus,
                       companyID = cnstrct.x.companyID,
                       eventID=cnstrct.x.eventID,
                       eventType=cnstrct.x.eventType,
                       title=cnstrct.x.eventTitle,
                       userID=cnstrct.x.userID,
                       userpic=y.profpath,
                       userfname=y.firstname,
                       userlname=y.lastname,
                       booksched = cnstrct.x.BookSched
                       }).ToList();
           
            return Json(booklist, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SetBooking(tbl_bookings booking)
        {
            booking.BookStatus = 4;
            db.Entry(booking).State = EntityState.Modified;
            db.SaveChanges();
            return Json(booking, JsonRequestBehavior.AllowGet);
        }



        public ActionResult AcceptBooking(tbl_bookings booking)
        {
            //var bookx=db.tbl_bookings.Where(x=>x.BookID==)
            booking.BookStatus = 1;
            db.Entry(booking).State = EntityState.Modified;
            db.SaveChanges();       
            return Json(booking, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeclineBooking(tbl_bookings booking)
        {
            booking.BookStatus = 2;
            db.Entry(booking).State = EntityState.Modified;
            db.SaveChanges();
            return Json(booking, JsonRequestBehavior.AllowGet);
        }

        public ActionResult requestCancelBooked(tbl_bookings booking)
        {
            booking.BookStatus = 3;
            db.Entry(booking).State = EntityState.Modified;
            db.SaveChanges();
            return Json(booking, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CancelBooking(int bookID)
        {
            tbl_bookings booking = new tbl_bookings { BookID = bookID };
            db.tbl_bookings.Attach(booking);
            db.Entry(booking).State = EntityState.Deleted;
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }
        
    }
}