using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __Класс UserProfile модель таблицы профилей пользователей__
    /// <summary>
    /// Модель таблицы профиля пользователя
    /// </summary>
    public class UserProfile
    {

        public UserProfile()
        {
            Goals = new List<Goal>();
            Weights = new List<UserWeight>();
            BodyParameters = new List<BodyParameters>();
            FoodDiaryEntries = new List<FoodDiaryEntry>();
            WorkoutDiaryEntries = new List<WorkoutDiaryEntry>();
        }

        #region __Свойства__

        #region __Свойство UserId идентификатор пользователя__
        /// <summary>
        /// Идентификатор пользователя.
        /// </summary>
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public int UserId { get; set; }

        [Key, ForeignKey("ApplicationUser")]
        public int UserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }

        #endregion

        #region __Свойство Email электронная почта пользователя__
        /// <summary>
        /// Электронная почта пользователя.
        /// </summary>
        //[Required]
        //[EmailAddress]
        //public string Email { get; set; }
        #endregion

        #region __Свойство UserName псевдоним пользователя__
        /// <summary>
        /// Псевдоним пользователя.
        /// </summary>
        //[StringLength(50)]
        //public string UserName { get; set; }

        #endregion

        #region __Свойство UserImagePath путь к изображению пользователя__
        /// <summary>
        /// Путь к изображению пользователя.
        /// </summary>
        public string UserImagePath { get; set; }

        #endregion

        #region __Свойство FullName полное имя пользователя__
        /// <summary>
        /// Полное имя пользователя.
        /// </summary>
        [Required]
        [StringLength(250)]
        public string FullName { get; set; }
        #endregion

        #region __Свойство Gender пол пользователя__
        /// <summary>
        /// Пол пользователя. 
        /// 0-неопределен.
        /// 1-женский. 
        /// 2-мужской.
        /// </summary>
        [Range(0, 2)]
        public int? Gender { get; set; }
        #endregion

        #region __Свойство DateOfBirth дата рождения пользователя__
        /// <summary>
        /// Дата рождения пользователя.
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? DateOfBirth { get; set; }
        #endregion

        #region __Свойство Location место нахождения пользователя__
        /// <summary>
        /// Место нахождения пользователя.
        /// </summary>
        [StringLength(250)]
        public string Location { get; set; }
        #endregion

        #region __Свойство Height рост пользователя__

        /// <summary>
        /// Рост пользователя.
        /// </summary>
        [Range(0, 1000)]
        public decimal? Height { get; set; }

        #endregion

        #region __Свойство ActivityLevel взвешивания пользователя__
        /// <summary>
        /// Уровень активности пользователя.
        /// Sedentary 1 - сидячий образ жизни (офисный рабочий, тренерующийся очень мало или вообще не тренерующийся)
        /// LightlyActive 2 - легкие нагрузки (1-3 простых тренировки в неделю)
        /// ModeratelyActive 3 - умеренно активный (человек, пробегающий час в день)
        /// VeryActive 4 - высоко активный (человек, проплывающий в день два часа)
        /// ExtraActive 5 - чрезвычайно активный (профессиональный спортсмен, например велосипедист)
        /// </summary>
        [Range(0, 5)]
        public int? ActivityLevel { get; set; }
        #endregion

        #region __Свойство Weights взвешивания пользователя__
        /// <summary>
        /// Взвешивания пользователя.
        /// </summary>
        public virtual ICollection<UserWeight> Weights { get; set; }
        #endregion

        #region __Свойство Notifications уведомления пользователя__
        /// <summary>
        /// Уведомления пользователя. 
        /// </summary>
        public virtual Notifications Notifications { get; set; }
        #endregion

        #region __Свойство PrivacyFlag флаг приватности профиля пользователя__
        /// <summary>
        /// Флаг приватности профиля пользователя. 
        /// 0 - Доступен всем.
        /// 1 - Доступен только друзьям.
        /// 2 - Доступен только облателю.
        /// </summary>
        [Range(0, 2)]
        public int PrivacyFlag { get; set; }
        #endregion

        #region _Свойство Status статус пользователя__
        /// <summary>
        /// Статус пользователя.
        /// </summary>
        [StringLength(250)]
        public string Status { get; set; }
        #endregion

        #region __Свойство BodyParameters параметры телосложения пользователя__
        /// <summary>
        /// Параметры телосложения пользователя.
        /// </summary>
        public virtual ICollection<BodyParameters> BodyParameters { get; set; }
        #endregion

        #region __Свойство Goals цель пользователя__
        /// <summary>
        /// Цели пользователя.
        /// </summary>
        public virtual ICollection<Goal> Goals { get; set; }
        #endregion

        #region __Свойство FoodDiaryEntry записи дневника питания пользователя__
        /// <summary>
        /// Записи дневника питания пользователя.
        /// </summary>
        public ICollection<FoodDiaryEntry> FoodDiaryEntries { get; set; }
        #endregion

        #region __Свойство WorkoutDiaryEntry записи дневника упражнений пользователя__
        /// <summary>
        /// Записи дневника упражнений пользователя.
        /// </summary>
        public ICollection<WorkoutDiaryEntry> WorkoutDiaryEntries { get; set; }
        #endregion

        #endregion
    }
    #endregion
}