require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Item = require('./models/Item');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Item.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const studentPass = await bcrypt.hash('student123', salt);

  const admin = new User({ name: 'Admin User', email: 'admin@example.com', passwordHash: adminPass, role: 'admin' });
  const student = new User({ name: 'Student One', email: 'student@example.com', passwordHash: studentPass, role: 'student' });

  await admin.save();
  await student.save();

  const items = [
    { name: 'Chemistry Kit', category: 'Lab', condition: 'Good', quantity: 5, available: 5, description: 'Basic chemistry set' },
    { name: 'Football', category: 'Sports', condition: 'Good', quantity: 8, available: 8, description: 'Size 5 footballs' },
    { name: 'DSLR Camera', category: 'Media', condition: 'Fair', quantity: 2, available: 2, description: 'Canon DSLR camera' }
  ];
  await Item.insertMany(items);

  console.log('✅ Seeding complete!');
  console.log('Admin login: admin@example.com / admin123');
  console.log('Student login: student@example.com / student123');
  process.exit(0);
};

seed();
