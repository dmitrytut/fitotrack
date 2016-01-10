using System.ComponentModel.DataAnnotations;
using fitotrack.Entity.Validation;
using fitotrack.Entity.Attributes;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы сета упражнения.
    /// </summary>
    public class WorkoutSet
    {
        /// <summary>
        /// Первичный ключ.
        /// </summary>
        [Key]
        public int WorkoutSetId { get; set; }

        /// <summary>
        /// Порядковый номер сета в упражнении.
        /// </summary>
        [Required]
        public int Order { get; set; }

        /// <summary>
        /// Количество повторений в сете при силовом упражнении.
        /// </summary>
        [Required]
        [Range(1, 250)]
        public int Reps { get; set; }

        /// <summary>
        /// Отягощение в сете при силовом упражнении (кг).
        /// </summary>
        [Range(0, 500)]
        public decimal Weight { get; set; }

        /// <summary>
        /// Время отдыха после сета (сек).
        /// </summary>
        [PositiveDecimal]
        public decimal Rest { get; set; }

        /// <summary>
        /// Длительность выполнения сета (в основном для кардио).
        /// </summary>
        [PositiveDecimal]
        public decimal Duration { get; set; }

        /// <summary>
        /// Дистанция покрытая при выполнении сета.
        /// </summary>
        [PositiveDecimal]
        public decimal Distance { get; set; }

        /// <summary>
        /// Выполнен ли сет. (Для планирования).
        /// </summary>
        [Required]
        public bool IsCompleted { get; set; }

        /// <summary>
        /// Foreign key для CreateUserWorkoutDiaryEntry.
        /// </summary>
        [Required]
        public int WorkoutDiaryEntryId { get; set; }

        /// <summary>
        /// Navigation property.
        /// </summary>
        public virtual WorkoutDiaryEntry WorkoutDiaryEntry { get; set; }
    }
}