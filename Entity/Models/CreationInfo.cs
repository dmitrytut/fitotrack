using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fitotrack.Entity.Models
{
    /// <summary>
    /// Класс информации о создании записи в таблице.
    /// </summary>
    [ComplexType] 
    public class CreationInfo
    {
        /// <summary>
        /// Время создания записи в UTC-формате.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreationTimeUTC { get; set; }

        /// <summary>
        /// Время изменения записи в UTC-формате.
        /// </summary>
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime LastModifiedTimeUTC { get; set; }
    }
}
