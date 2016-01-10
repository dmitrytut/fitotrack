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
  /// Data Transfer Object записи дневника о еде. 
  /// </summary>
  public class FoodDiaryEntryDTO
  {
	[Required]
	public long FoodDiaryEntryId { get; set; }

	[Required]
	[JsonProperty("food")]
	public FoodDTO FoodDTO { get; set; }

	//[Required]
	//[JsonProperty("selectedServing")]
	//public ServingDTO SelectedServingDTO { get; set; }

	[Required]
	[JsonProperty("fsSelectedServingId")]
	public long FsSelectedServingId { get; set; }

	[Required]
	[JsonProperty("ftSelectedServingId")]
	public long FtSelectedServingId { get; set; }

	[Required]
	public int MealTimeIndex { get; set; }

	[Required]
	public decimal FoodQty { get; set; }

	[Required]
	public bool IsCompleted { get; set; }

	[Required]
	public long Date { get; set; }

	[Required]
	public long CreateUserId { get; set; }

	// В формате Unix Epoch
	[Required]
	public long CreationTime { get; set; }
	}
}