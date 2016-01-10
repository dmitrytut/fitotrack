using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Workout.DTO
{
    /// <summary>
    /// Data Transfer Object информации об участвующих в упражнении мышцах. 
    /// </summary>
    public class ExerciseMusclesDTO
    {
        [Required]
        public string Title { get; set; }



        //#region __Объедененные групп мышц__
        //public bool? Cardio { get; set; }
        //public bool? Full { get; set; }
        //public bool? UpperBody { get; set; }
        //public bool? LowerBody { get; set; }
        //#endregion

        //#region __Основные группы мышц__
        //public bool? Neck { get; set; }
        //public bool? Shoulders { get; set; }
        //public bool? Chest { get; set; }
        //public bool? Biceps { get; set; }
        //public bool? Triceps { get; set; }
        //public bool? Forearms { get; set; }
        //public bool? Abs { get; set; }
        //public bool? Back { get; set; }
        //public bool? Glutes { get; set; }
        //public bool? UpperLegs { get; set; }
        //public bool? LowerLegs { get; set; }
        //#endregion

        //#region __Подробные группы мышц__
        //public bool? Traps { get; set; }
        //public bool? Delts { get; set; }
        //public bool? UpperAbs { get; set; }
        //public bool? LowerAbs { get; set; }
        //public bool? Oblique { get; set; }
        //public bool? Lats { get; set; }
        //public bool? MiddleBack { get; set; }
        //public bool? LowerBack { get; set; }
        //public bool? Quadriceps { get; set; }
        //public bool? Hamstrings { get; set; }
        //public bool? Calves { get; set; }
        //#endregion
    }
}