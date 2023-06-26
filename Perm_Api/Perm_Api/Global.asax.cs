using Perm_Api.App_Start;
using System.Web.Http;
using System.Web.Http.Dependencies;
using System.Web.Optimization;
using System.Web.Routing;

namespace Perm_Api
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            IDependencyResolver resolver = Bootstrapper.ConfigureDependencies();
            GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }
    }
}
