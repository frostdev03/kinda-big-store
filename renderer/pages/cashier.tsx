import { useEffect, useState } from "react";
import Layout from "../components/Layout";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Cashier() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [qty, setQty] = useState<number>(1);

  // Ambil daftar produk
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Cek stok cukup
    if (qty > product.stock) {
      alert("Stok tidak cukup!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      return [...prev, { product, quantity: qty }];
    });

    setQty(1);
  };

  const saveTransactions = async () => {
    for (const item of cart) {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product.id,
          quantity: item.quantity,
        }),
      });
    }
    alert("Transaksi berhasil disimpan!");
    setCart([]);

    // refresh product list
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4 text-[#1C352D]">Cashier</h2>
      <div className="p-4">
        {/* <h1 className="text-xl font-bold mb-4">Cashier</h1> */}

        <div className="flex gap-2 mb-4 text-[#1C352D]">
          <select
            className="border px-2 py-1"
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
          >
            <option value="">Pilih Produk</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - Rp{p.price} (Stok {p.stock})
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={qty}
            className="border px-2 py-1 w-20"
            onChange={(e) => setQty(Number(e.target.value))}
          />

          <button
            onClick={addToCart}
            className="bg-[#F5C9B0] text-[#1C352D] font-semibold px-3 py-1 rounded"
          >
            Tambah
          </button>
        </div>

        <table className="w-full border-[#1C352D] mb-4 text-[#1C352D]">
          <thead>
            <tr className="bg-[#F5C9B0] text-[#1C352D]">
              <th className="border px-4">Produk</th>
              <th className="border px-4">Qty</th>
              <th className="border px-4">Harga</th>
              <th className="border px-4">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2">{item.product.name}</td>
                <td className="border px-2">{item.quantity}</td>
                <td className="border px-2">Rp{item.product.price}</td>
                <td className="border px-2">
                  Rp{item.product.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#1C352D]">
            Total: Rp{total}
          </h2>
          <button
            onClick={saveTransactions}
            disabled={cart.length === 0}
            className="bg-[#F5C9B0] text-[#1C352D] font-bold px-4 py-2 rounded disabled:bg-gray-400"
          >
            Simpan Transaksi
          </button>
        </div>
      </div>
    </Layout>
  );
}
