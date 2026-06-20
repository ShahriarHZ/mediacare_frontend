import { betterAuth } from "betterAuth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("medicareConnect");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3001",
    "https://mediacare-frontend.vercel.app",
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user, ctx) => {
          const role = ctx?.body?.role || "patient";
          const usersCollection = db.collection("users");
          const existingUser = await usersCollection.findOne({ email: user.email });

          if (!existingUser) {
            await usersCollection.insertOne({
              name: user.name,
              email: user.email,
              image: user.image || null,
              role,
              status: "active",
              createdAt: new Date(),
            });
          }

          if (role === "doctor") {
            const doctorsCollection = db.collection("doctors");
            const existingDoctor = await doctorsCollection.findOne({ email: user.email });

            if (!existingDoctor) {
              await doctorsCollection.insertOne({
                email: user.email,
                doctorName: user.name,
                image: user.image || null,
                specialization: "",
                experienceYears: 0,
                appointmentFee: 0,
                rating: 0,
                bio: "",
                schedule: [],
                verificationStatus: "pending",
                createdAt: new Date(),
              });
            }
          }
        },
      },
    },
  },
});