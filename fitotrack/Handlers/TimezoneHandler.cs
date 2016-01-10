using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace fitotrack.Handlers
{
    /// <summary>
    /// Класс обработки запросов для определения смещения временной зоны пользователя из Cookies.
    /// </summary>
    public class TimezoneHandler : DelegatingHandler
    {
        static public string TimezoneToken = "tz";

        async protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Изначально, смещение относительно UTC нулевое
            int timezoneOffset = 0;

            // Получаем значение временной зоны из cookies
            var cookie = request.Headers.GetCookies(TimezoneToken).FirstOrDefault();
            if (cookie != null)
            {
                try
                {
                    timezoneOffset = Int32.Parse(cookie[TimezoneToken].Value);
                }
                catch (FormatException)
                {
                    // Ошибка в формате временного смещения - выставляем в нулевое
                    timezoneOffset = 0;
                }
            }

            // Сохраняем временное смещение в свойствах HTTP-запроса
            request.Properties[TimezoneToken] = timezoneOffset;

            // Продолжаем выполнение HTTP-запроса
            HttpResponseMessage response = await base.SendAsync(request, cancellationToken);

            return response;
        }
    }
}