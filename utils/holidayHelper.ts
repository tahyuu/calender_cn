export async function fetchHolidayMap(year: number): Promise<Record<string, any>> {
  console.log("📅 正在加载节假日数据：", year);
  const response = await fetch(`https://api.jiejiariapi.com/v1/holidays/${year}`);
  console.log("✅ 节假日 API 响应：", response.status);

  if (!response.ok) throw new Error('Failed to fetch holidays');

  const json = await response.json();
  console.log("🎉 节假日数据内容：", json);
  return json;
}
