# MySQL Workbench Setup - Professional Database Viewing

## 🎯 **Step-by-Step Guide to View Your Hotel Mahi Database**

### **Step 1: Download MySQL Workbench**

1. **Go to the official MySQL website**
   - Visit: https://dev.mysql.com/downloads/workbench/
   - Click "Download" for MySQL Workbench

2. **Choose your operating system**
   - Select "Microsoft Windows" (since you're on Windows)
   - Choose the appropriate version (64-bit recommended)

3. **Download the installer**
   - Click "Download" for the MSI installer
   - File size: ~50MB
   - Save to your Downloads folder

### **Step 2: Install MySQL Workbench**

1. **Run the installer**
   - Double-click the downloaded MSI file
   - Click "Yes" if Windows asks for permission

2. **Follow the installation wizard**
   - Click "Next" on the welcome screen
   - Accept the license agreement
   - Choose "Complete" installation type
   - Click "Install"

3. **Complete installation**
   - Wait for installation to finish
   - Click "Finish" when done
   - MySQL Workbench is now installed

### **Step 3: Open MySQL Workbench**

1. **Launch the application**
   - Press `Windows + R`
   - Type `mysql-workbench` and press Enter
   - OR find it in Start Menu → MySQL Workbench

2. **You'll see the main interface**
   - Welcome screen with connection options
   - Left panel for database management
   - Main area for SQL queries and data viewing

### **Step 4: Create Database Connection**

1. **Click "New Connection"**
   - Look for the "+" icon next to "MySQL Connections"
   - OR click "Database" → "New Connection"

2. **Enter connection details**
   ```
   Connection Name: Hotel Mahi
   Hostname: localhost
   Port: 3306
   Username: root
   Password: [your MySQL password]
   ```

3. **Test the connection**
   - Click "Test Connection" button
   - If successful, you'll see "Successfully made the MySQL connection"
   - If failed, check your MySQL password and make sure MySQL is running

4. **Save the connection**
   - Click "OK" to save the connection
   - You'll see "Hotel Mahi" in your connections list

### **Step 5: Connect to Your Database**

1. **Double-click your connection**
   - Click on "Hotel Mahi" connection
   - Enter your MySQL password when prompted
   - Click "OK"

2. **You're now connected!**
   - You'll see the main Workbench interface
   - Left panel shows your database structure
   - Ready to explore your data

### **Step 6: Navigate to Your Database**

1. **Find the hotel_mahi database**
   - In the left panel, look for "SCHEMAS"
   - Expand the schemas list
   - Look for "hotel_mahi" database
   - Click the arrow to expand it

2. **View all tables**
   - You'll see all your tables listed:
     - customers
     - staff
     - rooms
     - services
     - staff_service_assignments
     - customer_service_interactions
     - bookings
     - memberships
     - vehicles
     - parking
     - payments
     - hotels

### **Step 7: View Table Data**

1. **Click on any table**
   - For example, click on "customers"
   - The table structure will appear in the main area

2. **View table data**
   - Right-click on the table name
   - Select "Select Rows - Limit 1000"
   - OR click the table icon next to the table name
   - You'll see all the data in that table

3. **Navigate through data**
   - Use the scroll bars to see more data
   - Use the navigation buttons at the bottom
   - Click on column headers to sort data

### **Step 8: Run SQL Queries**

1. **Open SQL editor**
   - Click "File" → "New Query Tab"
   - OR press `Ctrl + T`
   - A new SQL editor window opens

2. **Write and run queries**
   ```sql
   -- View all customers
   SELECT * FROM customers;
   
   -- View staff assignments
   SELECT s.name as staff_name, sv.name as service_name
   FROM staff_service_assignments ssa
   JOIN staff s ON ssa.staff_id = s.staff_id
   JOIN services sv ON ssa.service_id = sv.service_id;
   
   -- View customer service history
   SELECT c.name, s.name as service_name, csi.service_date
   FROM customer_service_interactions csi
   JOIN customers c ON csi.customer_id = c.customer_id
   JOIN services s ON csi.service_id = s.service_id;
   ```

3. **Execute queries**
   - Click the lightning bolt icon (⚡)
   - OR press `Ctrl + Enter`
   - Results appear in the bottom panel

### **Step 9: Explore Your Data**

1. **View customer data**
   - Click on "customers" table
   - See all registered users with their Customer IDs
   - View names, emails, phone numbers, addresses

2. **View staff assignments**
   - Click on "staff_service_assignments" table
   - See which staff are assigned to which services
   - View assignment dates and status

3. **View service interactions**
   - Click on "customer_service_interactions" table
   - See customer service history
   - View service dates and remarks

4. **View bookings**
   - Click on "bookings" table
   - See room reservations
   - View check-in/check-out dates

### **Step 10: Advanced Features**

1. **Create custom queries**
   - Use the SQL editor for complex queries
   - Save frequently used queries
   - Export data to CSV/Excel

2. **Database administration**
   - View table structures
   - Modify table schemas
   - Create indexes
   - Manage users and permissions

3. **Data visualization**
   - Create ER diagrams
   - View table relationships
   - Export database schema

## 🔧 **Troubleshooting**

### **Connection Issues**
- **"Can't connect to MySQL server"**
  - Make sure MySQL is running
  - Check if MySQL service is started
  - Verify the port (3306) is correct

- **"Access denied for user 'root'"**
  - Check your MySQL password
  - Try connecting with empty password
  - Reset MySQL password if needed

### **Database Not Found**
- **"Unknown database 'hotel_mahi'"**
  - Run your Node.js server first: `npm start`
  - The database is created automatically
  - Check if the server started successfully

### **Permission Issues**
- **"Access denied" errors**
  - Make sure you're using the root user
  - Check MySQL user permissions
  - Grant proper database access

## 📊 **What You'll See**

### **Database Structure**
- **12 tables** in your hotel_mahi database
- **2 new relation tables** (staff_service_assignments, customer_service_interactions)
- **Complete hotel management system** with all data

### **Sample Data**
- **Customer profiles** with unique Customer IDs
- **Staff information** with roles and skills
- **Room details** with prices and availability
- **Service offerings** with categories and charges
- **Booking records** with dates and status
- **Staff assignments** linking staff to services
- **Service interactions** tracking customer usage

### **Real-time Updates**
- **New registrations** appear in customers table
- **New bookings** appear in bookings table
- **Staff assignments** appear in staff_service_assignments table
- **Service interactions** appear in customer_service_interactions table

## 🎯 **Quick Reference**

### **Essential Queries**
```sql
-- View all customers
SELECT customer_id, name, email, city FROM customers;

-- View staff with their assignments
SELECT s.name, s.role, sv.name as service_name
FROM staff_service_assignments ssa
JOIN staff s ON ssa.staff_id = s.staff_id
JOIN services sv ON ssa.service_id = sv.service_id;

-- View customer service history
SELECT c.name, s.name as service_name, csi.service_date, csi.remarks
FROM customer_service_interactions csi
JOIN customers c ON csi.customer_id = c.customer_id
JOIN services s ON csi.service_id = s.service_id
ORDER BY csi.service_date DESC;
```

### **Navigation Tips**
- **Left panel**: Database structure and tables
- **Main area**: Table data and SQL queries
- **Bottom panel**: Query results and messages
- **Right panel**: Table properties and indexes

## ✅ **Success Checklist**

- [ ] MySQL Workbench installed
- [ ] Connection created and tested
- [ ] Connected to hotel_mahi database
- [ ] Can view all tables
- [ ] Can see table data
- [ ] Can run SQL queries
- [ ] Can see relation tables working

You now have professional database management capabilities for your Hotel Mahi system!



