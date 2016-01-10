using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using fitotrack.Entity.Enums;
using fitotrack.Types;

namespace fitotrack.Helpers
{
    /// <summary>
    /// Класс различных полезных методов из области питания.
    /// </summary>
    public class FoodHelper
    {
        #region __Поля__
        #endregion
        #region __Методы__
        /// <summary>
        /// Расчет  ИМТ - Body Mass Index (BMI).
        /// </summary>
        /// <param name="weight">Вес (кг).</param>
        /// <param name="height">Рост (cм).</param>
        /// <returns>Значение Body Mass Index (BMI) пользователя.</returns>
        public static decimal GetBMI(decimal weight, decimal height)
        {
            // Переводим рост в метры
            height = height / 100;
            return Helpers.Utilities.RoundAFZ(weight / (height * height));
        }

        /// <summary>
        /// Расчет Basal Metabolic Rate (BMR) по формуле Миффлина - Сан Жеора (Mifflin – St. Jeor).
        /// </summary>
        /// <param name="gender">Пол.</param>
        /// <param name="weight">Вес (кг).</param>
        /// <param name="height">Рост (см).</param>
        /// <param name="age">Возраст.</param>
        /// <returns>Значение Basal Metabolic Rate (BMR) пользователя.</returns>
        public static decimal GetBMRMifflin(int gender, decimal weight, decimal height, int age)
        {
            decimal bmr = 0;
            if (gender == (int)Genders.Male)
            {
                //
                // Формула для мужчин:
                // 9.99*вес(кг) + 6.25*рост(см) - 4.92*возраст(лет) + 5
                bmr = 9.99M * weight + 6.25M * height - 4.92M * age + 5;
            }
            else
                if (gender == (int)Genders.Female)
                {
                    //
                    // Формула для женщин:
                    // 9.99*вес(кг) + 6.25*рост(см) - 4.92*возраст(лет) - 161
                    bmr = 9.99M * weight + 6.25M * height - 4.92M * age - 161;
                }
                else
                {
                    throw new ArgumentException("Gender must be specified.", "gender");
                }

            return Helpers.Utilities.RoundAFZ(bmr, 2);
        }

        /// <summary>
        /// Расчет Basal Metabolic Rate (BMR) по формуле Каннингхэма (Cunningham).
        /// Используется, в основном, для людей с ярковыраженной мускулатурой.
        /// </summary>
        /// <param name="weight">Вес (кг).</param>
        /// <param name="bodyfat">Процент жировой массы.</param>
        /// <returns>Значение Basal Metabolic Rate (BMR) пользователя.</returns>
        public static decimal GetBMRCunningham(decimal weight, decimal bodyfat)
        {
            Utilities.ThrowArgumentNullException(weight, "weight");
            Utilities.ThrowArgumentNullException(bodyfat, "bodyfat");

            // Вычисляем сухую массу тела (Lean mass)
            decimal leanMass = weight * ((100 - bodyfat) / 100);

            // Вычисляем BMR (по факту RMR (Resting Meatabolic Rate)) по формуле Cunningham'а:
            // RMR = 500 + 22*LBM, LBM - (Lean Body Mass)
            decimal bmr = 500 + 22 * leanMass;

            return Helpers.Utilities.RoundAFZ(bmr);
        }

        /// <summary>
        /// Расчет рекомендуемого дневного потребления (RDE) калорий для поддержания жизнедеятельности.
        /// </summary>
        /// <param name="bmr">Значение Basal Metabolic Rate (BMR) пользователя.</param>
        /// <param name="activityLevel">Уровень активности пользователя. 
        /// Sedentary 1 - сидячий образ жизни;
        /// LightlyActive 2 - легкие нагрузки;
        /// ModeratelyActive 3 - умеренно активный;
        /// VeryActive 4 - высоко активный;
        /// ExtraActive 5 - чрезвычайно активный. </param>
        /// <returns>Значение RDE для поддержания жизнедеятельности пользователя.</returns>
        public static decimal GetMaintainingRDE(decimal bmr, int activityLevel)
        {
            PhysicalActivityLevel aL = new PhysicalActivityLevel(activityLevel);
            return Helpers.Utilities.RoundAFZ(bmr * aL.CurrentLevel);
        }

