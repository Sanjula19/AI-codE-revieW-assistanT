# 🧠 My Dev Learning Journal

##  Feature: Project Setup & Layout
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

