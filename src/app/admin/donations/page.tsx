"use client";

import { useEffect, useState } from "react";
import DonationsStats from "@/components/admin/donations/DonationsStats";
import DonationsFilters from "@/components/admin/donations/DonationsFilters";
import DonationsTable from "@/components/admin/donations/DonationsTable";
import Pagination from "@/components/admin/donations/Pagination";
import { getDonations, getDonationStats } from "@/features/admin/api/admin.api";

export default function DonationsPage() {
    const [donations, setDonations] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [pagination, setPagination] = useState<any>({
        page: 1,
        pages: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "",
        fromDate: "",
        toDate: "",
    });

    // 🔥 Fetch Donations
    const fetchDonations = async () => {
        setLoading(true);
        try {
            const res = await getDonations(filters);

            if (!res?.data) {
                throw new Error("Invalid donations response");
            }

            setDonations(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error("Donations Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Fetch Stats
    const fetchStats = async () => {
        try {
            const res = await getDonationStats();

            console.log("STATS:", res);

            setStats(res.data || res); // 🔥 handles both cases
        } catch (err) {
            console.error("Stats Error:", err);
        }
    };

    // 🔁 Effects
    useEffect(() => {
        fetchDonations();
    }, [filters]);

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="p-6 space-y-6">

            <DonationsStats stats={stats} />

            <DonationsFilters filters={filters} setFilters={setFilters} />

            <DonationsTable data={donations} loading={loading} />

            <Pagination pagination={pagination} setFilters={setFilters} />

        </div>
    );
}