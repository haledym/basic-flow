import { Task, User } from "../interfaces";
import dayjs from "dayjs";
import i18next from "i18next";

export interface Project {
  _id: string;
  name: string;
}
const getDateValue = (value: string) => {
  const time_value = dayjs(value).format("YYYY/MM/DD");
  const year = time_value.slice(0, 4);
  const mon = time_value.slice(5, 7);
  const day = time_value.slice(8, 10);
  const tim = time_value.slice(10);
  const res = i18next.t("pages.tasks.history.time_translate", { year, mon, day, tim });
  return res;
};

export const calculateReport = (
  start_date_val: any,
  end_date_val: any,
  tasks: Task[],
  users: User[],
  projects: Project[]
) => {
  let start_date = new Date(start_date_val);
  const end_date = new Date(end_date_val);
  const result: any = [];
  while (start_date <= end_date) {
    // const sd = new Date(start_date.setHours(0, 0, 0));
    // const ed = new Date(start_date.setHours(23, 59, 59));
    // const tasks_date = tasks?.filter((ele: Task) => {
    //   const created_at = new Date(ele?.created_at);
    //   return sd <= created_at && created_at < ed;
    // });
    const tasks_date = tasks;
    if (users && users.length > 0) {
      projects.map((project: Project) => {
        const allTasksOfProject = tasks_date?.filter((el) => el?.projects?.map((e) => e?._id).includes(project?._id));
        // Loop for users
        users.map((user) => {
          const allTasksOfUsers = allTasksOfProject?.filter((task) => {
            if (task?.assignee_id?.map((e) => e?._id).includes(user?._id)) return true;
            if (task?.subtasks && task.subtasks?.length > 0) {
              const listAss = task?.subtasks?.map((ele) => ele?.assignee_id?.at(0)?._id);
              if (listAss?.includes(user?._id)) return true;
              return false;
            }
          });
          const tt =
            allTasksOfUsers && allTasksOfUsers.length > 0
              ? allTasksOfUsers.reduce((accumulator: Task[], currentValue) => {
                  if (!accumulator) return [currentValue];
                  if (!currentValue.parent_id) {
                    // Case task is not sub task
                    const ss = accumulator.filter((acc) => String(acc?._id) === String(currentValue._id));
                    return ss && ss.length > 0 ? accumulator : [...accumulator, currentValue];
                  } else {
                    // Case task is SUB TASK
                    const cc = allTasksOfUsers?.filter((task) => {
                      return String(task._id) === String(currentValue.parent_id);
                    });
                    if (cc && cc.length > 0) {
                      const ss = accumulator.filter((acc) => String(acc?._id) === String(cc[0]._id));

                      return ss && ss.length > 0 ? accumulator : [...accumulator, cc[0]];
                    }
                    return accumulator;
                  }
                }, [])
              : allTasksOfUsers;
          if (allTasksOfUsers) {
            result.push({
              ...user,
              _id: `${user?._id}_${project?._id}_${start_date}`,
              date: getDateValue(start_date.toString()),
              project: project?.name,
              total_tasks: tt.length,
              total_completed_tasks: tt?.filter((item) => {
                if (item.due_date) {
                  if (Number(item.deadline_type) === 1) {
                    return (
                      item.status === "done" && new Date(item.updated_at).getTime() <= new Date(item.due_date).getTime()
                    );
                  } else {
                    return (
                      item.status === "done" &&
                      new Date(item.updated_at).setHours(0, 0, 0, 0) <= new Date(item.date).setHours(0, 0, 0, 0)
                    );
                  }
                } else {
                  return (
                    item.status === "done" &&
                    new Date(item.updated_at).setHours(0, 0, 0, 0) <= new Date(item.date).setHours(0, 0, 0, 0)
                  );
                }
              }).length,
              total_skipped_tasks: tt?.filter((item) => item.status === "skipped").length,
              total_overdue_tasks: tt?.filter((item) => {
                if (item.status === "new") {
                  if (item.due_date && Number(item.deadline_type) === 1) {
                    return new Date().getTime() > new Date(item.due_date).getTime();
                  }
                  return Number(new Date().getHours()) >= 17;
                } else if (item.status === "done") {
                  if (item.due_date && Number(item.deadline_type) === 1) {
                    return new Date(item.updated_at).getTime() > new Date(item.due_date).getTime();
                  }
                  return Number(new Date(item.updated_at).getHours()) >= 17;
                }
              }).length,
              total_time_estimate: allTasksOfUsers.reduce((accumulator, currentValue) => {
                if (currentValue?.subtasks && currentValue.subtasks?.length > 0) {
                  // If have sub tasks, calculate time in sub task
                  const subtasksOfUser = currentValue.subtasks?.filter((el) => el?.assignee_id?.at(0)?._id?.includes(user?._id));
                  const sub_task_est = subtasksOfUser
                    ?.filter((el) => el.status != "skipped")
                    .reduce((sum, el) => sum + (el?.time_estimate || 0), 0);
                  return accumulator + sub_task_est;
                }
                return (
                  accumulator +
                  (currentValue.status !== "skipped" && currentValue?.time_estimate ? currentValue?.time_estimate : 0)
                );
              }, 0),
              total_time_actual: allTasksOfUsers.reduce((accumulator, currentValue) => {
                if (currentValue?.subtasks && currentValue.subtasks?.length > 0) {
                  // If have sub tasks, calculate time in sub task
                  const subtasksOfUser = currentValue.subtasks?.filter((el) => el?.assignee_id?.at(0)?._id?.includes(user?._id));
                  const sub_task_act = subtasksOfUser
                    ?.filter((el) => el?.status === "done")
                    .reduce((sum, el) => sum + (el?.time_actual || 0), 0);
                  return accumulator + sub_task_act;
                } else {
                  return (
                    accumulator +
                    (currentValue.status === "done" && currentValue?.time_actual ? currentValue?.time_actual : 0)
                  );
                }
              }, 0),
            });
          }
        });
      });
    }
    start_date = new Date(start_date.setDate(start_date.getDate() + 1));
  }
  return result;
};
