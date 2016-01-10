using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace fitotrack.Models.Meal.DTO
{
  /// <summary>
  /// Data Transfer Object информации о еде. 
  /// </summary>
  public class FoodDTO : FoodBase
  {
	/// <summary>
	/// Класс списка порций. Сделан для совместимости с десериализацией JSON.Net.
	/// </summary>
	public class ServingList
	{
	  [JsonProperty("serving")]
	  public List<ServingDTO> Serving { get; set; }
	}

	[Required]
	[JsonProperty("servings")]
	public ServingList Servings { get; set; }

	//[Required]
	public long CreateUserId { get; set; }

	// В формате Unix Epoch
	public long CreationTime { get; set; }
	}
}