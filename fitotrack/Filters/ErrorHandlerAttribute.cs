using System;
using System.Net;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Mvc;
using NLog;
using Microsoft.AspNet;
using Microsoft.AspNet.Identity;

namespace fitotrack.Filters
{
	public class ErrorHandlerAttribute : HandleErrorAttribute
	{
		public override void OnException(ExceptionContext context)
		{
			Logger dbLogger = LogManager.GetLogger("FTExceptionLogger");
			LogEventInfo theEvent = new LogEventInfo(LogLevel.Error, "", context.Exception.Message);
			theEvent.Exception = context.Exception;
			dbLogger.Log(theEvent);
			base.OnException(context);
		}
	}
}