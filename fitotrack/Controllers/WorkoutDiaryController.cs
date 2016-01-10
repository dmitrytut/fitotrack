using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using fatsecret.platform;
using fitotrack.Models.Workout.DTO;
using fitotrack.Repository.Services;
using Newtonsoft.Json;
using fitotrack.Entity.Models;
using fitotrack.Helpers;
using Microsoft.AspNet.Identity;
using System.Data.Objects;
using System.Data.Entity;

namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер дневника упражнений.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/workoutdiary")]
    [Filters.ExceptionHandler]
    public class WorkoutDiaryController : ApiController
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

        #region __CRUD__
        //
        // GET api/workoutdiary/5
        /// <summary>
        /// Метод получения записи дневника упражнения по идентификатору из БД.
        /// </summary>
        /// <param name="id">Идентификатор записи дневника упражнения.</param>
        /// <returns>Запись дневника упражнения в формате объекта WorkoutDiaryEntryDTO.</returns>
        [HttpGet]
        [Route("{id:int:min(1)}")]
        public HttpResponseMessage Get(int id)
        {
            // Получаем данные о записи из БД
            var workoutDiaryEntry = unitOfWork.WorkoutDiaryEntryRepository.Get(
              f => (f.CreateUserId == currentUserId &&
                     f.WorkoutDiaryEntryId == id),
              null,
              iE => iE.Exercise,
              iES => iES.Sets
            ).SingleOrDefault();

            // Записи нет в БД FT
            if (workoutDiaryEntry == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var workoutDiaryEntryDTO = Mapper.Map<WorkoutDiaryEntryDTO>(workoutDiaryEntry);

            return Request.CreateResponse<WorkoutDiaryEntryDTO>(HttpStatusCode.OK, workoutDiaryEntryDTO);
        }

        //
        // GET api/workoutdiary/date/1392128524124
        /// <summary>
        /// Метод получения записей дневника упражнения на определенный день из БД.
        /// </summary>
        /// <param name="date">Дата в формате Unix Epoch Milliseconds.</param>
        /// <returns>Список записей дневника упражнений в формате объекта WorkoutDiaryEntryDTO.</returns>
        [HttpGet]
        [Route("date/{date:long:min(1)}")]
        public HttpResponseMessage GetByDate(long date)
        {
            // Получаем смещение времени пользователя
            int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);
            var zonedDateTime = TimeHelper.ConvertFromUtc(TimeHelper.FromUnixMsToDateTime(date), timezoneOffset);
            var zonedDate = zonedDateTime.Date;

            var workoutDiaryEntries = unitOfWork.WorkoutDiaryEntryRepository.Get(
              f => (f.CreateUserId == currentUserId &&
                    DbFunctions.DiffDays(
                  // Выбрасываем время, оставляем только дату
                      DbFunctions.TruncateTime(
                  // Добавляем смещение временной зоны пользователя, получаем время из БД в часовом формате пользователя
                        DbFunctions.AddMinutes(f.DateUTC, timezoneOffset)
                     ),
                     zonedDate) == 0),
              null,
              iE => iE.Exercise,
              iES => iES.Sets
            );

            // Преобразовываем в DTO-объект для ответа
            var workoutDiaryEntryDTO = Mapper.Map<IEnumerable<WorkoutDiaryEntryDTO>>(workoutDiaryEntries);

            return Request.CreateResponse<IEnumerable<WorkoutDiaryEntryDTO>>(HttpStatusCode.OK, workoutDiaryEntryDTO);
        }

        //
        // POST api/workoutdiary/
        /// <summary>
        /// Метод сохранения записи дневника упражнений в БД.
        /// </summary>
        /// <param name="workoutDiaryEntryDTO">Переданный объект с информацией о записи.</param>
        /// <returns>Data Transfer Object объект информации о записи, добавленной в БД.</returns>
        [HttpPost]
        [Route("")]
        public HttpResponseMessage Post([FromBody]WorkoutDiaryEntryDTO workoutDiaryEntryDTO)
        {
            var currentTime = TimeHelper.UnixMsNow;

            // Информация о создании
            workoutDiaryEntryDTO.CreateUserId = currentUserId;
            workoutDiaryEntryDTO.CreationInfo.CreationTime =
                workoutDiaryEntryDTO.CreationInfo.LastModifiedTime = currentTime;

            try
            {
                var workoutDiaryEntry = Mapper.Map<WorkoutDiaryEntry>(workoutDiaryEntryDTO);

                // Для избежания повторного добавления упражнения - 
                // обнуляем его (сохраняя во временной переменной)и 
                // выставляем индекс упражнения в записи
                Exercise tempExercise = null;
                if (workoutDiaryEntry.Exercise != null)
                {
                    // Запоминаем упражнение
                    tempExercise = workoutDiaryEntry.Exercise;
                    // Устанавлиавем идентификатор упражнения
                    workoutDiaryEntry.ExerciseId = workoutDiaryEntry.Exercise.ExerciseId;

                    #region __Подсчитываем количество сожженных калорий__
                    if (workoutDiaryEntry.Exercise.MET.HasValue && workoutDiaryEntry.Exercise.MET.Value != 0)
                    {
                        var setsDuration = workoutDiaryEntry.Sets.Select(s=>s.Duration).Sum();
                        if (setsDuration > 0)
                        {
                            // Получаем информацию о пользователе для подсчета сожженных калорий (вес, возраст)
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

                            if (userProfile.Weights.Any())
                            {
                                var weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
                                if (weight > 0)
                                {
                                    workoutDiaryEntry.BurnedCalories = 
                                        WorkoutHelper.GetBurnedCalories(workoutDiaryEntry.Exercise.MET.Value, weight, setsDuration);
                                }
                            }
                        }
                    }
                    #endregion

                    // Обнуляем упражнение, чтобы не обновлялось в БД
                    workoutDiaryEntry.Exercise = null;
                }

                // Добавляем запись в базу
                unitOfWork.WorkoutDiaryEntryRepository.Insert(workoutDiaryEntry);
                unitOfWork.Save();

                // Восстанавливаем упражение, чтобы вернуть клиенту
                if (tempExercise != null)
                {
                    workoutDiaryEntry.Exercise = tempExercise;
                }
                // Преобразовываем обратно, чтобы вернуть клиенту
                workoutDiaryEntryDTO = Mapper.Map<WorkoutDiaryEntryDTO>(workoutDiaryEntry);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<WorkoutDiaryEntryDTO>(HttpStatusCode.Created, workoutDiaryEntryDTO);
        }

        //
        // PUT api/workoutdiary/5
        /// <summary>
        /// Метод обновления записи дневника упражнений.
        /// </summary>
        /// <param name="workoutDiaryEntryDTO">Переданный объект с информацией для обновления записи.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpPut]
        [Route("{id:long:min(1)}")]
        public HttpResponseMessage Put([FromBody]WorkoutDiaryEntryDTO workoutDiaryEntryDTO)
        {
            try
            {
                // Выбираем запись из БД для обновления
                var workoutDiaryEntry = unitOfWork.WorkoutDiaryEntryRepository.Get(
                  f =>
                    (f.CreateUserId == currentUserId &&
                    f.WorkoutDiaryEntryId == workoutDiaryEntryDTO.WorkoutDiaryEntryId),
                  null,
                  iE => iE.Exercise,
                  iS => iS.Sets)
                  .SingleOrDefault();

                // Записи нет в БД FT
                if (workoutDiaryEntry == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                var workoutDiaryEntryUpdateObj = Mapper.Map<WorkoutDiaryEntry>(workoutDiaryEntryDTO);
                foreach (WorkoutSet newSet in workoutDiaryEntryUpdateObj.Sets)
                {
                    var oldSet = workoutDiaryEntry.Sets.Where(
                        i => i.WorkoutSetId == newSet.WorkoutSetId)
                        .SingleOrDefault();
                    if (oldSet == null)
                    {
                        // Сета нет в БД. Добавляем.
                        unitOfWork.WorkoutSetRepository.Insert(new WorkoutSet
                        {
                            Duration = newSet.Duration,
                            Distance = newSet.Distance,
                            IsCompleted = newSet.IsCompleted,
                            Order = newSet.Order,
                            Reps = newSet.Reps,
                            Rest = newSet.Rest,
                            Weight = newSet.Weight,
                            WorkoutDiaryEntryId = workoutDiaryEntry.WorkoutDiaryEntryId
                        });
                    }
                    else
                    {
                        // Сет есть в БД. Обновляем.
                        oldSet.Distance = newSet.Distance;
                        oldSet.Duration = newSet.Duration;
                        oldSet.IsCompleted = newSet.IsCompleted;
                        oldSet.Order = newSet.Order;
                        oldSet.Reps = newSet.Reps;
                        oldSet.Rest = newSet.Rest;
                        oldSet.Weight = newSet.Weight;
                    }
                }
                workoutDiaryEntry.DateUTC = workoutDiaryEntryUpdateObj.DateUTC;

                #region __Подсчитываем количество сожженных калорий__
                if (workoutDiaryEntry.Exercise.MET.HasValue && workoutDiaryEntry.Exercise.MET.Value != 0)
                {
                    var setsDuration = workoutDiaryEntry.Sets.Select(s => s.Duration).Sum();
                    if (setsDuration > 0)
                    {
                        // Получаем информацию о пользователе для подсчета сожженных калорий (вес, возраст)
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

                        if (userProfile.Weights.Any())
                        {
                            var weight = userProfile.Weights.OrderByDescending(d => d.Date).First().Weight;
                            if (weight > 0)
                            {
                                workoutDiaryEntry.BurnedCalories =
                                    WorkoutHelper.GetBurnedCalories(workoutDiaryEntry.Exercise.MET.Value, weight, setsDuration);
                            }
                        }
                    }
                }
                #endregion

                // Информация о изменении
                workoutDiaryEntry.CreationInfo.LastModifiedTimeUTC = TimeHelper.DateTimeUtcNow;

                // Обновляем запись
                unitOfWork.WorkoutDiaryEntryRepository.Update(workoutDiaryEntry);
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                workoutDiaryEntryDTO = Mapper.Map<WorkoutDiaryEntryDTO>(workoutDiaryEntry);
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                // Retrieve the error messages as a list of strings.
                var errorMessages = ex.EntityValidationErrors
                        .SelectMany(x => x.ValidationErrors)
                        .Select(x => x.ErrorMessage);
                // Join the list to a single string.
                var fullErrorMessage = string.Join("; ", errorMessages);

                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError));
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse<WorkoutDiaryEntryDTO>(HttpStatusCode.OK, workoutDiaryEntryDTO);
        }

        // DELETE api/workoutdiary/5
        /// <summary>
        /// Метод удаления записи дневника упражнений из БД.
        /// </summary>
        /// <param name="id">Идентификатор записи.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpDelete]
        [Route("{id:long:min(1)}")]
        public HttpResponseMessage Delete(long id)
        {
            try
            {
                // Выбираем запись с переданным идентификатором и созданную пользователем
                WorkoutDiaryEntry workoutDiaryEntry = unitOfWork.WorkoutDiaryEntryRepository.Get(
                  f => (f.CreateUserId == currentUserId && f.WorkoutDiaryEntryId == id),
                  null)
                  .SingleOrDefault();

                // Записи нет в БД
                if (workoutDiaryEntry == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }

                // Удаляем запись
                unitOfWork.WorkoutDiaryEntryRepository.Delete(workoutDiaryEntry);
                unitOfWork.Save();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }
        #endregion

        #region __Methods__
        // DELETE api/workoutdiary/set/5
        /// <summary>
        /// Метод удаления сета упражнения из БД.
        /// </summary>
        /// <param name="id">Идентификатор сета.</param>
        /// <returns>Статус выполнения операции.</returns>
        [HttpDelete]
        [Route("set/{id:long:min(1)}")]
        public HttpResponseMessage DeleteWorkoutSet(long id)
        {
            try
            {
                // Выбираем сет с переданным идентификатором и созданный пользователем
                WorkoutSet workoutSet = unitOfWork.WorkoutSetRepository.Get(
                  f => (f.WorkoutSetId == id && f.WorkoutDiaryEntry.CreateUserId == currentUserId),
                  null,
                  iW => iW.WorkoutDiaryEntry,
                  iE => iE.WorkoutDiaryEntry.Exercise)
                  .SingleOrDefault();

                // Записи нет в БД
                if (workoutSet == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }
                //WorkoutSet workoutSet = unitOfWork..Get(
                //  f => (f.WorkoutSetId == id && f.WorkoutDiaryEntry.CreateUserId == currentUserId),
                //  null)
                //  .SingleOrDefault();
                workoutSet.WorkoutDiaryEntry.CreationInfo.LastModifiedTimeUTC = TimeHelper.DateTimeUtcNow;
                // Удаляем запись
                unitOfWork.WorkoutSetRepository.Delete(workoutSet);
                // Меняем значение последнего редактирования родительской записи

                unitOfWork.Save();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        //
        // GET api/workoutdiary/burnedcalories/1392128524124
        /// <summary>
        /// Метод получения значение сожженных калорий на определенный день из БД.
        /// </summary>
        /// <param name="date">Дата в формате Unix Epoch Milliseconds.</param>
        /// <returns>Значение сожженных калорий на определенный день.</returns>
        [HttpGet]
        [Route("burnedcalories/{date:long:min(1)}")]
        public HttpResponseMessage GetBurnedCalories(long date)
        {
            // Получаем смещение времени пользователя
            int timezoneOffset = RequestHelper.GetTimezoneOffset(Request);
            var zonedDateTime = TimeHelper.ConvertFromUtc(TimeHelper.FromUnixMsToDateTime(date), timezoneOffset);
            var zonedDate = zonedDateTime.Date;

            var workoutDiaryEntries = unitOfWork.WorkoutDiaryEntryRepository.Get(
              f => (f.CreateUserId == currentUserId &&
                    DbFunctions.DiffDays(
                  // Выбрасываем время, оставляем только дату
                      DbFunctions.TruncateTime(
                  // Добавляем смещение временной зоны пользователя, получаем время из БД в часовом формате пользователя
                        DbFunctions.AddMinutes(f.DateUTC, timezoneOffset)
                     ),
                     zonedDate) == 0),
              null,
              iE => iE.Exercise,
              iES => iES.Sets
            );

            decimal burnedCalories = 0;

            if (workoutDiaryEntries != null &&
                workoutDiaryEntries.Count() > 0)
            {
                burnedCalories = workoutDiaryEntries.Select(s => s.BurnedCalories).Sum();
            }
            
            return Request.CreateResponse(HttpStatusCode.OK, Helpers.Utilities.RoundAFZ(burnedCalories));
        }

        //
        // GET api/workoutdiary/popularexercises
        /// <summary>
        /// Метод получения наиболее выполняемых упражнений.
        /// </summary>
        /// <returns>Список наиболее выполняемых упражнений в формате ExerciseDTO.</returns>
        [HttpGet]
        [Route("popularexercises")]
        public HttpResponseMessage GetPopularExercises()
        {
            // Получаем 10 самых популярных упражнений, добавленных в дневник.
            var popularExercises = unitOfWork.WorkoutDiaryEntryRepository.Get(
              wd => (wd.CreateUserId == currentUserId),
              null,
              iE => iE.Exercise,
              iES => iES.Sets
            )
            .GroupBy(e => e.Exercise.ExerciseId)
            .OrderByDescending(e => e.Count())
            .Take(10)
            .ToDictionary(e => e.Key, e => e.FirstOrDefault())
            .Select(e => e.Value.Exercise)
            .ToList();

            IEnumerable<ExerciseDTO> popularExercisesDTO = null;

            if (popularExercises.Count() > 0)
            {
                popularExercisesDTO = Mapper.Map<IEnumerable<ExerciseDTO>>(popularExercises);
            }

            return Request.CreateResponse<IEnumerable<ExerciseDTO>>(HttpStatusCode.OK, popularExercisesDTO);
        }

        //
        // GET api/workoutdiary/recentexercises
        /// <summary>
        /// Метод получения недавно выполненных упражнений.
        /// </summary>
        /// <returns>Список недавно выполненных упражнений в формате ExerciseDTO.</returns>
        [HttpGet]
        [Route("recentexercises")]
        public HttpResponseMessage GetRecentExercises()
        {
            // Получаем 10 уникальных недавно выполненных упражений, добавленных в дневник.
            var recentExercises = unitOfWork.WorkoutDiaryEntryRepository.Get(
              fd => (fd.CreateUserId == currentUserId),
              null,
              iE => iE.Exercise,
              iES => iES.Sets
            )
            .GroupBy(e => e.Exercise.ExerciseId)
            .Select(e => e.OrderByDescending(t => t.CreationInfo.CreationTimeUTC).FirstOrDefault())
            .OrderByDescending(e => e.CreationInfo.CreationTimeUTC)
            .Take(10)
            .Select(e => e.Exercise)
            .ToList();

            IEnumerable<ExerciseDTO> recentExercisesDTO = null;

            if (recentExercises.Count() > 0)
            {
                recentExercisesDTO = Mapper.Map<IEnumerable<ExerciseDTO>>(recentExercises);
            }

            return Request.CreateResponse<IEnumerable<ExerciseDTO>>(HttpStatusCode.OK, recentExercisesDTO);
        }
        #endregion
    }
}