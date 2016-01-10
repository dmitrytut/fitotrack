using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using fitotrack.Models.Common.DTO;
using fitotrack.Entity.Attributes;

namespace fitotrack.Models.Workout.DTO
{
    /// <summary>
    /// Data Transfer Object записи дневника упражнений. 
    /// </summary>
    public class WorkoutDiaryEntryDTO
    {
        [Required]
        public int WorkoutDiaryEntryId { get; set; }

        [Required]
        public ExerciseDTO Exercise { get; set; }

        [Required]
        public long Date { get; set; }

        [Required]
        public List<WorkoutSetDTO> Sets { get; set; }

        [Range(0, 500)]
        public int HeartRate { get; set; }

        [PositiveDecimal]
        public decimal BurnedCalories { get; set; }

        [Required]
        public CreationInfoDTO CreationInfo { get; set; }

        public int CreateUserId { get; set; }
    }
}