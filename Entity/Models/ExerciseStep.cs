using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using fitotrack.Entity.Attributes;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы шага в упражнении.
    /// </summary>
    public class ExerciseStep
    {
        #region __Свойства__

        /// <summary>
        /// Первичный ключ таблицы.
        /// </summary>
        [Key]
        public int ExerciseStepId { get; set; }

        /// <summary>
        /// Название шага.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Описание шага.
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// Порядок шага при выполнении упражнения.
        /// </summary>
        [Required]
        public int Order { get; set; }
        
        /// <summary>
        /// Картинка, описывающая шаг.
        /// </summary>
        public string ImageUrl { get; set; }


        /// <summary>
        /// Идентификатор упражнения, для которого предназначен этот шаг.
        /// </summary>
        [Required]
        public int ExerciseId { get; set; }

        /// <summary>
        /// Упражнение, для которого предназначен этот шаг.
        /// </summary>
        [ForeignKey("ExerciseId")]
        public virtual Exercise Exercise { get; set; }

        #endregion
    }
}