const express = require('express');

const {
  getUpcomingReminders,
  getScheduleReminders
} = require('../controllers/reminderController');

const createReminderRoutes = (authenticate) => {
  if (typeof authenticate !== 'function') {
    throw new TypeError('Authentication middleware must be provided');
  }

  const router = express.Router();

  // Protect all reminder endpoints
  router.use(authenticate);

  // Retrieve the user's upcoming reminders
  router.get('/reminders/upcoming', getUpcomingReminders);

  // Retrieve reminders for a specific medication schedule
  router.get(
    '/medication-schedules/:scheduleId/reminders',
    getScheduleReminders
  );

  return router;
};

module.exports = createReminderRoutes;