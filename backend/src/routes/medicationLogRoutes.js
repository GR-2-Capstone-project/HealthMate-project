const express = require('express');

const {
  createMedicationLog,
  getMedicationLogs
} = require('../controllers/medicationLogController');

const createMedicationLogRoutes = () => {


  const router = express.Router();


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
