using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using fitotrack.Entity.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using fitotrack.Models.Workout.DTO;

namespace fitotrack.Models.Meal
{
    /// <summary>
    /// Модель результата поиска упражнений. 
    /// </summary>
    public class ExerciseSearchResults
    {
        public IEnumerable<ExerciseDTO> Results { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalResults { get; set; }
    }
}