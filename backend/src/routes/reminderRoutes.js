const express = require('express');

const {
  getUpcomingReminders,
  getScheduleReminders
} = require('../controllers/reminderController');

const createReminderRoutes = () => {


  const router = express.Router();


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
