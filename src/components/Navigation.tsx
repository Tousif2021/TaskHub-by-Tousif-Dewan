
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  FolderIcon, 
  PlusIcon,
  BellIcon, 
  UserIcon,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const items = [
    {
      icon: HomeIcon,
      label: "Home",
      href: "/"
    },
    {
      icon: FolderIcon,
      label: "Files",
      href: "/files"
    },
    {
      icon: PlusIcon,
      label: "Add Task",
      href: "/add"
    },
    {
      icon: ClipboardList,
      label: "Tasks",
      href: "/tasks"
    },
    {
      icon: BellIcon,
      label: "Reminders",
      href: "/reminders"
    },
    {
      icon: UserIcon,
      label: "Profile",
      href: "/profile"
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex justify-between items-center px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-1 flex-col items-center py-2 px-1 text-xs",
              isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon size={20} className="mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
