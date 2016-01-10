using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NodaTime;
using NodaTime.TimeZones;

namespace fitotrack.Helpers
{
    /// <summary>
    /// Класс работы со временем.
    /// </summary>
    public class TimeHelper
    {
        #region __Структура DateTimeWithZone__
        /// <summary>
        /// Структура DateTimeWithZone для работы с DateTime в определенной временной зоне.
        /// </summary>
        public struct DateTimeWithZone
        {
            private readonly DateTime _utcDateTime;
            private readonly DateTimeZone _timeZone;
            private readonly long _unixMillisecondsTime;

            public DateTimeWithZone(DateTime utcDateTime, string timeZoneId)
            {
                this._utcDateTime = utcDateTime;
                this._unixMillisecondsTime = Instant.FromDateTimeUtc(this._utcDateTime).Ticks / 10000;
                this._timeZone = DateTimeZoneProviders.Bcl[timeZoneId];
            }

            public DateTimeWithZone(long unixMillisecondsTime, string timeZoneId)
            {
                this._unixMillisecondsTime = unixMillisecondsTime;
                this._utcDateTime = Instant.FromMillisecondsSinceUnixEpoch(this._unixMillisecondsTime).ToDateTimeUtc();
                this._timeZone = DateTimeZoneProviders.Bcl[timeZoneId];
            }

            public DateTime UniversalTime { get { return _utcDateTime; } }

            public DateTimeZone TimeZone { get { return _timeZone; } }

            public Instant InstantTime
            {
                get
                {
                    return Instant.FromDateTimeUtc(_utcDateTime);
                }
            }

            public ZonedDateTime ZonedUniversalDateTime
            {
                get
                {
                    return new ZonedDateTime(InstantTime, _timeZone);
                }
            }

            public DateTime LocalTime
            {
                get
                {
                    return ZonedUniversalDateTime.ToDateTimeUnspecified();
                }
            }
        }
        #endregion

        #region __Свойства__
        public static DateTime DateTimeUtcNow
        {
            get
            {
                return SystemClock.Instance.Now.ToDateTimeUtc();
            }
        }

        public static long UnixMsNow
        {
            get
            {
                return SystemClock.Instance.Now.Ticks / 10000;
            }
        }

        public static long UnixMsUTCNow
        {
            get
            {
                return SystemClock.Instance.Now.InUtc().Millisecond;
            }
        }

        #endregion

        #region __Статические методы__
        /// <summary>
        /// Метод перевода даты из миллисекундного UNIX-формата в UTC-формат DateTime.
        /// </summary>
        /// <param name="unixMsTimestamp">Метка времени в миллисекундах с полуночи 1 января 1970 г.</param>
        /// <returns>DateTime в UTC-формате.</returns>
        public static DateTime FromUnixMsToDateTime(long unixMsTimestamp)
        {
            try
            {
                return Instant.FromMillisecondsSinceUnixEpoch(unixMsTimestamp).ToDateTimeUtc();
            }
            catch
            {
                return new DateTime();
            }
        }

        /// <summary>
        /// Метод перевода UTC DateTime в миллисекундный UNIX-формат.
        /// </summary>
        /// <param name="utcDateTime">DateTime в UTC-формате.</param>
        /// <returns>Метка времени в миллисекундах с полуночи 1 января 1970 г.</returns>
        public static long FromDateTimeToUnixMs(DateTime utcDateTime)
        {
            DateTime utc = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
            return Instant.FromDateTimeUtc(utc).Ticks / 10000;
        }

        /// <summary>
        /// Метод преобразования UTC DateTime во время в определенном часовом поясе.
        /// </summary>
        /// <param name="utcDateTime">Дата DateTime в UTC-формате.</param>
        /// <param name="timeZoneId">Строка IANA-идентификатора часового пояса.</param>
        /// <returns>Дата DateTime в переданном часовом поясе.</returns>
        public static DateTime ToLocalTime(DateTime utcDateTime, string timeZoneId)
        {
            DateTimeZone timeZone = DateTimeZoneProviders.Bcl[timeZoneId];
            return (new ZonedDateTime(Instant.FromDateTimeUtc(utcDateTime), timeZone)).ToDateTimeUnspecified();
        }

        /// <summary>
        /// Метиод проверки выставлена ли дата.
        /// </summary>
        /// <param name="dateTime">Проверяемая дата.</param>
        /// <returns>True, если дата выставлена. Иначе - False.</returns>
        public static bool IsDateTimeSet(DateTime dateTime)
        {
            return !(dateTime.Equals(null) || dateTime.Equals(default(DateTime)) || dateTime.Equals(new DateTime(1970, 1, 1)));
        }

        /// <summary>
        /// Перевод из времени с временным смещением в UTC.
        /// </summary>
        /// <param name="dateTime">Время с учетом временного смещения.</param>
        /// <param name="offsetInMinutes">Времянное смещение в минутах.</param>
        /// <returns>Время в UTC-формате.</returns>
        public static DateTime ConvertToUtc(DateTime dateTime, int offsetInMinutes)
        {
            var offset = Offset.FromHoursAndMinutes(0, offsetInMinutes);
            var localDateTime = LocalDateTime.FromDateTime(dateTime);
            return new OffsetDateTime(localDateTime, offset).ToInstant()
                                                            .ToDateTimeUtc();
        }

        /// <summary>
        /// Перевод времени из UTC во время со смещением.
        /// </summary>
        /// <param name="dateTime">Время в UTC-формате.</param>
        /// <param name="offsetInMinutes">Времянное смешение в минутах.</param>
        /// <returns>Время с учетом временного смещения.</returns>
        public static DateTime ConvertFromUtc(DateTime dateTime, int offsetInMinutes)
        {
            var offset = Offset.FromHoursAndMinutes(0, offsetInMinutes);
            var instant = Instant.FromDateTimeUtc(dateTime);
            return instant.WithOffset(offset)
                          .LocalDateTime
                          .ToDateTimeUnspecified();
        }
        
        /// <summary>
        /// Вычисление возраста из даты рождения.
        /// </summary>
        /// <param name="birthDate">Дата рождения.</param>
        /// <returns>Возраст.</returns>
        public static int GetAge(DateTime birthDate)
        {
            DateTime today = DateTime.Today;
            int age = today.Year - birthDate.Year;
            if (birthDate > today.AddYears(-age)) age--;
            return age;
        }
        #endregion
    }
}