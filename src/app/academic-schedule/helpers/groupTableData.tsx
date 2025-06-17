import { GroupResponse } from "@/interface/Group";
import { GroupNotification } from '../components/GroupNotification';

export const tableData = (groups: GroupResponse[]) => {
    return groups.map((group) => {
        const professorNames = group.group_x_professor.map((gxp) => gxp.professor.name).join(" | ");
        const professorsIds = group.group_x_professor.map((gxp) => gxp.professor.id);
        const groupedClassroom = group.classroom_x_group.reduce((acc, { mainClassroom, mainSchedule }) => {
            if (!acc[mainClassroom.location]) {
                acc[mainClassroom.location] = [];
            }
            acc[mainClassroom.location].push(mainSchedule);
            return acc;
        }, {} as Record<string, string[]>);

        // create arrays for classrooms and schedules
        const classrooms: string[] = [];
        const schedules: string[] = [];

        // separate schedules by classroom with space key
        for (const [classroom, scheduleList] of Object.entries(groupedClassroom)) {
            classrooms.push(classroom);
            schedules.push(scheduleList.join(" "));
        }

        // join classrooms and schedules into strings separated by " | "
        const classroomString = classrooms.join(" | ");
        const scheduleString = schedules.join(" | ");
        return {
            professorsN: professorNames,
            professors: professorsIds,
            mirrorGroup: group.mirror_group.name,
            subjectName: group.subject.name,
            subjectCode: group.subject.code,
            subjectLevel: group.subject.level,
            subjectModality: group.subject.pensum.academic_program.modalityAcademic,
            classrooms: classroomString,
            schedules: scheduleString,
            baseGroup: group.code === 0 ? "Grupo base" : group.code,
            notifications: <GroupNotification group={group} />,
            ...group,
        };
    })
}