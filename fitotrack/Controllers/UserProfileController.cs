using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using fitotrack.Repository.Services;
using fitotrack.Entity.Models;
using fitotrack.Helpers;
using fitotrack.Models.Profile.DTO;
using fitotrack.Entity.Enums;
using System.Threading.Tasks;
using System.IO;
using System.Drawing;
using fitotrack.Providers;
using fitotrack.Extensions;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using fitotrack.Repository.Auth;
using fitotrack.Models.Profile.Types;
using System.Data.Entity;


namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер профиля пользователя.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/profile")]
    [Filters.ExceptionHandler]
    public class UserProfileController : ApiController
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
        private AccountRepository _accountRepo = null;
        #endregion

        #region __Свойства__
        public AccountRepository AccountRepo
        {
            get
            {
                return _accountRepo ?? new AccountRepository(
                    HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>(),
                    HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>());
            }
            private set
            {
                _accountRepo = value;
            }
        }
        #endregion

        #region __CRUD__
        //
        // GET api/profile
        /// <summary>
        /// Метод получения всей информации о пользователе.
        /// </summary>
        /// <returns>Вся информация о пользователе в формате объекта UserProfileDTO.</returns>
        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> Get()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null,
              i => i.Weights,
              n => n.Notifications,
              g => g.Goals)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var userProfileDTO = Mapper.Map<UserProfileDTO>(userProfile);

            // Получаем Email из AccountRepository.
            var user = await AccountRepo.FindUserById(currentUserId);
            userProfileDTO.Credentials.Email = user.Email;

            // Выбираем последнее взвешивание.
            if (userProfile.Weights.Any())
            {
                userProfileDTO.PhysicalInfo.Weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
            }
            else
            {
                userProfileDTO.PhysicalInfo.Weight = null;
            }
            // Выбираем последнюю цель по дате создания.
            if (userProfile.Goals.Any())
            {
                // Последняя цель с датой окончания нулевой или большей чем сегодня.
                var lastGoal = userProfile.Goals.Where(s=>(!s.EndTime.HasValue || (s.EndTime.Value > DateTime.UtcNow))).OrderByDescending(d => d.CreationTime).First();
                userProfileDTO.Goal = Mapper.Map<GoalDTO>(lastGoal);
            }

            return Request.CreateResponse<UserProfileDTO>(HttpStatusCode.OK, userProfileDTO);
        }

        // PUT api/profile
        /// <summary>
        /// Метод обновления информации пользователя.
        /// </summary>
        /// <param name="userProfileDTO">Переданный объект с информацией для обновления информации о пользователе.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpPut]
        [Route("")]
        public HttpResponseMessage Put([FromBody]UserProfileDTO userProfileDTO)
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);
        }

        // DELETE api/profile
        /// <summary>
        /// Метод удаления пользователя из БД.
        /// </summary>
        /// <returns>Статус выполнения операции.</returns>
        [HttpDelete]
        [Route("")]
        public HttpResponseMessage Delete()
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);
        }
        #endregion 

        #region __UserProfile Parts__
        #region __Get__
        //
        // GET api/profile/general
        /// <summary>
        /// Метод получения основной информации о пользователе.
        /// </summary>
        /// <returns>Основная информация о пользователе в формате объекта GeneralDTO.</returns>
        [HttpGet]
        [Route("general")]
        public async Task<HttpResponseMessage> GetGeneral()
        {
            var generalDTO = GetUserProfilePart<GeneralDTO>();
            // Получаем Username из AccountRepository.
            var user = await AccountRepo.FindUserById(currentUserId);
            generalDTO.UserName = user.UserName;

            return Request.CreateResponse<GeneralDTO>(HttpStatusCode.OK, generalDTO);
        }

        //
        // GET api/profile/physicalinfo
        /// <summary>
        /// Метод получения физической информации пользователя.
        /// </summary>
        /// <returns>Физическая информация пользователя в формате объекта PhysicalInfoDTO.</returns>
        [HttpGet]
        [Route("physicalinfo")]
        public HttpResponseMessage GetPhysicalInfo()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null,
              i => i.Weights)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var physicalInfoDTO = Mapper.Map<PhysicalInfoDTO>(userProfile);
            if (userProfile.Weights.Any())
            {
                physicalInfoDTO.Weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
            }
            else
            {
                physicalInfoDTO.Weight = null;
            }

            return Request.CreateResponse<PhysicalInfoDTO>(HttpStatusCode.OK, physicalInfoDTO);
        }

        //
        // GET api/profile/credentials
        /// <summary>
        /// Метод получения информации о удостоверении личности пользователя.
        /// </summary>
        /// <returns>Информации о удостоверении личности в формате объекта CredentialsDTO.</returns>
        [HttpGet]
        [Route("credentials")]
        public HttpResponseMessage GetCredentials()
        {
            var credentialsDTO = GetUserProfilePart<CredentialsDTO>();

            return Request.CreateResponse<CredentialsDTO>(HttpStatusCode.OK, credentialsDTO);
        }

        //
        // GET api/profile/notifications
        /// <summary>
        /// Метод получения информации об уведомлениях пользователя.
        /// </summary>
        /// <returns>Информации об уведомлениях пользователя в формате объекта NotificationsDTO.</returns>
        [HttpGet]
        [Route("notifications")]
        public HttpResponseMessage GetNotifications()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null,
              i => i.Notifications)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var notificationsDTO = Mapper.Map<NotificationsDTO>(userProfile);

            return Request.CreateResponse<NotificationsDTO>(HttpStatusCode.OK, notificationsDTO);
        }

        //
        // GET api/profile/privacy
        /// <summary>
        /// Метод получения информации о приватности пользователя.
        /// </summary>
        /// <returns>Информации о приватности пользователя в формате объекта PrivacyDTO.</returns>
        [HttpGet]
        [Route("privacy")]
        public HttpResponseMessage GetPrivacy()
        {
            var privacyDTO = GetUserProfilePart<PrivacyDTO>();

            return Request.CreateResponse<PrivacyDTO>(HttpStatusCode.OK, privacyDTO);
        }

        //
        // GET api/profile/status
        /// <summary>
        /// Метод получения статуса пользователя.
        /// </summary>
        /// <returns>Статус пользователя типа String.</returns>
        [HttpGet]
        [Route("status")]
        public HttpResponseMessage GetStatus()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return Request.CreateResponse<string>(HttpStatusCode.OK, userProfile.Status);
        }
        #endregion

        #region __Update__
        //
        // PUT api/profile/general
        /// <summary>
        /// Метод обновления основной информации о пользователе.
        /// </summary>
        /// <returns>Обновленная основная информация о пользователе в формате объекта GeneralDTO.</returns>
        [HttpPut]
        [Route("general")]
        public async Task<HttpResponseMessage> UpdateGeneral([FromBody]GeneralDTO generalDTO)
        {
            try
            {
                // Выбираем профиль из БД для обновления
                var userProfile = unitOfWork.UserProfileRepository.Get(
                  f => f.UserId == currentUserId,
                  null)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                var general = Mapper.Map<UserProfile>(generalDTO);
                // Обновляем нужные свойства
                userProfile.UserImagePath = general.UserImagePath;
                userProfile.FullName = general.FullName;
                userProfile.Gender = general.Gender;
                userProfile.DateOfBirth = general.DateOfBirth;
                userProfile.Location = general.Location;

                // Обновляем запись
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();

                // Обновляем UserName через AccountRepo.
                var user = await AccountRepo.FindUserById(currentUserId);
                user.UserName = generalDTO.UserName;
                var result = await AccountRepo.UserManager.UpdateAsync(user);

                //Преобразовываем обратно, чтобы вернуть клиенту
                generalDTO = Mapper.Map<GeneralDTO>(userProfile);
                generalDTO.UserName = user.UserName;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<GeneralDTO>(HttpStatusCode.OK, generalDTO);
        }

        //
        // PUT api/profile/physicalInfo
        /// <summary>
        /// Метод обновления физической информации о пользователе.
        /// </summary>
        /// <returns>Обновленная физическая информация о пользователе в формате объекта PhysicalInfoDTO.</returns>
        [HttpPut]
        [Route("physicalInfo")]
        public HttpResponseMessage UpdatePhysicalInfo([FromBody]PhysicalInfoDTO physicalInfoDTO)
        {
            try
            {
                // Выбираем профиль из БД для обновления
                var userProfile = unitOfWork.UserProfileRepository.Get(
                  f => f.UserId == currentUserId,
                  null,
                  i => i.Weights)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                var physicalInfo = Mapper.Map<UserProfile>(physicalInfoDTO);
                // Обновляем нужные свойства
                userProfile.Height = physicalInfo.Height;
                userProfile.ActivityLevel = physicalInfo.ActivityLevel;

                // Создаем новое взвешивание с пришедшим весом 
                #region __Создаем новое взвешивание__
                if (physicalInfoDTO.Weight.HasValue)
                {
                    UserWeight userWeight = new UserWeight();
                    userWeight.Weight = physicalInfoDTO.Weight.Value;
                    userWeight.Date = DateTime.UtcNow;
                    userWeight.CreateUserId = currentUserId;

                    if (userProfile.Weights.Any())
                    {
                        // Есть взвешивания
                        if (userProfile.Weights.OrderByDescending(d => d.Date).First().Weight != physicalInfoDTO.Weight)
                        {
                            // Если произошло изменение веса - добавляем новое взвешивание
                            userProfile.Weights.Add(userWeight);
                        }
                    }
                    else
                    {
                        // Нет взвешиваний - добавляем
                        userProfile.Weights.Add(userWeight);
                    }
                }
                #endregion

                // Обновляем запись
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();

                // Преобразовываем обратно, чтобы вернуть клиенту
                physicalInfoDTO = Mapper.Map<PhysicalInfoDTO>(userProfile);
                if (userProfile.Weights.Any())
                {
                    physicalInfoDTO.Weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
                }
                else
                {
                    physicalInfoDTO.Weight = null;
                }
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<PhysicalInfoDTO>(HttpStatusCode.OK, physicalInfoDTO);
        }

        //
        // PUT api/profile/notifications
        /// <summary>
        /// Метод обновления информации об уведомлениях пользователя.
        /// </summary>
        /// <returns>Обновленная информация об уведомлениях пользователя в формате объекта NotificationsDTO.</returns>
        [HttpPut]
        [Route("notifications")]
        public HttpResponseMessage UpdateNotifications([FromBody]NotificationsDTO notificationsDTO)
        {
            try
            {
                var notificationsEntity = new Notifications();
                // Выбираем профиль из БД для обновления
                var notifications = unitOfWork.NotificationsRepository.Get(
                  f => f.UserProfileId == currentUserId,
                  null)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (notifications == null)
                {
                    notificationsEntity.UserProfileId = currentUserId;
                    notificationsEntity.Newsletter = notificationsDTO.Newsletter;
                    notificationsEntity.PushNotifications = notificationsDTO.PushNotifications;
                    unitOfWork.NotificationsRepository.Insert(notificationsEntity);
                }
                else
                {
                    notifications.Newsletter = notificationsDTO.Newsletter;
                    notifications.PushNotifications = notificationsDTO.PushNotifications;
                    unitOfWork.NotificationsRepository.Update(notifications);
                }
                // Обновляем запись
                unitOfWork.Save();
                // Преобразовываем обратно, чтобы вернуть клиенту
                notificationsDTO = Mapper.Map<NotificationsDTO>((notifications == null)?notificationsEntity:notifications);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<NotificationsDTO>(HttpStatusCode.OK, notificationsDTO);
        }

        //
        // PUT api/profile/privacy
        /// <summary>
        /// Метод обновления информации о приватности профиля пользователя.
        /// </summary>
        /// <returns>Обновленная информация о приватности профиля пользователя в формате объекта PrivacyDTO.</returns>
        [HttpPut]
        [Route("privacy")]
        public HttpResponseMessage UpdatePrivacy([FromBody]PrivacyDTO privacyDTO)
        {
            try
            {
                // Выбираем профиль из БД для обновления
                var userProfile = unitOfWork.UserProfileRepository.Get(
                  f => f.UserId == currentUserId,
                  null)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                var privacy = Mapper.Map<UserProfile>(privacyDTO);
                // Обновляем нужные свойства
                userProfile.PrivacyFlag = privacy.PrivacyFlag;

                // Обновляем запись
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                privacyDTO = Mapper.Map<PrivacyDTO>(userProfile);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<PrivacyDTO>(HttpStatusCode.OK, privacyDTO);
        }

        //
        // PUT api/profile/physicalInfoEx
        /// <summary>
        /// Метод обновления расширенной физической информации о пользователе.
        /// </summary>
        /// <returns>Обновленная расширенная физическая информация о пользователе в формате объекта PhysicalInfoExDTO.</returns>
        [HttpPut]
        [Route("physicalInfoEx")]
        public HttpResponseMessage UpdatePhysicalInfoEx([FromBody]PhysicalInfoExDTO physicalInfoExDTO)
        {
            try
            {
                // Выбираем профиль из БД для обновления
                var userProfile = unitOfWork.UserProfileRepository.Get(
                  f => f.UserId == currentUserId,
                  null,
                  i => i.Weights)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                var physicalInfoEx = Mapper.Map<UserProfile>(physicalInfoExDTO);
                // Обновляем нужные свойства
                userProfile.Gender = physicalInfoEx.Gender;
                userProfile.DateOfBirth = physicalInfoEx.DateOfBirth;
                userProfile.Height = physicalInfoEx.Height;
                userProfile.ActivityLevel = physicalInfoEx.ActivityLevel;

                // Создаем новое взвешивание с пришедшим весом 
                #region __Создаем новое взвешивание__
                if (physicalInfoExDTO.Weight.HasValue)
                {
                    UserWeight userWeight = new UserWeight();
                    userWeight.Weight = physicalInfoExDTO.Weight.Value;
                    userWeight.Date = DateTime.UtcNow;
                    userWeight.CreateUserId = currentUserId;

                    if (userProfile.Weights.Any())
                    {
                        // Есть взвешивания
                        if (userProfile.Weights.OrderByDescending(d => d.Date).First().Weight != physicalInfoExDTO.Weight)
                        {
                            // Если произошло изменение веса - добавляем новое взвешивание
                            userProfile.Weights.Add(userWeight);
                        }
                    }
                    else
                    {
                        // Нет взвешиваний - добавляем
                        userProfile.Weights.Add(userWeight);
                    }
                }
                #endregion

                // Обновляем запись
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();

                // Преобразовываем обратно, чтобы вернуть клиенту
                physicalInfoExDTO = Mapper.Map<PhysicalInfoExDTO>(userProfile);
                if (userProfile.Weights.Any())
                {
                    physicalInfoExDTO.Weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
                }
                else
                {
                    physicalInfoExDTO.Weight = null;
                }
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<PhysicalInfoExDTO>(HttpStatusCode.OK, physicalInfoExDTO);
        }
        #endregion

        #region __Post__
        //
        // POST api/profile/status
        /// <summary>
        /// Метод установки статуса пользователя.
        /// </summary>
        /// <returns>Код выполнения операции.</returns>
        [HttpPost]
        [Route("status")]
        public HttpResponseMessage SetStatus([FromBody]StatusDTO statusDTO)
        {
            try
            {
                // Получаем данные о пользователе из БД
                var userProfile = unitOfWork.UserProfileRepository.Get(
                  f => (f.UserId == currentUserId),
                  null)
                  .SingleOrDefault();

                // Пользователя нет в БД.
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                // Устанавливаем статус пользователю.
                userProfile.Status = Mapper.Map<UserProfile>(statusDTO).Status;
                
                // Обновляем запись.
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();

                // Обновляем DTO, чтобы вернуть его клиенту.
                statusDTO.Status = userProfile.Status;
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<StatusDTO>(HttpStatusCode.OK, statusDTO);
        }
        #endregion
        #endregion

        #region __User Information__
        //
        // GET api/profile/userInfo
        /// <summary>
        /// Метод получения информации о текущем пользователе.
        /// </summary>
        /// <returns>Информация о текущем пользователе в формате объекта UserInfoDTO.</returns>
        [HttpGet]
        [Route("userinfo")]
        public async Task<HttpResponseMessage> GetUserInfo()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null,
              i => i.Weights)
              .SingleOrDefault();

            // Пользователя нет в БД.
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var userInfoDTO = Mapper.Map<UserInfoDTO>(userProfile);
            // Получаем последнее взвешивание.
            if (userProfile.Weights.Any())
            {
                userInfoDTO.Weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
            }
            else
            {
                userInfoDTO.Weight = null;
            }
            // Получаем Username из AccountRepository.
            var user = await AccountRepo.FindUserById(currentUserId);
            userInfoDTO.UserName = user.UserName;

            return Request.CreateResponse<UserInfoDTO>(HttpStatusCode.OK, userInfoDTO);
        }
        #endregion

        #region __Weighting__
        //
        // GET api/profile/weighting
        /// <summary>
        /// Метод получения последнего взвешивания пользователя.
        /// </summary>
        /// <param name="getWeightParams">Объект параметров типа GetWeightingParams.</param>
        /// <returns>Информация о взвешиваниях пользователя в формате IEnumerable<UserWeightDTO>.</returns>
        [HttpGet]
        [Route("weighting")]
        public HttpResponseMessage GetWeighting([FromUri] GetWeightingParams getWeightParams)
        {
            // Проверяем входящие параметры.
            if (getWeightParams == null ||
                getWeightParams.isLast == false && 
                (getWeightParams.from == 0 || getWeightParams.to == 0 || getWeightParams.from > getWeightParams.to))
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.BadRequest));
            }

            IEnumerable<UserWeightDTO> resultWeighings = new List<UserWeightDTO>();
            DateTime fromLocalZoned = new DateTime();
            DateTime toLocalZoned = new DateTime();

            // Получаем смещение времени пользователя.
            int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);

            try
            {
                // Обрабатываем входящие параметры.
                if (getWeightParams.isLast == false)
                {
                    // Если надо получить НЕ последнее взвешивание.
                    // Получаем время в соответствии с временной зоной пользователя.
                    fromLocalZoned = TimeHelper.ConvertFromUtc(
                        TimeHelper.FromUnixMsToDateTime(getWeightParams.from),
                        timezoneOffset).ToLocalTime().Date;
                    toLocalZoned = TimeHelper.ConvertFromUtc(
                        TimeHelper.FromUnixMsToDateTime(getWeightParams.to),
                        timezoneOffset).ToLocalTime().Date;
                }

                List<UserWeight> userWeighings = new List<UserWeight>();

                if (getWeightParams.isLast)
                {
                    // Get last weighing.
                    var lastWeighing = unitOfWork.UserWeightRepository.Get(
                        w => (w.CreateUserId == currentUserId))
                       .OrderByDescending(w => w.Date).FirstOrDefault();
                    if (lastWeighing != null)
                    {
                        userWeighings.Add(lastWeighing);
                    }
                }
                else
                {
                    // Get user weighings in a specific time range.
                    userWeighings = unitOfWork.UserWeightRepository.Get(
                        w => (w.CreateUserId == currentUserId) &&
                        (DbFunctions.TruncateTime(w.Date) >= DbFunctions.TruncateTime(fromLocalZoned) &&
                         DbFunctions.TruncateTime(w.Date) <= DbFunctions.TruncateTime(toLocalZoned)))
                         .OrderByDescending(w => w.Date)
                         .ToList();
                }

                // Конвертируем в объект DTO, чтобы вернуть пользователю.
                resultWeighings = Mapper.Map<IEnumerable<UserWeightDTO>>(userWeighings);

            } catch (Exception ex) {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError));
            }

            return Request.CreateResponse<IEnumerable<UserWeightDTO>>(HttpStatusCode.OK, resultWeighings);
        }

        //
        // POST api/profile/weighting
        /// <summary>
        /// Метод сохранения взвешивания пользователя.
        /// </summary>
        /// <returns>Сохраненный объект взвешивания в формате объекта UserWeightDTO.</returns>
        [HttpPost]
        [Route("weighting")]
        public HttpResponseMessage PostWeighting([FromBody]UserWeightDTO userWeightDTO)
        {
            try
            {
                var userWeight = Mapper.Map<UserWeight>(userWeightDTO);
                // Если даты нет, то ставим - сейчас.
                if (!TimeHelper.IsDateTimeSet(userWeight.Date))
                {
                    userWeight.Date = DateTime.UtcNow;
                }

                // Получаем смещение времени пользователя.
                int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);
                var zonedDateTime = TimeHelper.ConvertFromUtc(userWeight.Date, timezoneOffset);
                var zonedDate = zonedDateTime.Date;

                var userWeighingInDb = unitOfWork.UserWeightRepository.Get(
                    uw => 
                        (uw.CreateUserId == currentUserId) &&
                        (DbFunctions.TruncateTime(DbFunctions.AddMinutes(uw.Date, timezoneOffset)) == zonedDate))
                        .SingleOrDefault();

                if (userWeighingInDb == null)
                {
                    userWeight.CreateUserId = currentUserId;
                    // Добавляем запись в базу
                    unitOfWork.UserWeightRepository.Insert(userWeight);
                }
                else
                {
                    userWeighingInDb.Weight = userWeight.Weight;
                    userWeighingInDb.Date = userWeight.Date;
                    // Обновляем запись в базе.
                    unitOfWork.UserWeightRepository.Update(userWeighingInDb);
                }
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                userWeightDTO = Mapper.Map<UserWeightDTO>(userWeight);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse(HttpStatusCode.Created, userWeightDTO);
        }
        #endregion

        #region __Goals__
        // GET api/profile/goal/139993299239
        /// <summary>
        /// Метод получения цели пользователя на определенную дату.
        /// </summary>
        /// <param name="date">Дата в формате Unix (milliseconds).</param>
        /// <returns>Информация о цели в формате объекта GoalInfoDTO.</returns>
        [HttpGet]
        [Route("goals/{date:long:min(1)}")]
        public HttpResponseMessage GetGoals(long date)
        {
            // Временное смещение пользователя
            int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);
            var zonedDateTime = TimeHelper.ConvertFromUtc(TimeHelper.FromUnixMsToDateTime(date), timezoneOffset);
            var zonedDate = zonedDateTime.Date;

            // Получаем данные о последней цели из БД на переданную дату с учетом смещения
            Goal goal = null;
            var goals = unitOfWork.GoalRepository.Get(
              f => (f.CreateUserId == currentUserId),
              null
            )
            .Where(
              f =>
                (zonedDate
                >=
                f.CreationTime.AddMinutes(timezoneOffset).Date) &&
                (f.EndTime == null ||
                zonedDate
                <
                f.EndTime.Value.AddMinutes(timezoneOffset).Date));

            if (goals.Any())
            {
                goal = goals.OrderByDescending(d => d.CreationTime).First();
            }

            // Преобразовываем в DTO-объект для ответа
            var goalInfoDTO = Mapper.Map<GoalDTO>(goal);

            return Request.CreateResponse<GoalDTO>(HttpStatusCode.OK, goalInfoDTO);
        }

        //
        // GET api/profile/goal
        /// <summary>
        /// Метод получения цели пользователя.
        /// </summary>
        /// <returns>Информация о цели в формате объекта GoalInfoDTO.</returns>
        [HttpGet]
        [Route("goals/{isLast:bool?}")]
        public HttpResponseMessage GetGoals(bool isLast = true)
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null,
              g => g.Goals)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            if (userProfile.Goals.Any())
            {
                if (isLast)
                {
                    // Выбираем последнюю цель с датой окончания нулевой или большей чем сегодня
                    var lastGoal = userProfile.Goals.Where(s => (!s.EndTime.HasValue || (s.EndTime.Value > DateTime.UtcNow))).OrderByDescending(d => d.CreationTime).First();
                    var goalInfoDTO = Mapper.Map<GoalDTO>(lastGoal);

                    return Request.CreateResponse<GoalDTO>(HttpStatusCode.OK, goalInfoDTO);
                }
                else
                {
                    // Выбираем все цели
                    // TODO Продумать ограничениия (только последние за месяц или год)
                    var goalInfoDTO = Mapper.Map<IEnumerable<GoalDTO>>(userProfile.Goals);

                    return Request.CreateResponse<IEnumerable<GoalDTO>>(HttpStatusCode.OK, goalInfoDTO);
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // PUT api/profile/goal
        /// <summary>
        /// Метод обновления цели пользователя.
        /// </summary>
        /// <param name="goalInfoDTO">Переданный объект с информацией для обновления цели пользователе.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpPut]
        [Route("goal")]
        public HttpResponseMessage Put([FromBody]GoalDTO goalInfoDTO)
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);

            try
            {
                // Выбираем цель пользователя из БД для обновления
                var userGoal = unitOfWork.GoalRepository.Get(
                  f => f.CreateUser.UserId == currentUserId,
                  null)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (userGoal == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                userGoal.CreationTime = DateTime.UtcNow;
                if (goalInfoDTO.EstimatedFinishDate.HasValue)
                    userGoal.EstimatedFinishDate = TimeHelper.FromUnixMsToDateTime(goalInfoDTO.EstimatedFinishDate.Value);
                userGoal.GoalType = goalInfoDTO.GoalType;
                userGoal.GoalWeight = goalInfoDTO.GoalWeight;
                userGoal.StartWeight = goalInfoDTO.StartWeight;

                // Обновляем запись
                unitOfWork.GoalRepository.Update(userGoal);
                unitOfWork.Save();

                // Преобразовываем обратно, чтобы вернуть клиенту
                goalInfoDTO = Mapper.Map<GoalDTO>(userGoal);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<GoalDTO>(HttpStatusCode.OK, goalInfoDTO);
        }

        // POST api/profile/rde
        /// <summary>
        /// Метод подсчета создания цели (в т.ч. Рекомендованного Суточного Потребления (РСП\RDE)) 
        /// и сохранение измененных цели и физ.информации пользователя 
        /// </summary>
        /// <param name="RdeDTO">Переданный объект с информацией для создания цели пользователя.</param>
        /// <returns>Объект типа RdeDTO, включающий в себя информацию о цели и физические данные пользователя.</returns>
        [HttpPost]
        [Route("goals")]
        public HttpResponseMessage CalculateRDE([FromBody]RdeDTO rdeDTO)
        {
            try
            {
                // Выбираем пользователя из БД для обновления
                var userProfile = unitOfWork.UserProfileRepository.Get(
                  f => f.UserId == currentUserId,
                  null,
                  w => w.Weights,
                  g => g.Goals)
                  .SingleOrDefault();

                // Пользователя нет в БД
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                Goal userGoal = new Goal();
                userGoal.CreateUserId = currentUserId;
                userGoal.CreationTime = DateTime.UtcNow;
                if (!userProfile.Goals.Any())
                {
                    // Цели еще не было создано, создаем
                    userProfile.Goals.Add(userGoal);
                }
                else
                {
                    // Цели есть, если дата создания последней записи - сегодняшняя, то изменяем цель, 
                    // если не сегодняшняя, то создаем новую
                    if (!(userProfile.Goals.OrderByDescending(d => d.CreationTime).First().CreationTime.Date == DateTime.UtcNow.Date))
                    {
                        userProfile.Goals.Add(userGoal);
                    }
                }
                var goalLst = userProfile.Goals.OrderByDescending(d => d.CreationTime);
                userGoal = goalLst.First();

                if (goalLst.Count() > 1)
                {
                    // Если целей больше одной, то выставляем предыдущей цели EndTime, если еще не выставлено
                    if (!goalLst.ElementAt(1).EndTime.HasValue)
                    {
                        goalLst.ElementAt(1).EndTime = DateTime.UtcNow;
                    }
                }

                #region __Проверка физданных__
                var physicalInfoEx = Mapper.Map<UserProfile>(rdeDTO.physicalInfoExDTO);
                // Проверяем не изменились ли физ.данные пользователя и устанавливаем изменившиеся
                userProfile.ActivityLevel = physicalInfoEx.ActivityLevel;
                userProfile.DateOfBirth = physicalInfoEx.DateOfBirth;
                userProfile.Gender = physicalInfoEx.Gender;
                userProfile.Height = physicalInfoEx.Height;
                
                //Utilities.CompareAndSetObjectProperties<PhysicalInfoDTO>(
                //  physicalInfoEx,
                //  userProfile);

                if (rdeDTO.physicalInfoExDTO.Weight.HasValue)
                {
                    UserWeight uw = new UserWeight();
                    uw.Weight = rdeDTO.physicalInfoExDTO.Weight.Value;
                    uw.Date = DateTime.UtcNow;
                    uw.CreateUserId = currentUserId;

                    // Если есть взвешивания
                    if (userProfile.Weights.Any())
                    {
                        // Не совпадает последнее взвешивани с пришедшим весом - изменился вес, значит добавляем взвешивание.
                        if (userProfile.Weights.OrderByDescending(d => d.Date).First().Weight != rdeDTO.physicalInfoExDTO.Weight.Value)
                        {
                            userProfile.Weights.Add(uw);
                        }
                    }
                    else
                    {
                        // Нет взвешиваний - добавляем
                        userProfile.Weights.Add(uw);
                    }
                }
                #endregion

                var goal = Mapper.Map<Goal>(rdeDTO.goalDTO);
                // Проверяем не изменилась ли цель пользователя
                Utilities.CompareAndSetObjectProperties<Goal>(goal, userGoal,
                  ex1 => ex1.GoalId,
                  ex2 => ex2.CreateUser,
                  ex3 => ex3.CreateUserId,
                  ex4 => ex4.RDE,
                  ex5 => ex5.CreationTime);

                // Текущий вес пользователя
                var currentWeight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
                // Текущий вес считаем за начальный вес цели
                userGoal.StartWeight = currentWeight;
                var age = TimeHelper.GetAge(userProfile.DateOfBirth.Value);
                // Расчет RDE для поддержания веса
                var maintainingRDE = FoodHelper.GetMaintainingRDEMifflin(
                    userProfile.Gender.Value,
                    currentWeight,
                    userProfile.Height.Value,
                    age,
                    userProfile.ActivityLevel.Value
                    );


                if (userGoal.GoalType == (int)GoalTypes.MaintainWeight)
                {
                    userGoal.GoalWeight = userGoal.StartWeight;
                    userGoal.RDE = maintainingRDE;
                }
                else
                {
                    userGoal.RDE = FoodHelper.GetGoalRDE(userGoal.GoalType, userGoal.Intensity, maintainingRDE);
                    // При наборе мышц - не считаем дату достижения цели
                    if (userGoal.GoalType != (int)GoalTypes.GainMuscleMass)
                    {
                        userGoal.EstimatedFinishDate = FoodHelper.GetGoalFinishDate(
                          userGoal.GoalType,
                          userGoal.Intensity,
                          currentWeight,
                          userGoal.GoalWeight);
                    }
                }

                var bmi = FoodHelper.GetBMI(
                  currentWeight,
                  userProfile.Height.Value);

                // Добавляем запись
                //unitOfWork.GoalRepository.Update(userProfile.Goal);
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                rdeDTO.physicalInfoExDTO = Mapper.Map<PhysicalInfoExDTO>(userProfile);
                rdeDTO.physicalInfoExDTO.Weight = currentWeight;
                rdeDTO.goalDTO = Mapper.Map<GoalDTO>(userGoal);
            }
            catch (Exception ex)
            {
#if (DEBUG == true)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
                }
#else
        {
          throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, "Error occured while setting Goal."));
        }
#endif
            }

            return Request.CreateResponse<RdeDTO>(HttpStatusCode.Created, rdeDTO);
        }

        //
        // GET api/profile/physicalinfoex
        /// <summary>
        /// Метод получения расширенной физической информации пользователя.
        /// </summary>
        /// <returns>Расширенная физическая информация пользователя в формате объекта PhysicalInfoExDTO.</returns>
        [HttpGet]
        [Route("physicalinfoex")]
        public HttpResponseMessage GetPhysicalInfoEx()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null,
              i => i.Weights)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var physicalInfoExDTO = Mapper.Map<PhysicalInfoExDTO>(userProfile);
            if (userProfile.Weights.Any())
            {
                physicalInfoExDTO.Weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
            }
            else
            {
                physicalInfoExDTO.Weight = null;
            }

            return Request.CreateResponse<PhysicalInfoExDTO>(HttpStatusCode.OK, physicalInfoExDTO);
        }
        #endregion

        #region __Helper Methods__
        [HttpPost]
        [Route("uploaduserimage")]
        public async Task<HttpResponseMessage> UploadUserImage() {

            // Max size for uploading image. 2 MB.
            int maxSize = 2*1024*1024;
            // Default Image width.
            int defaultWidth = 100;
            // Default Image height.
            int defaultHeight = 100;
            // Path for uploading image on the server.
            string path = "/Content/user/img";
            // Temp directory
            string tempPath = "/Content/user/tmp";
            // Default extension for saving uploaded image
            string defaultImageExtension = "jpg";
            // Supported media formats
            List<string> supportedMediaFormats =
                new List<string>() { "image/jpg", "image/jpeg", "image/pjpeg", "image/gif", "image/x-png", "image/png", "image/bmp" };

            // Create folders if doesn't exist
            if (!Directory.Exists(HttpContext.Current.Server.MapPath(path)))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath(path));
            }
            if (!Directory.Exists(HttpContext.Current.Server.MapPath(tempPath)))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath(tempPath));
            }

            // Check whether the POST operation is MultiPart or image file.
            if (!Request.Content.IsMimeMultipartContent()) 
            { 
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType); 
            }
            // Check whether the uploaded image is in maxSize range.
            if (Request.Content.Headers.ContentLength > maxSize)
            {
                throw new HttpResponseException(HttpStatusCode.RequestEntityTooLarge); 
            }
            
            // Prepare CustomMultipartFormDataStreamProvider in which our multipart form 
            // data will be loaded. 
            // Save file in  temp directory first (because of file corruption after ReadAsMultipartAsync).
            string tempFileSaveLocation = HttpContext.Current.Server.MapPath(tempPath);
            string fileSaveLocation = HttpContext.Current.Server.MapPath(path);
            UserImageMultipartFormDataStreamProvider provider = new UserImageMultipartFormDataStreamProvider(
                tempFileSaveLocation, 
                currentUserId, 
                defaultImageExtension);

            try
            {
                // Read all contents of multipart message into CustomMultipartFormDataStreamProvider. 
                await Request.Content.ReadAsMultipartAsync(provider);
                // Get supported image file.
                var file = provider.FileData.First(i=>supportedMediaFormats.Contains(i.Headers.ContentType.MediaType));
                // Get the first file.
                var tempLocalFilePath = file.LocalFileName;
                if (!File.Exists(tempLocalFilePath))
                {
                    throw new FileNotFoundException();
                }
                var fileName = Path.GetFileName(tempLocalFilePath);
                // Resize image.
                try
                {
                    Image userImage;
                    using (var bmpTemp = new Bitmap(tempLocalFilePath))
                    {
                        userImage = new Bitmap(bmpTemp);
                    }
                    userImage = ImageHelper.Resize(userImage, new Size(defaultWidth, defaultHeight));
                    userImage.Save(tempLocalFilePath);
                }
                catch (Exception e)
                {
                    // Bad image.
                    File.Delete(tempLocalFilePath);
                    throw e; 
                }
                // All manipulations done. Overwrite image file in real directory.
                File.Copy(tempLocalFilePath, Path.Combine(fileSaveLocation, fileName), true);
                File.Delete(tempLocalFilePath);
                // Calculate relative server path to image.
                Uri imageFileUri = new Uri(fileName, UriKind.Relative);
                Uri imagePathUri = new Uri(path, UriKind.Relative);
                Uri fullImageUri = imagePathUri.Combine(imageFileUri);
                // Save image url in db
                // Получаем данные о пользователе из БД
                var userProfile = unitOfWork.UserProfileRepository.Get(
                    f => (f.UserId == currentUserId),
                    null)
                    .SingleOrDefault();

                // User doesn't exists
                if (userProfile == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }
                userProfile.UserImagePath = fullImageUri.ToString();
                unitOfWork.UserProfileRepository.Update(userProfile);
                unitOfWork.Save();
                // Send OK Response along with saved file name to the client. 
                return Request.CreateResponse(HttpStatusCode.OK, new KeyValuePair<string, string>("uploadedImageUrl", fullImageUri.ToString())); 
                //var response = Request.CreateResponse(HttpStatusCode.OK);
                //response.Content = new StringContent(fullImageUri.ToString(), System.Text.Encoding.UTF8, "text/plain");
                //return response;
            } catch (System.Exception e) 
            {
                // Delete temp file on exception
                if (provider.FileName != null)
                {
                    var tempFile = Path.Combine(tempFileSaveLocation, provider.FileName);
                    if (File.Exists(tempFile))
                    {
                        File.Delete(tempFile);
                    }
                }
                //var response = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
                //response.Content = new StringContent(e.Message, System.Text.Encoding.UTF8, "text/plain");
                //return response;
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e); 
            } 
        }

        /// <summary>
        /// Метод возвращающий часть информации о профиле пользователя в зависимости от DTO-объекта.
        /// </summary>
        /// <typeparam name="T">Тип DTO объекта, который необходимо вернуть.</typeparam>
        /// <returns>Частичная информация о пользователе в формате переданного DTO-объекта.</returns>
        public T GetUserProfilePart<T>()
        {
            // Получаем данные о пользователе из БД
            var userProfile = unitOfWork.UserProfileRepository.Get(
              f => (f.UserId == currentUserId),
              null)
              .SingleOrDefault();

            // Пользователя нет в БД
            if (userProfile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var dto = default(T);
            try
            {
                dto = Mapper.Map<T>(userProfile);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return dto;
        }
        #endregion
    }
}