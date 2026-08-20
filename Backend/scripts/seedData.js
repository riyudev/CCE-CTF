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
    originalFileName: "cipher.txt",
    fileData: Buffer.from("Orsn{uvqqra_zrffntr} -> Decrypt this ROT13 cipher string to get the flag: CCE{hidden_message}\n").toString("base64"),
    flag: "CCE{hidden_message}",
  },
  {
    title: "Web Starter",
    category: "WEB",
    difficulty: "EASY",
    points: 100,
    description: "Find the flag hidden somewhere in the source code or developer comments of this web application.",
    fileUrl: null,
    originalFileName: null,
    fileData: null,
    flag: "CCE{web_starter_flag}",
  },
  {
    title: "Lost File",
    category: "FORENSICS",
    difficulty: "MEDIUM",
    points: 200,
    description: "A corrupted disk image was recovered from a suspected system breach. Investigate the provided file and discover the hidden flag.",
    fileUrl: "disk_dump.raw",
    originalFileName: "disk_dump.raw",
    fileData: Buffer.from("CCE CTF Disk Dump Raw Image Data\nFlag: CCE{lost_file_found}\n").toString("base64"),
    flag: "CCE{lost_file_found}",
  },
  {
    title: "Broken Code",
    category: "REVERSE",
    difficulty: "MEDIUM",
    points: 250,
    description: "Reverse engineer the compiled binary to understand its authentication logic and recover the hidden flag key.",
    fileUrl: "auth_checker.bin",
    originalFileName: "auth_checker.bin",
    fileData: Buffer.from("ELF Header Binary Sample Data\nFlag: CCE{reverse_engineering_master}\n").toString("base64"),
    flag: "CCE{reverse_engineering_master}",
  },
  {
    title: "Something Strange",
    category: "MISC",
    difficulty: "EASY",
    points: 150,
    description: "An unusual QR code pattern was submitted to the security desk. Inspect the payload data to retrieve the flag.",
    fileUrl: "strange_qr.png",
    originalFileName: "strange_qr.png",
    fileData: Buffer.from("QR Code Payload Data Sample\nFlag: CCE{something_strange_indeed}\n").toString("base64"),
    flag: "CCE{something_strange_indeed}",
  },
  {
    title: "RSA Encryption 101",
    category: "CRYPTO",
    difficulty: "EASY",
    points: 100,
    description: "An insecure RSA public exponent was used to encrypt the flag. Factorize the modulus and decrypt the ciphertext.",
    fileUrl: "rsa_pubkey.pem",
    originalFileName: "rsa_pubkey.pem",
    fileData: Buffer.from("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz...\n-----END PUBLIC KEY-----\nFlag: CCE{rsa_small_e_attack}\n").toString("base64"),
    flag: "CCE{rsa_small_e_attack}",
  },
  {
    title: "SQL Injection Probe",
    category: "WEB",
    difficulty: "MEDIUM",
    points: 200,
    description: "Bypass the login portal of a vulnerable web service using SQL injection techniques to reveal the administrator flag.",
    fileUrl: null,
    originalFileName: null,
    fileData: null,
    flag: "CCE{sql_injection_bypass}",
  },
  {
    title: "Network Packet Trace",
    category: "FORENSICS",
    difficulty: "EASY",
    points: 100,
    description: "Analyze the Wireshark pcap file capture to extract transmitted credentials containing the flag.",
    fileUrl: "traffic_capture.pcap",
    originalFileName: "traffic_capture.pcap",
    fileData: Buffer.from("Wireshark PCAP Packet Trace Sample Data\nFlag: CCE{wireshark_packet_found}\n").toString("base64"),
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
