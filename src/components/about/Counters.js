"use client";
import { useEffect, useState } from "react";

export default function Counters({
  transportsTarget = 12000,
  yearsTarget = 0,
  employeesTarget = 150,
  texts = {
    transports_prefix: "",
    transports_label: "",
    years_prefix: "",
    years_label: "",
    employees_prefix: "",
    employees_label: "",
  },
}) {
  const [years, setYears] = useState(0);
  const [transports, setTransports] = useState(0);
  const [employees, setEmployees] = useState(0);

  useEffect(() => {
    let t1 = 0, t2 = 0, t3 = 0;
    const interval = setInterval(() => {
      t1 += 300;
      t2 += 1;
      t3 += 2;
      setTransports(Math.min(t1, transportsTarget));
      setYears(Math.min(t2, yearsTarget));
      setEmployees(Math.min(t3, employeesTarget));
    }, 40);
    return () => clearInterval(interval);
  }, [transportsTarget, yearsTarget, employeesTarget]);

  const cards = [
    {
      prefix: texts.transports_prefix,
      value: transports.toLocaleString(),
      label: texts.transports_label,
    },
    {
      prefix: texts.years_prefix,
      value: years,
      label: texts.years_label,
    },
    {
      prefix: texts.employees_prefix,
      value: employees,
      label: texts.employees_label,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
      {cards.map((c, i) => (
        <div key={i} className="bg-white/90 rounded-2xl shadow-md p-6 backdrop-blur-sm flex flex-col items-center justify-center min-h-[150px]">
          <span className="text-xs uppercase tracking-wide text-gray-500 mb-1">{c.prefix}</span>
          <h2 className="text-5xl font-bold text-brand-navy my-1 leading-none">{c.value}</h2>
          <p className="text-xs text-gray-600 mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
