import { GroupResponse } from "@/interface/Group"

interface GroupNotificationProps {
    group: GroupResponse
}

export const GroupNotification = ({
    group
    }: GroupNotificationProps) => {
  return (
    <div>{group.id}</div>
  )
}
