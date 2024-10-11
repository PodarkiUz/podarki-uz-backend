export const schema = 'public';

export type Table = {
  name: string;
  columns: {
    [key: string]: string;
  };
};

// tables
export const position = {
  name: `${schema}.position`,
  columns: {
    id: 'id',
    created_at: 'created_at',
    created_by: 'created_by',
    name_uz: 'name_uz',
    name_uzl: 'name_uzl',
    name_ru: 'name_ru',
    provider_type: 'provider_type',
    department_id: 'department_id',
    is_deleted: 'is_deleted',
  },
};

export const users = {
  name: `${schema}.users`,
  columns: {
    id: 'id',
    created_at: 'created_at',
    created_by: 'created_by',
    first_name: 'first_name',
    last_name: 'last_name',
    middle_name: 'middle_name',
    phone_number: 'phone_number',
    email: 'email',
    password: 'password',
    is_deleted: 'is_deleted',
    is_active: 'is_active',
    is_verified: 'is_verified',
  },
};

export const auth_token = {
  name: `${schema}.auth_token`,
};

export const tableNames = {
  roles: `${schema}.roles`,
  regions: `${schema}.regions`,
  role_permissions: `${schema}.role_permissions`,
  permissions: `${schema}.permissions`,
  user_roles: `${schema}.user_roles`,
  provider_users: `${schema}.provider_users`,
  provider_types: `${schema}.provider_types`,
  positions: `${schema}.position`,
  reason: `${schema}.reason`,
  departments: `${schema}.departments`,
  streets: `${schema}.streets`,
  incidents: `${schema}.incidents`,
  calls: `${schema}.calls`,
  call_objectives: `${schema}.call_objectives`,
  cards: `${schema}.cards`,
  incidentsV2: `${schema}.incidents_v2`,
};

export const getConcreteColumnWithPrefix = (
  prefix,
  columnName: string,
  as?: string,
) => {
  return `${prefix}.${columnName}${as ? ` as ${as}` : ''}`;
};

export const dot = getConcreteColumnWithPrefix;

export const getAllColumnsWithPrefix = (prefix, table: Table) => {
  return Object.keys(table.columns).map((column) => {
    return getConcreteColumnWithPrefix(prefix, table.columns[column]);
  });
};
