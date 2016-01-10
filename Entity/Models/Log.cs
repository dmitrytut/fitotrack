using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using fitotrack.Entity.Attributes;


namespace fitotrack.Entity.Models
{
  /// <summary>
  /// Модель таблицы логгирования
  /// </summary>
  public class Log
  {
    #region __Свойства__

    /// <summary>
    /// Первичный ключ таблицы
    /// </summary>
    [Key]
    public int LogId { get; set; }
    /// <summary>
    /// Уровень логирования.
    /// </summary>
    [Required]
    public String LogLevel { get; set; }
    /// <summary>
    /// Время создания цели.
    /// </summary>
    [Required]
    public DateTime CreationTime { get; set; }
    /// <summary>
    /// Сообщение об ошибке.
    /// </summary>
    [Required]
    public String Message { get; set; }
    /// <summary>
    /// Сообщение исключения.
    /// </summary>
    public String ExceptionString { get; set; }
    #endregion
  }
}