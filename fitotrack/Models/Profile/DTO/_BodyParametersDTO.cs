using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Profile.DTO
{
  /// <summary>
  /// Расширенный класс информации о телосложении пользователя.
  /// </summary>
  public class BodyParametersDTO
  {
    [Required]
    public int BodyParametersId { get; set; }

    [Required]
    public long Date { get; set; }

    [Range(0, 1000)]
    public decimal? Weight { get; set; }

    //[Range(0, 1000)]
    //public decimal? Neck { get; set; }

    //[Range(0, 1000)]
    //public decimal? Chest { get; set; }

    //[Range(0, 1000)]
    //public decimal? Shoulders { get; set; }

    //[Range(0, 1000)]
    //public decimal? Waist { get; set; }

    //[Range(0, 1000)]
    //public decimal? Arms { get; set; }

    //[Range(0, 1000)]
    //public decimal? Forearms { get; set; }

    //[Range(0, 1000)]
    //public decimal? Hip { get; set; }

    //[Range(0, 1000)]
    //public decimal? Thigs { get; set; }

    //[Range(0, 1000)]
    //public decimal? Calves { get; set; }

    //[Range(0, 100)]
    //public decimal? BodyFatPercent { get; set; }
  }
}