import { newModel, StringAdapter } from "casbin";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`
p, admin, users, (list)|(create)
p, admin, users/edit/*, (edit)|(show)
p, admin, users/create, create

p, admin, teams, (list)|(edit)|(create)
p, admin, teams/*, (edit)|(show)

p, admin, tasks, (list)|(create)
p, admin, tasks/*, (edit)|(show)

p, leader, tasks, (list)|(create)
p, leader, tasks/*, (edit)|(show)|(create)

p, leader, teams, list
p, leader, teams/edit/*, (edit)|(show)
p, leader, teams/create, create

p, member, tasks, (list)|(create)
p, member, tasks/*, (edit)|(show)
`);
