using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Common
{
    /// <summary>
    /// Модель ошибки.
    /// </summary>
    public class JSONError
    {
        public bool Error { get{ return true; } }
        public IEnumerable<string> Messages { get; set; }
    }
}