using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using fitotrack.Entity.Enums;

namespace fitotrack.Types
{
    /// <summary>
    /// Класс описывающий типы интенсивности цели.
    /// </summary>
    public class GoalIntensity
    {
        #region __Поля__
        /// <summary>
        /// Максимальная интенсивность (кг/нед.).
        /// </summary>
        public readonly decimal maxGoalIntensity = 1M;
        /// <summary>
        /// Текущий тип интенсивности достижения цели.
        /// </summary>
        private int _currentGoalIntensityType = 0;
        #endregion

        #region __Свойства__
        public decimal Healthy { get { return 0.25M; } }
        public decimal Normal { get { return 0.5M; } }
        public decimal Aggressive { get { return maxGoalIntensity; } }
        #endregion

        #region __Конструкторы__
        /// <summary>
        /// Конструктор класса Intensity.
        /// </summary>
        /// <param name="intensity">Тип интенсивности.</param>
        public GoalIntensity(int intensity)
        {
            _currentGoalIntensityType = intensity;
        }
        #endregion

        #region __Методы__
        /// <summary>
        /// Метод установки типа интенсивности цели.
        /// </summary>
        /// <param name="intensity">Тип интенсивности.</param>
        public void SetIntensityType(int intensity)
        {
            _currentGoalIntensityType = intensity;
        }

        /// <summary>
        /// Метод получения типа интенсивности цели.
        /// </summary>
        public decimal GetIntensityType()
        {
            return _currentGoalIntensityType;
        }

        /// <summary>
        /// Метод получения количества килограмм в неделю в зависимости от интенсивности.
        /// </summary>
        public decimal GetIntensityInKgPerWeek()
        {
            switch (_currentGoalIntensityType)
            {
                case (int)GoalIntensityType.Healthy:
                    return this.Healthy;
                case (int)GoalIntensityType.Normal:
                    return this.Normal;
                case (int)GoalIntensityType.Aggressive:
                    return this.Aggressive;
                default:
                    return this.Healthy;
            }
        }
        #endregion
    }
}
