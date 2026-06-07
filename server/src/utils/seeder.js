import User from "../models/User.js";

export const seedDemoUser = async () => {
  try {
    const demoEmail = "demo@chattr.com";
    const existingDemo = await User.findOne({ email: demoEmail });

    if (!existingDemo) {
      console.log("Seeding Demo User...");
      await User.create({
        username: "Demo User",
        email: demoEmail,
        password: "demo1234",
        bio: "Hey there! I am the official Demo User for Chattr. Feel free to use me to explore the app!",
        avatar: "", // Will fall back to "DU" initials avatar
        isOnline: false,
      });
      console.log("Demo User seeded successfully.");
    } else {
      console.log("Demo User already exists in database.");
    }
  } catch (error) {
    console.error("Error seeding Demo User:", error.message);
  }
};
