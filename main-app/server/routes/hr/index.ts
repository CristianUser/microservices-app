import { FastifyInstance } from 'fastify';
import { Department, Employee, LeaveApplication } from '../../interfaces/Hr';
import BasicCrud from '../../services/BasicCrud';
import { createCrudRoutes } from '../utils';

const serviceName = 'hr-service';

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
  const employeeService = new BasicCrud<Employee>(opts.config, {
    routePrefix: '/employee',
    serviceName
  });
  const departmentService = new BasicCrud<Department>(opts.config, {
    routePrefix: '/department',
    serviceName
  });
  const leaveApplicationService = new BasicCrud<LeaveApplication>(opts.config, {
    routePrefix: '/leave-application',
    serviceName
  });

  fastify.register(createCrudRoutes, {
    service: employeeService,
    prefix: '/employee'
  });

  fastify.register(createCrudRoutes, {
    service: departmentService,
    prefix: '/department'
  });

  fastify.register(createCrudRoutes, {
    service: leaveApplicationService,
    prefix: '/leave-application'
  });

  done();
};
