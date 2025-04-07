import solarlunar from 'solarlunar';

// 获取指定日期的农历信息和节日
export function getLunarDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const lunar = solarlunar.solar2lunar(year, month, day);

  return {
    lunarDay: lunar.lDayCn, // 初一、初二……
    lunarMonth: lunar.lMonthCn, // 正月、二月……
    festival: lunar.lunarFestival, // 农历节日
    solarFestival: lunar.solarFestival, // 公历节日
    jieqi: lunar.term, // 节气名称
  };
}

// 获取某年所有节气的日期（返回 { '2025-02-04': '立春', ... }）
export function getJieqiDates(year: number): Record<string, string> {
  const map: Record<string, string> = {};
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const lunar = solarlunar.solar2lunar(year, month, day);
      if (lunar.term) {
        const m = String(month).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        map[`${year}-${m}-${d}`] = lunar.term;
      }
    }
  }
  return map;
}
