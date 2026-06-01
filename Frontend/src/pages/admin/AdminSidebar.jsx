import {
  LayoutDashboard,
  Users,
  Briefcase,
  Scale,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/home",
  },

  {
    title: "Clients",
    icon: Users,
    path: "/admin/clients",
  },

  {
    title: "Lawyers",
    icon: Briefcase,
    path: "/admin/lawyers/pending",
  },

  {
    title: "Cases",
    icon: Scale,
    path: "/admin/cases",
  },
];

const AdminSidebar = ({
  navigate,
  handleLogout,
}) => {
  return (
    <div className="w-64 min-h-screen bg-black text-white p-5 flex flex-col justify-between">

      <div>
        <h2 className="text-2xl font-bold mb-10">
          Admin Panel
        </h2>

        <ul className="space-y-3">

          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <li
                key={index}
                onClick={() =>
                  navigate(item.path)
                }
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition"
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 bg-red-500 py-3 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;