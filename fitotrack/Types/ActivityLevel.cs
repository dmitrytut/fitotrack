using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using fitotrack.Entity.Enums;

namespace fitotrack.Types
{
  /// <summary>
  /// Класс описывающий уровни активности.
  /// </summary>
  public class PhysicalActivityLevel
  {
    #region __Поля__
    private int _currentLevel = 0;
    #endregion

    #region __Свойства__
    /// <summary>
    /// Сидячий образ жизни (Офисный рабочий, тренерующийся очень мало или вообще не тренерующийся)
    /// </summary>
    public decimal Sedentary { get { return 1.200M; } }
    /// <summary>
    /// Легкие нагрузки (1-3 простых тренировки в неделю)
    /// </summary>
    public decimal LightlyActive { get { return 1.375M; } }
    /// <summary>
    /// Умеренные нагрузки (Пробежка час в день)
    /// </summary>
    public decimal ModeratelyActive { get { return 1.550M; } }
    /// <summary>
    /// Высокие нагрузки (Плавание два часа в день)
    /// </summary>
    public decimal VeryActive { get { return 1.725M; } }
    /// <summary>
    /// Чрезвычайно высокие нагрузки (Профессиональный спортсмен, например велосипедист)
    /// </summary>
    public decimal ExtraActive { get { return 1.900M; } }
    
    public decimal CurrentLevel 
    { 
        get
        {
          switch (_currentLevel)
          {
            case (int)PhysicalActivityLevels.Sedentary:
            {
              return this.Sedentary;
            }
            case (int)PhysicalActivityLevels.LightlyActive:
            {
              return this.LightlyActive;
            }
            case (int)PhysicalActivityLevels.ModeratelyActive:
            {
              return this.ModeratelyActive;
            }
            case (int)PhysicalActivityLevels.VeryActive:
            {
              return this.VeryActive;
            }
            case (int)PhysicalActivityLevels.ExtraActive:
            {
              return this.ExtraActive;
            }
          }
          return (int)PhysicalActivityLevels.Unknown;
        }
    }
    #endregion

    #region __Конструкторы__
    /// <summary>
    /// Конструктор класса PhysicalActivityLevel.
    /// </summary>
    /// <param name="activityLevel">Уровень активности (1 Sedentary - 5 ExtraActive).</param>
    public PhysicalActivityLevel(int activityLevel)
	  {
      _currentLevel = activityLevel;
	  }
    #endregion

    #region __Методы__
    /// <summary>
    /// Метод установки уровня активности.
    /// </summary>
    /// <param name="activityLevel">Уровень активности (1 Sedentary - 5 ExtraActive).</param>
    public void SetActivityLevel(int activityLevel)
    {
      _currentLevel = activityLevel;
    }
    #endregion
  }
}
