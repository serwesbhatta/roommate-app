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
        { label: "Home", path: "/user" },
        { label: "Roommate", path: "/user/roommate" },
        { label: "Events", path: "/user/events" },
        { label: "Notifications", path: "/user/notifications" },
        { label: "Messages", path: "/user/message" },
      ];
    }

    if (userRole === "admin") {
        return [
            { label: "Dashboard", path: "/admin", icon: DashboardIcon  },
            { label: "Users", path: "/admin/users", icon: PersonIcon  },
            { label: "Rooms", path: "/admin/rooms", icon: RoomIcon  },
            { label: "Inbox", path: "/admin/inbox", icon: InboxIcon  },
            { label: "Events", path: "/admin/events", icon: EventIcon  },
            { label: "Notifications", path: "/admin/notifications", icon: NotificationsIcon },
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
  
  export const getRightSideMenuItems = () => {
    return [{ label: "Login", path: "/login" }, { label: "SignUp", path: "/signup" }]
  }

