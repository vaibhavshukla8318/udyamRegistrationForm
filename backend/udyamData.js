require('dotenv').config();
const fs = require('fs');
const registrationSchema = require('./models/Registration');
const connectDB = require('./config/db');

const exportData = async () => {
  try {
    await connectDB();
    const allData = await registrationSchema.find({}).lean();
    fs.writeFileSync('./data.json', JSON.stringify(allData, null, 2));
    console.log("✅ Data exported to data.json");
    process.exit();
  } catch (error) {
    console.log("❌ Error exporting data:", error);
    process.exit(1);
  }
};

exportData();