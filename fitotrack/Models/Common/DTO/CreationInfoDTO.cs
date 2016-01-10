using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Common.DTO
{
    /// <summary>
    /// Data Transfer Object информации о создании. 
    /// </summary>
    public class CreationInfoDTO
    {
        [Required]
        public long CreationTime { get; set; }

        [Required]
        public long LastModifiedTime { get; set; }

    }
}