const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Table = require('../models/Table');

dotenv.config();

const tables = [
  { name: 'Table 01', code: 'T01', type: 'English Pool', zone: 'Main Hall', capacity: 4, features: ['Tournament Size', 'Premium Cloth'] },
  { name: 'Table 02', code: 'T02', type: 'English Pool', zone: 'Main Hall', capacity: 4, features: ['Professional Lighting', 'Premium Cues'] },
  { name: 'Table 03', code: 'T03', type: 'American Pool', zone: 'Private Lounge', capacity: 6, features: ['Private Seating', 'Table Service'] },
  { name: 'Table 04', code: 'T04', type: 'American Pool', zone: 'Private Lounge', capacity: 6, features: ['Private Seating', 'Table Service'] },
  { name: 'Table 05', code: 'T05', type: 'Snooker', zone: 'Championship Area', capacity: 4, features: ['Full Size Table', 'Professional Lighting'] },
  { name: 'Table 06', code: 'T06', type: 'Snooker', zone: 'Championship Area', capacity: 4, features: ['Full Size Table', 'Premium Cloth'] },
  { name: 'Table 07', code: 'T07', type: 'VIP Pool', zone: 'VIP Room', capacity: 6, features: ['Private Room', 'Dedicated Service'] },
  { name: 'Table 08', code: 'T08', type: 'VIP Pool', zone: 'VIP Room', capacity: 6, features: ['Private Room', 'Dedicated Service'] },
];

const seedTables = async () => {
  try {
    await connectDB();
    await Table.deleteMany({});
    const insertedTables = await Table.insertMany(tables);
    console.log(`${insertedTables.length} Pot Black tables seeded successfully`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Table seed failed: ${error.message}`);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close().catch(() => {});
    }

    process.exit(1);
  }
};

seedTables();
