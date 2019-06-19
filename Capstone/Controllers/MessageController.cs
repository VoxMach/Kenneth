using Capstone.Models;
using Capstone.Models.CustomModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Capstone.Controllers
{
    public class MessageController : Controller
    {
        EventAideEntities db = new EventAideEntities();
        // GET: Message
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ChatView()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }

        public ActionResult ChatViewPartial()
        {
            return View();
        }

        public ActionResult getMsg(int ID)
        {
            string query = "SELECT SenderID, RecieverID, t.Conversationtoken,[date] FROM (" +
                            "SELECT Conversationtoken, MAX([date]) as Maxdate " +
                            "FROM EventAide.dbo.tbl_messages " +
                            "GROUP BY Conversationtoken) r " +
                            "INNER JOIN EventAide.dbo.tbl_messages t " +
                            "ON t.Conversationtoken = r.Conversationtoken AND t.date = r.Maxdate " +
                            "where SenderID='"+ID+"' or RecieverID='"+ID+"'" +
                            "order by date desc";

            var contact = db.Database.SqlQuery<MessageModel>(query).ToList();
            return Json(contact, JsonRequestBehavior.AllowGet);

        }

        public ActionResult deleteMsg(string conversationToken)
        {
            string query = "Delete tbl_messages where ConversationToken ='" + conversationToken + "'";
            db.Database.ExecuteSqlCommand(query);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveMessages(tbl_messages msg)
        {
            if (msg.SenderID < msg.RecieverID)
            {
                msg.ConversationToken = msg.SenderID + "-" + msg.RecieverID;
            }
            else if (msg.SenderID > msg.RecieverID)
            {
                msg.ConversationToken = msg.RecieverID + "-" + msg.SenderID;
            }
            msg.MessageStatus = "unseen";
            msg.Date = DateTime.Now;
            db.tbl_messages.Add(msg);
            db.SaveChanges();
            var DateRet = new { status = "Success", date = msg.Date };
            return Json(DateRet, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getMessages(string ConvoToken)
        {
            var q = db.tbl_messages.Where(x => x.ConversationToken==ConvoToken).Select(x=>x).OrderByDescending(x=>x.Date).Take(50).ToList();
            return Json(q, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getLastMsg(string ConvToken,int RecieverID)
        {
            var lastmsg = db.tbl_messages.Where(x => x.ConversationToken == ConvToken && x.RecieverID==RecieverID).Select(x => x).OrderByDescending(x=>x.Date).First();

            return Json(lastmsg, JsonRequestBehavior.AllowGet);
        }

        public ActionResult messageSeen(string ConvToken)
        {

            var msg = db.tbl_messages.Where(x => x.ConversationToken == ConvToken).ToList();
            msg.ForEach(x => { x.MessageStatus = "seen"; x.isMobile = 0; });
          

            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }


        public ActionResult getMessagesMobile(string convToken)
        {
            string query = "select tbl_messages.*,tbl_user.firstname,tbl_user.lastname,tbl_user.profpath from tbl_messages " +
                         "inner join tbl_user on tbl_messages.SenderID=tbl_user.userID " +
                         "where ConversationToken='"+convToken+"' and isMobile=1  ";
            var comp = db.Database.SqlQuery<MobileMessage>(query).ToList();
            var msg = db.tbl_messages.Where(x => x.ConversationToken == convToken && x.MessageStatus=="unseen" && x.isMobile == 1  ).Select(x=>x);
            return Json(comp, JsonRequestBehavior.AllowGet);
        }

        public ActionResult setSeen(int msgid)
        {
            
            tbl_messages msg = db.tbl_messages.Where(x => x.MsgID == msgid).First();
            msg.isMobile = 0;
            db.SaveChanges();
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
    }
}