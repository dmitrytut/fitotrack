

namespace fitotrack.Entity.Models
{
	#region __Класс Message модель таблицы сообщений__
	/// <summary>
	/// Модель таблицы сообщений
	/// </summary>
  public class Message 
	{
		#region __Свойства__
		
		#region __Свойство MessageId первичный ключ__
		/// <summary>
		/// Первичный ключ
		/// </summary>
		public int MessageId { get; set; }
		#endregion

		#region __Свойство User профиль пользователя отправителя сообщения__
		/// <summary>
		/// Профиль пользователя отправителя сообщения
		/// </summary>
		public virtual UserProfile User { get; set; }
		#endregion

		#region __Свойство Friend профиль пользователя - друга получателя сообщения__
		/// <summary>
		/// Профиль пользователя - друга получателя сообщения
		/// </summary>
		public virtual UserProfile Friend { get; set; }
		#endregion

		#region __Свойство MessageText текст сообщения__
		/// <summary>
		/// Текст сообщения
		/// </summary>
		public string MessageText { get; set; }

		#endregion

		#region __Свойство MessageType тип сообщения__
		/// <summary>
		/// Тип сообщения
		/// </summary>
		public int MessageType { get;set; }
		#endregion

		#region __Свойство NewMessage флаг идентификации нового сообщения__
		/// <summary>
		/// Флаг идентификации нового сообщения
		/// </summary>
		public bool NewMesssage { get;set; }
		#endregion

		#endregion
	}
	#endregion
}