const express = require('express');

const createMedicationRoutes = require('./medicationRoutes');
const createMedicationScheduleRoutes = require('./medicationScheduleRoutes');
const createMedicationLogRoutes = require('./medicationLogRoutes');
const createReminderRoutes = require('./reminderRoutes');
const createDashboardRoutes = require('./dashboardRoutes');

// Combine all authenticated API routes
const createApiRoutes = (authenticate) => {
  if (typeof authenticate !== 'function') {
    throw new TypeError('Authentication middleware must be provided');
  }

  const router = express.Router();

  // Authenticate each protected API request once
  router.use(authenticate);

  // Medication management
  router.use('/medications', createMedicationRoutes());

  // Medication schedule management
  router.use(createMedicationScheduleRoutes());

  // Medication activity history
  router.use(createMedicationLogRoutes());

  // Reminder management
  router.use(createReminderRoutes());

  // Dashboard
  router.use(createDashboardRoutes());

  return router;
};

module.exports = createApiRoutes;