using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Attributes;
using fitotrack.Entity.Models;
using Newtonsoft.Json;

namespace fitotrack.Models.Meal.DTO
{
  /// <summary>
  /// Data Transfer Object порций еды.
  /// </summary>
  public class ServingDTO
  {
    [Required]
    [JsonProperty("ft_serving_id")]
    public long ServingId { get; set; }

    [Required]
    [DataType(DataType.Text)]
    [StringLength(255)]
    [JsonProperty("serving_description")]
    public string Description { get; set; }

    [JsonProperty("serving_id")]
    public long FSServingId { get; set; }

    #region __Измерение порции__
    [JsonProperty("metric_serving_amount")]
    [PositiveDecimal]
    public decimal MetricAmount { get; set; }

    [DataType(DataType.Text)]
    [StringLength(32)]
    [JsonProperty("metric_serving_unit")]
    public string MetricUnit { get; set; }

    [Required]
    [PositiveDecimal]
    [JsonProperty("number_of_units")]
    public decimal UnitsNumber { get; set; }

    [Required]
    [DataType(DataType.Text)]
    [StringLength(255)]
    [JsonProperty("measurement_description")]
    public string MeasurementDescription { get; set; }
    #endregion

    #region __Пищевая ценность__

    #region Основные параметры
    [Required]
    [PositiveDecimal]
    [JsonProperty("calories")]
    public decimal? KCal { get; set; }

    [Required]
    [PositiveDecimal]
    [JsonProperty("carbohydrate")]
    public decimal Carbohydrate { get; set; }

    [Required]
    [PositiveDecimal]
    [JsonProperty("protein")]
    public decimal Protein { get; set; }

    [Required]
    [PositiveDecimal]
    [JsonProperty("fat")]
    public decimal Fat { get; set; }
    #endregion

    #region Углеводы
    [PositiveDecimal]
    [JsonProperty("fiber")]
    public decimal DietaryFiber { get; set; }

    [PositiveDecimal]
    [JsonProperty("sugar")]
    public decimal Sugars { get; set; }
    #endregion

    #region Жиры
    [PositiveDecimal]
    [JsonProperty("saturated_fat")]
    public decimal SaturatedFat { get; set; }

    [PositiveDecimal]
    [JsonProperty("monounsaturated_fat")]
    public decimal MonounsaturatedFat { get; set; }

    [PositiveDecimal]
    [JsonProperty("polyunsaturated_fat")]
    public decimal PolyunsaturatedFat { get; set; }

    [PositiveDecimal]
    [JsonProperty("trans_fat")]
    public decimal TransFat { get; set; }
    #endregion

    #region Остальное

    [PositiveDecimal]
    [JsonProperty("cholesterol")]
    public decimal Cholesterol { get; set; }

    [PositiveDecimal]
    [JsonProperty("sodium")]
    public decimal Sodium { get; set; }

    [PositiveDecimal]
    [JsonProperty("potassium")]
    public decimal Potassium { get; set; }

    [PositiveDecimal]
    [JsonProperty("calcium")]
    public decimal Calcium { get; set; }

    [PositiveDecimal]
    [JsonProperty("iron")]
    public decimal Iron { get; set; }

    [PositiveDecimal]
    [JsonProperty("vitamin_a")]
    public decimal VitaminA { get; set; }

    [PositiveDecimal]
    [JsonProperty("vitamin_c")]
    public decimal VitaminC { get; set; }
    #endregion

    #endregion

    [Required]
    [JsonProperty("create_user")]
    public decimal CreateUserId { get; set; }

    // В формате Unix Epoch
    [JsonProperty("creation_time")]
    public long CreationTime { get; set; }
  }
}