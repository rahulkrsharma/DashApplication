
using Perm_Api.Manager;
using Perm_Api.Models;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Linq;

namespace Perm_Api.Controllers
{
    [RoutePrefix("UserAuth")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserAuthController : ApiController
    {
        private readonly IUserAuthManager _userAuthManager;
        static bool isProd =Convert.ToBoolean(WebConfigurationManager.AppSettings["isProd"]);

        public UserAuthController()
        {

        }

        public UserAuthController(IUserAuthManager userAuthManager)
        {
            this._userAuthManager = userAuthManager;
        }

        [HttpPost]
        [Route("SignIn")]
        public HttpResponseMessage SignIn(Credentials credentials)
        {
            var response = _userAuthManager.SignIn(credentials);
            response.EmailId = credentials.email;
            if (response.code == 1)
            {
                response.message = "Signin successful ";
            }
            else if (response.code == 2)
            {
                response.message = "Email id is not registered ";
            }
            else if (response.code == 3)
            {
                response.message = "Password is not correct . Please enter the correct one ";
            }
            else if (response.code == 4)
            {
                (int returnCode, int verificationcode) = _userAuthManager.SendResetPasswordVerification(credentials.email);
                if(returnCode == 3)
                {
                    SendEmail(VerificationEmail(verificationcode, new UserDetails() { email = credentials.email }));
                    response.message = "Account is not active. We have sent a new activation email. Please activate";
                }
                else if (returnCode == 2)
                {
                    response.message = "Email " + credentials.email + "not found";
                }
                else if (returnCode == 0)
                {
                    response.message = "An internal error occured while generating verification code";
                }    
            }
            else if (response.code == 0)
            {
                response.message = "Error occured";
            }

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpPost]
        [Route("Register")]
        public HttpResponseMessage Register(UserDetails user)
        {
            bool activationRequired = false;
            var response = new RegisterResponse();
            (response.code,response.verificationCode) = _userAuthManager.Register(user);
            if (response.code == 1)
            {
                if (activationRequired)
                {
                    SendEmail(VerificationEmail(response.verificationCode, user));
                    response.message = "We have sent an email to activate your account ";
                }
                else
                {
                    response.message = "Registration is successful. You can login now ";
                }
            }
            else if (response.code == 2)
            {
                response.message = "User already registered ";
            }
            else if (response.code == 0)
            {
                response.message = "Error occured";
            }
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        private EmailContent VerificationEmail(int verificationcode,UserDetails user)
        {
            string link = string.Empty;
            if (isProd)
            {
               link = "http://dashpricing.s3-website-ap-northeast-1.amazonaws.com/user/status?emailId=" + user.email + "&verificationCode=" + verificationcode;
            }
            else
            {
                link = "http://localhost:4200/user/status?emailId=" + user.email + "&verificationCode=" + verificationcode;
            }
            string emailBody = "<p><a href="+link+">Activate Account</a></p>";
            return new EmailContent()
            {
                emailSubject = "Perm Registration verification",
                toEmail = user.email,
                confirmationMessage = "Registration Successful",
                emailBody = emailBody
            };
        }

        [HttpPost]
        [Route("ResetPassword")]
        public HttpResponseMessage ResetPassword(ResetPassword credentials)
        {
            string result = string.Empty;
            int code = _userAuthManager.ResetPassword(credentials);
            if (code == 1)
            {
                result = "Password updated successfully, you will be redirected to Login page!";
            }
            else if (code == 2)
            {
                result = "Email " + credentials.email + "not found";
            }
            else if (code == 3)
            {
                result = "Incorrect Verification code. Please retry";
            }
            else if (code == 4)
            {
                result = "Activated link is expired. Please retry";
            }
            else if (code == 0)
            {
                result = "Error occured";
            }
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpGet]
        [Route("HealthCheck")]
        public string HealthCheck()
        {
            return "Site is up and Running";
        }


            [HttpGet]
        [Route("ActivateAccount/{emailId}/{verificationCode}")]
        public string ActivateAccount(string emailId,string verificationCode)
        {
            //test
            int code = _userAuthManager.ActivateAccount(emailId, verificationCode);
            string result = string.Empty;
            if (code == 1)
            {
                result = "Account activated successfully. Please login to your account";
            }
            else if (code == 2)
            {
                result = "Email id not found";
            }
            else if (code == 3)
            {
                result = "Account is already activated";
            }
            else if (code == 4)
            {
                (int returnCode, int verificationcode) = _userAuthManager.SendResetPasswordVerification(emailId);
                if (returnCode == 1)
                {
                    SendEmail(VerificationEmail(verificationcode, new UserDetails() { email = emailId }));
                    result = "Activated link is expired. We have sent a new activation email. Please activate";
                }
                    if (returnCode == 2)
                {
                    result = "There is no account registered with this email id " + emailId;
                }
                if (returnCode == 3)
                {
                    SendEmail(VerificationEmail(verificationcode, new UserDetails() { email = emailId }));
                    result = "Account is not active. We have sent a new activation email. Please activate ";
                }
                else if (verificationcode == 0)
                {
                    result = "An internal error occured while generating verification code";
                }      
            }
            else if (code == 0)
            {
                result = "Error occured";
            }
            return result;
        }

        [HttpGet]
        [Route("SendResetPasswordVerification/{email}")]
        public (string,int) SendResetPasswordVerification(string email)
        {
            string result = string.Empty;
            (int code,int verificationcode) = _userAuthManager.SendResetPasswordVerification(email);
            if (code == 1)
            {
                SendEmail(ResetPasswordEmail(verificationcode, new UserDetails() { email = email }));
                result = "We have sent an email to reset your password ";
            }
            else if (code == 2)
            {
                result = "There is no account registered with this email id ";
            }
            else if (code == 3)
            {
                SendEmail(VerificationEmail(verificationcode, new UserDetails() { email = email }));
                result = "Account is still not active. We have sent a new activation email. Please activate";
                
            }
            else if (code == 0)
            {
                result = "An error accured ";
            }
            return (result,code);
        }

        [HttpGet]
        [Route("UsersList")]
        public HttpResponseMessage UsersList()
        {
            try
            {
                var usersList = _userAuthManager.UsersList().userDetails;
                return Request.CreateResponse(HttpStatusCode.OK, usersList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("UserInfo/{userId}")]
        public HttpResponseMessage UserInfo(int userId)
        {
            try
            {
                var usersList = _userAuthManager.UsersList();
                usersList.userDetails = usersList.userDetails.Where(x => x.UserId.Equals(userId)).ToList();
                //var userInfo = usersList.Where(x => x.UserId.Equals(userId)).FirstOrDefault();
                return Request.CreateResponse(HttpStatusCode.OK, usersList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("ManageUser")]
        public HttpResponseMessage ManageUser(UserDetails userDetails)
        {
            try
            {
                var userInfo = _userAuthManager.ManageUser(userDetails);
                //var usersList = _userAuthManager.UsersList();
                //if (userDetails.FromAdmin.ToLower().Equals("false"))
                //{
                //    usersList.userDetails = usersList.userDetails.Where(x => x.UserId.Equals(userDetails.UserId)).ToList();
                //    usersList.SelectedServiceTypes = usersList.SelectedServiceTypes.Where(x => x.UserId.Equals(userDetails.UserId)).ToList();
                //}
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }



        private EmailContent ResetPasswordEmail(int verificationcode, UserDetails user)
        {
            string link = "http://dashpricing.s3-website-ap-northeast-1.amazonaws.com/UserAuth/ActivateAccount/" + user.email + "/" + verificationcode;
            string emailBody = "<p>Reset Password verification code is " +verificationcode+ "</p>";
            return new EmailContent()
            {
                emailSubject = "Reset Password Verification",
                toEmail = user.email,
                confirmationMessage = "Reset Password email sent successfully",
                emailBody = emailBody
            };
        }

        private string SendEmail(EmailContent emailContent)
        {
            string FROM = "rahulsharmaitmgkp@gmail.com";
            string FROMNAME = "PERM";
            string TO = emailContent.toEmail;

            // Replace smtp_username with your Amazon SES SMTP user name.
            string SMTP_USERNAME = "AKIA2CWG37RHVU2MG65J";

            // Replace smtp_password with your Amazon SES SMTP user name.
            string SMTP_PASSWORD = "BC8H92Y3WfZmXv1iX3ZCLKtVuRM2ua9b3J/ZQm9WKqFY";

            // (Optional) the name of a configuration set to use for this message.
            // If you comment out this line, you also need to remove or comment out
            // the "X-SES-CONFIGURATION-SET" header below.
            string CONFIGSET = "ConfigSet";

            // If you're using Amazon SES in a region other than US West (Oregon), 
            // replace email-smtp.us-west-2.amazonaws.com with the Amazon SES SMTP  
            // endpoint in the appropriate AWS Region.
            string HOST = "email-smtp.ap-northeast-1.amazonaws.com";

            // The port you will connect to on the Amazon SES SMTP endpoint. We
            // are choosing port 587 because we will use STARTTLS to encrypt
            // the connection.
            int PORT = 587;

            // The subject line of the email
            string SUBJECT =emailContent.emailSubject;

            // The body of the email
            string BODY = emailContent.emailBody;
            //string BODY =
            //    "<p>Hi," + toEmail + "<br><br>" +
            //    "You are receiving this email because you have requested a password  " + "<br><br>" +
            //    "Please enter the Verification code ";



            // Create and build a new MailMessage object
            MailMessage message = new MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress(FROM, FROMNAME);
            message.To.Add(new MailAddress(TO));
            message.Subject = SUBJECT;
            message.Body = BODY;
            // Comment or delete the next line if you are not using a configuration set
            //message.Headers.Add("X-SES-CONFIGURATION-SET", CONFIGSET);

            using (var client = new SmtpClient(HOST, PORT))
            {
                // Pass SMTP credentials
                client.Credentials =
                    new NetworkCredential(SMTP_USERNAME, SMTP_PASSWORD);

                // Enable SSL encryption
                client.EnableSsl = true;

                // Try to send the message. Show status in console.
                try
                {
                    client.Send(message);
                    return emailContent.confirmationMessage;
                }
                catch (Exception ex)
                {
                    return "An error occured" + ex.Message.ToString();
                }

            }
        }
    }
}
