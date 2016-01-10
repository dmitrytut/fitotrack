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
    /// Класс описывающий типы цели.
    /// </summary>
    public class GoalType
    {
        #region __Поля__
        private int _currentType = 0;
        #endregion

        #region __Свойства__
        private decimal One { get { return 1; } }
        private decimal HalfAndQuarter { get { return 0.75M; } }
        private decimal Half { get { return 0.5M; } }
        private decimal Quarter { get { return 0.25M; } }

        /// <summary>
        /// Похудение на 1 кг в неделю.
        /// </summary>
        public decimal LoseOneKilogramPerWeek { get { return -1 * Units.CaloriesInOneKgFat * One; } }
        /// <summary>
        /// Похудение на 0.5 кг в неделю.
        /// </summary>
        public decimal LoseHalfKilogramPerWeek { get { return -1 * Units.CaloriesInOneKgFat * Half; } }
        /// <summary>
        /// Похудение на 0.25 кг в неделю.
        /// </summary>
        public decimal LoseQuarterKilogramPerWeek { get { return -1 * Units.CaloriesInOneKgFat * Quarter; } }
        /// <summary>
        /// Поддержание текущего веса.
        /// </summary>
        public decimal MaintainWeight { get { return 0; } }
        /// <summary>
        /// Набор массы на 0.25 кг в неделю.
        /// </summary>
        public decimal GainQuarterKilogramPerWeek { get { return Units.CaloriesInOneKgFat * Quarter; } }
        /// <summary>
        /// Набор массы на 0.5 кг в неделю.
        /// </summary>
        public decimal GainHalfKilogramPerWeek { get { return Units.CaloriesInOneKgFat * Half; } }
        /// <summary>
        /// Набор мышечной массы. Возвращает проценты для набора мышеной массы.
        /// </summary>
        public decimal GainMuscleMass
        {
            get
            {
                //return Units.CaloriesInOneKgMuscle * Quarter; 

                // Возвращаем процент на сколько нужно увеличить потребление калорий.
                return 20;
            }
        }

        /// <summary>
        /// Количество дефицита\профицита калорий в зависимости от цели. 
        /// </summary>
        //public decimal CurrentTypeCalories
        //{
        //    get
        //    {
        //        switch (_currentType)
        //        {
        //            case (int)GoalTypes.LoseOneKilogramPerWeek:
        //                {
        //                    return this.LoseOneKilogramPerWeek;
        //                }
        //            case (int)GoalTypes.LoseHalfKilogramPerWeek:
        //                {
        //                    return this.LoseHalfKilogramPerWeek;
        //                }
        //            case (int)GoalTypes.LoseQuarterKilogramPerWeek:
        //                {
        //                    return this.LoseQuarterKilogramPerWeek;
        //                }
        //            case (int)GoalTypes.GainQuarterKilogramPerWeek:
        //                {
        //                    return this.GainQuarterKilogramPerWeek;
        //                }
        //            case (int)GoalTypes.GainHalfKilogramPerWeek:
        //                {
        //                    return this.GainHalfKilogramPerWeek;
        //                }
        //            case (int)GoalTypes.GainMuscleMass:
        //                {
        //                    return this.GainMuscleMass;
        //                }
        //        }
        //        return (int)GoalTypes.Unknown;
        //    }
        //}

        /// <summary>
        /// Обозначение цели в килограммах.
        /// </summary>
        //public decimal CurrentTypeInKg
        //{
        //    get
        //    {
        //        switch (_currentType)
        //        {
        //            case (int)GoalTypes.LoseOneKilogramPerWeek:
        //                {
        //                    return -1 * this.One;
        //                }
        //            case (int)GoalTypes.LoseHalfKilogramPerWeek:
        //                {
        //                    return -1 * this.Half;
        //                }
        //            case (int)GoalTypes.LoseQuarterKilogramPerWeek:
        //                {
        //                    return -1 * this.Quarter;
        //                }
        //            case (int)GoalTypes.GainQuarterKilogramPerWeek:
        //                {
        //                    return this.Quarter;
        //                }
        //            case (int)GoalTypes.GainHalfKilogramPerWeek:
        //                {
        //                    return this.Half;
        //                }
        //            case (int)GoalTypes.GainMuscleMass:
        //                {
        //                    return this.Quarter;
        //                }
        //        }
        //        return (int)GoalTypes.Unknown;
        //    }
        //}
        #endregion

        #region __Конструкторы__
        /// <summary>
        /// Конструктор класса GoalType.
        /// </summary>
        /// <param name="goalType">Цель пользователя.</param>
        public GoalType(int goalType)
        {
            _currentType = goalType;
        }
        #endregion

        #region __Методы__
        /// <summary>
        /// Метод установки типа цели.
        /// </summary>
        /// <param name="goalType">Цель пользователя.</param>
        public void SetGoalType(int goalType)
        {
            _currentType = goalType;
        }

        /// <summary>
        /// Метод получения текущиго типа цели.
        /// </summary>
        public int GetGoalType()
        {
            return _currentType;
        }

        /// <summary>
        /// Метод получения количества веса (кг/нед) в соответствии 
        /// с целью и в зависимости от выбранной интенсивности.
        /// </summary>
        /// <param name="intensity">Тип интенсивности достижения цели.</param>
        /// <returns>Количество киллограм в неделю для достижения веса. 
        /// Ноль, положительное или отрицательное значение, в зависимости от типа цели.</returns>
        public decimal GetCurrentTypeInKg(int intensity)
        {
            GoalIntensity goalIntensity = new GoalIntensity(intensity);
            decimal intensityInKgPerWeek = goalIntensity.GetIntensityInKgPerWeek();

            switch(_currentType)
            {
                case (int)GoalTypes.LoseWeight:
                    return -1*intensityInKgPerWeek;
                case (int)GoalTypes.GainWeight:
                    return intensityInKgPerWeek;
                default:
                    return 0;
            }
        }
        #endregion
    }
}
