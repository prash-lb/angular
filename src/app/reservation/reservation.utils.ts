export function buildNavitiaDateTime(date: string | null | undefined): string {
  if (!date) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  const [datePart, timePartRaw] = date.split('T');
  const timePart = timePartRaw ?? '00:00';
  const [hour = '00', minute = '00'] = timePart.split(':');

  const day = (datePart || '').replace(/-/g, '');
  const time = `${hour}${minute}00`; // hhmmss

  return `${day}T${time}`;
}

export function calculateDuration(departure: string, arrival: string): string {
  function parseTime(t: string): { hours: number; minutes: number } | null {
    if (!t) return null;

    const colon = t.match(/^(\d{1,2}):(\d{2})$/);
    if (colon) {
      return { hours: parseInt(colon[1], 10), minutes: parseInt(colon[2], 10) };
    }

    const hmatch = t.match(/^(\d{1,2})h(\d{1,2})$/);
    if (hmatch) {
      return {
        hours: parseInt(hmatch[1], 10),
        minutes: parseInt(hmatch[2], 10),
      };
    }
    const navitia = t.match(/T(\d{2})(\d{2})\d{2}$/);
    if (navitia) {
      return {
        hours: parseInt(navitia[1], 10),
        minutes: parseInt(navitia[2], 10),
      };
    }
    return null;
  }

  const dep = parseTime(departure);
  const arr = parseTime(arrival);
  if (!dep || !arr) return '';

  const depMinutes = dep.hours * 60 + dep.minutes;
  const arrMinutes = arr.hours * 60 + arr.minutes;

  let durationMinutes = arrMinutes - depMinutes;
  if (durationMinutes < 0) durationMinutes += 24 * 60;

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `${minutes} Min`;
  }

  return `${hours}h${minutes.toString().padStart(2, '0')}`;
}
