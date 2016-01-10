using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fitotrack.Filters;

namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер основной страницы.
    /// </summary>
    [Authorize]
		//[ErrorHandler]
    public class ftController : Controller
    {
        //
        // GET: /ft/

        public ActionResult Index()
        {
            return View();
        }

    }
}
