using fitotrack.Entity.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    /// <summary>
    /// ������ ������� ������ � ������� ����������.
    /// </summary>
    public class WorkoutDiaryEntry
    {
        /// <summary>
        /// ����������� ������.
        /// </summary>
        public WorkoutDiaryEntry()
        {
            Sets = new List<WorkoutSet>();
            CreationInfo = new CreationInfo();
        }

        /// <summary>
        /// ��������� ����.
        /// </summary>
        [Key]
        public int WorkoutDiaryEntryId { get; set; }

        /// <summary>
        /// Foreign key ��� Exercise.
        /// </summary>
        [Required]
        public int ExerciseId { get; set; }

        /// <summary>
        /// ����������� ����������.
        /// </summary>
        [ForeignKey("ExerciseId")]
        public virtual Exercise Exercise { get; set; }

        /// <summary>
        /// ���� ��������������� ������.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime DateUTC { get; set; }

        /// <summary>
        /// ������ ����������� �����.
        /// </summary>
        [Required]
        public ICollection<WorkoutSet> Sets { get; set; }

        /// <summary>
        /// ������� �������� ���������� ����� �� ����� ���������� ��� ����� ����.
        /// </summary>
        [Range(0, 500)]
        public int HeartRate { get; set; }

        /// <summary>
        /// �������� ��������� �������.
        /// </summary>
        [PositiveDecimal]
        public decimal BurnedCalories { get; set; }

        /// <summary>
        /// ���������� � �������� ������.
        /// </summary>
        [Required]
        public CreationInfo CreationInfo { get; set; }

        /// <summary>
        /// Foreign key ��� CreateUser.
        /// </summary>
        [Required]
        public int CreateUserId { get; set; }

        /// <summary>
        /// ������� ������������, ���������� ������.
        /// </summary>
        [ForeignKey("CreateUserId")]
        public virtual UserProfile CreateUser { get; set; }
    }
}