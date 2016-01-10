using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace fitotrack.Models.Meal
{
  /// <summary>
  /// Класс результатов поиска еды. 
  /// </summary>
  public class SearchResults
  {
	public class FoodBaseInfo : FoodBase
	{
	  [JsonProperty("food_description")]
	  [DataType(DataType.Text), StringLength(200)]
	  public string FoodDescription { get; set; }
	}
	[JsonProperty("food")]
	public List<FoodBaseInfo> FoodInfo { get; set; }

	[JsonProperty("max_results")]
	public int PageSize { get; set; }
	[JsonProperty("page_number")]
	public int PageNum { get; set; }
	[JsonProperty("total_results")]
	public int TotalResults { get; set; }
	}
}