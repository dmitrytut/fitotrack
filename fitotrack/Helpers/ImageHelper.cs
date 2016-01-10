using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Web;

namespace fitotrack.Helpers
{
    /// <summary>
    /// Класс работы с изображениями.
    /// </summary>
    public class ImageHelper
    {
        /// <summary>
        /// Класс изменения масштаба изображения.
        /// </summary>
        /// <param name="image">Изображение для масштабирования.</param>
        /// <param name="maxWidth">Максимальная ширина изображения.</param>
        /// <param name="maxHeight">Максимальная высота изображения.</param>
        /// <returns>Изображение в переданном масштабе.</returns>
        public static Image ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = new Bitmap(newWidth, newHeight);
            Graphics.FromImage(newImage).DrawImage(image, 0, 0, newWidth, newHeight);
            return newImage;
        }

        /// <summary>
        /// Метод изменение размера изображения и центрирования. 
        /// </summary>
        /// <param name="original">Изображение для изменения размеров.</param>
        /// <param name="size">Требуемые размеры.</param>
        /// <returns>Отцентрированное изображение нужных размеров.</returns>
        public static Image Resize(Image original, Size size)
        {
            var resized = new Bitmap(original, size.Width, original.Height * size.Width / original.Width);

            if (resized.Height > size.Height)
            {
                var cropArea = new Rectangle(0, (resized.Height - size.Height) / 2, size.Width, size.Height);
                resized = resized.Clone(cropArea, resized.PixelFormat);
            }

            return resized;
        }
    }
}