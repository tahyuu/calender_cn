// utils/holidayHelper.ts
export async function fetchHolidayMap(year: number): Promise<Record<string, any>> {
    const response = await fetch(`https://api.jiejiariapi.com/v1/holidays/${year}`);
    console.log(response);
    
    if (!response.ok) throw new Error('Failed to fetch holidays');
    return await response.json();
  }
  