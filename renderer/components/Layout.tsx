import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { name: "Cashier", path: "/cashier" },
    { name: "Inventory", path: "/inventory" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-52 bg-gray-900 text-white p-4 flex flex-col gap-2">
        <h1 className="text-lg font-bold mb-4">Kasir App</h1>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-2 rounded ${
              currentPath === item.path
                ? "bg-gray-700 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">{children}</main>
    </div>
  );
}
