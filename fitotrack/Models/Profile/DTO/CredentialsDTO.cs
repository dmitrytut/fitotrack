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
    /// Data Transfer Object информации о параметрах удостоверения личности пользователя.
    /// </summary>
    public class CredentialsDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}