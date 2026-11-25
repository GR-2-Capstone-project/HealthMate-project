const geoip = require('geoip-lite');

// Takes any string and returns the canonical IANA name, or null if invalid.
const normalizeTimezone = (tz) => {
  if (typeof tz !== 'string') return null;

  const trimmed = tz.trim();
  if (trimmed === '') return null;

  // Real IANA names look like "Region/City". "UTC" is the one common exception.
  if (!trimmed.includes('/') && trimmed.toUpperCase() !== 'UTC') return null;

  try {
    // Node already knows every IANA timezone. If the name is bogus, this throws.
    return new Intl.DateTimeFormat('en-US', { timeZone: trimmed })
      .resolvedOptions().timeZone;
  } catch (err) {
    return null;
  }
};

// Some servers report IPv4 addresses in IPv6 clothing: "::ffff:41.58.1.1".
const cleanIp = (ip) => {
  if (!ip) return null;
  return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
};

const detectTimezoneFromIp = (ip) => {
  const address = cleanIp(ip);
  if (!address) return null;

  const match = geoip.lookup(address); // null for private/unknown IPs
  if (!match) return null;

  return normalizeTimezone(match.timezone);
};

module.exports = { normalizeTimezone, detectTimezoneFromIp };