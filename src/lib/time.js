/** Time-zone helpers (IANA zones such as Asia/Kolkata). */

/** 'YYYY-MM-DD' of `ms` in `timeZone`. */
function localDate(ms, timeZone = 'Asia/Kolkata') {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms));
}

/** Offset of `timeZone` from UTC at instant `ms`, in milliseconds. */
function zoneOffsetMs(ms, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(ms));
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** UTC instant of local midnight, `daysBack` days before the local date of `ms`. */
function localMidnight(ms, timeZone = 'Asia/Kolkata', daysBack = 0) {
  const [y, m, d] = localDate(ms, timeZone).split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d - daysBack);
  // Two passes handle DST changes around midnight.
  let t = guess - zoneOffsetMs(guess, timeZone);
  t = guess - zoneOffsetMs(t, timeZone);
  return new Date(t);
}

module.exports = { localDate, localMidnight, zoneOffsetMs };
