using fitotrack.Entity.Models;
using fitotrack.Models.Meal.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace fitotrack.Helpers
{
    // Класс расширений.
    public static class Extensions
    {
        /// <summary>
        /// Extension метод для суммирования полей класса NutritionInfo со значениями класса Serving и количества еды.
        /// </summary>
        /// <param name="nutritionInfo">Экземпляр класса NutritionInfo информации о энергетической ценности.</param>
        /// <param name="serving">Экземпляр класса Serving информации о порции еды.</param>
        /// <param name="foodQty">Количество еды.</param>
        public static void Sum(this NutritionInfoDTO nutritionInfo, Serving serving, decimal foodQty)
        {
            nutritionInfo.Kcal += serving.KCal.HasValue ? (serving.KCal.Value) * foodQty : 0;
            nutritionInfo.Carbohydrate += (serving.Carbohydrate) * foodQty;
            nutritionInfo.Protein += (serving.Protein) * foodQty;
            nutritionInfo.Fat += (serving.Fat) * foodQty;
            nutritionInfo.DietaryFiber += (serving.DietaryFiber) * foodQty;
            nutritionInfo.Sugars += (serving.Sugars) * foodQty;
            nutritionInfo.SaturatedFat += (serving.SaturatedFat) * foodQty;
            nutritionInfo.MonounsaturatedFat += (serving.MonounsaturatedFat) * foodQty;
            nutritionInfo.PolyunsaturatedFat += (serving.PolyunsaturatedFat) * foodQty;
            nutritionInfo.TransFat += (serving.TransFat) * foodQty;
            nutritionInfo.Cholesterol += (serving.Cholesterol) * foodQty;
            nutritionInfo.Sodium += (serving.Sodium) * foodQty;
            nutritionInfo.Potassium += (serving.Potassium) * foodQty;
            nutritionInfo.Calcium += (serving.Calcium) * foodQty;
            nutritionInfo.Iron += (serving.Iron) * foodQty;
            nutritionInfo.VitaminA += (serving.VitaminA) * foodQty;
            nutritionInfo.VitaminC += (serving.VitaminC) * foodQty;
        }

        /// <summary>
        /// Extension метод для округления полей класса NutritionInfo.
        /// </summary>
        /// <param name="nutritionInfo">Экземпляр класса NutritionInfo информации о энергетической ценности.</param>
        /// <param name="decimals">Количество знаков после запятой.</param>
        public static void Round(this NutritionInfoDTO nutritionInfo, int decimals)
        {
            nutritionInfo.Kcal = Helpers.Utilities.RoundAFZ(nutritionInfo.Kcal, 1);
            nutritionInfo.Carbohydrate = Helpers.Utilities.RoundAFZ(nutritionInfo.Carbohydrate);
            nutritionInfo.Protein = Helpers.Utilities.RoundAFZ(nutritionInfo.Protein);
            nutritionInfo.Fat = Helpers.Utilities.RoundAFZ(nutritionInfo.Fat);
            nutritionInfo.DietaryFiber = Helpers.Utilities.RoundAFZ(nutritionInfo.DietaryFiber, 2);
            nutritionInfo.Sugars = Helpers.Utilities.RoundAFZ(nutritionInfo.Sugars, 2);
            nutritionInfo.SaturatedFat = Helpers.Utilities.RoundAFZ(nutritionInfo.SaturatedFat, 2);
            nutritionInfo.MonounsaturatedFat = Helpers.Utilities.RoundAFZ(nutritionInfo.MonounsaturatedFat, 2);
            nutritionInfo.PolyunsaturatedFat = Helpers.Utilities.RoundAFZ(nutritionInfo.PolyunsaturatedFat, 2);
            nutritionInfo.TransFat = Helpers.Utilities.RoundAFZ(nutritionInfo.TransFat, 2);
            nutritionInfo.Cholesterol = Helpers.Utilities.RoundAFZ(nutritionInfo.Cholesterol, 2);
            nutritionInfo.Sodium = Helpers.Utilities.RoundAFZ(nutritionInfo.Sodium, 2);
            nutritionInfo.Potassium = Helpers.Utilities.RoundAFZ(nutritionInfo.Potassium, 2);
            nutritionInfo.Calcium = Helpers.Utilities.RoundAFZ(nutritionInfo.Calcium, 2);
            nutritionInfo.Iron = Helpers.Utilities.RoundAFZ(nutritionInfo.Iron, 2);
            nutritionInfo.VitaminA = Helpers.Utilities.RoundAFZ(nutritionInfo.VitaminA, 2);
            nutritionInfo.VitaminC = Helpers.Utilities.RoundAFZ(nutritionInfo.VitaminC, 2);
        }
    }
}