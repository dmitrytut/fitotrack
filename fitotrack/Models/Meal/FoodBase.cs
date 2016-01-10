using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace fitotrack.Models.Meal
{
  /// <summary>
  /// Класс общей информации о еде.
  /// </summary>
  public class FoodBase
  {
    [Required]
    [JsonProperty("ft_food_id")]
    public long FoodId { get; set; }

    [JsonProperty("food_id")]
    public long FSFoodId { get; set; }

    [Required]
    [DataType(DataType.Text)]
    [StringLength(255)]
    [JsonProperty("food_name")]
    public string Title { get; set; }

    [Required]
    [DataType(DataType.Text)]
    [StringLength(32)]
    [JsonProperty("food_type")]
    public string Type { get; set; }

    [DataType(DataType.Text)]
    [StringLength(255)]
    [JsonProperty("brand_name")]
    public string BrandTitle { get; set; }

    [DataType(DataType.Text)]
    [StringLength(32)]
    public string BrandType { get; set; }
  }
}