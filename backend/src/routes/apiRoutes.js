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

  // Medication management
  router.use('/medications', createMedicationRoutes(authenticate));

  // Medication schedule management
  router.use(createMedicationScheduleRoutes(authenticate));

  // Medication activity history
  router.use(createMedicationLogRoutes(authenticate));

  // Reminder management
  router.use(createReminderRoutes(authenticate));

  // Dashboard
  router.use(createDashboardRoutes(authenticate));

  return router;
};

module.exports = createApiRoutes;