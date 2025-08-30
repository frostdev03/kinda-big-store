import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addProduct = async () => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    location.reload();
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Inventory</h2>
      <div className="p-4">
        {/* <h1 className="text-xl font-bold mb-4">Inventory</h1> */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Nama"
            className="border px-2 py-1"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Harga"
            className="border px-2 py-1"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Stok"
            className="border px-2 py-1"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <button
            onClick={addProduct}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Tambah
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2">ID</th>
              <th className="border px-2">Nama</th>
              <th className="border px-2">Harga</th>
              <th className="border px-2">Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="border px-2">{p.id}</td>
                <td className="border px-2">{p.name}</td>
                <td className="border px-2">{p.price}</td>
                <td className="border px-2">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
