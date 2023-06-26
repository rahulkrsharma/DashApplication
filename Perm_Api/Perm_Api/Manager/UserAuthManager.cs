using Perm_Api.Data;
using Perm_Api.Models;
using System;
using System.Collections.Generic;

namespace Perm_Api.Manager
{
    public class UserAuthManager : IUserAuthManager
    {
        private readonly IUserAuthRepository userAuthRepository;

        public UserAuthManager(IUserAuthRepository userAuthRepository)
        {
            this.userAuthRepository = userAuthRepository;
        }

        public int ActivateAccount(string emailId, string verificationCode)
        {
            return userAuthRepository.ActivateAccount(emailId, verificationCode);
        }

        public string ManageUser(UserDetails userDetails)
        {
            return userAuthRepository.ManageUser(userDetails);
        }

        public (int,int) Register(UserDetails user)
        {
            return userAuthRepository.Register(user);
        }

        public int ResetPassword(ResetPassword credentials)
        {
            return userAuthRepository.ResetPassword(credentials);
        }

        public (int,int) SendResetPasswordVerification(string email)
        {
            return userAuthRepository.SendResetPasswordVerification(email);
        }

        public SignInResponse SignIn(Credentials credentials)
        {
            return userAuthRepository.SignIn(credentials);
        }

        public UsersInfo UsersList()
        {
            return userAuthRepository.UsersList();
        }
    }
}