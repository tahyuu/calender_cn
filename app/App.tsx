import React, { useEffect, useState } from 'react';
import { CalendarList } from 'react-native-calendars';
import { Text, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { getLunarDataForMonth } from '../utils/lunarHelper';
import { fetchHolidayMap } from '../utils/holidayHelper';

dayjs.locale('zh-cn');

export default function App() {
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const loadedYears = new Set<number>();

  const loadLunarForMonth = async (year: number, month: number) => {
    console.log(`📆 开始加载农历数据 ${year}-${month}`);
    const lunarData = getLunarDataForMonth(year, month);
    // 若该年份节假日尚未加载，加载一次
    if (!loadedYears.has(year)) {
      try {
        const holidayData = await fetchHolidayMap(year);
        Object.keys(holidayData).forEach((dateStr) => {
          lunarData[dateStr] = {
            ...lunarData[dateStr],
            lunarLabel: holidayData[dateStr].name || lunarData[dateStr]?.lunarLabel,
            customStyles: {
              text: {
                color: holidayData[dateStr].isOffDay ? '#e67e22' : '#2980b9',
                fontWeight: 'bold',
              },
            },
          };
        });
        loadedYears.add(year);
      } catch (e) {
        console.warn(`加载${year}年节假日失败：`, e);
      }
    }

    setMarkedDates((prev) => ({ ...prev, ...lunarData }));
  };

  const preloadCurrentAndAdjacent = () => {
    const now = dayjs();
    loadLunarForMonth(now.year(), now.month() + 1);
    loadLunarForMonth(now.subtract(1, 'month').year(), now.subtract(1, 'month').month() + 1);
    loadLunarForMonth(now.add(1, 'month').year(), now.add(1, 'month').month() + 1);
  };

  useEffect(() => {
    preloadCurrentAndAdjacent();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Text style={styles.title}>农历日历</Text>

      <CalendarList
        pastScrollRange={120}
        futureScrollRange={120}
        scrollEnabled
        horizontal
        pagingEnabled
        markingType={'custom'}
        markedDates={Object.fromEntries(
          Object.entries(markedDates).map(([key, val]) => [
            key,
            {
              customStyles: {
                container: { alignItems: 'center' },
                text: val.customStyles?.text,
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
        onVisibleMonthsChange={(months) => {

          months.forEach((month) => {
            console.log("ffffaaafadsfasdf");
            const year = parseInt(month.year, 10);
            const m = parseInt(month.month, 10);
            const key = `${year}-${String(m).padStart(2, '0')}-01`;
            if (!markedDates[key]) {
              loadLunarForMonth(year, m);
            }
          });
        }}
        theme={{
          monthTextColor: '#2c3e50',
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
});
