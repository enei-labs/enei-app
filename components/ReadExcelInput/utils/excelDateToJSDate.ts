export const excelDateToJSDate = (serial: number) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;

  const total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;

  const total_minutes = Math.floor(total_seconds / 60);
  const minutes = total_minutes % 60;

  const hours = Math.floor(total_minutes / 60);

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
};