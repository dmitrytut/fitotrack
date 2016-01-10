using fitotrack.Handlers;
using System.Net.Http;

namespace fitotrack.Helpers
{
    /// <summary>
    /// Класс утилит для работы с HTTP-запросами.
    /// </summary>
    public class RequestHelper
    {
        #region __Статические методы__
        /// <summary>
        /// Метод извлечения временного смещения из cookies.
        /// </summary>
        /// <returns>Временное смещение в минутах.</returns>
        public static int GetTimezoneOffset(HttpRequestMessage Request)
        {
            int timezoneOffset = 0;
            // Достаем временное смещение в минутах из cookies
            int? tzOffset = Request.Properties[TimezoneHandler.TimezoneToken] as int?;
            if (tzOffset.HasValue)
            {
                timezoneOffset = tzOffset.Value;
            }
            return timezoneOffset;
        }
        #endregion
    }
}