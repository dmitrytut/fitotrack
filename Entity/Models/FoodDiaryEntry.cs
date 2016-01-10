using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __Класс FoodDiaryEntry модель таблицы записи в журнале питания__
    /// <summary>
    /// Модель таблицы записи в журнале питания
    /// </summary>
    public class FoodDiaryEntry
    {
        /// <summary>
        /// Первичный ключ
        /// </summary>
        [Key]
        public int FoodDiaryEntryId { get; set; }

        /// <summary>
        /// Индекс приема пищи. 0 - завтрак, 1 - обед, 2 - ужин, 3 - перекусы.
        /// </summary>
        [Required]
        public int MealTimeIndex { get; set; }

        /// <summary>
        /// Foreign key для Food
        /// </summary>
        [Required]
        public long FoodId { get; set; }

        /// <summary>
        /// Съеденная еда
        /// </summary>
        [Required]
        [ForeignKey("FoodId")]
        public virtual Food Food { get; set; }

        /// <summary>
        /// Идентификатор FatSecret выбранной порции  
        /// </summary>
        [Required]
        public long FsSelectedServingId { get; set; }

        /// <summary>
        /// Идентификатор FitoTrack выбранной порции  
        /// </summary>
        [Required]
        public long FtSelectedServingId { get; set; }

        /// <summary>
        /// Выбранная порция
        /// </summary>
        //[Required]
        //public virtual Serving SelectedServing { get; set; }

        /// <summary>
        /// Количество съеденной порции еды в метрической системе измерения. Напр. 1 яблоко, 0.5 банан - 1 и 0.5 - MetricAmount.
        /// </summary>
        [Required]
        public decimal FoodQty { get; set; }

        /// <summary>
        /// Выполнена ли запись. (Для планирования).
        /// </summary>
        [Required]
        public bool IsCompleted { get; set; }

        /// <summary>
        /// Дата соответствующей записи
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }


        #region __Информация о создании__
        /// <summary>
        /// Время создания записи
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreationTime { get; set; }

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
        #endregion
    }
    #endregion
}