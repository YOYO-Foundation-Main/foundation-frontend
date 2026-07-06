"use client";

import { useEffect, useState } from "react";
import { Admin } from "@/features/super-admin/types/admin.types";
import {
    getAdmins,
    toggleAdminStatus,
    deleteAdmin,
} from "@/features/super-admin/api/adminManagement.api";
import AdminFormModal from "@/features/super-admin/components/AdminFormModal";

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");

    const fetchAdmins = async () => {
        try {
            setLoading(true);

            const res = await getAdmins();

            setAdmins(res.data);
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleStatus = async (id: number, status: boolean) => {
        try {
            await toggleAdminStatus(id, !status);
            fetchAdmins();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        const ok = window.confirm("Delete this admin?");
        if (!ok) return;

        try {
            await deleteAdmin(id);
            fetchAdmins();
        } catch (err: any) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Admin Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage platform administrators
                    </p>

                </div>
                <button
                    onClick={() => {
                        setSelectedAdmin(null);
                        setMode("create");
                        setOpenModal(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                    + Create Admin
                </button>

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr className="text-left">

                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Mobile</th>
                            <th className="px-5 py-3">Role</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Created</th>
                            <th className="px-5 py-3 text-center">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    className="text-center py-12"
                                >
                                    Loading admins...
                                </td>

                            </tr>

                        ) : admins.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    className="text-center py-12"
                                >
                                    No admins found.
                                </td>

                            </tr>

                        ) : (

                            admins.map((admin) => (

                                <tr
                                    key={admin.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-5 py-4 font-medium">
                                        {admin.name}
                                    </td>

                                    <td className="px-5 py-4">
                                        {admin.email}
                                    </td>

                                    <td className="px-5 py-4">
                                        {admin.mobile}
                                    </td>

                                    <td className="px-5 py-4">
                                        {admin.role}
                                    </td>

                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => handleStatus(admin.id, admin.isActive)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${admin.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {admin.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>

                                    <td className="px-5 py-4">
                                        {new Date(
                                            admin.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-2">

                                            <button className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600">
                                                View
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedAdmin(admin);
                                                    setMode("edit");
                                                    setOpenModal(true);
                                                }}
                                                className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(admin.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>

                                            <AdminFormModal
                                                open={openModal}
                                                onClose={() => setOpenModal(false)}
                                                onSuccess={fetchAdmins}
                                                mode={mode}
                                                admin={selectedAdmin}
                                            />

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

