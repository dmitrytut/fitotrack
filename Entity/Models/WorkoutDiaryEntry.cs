using fitotrack.Entity.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы записи в журнале упражнений.
    /// </summary>
    public class WorkoutDiaryEntry
    {
        /// <summary>
        /// Конструктор класса.
        /// </summary>
        public WorkoutDiaryEntry()
        {
            Sets = new List<WorkoutSet>();
            CreationInfo = new CreationInfo();
        }

        /// <summary>
        /// Первичный ключ.
        /// </summary>
        [Key]
        public int WorkoutDiaryEntryId { get; set; }

        /// <summary>
        /// Foreign key для Exercise.
        /// </summary>
        [Required]
        public int ExerciseId { get; set; }

        /// <summary>
        /// Выполненное упражнение.
        /// </summary>
        [ForeignKey("ExerciseId")]
        public virtual Exercise Exercise { get; set; }

        /// <summary>
        /// Дата соответствующей записи.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime DateUTC { get; set; }

        /// <summary>
        /// Список выполненных сетов.
        /// </summary>
        [Required]
        public ICollection<WorkoutSet> Sets { get; set; }

        /// <summary>
        /// Среднее значение сердечного ритма во время упражнения или после него.
        /// </summary>
        [Range(0, 500)]
        public int HeartRate { get; set; }

        /// <summary>
        /// Значение сожженных калорий.
        /// </summary>
        [PositiveDecimal]
        public decimal BurnedCalories { get; set; }

        /// <summary>
        /// Информация о создании записи.
        /// </summary>
        [Required]
        public CreationInfo CreationInfo { get; set; }

        /// <summary>
        /// Foreign key для CreateUser.
        /// </summary>
        [Required]
        public int CreateUserId { get; set; }

        /// <summary>
        /// Профиль пользователя, создавшего запись.
        /// </summary>
        [ForeignKey("CreateUserId")]
        public virtual UserProfile CreateUser { get; set; }
    }
}