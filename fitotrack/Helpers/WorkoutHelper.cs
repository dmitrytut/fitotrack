using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using fitotrack.Entity.Enums;
using fitotrack.Types;

namespace fitotrack.Helpers
{
    /// <summary>
    /// Класс различных полезных методов для упражнений и тренировок.
    /// </summary>
    public class WorkoutHelper
    {
        #region __Поля__
        #endregion

        #region __Методы__
        /// <summary>
        /// Расчет сожженных калорий в результате выполнения упражнения с известным Metabolic Equivalent of Task (MET).
        /// Формула представлена в статье American College of Sports Medicine (ACSM)
        /// по адресу: http://www.acsm.org/access-public-information/acsm's-sports-performance-center/factors-that-influence-daily-calorie-needs"
        /// </summary>
        /// <param name="MET">Значение Metabolic Equivalent of Task (MET) упражнения.</param>
        /// <param name="weight">Вес пользователя в килограммах.</param>
        /// <param name="time">Время выполнения упражнения в минутах.</param>
        /// <returns>Количество сожженных калорий за время выполнения упражнения.</returns>
        public static decimal GetBurnedCalories(decimal MET, decimal weight, decimal time)
        {
            decimal burnedCalories = 0;
            if (MET != 0 && weight != 0 && time != 0 )
            {
                burnedCalories = ((MET * 3.5M * weight) / 200) * time;
            }
            return burnedCalories;
        }

        /// <summary>
        /// Расчет сожженных калорий в результате выполнения упражнения при подсчитанной частоте сердечного ритма.
        /// Формула для расчета взята из труда:
        /// "Prediction of energy expenditure from heart rate monitoring during submaximal exercise."
        /// Авторы: LR Keytel, JH Goedecke, TD Noakes, H Hiiloskorpi, R Laukkanen, L van der Merwe, EV Lambert.
        /// </summary>
        /// <param name="HR">Значение сердечного ритма в течении упражнения в ударах за минуту.</param>
        /// <param name="gender">Пол пользователя. М=1, Ж=2.</param>
        /// <param name="age">Возраст пользователя в годах.</param>
        /// <param name="weight">Вес пользователя в килограммах.</param>
        /// <param name="time">Время выполнения упражнения в минутах.</param>
        /// <returns>Количество сожженных калорий за время выполнения упражнения.</returns>
        public static decimal GetBurnedCalories(int HR, int gender, int age, decimal weight, decimal time)
        {
            // Формулы (VO2Max неизвестно):
            // Male: ((-55.0969 + (0.6309 x HR) + (0.1988 x W) + (0.2017 x A))/4.184) x 60 x T
            // Female: ((-20.4022 + (0.4472 x HR) - (0.1263 x W) + (0.074 x A))/4.184) x 60 x T,
            // где 
            // HR = Heart rate (удары в минуту) 
            // W = Weight (в килограммах) 
            // A = Age (в годах) 
            // T = Exercise duration time (в часах)    
            // NB!!! 
            // В коде формула изменена для использования времени в минутах.

            decimal burnedCalories = 0;
            if (HR != 0 && age != 0 && weight != 0 && time != 0)
            {
                if (gender == (int)Genders.Male)
                {
                    // Изменена оригинальная формула для использования времени в минутах.
                    burnedCalories = ((-55.0969M + (0.6309M * HR) + (0.1988M * weight) + (0.2017M * age)) / 4.184M) * time;
                }
                else
                {
                    if (gender == (int)Genders.Female)
                    {
                        // Изменена оригинальная формула для использования времени в минутах.
                        burnedCalories = ((-20.4022M + (0.4472M * HR) - (0.1263M * weight) + (0.074M * age)) / 4.184M) * time;
                    }
                    else
                    {
                        throw new ArgumentException("Gender must be specified.", "gender");
                    }
                }
            }
            return burnedCalories;
        }
        #endregion
    }
}