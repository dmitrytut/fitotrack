using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
    #region __Класс Notifications модель таблицы уведомлений пользователя__
    /// <summary>
    /// Модель таблицы уведомлений пользователя
    /// </summary>
    public class Notifications
    {
        /// <summary>
        /// Идентификатор пользователя.
        /// </summary>
        [Key, ForeignKey("UserProfile")]
        public int UserProfileId { get; set; }

        /// <summary>
        /// Флаг Push-уведомлений.
        /// </summary>
        public bool? PushNotifications { get; set; }

        /// <summary>
        /// Флаг почтовой рассылки.
        /// </summary>
        public bool? Newsletter { get; set; }

        public virtual UserProfile UserProfile { get; set; }
    }
    #endregion
}