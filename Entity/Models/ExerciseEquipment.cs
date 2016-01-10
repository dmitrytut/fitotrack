using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Модель таблицы оборудования для выполнения упражнения.
    /// </summary>
    public class ExerciseEquipment
    {
        public ExerciseEquipment()
        {
            this.Exercises = new HashSet<Exercise>();
        }

        /// <summary>
        /// Первичный ключ таблицы.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Название оборудования для упражнения.
        /// </summary>
        [Required]
        public string Title { get; set; }

        /// <summary>
        /// Navigation property.
        /// </summary>
        public virtual ICollection<Exercise> Exercises { get; set; }
    }      
}