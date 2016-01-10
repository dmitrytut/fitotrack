using fitotrack.Data;
using fitotrack.Entity.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
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
    public class AuthRepository : IDisposable
    {
        #region __Поля__

        private FitotrackContext _ctx;
        private ApplicationUserManager _userManager;

        #endregion

        #region __Конструкторы__

        /// <summary>
        /// Конструктор репозитория аутентификации.
        /// </summary>
        /// <param name="userManager">Менеджер работы с пользователями.</param>
        public AuthRepository(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        #endregion

        #region __Свойства__

        /// <summary>
        /// Контект базы данных.
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

        #endregion

        #region __Методы__

        /// <summary>
        /// Метод регистрации пользователя в БД.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <returns>Результат типа IdentityResult.</returns>
        //public async Task<IdentityResult> RegisterUser(string email, string password)
        //{
        //    var user = new ApplicationUser()
        //    {
        //        Email = email,
                
        //    };
        //    UserManager.AddLoginAsync()
        //    IdentityResult result = await UserManager.CreateAsync(user, password);

        //    return result;
        //}

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

            return result;
        }

        /// <summary>
        /// Метод установки нового пароля пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="newPassword">Новый пароль.</param>
        /// <returns>Результат типа IdentityResult.</returns>
        public async Task<IdentityResult> SetUserPassword(int userId, string newPassword)
        {
            IdentityResult result = await UserManager.AddPasswordAsync(userId, newPassword);

            return result;
        }

        /// <summary>
        /// Метод смены пароля пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="oldPassword">Старый пароль.</param>
        /// <param name="newPassword">Новый пароль.</param>
        /// <returns>Результат типа IdentityResult.</returns>
        public async Task<IdentityResult> ChangeUserPassword(int userId, string oldPassword, string newPassword)
        {
            IdentityResult result = await UserManager.ChangePasswordAsync(userId, oldPassword, newPassword);

            return result;
        }

        /// <summary>
        /// Метод поиска пользователя в БД.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <returns>Результат типа IdentityResult.</returns>
        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            ApplicationUser user = await UserManager.FindAsync(userName, password);

            return user;
        }

        /// <summary>
        /// Метод освобождения ресурсов.
        /// </summary>
        public void Dispose()
        {
            Ctx.Dispose();
            UserManager.Dispose();
        }

        #endregion
    }
}
