import { newEnforcer } from "casbin";
import type { CanParams, CanReturnType } from "@refinedev/core";

import { authProvider } from "../authProvider";
import { model, adapter } from "../../accessControl";
import { RoleUser } from "../../interfaces";

export const accessControlProvider = {
  can: async ({ resource, action, params }: CanParams): Promise<CanReturnType> => {
    const role = (await authProvider.getPermissions?.()) as RoleUser;

    const enforcer = await newEnforcer(model, adapter);
    const can = await enforcer.enforce(role?.role, resource, action);
    if (action === "edit" || action === "show") {
      return Promise.resolve({
        can: await enforcer.enforce(role?.role, `${resource}/${params?.id}`, action),
      });
    }
    return Promise.resolve({
      can: can,
    });
  },
  options: {
    buttons: {
      enableAccessControl: true,
      // hide action buttons if not authorized.
      hideIfUnauthorized: true,
    },
  },
};
