using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using fitotrack.Entity.Attributes;
using System.Collections.Generic;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы мышц, задействованных в упражнении.
    /// </summary>
    public class ExerciseMuscles
    {
        public ExerciseMuscles()
        {
            this.Exercises = new HashSet<Exercise>();
        }

        #region __Свойства__

        /// <summary>
        /// Первичный ключ таблицы.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Название мышц, задействованных при выполнении упражнения.
        /// </summary>
        [Required]
        public string Title { get; set; }

        /// <summary>
        /// Navigation property.
        /// </summary>
        public virtual ICollection<Exercise> Exercises { get; set; }

        //#region __Объедененные групп мышц__
        ///// <summary>
        ///// Мышцы, характеризующие Кардио-нагрузки.
        ///// </summary>
        //public bool? Cardio { get; set; }

        ///// <summary>
        ///// Задействованы все или большинство мышц.
        ///// </summary>
        //public bool? Full { get; set; }

        ///// <summary>
        ///// Верхняя часть тела.
        ///// </summary>
        //public bool? UpperBody { get; set; }

        ///// <summary>
        ///// Нижняя часть тела.
        ///// </summary>
        //public bool? LowerBody { get; set; }

        //#endregion

        //#region __Основные группы мышц__
        ///// <summary>
        ///// Шея.
        ///// </summary>
        //public bool? Neck { get; set; }

        ///// <summary>
        ///// Плечи.
        ///// </summary>
        //public bool? Shoulders { get; set; }

        ///// <summary>
        ///// Грудь.
        ///// </summary>
        //public bool? Chest { get; set; }

        ///// <summary>
        ///// Бицепс.
        ///// </summary>
        //public bool? Biceps { get; set; }

        ///// <summary>
        ///// Трицепс.
        ///// </summary>
        //public bool? Triceps { get; set; }

        ///// <summary>
        ///// Предплечья.
        ///// </summary>
        //public bool? Forearms { get; set; }

        ///// <summary>
        ///// Пресс.
        ///// </summary>
        //public bool? Abs { get; set; }

        ///// <summary>
        ///// Спина.
        ///// </summary>
        //public bool? Back { get; set; }

        ///// <summary>
        ///// Ягодицы.
        ///// </summary>
        //public bool? Glutes { get; set; }

        ///// <summary>
        ///// Верхняя часть ног.
        ///// </summary>
        //public bool? UpperLegs { get; set; }

        ///// <summary>
        ///// Нижняя часть ног.
        ///// </summary>
        //public bool? LowerLegs { get; set; }

        //#endregion

        //#region __Подробные группы мышц__
        ///// <summary>
        ///// Трапеция.
        ///// </summary>
        //public bool? Traps { get; set; }

        ///// <summary>
        ///// Дельтавидные мышцы.
        ///// </summary>
        //public bool? Delts { get; set; }

        ///// <summary>
        ///// Верхние мышцы пресс.
        ///// </summary>
        //public bool? UpperAbs { get; set; }

        ///// <summary>
        ///// Нижние мышцы пресса.
        ///// </summary>
        //public bool? LowerAbs { get; set; }

        ///// <summary>
        ///// Косые мышцы живота.
        ///// </summary>
        //public bool? Oblique { get; set; }

        ///// <summary>
        ///// Широчайшие мышцы спины.
        ///// </summary>
        //public bool? Lats { get; set; }

        ///// <summary>
        ///// Ромбовидные мышцы спины.
        ///// </summary>
        //public bool? MiddleBack { get; set; }

        ///// <summary>
        ///// Нижние мышцы спины.
        ///// </summary>
        //public bool? LowerBack { get; set; }

        ///// <summary>
        ///// Квадриципсы.
        ///// </summary>
        //public bool? Quadriceps { get; set; }

        ///// <summary>
        ///// Мышцы задней поверхности бедра.
        ///// </summary>
        //public bool? Hamstrings { get; set; }

        ///// <summary>
        ///// Икры.
        ///// </summary>
        //public bool? Calves { get; set; }
        //#endregion

        #endregion
    }
}