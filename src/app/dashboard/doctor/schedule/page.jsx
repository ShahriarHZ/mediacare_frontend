"use client";
import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import { apiFetch } from "@/lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const SchedulePage = () => {
  const { session } = useRole();
  const [schedule, setSchedule] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    apiFetch(`/schedule/${session.user.email}`)
      .then((res) => res.json())
      .then(setSchedule);
  }, [session]);

  const toggleSlot = (day, slot) => {
    setSchedule((prev) => {
      const existing = prev.find((d) => d.day === day);
      if (existing) {
        const slots = existing.slots.includes(slot)
          ? existing.slots.filter((s) => s !== slot)
          : [...existing.slots, slot];
        return prev.map((d) => d.day === day ? { ...d, slots } : d);
      }
      return [...prev, { day, slots: [slot] }];
    });
  };

  const isActive = (day, slot) => {
    return schedule.find((d) => d.day === day)?.slots?.includes(slot) || false;
  };

  const handleSave = async () => {
    await apiFetch(`/schedule/${session.user.email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedule }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Day</th>
              {SLOTS.map((s) => <th key={s}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="font-semibold">{day}</td>
                {SLOTS.map((slot) => (
                  <td key={slot}>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={isActive(day, slot)}
                      onChange={() => toggleSlot(day, slot)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSave} className="btn btn-primary mt-6">Save Schedule</button>
      {saved && <p className="text-success text-sm mt-2">Schedule saved!</p>}
    </div>
  );
};

export default SchedulePage;