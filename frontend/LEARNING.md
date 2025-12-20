# 🧠 My Dev Learning Journal

## 01 Feature: Project Setup & Layout
**What I Built:**
- Initialized React + Vite + Tailwind.
- Created reusable UI components (Button, Input).
- Built the Dashboard Layout with a fixed Sidebar.

**New Things I Learned:**
- **Feature-Sliced Design:** Grouping files by "features" (auth, code) is cleaner than grouping by file type.
- **`forwardRef`:** Needed in custom Input components so libraries (like React Hook Form) can control the HTML input.
- **Outlet/Layout Pattern:** How to wrap specific pages with a Sidebar while keeping others (like Login) plain.

**Mistakes & Fixes:**
- **Router Error:** I accidentally nested `<BrowserRouter>` inside another `<BrowserRouter>`. 
  - *Fix:* Removed the router from `main.tsx` and kept it only in `App.tsx`.

## [02] - Feature: Authentication UI (Login)
**What I Built:**
- Created `AuthLayout` to center content and display the logo (separate from DashboardSidebar).
- Built `LoginPage` using the reusable `Input` and `Button` components.
- Integrated `react-router-dom` Links to switch between Login/Signup without page reloads.

**New Things I Learned:**
- **Layout Pattern:** Apps often need multiple layouts (e.g., `DashboardLayout` for the app, `AuthLayout` for login).
- **Component Composition:** Passing `children` to `AuthLayout` allows me to reuse the same wrapper for Login, Register, and Forgot Password.

---
## [3] - Feature: Auth Integration
**What I Built:**
- Connected `LoginPage` to `AuthProvider` using `useState` and `onSubmit`.
- Configured Axios interceptors to attach tokens automatically.
- Defined TypeScript interfaces for API responses.

**New Things I Learned:**
- **Wiring Forms:** A UI component needs state (`useState`) and a handler (`handleSubmit`) to actually send data.
- **The "Network Tab" Test:** The best way to debug API calls is watching the browser's Network tab, not just looking at the UI.

## [4] - Feature: Auth Completion
**What I Built:**
- Fixed CORS issues by configuring the backend to accept requests from port 5173.
- Successfully registered a user and logged in to the Dashboard.
- Debugged 404 errors by checking the Network tab payload (Username vs Email).

## [5] - Feature: Code Analysis Setup
**What I Built:**
- Integrated Monaco Editor for code input.
- Created `feature/code-analysis` branch.
- Defined TypeScript interfaces for `AnalysisResult`.
- Connected the "Analyze" button to the `/api/code/upload` endpoint.

**New Things I Learned:**
- **Monaco Editor:** It requires a wrapper component to handle sizing and value changes properly in React.
- **Typed API Calls:** Defining the `CodeUploadRequest` interface prevents me from sending the wrong data to the backend.

---
## [6] - Feature: Code Analysis Pipeline
**What I Built:**
- Created a `CodeController` in Node.js to handle upload requests.
- Defined a `POST /api/code/upload` route using Express Router.
- Connected the Frontend `UploadPage` to the Backend using Axios.
- Implemented a "Mock Response" to verify the connection before adding AI.

**New Things I Learned:**
- **Mocking APIs:** It is useful to make the backend return "fake data" first. This proves the connection works before spending time building complex logic (like AI).
- **Refactoring Routes:** Switching from `app.use(func)` to `express.Router()` makes the backend code much cleaner and easier to manage.

## [7] - Feature: AI Integration
**What I Built:**
- Installed `axios` in the backend to communicate with the Python service.
- Updated `code.controller.js` to forward requests to the Python AI Engine (Port 8080).
- Successfully tested the full pipeline: Frontend -> Node API -> Python AI -> Node API -> Frontend.

**New Things I Learned:**
- **Microservices Communication:** How to make one backend service (Node) talk to another (Python) using HTTP requests.
- **Inter-Process Debugging:** Learned that connection errors (like ECONNREFUSED) often mean a service (like Redis or Python) isn't running or reachable.

## [8] - Feature: Results UI & State Management
**What I Built:**
- Created `AnalysisResultsPage` to visualize complex JSON data from the AI.
- Implemented **Conditional Rendering** to show Red (Danger) or Green (Safe) UI based on the quality score.
- Used `useLocation()` and `Maps()` to pass analysis data directly from the Upload page to the Results page without storing it in the URL.

**New Things I Learned:**
- **React Router State:** How to pass hidden data between pages using `Maps('/path', { state: data })`.
- **Strict Types:** TypeScript requires `import type` when importing interfaces in strict mode.