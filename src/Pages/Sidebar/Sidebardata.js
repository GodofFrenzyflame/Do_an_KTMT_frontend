import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import RelayIcon from '@mui/icons-material/Power';
import AvTimerIcon from '@mui/icons-material/AvTimer';

export const SidebarData = [
    {
      title: "Home",
      link: "/home",
      icon: <HomeIcon />
    },
    {
      title: "History",
      link: "/history",
      icon: <HistoryIcon />
    },
    {
      title: "Relay",
      link: "/relay",
      icon: <RelayIcon />
    },
    {
      title: "Schedules",
      link: "/schedules",
      icon: <AvTimerIcon />
    },
    {
      title: "Profile",
      link: "/profile",
      icon: <PersonIcon />
    },
    {
      title: "Setting",
      link: "/setting",
      icon: <SettingsIcon />
    }
  ];
  