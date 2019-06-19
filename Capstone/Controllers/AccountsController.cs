using Capstone.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Data.Entity;




namespace Capstone.Controllers
{
    public class AccountsController : Controller
    {
        EventAideEntities db = new EventAideEntities();
        // GET: Accounts
        public ActionResult Index()
        {
            return View();
        }

        

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult VendorRegister()
        {
            return View();
        }
        public ActionResult RegisterCompany()
        {
            
            return View();
        }


        [HttpPost]
        public ActionResult Register(tbl_user p, HttpPostedFileBase file)
        {

            var usercount = db.tbl_user.Where(x => x.username == p.username);
            if (usercount.Count() > 0)
            {
                if (p.confPass != p.password)
                {
                    ViewBag.NotMatch = true;
                }
                ViewBag.UserExist = true;
                return View("Register");
            }
            else if (usercount.Count() == 0)
            {

                if (p.confPass != p.password)
                {
                    ViewBag.NotMatch = true;
                    return View("Register");
                }
                else
                {
                    if (file != null)
                    {
                        string extension = Path.GetExtension(file.FileName);
                        string location = "/Uploads/" + p.username.Replace(" ", "") + extension;
                        file.SaveAs(Server.MapPath(location));
                        p.profpath = location;
                        p.usertype = "customer";
                        p.status = "Offline";

                        db.tbl_user.Add(p);
                        db.SaveChanges();
                        
                    }
                    else
                    {
                        string location = "/Uploads/Default.png";

                        p.profpath = location;
                        p.usertype = "customer";
                        p.status = "Offline";
                        db.tbl_user.Add(p);
                        db.SaveChanges();
                        
                    }
                    
                }
                
            }

            return RedirectToAction("Index", "LandingPage");
        }

            
           
           

        [HttpPost]
        public ActionResult VendorRegister(tbl_user p, HttpPostedFileBase file)
        {

            var usercount = db.tbl_user.Where(x => x.username == p.username);
            if (usercount.Count() > 0)
            {
                if (p.confPass != p.password)
                {
                    ViewBag.NotMatch = true;
                }
                ViewBag.UserExist = true;
                return View("VendorRegister");
            }
            else if (usercount.Count() == 0)
            {

                if (p.confPass != p.password)
                {
                    ViewBag.NotMatch = true;
                    return View("VendorRegister");
                }
                else
                {
                    if (file != null)
                    {
                        string extension = Path.GetExtension(file.FileName);
                        string location = "/Uploads/" + p.username.Replace(" ", "") + extension;
                        file.SaveAs(Server.MapPath(location));
                        p.profpath = location;
                        p.usertype = "vendor";
                        p.status = "Offline";

                        db.tbl_user.Add(p);
                        db.SaveChanges();

                    }
                    else
                    {
                        string location = "/Uploads/Default.png";

                        p.profpath = location;
                        p.usertype = "vendor";
                        p.status = "Offline";
                        db.tbl_user.Add(p);
                        db.SaveChanges();

                    }

                }

            }
            Session["login"] = 2;
            TempData["username"] = p.username;
            return RedirectToAction("RegisterCompany", "Accounts");
        }

