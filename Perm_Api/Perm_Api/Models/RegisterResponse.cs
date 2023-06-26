namespace Perm_Api.Models
{
    public class RegisterResponse
    {
        public int code { get; set; }
        public string message { get; set; }
        public int verificationCode { get; set; }
    }
}