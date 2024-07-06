import AdminPanelLayout from "@/components/dashboard-page-components/AdminPanelLayout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
