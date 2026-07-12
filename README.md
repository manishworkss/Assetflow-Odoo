# AssetFlow - Enterprise Asset & Resource Management System

**AssetFlow** is a comprehensive, full-stack web application designed to help organizations efficiently manage their company assets, track resource allocations, handle maintenance requests, and monitor audit logs in real-time. 

## 🚀 Tech Stack

### Backend
- **Java 17** & **Spring Boot 3.2.5**
- **Spring Security + JWT** (Stateless authentication & authorization)
- **Spring Data JPA** (Database ORM)
- **MySQL / H2 Database** (Data persistence)
- **Springdoc OpenAPI / Swagger** (API Documentation)
- **Maven** (Dependency & Build Management)

### Frontend
- **React 19** & **Vite** (Blazing fast development server & bundler)
- **Tailwind CSS v4** (Utility-first styling & responsive design)
- **Zustand** (Lightweight global state management)
- **React Query** (Server state, caching, & data fetching)
- **React Router** (Client-side routing)
- **Recharts** (Data visualization and analytics)
- **Lucide React** (Beautiful, consistent iconography)
- **Axios** (API requests)

---

## 📋 Core Features

- **Secure Access:** Role-based access control (RBAC) with JWT-secured REST APIs.
- **Asset Management:** End-to-end lifecycle management of company assets (Create, Read, Update, Delete).
- **Real-Time Status Tracking:** Track whether an asset is Available, In Use, or Under Maintenance.
- **Resource Booking:** Allow employees to seamlessly request, book, and manage resources.
- **Asset Allocation:** Dashboard to monitor which assets are assigned to which employees or departments.
- **Maintenance Ticketing:** Integrated system to log, track, and resolve maintenance issues for faulty assets.
- **Audit Logging:** Reliable audit trail for tracking system actions and compliance.
- **Interactive Dashboards:** Visualized data insights utilizing Recharts.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (Optional if using H2)

---

## ⚙️ Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/manishworkss/Assetflow-Odoo.git
cd Assetflow-Odoo
```

### 2. Backend Setup
The backend runs on port `8080` by default.

1. **Configure Database:** Open `src/main/resources/application.properties` (or `.yml`) and update your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/assetflow_db
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   spring.jpa.hibernate.ddl-auto=update
   ```
2. **Build the Backend:**
   ```bash
   mvn clean install
   ```
3. **Run the Backend Server:**
   ```bash
   mvn spring-boot:run
   ```

### 3. Frontend Setup
The frontend runs on Vite's default port, typically `5173`.

1. **Navigate to the Frontend directory:**
   ```bash
   cd Frontend
   ```
2. **Configure Environment Variables:**
   Create a `.env` file (or use `.env.development`) in the `Frontend` directory to point to your backend API:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Run the Frontend Development Server:**
   ```bash
   npm run dev
   ```

---

## 📖 API Documentation (Swagger)

The backend uses **Springdoc OpenAPI** to generate interactive API documentation automatically. 

Once the Spring Boot server is running, you can explore, test, and interact with the endpoints directly from your browser by navigating to:
- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON Spec:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🏗️ Project Structure

```text
Assetflow-Odoo/
 │
 ├── Frontend/               # React Vite Application
 │    ├── src/               # React Components, Pages, Stores, Hooks
 │    ├── public/            # Static Assets
 │    ├── package.json       # Node Dependencies
 │    └── vite.config.js     # Vite Configuration
 │
 ├── src/main/java/.../backend/ # Spring Boot Application
 │    ├── config             # Security (JWT, CORS) & App Configurations
 │    ├── controller         # REST API Endpoints
 │    ├── entity             # JPA Entities (Database Tables)
 │    ├── enums              # Status Enumerations
 │    ├── exception          # Global Error Handling
 │    ├── repository         # Database Access Layer
 │    ├── response           # DTOs for structured API responses
 │    └── service            # Core Business Logic
 │
 └── pom.xml                 # Maven Dependencies
```
