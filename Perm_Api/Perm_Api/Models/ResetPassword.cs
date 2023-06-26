namespace Perm_Api.Models
{
    public class ResetPassword
    {
        public string email { get; set; }

        public int code { get; set; }

        public string newPassword { get; set; }
    }
}