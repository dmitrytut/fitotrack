using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __Класс Exercise модель таблицы упражнений__
    /// <summary>
    /// Модель таблицы упражнений.
    /// </summary>
    public class Exercise
    {
        public Exercise()
        {
            Steps = new List<ExerciseStep>();
            MainMuscles = new List<ExerciseMuscles>();
            //OtherMuscles = new List<ExerciseMuscles>();
            Equipment = new List<ExerciseEquipment>();
        }

        #region __Свойства__

        /// <summary>
        /// Первичный ключ таблицы.
        /// </summary>
        [Key]
        public int ExerciseId { get; set; }

        /// <summary>
        /// Название упражнения.
        /// </summary>
        [Required]
        public string Title { get; set; }

        /// <summary>
        /// Описание упражнения.
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// Коллекция шагов выполнения упражнения.
        /// </summary>
        public virtual ICollection<ExerciseStep> Steps { get; set; }

        /// <summary>
        /// Ссылка на картинку упражнения.
        /// </summary>
        public string ImageUrl { get; set; }

        /// <summary>
        /// Ссылка на видео упражнения.
        /// </summary>
        public string VideoUrl { get; set; }

        /// <summary>
        /// Тип упражнения.
        /// 1 - Кардио-упражнения.
        /// 2 - Силовые упражнения.
        /// 3 - Игровые упражнения.
        /// 4 - Повседневные дела.
        /// 5 - Упражнения на растяжку.
        /// 6 - Создано пользователем.
        /// </summary>
        public int Type { get; set; }

        /// <summary>
        /// Сложность упражнения.
        /// 1 - упражнение для начинающих спортсменов.
        /// 2 - упражнение для продвинутых спортсменов.
        /// 3 - упражнение для опытных спортсменов.
        /// 4 - упражнение для профессиональных спортсменов.
        /// </summary>
        public int Complexity { get; set; }

        /// <summary>
        /// Механика упражнения.
        /// 1 - Базовое.
        /// 2 - Изолирующее.
        /// </summary>
        public int Mechanics { get; set; }

        /// <summary>
        /// Основные задействованные мышцы.
        /// </summary>'
        public virtual ICollection<ExerciseMuscles> MainMuscles { get; set; }

        /// <summary>
        /// Остальные задействованные мышцы.
        /// </summary>
        //public virtual ICollection<ExerciseMuscles> OtherMuscles { get; set; }

        /// <summary>
        /// Возможность выполнения упражнения в домашних условиях.
        /// </summary>
        public bool CanBeDoneAtHome { get; set; }

        /// <summary>
        /// Metabolic Equivalent of Task, нужно для подсчета сожженных калорий. 
        /// За минимальное значение принят сон - 0.9.
        /// </summary>
        [Range(0.9D,50)]
        public decimal? MET { get; set; }

        /// <summary>
        /// Необходимая экипировка для выполнения упражнения.
        /// </summary>
        public virtual ICollection<ExerciseEquipment> Equipment { get; set; }

        #region __Информация о создании__
        /// <summary>
        /// Информация о создании упражнения.
        /// </summary>
        [Required]
        public CreationInfo CreationInfo { get; set; }

        /// <summary>
        /// Foreign key для CreateUser.
        /// </summary>
        //[Required]
        public int? CreateUserId { get; set; }

        /// <summary>
        /// Профиль пользователя, создавшего упражнение.
        /// </summary>
        [ForeignKey("CreateUserId")]
        public virtual UserProfile CreateUser { get; set; }
        #endregion

        #endregion
    }      

    #endregion
}