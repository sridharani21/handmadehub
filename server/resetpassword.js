const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const newPassword = await bcrypt.hash('sridharani@13', 12);
  const result = await mongoose.connection.collection('users').updateOne(
    { email: 'sridharani916@gmail.com' },
    { $set: { password: newPassword } }
  );
  if (result.modifiedCount === 1) {
    console.log('✅ Password reset successfully!');
    console.log('📧 Email: sridharani916#gmail.com');
    console.log('🔑 New Password: sridharani@13');
  } else {
    console.log('❌ User not found - check the email');
  }
  process.exit();
});