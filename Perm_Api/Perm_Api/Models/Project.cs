using System;

namespace Perm_Api.Models
{
    public class Project
    {
        public string ProjectId { get; set; }
        public string ClientName { get; set; }
        public string ProjectName { get; set; }

        public string ProjectURL { get; set; }

        public string Status { get; set; }
        public string ServiceOffering { get; set; }

        public string LevantLead { get; set; }
        public decimal? TotalRevenue { get; set; }
        public string Location { get; set; }
        public string Country { get; set; }
        public string ProjectStartDate { get; set; }
        public string ProjectEndDate { get; set; }
        public string CreatedDate { get; set; }
        public int? Capacity { get; set; }

    }
}