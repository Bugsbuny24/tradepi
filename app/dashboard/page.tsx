import { redirect } from "next/navigation";

// Minimal, safe default: send users straight to the Designer.
// This avoids build failures if unfinished dashboard UI code is present.
export default function DashboardPage() {
  redirect("/dashboard/designer");
}
