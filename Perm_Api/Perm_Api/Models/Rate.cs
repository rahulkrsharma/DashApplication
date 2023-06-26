using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Perm_Api.Models
{
    public class Rate
    {
        public int? LevelId { get; set; }
        public string Level { get; set; }

        public decimal? RackRate { get; set; }
        public decimal? CostRate { get; set; }
    }
}