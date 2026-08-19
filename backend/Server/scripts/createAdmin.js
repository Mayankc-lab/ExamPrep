// Server/scripts/createAdmin.js
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/usermodel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/lms_database';
const targetEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const targetPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  let user = await User.findOne({ email: targetEmail });

  if (!user) {
    user = new User({
      fullName: 'Admin User',
      email: targetEmail,
      password: targetPassword,
      role: 'ADMIN',
    });
    await user.save();
    console.log(`Created admin user: ${targetEmail}`);
  } else {
    user.fullName = 'Admin User';
    user.password = targetPassword;
    user.role = 'ADMIN';
    await user.save();
    console.log(`Updated existing admin user: ${targetEmail}`);
  }

  console.log(`Login with email: ${targetEmail}`);
  console.log(`Password: ${targetPassword}`);

  await mongoose.disconnect();
}

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});