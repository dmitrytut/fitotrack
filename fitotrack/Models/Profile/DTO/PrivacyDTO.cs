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
    /// Data Transfer Object информации о параметрах доступа к профилю пользователя.
    /// </summary>
    public class PrivacyDTO
    {
        /// <summary>
        /// Флаг приватности профиля пользователя. 
        /// 0 - Доступен всем.
        /// 1 - Доступен только друзьям.
        /// 2 - Доступен только обладателю.
        /// </summary>
        [Range(0, 2)]
        public int PrivacyFlag { get; set; }
    }
}