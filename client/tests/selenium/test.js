/**
 * OMTMS Selenium Test Suite
 * Run with: npx wdio run wdio.conf.js
 * or use the standalone version below
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:8080';

let driver;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function initDriver() {
  const options = new chrome.Options();
  options.addArguments('--start-maximized');
  options.addArguments('--disable-dev-shm-usage');
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  return driver;
}

async function closeDriver() {
  if (driver) {
    await driver.quit();
  }
}

// Test 1: Verify Frontend Loads
async function testFrontendLoads() {
  console.log('Test 1: Verify Frontend Loads...');
  try {
    await driver.get(BASE_URL);
    await driver.wait(until.titleContains('OMTMS'), 5000);
    console.log('✓ Frontend loaded successfully');
    return true;
  } catch (e) {
    console.log('✗ Frontend failed to load:', e.message);
    return false;
  }
}

// Test 2: Verify Login Page Elements
async function testLoginPageElements() {
  console.log('Test 2: Verify Login Page Elements...');
  try {
    await driver.get(BASE_URL);
    await sleep(2000);
    
    const emailInput = await driver.findElement(By.xpath('//input[@type="email"]'));
    const passwordInput = await driver.findElement(By.xpath('//input[@type="password"]'));
    const submitButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
    
    console.log('✓ Login page elements present');
    return true;
  } catch (e) {
    console.log('✗ Login page elements missing:', e.message);
    return false;
  }
}

// Test 3: Test Admin Login
async function testAdminLogin() {
  console.log('Test 3: Test Admin Login...');
  try {
    await driver.get(BASE_URL);
    await sleep(2000);
    
    await driver.findElement(By.xpath('//input[@type="email"]')).sendKeys('admin@omtms.com');
    await driver.findElement(By.xpath('//input[@type="password"]')).sendKeys('admin123');
    await driver.findElement(By.xpath('//button[@type="submit"]')).click();
    
    await sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    
    if (currentUrl.includes('/admin')) {
      console.log('✓ Admin login successful');
      return true;
    } else {
      console.log('✗ Admin login failed, redirected to:', currentUrl);
      return false;
    }
  } catch (e) {
    console.log('✗ Admin login error:', e.message);
    return false;
  }
}

// Test 4: Test Customer Login
async function testCustomerLogin() {
  console.log('Test 4: Test Customer Login...');
  try {
    await driver.get(BASE_URL);
    await sleep(2000);
    
    await driver.findElement(By.xpath('//input[@type="email"]')).sendKeys('customer@omtms.com');
    await driver.findElement(By.xpath('//input[@type="password"]')).sendKeys('customer123');
    await driver.findElement(By.xpath('//button[@type="submit"]')).click();
    
    await sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    
    if (currentUrl.includes('/customer')) {
      console.log('✓ Customer login successful');
      return true;
    } else {
      console.log('✗ Customer login failed, redirected to:', currentUrl);
      return false;
    }
  } catch (e) {
    console.log('✗ Customer login error:', e.message);
    return false;
  }
}

// Test 5: Verify Backend API Response
async function testBackendAPI() {
  console.log('Test 5: Verify Backend API Response...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies`);
    const data = await response.json();
    
    if (response.ok || data === null) {
      console.log('✓ Backend API responding');
      return true;
    } else {
      console.log('✗ Backend API error:', response.status);
      return false;
    }
  } catch (e) {
    console.log('✗ Backend API not accessible:', e.message);
    return false;
  }
}

// Test 6: Test Navigation to Register Page
async function testNavigateToRegister() {
  console.log('Test 6: Test Navigate to Register Page...');
  try {
    await driver.get(BASE_URL);
    await sleep(2000);
    
    await driver.findElement(By.xpath('//button[contains(text(), "Create account")]')).click();
    await sleep(2000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/register')) {
      console.log('✓ Navigation to register page successful');
      return true;
    } else {
      console.log('✗ Navigation to register failed');
      return false;
    }
  } catch (e) {
    console.log('✗ Register navigation error:', e.message);
    return false;
  }
}

// Test 7: Test Customer Dashboard Tabs
async function testCustomerDashboardTabs() {
  console.log('Test 7: Test Customer Dashboard Tabs...');
  try {
    // Login as customer
    await driver.get(BASE_URL);
    await sleep(2000);
    await driver.findElement(By.xpath('//input[@type="email"]')).sendKeys('customer@omtms.com');
    await driver.findElement(By.xpath('//input[@type="password"]')).sendKeys('customer123');
    await driver.findElement(By.xpath('//button[@type="submit"]')).click();
    await sleep(3000);
    
    // Check for tabs
    const browseTab = await driver.findElement(By.xpath('//button[contains(text(), "Browse Movies")]'));
    const bookingsTab = await driver.findElement(By.xpath('//button[contains(text(), "My Bookings")]'));
    const loyaltyTab = await driver.findElement(By.xpath('//button[contains(text(), "Loyalty")]'));
    
    console.log('✓ Customer dashboard tabs present');
    return true;
  } catch (e) {
    console.log('✗ Dashboard tabs error:', e.message);
    return false;
  }
}

// Test 8: Test Logout Functionality
async function testLogout() {
  console.log('Test 8: Test Logout Functionality...');
  try {
    // Login first
    await driver.get(BASE_URL);
    await sleep(2000);
    await driver.findElement(By.xpath('//input[@type="email"]')).sendKeys('customer@omtms.com');
    await driver.findElement(By.xpath('//input[@type="password"]')).sendKeys('customer123');
    await driver.findElement(By.xpath('//button[@type="submit"]')).click();
    await sleep(3000);
    
    // Click logout
    await driver.findElement(By.xpath('//button[contains(text(), "Logout")]')).click();
    await sleep(2000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/login')) {
      console.log('✓ Logout successful');
      return true;
    } else {
      console.log('✗ Logout failed');
      return false;
    }
  } catch (e) {
    console.log('✗ Logout error:', e.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n========================================');
  console.log('OMTMS Selenium Test Suite');
  console.log('========================================\n');
  
  await initDriver();
  
  let passed = 0;
  let failed = 0;
  
  const tests = [
    testFrontendLoads,
    testLoginPageElements,
    testBackendAPI,
    testAdminLogin,
    testCustomerLogin,
    testNavigateToRegister,
    testCustomerDashboardTabs,
    testLogout
  ];
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passed++;
      else failed++;
    } catch (e) {
      console.log('Test error:', e.message);
      failed++;
    }
    await sleep(1000);
  }
  
  console.log('\n========================================');
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');
  
  await closeDriver();
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };