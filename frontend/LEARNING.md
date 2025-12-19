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