using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace fitotrack.Helpers
{
  public static class JSONHelper
  {
    /// <summary>
    /// Метод нормализации JSON ответа функции food.get от сервера FatSecret. 
    /// </summary>
    /// <param name="json">JSON строка.</param>
    /// <returns>Нормализованная строка. Без ключа food в начале и с преобразованным к массиву 
    /// содержимом ключа 'food.servings.serving'.</returns>
    public static string FoodGetNormalize(string json)
    {
      var jObj = JObject.Parse(json);
      if (!(jObj["food"]["servings"]["serving"] is JArray))
      {
        jObj["food"]["servings"]["serving"] = new JArray(jObj["food"]["servings"]["serving"]);
      }
      return jObj["food"].ToString();
    }

    /// <summary>
    /// Метод нормализации JSON ответа функции foods.search от сервера FatSecret. 
    /// </summary>
    /// <param name="json">JSON строка.</param>
    /// <returns>Нормализованная строка. Без ключа foods в начале и с преобразованным к массиву 
    /// содержимом ключа 'foods.food'.</returns>
    public static string FoodsSearchNormalize(string json)
    {
      var jObj = JObject.Parse(json);
      if (!(jObj["foods"]["food"] is JArray))
      {
        jObj["foods"]["food"] = new JArray(jObj["foods"]["food"]);
      }
      return jObj["foods"].ToString();
    }

    /// <summary>
    /// Метод нормализации JSON ответа функции foods.autocomplete от сервера FatSecret. 
    /// </summary>
    /// <param name="json">JSON строка.</param>
    /// <returns>Нормализованная строка. Без ключа suggestions в начале и с преобразованным к массиву 
    /// содержимом ключа 'suggestions.suggestion'.</returns>
    public static string FoodsAutocompleteNormalize(string json)
    {
      var jObj = JObject.Parse(json);

      if (( jObj.Property("suggestions") == null ) || 
          ( jObj.Property("suggestions").Value.HasValues != true ))
      {
        jObj = JObject.Parse(@"{suggestions:{suggestion:[]}}");
      }
      else
      {
        if (!(jObj["suggestions"]["suggestion"] is JArray))
        {
          //Преобразовываем к массиву одиночные элементы (для последующей унификации)
          jObj["suggestions"]["suggestion"] = new JArray(jObj["suggestions"]["suggestion"]);
        }
      }

      return jObj["suggestions"].ToString();
    }
  }
}