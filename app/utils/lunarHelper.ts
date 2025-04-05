import solarlunar from 'solarlunar';

export function getLunarDataForMonth(year: number, month: number) {
  const marked: Record<string, any> = {};
  const daysInMonth = new Date(year, month, 0).getDate(); // 月份从1开始

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const lunar = solarlunar.solar2lunar(year, month, day);

    const lunarLabel = lunar.term || lunar.lunarFestival || lunar.lDayCn;
    marked[dateStr] = {
      lunarLabel,
      customStyles: {
        text: {
          color: '#2c3e50',
        },
      },
    };
  }

  return marked;
}
