export enum Role {
  ANONYMOUS = 'anonymous',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export enum Permission {
  READ_POSTS = 'read:posts',
  CREATE_POST = 'create:post',
  DELETE_POST = 'delete:post',
  MODERATE_POSTS = 'moderate:posts',
  MANAGE_USERS = 'manage:users',
  BAN_USERS = 'ban:users',
  COMMENT = 'comment:posts',
  LIKE = 'like:posts',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ANONYMOUS]: [
    Permission.READ_POSTS,
    Permission.CREATE_POST,
  ],
  [Role.USER]: [
    Permission.READ_POSTS,
    Permission.CREATE_POST,
    Permission.COMMENT,
    Permission.LIKE,
  ],
  [Role.MODERATOR]: [
    Permission.READ_POSTS,
    Permission.CREATE_POST,
    Permission.DELETE_POST,
    Permission.MODERATE_POSTS,
    Permission.COMMENT,
    Permission.LIKE,
  ],
  [Role.ADMIN]: [
    Permission.READ_POSTS,
    Permission.CREATE_POST,
    Permission.DELETE_POST,
    Permission.MODERATE_POSTS,
    Permission.MANAGE_USERS,
    Permission.BAN_USERS,
    Permission.COMMENT,
    Permission.LIKE,
  ],
};

export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return rolePermissions[userRole]?.includes(permission) || false;
};

export const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  const roles = Object.values(Role);
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  return userRoleIndex >= requiredRoleIndex;
};

export const getAllPermissionsForRole = (role: Role): Permission[] => {
  return rolePermissions[role] || [];
};

export const isAnonymousRole = (role?: string): boolean => {
  return role === Role.ANONYMOUS;
};

export const canInteract = (role?: string): boolean => {
  return role !== undefined && role !== Role.ANONYMOUS;
};