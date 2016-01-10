using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace fitotrack.Entity.Models
{
	/// <summary>
	/// Модель таблицы параметров телосложения пользователя.
	/// </summary>
	public class BodyParameters
	{
		#region __Свойства__

		#region __Свойство BodyParametersId первичный ключ таблицы__
		/// <summary>
		/// Первичный ключ таблицы.
		/// </summary>
		[Key]
		public int BodyParametersId { get; set; }

		#endregion

		#region __Свойство Date дата замеров__

		/// <summary>
		/// Дата замеров.
		/// </summary>
		[Required]
		[DataType(DataType.DateTime)]
		public DateTime Date { get; set; }

		#endregion

		#region __Свойство Neck окружность шеи__

		/// <summary>
		/// Окружность шеи.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Neck { get; set; }

		#endregion

		#region __Свойство Chest окружность груди__

		/// <summary>
		/// Окружность груди.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Chest { get; set; }

		#endregion

		#region __Свойство Shoulders окружность плеч__

		/// <summary>
		/// Окружность плеч.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Shoulders { get; set; }

		#endregion

		#region __Свойство Waist окружность талии__

		/// <summary>
		/// Окружность талии.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Waist { get; set; }

		#endregion

		#region __Свойство Arms окружность рук (бицепс, трицепс)__

		/// <summary>
		/// Окружность рук (бицепс, трицепс).
		/// </summary>
		[Range(0, 1000)]
		public decimal? Arms { get; set; }

		#endregion

		#region __Свойство Forearms окружность предплечий__

		/// <summary>
		/// Окружность предплечий.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Forearms { get; set; }

		#endregion

		#region __Свойство Hip окружность ягодиц__

		/// <summary>
		/// Окружность ягодиц.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Hip { get; set; }

		#endregion

		#region __Свойство Thigs окружность бедер__

		/// <summary>
		/// Окружность бедер.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Thigs { get; set; }

		#endregion

		#region __Свойство Calves окружность икр__

		/// <summary>
		/// Окружность икр.
		/// </summary>
		[Range(0, 1000)]
		public decimal? Calves { get; set; }

		#endregion

		#region __Свойство BodyFatPercent процент жира от общей массы пользователя__

		/// <summary>
		/// Процент жира от общей массы пользователя.
		/// </summary>
		[Range(0, 100)]
		public decimal? BodyFatPercent { get; set; }

		#endregion

		/// <summary>
		/// Foreign key для CreateUser
		/// </summary>
		[Required]
		public int CreateUserId { get; set; }

		/// <summary>
		/// Профиль пользователя.
		/// </summary>
		[ForeignKey("CreateUserId")]
		public virtual UserProfile UserProfile { get; set; }

		#endregion
	}
}