using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Profile
{
  /// <summary>
  /// Базовый класс дл профиля пользователя.
  /// </summary>
  public class UserProfileBase
  {
    [Required]
    public int UserId { get; set; }
  }
}