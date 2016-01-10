using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __Класс Food модель таблицы блюд__
    /// <summary>
    /// Модель таблицы блюд
    /// </summary>
    public class Food
    {
        public Food()
        {
            Servings = new List<Serving>();
        }
        #region __Основная информация__
        /// <summary>
        /// Первичный ключ
        /// </summary>
        [Key]
        public long FoodId { get; set; }

        /// <summary>
        /// Название еды
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string Title { get; set; }

        /// <summary>
        /// Тип еды - может принимать значения "Brand" - брендовая и "Generic" - собственная
        /// </summary>
        [Required]
        [DataType(DataType.Text)]
        [StringLength(32)]
        public string Type { get; set; }

        /// <summary>
        /// Тип бренда - может принимать значения "manufacturer", "restaurant" и "supermarket"
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(32)]
        public string BrandType { get; set; }

        /// <summary>
        /// Название производителя, ресторана или супермаркета
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(255)]
        public string BrandTitle { get; set; }

        /// <summary>
        /// Идентификатор еды на сервере FatSecret.
        /// </summary>
        public long FSFoodId { get; set; }

        /// <summary>
        /// Ссылка на продукт на сервере FatSecret. Не используется, добавлено для полноты.
        /// </summary>
        [DataType(DataType.Text)]
        public string FSUrl { get; set; }

        /// <summary>
        /// Штрихкод продукта.
        /// Основные форматы:
        /// EAN-13 (12 знаков + контрольная сумма, самый распространенный в мире формат) и 
        /// UPC-A (11 знаков + контрольная сумма, распространен в США и Канаде).
        /// </summary>
        [DataType(DataType.Text)]
        [StringLength(13)]
        public string Barcode { get; set; }

        #endregion

        /// <summary>
        /// Коллекция порций еды
        /// </summary>
        public virtual ICollection<Serving> Servings { get; set; }

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
        //[Required]
        public int? CreateUserId { get; set; }

        /// <summary>
        /// Профиль пользователя, создавшего продукт
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