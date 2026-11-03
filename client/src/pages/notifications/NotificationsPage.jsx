import React, { useState } from "react";
import { toast } from "react-hot-toast";

const SAMPLE_NOTIFICATIONS = [
  { id: "notif-1", title: "Emergency Broadcast: Weather-Related Rural Grid Outage", sender: "Admin Office", type: "Urgent", time: "2 hours ago", read: false, body: "Due to transmission line maintenance in Bassi & Dausa tehsils, offline attendance mode is active for all scheduled classes today." },
  { id: "notif-2", title: "New Assignment Posted: Computer Networks CIDR Routing", sender: "Prof. R. K. Sharma", type: "Assignment", time: "Yesterday", read: false, body: "Please complete and submit the simulation before 31st October, 11:59 PM. Draft autosave is available." },
  { id: "notif-3", title: "Mid-Term Examination Schedule Announced", sender: "Examination Cell", type: "Exam", time: "2 days ago", read: true, body: "RTU mid-semester written assessments commence from 15th November. Download the date-sheet from the library portal." },
  { id: "notif-4", title: "Study Notes Uploaded: DBMS Concurrency Control", sender: "Prof. Ananya Gupta", type: "Resource", time: "3 days ago", read: true, body: "Complete handwritten notes with 20 solved numerical problems have been published to your resources dashboard." },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [filterType, setFilterType] = useState("All");

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All announcements marked as read");
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter((n) => filterType === "All" || n.type === filterType);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications & Campus Announcements</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time alerts, class schedules, and administrative emergency notices</p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">
                  {unreadCount} Unread
                </span>
              )}
              <button
                onClick={markAllRead}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
              >
                Mark All Read
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 overflow-x-auto">
            {["All", "Urgent", "Assignment", "Exam", "Resource"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  filterType === type ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={`p-5 rounded-xl border transition cursor-pointer ${
                item.read ? "bg-white border-gray-200" : "bg-teal-50/40 border-teal-200 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.type === "Urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500">{item.sender} â€¢ {item.time}</span>
                  </div>
                  <h3 className={`text-base font-bold ${item.read ? "text-gray-800" : "text-gray-900"}`}>{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{item.body}</p>
                </div>
                {!item.read && <span className="w-2.5 h-2.5 rounded-full bg-teal-600 flex-shrink-0 mt-2"></span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
