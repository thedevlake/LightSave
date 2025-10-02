import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  const [name, setName] = useState("");
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("me response:", data);
      setName(data.firstname); // ✅ clean and safe
    }

    fetchProfile();
  }, []);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 text-[#374151]">
        <SidebarTrigger className="-ml-1 dark:text-muted-foreground" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 "
        />
        <div className="flex items-center gap-3">
          {" "}
          <CircleUser className="dark:text-muted-foreground" />
          <h1 className="text-base font-bold items-center flex gap-1 dark:text-muted-foreground">
            Welcome{" "}
            <span className="bg-gradient-to-r from-[#0D9488] to-[#134E4A] bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-[#bac2c2] dark:to-[#196963]">
              {name}
            </span>
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <ModeToggle />
          </Button>
        </div>
      </div>
    </header>
  );
}
