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
  /// Data Transfer Object обновления для записи дневника о еде. 
  /// </summary>
  public class FoodDiaryEntryUpdateDTO
  {
	[Required]
	public long FoodDiaryEntryId { get; set; }

	[Required]
	[JsonProperty("fsSelectedServingId")]
	public long FsSelectedServingId { get; set; }

	[Required]
	[JsonProperty("ftSelectedServingId")]
	public long FtSelectedServingId { get; set; }

	[Required]
	public decimal FoodQty { get; set; }

	[Required]
	public bool IsCompleted { get; set; }
	}
}