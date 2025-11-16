# How to View Your MySQL Database

## 🗄️ **Database Information**
- **Database Name**: `hotel_mahi`
- **Tables**: 12 tables including the new relation tables
- **Location**: MySQL server on your computer

---

## 🎯 **Method 1: MySQL Workbench (Recommended)**

### **Step 1: Download MySQL Workbench**
1. Go to: https://dev.mysql.com/downloads/workbench/
2. Download MySQL Workbench (free)
3. Install it on your computer

### **Step 2: Connect to Database**
1. Open MySQL Workbench
2. Click "New Connection"
3. Enter connection details:
   - **Connection Name**: Hotel Mahi
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: root
   - **Password**: (your MySQL password)
4. Click "Test Connection" then "OK"

### **Step 3: View Database**
1. Double-click your connection to connect
2. In the left panel, expand "hotel_mahi" database
3. Click on any table to view its data
4. Use the "Table Data" tab to see all records

---

## 🎯 **Method 2: phpMyAdmin (If using XAMPP)**

### **Step 1: Start XAMPP**
1. Download XAMPP from: https://www.apachefriends.org/
2. Install and start XAMPP
3. Start Apache and MySQL services

### **Step 2: Access phpMyAdmin**
1. Open browser
2. Go to: `http://localhost/phpmyadmin`
3. Select `hotel_mahi` database from left sidebar
4. Click on any table to view data

---

## 🎯 **Method 3: Command Line (Advanced)**

### **Step 1: Open MySQL Command Line**
```bash
# Windows
mysql -u root -p

# Enter your MySQL password when prompted
```

### **Step 2: View Database**
```sql
-- Show all databases
SHOW DATABASES;

-- Use hotel_mahi database
USE hotel_mahi;

-- Show all tables
SHOW TABLES;

-- View specific table data
SELECT * FROM customers;
SELECT * FROM staff;
SELECT * FROM rooms;
SELECT * FROM services;

-- View relation tables
SELECT * FROM staff_service_assignments;
SELECT * FROM customer_service_interactions;
```

---

## 🎯 **Method 4: VS Code Extension**

### **Step 1: Install MySQL Extension**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "MySQL"
4. Install "MySQL" extension

### **Step 2: Connect to Database**
1. Open Command Palette (Ctrl+Shift+P)
2. Type "MySQL: Connect"
3. Enter connection details
4. Browse database in VS Code

---

## 📊 **Your Database Tables**

### **Main Tables**
| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| `hotels` | Hotel information | hotel_id, name, rating |
| `customers` | Customer profiles | customer_id, name, email |
| `rooms` | Room details | room_no, price, status |
| `staff` | Staff information | staff_id, name, role |
| `services` | Service offerings | service_id, name, charges |

### **Relation Tables (NEW)**
| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| `staff_service_assignments` | Staff-Service relations | staff_id, service_id, assigned_date |
| `customer_service_interactions` | Customer service history | service_id, customer_id, service_date |

### **Other Tables**
| Table Name | Purpose |
|------------|---------|
| `bookings` | Room reservations |
| `memberships` | Customer memberships |
| `vehicles` | Customer vehicles |
| `parking` | Parking reservations |
| `payments` | Payment records |

---

## 🔍 **Useful SQL Queries**

### **View All Customers**
```sql
SELECT customer_id, name, email, phone_no, city 
FROM customers 
ORDER BY created_at DESC;
```

### **View Staff Assignments**
```sql
SELECT s.name as staff_name, s.role, 
       sv.name as service_name, sv.category,
       ssa.assigned_date, ssa.status
FROM staff_service_assignments ssa
JOIN staff s ON ssa.staff_id = s.staff_id
JOIN services sv ON ssa.service_id = sv.service_id;
```

### **View Customer Service History**
```sql
SELECT c.name as customer_name, 
       s.name as service_name, s.category,
       csi.service_date, csi.remarks, csi.status
FROM customer_service_interactions csi
JOIN customers c ON csi.customer_id = c.customer_id
JOIN services s ON csi.service_id = s.service_id
ORDER BY csi.service_date DESC;
```

### **View Room Bookings**
```sql
SELECT b.booking_id, c.name as customer_name,
       r.room_no, r.type, r.price,
       b.checkin_date, b.checkout_date, b.status
FROM bookings b
JOIN customers c ON b.customer_id = c.customer_id
JOIN rooms r ON b.room_no = r.room_no
ORDER BY b.checkin_date DESC;
```

---

## 🚀 **Quick Start Guide**

### **Easiest Method (XAMPP + phpMyAdmin)**
1. **Download XAMPP**: https://www.apachefriends.org/
2. **Install and start** XAMPP
3. **Start Apache and MySQL** in XAMPP Control Panel
4. **Open browser**: `http://localhost/phpmyadmin`
5. **Select database**: `hotel_mahi`
6. **Click any table** to view data

### **Professional Method (MySQL Workbench)**
1. **Download MySQL Workbench**: https://dev.mysql.com/downloads/workbench/
2. **Create new connection** with your MySQL details
3. **Connect and browse** the `hotel_mahi` database
4. **View tables and data** with full SQL capabilities

---

## 📋 **Database Connection Details**

### **Default Connection Settings**
- **Host**: localhost
- **Port**: 3306
- **Database**: hotel_mahi
- **Username**: root
- **Password**: (your MySQL password)

### **If You Don't Know Your MySQL Password**
1. **Reset MySQL password** or
2. **Use XAMPP** (password is usually empty)
3. **Check your MySQL installation** documentation

---

## 🎯 **What You'll See**

### **Sample Data in Tables**
- **Customers**: User profiles with Customer IDs
- **Rooms**: Available and booked rooms
- **Staff**: Hotel staff with roles and skills
- **Services**: Food, spa, parking services
- **Bookings**: Room reservations
- **Staff Assignments**: Which staff handle which services
- **Service History**: Customer service interactions

### **Real-time Updates**
- **New registrations** appear in `customers` table
- **New bookings** appear in `bookings` table
- **Staff assignments** appear in `staff_service_assignments` table
- **Service interactions** appear in `customer_service_interactions` table

---

## 🔧 **Troubleshooting**

### **Can't Connect to MySQL**
1. **Check if MySQL is running**
2. **Verify connection details**
3. **Try XAMPP** (easier setup)

### **Database Not Found**
1. **Run the server** first: `npm start`
2. **Database is created automatically**
3. **Check if tables exist**

### **Permission Issues**
1. **Use root user** or create new MySQL user
2. **Grant proper permissions**
3. **Check MySQL configuration**

---

## 📊 **Database Statistics**

Your database will contain:
- **12 tables** total
- **2 new relation tables** (as per your design)
- **Sample data** for testing
- **Real customer data** when users register
- **Booking and service data** when users interact

The database is fully functional and ready to store all your hotel management data!



