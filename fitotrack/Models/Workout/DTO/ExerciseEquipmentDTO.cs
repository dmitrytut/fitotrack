using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Workout.DTO
{
    /// <summary>
    /// Data Transfer Object информации об оборудовании для выполнения упражнения. 
    /// </summary>
    public class ExerciseEquipmentDTO
    {
        [Required]
        public string Title { get; set; }
    }
}