import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { IConfig } from '../config';
import CrudService from './Crud';
import { createCrudRoutes } from './utils';
import Employee from '../db/entity/Employee';
import Department from '../db/entity/Department';

export default (config: IConfig) => {
  const log = config.log();
  const employeeService = new CrudService<Employee>(config, Employee, [
    'department',
    'leaveApplications',
    'approvedApplications'
  ]);
  const departmentService = new CrudService<Department>(config, Department, ['employees']);
  const leaveApplicationService = new CrudService<Department>(config, Department, [
    'employee',
    'approver'
  ]);
  const fastify = Fastify();

  fastify.get('/health-check', (request, reply) => {
    const { uptime, memoryUsage, cpuUsage } = process;
    const status = {
      cpuUsage: cpuUsage(),
      memoryUsage: memoryUsage(),
      status: 'ok',
      timestamp: Date.now(),
      uptime: uptime()
    };

    reply.send(status);
  });

  fastify.register(createCrudRoutes, {
    controller: employeeService,
    prefix: '/employee'
  });

  fastify.register(createCrudRoutes, {
    controller: departmentService,
    prefix: '/department'
  });

  fastify.register(createCrudRoutes, {
    controller: leaveApplicationService,
    prefix: '/leave-application'
  });

  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    reply.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return reply.send({
      error: {
        message: error.message
      }
    });
  });

  return fastify;
};
