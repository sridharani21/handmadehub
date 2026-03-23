const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await mongoose.connection.collection('users').updateOne(
    { email: 'sridharani916@gmail.com' },
    { $set: { isAdmin: true } }
  );
  if (result.modifiedCount === 1) {
    console.log('✅ Admin set successfully!');
  } else {
    console.log('❌ User not found - make sure you registered first');
  }
  process.exit();
});
