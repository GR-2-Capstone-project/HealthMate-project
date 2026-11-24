const express = require('express');

const {
  getDashboard
} = require('../controllers/dashboardController');

const createDashboardRoutes = (authenticate) => {
  if (typeof authenticate !== 'function') {
    throw new TypeError('Authentication middleware must be provided');
  }

  const router = express.Router();

  // Protect the dashboard endpoint
  router.use(authenticate);

  // Retrieve the authenticated user's dashboard
  router.get('/dashboard', getDashboard);

  return router;
};

module.exports = createDashboardRoutes;