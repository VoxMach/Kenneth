using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Capstone.Models;
using System.Threading.Tasks;

namespace Capstone
{
    public class ChatHub : Hub
    {
        EventAideEntities db = new EventAideEntities();
        public void sendMessage(string Message)
        {
            
            Clients.All.SendMessage(Message);
                
        }

        //public void callEx(string fullname, string msg, string profpath, int sender, DateTime date, string receiver)
        //{
        //    Clients.Caller.fire( fullname,  msg,  profpath,  sender,  date);
        //    Clients.Client(receiver).fire( fullname,  msg,  profpath,  sender,  date);
            
        //}

        

        public void saveConID()
        {
            string connectionId = Context.ConnectionId;
            Clients.Client(connectionId).saveConnection(connectionId);
        }

        public void sendPM(string fullname,string msg,string profpath,int sender,DateTime date,string receiver,string ConvoToken)
        {

            Clients.Client(receiver).sendPM(fullname, msg, profpath, sender, date, receiver, ConvoToken);
            Clients.Caller.sendPM(fullname, msg, profpath, sender, date, receiver, ConvoToken);
            
        }

        public void notifyPM(string receiver)
        {
            Clients.Client(receiver).notifyPM();
        }

        public void notifyRate(string receiver)
        {
            Clients.Client(receiver).notifyRate();
        }

        public void notifyBook(string receiver)
        {
            Clients.Client(receiver).notifyBook();
        }
        public void notifyBookCancel(string receiver)
        {
            Clients.Client(receiver).notifyBookCancel();
        }

        public void notifyAcceptReq(string receiver,string companyname)
        {
            Clients.Client(receiver).notifyAcceptReq(companyname);
        }
        public void notifyDeclineReq(string receiver, string companyname)
        {
            Clients.Client(receiver).notifyDeclineReq(companyname);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            
            return base.OnDisconnected(stopCalled);
        }
    }
}