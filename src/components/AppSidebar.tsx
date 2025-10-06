import { LayoutDashboard, Users, FileText, Upload, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Data Pegawai", url: "/data-pegawai", icon: Users },
  { title: "Upload Berkas", url: "/upload-berkas", icon: Upload },
  { title: "Laporan", url: "/laporan", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal logout");
    } else {
      toast.success("Berhasil logout");
      navigate("/auth");
    }
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src="/logo-puskesmas.jpg"   
                alt="Logo SI PRIMA"
                className="w-full h-full object-cover"
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-sidebar-foreground">SI PRIMA</h2>
                <p className="text-xs text-sidebar-foreground/80">Sistem Arsip Data Kepegawaian</p>
              </div>
            )}
          </div>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="mt-auto p-2 border-t border-sidebar-border">
          <SidebarMenuButton onClick={handleLogout} className="w-full hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </SidebarMenuButton>
        </div>
      </div>
    </Sidebar>
  );
}
