using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace fitotrack.Models.Profile.Types
{
    /// <summary>
    /// Класс GetWeightingParams. Модель, описывающая параметры, 
    /// которые должны прийти от пользователя для получения списка взвешиваний.
    /// </summary>
    public class GetWeightingParams
    {
        // Последнее ли взвешивание нужно вернуть.
        public bool isLast { get; set; }
        // Начало интервала времени, для которого необходимо получить взвешивания.
        public long from { get; set; }
        // Конец интервала времени, для которого необходимо получить взвешивания.
        public long to { get; set; }
    }
}