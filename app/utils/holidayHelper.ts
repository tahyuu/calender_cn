export async function fetchHolidayMap(year: number): Promise<Record<string, any>> {
    console.log('请求节假日数据', year);
    try {
      const response = await fetch(`https://api.jiejiariapi.com/v1/holidays/${year}`);
      console.log('response.ok:', response.ok);
      const data = await response.json();
      console.log('holiday data:', data);
      return data;
    } catch (err) {
      console.error('获取节假日失败:', err);
      throw err;
    }
  }
  