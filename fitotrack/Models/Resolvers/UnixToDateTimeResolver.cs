using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using fitotrack.Helpers;

namespace fitotrack.Models.Converters
{
  public class UnixToDateTimeResolver : ValueResolver<long, DateTime>
  {
    protected override DateTime ResolveCore(long unixMsTimestamp)
    {
      return TimeHelper.FromUnixMsToDateTime(unixMsTimestamp);
    }
  }
  public class UnixToDateTimeResolverNullable : ValueResolver<long?, DateTime?>
  {
    protected override DateTime? ResolveCore(long? unixMsTimestamp)
    {
      if (unixMsTimestamp.HasValue)
        return TimeHelper.FromUnixMsToDateTime(unixMsTimestamp.Value);
      return null;
    }
  }
}