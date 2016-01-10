using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fitotrack.Filters;

namespace fitotrack.Controllers
{
	/// <summary>
	/// MVC контроллер страницы лэндинга.
	/// </summary>
		//[ErrorHandler]
	public class LandingController : Controller
	{
		//
		// GET: /Landing/
		public ActionResult Index()
		{
			if (!User.Identity.IsAuthenticated)
		  {
			//Not authenticated
			//Пока переправляем на логин
			return RedirectToAction("Login", "Account");
			
			//Когда будет LandingPage - отображаем его
			//return View();
		  }
		  else
		  {
			//Authenticated
			return RedirectToAction("Index", "ft");
		  }
		}

	}
}