        /// <summary>
        /// Расчет рекомендуемого дневного потребления (RDE) калорий для поддержания жизнедеятельности (Mifflin).
        /// </summary>
        /// <param name="gender">Пол.</param>
        /// <param name="weight">Вес (кг).</param>
        /// <param name="height">Рост (см).</param>
        /// <param name="age">Возраст.</param>
        /// <param name="activityLevel">Уровень активности пользователя.</param>
        /// <returns>Значение RDE для поддержания жизнедеятельности пользователя.</returns>
        public static decimal GetMaintainingRDEMifflin(int gender, decimal weight, decimal height, int age, int activityLevel)
        {
            PhysicalActivityLevel aL = new PhysicalActivityLevel(activityLevel);
            return Helpers.Utilities.RoundAFZ((GetBMRMifflin(gender, weight, height, age) * aL.CurrentLevel));
        }

        /// <summary>
        /// Расчет рекомендуемого дневного потребления (RDE) калорий для поддержания жизнедеятельности (Cunningham).
        /// </summary>
        /// <param name="weight">Вес (кг).</param>
        /// <param name="bodyfat">Процент жировой массы.</param>
        /// <param name="activityLevel">Уровень активности пользователя.</param>
        /// <returns>Значение RDE для поддержания жизнедеятельности пользователя.</returns>
        public static decimal GetMaintainingRDECunningham(decimal weight, decimal bodyfat, int activityLevel)
        {
            PhysicalActivityLevel aL = new PhysicalActivityLevel(activityLevel);
            return Helpers.Utilities.RoundAFZ((GetBMRCunningham(weight, bodyfat) * aL.CurrentLevel));
        }

        /// <summary>
        /// Расчет даты достижения заданной цели. НЕ подходит для цели набора мышечной массы.
        /// </summary>
        /// <param name="goalType">Тип цели.</param>
        /// <param name="goalIntensity">Тип интенсивности достижения цели.</param>
        /// <param name="currentWeight">Текущий вес.</param>
        /// <param name="goalWeight">Желаемый вес.</param>
        /// <returns>Дата достижения заданной цели.</returns>
        public static DateTime GetGoalFinishDate(int goalType, int goalIntensity, decimal currentWeight, decimal goalWeight)
        {
            Utilities.ThrowArgumentNullException(currentWeight, "currentWeight");
            Utilities.ThrowArgumentNullException(goalWeight, "goalWeight");
            Utilities.ThrowArgumentNullException(goalType, "goalType");

            GoalType goal = new GoalType(goalType);

            // Если цель - это набор мышц, исключение
            if ((goalType == (int)GoalTypes.GainMuscleMass))
                throw new Exception("Goal can't be 'Gain Muscle Mass' for this method.");

            // Вес, который нужно сбросить\набрать
            decimal weightChange = currentWeight - goalWeight;
            // Округленное количество дней для достижения цели.
            int days = (int)Math.Ceiling((Math.Abs(weightChange / goal.GetCurrentTypeInKg(goalIntensity))) * 7);

            // Дата достижения заданной цели 
            return DateTime.Today.AddDays(days);
        }

        /// <summary>
        /// Расчет дневного профицита\дефицита калорий в зависимости от типа цели.
        /// </summary>
        /// <param name="goalType">Тип цели.</param>
        /// <param name="goalIntensity">Тип интенсивности достижения цели.</param>
        /// <param name="maintainingRDE">RDE для поддержания жизнедеятельности.</param>
        /// <returns>Количество калорий на которой нужно изменить дневное потребление для достижения цели.
        /// Отрицательное количество - дефицит, полложительное - профицит.</returns>
        public static decimal GetDailyCaloricityChange(int goalType, int goalIntensity, decimal maintainingRDE)
        {
            Utilities.ThrowArgumentNullException(goalType, "goalType");
            Utilities.ThrowArgumentNullException(maintainingRDE, "maintainingRDE");

            GoalType goal = new GoalType(goalType);
            decimal caloriesChange = 0;

            // Если цель - поддержание веса, то нет изменения калорий.
            if ((goalType != (int)GoalTypes.Unknown) &&
                (goalType != (int)GoalTypes.MaintainWeight))
            {
                if (goalType == (int)GoalTypes.GainMuscleMass)
                {
                    // Для цели набора мышечной нужно добавить определенный процент к уже расчитанному RDE
                    caloriesChange = ((goal.GainMuscleMass * maintainingRDE) / 100);
                }
                else
                {
                    // Для цели похудения или набора веса
                    caloriesChange = (goal.GetCurrentTypeInKg(goalIntensity) * Units.CaloriesInOneKgFat) / 7;
                }
            }

            return caloriesChange;
        }

