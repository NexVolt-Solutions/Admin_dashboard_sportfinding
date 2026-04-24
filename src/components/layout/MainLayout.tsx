import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsSidebarOpen(false);
            }
          }}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          "lg:ml-64"
        )}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 pt-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
