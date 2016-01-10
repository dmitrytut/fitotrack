using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Workout.DTO
{
    /// <summary>
    /// Data Transfer Object информации о шаге в упражнении. 
    /// </summary>
    public class ExerciseStepDTO
    {
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Order { get; set; }

        public string ImageUrl { get; set; }
    }
}