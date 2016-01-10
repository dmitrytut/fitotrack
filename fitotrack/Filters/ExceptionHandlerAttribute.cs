using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Runtime.InteropServices;

namespace fitotrack.Filters
{
    public class ExceptionHandlerAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            Logger dbLogger = LogManager.GetLogger("FTExceptionLogger");
            LogEventInfo theEvent = new LogEventInfo(LogLevel.Error, "", context.Exception.Message);
            theEvent.Exception = context.Exception;
            dbLogger.Log(theEvent);
						var httpEx = new HttpException(null, context.Exception);
            //context.Response = context.Request.CreateResponse(httpEx.GetHttpCode());
						if (context.Exception is AccessViolationException)
						{
							context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden);
						}
						else if (context.Exception is UnauthorizedAccessException)
						{
							context.Response = context.Request.CreateResponse(HttpStatusCode.Unauthorized);
						}
						else if (context.Exception is Exception
								|| context.Exception is SEHException)
						{
							context.Response = context.Request.CreateResponse(HttpStatusCode.InternalServerError);
						}
            base.OnException(context);
        }
    }
}