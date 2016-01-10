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
    /// Data Transfer Object расширенной информации о физ.параметрах пользователя. 
    /// Добавлениы поля Gender и Age.
    /// </summary>
    public class PhysicalInfoExDTO
    {
        [Required]
        public long? Birthday { get; set; }

        /// <summary>
        /// Пол пользователя. 
        /// 0-неопределен.
        /// 1-женский. 
        /// 2-мужской.
        /// </summary>
        [Required]
        [Range(0, 2)]
        public int? Gender { get; set; }

        [Required]
        [Range(0, 1000)]
        public decimal? Weight { get; set; }

        [Required]
        [Range(0, 1000)]
        public decimal? Height { get; set; }

        /// <summary>
        /// Уровень физ.активности пользователя.
        /// 0-неопределен.
        /// 1-Sedentary.
        /// 2-LightlyActive.
        /// 3-ModeratelyActive.
        /// 4-VeryActive.
        /// 5-ExtraActive.
        /// </summary>
        [Required]
        [Range(0, 5)]
        public int? ActivityLevel { get; set; }
    }
}