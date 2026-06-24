import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { connectDB, closeDB } from '../db.js';
import config from '../config.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Job from '../models/Job.js';
import GalleryPhoto from '../models/GalleryPhoto.js';
import Application from '../models/Application.js';

async function seed() {
  await connectDB();
  console.log('[seed] connected — wiping existing data...');

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Job.deleteMany({}),
    GalleryPhoto.deleteMany({}),
    Application.deleteMany({}),
  ]);

  // ---- Admin user ----
  const passwordHash = await User.hashPassword(config.admin.password);
  const admin = await User.create({
    username: config.admin.username.toLowerCase(),
    passwordHash,
    role: 'admin',
  });
  console.log(`[seed] admin user created: "${admin.username}"`);

  // ---- Test user ----
  const userHash = await User.hashPassword('user123');
  const testUser = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    passwordHash: userHash,
    fullName: 'Test User',
    role: 'user',
    emailVerified: true,
  });
  console.log(`[seed] test user created: "${testUser.username}" (password: user123)`);

  // ---- Products ----
  const trex = await Product.create({
    slug: 't-rex-live-streaming-solution',
    name: 'T-Rex Live Streaming Solution',
    tagline: 'H264/H265 HEVC cellular bonding encoder for broadcast-grade live video.',
    description:
      'The T-Rex is a smart telecaster that bonds multiple cellular and wired connections to stream live, broadcast-grade video from anywhere. With H.264 and H.265 (HEVC) hardware encoding, sub-second latency, and rugged field-ready hardware, T-Rex is purpose-built for live news gathering, live sports, and outside broadcast where reliability and quality matter most.',
    category: 'Live Streaming',
    featured: true,
    order: 1,
    features: [
      'H.264 / H.265 (HEVC) hardware encoding',
      'Multi-link cellular bonding (6x modems)',
      'Sub-second glass-to-glass latency',
      'Built-in battery for all-day field use',
      'SRT, RTMP, RTSP & TS output protocols',
      'Rugged, fanless aluminium enclosure',
    ],
    specs: [
      { label: 'Video Encoding', value: 'H.264 / H.265 (HEVC)' },
      { label: 'Max Resolution', value: '4K UHD @ 60fps' },
      { label: 'Bitrate', value: '0.5 – 30 Mbps' },
      { label: 'Network Bonding', value: '6x cellular + Ethernet + Wi-Fi' },
      { label: 'Latency', value: '< 1 second (SRT)' },
      { label: 'Protocols', value: 'SRT, RTMP, RTSP, TS, HLS' },
      { label: 'Battery Life', value: 'Up to 8 hours' },
      { label: 'Weight', value: '1.4 kg' },
      { label: 'Operating Temp', value: '-10°C to +50°C' },
    ],
    images: [
      '/uploads/placeholder-trex-1.svg',
      '/uploads/placeholder-trex-2.svg',
    ],
  });

  const smartCaster = await Product.create({
    slug: 'smart-telecaster-pro',
    name: 'Smart Telecaster Pro',
    tagline: 'Compact backpack encoder for solo ENG crews.',
    description:
      'The Smart Telecaster Pro is a lightweight, backpack-style live video encoder designed for solo reporters and small ENG teams. It combines bonded cellular connectivity with an intuitive touchscreen interface, so anyone can go live in under a minute.',
    category: 'Live Streaming',
    featured: true,
    order: 2,
    features: [
      'Backpack form-factor, 2.1 kg total',
      '5" sunlight-readable touchscreen',
      '4x cellular modems + bonding',
      'One-touch live streaming',
    ],
    specs: [
      { label: 'Video Encoding', value: 'H.264 / H.265' },
      { label: 'Max Resolution', value: '1080p @ 60fps' },
      { label: 'Network', value: '4x cellular + Ethernet' },
      { label: 'Display', value: '5" touchscreen' },
      { label: 'Weight', value: '2.1 kg' },
    ],
    images: ['/uploads/placeholder-caster-1.svg'],
  });

  console.log(`[seed] products created: ${trex.name}, ${smartCaster.name}`);

  // ---- Jobs ----
  await Job.create([
    {
      slug: 'broadcast-field-engineer',
      title: 'Broadcast Field Engineer',
      department: 'Engineering',
      location: 'Remote (UK / EU)',
      type: 'full-time',
      summary: 'Help broadcasters deploy and troubleshoot T-Rex units in the field.',
      description:
        'We are looking for an experienced field engineer to support our broadcast customers during live events. You will configure encoders, optimise cellular bonding, and provide on-call troubleshooting for mission-critical live streams.',
      requirements: [
        '3+ years in broadcast or live streaming engineering',
        'Hands-on experience with SRT, RTMP and IP video',
        'Comfortable travelling to client sites',
        'Strong troubleshooting under pressure',
      ],
      status: 'open',
      order: 1,
    },
    {
      slug: 'frontend-developer',
      title: 'Frontend Developer (React)',
      department: 'Technology',
      location: 'Hybrid — London',
      type: 'full-time',
      summary: 'Build the marketing site and internal admin tools that power our platform.',
      description:
        'Join our small product team to develop and maintain our customer-facing website and internal CMS. You will work primarily with React, modern CSS, and our Node/Express API.',
      requirements: [
        'Strong React and modern JavaScript skills',
        'Experience building responsive, accessible UIs',
        'Comfortable working closely with a backend API',
        'Eye for design detail',
      ],
      status: 'open',
      order: 2,
    },
    {
      slug: 'sales-account-manager',
      title: 'Sales & Account Manager',
      department: 'Sales',
      location: 'Dubai, UAE',
      type: 'full-time',
      summary: 'Grow our broadcast customer base across the Middle East.',
      description:
        'We need a driven account manager to expand our presence in the MENA broadcast market. You will own the full sales cycle from lead to close for our T-Rex and Smart Telecaster product lines.',
      requirements: [
        'Experience selling to broadcasters or telecoms',
        'Strong existing network in MENA media',
        'Excellent communication in English and Arabic',
      ],
      status: 'open',
      order: 3,
    },
  ]);
  console.log('[seed] jobs created: 3');

  // ---- Gallery (sample placeholder entries — real uploads come via admin) ----
  await GalleryPhoto.create([
    { filename: 'placeholder-trex-1.svg', url: '/uploads/placeholder-trex-1.svg', caption: 'T-Rex encoder in the field', category: 'Products', order: 1 },
    { filename: 'placeholder-caster-1.svg', url: '/uploads/placeholder-caster-1.svg', caption: 'Smart Telecaster Pro', category: 'Products', order: 2 },
    { filename: 'placeholder-OB1.svg', url: '/uploads/placeholder-OB1.svg', caption: 'Outside broadcast at a live match', category: 'Events', order: 3 },
    { filename: 'placeholder-OB2.svg', url: '/uploads/placeholder-OB2.svg', caption: 'Live news gathering', category: 'Events', order: 4 },
  ]);
  console.log('[seed] gallery photos created: 4');

  console.log('\n[seed] done. ✅');
  console.log(`   Admin login → username: "${config.admin.username}"  password: "${config.admin.password}"`);
  await closeDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
