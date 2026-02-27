import { useEffect, useState } from "react";
import api from "../api/api";
import moment from "moment";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    title: "",
    plantName: "",
    type: "watering",
    date: "",
    repeat: "none",
  });

  const loadReminders = async () => {
    try {
      const res = await api.get("/reminders");
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const createReminder = async () => {
    try {
      await api.post("/reminders", form);
      setForm({
        title: "",
        plantName: "",
        type: "watering",
        date: "",
        repeat: "none",
      });
      loadReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    await api.put(`/reminders/${id}/complete`);
    loadReminders();
  };

  const deleteReminder = async (id) => {
    await api.delete(`/reminders/${id}`);
    loadReminders();
  };

  const today = moment().startOf("day");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌿 Plant Care Reminders
      </h1>

      {/* Create Reminder */}
      <div className="bg-white p-5 shadow rounded-xl mb-6 border">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          placeholder="Plant Name"
          value={form.plantName}
          onChange={(e) => setForm({ ...form, plantName: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        >
          <option value="watering">Watering</option>
          <option value="fertilizing">Fertilizing</option>
          <option value="pruning">Pruning</option>
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border p-2 rounded mb-2"
        />

        <select
          value={form.repeat}
          onChange={(e) => setForm({ ...form, repeat: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="none">No Repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button
          onClick={createReminder}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Reminder
        </button>
      </div>

      {/* Reminder List */}
      {reminders.map((r) => {
        const isOverdue =
          !r.completed && moment(r.date).isBefore(today);

        return (
          <div
            key={r._id}
            className={`p-4 rounded-xl shadow mb-4 border ${
              r.completed
                ? "bg-green-50"
                : isOverdue
                ? "bg-red-50"
                : "bg-white"
            }`}
          >
            <h3 className="font-bold">{r.title}</h3>
            <p>🌱 {r.plantName}</p>
            <p>📅 {moment(r.date).format("LL")}</p>
            <p>🔁 {r.repeat}</p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => toggleComplete(r._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {r.completed ? "Undo" : "Complete"}
              </button>

              <button
                onClick={() => deleteReminder(r._id)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Reminders;