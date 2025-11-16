# MySQL Database Connection Methods

## 🔗 **Connection Methods for Hotel Mahi Database**

### **Method 1: MySQL Workbench (Professional GUI)**

**Connection Details:**
```
Connection Name: Hotel Mahi
Hostname: localhost
Port: 3306
Username: root
Password: [your MySQL password]
Database: hotel_mahi
```

**How to Connect:**
1. Open MySQL Workbench
2. Click "New Connection" (+)
3. Enter the details above
4. Click "Test Connection"
5. Click "OK" to save
6. Double-click the connection to connect

---

### **Method 2: Command Line (Terminal)**

**Connection Command:**
```bash
mysql -u root -p
```

**Steps:**
1. Open Command Prompt (cmd)
2. Type: `mysql -u root -p`
3. Enter your MySQL password
4. Type: `USE hotel_mahi;`
5. Run SQL queries

**Example Commands:**
```sql
-- Show all tables
SHOW TABLES;

-- View customers
SELECT * FROM customers;

-- View staff assignments
SELECT * FROM staff_service_assignments;
```

---

### **Method 3: phpMyAdmin (Web Interface)**

**URL:** `http://localhost/phpmyadmin`

**Requirements:**
- XAMPP installed and running
- Apache and MySQL services started

**Steps:**
1. Start XAMPP Control Panel
2. Start Apache and MySQL
3. Open browser
4. Go to: `http://localhost/phpmyadmin`
5. Select `hotel_mahi` database
6. Click on any table to view data

---

### **Method 4: VS Code Extension**

**Extension:** MySQL Extension for VS Code

**Steps:**
1. Install MySQL extension in VS Code
2. Press `Ctrl+Shift+P`
3. Type "MySQL: Connect"
4. Enter connection details
5. Browse database in VS Code

---

### **Method 5: Node.js Script (Our Custom Viewer)**

**File:** `view-database.js`

**Connection Details in Script:**
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Change this to your MySQL password
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

**How to Run:**
```bash
# Update password in view-database.js first
node view-database.js

# OR use the batch file
view-database.bat
```

---

## 🔧 **Connection Troubleshooting**

### **Common Connection Issues:**

**1. "Can't connect to MySQL server"**
- **Cause:** MySQL service not running
- **Solution:** Start MySQL service or use XAMPP

**2. "Access denied for user 'root'"**
- **Cause:** Wrong password
- **Solution:** Check your MySQL password or try empty password

**3. "Unknown database 'hotel_mahi'"**
- **Cause:** Database not created yet
- **Solution:** Run `npm start` first to create the database

**4. "Connection refused"**
- **Cause:** MySQL not running on port 3306
- **Solution:** Start MySQL service

---

## 📊 **Connection Details Summary**

| Method | Host | Port | Username | Password | Database |
|--------|------|------|----------|----------|----------|
| MySQL Workbench | localhost | 3306 | root | [your password] | hotel_mahi |
| Command Line | localhost | 3306 | root | [your password] | hotel_mahi |
| phpMyAdmin | localhost | 3306 | root | [your password] | hotel_mahi |
| VS Code | localhost | 3306 | root | [your password] | hotel_mahi |
| Node.js Script | localhost | 3306 | root | [your password] | hotel_mahi |

---

## 🎯 **Recommended Connection Methods**

### **For Beginners:**
1. **XAMPP + phpMyAdmin** (easiest)
2. **Our custom script** (view-database.bat)

### **For Professionals:**
1. **MySQL Workbench** (best GUI)
2. **Command Line** (most powerful)

### **For Developers:**
1. **VS Code Extension** (integrated)
2. **Node.js Script** (customizable)

---

## 🚀 **Quick Start Guide**

### **Easiest Method (XAMPP):**
1. Download XAMPP: https://www.apachefriends.org/
2. Install and start XAMPP
3. Start Apache and MySQL
4. Open: `http://localhost/phpmyadmin`
5. Select `hotel_mahi` database

### **Professional Method (MySQL Workbench):**
1. Download MySQL Workbench
2. Create connection with details above
3. Connect and browse database

### **Custom Method (Our Script):**
1. Update password in `view-database.js`
2. Run: `view-database.bat`
3. View all data in terminal

---

## 🔍 **What You'll See After Connecting**

### **Database Structure:**
- **12 tables** in hotel_mahi database
- **2 new relation tables** (staff_service_assignments, customer_service_interactions)
- **Complete hotel management system**

### **Sample Data:**
- **Customer profiles** with unique Customer IDs
- **Staff information** with roles and skills
- **Room details** with prices and availability
- **Service offerings** with categories and charges
- **Booking records** with dates and status
- **Staff assignments** linking staff to services
- **Service interactions** tracking customer usage

### **Real-time Updates:**
- **New registrations** appear in customers table
- **New bookings** appear in bookings table
- **Staff assignments** appear in staff_service_assignments table
- **Service interactions** appear in customer_service_interactions table

---

## ✅ **Connection Success Checklist**

- [ ] MySQL service is running
- [ ] Correct hostname (localhost)
- [ ] Correct port (3306)
- [ ] Correct username (root)
- [ ] Correct password
- [ ] Database exists (hotel_mahi)
- [ ] Can see all 12 tables
- [ ] Can view table data
- [ ] Can run SQL queries

Choose the connection method that works best for you!



