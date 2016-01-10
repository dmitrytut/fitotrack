using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace fitotrack.App_Code.DiskFileSystem
{

	#region __Класс DiskFileSystem репозиторий работы с дисковой файловой системой__

	/// <summary>
	/// Класс репозиторий работы с дисковой файловой системой
	/// </summary>
	public class DiskFileSystem : IFileSystem
	{

		#region __Поля__

		#region __Поле UploadFileMaxSize максимальный размер загружаемого файла__

		/// <summary>
		///  Максимальный размер загружаемого файла
		/// </summary>
		private const int UploadFileMaxSize = 0x05*1024*1024;

		#endregion

		#region __Поле ImageSize геометрический размер обработанного изображения__

		/// <summary>
		/// Геометрический размер обработанного изображения
		/// </summary>
		private static readonly Size ImageSize = new Size()
			{
				Height = 160,
				Width = 160
			};

		#endregion

		#region __Поле ImageFileNameTamplate шаблон имени файла изображения пользователя__

		/// <summary>
		///  Шаблон имени файла изображения пользовател
		/// </summary>
		private const string ImageFileNameTamplate = "Files\\UserImages\\Image_{0}.jpeg";

		#endregion

		#endregion

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
		public string SaveImageFile(HttpPostedFileBase imageFile,
																int userId,
		                            string rootDirectory,
		                            out string errorMessage)
		{
			errorMessage = null;
			if (imageFile.ContentLength > UploadFileMaxSize)
			{
				errorMessage = SharedRes.SharedStrings.UPLOAD_IMAGE_FILE_SIZE_ERROR;
				return null;
			}
			if (false == CheckImageType(imageFile))
			{
				errorMessage = SharedRes.SharedStrings.UPLOAD_IMAGE_FILE_TYPE_ERROR;
				return null;
			}
			var resizingImage = ResizeImage(Image.FromStream(imageFile.InputStream),
			                                ImageSize);
			Rectangle cropArea = new Rectangle(0,
			                                   0,
			                                   resizingImage.Width,
			                                   resizingImage.Height);
			if (ImageSize.Width < resizingImage.Width)
			{
				cropArea = new Rectangle((resizingImage.Width - ImageSize.Width)/2,
				                         0,
				                         ImageSize.Width,
				                         resizingImage.Height);
			}
			else if (ImageSize.Height < resizingImage.Height)
			{
				cropArea = new Rectangle(0,
				                         (resizingImage.Height - ImageSize.Height)/2,
				                         resizingImage.Width,
				                         ImageSize.Height);
			}
			var resultImage = CropImage(resizingImage,
			                            cropArea);
			var filePath = Path.Combine(Path.Combine(rootDirectory,
			                                         String.Format(ImageFileNameTamplate,
			                                                       userId)));
			if (false == Directory.Exists(Path.GetDirectoryName(filePath)))
			{
				Directory.CreateDirectory(Path.GetDirectoryName(filePath));
			}
			resultImage.Save(filePath);
			//TODO Разобраться как правильно уничтожать временные файлы
			GC.Collect(2, GCCollectionMode.Forced);
			return filePath;
		}

		#endregion

		#region __Метод DeleteFile удаления файла__

		/// <summary>
		/// Метод получения файла-изображения
		/// </summary>
		/// <param name="fileName"></param>
		/// <param name="userId"></param>
		/// <param name="rootDirectory"></param>
		/// <returns></returns>
		public bool DeleteFile(string fileName,
		                       int userId,
		                       string rootDirectory)
		{
			if (true == File.Exists(fileName))
			{
				File.Delete(fileName);
			}
			return true;
		}

		#endregion

		#region __Метод CheckImageType проверки типа передоваемого файла (изображение)__

		/// <summary>
		/// Метод проверки типа передоваемого файла (изображение)
		/// </summary>
		/// <param name="imageFile"></param>
		/// <returns></returns>
		private bool CheckImageType(HttpPostedFileBase imageFile)
		{
			var formats = new string[] {".jpg", ".png", ".gif", ".jpeg", ".bmp"};
			var allowedFormats = new[]
				{
					ImageFormat.Jpeg,
					ImageFormat.Png,
					ImageFormat.Gif,
					ImageFormat.Bmp
				};
			try
			{
				using (var imageStream = Image.FromStream(imageFile.InputStream))
				{
					if (false == imageFile.ContentType.Contains("image") ||
					    false == formats.Any(item => imageFile.FileName.ToLower()
					                                          .Contains(item)) ||
					    false == allowedFormats.Contains(imageStream.RawFormat))
					{
						return false;
					}
				}
			}
			catch
			{
				return false;
			}
			return true;
		}

		#endregion

		#region __Метод ResizeImage масштабирования изображения__

		/// <summary>
		/// _Метод масштабирования изображения
		/// </summary>
		/// <param name="imgToResize"></param>
		/// <param name="size"></param>
		/// <returns></returns>
		private static Image ResizeImage(Image imgToResize,
		                                 Size size)
		{
			int sourceWidth = imgToResize.Width;
			int sourceHeight = imgToResize.Height;
			float nPercentW = ((float) size.Width/(float) sourceWidth);
			float nPercentH = ((float) size.Height/(float) sourceHeight);
			float nPercent = nPercentH > nPercentW
				                 ? nPercentH
				                 : nPercentW;
			var destWidth = (int) (sourceWidth*nPercent);
			var destHeight = (int) (sourceHeight*nPercent);
			var bitmap = new Bitmap(destWidth,
			                        destHeight);
			var graphic = Graphics.FromImage((Image) bitmap);
			graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
			graphic.DrawImage(imgToResize,
			                  0,
			                  0,
			                  destWidth,
			                  destHeight);
			graphic.Dispose();
			return (Image) bitmap;
		}

		#endregion

		#region __Метод CropImage обрезки изображения__

		/// <summary>
		/// Метод обрезки изображения
		/// </summary>
		/// <param name="image"></param>
		/// <param name="cropArea"></param>
		/// <returns></returns>
		private static Image CropImage(Image image,
		                               Rectangle cropArea)
		{
			var bmpImage = new Bitmap(image);
			var bmpCrop = bmpImage.Clone(cropArea,
			                             bmpImage.PixelFormat);
			return (Image) (bmpCrop);
		}

		#endregion

		#endregion
	}

	#endregion
}