import { 
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    MeetingRoom as RoomIcon,
    Inbox as InboxIcon,
    Event as EventIcon,
    Notifications as NotificationsIcon
  } from '@mui/icons-material';


export const getMenuItems = (userRole) => {
    if (userRole === "user") {
      return [
        { label: "Home", path: "user/user_home" },
        { label: "Roommate", path: "user/roommate" },
        { label: "Events", path: "user/events" },
        { label: "Notifications", path: "user/notifications" },
        { label: "Messages", path: "user/message" },
      ];
    }

    if (userRole === "admin") {
        return [
            { label: "Dashboard", path: "/admin/admin_dashboard", icon: DashboardIcon  },
            { label: "Users", path: "/admin/admin_users", icon: PersonIcon  },
            { label: "Rooms", path: "/admin/admin_rooms", icon: RoomIcon  },
            { label: "Inbox", path: "/admin/admin_inbox", icon: InboxIcon  },
            { label: "Events", path: "/admin/admin_events", icon: EventIcon  },
            { label: "Notifications", path: "/admin/admin_notifications", icon: NotificationsIcon },
        ];
      }
  
    if (!userRole) {
      return [
        { label: "Home", path: "/" },
        { label: "About Us", path: "/aboutus" },
        { label: "Contact", path: "/contact" },
      ];
    }
  
    return []; // Default empty menu for other roles
  };
  
  export const getRightSideMenuItems = [{ label: "Login", path: "/login" }, { label: "SignUp", path: "/signup" }]
  

