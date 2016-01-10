using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using fatsecret.platform;
using fitotrack.Models.Meal;
using fitotrack.Models.Meal.DTO;
using fitotrack.Repository.Services;
using Newtonsoft.Json;
using fitotrack.Entity.Models;
using fitotrack.Helpers;
using System.Data.Objects;
using fitotrack.Handlers;
using Microsoft.AspNet.Identity;
using System.Data.Entity;

namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер дневника питания.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/fooddiary")]
    [Filters.ExceptionHandler]
    public class FoodDiaryController : ApiController
    {
        #region __Поля__
        /// <summary>
        /// Поле для доступа к репозиториям.
        /// </summary>
        private UnitOfWork unitOfWork = new UnitOfWork();
        /// <summary>
        /// Идентификатор текущего пользователя.
        /// </summary>
        private int currentUserId = HttpContext.Current.User.Identity.GetUserId<int>();
        #endregion

        #region __Методы__
        //
        // GET api/fooddiary/5
        /// <summary>
        /// Метод получения записи дневника питания по идентификатору из БД.
        /// </summary>
        /// <param name="id">Идентификатор записи дневника питания.</param>
        /// <returns>Запись дневника питания в формате объекта FoodDiaryEntryDTO.</returns>
        [HttpGet]
        [Route("{id:long:min(1)}")]
        public HttpResponseMessage Get(long id)
        {
            //var currentUserId = WebSecurity.GetUserId(HttpContext.Current.User.Identity.Name);

            // Получаем данные о записи из БД
            var foodDiaryEntry = unitOfWork.FoodDiaryEntryRepository.Get(
              f => (f.CreateUserId == currentUserId &&
                     f.FoodDiaryEntryId == id),
              null,
              iF => iF.Food,
              iS => iS.Food.Servings
            ).SingleOrDefault();


            // Записи нет в БД FT
            if (foodDiaryEntry == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var foodDiaryEntryDTO = Mapper.Map<FoodDiaryEntryDTO>(foodDiaryEntry);

            return Request.CreateResponse<FoodDiaryEntryDTO>(HttpStatusCode.OK, foodDiaryEntryDTO);
        }

        //
        // GET api/fooddiary/date/1392128524124
        /// <summary>
        /// Метод получения записей дневника питания на определенный день из БД. 
        /// NB: В методе используется пользовательское временное смещение относительно UTC.
        /// </summary>
        /// <param name="date">Дата в формате Unix Epoch Milliseconds.</param>
        /// <returns>Список записей дневника питания. Формат записи - FoodDiaryEntryDTO.</returns>
        [HttpGet]
        [Route("date/{date:long:min(1)}")]
        public HttpResponseMessage GetByDate(long date)
        {
            #region _Temp_
            // Получаем идентификатор часового пояса пользователя
            //var userTzId = unitOfWork.UserProfileRepository.Get(
            //  f => f.UserId == currentUserId,
            //  null)
            //  .SingleOrDefault()
            //  .TimezoneId;
            // Структура из которой можно определить переданное время в часовом поясе пользователя
            //var zonedDateTime2 = new TimeHelper.DateTimeWithZone(date, "Russian Standard Time");
            // Получаем данные о записях из БД на переданную дату в часовом поясе полльзователя
            //var foodDiaryEntries2 = unitOfWork.FoodDiaryEntryRepository.Get(
            //  f => (f.CreateUserId == currentUserId &&
            //        EntityFunctions.DiffDays(
            //      // Выбрасываем время, оставляем только дату
            //          EntityFunctions.TruncateTime(
            //      // Добавляем смещение временной зоны пользователя, получаем время из БД в часовом формате пользователя
            //            EntityFunctions.AddMilliseconds(f.Date, zonedDateTime2.ZonedUniversalDateTime.Offset.Milliseconds)
            //         ),
            //         zonedDateTime2.LocalTime.Date) == 0),
            //  null,
            //  iF => iF.Food,
            //  iS => iS.Food.Servings
            //);
            #endregion

            // Получаем смещение времени пользователя
            int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);
            var zonedDateTime = TimeHelper.ConvertFromUtc(TimeHelper.FromUnixMsToDateTime(date), timezoneOffset);
            var zonedDate = zonedDateTime.Date;

            var foodDiaryEntries = unitOfWork.FoodDiaryEntryRepository.Get(
              f => (f.CreateUserId == currentUserId &&
                    DbFunctions.DiffDays(
                  // Выбрасываем время, оставляем только дату
                      DbFunctions.TruncateTime(
                  // Добавляем смещение временной зоны пользователя, получаем время из БД в часовом формате пользователя
                        DbFunctions.AddMinutes(f.Date, timezoneOffset)
                     ),
                     zonedDate) == 0),
              null,
              iF => iF.Food,
              iS => iS.Food.Servings
            );

            // Преобразовываем в DTO-объект для ответа
            var foodDiaryEntryDTO = Mapper.Map<IEnumerable<FoodDiaryEntryDTO>>(foodDiaryEntries);

            return Request.CreateResponse<IEnumerable<FoodDiaryEntryDTO>>(HttpStatusCode.OK, foodDiaryEntryDTO);
        }

        //
        // GET api/fooddiary/popularfood
        /// <summary>
        /// Метод получения наиболее употребляемой еды.
        /// </summary>
        /// <returns>Список наиболее употребляемой еды в формате FoodDTO.</returns>
        [HttpGet]
        [Route("popularfood")]
        public HttpResponseMessage GetPopularFood()
        {
            // Получаем 10 самых популярных блюд, добавленных в дневник.
            var popularFoods = unitOfWork.FoodDiaryEntryRepository.Get(
              fd => (fd.CreateUserId == currentUserId),
              null,
              iF => iF.Food,
              iS => iS.Food.Servings
            ).Distinct()
            .GroupBy(f => f.Food.FoodId)
            .OrderByDescending(f => f.Count())
            .Take(10)
            .ToDictionary(f => f.Key, f => f.FirstOrDefault())
            .Select(f=>f.Value.Food)
            .ToList();

            IEnumerable<FoodDTO> popularFoodsDTO = null;

            if (popularFoods.Count() > 0)
            {
                popularFoodsDTO = Mapper.Map<IEnumerable<FoodDTO>>(popularFoods);
            }

            return Request.CreateResponse<IEnumerable<FoodDTO>>(HttpStatusCode.OK, popularFoodsDTO);
        }

        //
        // GET api/fooddiary/recentfood
        /// <summary>
        /// Метод получения недавно употребленной еды.
        /// </summary>
        /// <returns>Список недавно употребленной еды в формате FoodDTO.</returns>
        [HttpGet]
        [Route("recentfood")]
        public HttpResponseMessage GetRecentFood()
        {
            // Получаем 10 уникальных недавно съеденных продуктов, добавленных в дневник.
            var recentFoods = unitOfWork.FoodDiaryEntryRepository.Get(
              fd => (fd.CreateUserId == currentUserId),
              null,
              iF => iF.Food,
              iS => iS.Food.Servings
            )
            .GroupBy(f => f.Food.FoodId)
            .Select(f => f.OrderByDescending(t=>t.CreationTime).FirstOrDefault())
            .OrderByDescending(f=>f.CreationTime)
            .Take(10)
            .Select(f => f.Food)
            .ToList();

            IEnumerable<FoodDTO> recentFoodsDTO = null;

            if (recentFoods.Count() > 0)
            {
                recentFoodsDTO = Mapper.Map<IEnumerable<FoodDTO>>(recentFoods);
            }

            return Request.CreateResponse<IEnumerable<FoodDTO>>(HttpStatusCode.OK, recentFoodsDTO);
        }

        //
        // GET api/fooddiary/ninfo/1392128524124
        /// <summary>
        /// Метод получения информации о потребленной энергетической ценности (БЖУ+калории) на определенный день из БД.
        /// </summary>
        /// <param name="date">Дата в формате Unix Epoch Milliseconds.</param>
        /// <returns>Информация о потребленной энергетической ценности (БЖУ+калории) в формате NutritionInfoDTO.</returns>
        [HttpGet]
        [Route("ninfo/{date:long:min(1)}")]
        public HttpResponseMessage GetNutritionInfo(long date)
        {
            // Получаем смещение времени пользователя
            int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);
            var zonedDateTime = TimeHelper.ConvertFromUtc(TimeHelper.FromUnixMsToDateTime(date), timezoneOffset);
            var zonedDate = zonedDateTime.Date;

            var foodDiaryEntries = unitOfWork.FoodDiaryEntryRepository.Get(
              f => (f.CreateUserId == currentUserId &&
                    DbFunctions.DiffDays(
                  // Выбрасываем время, оставляем только дату
                      DbFunctions.TruncateTime(
                  // Добавляем смещение временной зоны пользователя, получаем время из БД в часовом формате пользователя
                        DbFunctions.AddMinutes(f.Date, timezoneOffset)
                     ),
                     zonedDate) == 0),
              null,
              iF => iF.Food,
              iS => iS.Food.Servings
            );

            var consumedNInfo = new NutritionInfoDTO();
            var plannedNInfo = new NutritionInfoDTO();
            int plannedMealsCount = 0;
            int consumedMealsCount = 0;

            if (foodDiaryEntries != null &&
                foodDiaryEntries.Count() > 0)
            {
                foreach (var entry in foodDiaryEntries)
                {
                    var serving = entry.Food.Servings.Where(s =>
                        (s.ServingId == entry.FtSelectedServingId && entry.FsSelectedServingId == 0) ||
                        (s.FSServingId == entry.FsSelectedServingId && entry.FtSelectedServingId == 0) ||
                        (s.ServingId == entry.FtSelectedServingId && entry.FsSelectedServingId != 0 && entry.FtSelectedServingId != 0)
                    ).SingleOrDefault();
                    if (serving != null)
                    {
                        if (entry.IsCompleted == true)
                        {
                            // Суммируем значения энергетической ценности уже потребленной еды.
                            consumedNInfo.Sum(serving, entry.FoodQty);
                            consumedMealsCount++;
                        }
                        else
                        {
                            // Суммируем значения энергетической ценности запланированной к потреблению еды.
                            plannedNInfo.Sum(serving, entry.FoodQty);
                            plannedMealsCount++;
                        }
                    }
                }
                
                #region __Округляем значения__
                // Consumed info.
                consumedNInfo.Round(2);
                // Planned info.
                plannedNInfo.Round(2);
                #endregion
            }

            return Request.CreateResponse(
                HttpStatusCode.OK, 
                new { 
                    consumedNInfo = consumedNInfo, 
                    plannedNInfo = plannedNInfo,
                    plannedMealsCount = plannedMealsCount,
                    consumedMealsCount = consumedMealsCount
                });
        }

        //
        // POST api/fooddiary/
        /// <summary>
        /// Метод сохранения записи дневника питания в БД.
        /// </summary>
        /// <param name="foodDiaryEntryDTO">Переданный объект с информацией о записи.</param>
        /// <returns>Data Transfer Object объект информации о записи, добавленной в БД.</returns>
        [HttpPost]
        [Route("")]
        public HttpResponseMessage Post([FromBody]FoodDiaryEntryDTO foodDiaryEntryDTO)
        {
            Food existingFood = null;
            var currentTime = TimeHelper.UnixMsNow;

            // Информация о создании
            foodDiaryEntryDTO.CreateUserId = currentUserId;
            foodDiaryEntryDTO.CreationTime = currentTime;

            try
            {
                var foodDiaryEntry = Mapper.Map<FoodDiaryEntry>(foodDiaryEntryDTO);

                // Если есть FSFoodId и нет FoodId (элемент может быть в БД)
                if ((foodDiaryEntry.Food.FoodId == 0) &&
                    (foodDiaryEntry.Food.FSFoodId != 0))
                {
                    // Проверяем есть ли уже в БД запис с FSFoodId
                    existingFood = unitOfWork.FoodRepository.Get(
                      f => f.FSFoodId.Equals(foodDiaryEntry.Food.FSFoodId),
                      null,
                      i => i.Servings).FirstOrDefault();

                    // Если есть, то не добавляем в БД
                    if (existingFood != null)
                    {
                        foodDiaryEntry.FoodId = existingFood.FoodId;
                        foodDiaryEntry.Food = existingFood;
                    }
                }
                else
                {
                    // Еда должна быть в БД
                    if (foodDiaryEntry.Food.FoodId != 0)
                    {
                        // Проверяем есть ли уже в БД запись с FoodId
                        existingFood = unitOfWork.FoodRepository.Get(
                          f => f.FoodId.Equals(foodDiaryEntry.Food.FoodId),
                          null,
                          i => i.Servings).FirstOrDefault();

                        // Если есть, то не добавляем в БД
                        if (existingFood != null)
                        {
                            foodDiaryEntry.FoodId = existingFood.FoodId;
                            foodDiaryEntry.Food = existingFood;
                        }
                    }
                }

                if (existingFood == null)
                {
                    // Заполняем незаполненные поля
                    if (foodDiaryEntry.Food.CreateUserId.HasValue == false ||
                        foodDiaryEntry.Food.CreateUserId.Value == 0)
                    {
                        foodDiaryEntry.Food.CreateUserId = currentUserId;
                    }
                    if (!TimeHelper.IsDateTimeSet(foodDiaryEntry.Food.CreationTime))
                    {
                        foodDiaryEntry.Food.CreationTime = TimeHelper.DateTimeUtcNow;
                    }

                    foreach (Serving serving in foodDiaryEntry.Food.Servings)
                    {
                        if (serving.CreateUserId == 0)
                        {
                            serving.CreateUserId = currentUserId;
                        }
                        if (!TimeHelper.IsDateTimeSet(serving.CreationTime))
                        {
                            serving.CreationTime = TimeHelper.DateTimeUtcNow;
                        }
                    }
                }

                // Добавляем запись в базу
                unitOfWork.FoodDiaryEntryRepository.Insert(foodDiaryEntry);
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                foodDiaryEntryDTO = Mapper.Map<FoodDiaryEntryDTO>(foodDiaryEntry);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<FoodDiaryEntryDTO>(HttpStatusCode.Created, foodDiaryEntryDTO);
        }

        // PUT api/fooddiary/5
        /// <summary>
        /// Метод обновления записи дневника питания.
        /// </summary>
        /// <param name="id">Идентификатор записи в дневнике питания.</param>
        /// <param name="foodDiaryEntryDTO">Переданный объект с информацией для обновления записи.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpPut]
        [Route("{id:long:min(1)}")]
        public HttpResponseMessage Put(long id, [FromBody]FoodDiaryEntryUpdateDTO foodDiaryEntryUpdateDTO)
        {
            if (id != foodDiaryEntryUpdateDTO.FoodDiaryEntryId)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.BadRequest));
            }

            try
            {
                // Выбираем запись из БД для обновления
                var foodDiaryEntry = unitOfWork.FoodDiaryEntryRepository.Get(
                  f =>
                    (f.CreateUserId == currentUserId &&
                    f.FoodDiaryEntryId == id),
                  null,
                  iF => iF.Food,
                  iS => iS.Food.Servings)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (foodDiaryEntry == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                foodDiaryEntry.FoodQty = foodDiaryEntryUpdateDTO.FoodQty;
                foodDiaryEntry.FsSelectedServingId = foodDiaryEntryUpdateDTO.FsSelectedServingId;
                foodDiaryEntry.FtSelectedServingId = foodDiaryEntryUpdateDTO.FtSelectedServingId;
                foodDiaryEntry.IsCompleted = foodDiaryEntryUpdateDTO.IsCompleted;

                // Обновляем запись
                unitOfWork.FoodDiaryEntryRepository.Update(foodDiaryEntry);
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                foodDiaryEntryUpdateDTO = Mapper.Map<FoodDiaryEntryUpdateDTO>(foodDiaryEntry);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<FoodDiaryEntryUpdateDTO>(HttpStatusCode.OK, foodDiaryEntryUpdateDTO);
        }

        // DELETE api/fooddiary/5
        /// <summary>
        /// Метод удаления записи дневника питания из БД.
        /// </summary>
        /// <param name="id">Идентификатор записи.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpDelete]
        [Route("{id:long:min(1)}")]
        public HttpResponseMessage Delete(long id)
        {
            FoodDiaryEntry foodDiaryEntry = null;
            try
            {
                // Выбираем запись с переданным идентификатором и созданную пользователем
                foodDiaryEntry = unitOfWork.FoodDiaryEntryRepository.Get(
                  f =>
                    (f.CreateUserId == currentUserId &&
                    f.FoodDiaryEntryId == id),
                  null)
                  .SingleOrDefault();

                // Записи нет в БД
                if (foodDiaryEntry == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                // Удаляем запись
                unitOfWork.FoodDiaryEntryRepository.Delete(foodDiaryEntry);
                unitOfWork.Save();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }
        #endregion
    }
}