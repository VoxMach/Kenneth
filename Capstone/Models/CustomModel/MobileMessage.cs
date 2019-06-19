using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone.Models.CustomModel
{
    public partial class MobileMessage
    {
        public int MsgID { get; set; }
        public string Msg { get; set; }
        public DateTime Date { get; set; }
        public Nullable<int> SenderID { get; set; }
        public Nullable<int> RecieverID { get; set; }
        public string ConversationToken { get; set; }
        public string MessageStatus { get; set; }
        public Nullable<int> isMobile { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string profpath { get; set; }
    }
}