using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using fitotrack.Filters;

namespace fitotrack.Controllers
{
	/// <summary>
	/// Контроллер шаблонов.
	/// </summary>
	[Authorize]
		//[ErrorHandler]
	public class TplController : Controller
	{
		//
		// GET: /Tpl/Partial
		/// <summary>
		/// Возвращает определенный шаблон.
		/// </summary>
		/// <param name="name">Путь до шаблона, который нужно вернуть. Без расшерения и относительно папки Views.</param>
		/// <returns></returns>
		public PartialViewResult Partial(string name)
		{
			return PartialView(name);
		}
	}
}
