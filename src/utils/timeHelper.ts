import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDateTime(date = new Date(), isHoursDisplay = true) {
  const formattedDate = dayjs(date).tz("Asia/Jakarta");

  const day = formattedDate.format("DD");
  const month = formattedDate.format("MM");
  const year = formattedDate.format("YYYY");
  const hours = formattedDate.format("HH");
  const minutes = formattedDate.format("mm");

  return isHoursDisplay
    ? `${day}/${month}/${year} ${hours}:${minutes}`
    : `${day}/${month}/${year}`;
}
