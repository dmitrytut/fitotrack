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
    /// Data Transfer Object профилей пользователя.
    /// </summary>
    public class UserProfileDTO
    {
        public GeneralDTO General { get; set; }
        public PhysicalInfoDTO PhysicalInfo { get; set; }
        public GoalDTO Goal { get; set; }
        public CredentialsDTO Credentials { get; set; }
        public NotificationsDTO Notifications { get; set; }
        public PrivacyDTO Privacy { get; set; }
    }
}