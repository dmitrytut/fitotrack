using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace fitotrack.App_Code.DiskFileSystem
{
	#region __Интерфейс IFileSystem - репозиторий работы с системой хранения файлов__

	/// <summary>
	/// Интерфейс - репозиторий работы с системой хранения файлов
	/// </summary>
	public interface IFileSystem
	{
		#region __Методы__

		#region __Метод SaveImageFile сохранения файла-изображения__

		/// <summary>
		/// Метод сохранения файла-изображения
		/// </summary>
		/// <param name="imageFile"></param>
		/// <param name="userId"></param>
		/// <param name="rootDirectory"></param>
		/// <param name="errorMessage"></param>
		/// <returns></returns>
		string SaveImageFile(HttpPostedFileBase imageFile,
		                     int userId,
		                     string rootDirectory,
		                     out string errorMessage);

		#endregion

		#region __Метод DeleteFile удаления файла__

		/// <summary>
		/// Метод получения файла-изображения
		/// </summary>
		/// <param name="fileName"></param>
		/// <returns></returns>
		bool DeleteFile(string fileName,
		                int userId,
		                string rootDirectory);

		#endregion

		#endregion
	}

	#endregion
}