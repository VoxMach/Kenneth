//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Capstone.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_messages
    {
        public int MsgID { get; set; }
        public string Msg { get; set; }
        public Nullable<System.DateTime> Date { get; set; }
        public Nullable<int> SenderID { get; set; }
        public Nullable<int> RecieverID { get; set; }
        public string ConversationToken { get; set; }
        public string MessageStatus { get; set; }
        public Nullable<int> isMobile { get; set; }
    }
}
