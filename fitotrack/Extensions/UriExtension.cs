using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace fitotrack.Extensions
{
    /// <summary>
    /// Расширения для класс Uri.
    /// </summary>
    public static class UriExtensions
    {
        /// <summary>
        /// Метод совмещения частей Uri-адреса.
        /// </summary>
        /// <param name="relativeBaseUri">Относительный Uri к которому нужно присоединить другую часть.</param>
        /// <param name="relativeUri">Относительный Uri - часть, которую нужно присоеденить.</param>
        /// <returns></returns>
        public static Uri Combine(this Uri relativeBaseUri, Uri relativeUri)
        {
            if (relativeBaseUri == null)
            {
                throw new ArgumentNullException("relativeBaseUri");
            }

            if (relativeUri == null)
            {
                throw new ArgumentNullException("relativeUri");
            }

            string baseUrl = VirtualPathUtility.AppendTrailingSlash(relativeBaseUri.ToString());
            string combinedUrl = VirtualPathUtility.Combine(baseUrl, relativeUri.ToString());

            return new Uri(combinedUrl, UriKind.Relative);
        }
    }

}