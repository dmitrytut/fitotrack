
namespace fitotrack.Entity.Enums
{
  #region __Перечисление PhysicalActivityLevels уровень активности пользователя__
  /// <summary>
  /// Уровень активности пользователя.
  /// </summary>
  public enum PhysicalActivityLevels
  {
    /// <summary>
    /// Неизвестный уровень активности
    /// </summary>
    Unknown,
    /// <summary>
    /// Сидячий образ жизни (Офисный рабочий, тренерующийся очень мало или вообще не тренерующийся)
    /// </summary>
    Sedentary,
    /// <summary>
    /// Легкие нагрузки (1-3 простых тренировки в неделю)
    /// </summary>
    LightlyActive,
    /// <summary>
    /// Умеренные нагрузки (Пробежка час в день)
    /// </summary>
    ModeratelyActive,
    /// <summary>
    /// Высокие нагрузки (Плавание два часа в день)
    /// </summary>
    VeryActive,
    /// <summary>
    /// Чрезвычайно высокие нагрузки (Профессиональный спортсмен, например велосипедист)
    /// </summary>
    ExtraActive
  }
  #endregion
}
