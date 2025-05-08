"use client"

interface UserFiltersProps {
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  departmentFilter: string
  departments: string[]
  onDepartmentFilterChange: (department: string) => void
  sortOption: string
  onSortOptionChange: (option: string) => void
  totalUsers: number
  filteredUsers: number
}

export function UserFilters({
  roleFilter,
  onRoleFilterChange,
  departmentFilter,
  departments,
  onDepartmentFilterChange,
  sortOption,
  onSortOptionChange,
  totalUsers,
  filteredUsers,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[var(--fixed-secondary)] p-4 rounded-md border border-[var(--fixed-card-border)]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
        <div>
          <label htmlFor="role-filter" className="text-sm font-medium mb-1 block">
            Role
          </label>
          <select
            id="role-filter"
            className="w-full rounded-md border border-[var(--fixed-card-border)] bg-transparent px-3 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Developer">Developer</option>
            <option value="Tester">Tester</option>
            <option value="Product Owner">Product Owner</option>
          </select>
        </div>

        <div>
          <label htmlFor="department-filter" className="text-sm font-medium mb-1 block">
            Department
          </label>
          <select
            id="department-filter"
            className="w-full rounded-md border border-[var(--fixed-card-border)] bg-transparent px-3 py-2 text-sm"
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-option" className="text-sm font-medium mb-1 block">
            Sort By
          </label>
          <select
            id="sort-option"
            className="w-full rounded-md border border-[var(--fixed-card-border)] bg-transparent px-3 py-2 text-sm"
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="role-asc">Role (A-Z)</option>
            <option value="role-desc">Role (Z-A)</option>
            <option value="department-asc">Department (A-Z)</option>
            <option value="department-desc">Department (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-[var(--fixed-sidebar-muted)] mt-2 md:mt-0">
        Showing {filteredUsers} of {totalUsers} users
      </div>
    </div>
  )
}
