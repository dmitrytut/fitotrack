using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Profile.DTO
{
  /// <summary>
  /// Класс информации о взвешивании пользователя.
  /// </summary>
  public class UserWeightDTO
  {
    public int UserWeightId { get; set; }

    [Required]
    public long Date { get; set; }

    [Required]
    [Range(20, 1000)]
    public decimal Weight { get; set; }
  }
}