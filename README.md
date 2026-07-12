# Assetflow Backend

**AssetFlow Enterprise Asset & Resource Management System** is a robust, secure, and scalable backend application built with Spring Boot. It provides a comprehensive set of APIs to manage organizational assets, allocate resources, handle maintenance requests, and track audit logs.

## 🚀 Technologies Used

- **Java 17**
- **Spring Boot 3.2.5** 
  - Spring Web (REST APIs)
  - Spring Data JPA (Database operations)
  - Spring Security (Authentication & Authorization)
  - Spring Validation (Input validation)
- **JSON Web Tokens (JWT)** (Secure stateless authentication)
- **MySQL / H2 Database** (Data persistence)
- **Springdoc OpenAPI / Swagger** (API Documentation)
- **Lombok** (Boilerplate code reduction)
- **Maven** (Build and dependency management)

## 📋 Features

- **Authentication & Security:** Secure REST APIs using JWT based authentication and role-based access control.
- **Asset Management:** Create, read, update, and delete company assets, alongside tracking their real-time statuses (e.g., Available, In Use, Under Maintenance).
- **Resource Booking:** Allow employees/users to request and book resources with integrated status tracking (e.g., Pending, Approved, Rejected).
- **Asset Allocation:** Track which assets are currently assigned to which employees or departments.
- **Maintenance Requests:** Submit, track, and resolve maintenance tickets for faulty assets.
- **Audit Logging:** Maintain a reliable history of system actions and asset modifications for compliance and tracking.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (if running in production/dev mode)

## ⚙️ Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manishworkss/Assetflow-Odoo.git
   cd Assetflow-Odoo
