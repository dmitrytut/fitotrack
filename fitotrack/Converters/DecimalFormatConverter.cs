using System;
using System.Globalization;
using Newtonsoft.Json;

namespace fitotrack.Converters
{
  /// <summary>
  /// Конвертер для типа Decimal. Заменяет ',' на '.'.
  /// </summary>
  public class DecimalFormatConverter: JsonConverter
  {
    public override bool CanConvert(Type objectType)
    {
        return (objectType == typeof(decimal) || objectType == typeof(decimal?));
    }

    public override void WriteJson(
      JsonWriter writer, 
      object value, 
      JsonSerializer serializer)
    {
        writer.WriteValue(value);
    }

    public override object ReadJson(
      JsonReader reader, 
      Type objectType, 
      object existingValue, 
      JsonSerializer serializer)
    {
      if (reader.Value != null &&
          reader.Value.ToString().Length > 0)
      {
        try
        {
          string replacedValue = reader.Value.ToString().Replace(',', '.');

          return decimal.Parse(replacedValue, CultureInfo.InvariantCulture);
        }
        catch (Exception ex)
        { 
          throw new Exception(
            String.Format("Decimal coverting error. Message: {0}.", ex.Message));
        }
      }
      return null;
    }
  }
}