using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace fitotrack
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Route for fitotrack angular app can catch all routes (for html5Mode). 
            routes.MapRoute(
                name: "AngularCatchAllRoute",
                url: "ft/{*.}",
                defaults: new { controller = "ft", action = "Index", id = UrlParameter.Optional }
              );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Landing", action = "Index", id = UrlParameter.Optional }
            );

            routes.AppendTrailingSlash = true;
        }
    }
}