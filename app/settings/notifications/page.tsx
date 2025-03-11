import { NotificationSettings } from "@/components/notification-settings"
import { NotificationTester } from "@/components/notification-tester"
import { ScheduleNotification } from "@/components/schedule-notification"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notification Settings</h2>
        <p className="text-muted-foreground">Manage how and when you receive notifications from MYFC</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <NotificationSettings />
        <div className="space-y-6">
          <ScheduleNotification />
          <NotificationTester />
        </div>
      </div>
    </div>
  )
}

