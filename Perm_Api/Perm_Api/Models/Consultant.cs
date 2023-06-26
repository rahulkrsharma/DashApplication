using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Perm_Api.Models
{
    public class Consultant
    { 

        public int? ConsultantId { get; set; }

        public string UserName { get; set; }

        public string UserEmail { get; set; }

        public decimal? ConsultantWorkdays { get; set; }

        public string Activity { get; set; }

        public string ProjectName { get; set; }

        public string ProjectStartDate { get; set; }

        public string ProjectEndDate { get; set; }

        public int? Capacity { get; set; }

      
    }
}