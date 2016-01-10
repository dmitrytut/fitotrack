using System.Web.Http;
using Newtonsoft.Json.Serialization;
using fitotrack.Handlers;
using fitotrack.Filters;


namespace fitotrack
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            //config.SuppressDefaultHostAuthentication();
            //config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Set Authorize attribute globally (WebApi).
            config.Filters.Add(new System.Web.Http.AuthorizeAttribute());
            // Set RequireHttps attribute globally (WebApi).
            //config.Filters.Add(new fitotrack.Filters.RequireHttpsAttribute());

            //Удаляем xml-форматтер, будаем использовать только JSON
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            var json = config.Formatters.JsonFormatter;
            //Настройка времени в UTC формат
            json.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
            //Настройка представления данных в формате CamelCase
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            ((DefaultContractResolver)json.SerializerSettings.ContractResolver).IgnoreSerializableAttribute = true;
            json.SerializerSettings.PreserveReferencesHandling =
                Newtonsoft.Json.PreserveReferencesHandling.Objects;

            //
            // Регистрируем MessageHandler'ы.
            config.MessageHandlers.Add(new TimezoneHandler());

            //
            // Настройка валидации модели при запросах.
            config.Filters.Add(new ValidateModelAttribute());

            //
            // Маршрутизация по атрибутам.
            config.MapHttpAttributeRoutes();

            //
            // Регистрируем маршруты

            //config.Routes.MapHttpRoute(
            //  name: "DefaultApiWithId", 
            //  routeTemplate: "api/{controller}/{id}", 
            //  defaults: new { id = RouteParameter.Optional }, 
            //  constraints: new { id = @"\d+" }
            //  );
        }
    }
}