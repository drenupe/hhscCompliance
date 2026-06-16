import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSecurityRolesPermissions1800000000225
  implements MigrationInterface
{
  name = 'SeedSecurityRolesPermissions1800000000225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      'SUPER_ADMIN',
      'PROVIDER_ADMIN',
      'PROGRAM_MANAGER',
      'RN',
      'LVN',
      'CASE_MANAGER',
      'ISS_MANAGER',
      'ISS_STAFF',
      'DIRECT_CARE_STAFF',
      'HOST_HOME_PROVIDER',
      'FOSTER_CARE_PROVIDER',
      'SURVEYOR',
      'READ_ONLY',
    ];

    const permissions = [
      'dashboard:view',
      'consumer:view',
      'consumer:update',
      'medicaid:view',
      'medicaid:update',
      'diagnosis:view',
      'diagnosis:update',
      'residential:view',
      'residential:update',
      'iss:view',
      'iss:update',
      'audit-log:view',
      'survey-binder:view',
      'survey-binder:print',
      'report:export',
      'security:role:manage',
      'security:permission:manage',
    ];

    for (const role of roles) {
      await queryRunner.query(
        `
        INSERT INTO roles (name, description, status)
        VALUES ($1, $2, 'ACTIVE')
        ON CONFLICT (name) DO NOTHING
        `,
        [role, `${role.replace(/_/g, ' ')} role`],
      );
    }

    for (const permission of permissions) {
      await queryRunner.query(
        `
        INSERT INTO permissions (code, module, description, status)
        VALUES ($1, $2, $3, 'ACTIVE')
        ON CONFLICT (code) DO NOTHING
        `,
        [
          permission,
          permission.split(':')[0],
          `${permission} permission`,
        ],
      );
    }

    await this.grantRolePermissions(queryRunner, 'SUPER_ADMIN', permissions);

    await this.grantRolePermissions(queryRunner, 'PROVIDER_ADMIN', [
      'dashboard:view',
      'consumer:view',
      'consumer:update',
      'medicaid:view',
      'medicaid:update',
      'diagnosis:view',
      'diagnosis:update',
      'residential:view',
      'residential:update',
      'iss:view',
      'iss:update',
      'audit-log:view',
      'survey-binder:view',
      'survey-binder:print',
      'report:export',
    ]);

    await this.grantRolePermissions(queryRunner, 'PROGRAM_MANAGER', [
      'dashboard:view',
      'consumer:view',
      'consumer:update',
      'medicaid:view',
      'diagnosis:view',
      'residential:view',
      'residential:update',
      'iss:view',
      'iss:update',
      'survey-binder:view',
      'report:export',
    ]);

    await this.grantRolePermissions(queryRunner, 'RN', [
      'dashboard:view',
      'consumer:view',
      'medicaid:view',
      'diagnosis:view',
      'diagnosis:update',
      'residential:view',
      'iss:view',
      'survey-binder:view',
      'report:export',
    ]);

    await this.grantRolePermissions(queryRunner, 'LVN', [
      'dashboard:view',
      'consumer:view',
      'medicaid:view',
      'diagnosis:view',
      'residential:view',
      'iss:view',
      'survey-binder:view',
    ]);

    await this.grantRolePermissions(queryRunner, 'CASE_MANAGER', [
      'dashboard:view',
      'consumer:view',
      'medicaid:view',
      'diagnosis:view',
      'residential:view',
      'iss:view',
      'survey-binder:view',
      'report:export',
    ]);

    await this.grantRolePermissions(queryRunner, 'ISS_MANAGER', [
      'dashboard:view',
      'consumer:view',
      'consumer:update',
      'iss:view',
      'iss:update',
      'survey-binder:view',
      'report:export',
    ]);

    await this.grantRolePermissions(queryRunner, 'ISS_STAFF', [
      'dashboard:view',
      'consumer:view',
      'iss:view',
    ]);

    await this.grantRolePermissions(queryRunner, 'SURVEYOR', [
      'dashboard:view',
      'consumer:view',
      'medicaid:view',
      'diagnosis:view',
      'residential:view',
      'iss:view',
      'survey-binder:view',
    ]);

    await this.grantRolePermissions(queryRunner, 'READ_ONLY', [
      'dashboard:view',
      'consumer:view',
      'medicaid:view',
      'diagnosis:view',
      'residential:view',
      'iss:view',
      'survey-binder:view',
    ]);

    await this.grantRolePermissions(queryRunner, 'DIRECT_CARE_STAFF', [
      'dashboard:view',
      'consumer:view',
      'residential:view',
      'iss:view',
    ]);

    await this.grantRolePermissions(queryRunner, 'HOST_HOME_PROVIDER', [
      'dashboard:view',
      'consumer:view',
      'residential:view',
      'iss:view',
    ]);

    await this.grantRolePermissions(queryRunner, 'FOSTER_CARE_PROVIDER', [
      'dashboard:view',
      'consumer:view',
      'residential:view',
      'iss:view',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role_permissions
      WHERE role_id IN (
        SELECT id FROM roles
        WHERE name IN (
          'SUPER_ADMIN',
          'PROVIDER_ADMIN',
          'PROGRAM_MANAGER',
          'RN',
          'LVN',
          'CASE_MANAGER',
          'ISS_MANAGER',
          'ISS_STAFF',
          'DIRECT_CARE_STAFF',
          'HOST_HOME_PROVIDER',
          'FOSTER_CARE_PROVIDER',
          'SURVEYOR',
          'READ_ONLY'
        )
      )
    `);
  }

  private async grantRolePermissions(
    queryRunner: QueryRunner,
    roleName: string,
    permissionCodes: string[],
  ): Promise<void> {
    for (const permissionCode of permissionCodes) {
      await queryRunner.query(
        `
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r
        CROSS JOIN permissions p
        WHERE r.name = $1
        AND p.code = $2
        ON CONFLICT (role_id, permission_id) DO NOTHING
        `,
        [roleName, permissionCode],
      );
    }
  }
}