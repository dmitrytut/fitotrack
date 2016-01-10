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
    /// Data Transfer Object статуса текущего пользователя.
    /// </summary>
    public class StatusDTO
    {
        [StringLength(250)]
        public string Status { get; set; }

    }
}