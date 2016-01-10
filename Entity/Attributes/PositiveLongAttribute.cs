using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Entity.Attributes
{
  [Serializable]
  [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
  public sealed class PositiveLongAttribute : ValidationAttribute
  {
    protected override ValidationResult IsValid(Object value, ValidationContext validationContext)
    {
      Decimal longValue = Convert.ToInt64(value);

      if (longValue >= 0)
      {
        return (ValidationResult.Success);
      }
      else
      {
        return (new ValidationResult("Value cannot be negative."));
      }
    }
  }
}