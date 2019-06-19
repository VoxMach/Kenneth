using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone.Models.CustomModel
{
    public partial class CompanyInfo
    {
        public int CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string Sypnosis { get; set; }
        public string Province { get; set; }
        public string City { get; set; }
        public Nullable<int> ServiceType { get; set; }
        public string ContactNo { get; set; }
        public Nullable<int> StartPrice { get; set; }
        public Nullable<int> EndPrice { get; set; }
        public Nullable<int> userID { get; set; }

        public Nullable<int> RateTotal { get; set; }
        public Nullable<int> RateCounter { get; set; }

        public string FilePath { get; set; }

        public string ServiceName { get; set; }

        public string PageID { get; set; }
    }
}