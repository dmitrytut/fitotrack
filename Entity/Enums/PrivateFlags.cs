
namespace fitotrack.Entity.Enums
{
  #region __Перечисление PrivacyFlags уровеня приватности профиля пользователя__
  /// <summary>
  /// Флаг приватности профиля пользователя. 
  /// 0 - Доступен всем.
  /// 1 - Доступен только друзьям.
  /// 2 - Доступен только облателю.
  /// </summary>
  public enum PrivacyFlags
  {
    All = 0,
    OnlyFriends,
    Private
  }
  #endregion
}
