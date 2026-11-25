const express = require('express');

const {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication
} = require('../controllers/medicationController');

// Create medication routes
const createMedicationRoutes = () => {


  const router = express.Router();


  // Create a medication
  router.post('/', createMedication);

  // Retrieve all medications belonging to the logged-in user
  router.get('/', getMedications);

  // Retrieve one medication
  router.get('/:medicationId', getMedicationById);

  // Update a medication
  router.patch('/:medicationId', updateMedication);

  return router;
};

module.exports = createMedicationRoutes;
