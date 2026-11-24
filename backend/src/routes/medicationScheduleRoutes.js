const express = require('express');

const {
  createMedicationSchedule,
  getMedicationSchedules,
  updateMedicationSchedule,
  deleteMedicationSchedule
} = require('../controllers/medicationScheduleController');

const createMedicationScheduleRoutes = (authenticate) => {
  if (typeof authenticate !== 'function') {
    throw new TypeError('Authentication middleware must be provided');
  }

  const router = express.Router();

  // Protect all medication schedule endpoints
  router.use(authenticate);

  // Create and retrieve schedules for a medication
  router.post(
    '/medications/:medicationId/schedules',
    createMedicationSchedule
  );

  router.get(
    '/medications/:medicationId/schedules',
    getMedicationSchedules
  );

  // Update and delete an existing schedule
  router.patch(
    '/medication-schedules/:scheduleId',
    updateMedicationSchedule
  );

  router.delete(
    '/medication-schedules/:scheduleId',
    deleteMedicationSchedule
  );

  return router;
};

module.exports = createMedicationScheduleRoutes;
