const express = require('express');

const {
  getDashboard
} = require('../controllers/dashboardController');

const createDashboardRoutes = () => {


  const router = express.Router();


  // Retrieve the authenticated user's dashboard
  router.get('/dashboard', getDashboard);

  return router;
};

module.exports = createDashboardRoutes;
