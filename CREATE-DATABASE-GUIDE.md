# How to Create the hotel_mahi Database

## ❌ **Problem: Database 'hotel_mahi' doesn't exist**

The database doesn't exist because you haven't run the server yet. Here are your options:

---

## 🎯 **Solution 1: Install Node.js and Create Database (Recommended)**

### **Step 1: Install Node.js**
1. **Download Node.js**: https://nodejs.org/
2. **Choose LTS version** (recommended)
3. **Install Node.js** following the setup wizard
4. **Restart your computer** after installation

### **Step 2: Create the Database**
```bash
# After Node.js is installed, run these commands:
npm install
npm start
```

**What happens:**
- The server will start
- Database `hotel_mahi` will be created automatically
- All 12 tables will be created
- Sample data will be inserted
- You can then connect to the database

---

## 🎯 **Solution 2: Use XAMPP (Easier Alternative)**

### **Step 1: Download XAMPP**
1. **Go to**: https://www.apachefriends.org/
2. **Download XAMPP** for Windows
3. **Install XAMPP** following the setup wizard

### **Step 2: Start XAMPP**
1. **Open XAMPP Control Panel**
2. **Start Apache** (click Start button)
3. **Start MySQL** (click Start button)
4. **Both should show "Running" status**

### **Step 3: Create Database Manually**
1. **Open browser**: `http://localhost/phpmyadmin`
2. **Click "New"** in the left sidebar
3. **Enter database name**: `hotel_mahi`
4. **Click "Create"**

### **Step 4: Create Tables**
1. **Select `hotel_mahi` database**
2. **Click "SQL" tab**
3. **Copy and paste the SQL code** (I'll provide this)
4. **Click "Go"** to execute

---

## 🎯 **Solution 3: Use MySQL Command Line**

### **Step 1: Connect to MySQL**
```bash
mysql -u root -p
# Enter your MySQL password
```

### **Step 2: Create Database**
```sql
CREATE DATABASE hotel_mahi;
USE hotel_mahi;
```

### **Step 3: Create Tables**
```sql
-- Copy and paste all the table creation SQL
-- (I'll provide the complete SQL script)
```

---

## 🎯 **Solution 4: Use Our Database Creation Script**

Let me create a script that will create the database and tables for you:

### **Step 1: Create the Script**
I'll create a `create-database.js` script that you can run.

### **Step 2: Run the Script**
```bash
node create-database.js
```

---

## 📋 **Complete SQL Script for Manual Creation**

If you want to create the database manually, here's the complete SQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS hotel_mahi;
USE hotel_mahi;

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  hotel_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1),
  city VARCHAR(100),
  landmark VARCHAR(255),
  street_name VARCHAR(255),
  contact VARCHAR(50)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  customer_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone_no VARCHAR(20),
  street VARCHAR(255),
  city VARCHAR(100),
  landmark VARCHAR(255),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  staff_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_no VARCHAR(20),
  email VARCHAR(255),
  salary DECIMAL(10,2),
  hire_date DATE,
  supervisor_id VARCHAR(20),
  role VARCHAR(50),
  skill VARCHAR(255),
  image_url TEXT,
  FOREIGN KEY (supervisor_id) REFERENCES staff(staff_id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  service_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  charges DECIMAL(10,2),
  category VARCHAR(100),
  description TEXT,
  image_url TEXT
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  room_no VARCHAR(20) PRIMARY KEY,
  hotel_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'available',
  price DECIMAL(10,2) NOT NULL,
  capacity INT,
  type VARCHAR(50),
  rating DECIMAL(3,1),
  location VARCHAR(255),
  image_url TEXT,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Staff-Service Assignment Table (NEW)
CREATE TABLE IF NOT EXISTS staff_service_assignments (
  staff_id VARCHAR(20),
  service_id VARCHAR(20),
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  PRIMARY KEY (staff_id, service_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
  FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- Customer-Service Interaction Table (NEW)
CREATE TABLE IF NOT EXISTS customer_service_interactions (
  service_id VARCHAR(20),
  customer_id VARCHAR(50),
  service_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  PRIMARY KEY (service_id, customer_id, service_date),
  FOREIGN KEY (service_id) REFERENCES services(service_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  booking_id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50),
  room_no VARCHAR(20),
  checkin_date DATE,
  checkout_date DATE,
  guests INT,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (room_no) REFERENCES rooms(room_no)
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
  membership_id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50),
  type VARCHAR(50),
  start_date DATE,
  expire_date DATE,
  no_of_bookings INT DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_no VARCHAR(20) PRIMARY KEY,
  customer_id VARCHAR(50),
  brand VARCHAR(100),
  model VARCHAR(100),
  color VARCHAR(50),
  type VARCHAR(50),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Parking table
CREATE TABLE IF NOT EXISTS parking (
  parking_id VARCHAR(50) PRIMARY KEY,
  vehicle_no VARCHAR(20),
  time_in TIMESTAMP,
  time_out TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  FOREIGN KEY (vehicle_no) REFERENCES vehicles(vehicle_no)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id VARCHAR(50) PRIMARY KEY,
  booking_id VARCHAR(50),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
```

---

## 🚀 **Recommended Steps**

### **For Complete Setup (Best Option):**
1. **Install Node.js**: https://nodejs.org/
2. **Restart computer**
3. **Run**: `npm install`
4. **Run**: `npm start`
5. **Database will be created automatically**

### **For Quick Setup (Alternative):**
1. **Install XAMPP**: https://www.apachefriends.org/
2. **Start Apache and MySQL**
3. **Open**: `http://localhost/phpmyadmin`
4. **Create database**: `hotel_mahi`
5. **Copy and paste the SQL script above**
6. **Execute the SQL**

---

## ✅ **After Database Creation**

Once the database is created, you can:
- **Connect with MySQL Workbench**
- **View data with phpMyAdmin**
- **Run our database viewer script**
- **Use any connection method**

The database will contain all 12 tables including the new relation tables for staff assignments and customer service interactions.



