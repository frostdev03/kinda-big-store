import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../main/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const products = await prisma.product.findMany();
    return res.json(products);
  }

  if (req.method === "POST") {
    const { name, price, stock } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
      },
    });
    return res.json(newProduct);
  }

  res.status(405).end(); // Method Not Allowed
}
