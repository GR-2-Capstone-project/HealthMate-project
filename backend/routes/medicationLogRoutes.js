const express = require('express');

const {
  createMedicationLog,
  getMedicationLogs
} = require('../controllers/medicationLogController');

const createMedicationLogRoutes = (authenticate) => {
  if (typeof authenticate !== 'function') {
    throw new TypeError('Authentication middleware must be provided');
  }

  const router = express.Router();

  // Protect all medication-log endpoints
  router.use(authenticate);

  // Record a medication activity
  router.post(
    '/medication-schedules/:scheduleId/logs',
    createMedicationLog
  );

  // Retrieve the user's medication activity history
  router.get('/medication-logs', getMedicationLogs);

  return router;
};

module.exports = createMedicationLogRoutes;
