// Check whether a timezone identifier is supported
const isValidTimeZone = (timeZone) => {
  if (typeof timeZone !== 'string' || !timeZone.trim()) {
    return false;
  }

  try {
    new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone.trim()
    });

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = isValidTimeZone;