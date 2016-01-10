using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace fitotrack.Attributes
{
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
  public class CustomAuthorizeAttribute : AuthorizeAttribute
  {
    protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
    {
      if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
      {
        //base.HandleUnauthorizedRequest();
      }
      else
      {
        filterContext.Result = new RedirectToRouteResult(new
        RouteValueDictionary(new { controller = "Landing", action = "Index" }));
      }
    }
  }
}