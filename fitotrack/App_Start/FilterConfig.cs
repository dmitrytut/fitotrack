using System.Web;
using System.Web.Mvc;

namespace fitotrack
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            // Set Authorize attribute globally (MVC).
            filters.Add(new System.Web.Mvc.AuthorizeAttribute());
            // Set RequireHttps attribute globally (MVC).
            //filters.Add(new RequireHttpsAttribute());
        }
    }
}