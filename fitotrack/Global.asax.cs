using System.Web.Http;
using System.Web.Optimization;
using System.Web.Routing;
using fitotrack.Models;
using System.Web.Mvc;
using fitotrack.Converters;
using System;
using System.Web;
using System.Diagnostics;
using NLog;

namespace fitotrack
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Конвертер разделителя Decimal значений "," на ".".
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new DecimalFormatConverter());

            // Инициализируем AutoMapper.
            ModelMapper.Create();
        }
    }
}