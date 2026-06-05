
import Sidebar from "../../components/SideBar.jsx";

export default function LawyerLayout({ children }) {
  return (
    <div className="flex bg-[#F5F7FB]">

      <Sidebar />

      <main className="flex-1 min-h-screen p-6">
        {children}
      </main>

    </div>
  );
}