using fitotrack.Data;
using fitotrack.Entity.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fitotrack.Repository.Auth
{
    /// <summary>
    /// Класс-репозиторий для работы с аутентификацией.
    /// </summary>
    public class AccountRepository : IDisposable
    {
        #region __Поля__

        private FitotrackContext _ctx = null;
        private ApplicationUserManager _userManager = null;
        private ApplicationSignInManager _signInManager = null;

        #endregion

        #region __Конструкторы__

        /// <summary>
        /// Конструктор репозитория аутентификации.
        /// </summary>
        /// <param name="userManager">Менеджер работы с пользователями.</param>
        /// <param name="signInManager">Менеджер операции аутентификации.</param>
        public AccountRepository(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        #endregion

        #region __Свойства__

        /// <summary>
        /// Контекст базы данных.
        /// </summary>
        public FitotrackContext Ctx
        {
            get
            {
                return _ctx ?? new FitotrackContext();
            }
            private set
            {
                _ctx = value;
            }
        }

        /// <summary>
        /// Менеджер работы с пользователями.
        /// </summary>
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager;
            }
        }

        /// <summary>
        /// Менеджер операции аутентификации.
        /// </summary>
        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager;
            }
        }

        #endregion

        #region __Методы__

        /// <summary>
        /// Метод аутентификации пользователя в системе.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <param name="isPersistent">Запоминать пользователя в системе.</param>
        /// <param name="shouldLockout">Если нужна блокировка пользователя после 
        /// опредеденного количества неправильных попыток входа</param>
        /// <returns>Результат типа SignInStatus.</returns>
        public async Task<SignInStatus> Login(string email, string password, bool isPersistent, bool shouldLockout = false)
        {
            var result = await SignInManager.PasswordSignInAsync(email, password, isPersistent, shouldLockout);

            return result;
        }

        /// <summary>
        /// Двухфакторная аутентификация пользователя в системе.
        /// </summary>
        /// <param name="provider">Имя провайдера двухфакторной аутентификации.</param>
        /// <param name="code">Код верификации.</param>
        /// <param name="isPersistent">Запоминать пользователя в системе.</param>
        /// <param name="rememberBrowser">Запомнить браузер.</param>
        /// <returns>Результат типа SignInStatus.</returns>
        public async Task<SignInStatus> TwoFactorSignInAsync(string provider, string code, bool isPersistent, bool rememberBrowser)
        {
            var result = await SignInManager.TwoFactorSignInAsync(provider, code, isPersistent, rememberBrowser);

            return result;
        }

        /// <summary>
        /// Метод регистрации пользователя в БД.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <returns>Результат типа IdentityResult.</returns>
        public async Task<IdentityResult> RegisterUser(string email, string password)
        {
            var user = new ApplicationUser()
            {
                Email = email,
                UserName = email
            };

            IdentityResult result = await UserManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
            }

            return result;
        }

        /// <summary>
        /// Метод получения кода верификации.
        /// </summary>
        /// <param name="provider">Имя провайдера двухфакторной аутентификации.</param>
        /// <returns></returns>
        public async Task<string> VerifyCode(string provider)
        {
            // Require that the user has already logged in via username/password or external login.
            if (await SignInManager.HasBeenVerifiedAsync())
            {
                var user = await UserManager.FindByIdAsync(await SignInManager.GetVerifiedUserIdAsync());
                if (user != null)
                {
                    var code = await UserManager.GenerateTwoFactorTokenAsync(user.Id, provider);
                    
                    return code;
                }
            }

            return null;
        }

        /// <summary>
        /// Метод подтверждения email пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="code">Код верификации.</param>
        /// <returns></returns>
        public async Task<IdentityResult> ConfirmEmail(int userId, string code)
        {
            var result = await UserManager.ConfirmEmailAsync(userId, code);

            return result;
        }

        /// <summary>
        /// Метод проверки подтвержден ли email.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <returns></returns>
        public async Task<bool> IsEmailConfirmed(int userId)
        {
            var result = await UserManager.IsEmailConfirmedAsync(userId);

            return result;
        }

        /// <summary>
        /// Метод сброса пароля пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="code">Код сброса пароля.</param>
        /// <param name="password">Новый пароль пользователя.</param>
        /// <returns></returns>
        public async Task<IdentityResult> ResetPassword(int userId, string code, string newPassword)
        {
            var result = await UserManager.ResetPasswordAsync(userId, code, newPassword);

            return result;
        }

        /// <summary>
        /// Метод смены пароля пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="currentPassword">Текущий пароль пользователя.</param>
        /// <param name="password">Новый пароль пользователя.</param>
        /// <returns></returns>
        public async Task<IdentityResult> ChangePassword(int userId, string currentPassword, string newPassword)
        {
            var result = await UserManager.ChangePasswordAsync(userId, currentPassword, newPassword);

            return result;
        }

        /// <summary>
        /// Метод поиска пользователя в БД.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <returns>Результат типа ApplicationUser.</returns>
        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            ApplicationUser user = await UserManager.FindAsync(userName, password);

            return user;
        }

        /// <summary>
        /// Метод поиска пользователя по email в БД.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <returns>Результат типа ApplicationUser.</returns>
        public async Task<ApplicationUser> FindUserByEmail(string email)
        {
            ApplicationUser user = await UserManager.FindByEmailAsync(email);

            return user;
        }

        /// <summary>
        /// Метод поиска пользователя по email в БД.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <returns>Результат типа ApplicationUser.</returns>
        public async Task<ApplicationUser> FindUserById(int userId)
        {
            ApplicationUser user = await UserManager.FindByIdAsync(userId);

            return user;
        }

        /// <summary>
        /// Метод освобождения ресурсов.
        /// </summary>
        public void Dispose()
        {
            Ctx.Dispose();
            UserManager.Dispose();
            SignInManager.Dispose();
        }

        #endregion
    }
}
