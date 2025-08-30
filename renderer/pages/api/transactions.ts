import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../main/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Ambil semua transaksi + produk terkait
    const transactions = await prisma.transaction.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(transactions);
  }

  if (req.method === "POST") {
    try {
      const { productId, quantity } = req.body;

      // Cari produk
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        return res.status(404).json({ error: "Produk tidak ditemukan" });
      }

      // Cek stok cukup atau tidak
      if (product.stock < quantity) {
        return res.status(400).json({ error: "Stok tidak mencukupi" });
      }

      // Hitung total harga
      const total = product.price * quantity;

      // Buat transaksi + update stok (pakai transaction agar atomic)
      const newTransaction = await prisma.$transaction(async (tx) => {
        const t = await tx.transaction.create({
          data: {
            productId,
            quantity,
            total,
          },
        });

        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        });

        return t;
      });

      return res.json(newTransaction);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Terjadi kesalahan" });
    }
  }

  res.status(405).end(); // Method Not Allowed
}
