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
    /// Data Transfer Object информации об основных параметрах пользователя.
    /// </summary>
    public class GeneralDTO
    {
        public string UserImagePath { get; set; }

        [StringLength(250)]
        public string UserName { get; set; }

        [Required]
        [StringLength(250)]
        public string FullName { get; set; }

        public long? Birthday { get; set; }

        /// <summary>
        /// Пол пользователя. 
        /// 0-неопределен.
        /// 1-женский. 
        /// 2-мужской.
        /// </summary>
        [Range(0, 2)]
        public int? Gender { get; set; }

        [StringLength(250)]
        public string Location { get; set; }
    }
}