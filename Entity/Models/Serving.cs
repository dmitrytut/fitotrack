using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using fitotrack.Entity.Attributes;


namespace fitotrack.Entity.Models
{
    #region __����� Serving ������ ������� ������__
    /// <summary>
    /// ������ ������� ������. 
    /// �������� � ���� ������� �������� ��� ������.
    /// </summary>
    public class Serving
    {
        /// <summary>
        /// ��������� ����
        /// </summary>
        [Key]
        public long ServingId { get; set; }

        /// <summary>
        /// ������ �������� ������ � �� �������, �� ������ "1 �����", "100 �����"
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string Description { get; set; }

        /// <summary>
        /// ������������� ������ �� ������� FatSecret.
        /// </summary>
        public long FSServingId { get; set; }

        /// <summary>
        /// ������ �� ������ �� ������� FatSecret. �� ������������, ��������� ��� �������.
        /// </summary>
        [DataType(DataType.Text)]
        public string FSUrl { get; set; }

        #region __��������� ������__
        /// <summary>
        /// ���������� � ����������� ������� ���������. ������ � MetricUnit �������� ����� ����������������� ���������� ������.
        /// ��������, MetricAmount=65, MetricUnit="g", ������ ������ ����� 65 g.
        /// 
        /// metric_serving_amount - The metric quantity combined with metric_serving_unit to derive the total standardized quantity of the 
        /// serving (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal MetricAmount { get; set; }

        /// <summary>
        /// ����������� ������� ��������� ������� ������, ����� ���� "g", "ml" ��� "oz" - ������ � MetricAmount �������� ����� 
        /// ����������������� ���������� ������.
        /// ��������, MetricAmount=65, MetricUnit="g", ������ ������ ����� 65 g.
        /// 
        /// metric_serving_unit - The metric unit of measure for the serving size � either "g" or "ml" or "oz" � combined with 
        /// metric_serving_amount to derive the total standardized quantity of the serving (where available).
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(32)]
        public string MetricUnit { get; set; }

        /// <summary>
        /// ���������� ����������� ������. ��������, ���� �������� ������ "2 ������ �����" UnitsNumber ����� 2, ���� "1 �����", �� 
        /// UnitsNumber ����� 1.
        /// 
        /// number_of_units - The number of units in this standard serving size. For instance, if the serving description 
        /// is "2 tablespoons" the number of units is "2", while if the serving size is "1 cup" the number of units is "1".
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal UnitsNumber { get; set; }

        /// <summary>
        /// �������� ������� ��������� ������. ��������, � ������ "1/2 �����", MeasurementDescription ����� "�����", ���� "100 �", �� 
        /// MeasurementDescription ����� "�".
        /// 
        /// measurement_description � a description of the unit of measure used in the serving description. For instance, if the description 
        /// is "1/2 cup" the measurement description is "cup", while if the serving size is "100 g" the measurement description is "g".
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string MeasurementDescription { get; set; }
        #endregion

        #region __������� ��������__

        #region �������� ���������
        /// <summary>
        /// �������������� ��������, ���������� � ����.
        /// 
        /// calories is a Decimal � the energy content in kcal.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal? KCal { get; set; }

        /// <summary>
        /// ���������� ��������, ���������� � �������.
        /// 
        /// carbohydrate is a Decimal � the total carbohydrate content in grams.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal Carbohydrate { get; set; }

        /// <summary>
        /// ���������� �����, ���������� � �������.
        /// 
        /// protein is a Decimal � the protein content in grams.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal Protein { get; set; }

        /// <summary>
        /// ���������� ����, ���������� � �������.
        /// 
        /// fat is a Decimal � the total fat content in grams.
        /// </summary>
        [Required]
        [PositiveDecimal]
        public decimal Fat { get; set; }
        #endregion

        #region ��������
        /// <summary>
        /// ���������� ������� ������� (� ���������), ���������� � �������.
        /// 
        /// fiber is a Decimal � the fiber content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal DietaryFiber { get; set; }

        /// <summary>
        /// ���������� ������, ���������� � �������.
        /// 
        /// sugar is a Decimal � the sugar content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Sugars { get; set; }
        #endregion

        #region ����
        /// <summary>
        /// ���������� ���������� �����, ���������� � �������.
        /// 
        /// saturated_fat is a Decimal � the saturated fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal SaturatedFat { get; set; }

        /// <summary>
        /// ���������� ���������������� �����, ���������� � �������.
        /// 
        /// monounsaturated_fat is a Decimal � the monounsaturated fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal MonounsaturatedFat { get; set; }

        /// <summary>
        /// ���������� ���������������� �����, ���������� � �������.
        /// 
        /// polyunsaturated_fat is a Decimal � the polyunsaturated fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal PolyunsaturatedFat { get; set; }

        /// <summary>
        /// ���������� ����� �����, ���������� � �������.
        /// 
        /// trans_fat is a Decimal � the trans fat content in grams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal TransFat { get; set; }
        #endregion

        #region ���������
        /// <summary>
        /// ���������� �����������, ���������� � ������������.
        /// 
        /// cholesterol is a Decimal � the cholesterol content in milligrams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Cholesterol { get; set; }

        /// <summary>
        /// ���������� ������, ���������� � ������������
        /// 
        /// sodium is a Decimal � the sodium content in milligrams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Sodium { get; set; }
        /// <summary>
        /// ���������� �����, ���������� � ������������
        /// 
        /// potassium is a Decimal � the potassium content in milligrams (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Potassium { get; set; }

        /// <summary>
        /// ���������� �������. ���������� � ��������� �� ���������������� �������� ����������� (�� ������ 2000 ���������� �����).
        /// 
        /// calcium is an Decimal � the percentage of daily recommended Calcium, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Calcium { get; set; }

        /// <summary>
        /// ���������� ������. ���������� � ��������� �� ���������������� �������� ����������� (�� ������ 2000 ���������� �����).
        /// 
        /// iron is an Decimal � the percentage of daily recommended Iron, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal Iron { get; set; }

        /// <summary>
        /// ���������� �������� A. ���������� � ��������� �� ���������������� �������� ����������� (�� ������ 2000 ���������� �����).
        /// 
        /// vitamin_a is an Decimal � the percentage of daily recommended Vitamin A, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal VitaminA { get; set; }

        /// <summary>
        /// ���������� �������� C. ���������� � ��������� �� ���������������� �������� ����������� (�� ������ 2000 ���������� �����).
        /// 
        /// vitamin_c is an Decimal � the percentage of daily recommended Vitamin C, based on a 2000 calorie diet (where available).
        /// </summary>
        [PositiveDecimal]
        public decimal VitaminC { get; set; }
        #endregion

        #endregion

        #region __���������� � ��������__
        /// <summary>
        /// ����� �������� ��������
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreationTime { get; set; }

        /// <summary>
        /// Foreign key ��� CreateUser
        /// </summary>
        [Required]
        public int CreateUserId { get; set; }

        ///// <summary>
        ///// ������� ������������, ���������� �������
        ///// </summary>
        //[ForeignKey("CreateUserId")]
        //public virtual UserProfile CreateUser { get; set; }

        /// <summary>
        /// Foreign key ��� Food.
        /// </summary>
        [Required]
        public long FoodId { get; set; }
        /// <summary>
        /// ���, ��� ������� ������������� ��� ������.
        /// </summary>
        [ForeignKey("FoodId")]
        public virtual Food Food { get; set; }
        #endregion
    }
    #endregion
}