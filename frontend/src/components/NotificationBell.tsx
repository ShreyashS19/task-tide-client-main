import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const BACKEND_URL = "http://localhost:8080";

interface Notification {
  notificationId: number;
  receiverId: number;
  receiverType: string;
  message: string;
  type: string;
  status: string;
  relatedBookingId?: number;
  createdAt: string;
}

interface NotificationBellProps {
  userId: number;
  userType: "USER" | "PROVIDER";
  onAcceptBooking?: (bookingId: number) => void;
  onRejectBooking?: (bookingId: number) => void;
}

const NotificationBell = ({ userId, userType, onAcceptBooking, onRejectBooking }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => n.status === "UNREAD").length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/${userId}/read-all`, {
        method: "PATCH",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleAccept = async (bookingId: number, notificationId: number) => {
    if (onAcceptBooking) {
      await onAcceptBooking(bookingId);
      await markAsRead(notificationId);
      fetchNotifications();
    }
  };

  const handleReject = async (bookingId: number, notificationId: number) => {
    if (onRejectBooking) {
      await onRejectBooking(bookingId);
      await markAsRead(notificationId);
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userId]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.notificationId}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  notification.status === "UNREAD" ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(notification.notificationId)}
              >
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                
                {userType === "PROVIDER" && 
                 notification.type === "BOOKING_REQUEST" && 
                 notification.relatedBookingId && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(notification.relatedBookingId!, notification.notificationId);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(notification.relatedBookingId!, notification.notificationId);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
