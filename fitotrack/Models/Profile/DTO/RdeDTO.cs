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
    /// Data Transfer Object информации для подсчета RDE (Recommended Daily Expenditure).
    /// </summary>
    public class RdeDTO
    {
        [Required]
        [JsonProperty("physicalInfoEx")]
        public PhysicalInfoExDTO physicalInfoExDTO { get; set; }
        [Required]
        [JsonProperty("goal")]
        public GoalDTO goalDTO { get; set; }
    }
}