import { useGroupNotifications } from "@/hooks/useGroupNotification"
import { GroupResponse } from "@/interface/Group"
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/react";

interface GroupNotificationProps {
  group: GroupResponse
}

export const GroupNotification = ({
  group
}: GroupNotificationProps) => {

  const { data } = useGroupNotifications(group.id)

  const handleColor = (messageName: string) => {
    switch (messageName) {
      case "SCHEDULE MODIFIED":
        return "text-amber-600";
      case "CLASSROOM MODIFIED":
        return "text-blue-600";
      case "CLASSROOM SET":
        return "text-green-600";
      case "COLLISION":
        return "text-red-600";
      case "CAPACITY EXCEEDED":
        return "text-orange-600";
      case "MIRROR GROUP SCHEDULE MODIFIED":
        return "text-purple-600";
      case "MIRROR GROUP CLASSROOM MODIFIED":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  }

  return (
    <div>
      {data && data.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((notification) => (
            <Tooltip
              key={notification.id}
              content={
                <div className="text-sm text-gray-700">
                  <strong>{notification.messageType.name}</strong>
                  <div>{notification.detail}</div>
                </div>
              }
              className="w-64"
            >
              <div className="flex items-center gap-2">
                <BellAlertIcon className={`h-5 w-5 ${handleColor(notification.messageType.name)}`} />
              </div>
            </Tooltip>
          ))}
        </div>
      )}

    </div>
  )
}
