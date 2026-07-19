const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Users = require("../models/Users");

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await Users.updateMany(
      {},
      {
        $unset: {
          providerId: "",
        },
      }
    );

    console.log(result);

    const user = await Users.findOne({
      email: "varunsivanesan1@gmail.com",
    }).lean();

    console.log("One user:");
    console.log(user);

    const usersWithProviderId = await Users.find({
      providerId: { $exists: true },
    }).lean();

    console.log("Users with providerId:");
    console.log(usersWithProviderId);

    console.log("Migration completed");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();