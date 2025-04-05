// app/(tabs)/calendar.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import dayjs from 'dayjs';
import solarlunar from 'solarlunar';
//import { isHoliday, getHolidayName } from 'holiday-cn';


export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  const generateLunarDataForMonth = (year: number, month: number) => {
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    const newMarked: Record<string, any> = {};
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const lunar = solarlunar.solar2lunar(year, month, day);
      const lunarLabel = lunar.term || lunar.lunarFestival || lunar.dayCn;
  
      //const holidayName = getHolidayName(new Date(dateStr));
      const holidayName = '';
  
      newMarked[dateStr] = {
        lunarLabel: holidayName || lunarLabel,
        customStyles: {
          text: { color: holidayName ? '#e67e22' : '#2c3e50' },
        },
      };
    }
  
    return newMarked;
  };

  const initLunarData = () => {
    const today = dayjs();
    const current = { year: today.year(), month: today.month() + 1 };
  
    const prev2 = today.subtract(2, 'month');
    const prev1 = today.subtract(1, 'month');
    const next1 = today.add(1, 'month');
    const next2 = today.add(2, 'month');
  
    const marked = {
      //...generateLunarDataForMonth(prev2.year(), prev2.month() + 1),
      ...generateLunarDataForMonth(prev1.year(), prev1.month() + 1),
      ...generateLunarDataForMonth(current.year, current.month),
      ...generateLunarDataForMonth(next1.year(), next1.month() + 1),
      //...generateLunarDataForMonth(next2.year(), next2.month() + 1),
    };
  
    setMarkedDates(marked);
  };

  useEffect(() => {
    initLunarData();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Text style={styles.title}>农历日历</Text>
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
          //console.log(lunarInfo);

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
          monthTextColor: '#2c3e50',
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
          textSectionTitleColor: '#2c3e50',
        }}

        onVisibleMonthsChange={(months) => {
            const updates = { ...markedDates };
          
            months.forEach((m) => {
              const current = dayjs(`${m.year}-${m.month}-01`);
          
              // 遍历前一个月、当前月、后一个月
              [-1, 0, 1].forEach(offset => {
                const monthToLoad = current.add(offset, 'month');
                const year = monthToLoad.year();
                const month = monthToLoad.month() + 1; // dayjs 的 month 是从 0 开始的
          
                const key = `${year}-${String(month).padStart(2, '0')}`;
                const alreadyMarked = Object.keys(updates).some(date => date.startsWith(key));
          
                if (!alreadyMarked) {
                  const newMarked = generateLunarDataForMonth(year, month);
                  Object.assign(updates, newMarked);
                }
              });
            });
          
            setMarkedDates(updates);
          }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
