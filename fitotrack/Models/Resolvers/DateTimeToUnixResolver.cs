using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using fitotrack.Helpers;

namespace fitotrack.Models.Converters
{
  public class DateTimeToUnixResolver : ValueResolver<DateTime, long>
  {
    protected override long ResolveCore(DateTime dateTime)
    {
      return TimeHelper.FromDateTimeToUnixMs(dateTime);
    }
  }
  public class DateTimeToUnixResolverNullable : ValueResolver<DateTime?, long?>
  {
    protected override long? ResolveCore(DateTime? dateTime)
    {
      if (dateTime.HasValue)
        return TimeHelper.FromDateTimeToUnixMs(dateTime.Value);
      return null;
    }
  }
}