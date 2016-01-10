/**
 * @fileOverview
 * constants.js
 * Fitotrack App constants definition.
 */ 

(function (ng, app) {
    "use strict";

    app.constant('appCfg', {
        // Имя куки временной зоны
        tzCookie: "tz",
        // Постоянная часть адреса шаблонов
        tplBaseUrl: "/tpl/partial?name=",
        // Заголовок по-умолчанию
        defaultTitle: "Fitness App",
        // Постоянная часть заголовка
        defaultFixedTitlePart: "Fitotrack",
        // Если статус пользователя не задан
        noUserStatus: "Edit status",
        // Позиция постоянной части: 0 - начало; остальное - конец
        defaultFixedTitlePartPosition: 0,
        // Разделитель заголовка и фиксированной части
        defaultTitleSeparator: " - ",
        // Минимальный возраст пользователя
        minAge: 6,
        // Максимальный возраст пользователя
        maxAge: 150,
        // Time formats.
        iso8601DateFormat: "YYYY-MM-DD",
        ddMMyyyyDotDateFormat: "dd.MM.YYYY",
        monthYearFormat: "MMMM YYYY",
        fullDateWithShortMonthFormat: "DD MMM, YYYY",
        fullDateWithFullMonthFormat: "DD MMMM YYYY",
        // Положительное число от 1 до 9 в том числе с плавающей точкой
        regexpPositiveDigitFloat: /^\+?(\d*[1-9]\d*\.?|\d*\.\d*[1-9]\d*)$/,
        regexpURL: /\/[^\w~,;\-\.\/?%&+#=]*/i,
        regexpNumeric: /\d+/,
        Gender: {
            Male: 1,
            Female: 2
        },
        ActivityLevel: {
            Unknown: 0,
            Sedentary: 1,
            LightlyActive: 2,
            ModeratelyActive: 3,
            VeryActive: 4,
            ExtraActive: 5
        },
        PrivacyFlags: {
            All: 0,
            OnlyFriends: 1,
            Private: 2
        },
        GoalTypes: {
            Unknown:
                { value: 0, title: "<Unknown>" },
            LoseWeight: 
                { value: 1, title: "Losing weight" },
            MaintainWeight: 
                { value: 2, title: "Maintaining weight" },
            GainWeight: 
                { value: 3, title: "Gaining weight" },
            GainMuscleMass: 
                { value: 4, title: "Gaining muscle mass" },
            AchieveFatPercentage: 
                { value: 5, title: "Achieving certain fat percentage" },
        },
        GoalIntensity: {
            Unknown: 0,
            Healthy: 1,
            Normal: 2,
            Aggressive: 3
        },
        ExerciseType: {
            Unknown: 0,
            Cardio: 1,
            Strength: 2,
            Game: 3,
            Stretching: 4,
            Custom: 5
        },
        FoodQtyValidation: {
            min: 1
        },
        RepsValidation: {
            min: 1,
            max: 250
        },
        WeightValidation: {
            min: 0,
            max: 300
        },
        DistanceValidation: {
            min: 0
        },
        DurationValidation: {
            min: 0,
            max: 1440
        }
    });

})(angular, fitotrack);