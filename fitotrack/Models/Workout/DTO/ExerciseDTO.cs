using fitotrack.Models.Common.DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Workout.DTO
{
    /// <summary>
    /// Data Transfer Object информации об упражнениях. 
    /// </summary>
    public class ExerciseDTO
    {
        public int ExerciseId { get; set; }

        public int Complexity { get; set; }
        
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public List<ExerciseStepDTO> Steps { get; set; }

        public string ImageUrl { get; set; }

        public string VideoUrl { get; set; }

        public int Type { get; set; }

        public List<ExerciseMusclesDTO> MainMuscles { get; set; }

        //public ExerciseMusclesDTO OtherMuscles { get; set; }

        public bool CanBeDoneAtHome { get; set; }

        [Range(0.9D, 50)]
        public decimal? MET { get; set; }

        public List<ExerciseEquipmentDTO> Equipment { get; set; }

        [Required]
        public CreationInfoDTO CreationInfo { get; set; }

        //[Required]
        public int CreateUserId { get; set; }

    }
}