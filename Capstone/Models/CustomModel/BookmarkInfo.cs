using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone.Models.CustomModel
{
    public partial class BookmarkInfo
    {
        public int BookmarkID { get; set; }
        public string City { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string Province { get; set; }
        public Nullable<int> RateTotal { get; set; }
        public Nullable<int> RateCounter { get; set; }
        public string ServiceName { get; set; }
        public Nullable<int> userID { get; set; }
        public string FilePath { get; set; }


    }
}