using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace fitotrack.Models.Profile.DTO
{
    /// <summary>
    /// Data Transfer Object информации о параметрах уведомления пользователя.
    /// </summary>
    public class NotificationsDTO
    {
        public bool? PushNotifications { get; set; }
        public bool? Newsletter { get; set; }
    }
}