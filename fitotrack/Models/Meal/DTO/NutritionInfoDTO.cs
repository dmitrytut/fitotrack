using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using fitotrack.Entity.Attributes;

namespace fitotrack.Models.Meal.DTO
{
  /// <summary>
  /// Data Transfer Object информации о потребленной энергетической ценности (БЖУ+калории). 
  /// </summary>
    public class NutritionInfoDTO
    {
        #region __Пищевая ценность__

        #region Основные параметры
        [Required]
        [PositiveDecimal]
        public decimal Kcal { get; set; }

        [Required]
        [PositiveDecimal]
        public decimal Carbohydrate { get; set; }

        [Required]
        [PositiveDecimal]
        public decimal Protein { get; set; }

        [Required]
        [PositiveDecimal]
        public decimal Fat { get; set; }
        #endregion

        #region Углеводы
        [PositiveDecimal]
        public decimal DietaryFiber { get; set; }

        [PositiveDecimal]
        public decimal Sugars { get; set; }
        #endregion

        #region Жиры
        [PositiveDecimal]
        public decimal SaturatedFat { get; set; }

        [PositiveDecimal]
        public decimal MonounsaturatedFat { get; set; }

        [PositiveDecimal]
        public decimal PolyunsaturatedFat { get; set; }

        [PositiveDecimal]
        public decimal TransFat { get; set; }
        #endregion

        #region Остальное

        [PositiveDecimal]
        public decimal Cholesterol { get; set; }

        [PositiveDecimal]
        public decimal Sodium { get; set; }

        [PositiveDecimal]
        public decimal Potassium { get; set; }

        [PositiveDecimal]
        public decimal Calcium { get; set; }

        [PositiveDecimal]
        public decimal Iron { get; set; }

        [PositiveDecimal]
        public decimal VitaminA { get; set; }

        [PositiveDecimal]
        public decimal VitaminC { get; set; }
        #endregion

        #endregion
    }
}