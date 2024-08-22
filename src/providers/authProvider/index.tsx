import { Button, notification } from "antd";
import { CredentialResponse } from "../../interfaces/google";
import { parseJwt } from "../../utils/parse-jwt";
import { AuthBindings } from "@refinedev/core";
import axios from "axios";
import i18next from "i18next";

export const authProvider: AuthBindings = {
  login: async ({ credential }: CredentialResponse) => {
    const profileObj = credential ? parseJwt(credential) : null;
    if (profileObj) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sub: profileObj.sub,
          full_name: profileObj.name,
          email: profileObj.email,
          avatar: profileObj.picture,
        }),
      });

      const { data, status, message } = await response.json();

      if (status === 400 || status === 401 || status === 403 || status === 500) {
        return {
          success: false,
          // error: {
          //   message: t("notifications.error"),
          //   name: t(`notifications.${message}`),
          // },
        };
      }

      if ((status === 200 || status === 201) && data.user && data?.user?.active === "active") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.access_token);
        return {
          success: true,
          redirectTo: "/",
        };
      }
    }
    return {
      success: false,
    };
  },
  logout: async () => {
    const token = localStorage.getItem("token");

    if (token && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedTeam");
      localStorage.removeItem("selectedTeamId");
      localStorage.removeItem("openFilterTasks");
      localStorage.removeItem("tasks");
      axios.defaults.headers.common = {};
      window.google?.accounts.id.revoke(token, () => {
        return {};
      });
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.error("Auth error: ", error);
    return { error };
  },
  check: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const isTokenExpired = JSON.parse(window.atob(token.split(".")[1]));
      if (isTokenExpired.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedTeam");
        localStorage.removeItem("selectedTeamId");
        localStorage.removeItem("openFilterTasks");
        localStorage.removeItem("tasks");
        return {
          authenticated: false,
          error: {
            message: "Check failed",
            name: "Token not found",
          },
          logout: true,
          redirectTo: "/login",
        };
      } else
        return {
          authenticated: true,
        };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Token not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = localStorage.getItem("user");
    // const usenavigate = useNavigate();
    if (auth) {
      const parsedUser = JSON.parse(auth);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${parsedUser?._id}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });
      const { data } = await response.json();
      const roleUser = data?.role?.toLowerCase();
      const color = roleUser === "admin" ? "red" : roleUser === "leader" ? "blue" : "green";

      return { role: roleUser, color };
    }

    return null;
  },
  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${parsedUser?._id}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      });
      const { data, event } = await response.json();
      if (event && event.length > 0) {
        event.map((e: any) => {
          let action = i18next.t(`pages.tasks.history.actions.${e?.method}`);
          if (e?.method == "assign" && e?.receiver_id) {
            action = i18next.t(`pages.tasks.history.actions.assign_to`);
          }
          // /tasks/${e?.task_id?._id}
          notification.info({
            message: `${e?.task_id?.name}`,
            description: (
              <>
                <span>{e?.method == "assign" && e.created_by.full_name}</span>
                <span>{e?.method == "assign" && i18next.t("pages.tasks.history.atUser")}</span>
                <span>{e?.method == "assign" && i18next.t("pages.tasks.history.preAction", { action })}</span>
                <a href={`/tasks/${e?.task_id?._id}`}> {e?.task_id?.name} </a>
                <span>{i18next.t("pages.tasks.history.atAction", { action })}</span>
                <span>
                  {e?.method == "assign" &&
                    e?.receiver_id &&
                    i18next.t("pages.tasks.history.to", { assignee: e?.receiver_id?.full_name })}
                </span>
              </>
            ),
            // description: `
            //       ${e?.method == "assign" && e.created_by.full_name}
            //       ${e?.method == "assign" && i18next.t("pages.tasks.history.atUser")}
            //       ${e?.method == "assign" && i18next.t("pages.tasks.history.preAction", { action })}
            //       ${e?.task_id?.name}
            //       ${i18next.t("pages.tasks.history.atAction", { action })}
            //       ${e?.method == "assign" && e?.receiver_id && i18next.t("pages.tasks.history.to", { assignee: e?.receiver_id?.full_name })}`,
            key: e._id,

            duration: 0,
          });
        });
      }

      return data;
    }
    return null;
  },
};
