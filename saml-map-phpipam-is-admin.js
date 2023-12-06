var client = keycloakSession.getContext().getClient();
var is_admin_role = client.getRole("is_admin");
//print(" --> trace hasRole: " + user.hasRole(r));

exports = user.hasRole(is_admin_role);
