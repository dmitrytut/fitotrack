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
    /// Data Transfer Object информации о физ.параметрах пользователя.
    /// </summary>
    public class PhysicalInfoDTO
    {
        [Range(0, 1000)]
        public decimal? Weight { get; set; }

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
        [Range(0, 5)]
        public int? ActivityLevel { get; set; }
    }
}