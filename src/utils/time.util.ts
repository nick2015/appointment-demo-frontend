// simple transfer date and time string to datetime string
export const combineToDateTime = (date: string, time: string): string => {
  return `${date} ${time}:00`;
};

/**
 * simple transfer datetime string to date and time string
 */
export const splitFromDateTime = (dateTime: string) => {
  if (!dateTime) return { date: '', time: '' };
  const [date, fullTime] = dateTime.split(' ');
  const time = fullTime.substring(0, 5);
  return { date, time };
};

export const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`;
}