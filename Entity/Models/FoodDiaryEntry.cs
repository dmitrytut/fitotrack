using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __����� FoodDiaryEntry ������ ������� ������ � ������� �������__
    /// <summary>
    /// ������ ������� ������ � ������� �������
    /// </summary>
    public class FoodDiaryEntry
    {
        /// <summary>
        /// ��������� ����
        /// </summary>
        [Key]
        public int FoodDiaryEntryId { get; set; }

        /// <summary>
        /// ������ ������ ����. 0 - �������, 1 - ����, 2 - ����, 3 - ��������.
        /// </summary>
        [Required]
        public int MealTimeIndex { get; set; }

        /// <summary>
        /// Foreign key ��� Food
        /// </summary>
        [Required]
        public long FoodId { get; set; }

        /// <summary>
        /// ��������� ���
        /// </summary>
        [Required]
        [ForeignKey("FoodId")]
        public virtual Food Food { get; set; }

        /// <summary>
        /// ������������� FatSecret ��������� ������  
        /// </summary>
        [Required]
        public long FsSelectedServingId { get; set; }

        /// <summary>
        /// ������������� FitoTrack ��������� ������  
        /// </summary>
        [Required]
        public long FtSelectedServingId { get; set; }

        /// <summary>
        /// ��������� ������
        /// </summary>
        //[Required]
        //public virtual Serving SelectedServing { get; set; }

        /// <summary>
        /// ���������� ��������� ������ ��� � ����������� ������� ���������. ����. 1 ������, 0.5 ����� - 1 � 0.5 - MetricAmount.
        /// </summary>
        [Required]
        public decimal FoodQty { get; set; }

        /// <summary>
        /// ��������� �� ������. (��� ������������).
        /// </summary>
        [Required]
        public bool IsCompleted { get; set; }

        /// <summary>
        /// ���� ��������������� ������
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }


        #region __���������� � ��������__
        /// <summary>
        /// ����� �������� ������
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreationTime { get; set; }

        /// <summary>
        /// Foreign key ��� CreateUser
        /// </summary>
        [Required]
        public int CreateUserId { get; set; }

        /// <summary>
        /// ������� ������������, ���������� ������
        /// </summary>
        [ForeignKey("CreateUserId")]
        public virtual UserProfile CreateUser { get; set; }
        #endregion
    }
    #endregion
}