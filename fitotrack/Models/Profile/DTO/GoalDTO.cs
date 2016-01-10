using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Attributes;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace fitotrack.Models.Profile.DTO
{
    /// <summary>
    /// Data Transfer Object информации о цели пользователя.
    /// </summary>
    public class GoalDTO
    {
        [Required]
        public int GoalId { get; set; }
        [Range(0, 5)]
        public int GoalType { get; set; }
        [Range(0, 3)]
        public int Intensity { get; set; }
        [Range(0, 1000)]
        public decimal StartWeight { get; set; }
        [Range(0, 1000)]
        public decimal GoalWeight { get; set; }
        [Range(0, 15000)]
        public decimal? RDE { get; set; }
        public long? EstimatedFinishDate { get; set; }
        public long CreationTime { get; set; }
        public long? EndTime { get; set; }
    }
}