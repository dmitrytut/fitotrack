using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using fitotrack.Entity.Models;
using fitotrack.Providers;
using fitotrack.Results;
using fitotrack.Models.Auth;
using fitotrack.Repository.Auth;
using System.Net;
using System.Text;
using System.IO;

namespace fitotrack.Controllers
{
    /// <summary>
    /// Web Api контроллер управления аутентификацией с помощью токенов.
    /// </summary>
    [Authorize]
    [RoutePrefix("api/Auth")]
    //[Filters.ExceptionHandler]
    public class AuthController : ApiController
    {
        #region __Поля__

        private AuthRepository _repo = null;
        private const string LocalLoginProvider = "Local";

        #endregion

        #region __Конструкторы__

        public AuthController()
        {
            //if (Request != null)
            //{
            //    _repo = new AuthRepository(Request.GetOwinContext().GetUserManager<ApplicationUserManager>());
            //}
        }

        //public AuthController(ApplicationUserManager userManager,
        //    ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        //{
        //    UserManager = userManager;
        //    AccessTokenFormat = accessTokenFormat;
        //}
        #endregion

        #region __Свойства__

        /// <summary>
        /// Репозиторий типа AuthRepository для операций работы с токенами.
        /// </summary>
        public AuthRepository Repo
        {
            get
            {
                return _repo ?? new AuthRepository(Request.GetOwinContext().GetUserManager<ApplicationUserManager>());
            }
            private set
            {
                _repo = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        #endregion

        #region __Методы__


        //// GET api/Auth/oauth
        //public class BCDTO
        //{
        //    public string code { get; set; }
        //    public string scope { get; set; }
        //    public string context { get; set; }
        //}
        //[HttpGet]
        //[AllowAnonymous]
        //[Route("Oauth")]
        //public IHttpActionResult Oauth([FromUri]BCDTO bc)
        //{
        //    string url = "https://login.bigcommerce.com/oauth2/token";
        //    System.Collections.Specialized.NameValueCollection outgoingQueryString = HttpUtility.ParseQueryString(String.Empty);
        //    outgoingQueryString.Add("client_id", "5zxadn42pc4xfecyzqoiatp5wan1a85");
        //    outgoingQueryString.Add("client_secret", "fuvn6jxuhny5xenajr9ojvmjso5i2kz");
        //    outgoingQueryString.Add("code", bc.code);
        //    outgoingQueryString.Add("scope", bc.scope);
        //    outgoingQueryString.Add("grant_type", "authorization_code");
        //    outgoingQueryString.Add("redirect_uri", "http://http://fitotrack.azurewebsites.net/api/auth/oauth");
        //    outgoingQueryString.Add("context", bc.context);
        //    string postData = outgoingQueryString.ToString();
        //    ASCIIEncoding ascii = new ASCIIEncoding();
        //    byte[] postBytes = ascii.GetBytes(postData.ToString());

        //    string result = "";
        //    //using (System.Net.WebClient client = new System.Net.WebClient())
        //    //{
        //    //    byte[] response =
        //    //    client.UploadValues(url, postData);

        //    //    result = System.Text.Encoding.UTF8.GetString(response);
        //    //}

        //    // set up request object
        //    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);

        //    request.Method = "POST";
        //    request.ContentType = "application/x-www-form-urlencoded";
        //    request.ContentLength = postBytes.Length;
        //    request.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";

        //    // add post data to request
        //    Stream postStream = request.GetRequestStream();
        //    postStream.Write(postBytes, 0, postBytes.Length);
        //    postStream.Flush();
        //    postStream.Close();

        //    WebResponse response = request.GetResponse();

        //    return Ok<String>("Result: " + result);
        //}








        // POST api/Auth/Logout
        /// <summary>
        /// Метод завершения сессии.
        /// </summary>
        /// <returns>Ответ типа IHttpActionResult.</returns>
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            //Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            Authentication.SignOut();
            return Ok();
        }

        // POST api/Auth/Register
        /// <summary>
        /// Метод регистрации пользователя.
        /// </summary>
        /// <param name="model">Модель типа RegisterBindingModel с данными пользователя.</param>
        /// <returns>Ответ типа IHttpActionResult.</returns>
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await Repo.RegisterUser(model.Email, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }


        // POST api/Auth/SetPassword
        /// <summary>
        /// Метод установки пароля пользователя.
        /// </summary>
        /// <param name="model">Модель типа SetPasswordBindingModel с информацией о новом пароле пользователя.</param>
        /// <returns>Ответ типа IHttpActionResult.</returns>
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            // Пока запрещенный метод.
            return BadRequest();

            if (model == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await Repo.SetUserPassword(User.Identity.GetUserId<int>(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Auth/ChangePassword
        /// <summary>
        /// Метод смены пароля пользователя.
        /// </summary>
        /// <param name="model">Модель типа ChangePasswordBindingModel с информацией о паролях.</param>
        /// <returns></returns>
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await Repo.ChangeUserPassword(User.Identity.GetUserId<int>(), model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Auth/ManageInfo?returnUrl=%2F&generateState=true
        [Route("ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            var user = await Repo.UserManager.FindByIdAsync(User.Identity.GetUserId<int>());

            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

            foreach (CustomUserLogin linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }

        // GET api/Auth/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await Repo.UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(Repo.UserManager,
                   OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(Repo.UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }

            return Ok();
        }


        // GET api/Auth/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

        /// <summary>
        /// Метод освобождения ресурсов.
        /// </summary>
        /// <param name="disposing">Флаг указывающий необходимость освобождения ресурсов.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_repo != null)
                {
                    _repo.Dispose();
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers

        /// <summary>
        /// Метод формирования ошибки.
        /// </summary>
        /// <param name="result">Результат типа IdentityResult.</param>
        /// <returns>Ответ типа IHttpActionResult.</returns>
        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (result != null && ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion

        #endregion
    }
}