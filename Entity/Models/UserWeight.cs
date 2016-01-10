using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы веса пользователя.
    /// </summary>
    public class UserWeight
    {
        #region __Свойства__

        /// <summary>
        /// Первичный ключ таблицы.
        /// </summary>
        [Key]
        public int UserWeightId { get; set; }

        /// <summary>
        /// Вес пользователя
        /// </summary>
        [Required]
        [Range(20, 1000)]
        public decimal Weight { get; set; }

        /// <summary>
        /// Дата взвешивания.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        /// <summary>
        /// Foreign key для CreateUser
        /// </summary>
        [Required]
        public int CreateUserId { get; set; }

        /// <summary>
        /// Профиль пользователя, создавшего запись
        /// </summary>
        [ForeignKey("CreateUserId")]
        public virtual UserProfile CreateUser { get; set; }

        //public CreationInfo CreationInfo { get; set; }

        #endregion
    }
}