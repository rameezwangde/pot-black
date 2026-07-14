const Table = require('../models/Table');

const getAllTables = async (_req, res, next) => {
  try {
    const tables = await Table.find({ isActive: true, status: 'active' }).sort({ code: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTables };
