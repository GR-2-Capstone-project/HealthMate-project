const Medication = require('../models/Medication');
const MedicationSchedule = require('../models/MedicationSchedule');
const Reminder = require('../models/Reminder');
const MedicationLog = require('../models/MedicationLog');

// Get the user's HealthMate dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find all medications belonging to the authenticated user
    const medicationIds = await Medication.distinct('_id', { userId });

    // Find the user's active medication schedules
    const activeSchedules = await MedicationSchedule.find({
      medicationId: { $in: medicationIds },
      status: 'active',
      deletedAt: null
    })
      .select(
        'medicationId frequency scheduledTimes startDate endDate status remindersEnabled'
      )
      .populate('medicationId', 'medicationName dosageDetails')
      .sort({ startDate: 1 });

    // Get IDs of the active schedules
    const scheduleIds = activeSchedules.map(schedule => schedule._id);

    // Retrieve dashboard information
    const [
      upcomingReminders,
      recentActivity,
      totalTaken,
      totalMissed
    ] = await Promise.all([
      Reminder.find({
        scheduleId: { $in: scheduleIds },
        reminderTime: { $gte: new Date() },
        notificationStatus: 'pending'
      })
        .sort({ reminderTime: 1 })
        .limit(10)
        .populate({
          path: 'scheduleId',
          populate: {
            path: 'medicationId',
            select: 'medicationName dosageDetails'
          }
        }),

      MedicationLog.find({ userId })
        .sort({ recordedAt: -1 })
        .limit(10)
        .populate({
          path: 'scheduleId',
          populate: {
            path: 'medicationId',
            select: 'medicationName dosageDetails'
          }
        }),

      MedicationLog.countDocuments({
        userId,
        activityStatus: 'taken'
      }),

      MedicationLog.countDocuments({
        userId,
        activityStatus: 'missed'
      })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard retrieved successfully',
      data: {
        activeSchedules,
        upcomingReminders,
        recentActivity,
        activitySummary: {
          totalTaken,
          totalMissed,
          totalRecorded: totalTaken + totalMissed
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve dashboard'
    });
  }
};

module.exports = {
  getDashboard
};
