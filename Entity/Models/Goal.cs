using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using fitotrack.Entity.Attributes;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы целей пользователя
    /// </summary>
    public class Goal
    {
        #region __Свойства__

        /// <summary>
        /// Первичный ключ таблицы
        /// </summary>
        [Key]
        public int GoalId { get; set; }

        /// <summary>
        /// Описание цели.
        /// 0 - неопределено.
        /// 1 - Похудение.
        /// 2 - Поддержание текущего веса.
        /// 3 - Набор массы.
        /// 4 - Набор мышечной массы. 
        /// 5 - Достижение определенного процента жира.
        /// </summary>
        [Range(0, 5)]
        public int GoalType { get; set; }

        /// <summary>
        /// Интенсивность достижения цели.
        /// 0 - неопределено.
        /// 1 - Здорово. 0.25 кг/неделя
        /// 2 - Нормально. 0.5 кг/неделя
        /// 3 - Агрессивно. 1 кг/неделя
        /// </summary>
        [Range(0, 3)]
        public int Intensity { get; set; }

        /// <summary>
        /// Начальный вес пользователя.
        /// </summary>
        [Range(0, 1000)]
        public decimal StartWeight { get; set; }

        /// <summary>
        /// Целевой вес пользователя
        /// </summary>
        [Range(0, 1000)]
        public decimal GoalWeight { get; set; }

        // TODO Сделать атрибут валидации - дата больше или равна сегодня.
        /// <summary>
        /// Желаемая дата достижения цели.
        /// </summary>
        public DateTime? EstimatedFinishDate { get; set; }

        /// <summary>
        /// Recommended Daily Expenditure. Расчитанное Ежедневное Потребление Энергии для заданной цели (ккал).
        /// </summary>
        [Range(0, 15000)]
        public decimal RDE { get; set; }

        #region __Информация о создании__
        /// <summary>
        /// Время создания цели.
        /// </summary>
        [Required]
        public DateTime CreationTime { get; set; }

        /// <summary>
        /// Время окончания действия цели.
        /// </summary>
        public DateTime? EndTime { get; set; }

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

        #endregion
    }
}