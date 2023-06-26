using Perm_Api.Initializer;
using System.Web.Http.Dependencies;
using Unity;
using Unity.Lifetime;
using Unity.WebApi;

namespace Perm_Api.App_Start
{
    public class Bootstrapper
    {
        public static IDependencyResolver ConfigureDependencies()
        {
            var container = new UnityContainer();
            var resolver = new UnityDependencyResolver(container);

            container.RegisterFactory<IDependencyResolver>(c => resolver, new ContainerControlledLifetimeManager());
            ServiceInitializer.Initialize(container);
            return resolver;


        }
    }
}