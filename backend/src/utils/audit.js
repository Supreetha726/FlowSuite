const {prisma}=require('../config/database');
exports.audit=async({organizationId,actorId,action,targetType,targetId,metadata})=>prisma.auditLog.create({data:{organizationId,actorId,action,targetType,targetId,metadata:metadata||undefined}});
