import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Reports() {
  const [daily, setDaily] = useState<any>(null);
  const [monthly, setMonthly] = useState<any>(null);

  useEffect(() => {
    fetch("/api/reports?type=daily")
      .then((res) => res.json())
      .then((data) => setDaily(data));

    fetch("/api/reports?type=monthly")
      .then((res) => res.json())
      .then((data) => setMonthly(data));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4 text-[#1C352D]">Report</h2>
      <div className="p-4">
        {/* <h1 className="text-xl font-bold mb-4">Laporan Penjualan</h1> */}

        <div className="mb-6 text-[#1C352D]">
          <h2 className="text-lg font-semibold">Hari ini</h2>
          {daily && (
            <>
              <p>Total: Rp{daily.total}</p>
              <ul className="list-disc pl-5">
                {daily.transactions.map((t: any) => (
                  <li key={t.id}>
                    {t.product.name} x {t.quantity} = Rp{t.total}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="text-[#1C352D]">
          <h2 className="text-lg font-semibold">Bulan ini</h2>
          {monthly && (
            <>
              -<p>Total: Rp{monthly.total}</p>
              <ul className="list-disc pl-5">
                {monthly.transactions.map((t: any) => (
                  <li key={t.id}>
                    {t.product.name} x {t.quantity} = Rp{t.total}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