        [HttpPost]
        public ActionResult createCompany(tbl_company cmpny)
        {
            cmpny.ContactNo = "0" + cmpny.ContactNo;
            db.tbl_company.Add(cmpny);
            db.SaveChanges();
            return Json(cmpny, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getCompany()
        {
            var companyInfo = db.tbl_company.Select(x => x).ToList();
            return Json(companyInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getCompanyNew()
        {
            var company = db.tbl_company.Join(db.tbl_dispImg, x => x.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                                        .Join(db.tbl_services, x => x.x.ServiceType, y => y.ID, (x, y) => new { x,y})
                                      .Select(cnstrct => new
                                      {
                                         City=cnstrct.x.x.City,
                                         CompanyID=cnstrct.x.x.CompanyID,
                                         CompanyName=cnstrct.x.x.CompanyName,
                                         ContactNo=cnstrct.x.x.ContactNo,
                                         EndPrice=cnstrct.x.x.EndPrice,
                                         Province=cnstrct.x.x.Province,
                                         ServiceName=cnstrct.y.ServiceName,
                                         ServiceType=cnstrct.y.ID,
                                         StartPrice=cnstrct.x.x.StartPrice,
                                         Sypnosis=cnstrct.x.x.Sypnosis,
                                         src=cnstrct.x.y.FilePath,
                                         userID=cnstrct.x.x.userID

                                          
                                      }).ToList();
            return Json(company, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getCompanyByID(int ID)
        {
            var companyInfo = db.tbl_company.Where(x => x.userID == ID).Select(x => x.CompanyID).ToList();
            return Json(companyInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getCompanyDetByID(int ID)
        {
            var companyInfo = db.tbl_company.Where(x => x.CompanyID == ID).Select(x => x).First();
            return Json(companyInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getCompanyDet(int ID)
        {
            var companyInfo = db.tbl_company.Where(x => x.userID == ID).Select(x => new { x.CompanyID,x.CompanyName}).ToList();
            return Json(companyInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getProfImg(int ID)
        {
            var profpath = db.tbl_user.Where(x => x.userID == ID).Select(x => x.profpath).First();
            return Json(profpath, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetByUser(string username)
        {
            var userInfo = db.tbl_user.Where(x => x.username == username).Select(e => new { e.userID, e.username, e.firstname, e.middlename, e.lastname, e.profpath, e.usertype }).ToList();
            return Json(userInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetByID(int ID)
        {
            var userInfo = db.tbl_user.Where(x => x.userID == ID).Select(x => new {x.firstname,x.lastname,x.profpath }).ToList();
            return Json(userInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getUserDet(int ID)
        {
            var userInfo = db.tbl_user.Where(x => x.userID == ID).Select(x => x).First();
            return Json(userInfo, JsonRequestBehavior.AllowGet);
        }


       
        public ActionResult Login(string username, string password,string type)
        {
            var userInfo = db.tbl_user.Where(x => x.username == username && x.password == password && x.usertype == type).Select(e => new { e.userID, e.username, e.firstname, e.middlename, e.lastname, e.profpath, e.usertype }).ToList();
            if (userInfo.Count() == 1)
            {
                if (userInfo[0].usertype == "customer")
                {
                    Session["login"] = 1;
                    
                    
                }
                else if (userInfo[0].usertype == "vendor")
                {
                    Session["login"] = 2;
                }
                return Json(userInfo, JsonRequestBehavior.AllowGet);
            }
            return Json("notfound", JsonRequestBehavior.AllowGet);  
        }


        [HttpPost]
        [Route("api/FileUpload")]
        public ActionResult Upload(tbl_gallery glry)
        {
            tbl_dispImg dsply = new tbl_dispImg();
            System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
            for (int i = 0; i < files.Count; i++)
            {
                
                System.Web.HttpPostedFile file = files[i];
                string extension = Path.GetExtension(file.FileName);
                string location = "/Uploads/" + file.FileName.Replace(" ", "");
                file.SaveAs(Server.MapPath(location));
                glry.FileName = location;
                
                db.tbl_gallery.Add(glry);
                db.SaveChanges();
                
            }
            System.Web.HttpPostedFile filex = files[0];
            string extensionx = Path.GetExtension(filex.FileName);
            string locationx = "/Uploads/" + filex.FileName.Replace(" ", "");
            filex.SaveAs(Server.MapPath(locationx));
            dsply.FilePath = locationx;
            dsply.CompanyID=glry.CompanyID;
            db.tbl_dispImg.Add(dsply);
            
            db.SaveChanges();
            
            return Json("1", JsonRequestBehavior.AllowGet);
        }
        

        [HttpPost]
        public ActionResult checkCompany(int userID)
        {
            var Companycounter = db.tbl_company.Where(x => x.userID == userID).Select(x => x).ToList();
            if (Companycounter.Count == 0)
            {
                return Json("0", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("1", JsonRequestBehavior.AllowGet);
            }
                
        }

        public ActionResult getDispImg(int ID)
        {
            var DispImg = db.tbl_dispImg.Where(x => x.CompanyID == ID).Select(x => x.FilePath).ToList();
            return Json(DispImg, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getImg(int ID)
        {
            var Gimg = db.tbl_gallery.Where(x => x.CompanyID == ID).Select(x => x.FileName).ToList();
            return Json(Gimg, JsonRequestBehavior.AllowGet);    
        }

        public ActionResult saveConID(int userID, string conID)
        {
            var user = db.tbl_user.Where(x => x.userID == userID).First();
            user.connectionID = conID;
            user.status = "Online";
            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();

            var userInfo = db.tbl_user.Where(x => x.userID == userID).Select(x => new { x.firstname, x.lastname,x.middlename ,x.profpath,x.userID,x.username,x.usertype,x.connectionID }).ToList();
            return Json(userInfo, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getConID(int userID)
        {
            var conID = db.tbl_user.Where(x => x.userID == userID).Select(x => x.connectionID).First();
            return Json(conID, JsonRequestBehavior.AllowGet);
        }

        public ActionResult onDisconnect(int userId)
        {
            var user = db.tbl_user.Where(e => e.userID == userId).First();
            user.status = "Offline";
            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public ActionResult checkOnline(int userID)
        {
            var user = db.tbl_user.Where(x => x.userID == userID).Select(x=>x.status).First();
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        

        public ActionResult getContacts(int userID)
        {
           
            var queryy = db.tbl_messages.GroupBy(x => x.ConversationToken).Select(x => new { ConversationToken = x.Key, DateSent = x.Max(y => y.Date) })
                            .Join(db.tbl_messages, x => new { ConversationToken = x.ConversationToken, DateSent = x.DateSent }, y => new { ConversationToken= y.ConversationToken,DateSent=y.Date }, (x, y) => new { y.SenderID, y.RecieverID, x.DateSent, y.ConversationToken })
                            .Where(x=>x.RecieverID==userID||x.SenderID==userID).OrderByDescending(x=>x.DateSent);
            
            return Json(queryy, JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveBookmark(int userID,int CompanyID)
        {
            tbl_bookmarks bookmark = new tbl_bookmarks();
            bookmark.CompanyID = CompanyID;
            bookmark.userID = userID;
            db.tbl_bookmarks.Add(bookmark);
            db.SaveChanges();
            return Json(bookmark, JsonRequestBehavior.AllowGet);
        }

        public ActionResult removeBookmark(int userID,int CompanyID)
        {
            var removeBook = db.tbl_bookmarks.Where(x => x.userID == userID && x.CompanyID == CompanyID).First();
            db.tbl_bookmarks.Remove(removeBook);
            db.SaveChanges();

            return Json("", JsonRequestBehavior.AllowGet);
        }
        public ActionResult removeBookmarkByID(int BookmarkID)
        {
            var removeBook = db.tbl_bookmarks.Where(x => x.BookmarkID == BookmarkID).Select(x => x).First();
            db.tbl_bookmarks.Remove(removeBook);
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public ActionResult checkBookmark(int userID, int CompanyID)
        {
            var Bookmarked = db.tbl_bookmarks.Where(x => x.userID == userID && x.CompanyID == CompanyID).Select(x => x).ToList();
            return Json(Bookmarked, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getBookmarks(int userID)
        {
            var Bookmarklist = db.tbl_bookmarks.Where(x => x.userID == userID).Select(x => x).ToList();
            return Json(Bookmarklist, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getFullBookmarks(int userID)
        {
            var custom = db.tbl_bookmarks.Where(x => x.userID == userID).Join(db.tbl_company, x => x.CompanyID, y => y.CompanyID, (x, y) => new { x, y })
                .Join(db.tbl_dispImg, a => a.y.CompanyID, b => b.CompanyID, (a, b) => new { a, b })
                .Join(db.tbl_services, c => c.a.y.ServiceType, d => d.ID, (c, d) => new { c, d })
                .Select(cnstrct => new
                {
                    BookmarkID = cnstrct.c.a.x.BookmarkID,
                    CompanyID = cnstrct.c.a.x.CompanyID,
                    CompanyName = cnstrct.c.a.y.CompanyName,
                    Province = cnstrct.c.a.y.Province,
                    City = cnstrct.c.a.y.City,
                    dispImg = cnstrct.c.b.FilePath,
                    EndPrice = cnstrct.c.a.y.EndPrice,
                    ServiceName = cnstrct.d.ServiceName
                }).OrderBy(x => x.ServiceName).ToList();

            return Json(custom, JsonRequestBehavior.AllowGet);
        }
            


        public ActionResult Logout()
        {
            Session["login"] = null;
            Session["Event"] = null;
            return RedirectToAction("../landingpage/index");
            
        }

    }
}