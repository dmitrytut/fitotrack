using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fitotrack.Types
{
  /// <summary>
  /// Класс описывающий различные единицы измерения и константы.
  /// </summary>
  public class Units
  {
    #region __Свойства__
    /// <summary>
    /// Количество калорий в одном фунте жира.
    /// </summary>
    public static decimal CaloriesInOnePoundFat { get { return 3500; } }
    /// <summary>
    /// Количество калорий в одном фунте мыщечной массы.
    /// </summary>
    public static decimal CaloriesInOnePoundMuscle { get { return 2500; } }
    /// <summary>
    /// Количество калорий в одном килограмме жира.
    /// </summary>
    public static decimal CaloriesInOneKgFat { get { return CaloriesInOnePoundFat * 2.2M; } }
    /// <summary>
    /// Количество калорий в одном килограмме мыщечной массы.
    /// </summary>
    public static decimal CaloriesInOneKgMuscle { get { return CaloriesInOnePoundMuscle * 2.2M; } }
    /// <summary>
    /// Минимальное количество калорий для рекомендованного потребления
    /// </summary>
    public static decimal MinRDE { get { return 1200; } }
    #endregion

    #region __Методы__
    /// <summary>
    /// Метод перевода килограммов(kg) в фунты (lbs).
    /// </summary>
    /// <param name="kilos">Килограммы.</param>
    /// <returns>Фунты.</returns>
    public static decimal ToPounds(decimal kilos)
    {
      return kilos * 2.2M;
    }

    /// <summary>
    /// Метод перевода фунтов (lbs) в килограммы(kg).
    /// </summary>
    /// <param name="lbs">Фунты.</param>
    /// <returns>Килограммы.</returns>
    public static decimal ToKilos(decimal lbs)
    {
      return lbs / 2.2M;
    }
    #endregion
  }
}
