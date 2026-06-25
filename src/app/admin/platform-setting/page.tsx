
"use client";

import { useEffect, useState } from "react";
import {
    Settings,
    Percent,
    Save,
    Loader2,
    IndianRupee,
    ToggleLeft,
    ToggleRight,
    Info,
} from "lucide-react";
import { toast } from "sonner";

import {
    getPlatformSettings,
    updatePlatformSettings,
} from "@/features/donations/api/donation.api";

export default function PlatformSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isTipEnabled, setIsTipEnabled] = useState(true);
    const [defaultTipPercent, setDefaultTipPercent] = useState<number>(10);
    const [tipOptions, setTipOptions] = useState<string>("10,15,20");

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const res = await getPlatformSettings();
            const settings = res?.data;
            setIsTipEnabled(settings?.isTipEnabled ?? true);
            setDefaultTipPercent(settings?.defaultTipPercent ?? 10);
            setTipOptions(
                Array.isArray(settings?.tipOptions)
                    ? settings.tipOptions.join(",")
                    : "10,15,20"
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to load platform settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const parsedOptions = tipOptions
                .split(",")
                .map((v) => Number(v.trim()))
                .filter((v) => !isNaN(v) && v > 0);

            await updatePlatformSettings({
                defaultTipPercent,
                tipOptions: parsedOptions,
                isTipEnabled,
            });

            toast.success("Platform settings updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update platform settings");
        } finally {
            setSaving(false);
        }
    };

    const previewTip = Math.round(500 * (defaultTipPercent / 100));
    const previewTotal = isTipEnabled ? 500 + previewTip : 500;

    const parsedTipOptions = tipOptions
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-red-600" />
                <p className="text-sm text-gray-500">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">

            {/* Page Header */}
            <div className="mb-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                    <Settings className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 mt-0.5 text-sm">
                        Configure donation tip options and platform support fees shown to donors at checkout.
                    </p>
                </div>
            </div>

            <div className="grid gap-5">

                {/* Enable / Disable Tip Toggle */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                <ToggleRight className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Platform Support Fee</h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Allow donors to optionally add a tip to support the platform.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsTipEnabled(!isTipEnabled)}
                            className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isTipEnabled ? "bg-green-500" : "bg-gray-300"
                                }`}
                            aria-label="Toggle tip"
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${isTipEnabled ? "translate-x-8" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {!isTipEnabled && (
                        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-700">
                                Tip is currently disabled. Donors will only pay the campaign amount at checkout.
                            </p>
                        </div>
                    )}
                </div>

                {/* Default Tip Percentage */}
                <div className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition-opacity ${!isTipEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                            <Percent className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Default Tip Percentage</h3>
                            <p className="text-sm text-gray-500">Pre-selected tip value shown at checkout.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={defaultTipPercent}
                                onChange={(e) => setDefaultTipPercent(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
                        </div>
                        <span className="text-sm text-gray-500">of donation amount</span>
                    </div>
                </div>

                {/* Available Tip Options */}
                <div className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition-opacity ${!isTipEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                            <IndianRupee className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Available Tip Options</h3>
                            <p className="text-sm text-gray-500">Comma-separated percentages shown to donors.</p>
                        </div>
                    </div>

                    <input
                        value={tipOptions}
                        onChange={(e) => setTipOptions(e.target.value)}
                        placeholder="e.g. 10,15,20"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    />

                    {parsedTipOptions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {parsedTipOptions.map((tip, index) => (
                                <span
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border transition-all ${String(Number(tip)) === String(defaultTipPercent)
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-red-50 text-red-600 border-red-200"
                                        }`}
                                >
                                    {tip}%
                                    {String(Number(tip)) === String(defaultTipPercent) && (
                                        <span className="ml-1.5 text-xs opacity-80">default</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Checkout Preview */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-semibold text-gray-900">Checkout Preview</h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">₹500 sample donation</span>
                    </div>

                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Campaign Donation</span>
                            <span className="font-medium text-gray-900">₹500.00</span>
                        </div>

                        {isTipEnabled ? (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-green-700">
                                    Platform Support
                                    <span className="ml-1 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                        {defaultTipPercent}%
                                    </span>
                                </span>
                                <span className="font-semibold text-green-700">+ ₹{previewTip}.00</span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Platform Support</span>
                                <span className="italic">Disabled</span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Payable</span>
                            <span className="text-lg font-bold text-gray-900">₹{previewTotal}.00</span>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={loadSettings}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 shadow-sm"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

