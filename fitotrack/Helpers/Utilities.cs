using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;

namespace fitotrack.Helpers
{
    /// <summary>
    /// Класс различных вспомогательных методов-утилит.
    /// </summary>
    public class Utilities
    {
        /// <summary>
        /// Метод округления значений до MidpointRounding.AwayFromZero (2.5 -> 3), 
        /// т.к. по умолчанию Math.Round округляет до MidpointRounding.ToEven (2.5 -> 2).
        /// </summary>
        /// <param name="value"></param>
        /// <param name="decimals"></param>
        /// <returns></returns>
        public static decimal RoundAFZ(decimal value, int decimals = 0)
        {
            return Math.Round(value, decimals, MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Метод сравнения значений свойств двух объектов.
        /// </summary>
        /// <param name="o1">Объект для сравнения.</param>
        /// <param name="o2">Объект для сравнения.</param>
        /// <returns>Перечисление свойств с несовпадающими значениями.</returns>
        public static IList<PropertyInfo> CompareObjectProperties(object o1, object o2)
        {
            IList<PropertyInfo> diffProperties = new List<PropertyInfo>();
            foreach (var prop in o1.GetType().GetProperties())
            {
                if (o2.GetType().GetProperty(prop.Name) == null)
                    continue;

                if (!Object.Equals(
                      prop.GetValue(o1, null),
                      o2.GetType().GetProperty(prop.Name).GetValue(o2, null)))
                {
                    diffProperties.Add(prop);
                }
            }
            return diffProperties;
        }

        /// <summary>
        /// Метод сравнения значений свойств двух объектов и установка 
        /// несовпадающих свойств одного объекта значением другого.
        /// </summary>
        /// <param name="src">Объект для сравнения, значения несовпадающих свойств 
        /// которого будут взяты для изменения другого объекта.</param>
        /// <param name="dest">Объект для сравнения, значения несовпадающих свойств 
        /// которого будут изменяться.</param>
        /// <param name="excludeProps">Массив свойств, которые нужно исключить из сравнения.</param>
        /// <returns></returns>
        public static void CompareAndSetObjectProperties<TDest>(
          object src,
          object dest,
          params Expression<Func<TDest, object>>[] excludeProps)
        {
            IList<PropertyInfo> diffProperties = new List<PropertyInfo>();

            foreach (var prop in src.GetType().GetProperties())
            {
                if (dest.GetType().GetProperty(prop.Name) == null)
                    continue;

                #region __Поиск исключаемых свойств__
                var exPropEquals = false;
                foreach (var excludeProp in excludeProps)
                {
                    // Извлекаем название свойства из LINQ выражения
                    MemberExpression memberExpression = null;
                    if (excludeProp.Body.NodeType == ExpressionType.Convert)
                    {
                        memberExpression =
                            ((UnaryExpression)excludeProp.Body).Operand as MemberExpression;
                    }
                    else if (excludeProp.Body.NodeType == ExpressionType.MemberAccess)
                    {
                        memberExpression = excludeProp.Body as MemberExpression;
                    }
                    if (memberExpression == null)
                        break;

                    // Проверяем является ли текущее свойство исключением
                    if (prop.Name.Equals(memberExpression.Member.Name, StringComparison.InvariantCultureIgnoreCase))
                    {
                        exPropEquals = true;
                        // Удаляем найденной исключающее свойство из списка исключений
                        excludeProps = excludeProps.Where(p => p != excludeProp).ToArray();
                        break;
                    }
                }
                if (exPropEquals)
                    continue;
                #endregion

                var srcPropertyValue = prop.GetValue(src, null);
                var destProperty = dest.GetType().GetProperty(prop.Name);
                if (!Object.Equals(
                      srcPropertyValue,
                      destProperty.GetValue(dest, null)))
                {
                    destProperty.SetValue(dest, srcPropertyValue);
                }
            }
        }

        /// <summary>
        /// Метод генерации исключения ArgumrntNullException.
        /// </summary>
        /// <param name="value">Объект, который нужно проверить.</param>
        /// <param name="name">Имя объекта для генерации информативного сообщения.</param>
        public static void ThrowArgumentNullException(object value, string name)
        {
            if (value == null)
            {
                throw new ArgumentNullException("Argument " + name + " must be specified.", name);
            }
        }

        /// <summary>
        /// Метод перевода килограммов(kg) в фунты (lbs).
        /// </summary>
        /// <param name="kilos">Килограммы.</param>
        /// <returns>Фунты.</returns>
        public static decimal ToPounds(decimal kilos)
        {
            return kilos * 2.2M;
        }

        /// <summary>
        /// Метод перевода фунтов (lbs) в килограммы(kg).
        /// </summary>
        /// <param name="lbs">Фунты.</param>
        /// <returns>Килограммы.</returns>
        public static decimal ToKilos(decimal lbs)
        {
            return lbs / 2.2M;
        }
    }
}