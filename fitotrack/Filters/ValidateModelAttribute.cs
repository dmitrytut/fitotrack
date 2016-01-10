
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Linq;
using System;
using System.Collections.Concurrent;

namespace fitotrack.Filters
{
  /// <summary>
  /// Класс валидации пришедшей модели. 
  /// </summary>
  //public class ValidateModelAttribute : ActionFilterAttribute
  //{
  //  /// <summary>
  //  /// Метод срабатывающий как только действие начало выполняться.
  //  /// </summary>
  //  /// <param name="actionContext">Текущий контекст, в котором выполняется действие.</param>
  //  public override void OnActionExecuting(HttpActionContext actionContext)
  //  {
  //    //Если ModelState не правильный, то возвращаем клиенту ошибку.
  //    if (actionContext.ModelState.IsValid == false)
  //    {
  //      //actionContext.Response = actionContext.Request.CreateErrorResponse(
  //      //    HttpStatusCode.BadRequest, actionContext.ModelState);

  //      var errors = new List<KeyValuePair<string, string>>();
  //      foreach (var key in (actionContext.ModelState.Keys).Where(key =>
  //          actionContext.ModelState[key].Errors.Any()))
  //      {
  //        errors.AddRange(actionContext.ModelState[key].Errors
  //              .Select(er => new KeyValuePair<string, string>(key, er.ErrorMessage)));
  //      }
  //      actionContext.Response = actionContext.Request.CreateResponse(
  //          HttpStatusCode.BadRequest, errors);
  //    }
  //  }
  //}

  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
  public sealed class ValidateModelAttribute : ActionFilterAttribute
  {
      private static readonly ConcurrentDictionary<HttpActionDescriptor, IList<string>> NotNullParameterNames =
          new ConcurrentDictionary<HttpActionDescriptor, IList<string>>();


      /// <summary>
      /// Occurs before the action method is invoked.
      /// </summary>
      /// <param name="actionContext">The action context.</param>
      public override void OnActionExecuting(HttpActionContext actionContext)
      {
          var not_null_parameter_names = GetNotNullParameterNames(actionContext);
          foreach (var not_null_parameter_name in not_null_parameter_names)
          {
              object value;
              if (!actionContext.ActionArguments.TryGetValue(not_null_parameter_name, out value) || value == null)
                  actionContext.ModelState.AddModelError(not_null_parameter_name, "Parameter \"" + not_null_parameter_name + "\" was not specified.");
          }


          if (actionContext.ModelState.IsValid == false)
              actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
      }


      private static IList<string> GetNotNullParameterNames(HttpActionContext actionContext)
      {
          var result = NotNullParameterNames.GetOrAdd(actionContext.ActionDescriptor,
                                                       descriptor => descriptor.GetParameters()
                                                                               .Where(p => !p.IsOptional && p.DefaultValue == null &&
                                                                                            !p.ParameterType.IsValueType &&
                                                                                            p.ParameterType != typeof(string))
                                                                               .Select(p => p.ParameterName)
                                                                               .ToList());

          return result;
      }
  }
}