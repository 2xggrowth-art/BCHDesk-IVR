#!/usr/bin/env node
// ============================================================
// BCH CRM - Flavor Preparation Script
// Updates Capacitor config and Android resources per role
// ============================================================

const fs = require('fs');
const path = require('path');

const flavor = process.argv[2]; // bdc | staff | manager

if (!['bdc', 'staff', 'manager'].includes(flavor)) {
  console.error('Usage: node prepare-flavor.js <bdc|staff|manager>');
  process.exit(1);
}

const FLAVORS = {
  bdc: {
    appId: 'com.crm.bdc',
    appName: 'BCH Caller',
    themeColor: '#1a73e8',
    webDir: 'dist/bdc',
  },
  staff: {
    appId: 'com.crm.staff',
    appName: 'BCH Sales',
    themeColor: '#0d904f',
    webDir: 'dist/staff',
  },
  manager: {
    appId: 'com.crm.manager',
    appName: 'BCH Manager',
    themeColor: '#7c3aed',
    webDir: 'dist/manager',
  },
};

const config = FLAVORS[flavor];

console.log(`\n🔧 Preparing flavor: ${flavor}`);
console.log(`   App ID: ${config.appId}`);
console.log(`   App Name: ${config.appName}`);
console.log(`   Web Dir: ${config.webDir}\n`);

// 1. Update capacitor.config.json (runtime config for cap sync)
const capConfigPath = path.join(__dirname, '..', 'capacitor.config.json');
const capConfig = {
  appId: config.appId,
  appName: config.appName,
  webDir: config.webDir,
  server: { androidScheme: 'https' },
  plugins: {
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
    StatusBar: { style: 'light', backgroundColor: config.themeColor },
  },
};

fs.writeFileSync(capConfigPath, JSON.stringify(capConfig, null, 2));
console.log('✅ Updated capacitor.config.json');

// 2. Copy flavor-specific icon resources
const iconSrcDir = path.join(__dirname, '..', 'android-flavors', flavor);
const iconDestDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

if (fs.existsSync(iconSrcDir) && fs.existsSync(iconDestDir)) {
  // Copy icon files if they exist
  const iconFiles = fs.readdirSync(iconSrcDir);
  for (const file of iconFiles) {
    const src = path.join(iconSrcDir, file);
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      const destSubDir = path.join(iconDestDir, file);
      if (!fs.existsSync(destSubDir)) fs.mkdirSync(destSubDir, { recursive: true });
      const subFiles = fs.readdirSync(src);
      for (const subFile of subFiles) {
        fs.copyFileSync(path.join(src, subFile), path.join(destSubDir, subFile));
      }
    }
  }
  console.log('✅ Copied icon resources');
}

// 3. Update Android strings.xml with app name
const stringsPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
if (fs.existsSync(stringsPath)) {
  let strings = fs.readFileSync(stringsPath, 'utf-8');
  strings = strings.replace(
    /<string name="app_name">.*<\/string>/,
    `<string name="app_name">${config.appName}</string>`
  );
  strings = strings.replace(
    /<string name="title_activity_main">.*<\/string>/,
    `<string name="title_activity_main">${config.appName}</string>`
  );
  fs.writeFileSync(stringsPath, strings);
  console.log('✅ Updated strings.xml');
}

// 4. Update applicationId in build.gradle
const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let gradle = fs.readFileSync(buildGradlePath, 'utf-8');
  gradle = gradle.replace(
    /applicationId\s+"[^"]+"/,
    `applicationId "${config.appId}"`
  );
  // namespace must stay as com.crm.bch to match Java package
  gradle = gradle.replace(
    /namespace\s*=\s*"[^"]+"/,
    `namespace = "com.crm.bch"`
  );
  fs.writeFileSync(buildGradlePath, gradle);
  console.log('✅ Updated build.gradle applicationId');
}

console.log(`\n🎉 Flavor "${flavor}" ready for build!\n`);
