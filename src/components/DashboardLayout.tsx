import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-[68px] p-6 md:p-8 max-w-[1100px] mx-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
