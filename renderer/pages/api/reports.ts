import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../main/db";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query; // "daily" atau "monthly"
  const now = new Date();

  if (type === "daily") {
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
      include: { product: true },
    });

    const total = transactions.reduce((sum, t) => sum + t.total, 0);
    return res.json({ total, transactions });
  }

  if (type === "monthly") {
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
      include: { product: true },
    });

    const total = transactions.reduce((sum, t) => sum + t.total, 0);
    return res.json({ total, transactions });
  }

  res.status(400).json({ error: "Invalid type" });
}