        /// <summary>
        /// Расчет дневного профицита\дефицита калорий в зависимости желаемого веса и желаемой даты его достижения.
        /// Только для похудения и набора веса, НЕ для набора мышечной массы.
        /// </summary>
        /// <param name="currentWeight">Текущий вес.</param>
        /// <param name="goalWeight">Желаемый вес.</param>
        /// <param name="finishGoalDate">Желаемая дата достижения цели.</param>
        /// <returns>Количество калорий на которой нужно изменить дневное потребление для достижения цели. 
        /// Отрицательное количество - дефицит, полложительное - профицит.</returns>
        public static decimal GetDailyCaloricityChange(
          decimal currentWeight,
          decimal goalWeight,
          DateTime finishGoalDate)
        {
            Utilities.ThrowArgumentNullException(currentWeight, "currentWeight");
            Utilities.ThrowArgumentNullException(goalWeight, "goalWeight");
            Utilities.ThrowArgumentNullException(finishGoalDate, "finishGoalDate");

            // Изменения в весе
            decimal weightChange = goalWeight - currentWeight;

            decimal daysForGoal = (finishGoalDate - DateTime.Today).Days;

            // Некорректные параметры веса или даты
            if (daysForGoal == 0 || daysForGoal < 0)
                throw new Exception("Finish Goafl Date must be greater than Today.");

            // Изменение калорий
            decimal caloriesChange = (weightChange * Units.CaloriesInOneKgFat) / (finishGoalDate - DateTime.Today).Days;

            return caloriesChange;
        }

        /// <summary>
        /// Расчет RDE (Recommended Daily Expenditure) в зависимости от цели.
        /// </summary>
        /// <param name="goalType">Тип цели.</param>
        /// <param name="goalIntensity">Тип интенсивности достижения цели.</param>
        /// <param name="maintainingRDE">RDE для поддержания жизнедеятельности.</param>
        /// <returns>RDE пользователя для достижения цели.</returns>
        public static decimal GetGoalRDE(int goalType, int goalIntensity, decimal maintainingRDE)
        {
            Utilities.ThrowArgumentNullException(maintainingRDE, "maintainingRDE");
            Utilities.ThrowArgumentNullException(goalType, "goalType");

            GoalType goal = new GoalType(goalType);

            // Вычисляем RDE исходя из цели
            var rde = Helpers.Utilities.RoundAFZ(maintainingRDE + GetDailyCaloricityChange(goalType, goalIntensity, maintainingRDE));

            // Если меньше минимального, то возвращаем минимальное рекомендованное RDE
            return (rde < Units.MinRDE) ? Units.MinRDE : rde;
        }

        /// <summary>
        /// Расчет RDE (Recommended Daily Expenditure) для достижения целевого веса к определенной дате.
        /// </summary>
        /// <param name="maintainingRDE">RDE для поддержания жизнедеятельности.</param>
        /// <param name="currentWeight">Текущий вес.</param>
        /// <param name="goalWeight">Целевой вес.</param>
        /// <param name="finishGoalDate">Дата достижения цели.</param>
        /// <returns>RDE пользователя для достижения цели.</returns>
        public static decimal GetGoalRDE(
          decimal maintainingRDE,
          decimal currentWeight,
          decimal goalWeight,
          DateTime finishGoalDate)
        {
            Utilities.ThrowArgumentNullException(maintainingRDE, "maintainingRDE");
            Utilities.ThrowArgumentNullException(currentWeight, "currentWeight");
            Utilities.ThrowArgumentNullException(goalWeight, "goalWeight");
            Utilities.ThrowArgumentNullException(finishGoalDate, "finishGoalDate");

            // Вычисляем RDE исходя из цели
            var rde = Helpers.Utilities.RoundAFZ(maintainingRDE + GetDailyCaloricityChange(currentWeight, goalWeight, finishGoalDate));

            return (rde < Units.MinRDE) ? Units.MinRDE : rde;
        }

        #endregion
    }
}