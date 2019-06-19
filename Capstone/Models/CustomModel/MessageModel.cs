using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone.Models.CustomModel
{
    public partial class MessageModel
    {

        public int SenderID { get; set; }
        public int RecieverID { get; set; }
        public string ConversationToken { get; set; }
        public DateTime date { get; set; }
    }
}