using fitotrack.Helpers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace fitotrack.Providers
{
    public class UserImageMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        private string _fileName;
        public string FileName { 
            get {
                return _fileName;
            }
        }
        private string ImageExtension { get; set; }
        private int CurrentUserID { get; set; }
        public UserImageMultipartFormDataStreamProvider(string path, int currentUserId, string imageExtension)
            : base(path)
        {
            if (currentUserId <= 0)
            {
                throw new ArgumentException(ExceptionsRes.ExceptionsStrings.InvalidUserId, "currentUserId");
            }
            if (imageExtension == null)
            {
                throw new ArgumentNullException("imageExtension");
            }
            CurrentUserID = currentUserId;
            ImageExtension = imageExtension;
        }
        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            if (headers == null)
            {
                throw new ArgumentNullException("headers");
            }

            string currentUserHash = CryptHelper.CalculateMD5(CurrentUserID.ToString());
            _fileName = String.Format(CultureInfo.InvariantCulture, "{0}.{1}", currentUserHash, ImageExtension);
            return _fileName;
        }
    }
}