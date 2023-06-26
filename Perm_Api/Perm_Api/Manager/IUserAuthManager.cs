using Perm_Api.Models;
using System.Collections.Generic;

namespace Perm_Api.Manager
{
    public interface IUserAuthManager
    {
        SignInResponse SignIn(Credentials credentials);

        (int, int) Register(UserDetails user);

        int ResetPassword(ResetPassword credentials);

        (int,int) SendResetPasswordVerification(string email);
        int ActivateAccount(string emailId, string verificationCode);
        UsersInfo UsersList();
        string ManageUser(UserDetails userDetails);
    }
}
