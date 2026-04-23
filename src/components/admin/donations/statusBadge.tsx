type StatusType = "SUCCESS" | "PENDING" | "FAILED";

export default function StatusBadge({ status }: { status: StatusType }) {
  const styles: Record<StatusType, string> = {
    SUCCESS: "bg-green-100 text-green-600",
    PENDING: "bg-yellow-100 text-yellow-600",
    FAILED: "bg-red-100 text-red-600",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}