using System.Collections.Generic;

namespace Perm_Api.Models
{

    public class UsersInfo
    {
        public List<UserDetails> userDetails;

        public List<ServiceTypeResponse> SelectedServiceTypes;
    }
    public class UserDetails
    {
        public string country { get; set; }
        public int? UserId { get; set; }
        public string email { get; set; }

        public string password { get; set; }

        public string UserRegDate { get; set; }

        public string Level { get; set; }

        public string IsAdmin { get; set; }

        public string IsActivated { get; set; }

        public string displayName { get; set; }

        public string Location { get; set; }

        public int verificationCode { get; set; }

        public decimal? RackRate { get; set; }

        public decimal? CostRate { get; set; }

        public string ToDelete { get; set; }

        public string FromAdmin { get; set; }

        public string MobileNo { get; set; }

        public int? WorkSchedule { get; set; }

        public string BiodataType { get; set; }

        public string BiodataContent { get; set; }

        public string ProfileImage { get; set; }


    }
}