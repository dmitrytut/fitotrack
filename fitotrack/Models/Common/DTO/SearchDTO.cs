using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Common.DTO
{
    /// <summary>
    /// Data Transfer Object информации о поисковом запросе. 
    /// </summary>
    public class SearchDTO
    {
        public SearchDTO()
        {
            q = "";
            pn = 0;
            ps = 10;
        }

        /// <summary>
        /// Поисковый запрос.
        /// </summary>
        [StringLength(512)]
        public string q { get; set; }
        /// <summary>
        /// Номер страницы.
        /// </summary>
        [Range(0, int.MaxValue, ErrorMessage = "Page number must be greater or equal then 0.")]
        public int pn { get; set; }
        /// <summary>
        /// Размер страницы.
        /// </summary>
        [Range(1, 100, ErrorMessage = "Page size must be in a range between 1 and 100 inclusive.")]
        public int ps { get; set; }
    }
}