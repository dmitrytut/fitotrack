using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace fitotrack.Entity.Attributes
{
  [Serializable]
  [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
  public sealed class PositiveDecimalAttribute : ValidationAttribute
  {
    protected override ValidationResult IsValid(Object value, ValidationContext validationContext)
    {
      Decimal decimalValue = Convert.ToDecimal(value);

      if (decimalValue >= 0)
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