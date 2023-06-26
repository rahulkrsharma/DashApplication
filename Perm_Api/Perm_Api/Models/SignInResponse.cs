namespace Perm_Api.Models
{
    public class SignInResponse
    {
        public int code { get; set; }
        public string message { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string EmailId { get; set; }
        public string Level { get; set; }
        public string IsAdmin { get; set; }
    }
}