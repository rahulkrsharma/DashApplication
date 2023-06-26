using Perm_Api.Data;
using Perm_Api.Manager;
using Unity;

namespace Perm_Api.Initializer
{
    public static class ServiceUnityInitializer
    {
        public static void RegisterDependencies(IUnityContainer container)
        {
            container.RegisterType<IUserAuthManager, UserAuthManager>();
            container.RegisterType<IUserAuthRepository, UserAuthRepository>();
            container.RegisterType<IProjectPricingManager, ProjectPricingManager>();
            container.RegisterType<IProjectPricingRepository, ProjectPricingRepository>();
        }
    }
}