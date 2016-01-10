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
using fitotrack.Models.Common;
using fitotrack.Models.Meal;
using fitotrack.Models.Common.DTO;

namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер упражнений.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/exercise")]
    [Filters.ExceptionHandler]
    public class ExerciseController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        private int currentUserId = HttpContext.Current.User.Identity.GetUserId<int>();
        
        #region __CRUD__
        //
        // GET api/exercise/
        /// <summary>
        /// Метод возвращает информацию об упражнениях из БД постранично.
        /// </summary>
        /// <returns>Список объектов ExerciseDTO информации об упражнениях.</returns>
        [HttpGet]
        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);
        }

        //
        // GET api/exercise/5
        /// <summary>
        /// Метод получения упражнения по идентификатору из БД.
        /// </summary>
        /// <param name="id">Идентификатор упражнения.</param>
        /// <returns>Данные об упражнении в формате ExerciseDTO.</returns>
        [HttpGet]
        [Route("{id:int:min(1)}")]
        public HttpResponseMessage Get(int id)
        {
            var exercise = unitOfWork.ExerciseRepository.Get(
                p => p.ExerciseId == id,
                null,
                i => i.MainMuscles,
                //i => i.OtherMuscles,
                i => i.Steps,
                i => i.Equipment)
                .SingleOrDefault();

            //Упражнения нет в БД FT
            if (exercise == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var exerciseDTO = Mapper.Map<ExerciseDTO>(exercise);

            return Request.CreateResponse<ExerciseDTO>(HttpStatusCode.OK, exerciseDTO);
        }

        //
        // POST api/exercise/
        /// <summary>
        /// Метод добавления упражнения в БД.
        /// </summary>
        /// <param name="exerciseDTO">Переданный объект с информацией об упражнении.</param>
        /// <returns>ExerciseDTO объект информации об упражнении, добавленный в БД.</returns>
        [HttpPost]
        public HttpResponseMessage Post([FromBody]ExerciseDTO exerciseDTO)
        {
            var currentTime = TimeHelper.UnixMsUTCNow;

            exerciseDTO.CreateUserId = currentUserId;
            exerciseDTO.CreationInfo.CreationTime = 
                exerciseDTO.CreationInfo.LastModifiedTime = currentTime;

            //foreach (ExerciseStepDTO step in exerciseDTO.Steps)
            //{
            //    step.ExerciseId = exerciseDTO.ExerciseId;
            //}

            try
            {
                var exercise = Mapper.Map<Exercise>(exerciseDTO);

                unitOfWork.ExerciseRepository.Insert(exercise);
                unitOfWork.Save();

                //Преобразовываем обратно в DTO, чтобы вернуть клиенту.
                exerciseDTO = Mapper.Map<ExerciseDTO>(exercise);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }

            return Request.CreateResponse(HttpStatusCode.Created, exerciseDTO);
        }

        // PUT api/exercise
        /// <summary>
        /// Метод обновления информации об упражнении.
        /// </summary>
        /// <param name="exerciseDTO">Переданный объект с информацией для обновления упражнения.</param>
        /// <returns>ExerciseDTO объект информации об измененном упражнении.</returns>
        [HttpPut]
        public HttpResponseMessage Put([FromBody]ExerciseDTO exerciseDTO)
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);
        }

        // DELETE api/exercise
        /// <summary>
        /// Метод удаления упражнения из БД.
        /// </summary>
        /// <returns>Статус выполнения операции.</returns>
        [HttpDelete]
        public HttpResponseMessage Delete()
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);
        }

        #endregion

        #region __Other methods__
        //
        // GET api/exercise/search/q
        /// <summary>
        /// Метод поиска упражнений.
        /// </summary>
        /// <param name="searchParams">Объект информации о поисковом запросе.</param>
        /// <returns>Список найденных упражнений.</returns>
        [HttpGet]
        [Route("search")]
        public HttpResponseMessage Search([FromUri]SearchDTO searchParams)
        {
            ExerciseSearchResults searchResults = new ExerciseSearchResults();
            if (!String.IsNullOrEmpty(searchParams.q))
            {
                var exercises = unitOfWork.ExerciseRepository
                    .Get(e => e.Title.ToUpper().Contains(searchParams.q.ToUpper()), null);

                var totalResults = exercises.Count();

                exercises = exercises.Skip(searchParams.pn * searchParams.ps).Take(searchParams.ps);

                searchResults.Results = Mapper.Map<IEnumerable<ExerciseDTO>>(exercises);
                searchResults.PageIndex = searchParams.pn;
                searchResults.PageSize = searchParams.ps;
                searchResults.TotalResults = totalResults;
            }
            return Request.CreateResponse<ExerciseSearchResults>(HttpStatusCode.OK, searchResults);
        }

        //
        // GET api/exercise/autocomplete/q
        /// <summary>
        /// Метод поиска имен упражнений для автоподстановки.
        /// </summary>
        /// <param name="q">Поисковый запрос.</param>
        /// <param name="pageSize">Количество выдаваемых результатов. От 1 до 30. По умолчанию: 10.</param>
        /// <returns>Список найденных имен упражнений.</returns>
        [HttpGet]
        [Route("autocomplete/{q}/{pageSize:int:range(1,30)?}")]
        public HttpResponseMessage Autocomplete(string q, int pageSize = 10)
        {
            const int maxPageSize = 30;

            if (String.IsNullOrEmpty(q))
            {
                return Request.CreateResponse<JSONError>(HttpStatusCode.OK, null);
            }

            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var exercises = unitOfWork.ExerciseRepository
                .Get(e => e.Title.ToUpper().Contains(q.ToUpper()), null)
                .OrderByDescending(o => o.Title.ToUpper().StartsWith(q.ToUpper()))
                .Take(pageSize);

            var results = from e in exercises
                          select e.Title;

            return Request.CreateResponse(HttpStatusCode.OK, new { suggestion = results });
        }
        #endregion
    }
}