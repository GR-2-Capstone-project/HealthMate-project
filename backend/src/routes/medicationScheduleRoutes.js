const express = require('express');

const {
  createMedicationSchedule,
  getMedicationSchedules,
  updateMedicationSchedule,
  deleteMedicationSchedule
} = require('../controllers/medicationScheduleController');

const createMedicationScheduleRoutes = () => {


  const router = express.Router();


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
