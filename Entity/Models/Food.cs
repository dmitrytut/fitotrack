using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __����� Food ������ ������� ����__
    /// <summary>
    /// ������ ������� ����
    /// </summary>
    public class Food
    {
        public Food()
        {
            Servings = new List<Serving>();
        }
        #region __�������� ����������__
        /// <summary>
        /// ��������� ����
        /// </summary>
        [Key]
        public long FoodId { get; set; }

        /// <summary>
        /// �������� ���
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string Title { get; set; }

        /// <summary>
        /// ��� ��� - ����� ��������� �������� "Brand" - ��������� � "Generic" - �����������
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(32)]
        public string Type { get; set; }

        /// <summary>
        /// ��� ������ - ����� ��������� �������� "manufacturer", "restaurant" � "supermarket"
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(32)]
        public string BrandType { get; set; }

        /// <summary>
        /// �������� �������������, ��������� ��� ������������
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string BrandTitle { get; set; }

        /// <summary>
        /// ������������� ��� �� ������� FatSecret.
        /// </summary>
        public long FSFoodId { get; set; }

        /// <summary>
        /// ������ �� ������� �� ������� FatSecret. �� ������������, ��������� ��� �������.
        /// </summary>
        [DataType(DataType.Text)]
        public string FSUrl { get; set; }

        /// <summary>
        /// �������� ��������.
        /// �������� �������:
        /// EAN-13 (12 ������ + ����������� �����, ����� ���������������� � ���� ������) � 
        /// UPC-A (11 ������ + ����������� �����, ������������� � ��� � ������).
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(13)]
        public string Barcode { get; set; }

        #endregion

        /// <summary>
        /// ��������� ������ ���
        /// </summary>
        public virtual ICollection<Serving> Servings { get; set; }

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
        //[Required]
        public int? CreateUserId { get; set; }

        /// <summary>
        /// ������� ������������, ���������� �������
        /// </summary>
        [ForeignKey("CreateUserId")]
        public virtual UserProfile CreateUser { get; set; }
        #endregion
    }
    #endregion

    public static class FoodType
    {
        public static String Brand { get { return "Brand"; } }
        public static String Generic { get { return "Generic"; } }
    }

    public static class BrandType
    {
        public static String Manufacturer { get { return "Manufacturer"; } }
        public static String Restaurant { get { return "Restaurant"; } }
        public static String Supermarket { get { return "Supermarket"; } }
    }
}