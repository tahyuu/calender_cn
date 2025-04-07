import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import dayjs from 'dayjs';
import solarlunar from 'solarlunar';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [currentMonthLabel, setCurrentMonthLabel] = useState(dayjs().format('YYYY年M月'));

  const chineseWeekdays = ['一', '二', '三', '四', '五', '六', '天'];

  const generateLunarDataForMonth = (year: number, month: number) => {
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    const newMarked: Record<string, any> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const lunar = solarlunar.solar2lunar(year, month, day);
      const lunarLabel = lunar.term || lunar.lunarFestival || lunar.dayCn;
      newMarked[dateStr] = {
        lunarLabel,
        customStyles: {
          text: { color: '#2c3e50' },
        },
      };
    }

    return newMarked;
  };

  const initLunarData = () => {
    const today = dayjs();
    const current = { year: today.year(), month: today.month() + 1 };

    const prev1 = today.subtract(1, 'month');
    const next1 = today.add(1, 'month');

    const marked = {
      ...generateLunarDataForMonth(prev1.year(), prev1.month() + 1),
      ...generateLunarDataForMonth(current.year, current.month),
      ...generateLunarDataForMonth(next1.year(), next1.month() + 1),
    };

    setMarkedDates(marked);
  };

  useEffect(() => {
    initLunarData();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      {/* 中文月份标题 */}
      <Text style={styles.monthTitle}>{currentMonthLabel}</Text>

      {/* 中文星期标题 */}
      <View style={styles.weekRow}>
        {chineseWeekdays.map((day, index) => (
          <Text key={index} style={styles.weekText}>{day}</Text>
        ))}
      </View>

      <CalendarList
        horizontal
        pagingEnabled
        scrollEnabled
        pastScrollRange={120}
        futureScrollRange={120}
        markingType={'custom'}
        markedDates={Object.fromEntries(
          Object.entries(markedDates).map(([key, val]) => [
            key,
            {
              customStyles: {
                container: { alignItems: 'center' },
                text: val.customStyles.text,
              },
            },
          ])
        )}
        dayComponent={({ date, state }) => {
          const dateStr = date.dateString;
          const lunarInfo = markedDates[dateStr];
          const lunarLabel = lunarInfo?.lunarLabel || '';
          const isToday = dateStr === dayjs().format('YYYY-MM-DD');

          return (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 14,
                  color: state === 'disabled' ? '#ccc' : isToday ? '#e74c3c' : '#2c3e50',
                }}
              >
                {date.day}
              </Text>
              <Text style={{ fontSize: 10, color: '#999' }}>{lunarLabel}</Text>
            </View>
          );
        }}
        theme={{
          textSectionTitleColor: 'transparent', // 隐藏默认英文星期
          monthTextColor: 'transparent',        // 隐藏默认月份标题
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 0,             // 隐藏默认英文星期标题
        }}
        onVisibleMonthsChange={(months) => {
          const updates = { ...markedDates };
          if (months?.length) {
            const first = months[0];
            setCurrentMonthLabel(`${first.year}年${first.month}月`);

            const current = dayjs(`${first.year}-${first.month}-01`);

            [-1, 0, 1].forEach(offset => {
              const monthToLoad = current.add(offset, 'month');
              const year = monthToLoad.year();
              const month = monthToLoad.month() + 1;
              const key = `${year}-${String(month).padStart(2, '0')}`;
              const alreadyMarked = Object.keys(updates).some(date => date.startsWith(key));
              if (!alreadyMarked) {
                const newMarked = generateLunarDataForMonth(year, month);
                Object.assign(updates, newMarked);
              }
            });

            setMarkedDates(updates);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#2c3e50',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});
