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
using Microsoft.AspNet.Identity;
using fitotrack.Models.Common.DTO;

namespace fitotrack.Controllers
{
    /// <summary>
    /// Контроллер питания.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/food")]
    [Filters.ExceptionHandler]
    public class FoodController : ApiController
    {
        private UnitOfWork unitOfWork = new UnitOfWork();
        private int currentUserId = HttpContext.Current.User.Identity.GetUserId<int>();

        #region __native food actions__
        //
        // GET api/food/
        /// <summary>
        /// Метод возвращает информацию о еде из БД постранично.
        /// </summary>
        /// <returns>Список информации о еде в формате объекта FoodDTO.</returns>
        [HttpGet]
        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.NotImplemented);

            //TODO Добавить страницы.
            //var foods = unitOfWork.FoodRepository.Get().Take(30);

            //if (foods == null || foods.Count().Equals(0) )
            //  throw new HttpResponseException(HttpStatusCode.NotFound);

            //var foodDTO = Mapper.Map<IEnumerable<FoodDTO>>(foods);

            //return Request.CreateResponse<IEnumerable<FoodDTO>>(HttpStatusCode.OK, foodDTO);
        }

        //
        // GET api/food/5
        /// <summary>
        /// Метод получения еды из БД.
        /// </summary>
        /// <param name="id">Идентификатор еды.</param>
        /// <returns>Данные о еде в формате объекта FoodDTO или ошибку.</returns>
        [HttpGet]
        [Route("{id:long:min(1)}")]
        public HttpResponseMessage Get(long id)
        {
            var food = unitOfWork.FoodRepository.Get(
                p => p.FoodId == id,
                null,
                s => s.Servings)
                .SingleOrDefault();

            //Еды нет в БД FT
            if (food == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            var foodDTO = Mapper.Map<FoodDTO>(food);

            return Request.CreateResponse<FoodDTO>(HttpStatusCode.OK, foodDTO);
        }

        //
        // POST api/food/
        /// <summary>
        /// Метод добавления еды в БД.
        /// </summary>
        /// <param name="foodDTO">Переданный объект с информацией о еде.</param>
        /// <returns>Data Transfer Object объект информации о еде, добавленный в БД.</returns>
        [HttpPost]
        public HttpResponseMessage Post([FromBody]FoodDTO foodDTO)
        {
            var currentTime = TimeHelper.UnixMsNow;

            foodDTO.CreateUserId = currentUserId;
            foodDTO.CreationTime = currentTime;

            foreach (ServingDTO serving in foodDTO.Servings.Serving)
            {
                serving.CreateUserId = currentUserId;
                serving.CreationTime = currentTime;
            }

            try
            {

                var food = Mapper.Map<Food>(foodDTO);

                unitOfWork.FoodRepository.Insert(food);
                unitOfWork.Save();

                //Преобразовываем обратно, чтобы вернуть клиенту
                foodDTO = Mapper.Map<FoodDTO>(food);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
            //response.Headers.Location = new Uri("/api/food/" + foodDTO.foodId);

            return Request.CreateResponse(HttpStatusCode.Created, foodDTO);
        }

        #endregion


        //
        // GET api/food/GetFsFood/5
        /// <summary>
        /// Метод получения еды по идентификатору с сервера FatSecret.
        /// </summary>
        /// <param name="id">Идентификатор еды.</param>
        /// <returns>Данные о еде в формате объекта FoodDTO или ошибку.</returns>
        [HttpGet]
        [Route("getfsfood/{id:long:min(1)}")]
        public HttpResponseMessage GetFsFood(long id)
        {
            //Запрашиваем информацию о продукте у FatSecret
            FatSecretAPI fsApi = new FatSecretAPI();
            string fsFood = fsApi.GetFood(id);

            if (fsFood.IndexOf("error") != -1)
            {
                #region __Error__
                //Если ошибка, то десериализуем в объект FSError
                var err = Newtonsoft.Json.JsonConvert.DeserializeObject<FatSecretAPI.FSError>(fsFood);

                //Если ошибка - отсутствует ID
                if (err.error.code.Equals(FatSecretAPI.FSError.INVALID_ID))
                {
                    //то выбрасываем 404
                    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
                }
                else
                {
                    //иначе выбрасываем исключение с кодом и сообщением ошибки
                    throw new FatSecretException(Int16.Parse(err.error.code), err.error.message);
                }
                #endregion
            }

            var foodDTO = JsonConvert.DeserializeObject<FoodDTO>(fitotrack.Helpers.JSONHelper.FoodGetNormalize(fsFood));

            return Request.CreateResponse<FoodDTO>(HttpStatusCode.OK, foodDTO);
        }

        //
        // GET api/food/search/q
        /// <summary>
        /// Метод поиска продуктов.
        /// </summary>
        /// <param name="searchParams">Объект поисковой информации.</param>
        /// <returns>Если совпадения есть, то список продуктов. Если нет - пустой список.</returns>
        [HttpGet]
        [Route("search")]
        public HttpResponseMessage Search([FromUri]SearchDTO searchParams)
        {
            SearchResults searchResults = new SearchResults();
            if (searchParams.q != null)
            {

                //if ((q == null) ||
                //    (q.Length < queryMinLength))
                //{
                //  throw new HttpResponseException(
                //    Request.CreateResponse( HttpStatusCode.BadRequest,
                //      "Search query length must be at least " + queryMinLength + " characters." )
                //  );
                //}

                //if (pageSize>50)
                //  pageSize = 50;

                //Ищем на FatSecret
                FatSecretAPI fsApi = new FatSecretAPI();
                string fsSearchResults = fsApi.SearchFood(searchParams.q, searchParams.pn, searchParams.ps);

                if (fsSearchResults.IndexOf("error") != -1)
                {
                    #region __Error__
                    //Если ошибка, то десериализуем в объект FSError
                    var err = Newtonsoft.Json.JsonConvert.DeserializeObject<FatSecretAPI.FSError>(fsSearchResults);
                    //иначе выбрасываем исключение с кодом и сообщением ошибки
                    throw new FatSecretException(Int16.Parse(err.error.code), err.error.message);
                    #endregion
                }

                searchResults = JsonConvert.DeserializeObject<SearchResults>(fitotrack.Helpers.JSONHelper.FoodsSearchNormalize(fsSearchResults));

                //TODO Выборка из БД FitoTrack

                #region __old stuff__
                //var query = unitOfWork.FoodRepository.
                //  Get(p => p.Title.Contains(q), null).Where(p=>(p.FSFoodId.Equals(0) || p.FSFoodId == null));
                //var results = query.Skip(page * pageSize).Take(pageSize);
                //if (results != null)
                //{
                //  if (query.Count() > (pageSize * (page + 1)))
                //  {
                //    hasMore = true;
                //  }
                //  resultsDTO = Mapper.Map<IEnumerable<ProductDTO>>(results);
                //}

                //var query = unitOfWork.ProductRepository.
                //  Get(p => p.Title.Contains(q), null);

                //var results = query.Skip(page * pageSize).Take(pageSize);

                //if (results != null)
                //{
                //  if (query.Count() > (pageSize * (page + 1)))
                //  {
                //    hasMore = true;
                //  }
                //  resultsDTO = Mapper.Map<IEnumerable<ProductDTO>>(results);
                //}

                //var obj = new Dictionary<string, object> { 
                //  { "results", resultsDTO }, 
                //  { "hasMore", hasMore } 
                //};

                //return Request.CreateResponse<Dictionary<string, object>>(HttpStatusCode.OK, obj);
                #endregion
            }
            return Request.CreateResponse<SearchResults>(HttpStatusCode.OK, searchResults);
        }

        //
        // GET api/food/autocomplete/q
        /// <summary>
        /// Метод поиска продуктов.
        /// </summary>
        /// <param name="q">Поисковый запрос.</param>
        /// <returns>Строка с результатами. 
        /// Формат JSON:
        ///   suggestion:
        ///     [Array of suggestions]
        /// </returns>
        [HttpGet]
        [Route("autocomplete/{q}")]
        public HttpResponseMessage Autocomplete(string q)
        {
            if (q == null)
            {
                return null;
            }

            //Запрос на FatSecret
            FatSecretAPI fsApi = new FatSecretAPI();
            string fsAutocompleteResults = fsApi.AutocompleteFood(q);

            if (fsAutocompleteResults.IndexOf("error") != -1)
            {
                // Не выкидываем ошибку, а просто логируем ее во внутреннем журнале возвращая пустой результат

                //TODO Логировать ошибку

                //#region __Error__
                ////Если ошибка, то десериализуем в объект FSError
                //var err = Newtonsoft.Json.JsonConvert.DeserializeObject<FatSecretAPI.FSError>(fsAutocompleteResults);
                ////иначе выбрасываем исключение с кодом и сообщением ошибки
                //throw new FatSecretException(Int16.Parse(err.error.code), err.error.message);
                //#endregion
            }

            object results = JsonConvert.DeserializeObject(fitotrack.Helpers.JSONHelper.FoodsAutocompleteNormalize(fsAutocompleteResults));

            //TODO Возможная выборка из БД

            return Request.CreateResponse(HttpStatusCode.OK, results);
        }
    }
}