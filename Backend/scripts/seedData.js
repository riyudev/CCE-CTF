import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Challenge } from "../models/Challenge.js";
import { Competition } from "../models/Competition.js";

dotenv.config();

const initialChallenges = [
  {
    title: "Hidden Message",
    category: "CRYPTO",
    difficulty: "EASY",
    points: 100,
    description: "A mysterious message has been discovered in an intercepted cipher string. Analyze the information provided and find the hidden flag.",
    fileUrl: "cipher.txt",
    flag: "CCE{hidden_message}",
  },
  {
    title: "Web Starter",
    category: "WEB",
    difficulty: "EASY",
    points: 100,
    description: "Find the flag hidden somewhere in the source code or developer comments of this web application.",
    fileUrl: null,
    flag: "CCE{web_starter_flag}",
  },
  {
    title: "Lost File",
    category: "FORENSICS",
    difficulty: "MEDIUM",
    points: 200,
    description: "A corrupted disk image was recovered from a suspected system breach. Investigate the provided file and discover the hidden flag.",
    fileUrl: "disk_dump.raw",
    flag: "CCE{lost_file_found}",
  },
  {
    title: "Broken Code",
    category: "REVERSE",
    difficulty: "MEDIUM",
    points: 250,
    description: "Reverse engineer the compiled binary to understand its authentication logic and recover the hidden flag key.",
    fileUrl: "auth_checker.bin",
    flag: "CCE{reverse_engineering_master}",
  },
  {
    title: "Something Strange",
    category: "MISC",
    difficulty: "EASY",
    points: 150,
    description: "An unusual QR code pattern was submitted to the security desk. Inspect the payload data to retrieve the flag.",
    fileUrl: "strange_qr.png",
    flag: "CCE{something_strange_indeed}",
  },
  {
    title: "RSA Encryption 101",
    category: "CRYPTO",
    difficulty: "EASY",
    points: 100,
    description: "An insecure RSA public exponent was used to encrypt the flag. Factorize the modulus and decrypt the ciphertext.",
    fileUrl: "rsa_pubkey.pem",
    flag: "CCE{rsa_small_e_attack}",
  },
  {
    title: "SQL Injection Probe",
    category: "WEB",
    difficulty: "MEDIUM",
    points: 200,
    description: "Bypass the login portal of a vulnerable web service using SQL injection techniques to reveal the administrator flag.",
    fileUrl: null,
    flag: "CCE{sql_injection_bypass}",
  },
  {
    title: "Network Packet Trace",
    category: "FORENSICS",
    difficulty: "EASY",
    points: 100,
    description: "Analyze the Wireshark pcap file capture to extract transmitted credentials containing the flag.",
    fileUrl: "traffic_capture.pcap",
    flag: "CCE{wireshark_packet_found}",
  },
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cce_ctf";
    await mongoose.connect(mongoUri);
    console.log("[SEED] Connected to MongoDB.");

    // 1. Seed Admin User
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@cce.edu";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword2026!";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "CCE Admin",
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`[SEED] Created Admin user: ${adminEmail}`);
    } else {
      console.log(`[SEED] Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Challenges
    const countChallenges = await Challenge.countDocuments();
    if (countChallenges === 0) {
      await Challenge.insertMany(initialChallenges);
      console.log(`[SEED] Seeded ${initialChallenges.length} initial CTF challenges.`);
    } else {
      console.log(`[SEED] Challenges already populated (${countChallenges} found).`);
    }

    // 3. Seed Competition Settings
    const competition = await Competition.findOne();
    if (!competition) {
      await Competition.create({
        name: "CCE CTF Competition",
        status: "LIVE",
        registrationOpen: true,
        maxTeamSize: 5,
      });
      console.log("[SEED] Created default Competition Settings.");
    }

    console.log("[SEED] Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("[SEED] Error:", error.message);
    process.exit(1);
  }
};

seed();
