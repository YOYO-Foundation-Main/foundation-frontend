"use client";

import { useEffect, useState } from "react";
import {
  adminGetEvents,
  adminDeleteEvent,
} from "@/features/admin/api/admin.api";
import CreateEventModal from "@/app/admin/CreateEventModal";
import EditEventModal from "@/app/admin/EditEventModal";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      const res = await adminGetEvents();
      setEvents(res.data || res);
    } catch (err) {
      console.error("❌ Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;

    try {
      await adminDeleteEvent(id);
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setOpenEditModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Events</h1>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          + Create Event
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-x-auto">
          <table className="w-full text-black text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>{/* No whitespace between tr and th elements */}
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Cause</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t">{/* No whitespace between tr and td elements */}
                  <td className="p-3">
                    <img
                      src={e.image}
                      alt={e.title}
                      className="w-14 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{e.title}</td>
                  <td className="p-3">{e.location}</td>
                  <td className="p-3 text-gray-600">
                    {e.cause?.name || "-"}
                  </td>
                  <td className="p-3">
                    {new Date(e.eventDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(e)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit Event"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                        title="Delete Event"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!events.length && (
                <tr>{/* No whitespace between tr and td elements */}
                  <td colSpan={6} className="text-center p-4 text-gray-400">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {openCreateModal && (
        <CreateEventModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={fetchEvents}
        />
      )}

      {/* Edit Modal */}
      {openEditModal && selectedEvent && (
        <EditEventModal
          isOpen={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={fetchEvents}
          event={selectedEvent}
        />
      )}
    </div>
  );
}