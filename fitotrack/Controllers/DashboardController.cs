using System.Web;
using System.Web.Http;
using fitotrack.Repository.Services;
using Microsoft.AspNet.Identity;
using System.Net.Http;


namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер дэшбобрда.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/dashboard")]
    [Filters.ExceptionHandler]
    public class DashboardController : ApiController
    {
        #region __Поля__
        /// <summary>
        /// Поле для доступа к репозиторию.
        /// </summary>
        private UnitOfWork unitOfWork = new UnitOfWork();
        /// <summary>
        /// Идентификатор текущего пользователя.
        /// </summary>
        private int currentUserId = HttpContext.Current.User.Identity.GetUserId<int>();
        #endregion

        #region __Методы__

        ////
        //// GET api/dashboard/initdata
        ///// <summary>
        ///// Метод получения начальных данных для дэшборда из БД.
        ///// </summary>
        ///// <returns>Инициализационные данные для дэшборда в формате DashboardInitDataDTO.</returns>
        //[HttpGet]
        //[Route("initdata")]
        //public HttpResponseMessage GetInitData()
        //{
        //}
        #endregion
    }
}