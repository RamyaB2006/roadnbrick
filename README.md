# RoadNBrick – Smart Construction Material Marketplace  
***

## 📌 Project Overview

RoadNBrick is a web platform that connects **contractors / builders** with **nearby construction material suppliers** using interactive maps, smart search, and a streamlined quotation workflow. It helps contractors discover suppliers by distance, price, and availability, while enabling suppliers to manage inventory and respond to requests from a unified dashboard.

***

## 🧱 Core Features

- 🌐 **Geo‑aware supplier discovery** – Contractors view nearby suppliers (cement, bricks, sand, aggregates, etc.) with distance indicators and key details.  
- 📦 **Supplier inventory management** – Suppliers maintain their material catalog (price, unit, stock, status) from a dedicated dashboard.  
- 📨 **Request & quotation flow** – Contractors send material requests; suppliers can **accept / reject** and respond with a quote (price, delivery time, terms).  
- ✅ **Contractor decision tracking** – Contractors can **confirm** or **withdraw** accepted quotations; suppliers see the final decision and completion status.  
- 👥 **Role‑based experience** – Separate views and capabilities for **Contractor / Builder** and **Material Supplier** roles.  
- 🔒 **Secure authentication** – JWT‑based login and registration with protected routes for dashboards and APIs.  

***

## 🧩 Architecture Overview

1. **Frontend (Client Layer)**  
   - Built with **React + Vite** for a fast, SPA‑style experience.  
   - React Router handles navigation between Home, Login/Register, Contractor Dashboard, and Supplier Dashboard.  
   - Axios is used for API communication and JWT‑based authenticated requests.  

2. **Backend (API Layer)**  
   - **Node.js + Express** REST API exposing auth, profile, materials, and requests endpoints.  
   - Role‑based middleware ensures contractors and suppliers only access allowed actions.  
   - Data validation and error handling ensure robust request and material flows.  

3. **Database (Persistence Layer)**  
   - **MongoDB with Mongoose** defining schemas for User, ContractorProfile, SupplierProfile, Material, and Request.  
   - Supplier locations stored as GeoJSON points to support distance‑based searching in the future.  

4. **Auth & Security**  
   - JWT tokens issued on login/registration and stored client‑side.  
   - Protected API routes verify tokens and enforce roles (`contractor`, `supplier`).  
   - Passwords hashed before persistence.

***

## 🏗️ Functional Modules

### 1. 👤 Authentication & Roles

- User registration with role selection: **Contractor / Builder** or **Material Supplier**.  
- Secure login issuing JWT tokens.  
- Role‑based route protection on both frontend (navigation) and backend (API access).  

### 2. 🏬 Supplier Dashboard

- **Profile Management**  
  - Fields: shop name, address, phone number.  
  - Location can be stored using coordinates at profile setup time.  

- **Inventory Management**  
  - Add materials with name, category, price, unit, stock quantity, availability status.  
  - View “Your Materials” with price per unit, stock, and availability.  
  - Delete or update existing materials.  

- **Incoming Requests**  
  - View all contractor requests addressed to the supplier, with quantity, contractor name, and current status.  
  - Respond with **Accept** or **Reject**, including: quotation price, delivery time, and terms.  
  - See contractor’s subsequent decision (confirmed / withdrawn) and overall status (pending, accepted, rejected, completed).

### 3. 🚧 Contractor Dashboard

- **Material Discovery**  
  - Search across materials; in the more advanced setup, results can be constrained by radius and mapped by distance.  
  - View suppliers and their offerings with price and availability.  

- **Request Creation & Tracking**  
  - Select a material and send a request to the corresponding supplier, specifying quantity and additional details.  
  - View **My Requests** with supplier info, quoted price, delivery time, and status.  
  - When a supplier accepts, confirm or withdraw the request; completed flows are reflected for both parties.

### 4. 🗺️ Home Page Experience

- Split layout with a **full‑height construction image** on the left and **application overview + role cards** on the right.  
- Enlarged typography and buttons for clear CTAs: “I am a Contractor” and “I am a Supplier.”  
- Country selector for future geo‑specific customization.

***

## 🧠 Data Models (Conceptual)

- **User**  
  - `name`, `email`, `passwordHash`, `role` (`contractor` | `supplier`).  

- **ContractorProfile**  
  - `user` (ref User), `locationsServed`, `preferredMaterials`.  

- **SupplierProfile**  
  - `user` (ref User), `shopName`, `address`, `phoneNumber`, `location` (GeoJSON).  

- **Material**  
  - `supplier` (ref SupplierProfile), `name`, `category`, `price`, `unit`, `stockQuantity`, `availabilityStatus`, `currency`.  

- **Request**  
  - `contractor` (ref User), `supplier` (ref User), `materialDetails`, `quantity`.  
  - `status`: `pending`, `accepted`, `rejected`, `completed`.  
  - `quotation`: `price`, `deliveryTime`, `terms`.  
  - `contractorDecision`: `none`, `confirmed`, `withdrawn`.  

***

## 🛠️ Tech Stack

- **Frontend**  
  - ⚛️ React (with Vite bundler)  
  - React Router for navigation  
  - Axios for HTTP requests  
  - Custom CSS (`global.css`, `home.css`, `dashboard.css`, `auth.css`)  

- **Backend**  
  - 🟢 Node.js  
  - Express.js REST API  
  - Mongoose (ODM) with MongoDB  

- **Authentication & Security**  
  - JSON Web Tokens (JWT)  
  - Role‑based access middleware  

- **Tooling & DevOps**  
  - Git & GitHub for version control  
  - Nodemon for backend development  
  - Vite dev server for frontend  

***

## 🔑 Usage Flow

1. **Register** as either **Contractor** or **Supplier**.  
2. **Supplier**: complete profile and add materials under **Inventory**.  
3. **Contractor**: browse materials, pick a supplier, and send a **Request**.  
4. **Supplier**: see **Incoming Requests**, respond with **Accept/Reject** and optional quotation.  
5. **Contractor**: review quotation, then **Confirm** or **Withdraw**.  
6. Both dashboards reflect the updated **status** throughout the lifecycle.

***

## 🎯 Future Enhancements

- Advanced geo‑search using MongoDB geospatial queries and distance sorting.  
- In‑app messaging or chat between contractor and supplier.  
- Analytics dashboards for order volume, spend, and supplier performance.  
- Multi‑currency and tax support for wider regional deployment.  
- Role‑based admin interface for platform‑level management and moderation.

***

## ✅ Project Status

- Core authentication and role‑based dashboards functional.  
- Supplier profile, inventory management, and contractor request flows implemented end‑to‑end.  
- UI refined for home page and both dashboards; further UX polishing and deployment configuration can be added next.
