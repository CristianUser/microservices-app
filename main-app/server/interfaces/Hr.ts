interface CommonProps {
  id: string;
  name: string;
  disabled: boolean;
  status: 'draft' | 'archived' | 'active';
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee extends CommonProps {
  description?: string;
  position: string;
  employmentType: string;
  gender: string;
  imageUrl: string;
  contacts: any;
  joinDate: Date;
  birthDate: Date;
  leaveApplications?: LeaveApplication[];
  approvedApplications?: any[];
}

export interface Department extends CommonProps {
  description?: string;
  imageUrl: string;
  employees: Employee[];
}

export interface LeaveApplication extends CommonProps {
  reason?: string;
  startDate: Date;
  endDate: Date;
  approvalStatus: string;
  leaveType: string;
  employee: Employee | string;
  approver?: Employee | string;
}
