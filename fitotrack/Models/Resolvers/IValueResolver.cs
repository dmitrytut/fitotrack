using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;

namespace fitotrack.Models.Converters
{
  public interface IValueResolver
  {
    ResolutionResult Resolve(ResolutionResult source);
  }
}