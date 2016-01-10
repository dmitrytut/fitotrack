using fitotrack.Entity.Attributes;
using fitotrack.Entity.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Workout.DTO
{
    /// <summary>
    /// Data Transfer Object записи сета выполненного упражнения.
    /// </summary>
    public class WorkoutSetDTO
    {
        [Required]
        public int WorkoutSetId { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        [Range(1, 250)]
        public int Reps { get; set; }

        [Range(0, 500)]
        public decimal Weight { get; set; }

        [PositiveDecimal]
        public decimal Rest { get; set; }

        [PositiveDecimal]
        public decimal Duration { get; set; }

        [PositiveDecimal]
        public decimal Distance { get; set; }

        [Required]
        public bool IsCompleted { get; set; }
    }
}