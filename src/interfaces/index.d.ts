export type Maybe<T> = T | null;
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Number: { input: number; output: number };
  DateTime: { input: any; output: any };
};
export type RoleUser = {
  role: Scalars["String"]["output"];
  color: Scalars["String"]["output"];
};

export type CheckResponse = {
  authenticated: boolean;
  redirectTo?: string;
  logout?: boolean;
  error?: Error;
};
export type SubTask = {
  _id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  assignee_id?: Maybe<User[]>;
  time_estimate?: Scalars["Number"]["output"];
  time_actual?: Scalars["Number"]["output"];
};
export type Team = {
  _id: Scalars["ID"]["output"];
  active: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  code: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  updated_at: Scalars["DateTime"]["output"];
};
export type User = {
  _id: Scalars["ID"]["output"];
  sub: Scalars["ID"]["output"];
  active: Scalars["String"]["output"];
  avatar?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  full_name: Scalars["String"]["output"];
  role: Scalars["String"]["output"];
  nick_name?: Scalars["String"]["output"];
  team_id?: Maybe<Team[]>;
  created_at: Scalars["DateTime"]["output"];
  updated_at: Scalars["DateTime"]["output"];
};
export type Task = {
  _id: Scalars["ID"]["output"];
  assignee_id?: Maybe<User[]>;
  team_id: Maybe<Team>;
  parent_id?: Maybe<Task>;
  name: Scalars["String"]["output"];
  description?: Scalars["String"]["output"];
  skip_reason?: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  repeat_type: Scalars["String"]["output"];
  repeat_date?: Maybe<[]>;
  repeat_template_id?: Maybe<Task>;
  deadline_type?: Scalars["Number"]["output"];
  attachment_active: Scalars["Boolean"]["output"];
  attachment_url?: Scalars["String"]["output"];
  tags?: Maybe<Tag[]>;
  projects?: Maybe<Project[]>;
  date?: Scalars["DateTime"]["output"];
  due_date?: Scalars["DateTime"]["output"];
  time_estimate?: Scalars["Number"]["output"];
  time_actual?: Scalars["Number"]["output"];
  created_by?: Maybe<User>;
  updated_by?: Maybe<User>;
  created_at: Scalars["DateTime"]["output"];
  updated_at: Scalars["DateTime"]["output"];
  subtasks?: Maybe<SubTask[]>;
};
export type Activity = {
  _id: Scalars["ID"]["output"];
  method: Scalars["String"]["output"];
  task_id: Maybe<Task>;
  created_by: Maybe<User>;
  receiver_id?: Maybe<User>;
  created_at: Scalars["DateTime"]["output"];
};
export type Tag = {
  _id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  updated_at: Scalars["DateTime"]["output"];
};
export type Project = {
  _id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  created_at: Scalars["DateTime"]["output"];
  updated_at: Scalars["DateTime"]["output"];
};
