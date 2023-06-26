using Unity;

namespace Perm_Api.Initializer
{
    public static class ServiceInitializer
    {
        public static void Initialize(IUnityContainer container)
        {
            ServiceUnityInitializer.RegisterDependencies(container);
        }
    }
}