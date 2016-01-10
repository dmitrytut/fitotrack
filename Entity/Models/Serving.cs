using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using fitotrack.Entity.Attributes;


namespace fitotrack.Entity.Models
{
    #region __Класс Serving модель таблицы порций__
    /// <summary>
    /// Модель таблицы порций. 
    /// Включает в себя пищевую ценность для порции.
    /// </summary>
    public class Serving
    {
        /// <summary>
        /// Первичный ключ
        /// </summary>
        [Key]
        public long ServingId { get; set; }

        /// <summary>
        /// Полное описание порции и ее размера, на пример "1 чашка", "100 грамм"
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string Description { get; set; }

        /// <summary>
        /// Идентификатор порции на сервере FatSecret.
        /// </summary>
        public long FSServingId { get; set; }

        /// <summary>
        /// Ссылка на порцию на сервере FatSecret. Не используется, добавлено для полноты.
        /// </summary>
        [DataType(DataType.Text)]
        public string FSUrl { get; set; }

        #region __Измерение порции__
        /// <summary>
        /// Количество в метрической системе измерения. Вместе с MetricUnit образует общее стандартизованное количество порции.
        /// Например, MetricAmount=65, MetricUnit="g", размер порции будет 65 g.
        /// 
        /// metric_serving_amount - The metric quantity combined with metric_serving_unit to derive the total standardized quantity of the 
        /// serving (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal MetricAmount { get; set; }

        /// <summary>
        /// Метрическая единица измерения размера порции, может быть "g", "ml" или "oz" - вместе с MetricAmount образует общее 
        /// стандартизованное количество порции.
        /// Например, MetricAmount=65, MetricUnit="g", размер порции будет 65 g.
        /// 
        /// metric_serving_unit - The metric unit of measure for the serving size – either "g" or "ml" or "oz" – combined with 
        /// metric_serving_amount to derive the total standardized quantity of the serving (where available).
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(32)]
        public string MetricUnit { get; set; }

        /// <summary>
        /// Количество стандартной порции. Например, если описание порции "2 чайные ложки" UnitsNumber будет 2, если "1 чашка", то 
        /// UnitsNumber будет 1.
        /// 
        /// number_of_units - The number of units in this standard serving size. For instance, if the serving description 
        /// is "2 tablespoons" the number of units is "2", while if the serving size is "1 cup" the number of units is "1".
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal UnitsNumber { get; set; }

        /// <summary>
        /// Описание единицы измерения порции. Например, в порции "1/2 чашки", MeasurementDescription будет "чашка", если "100 г", то 
        /// MeasurementDescription будет "г".
        /// 
        /// measurement_description – a description of the unit of measure used in the serving description. For instance, if the description 
        /// is "1/2 cup" the measurement description is "cup", while if the serving size is "100 g" the measurement description is "g".
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string MeasurementDescription { get; set; }
        #endregion

        #region __Пищевая ценность__

        #region Основные параметры
        /// <summary>
        /// Энергетическая ценность, измеренная в ккал.
        /// 
        /// calories is a Decimal – the energy content in kcal.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal? KCal { get; set; }

        /// <summary>
        /// Содержание углевода, измеренное в граммах.
        /// 
        /// carbohydrate is a Decimal – the total carbohydrate content in grams.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal Carbohydrate { get; set; }

        /// <summary>
        /// Содержание белка, измеренное в граммах.
        /// 
        /// protein is a Decimal – the protein content in grams.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal Protein { get; set; }

        /// <summary>
        /// Содержание жира, измеренное в граммах.
        /// 
        /// fat is a Decimal – the total fat content in grams.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal Fat { get; set; }
        #endregion

        #region Углеводы
        /// <summary>
        /// Содержание пищевых волокон (в углеводах), измеренное в граммах.
        /// 
        /// fiber is a Decimal – the fiber content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal DietaryFiber { get; set; }

        /// <summary>
        /// Содержание сахара, измеренное в граммах.
        /// 
        /// sugar is a Decimal – the sugar content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Sugars { get; set; }
        #endregion

        #region Жиры
        /// <summary>
        /// Содержание насыщенных жиров, измеренное в граммах.
        /// 
        /// saturated_fat is a Decimal – the saturated fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal SaturatedFat { get; set; }

        /// <summary>
        /// Содержание мононенасыщенных жиров, измеренное в граммах.
        /// 
        /// monounsaturated_fat is a Decimal – the monounsaturated fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal MonounsaturatedFat { get; set; }

        /// <summary>
        /// Содержание полиненасыщенных жиров, измеренное в граммах.
        /// 
        /// polyunsaturated_fat is a Decimal – the polyunsaturated fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal PolyunsaturatedFat { get; set; }

        /// <summary>
        /// Содержание транс жиров, измеренное в граммах.
        /// 
        /// trans_fat is a Decimal – the trans fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal TransFat { get; set; }
        #endregion

        #region Остальное
        /// <summary>
        /// Содержание холестерина, измеренное в миллиграммах.
        /// 
        /// cholesterol is a Decimal – the cholesterol content in milligrams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Cholesterol { get; set; }

        /// <summary>
        /// Содержание натрия, измеренное в миллиграммах
        /// 
        /// sodium is a Decimal – the sodium content in milligrams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Sodium { get; set; }
        /// <summary>
        /// Содержание калия, измеренное в миллиграммах
        /// 
        /// potassium is a Decimal – the potassium content in milligrams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Potassium { get; set; }

        /// <summary>
        /// Содержание кальция. Измеренное в процентах от рекомендованного дневного потребления (на основе 2000 калорийной диеты).
        /// 
        /// calcium is an Decimal – the percentage of daily recommended Calcium, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Calcium { get; set; }

        /// <summary>
        /// Содержание железа. Измеренное в процентах от рекомендованного дневного потребления (на основе 2000 калорийной диеты).
        /// 
        /// iron is an Decimal – the percentage of daily recommended Iron, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Iron { get; set; }

        /// <summary>
        /// Содержание Витамина A. Измеренное в процентах от рекомендованного дневного потребления (на основе 2000 калорийной диеты).
        /// 
        /// vitamin_a is an Decimal – the percentage of daily recommended Vitamin A, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal VitaminA { get; set; }

        /// <summary>
        /// Содержание Витамина C. Измеренное в процентах от рекомендованного дневного потребления (на основе 2000 калорийной диеты).
        /// 
        /// vitamin_c is an Decimal – the percentage of daily recommended Vitamin C, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal VitaminC { get; set; }
        #endregion

        #endregion

        #region __Информация о создании__
        /// <summary>
        /// Время создания продукта
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreationTime { get; set; }

        /// <summary>
        /// Foreign key для CreateUser
        /// </summary>
        [Required]
        public int CreateUserId { get; set; }

        ///// <summary>
        ///// Профиль пользователя, создавшего продукт
        ///// </summary>
        //[ForeignKey("CreateUserId")]
        //public virtual UserProfile CreateUser { get; set; }

        /// <summary>
        /// Foreign key для Food.
        /// </summary>
        [Required]
        public long FoodId { get; set; }
        /// <summary>
        /// Еда, для которой предназначена эта порция.
        /// </summary>
        [ForeignKey("FoodId")]
        public virtual Food Food { get; set; }
        #endregion
    }
    #endregion
}