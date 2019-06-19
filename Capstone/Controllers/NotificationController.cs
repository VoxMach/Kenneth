using Capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Capstone.Controllers
{
    public class NotificationController : Controller
    {
        EventAideEntities db = new EventAideEntities();
        // GET: Notification
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult saveNotif(tbl_notification notif)
        {
            notif.notifDate = DateTime.Now;
            notif.seen = 0;
            db.tbl_notification.Add(notif);
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }


        public ActionResult getNotif(int userID)
        {
            var notifs=db.tbl_notification.Where(x => x.userID==userID).Select(x => x).OrderByDescending(x=>x.notifDate).Take(8).ToList();
            return Json(notifs, JsonRequestBehavior.AllowGet);
            
        }

        public ActionResult seenCount(int userID)
        {
            var seencount = db.tbl_notification.Where(x => x.userID == userID && x.seen == 1).Count();
            return Json(seencount, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getMessagesCount(int userID)
        {
            var unseen = db.tbl_messages.Where(x => x.MessageStatus == "unseen" && x.RecieverID == userID).Select(x => x).Count();
            return Json(unseen, JsonRequestBehavior.AllowGet);
        }

        public ActionResult updateNotif(int userID)
        {
            var notifs =db.tbl_notification.Where(x => x.userID == userID && x.seen == 0).ToList();

            notifs.ForEach(x => x.seen = 1);
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);

        }
    }
}