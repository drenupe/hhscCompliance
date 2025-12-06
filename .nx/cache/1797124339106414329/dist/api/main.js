/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("compression");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
// api/src/app/app.module.ts
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(9);
const typeorm_1 = __webpack_require__(10);
const node_path_1 = __webpack_require__(11);
const configuration_1 = __webpack_require__(12);
const async_config_1 = __webpack_require__(13);
const app_controller_1 = __webpack_require__(15);
const app_service_1 = __webpack_require__(16);
// Feature modules
const auth_module_1 = __webpack_require__(18);
const raci_module_1 = __webpack_require__(23);
// import { UsersModule } from './users/users.module';
// import { MetricsModule } from './observability/metrics/metrics.module';
const request_id_middleware_1 = __webpack_require__(34);
const iss_module_1 = __webpack_require__(36);
const consumers_module_1 = __webpack_require__(49);
// import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
// import { HttpErrorFilter } from './common/filters/http-exception.filter';
// import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
// import { MetricsInterceptor } from './observability/metrics/metrics.interceptor';
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.configuration], // 🔑 use your zod-based config
                envFilePath: [
                    // app-specific first
                    (0, node_path_1.join)(process.cwd(), `api/.env.${process.env.NODE_ENV}.local`),
                    (0, node_path_1.join)(process.cwd(), `api/.env.${process.env.NODE_ENV}`),
                    (0, node_path_1.join)(process.cwd(), 'api/.env'),
                    // common fallbacks
                    `.env.${process.env.NODE_ENV}.local`,
                    `.env.${process.env.NODE_ENV}`,
                    '.env',
                ],
            }),
            // 🔌 DB connection (uses `configuration()` + async.config)
            typeorm_1.TypeOrmModule.forRootAsync(async_config_1.typeOrmAsyncConfig),
            // feature modules
            auth_module_1.AuthModule,
            raci_module_1.RaciModule,
            iss_module_1.IssModule,
            consumers_module_1.ConsumersModule
            // UsersModule,
            // MetricsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            // { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
            // { provide: APP_FILTER, useClass: HttpErrorFilter },
            // { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
        ],
    })
], AppModule);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


// api/src/configuration/configuration.ts
// Simple, Zod-free config for local dev.
// You can reintroduce strict Zod checks later for staging/prod.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.configuration = void 0;
const configuration = () => {
    const rawNodeEnv = (process.env.NODE_ENV ?? '').trim();
    const env = rawNodeEnv || 'development';
    const rawPort = Number(process.env.PORT ?? 3000);
    const port = Number.isNaN(rawPort) ? 3000 : rawPort;
    const apiPrefix = process.env.API_PREFIX || 'api';
    const corsOrigins = (process.env.CORS_ORIGIN ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const databaseUrl = process.env.DATABASE_URL ?? '';
    const sslFromUrl = /[?&]sslmode=require/i.test(databaseUrl);
    const dbSslFlag = String(process.env.DB_SSL ?? '').toLowerCase() === 'true';
    const databaseSsl = dbSslFlag || sslFromUrl;
    const pgCaCert = process.env.PG_CA_CERT;
    const accessTtl = process.env.JWT_EXPIRES_IN || '15m';
    const rawRefreshDays = Number(process.env.REFRESH_TTL_DAYS ?? 7);
    const refreshDays = Number.isNaN(rawRefreshDays) ? 7 : rawRefreshDays;
    const refreshTtl = `${refreshDays}d`;
    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me_in_real_envs';
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || jwtSecret;
    return {
        env,
        port,
        apiPrefix,
        cors: {
            origins: corsOrigins,
        },
        database: {
            url: databaseUrl,
            ssl: databaseSsl,
            caCert: pgCaCert,
        },
        auth: {
            jwtSecret,
            jwtRefreshSecret,
            accessTtl,
            refreshTtl,
        },
    };
};
exports.configuration = configuration;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeOrmAsyncConfig = void 0;
const config_1 = __webpack_require__(9);
const node_fs_1 = __webpack_require__(14);
const node_path_1 = __webpack_require__(11);
exports.typeOrmAsyncConfig = {
    inject: [config_1.ConfigService],
    useFactory: async (cfg) => {
        const nodeEnv = String(cfg.get('env') ?? cfg.get('NODE_ENV') ?? 'development').toLowerCase();
        const url = cfg.get('database.url') ??
            cfg.get('DATABASE_URL') ??
            '';
        const useUrl = url.length > 0;
        // SSL toggle from config/env or sslmode=require in the URL
        const dbSslFlag = cfg.get('database.ssl') ??
            /^true$/i.test(String(cfg.get('DB_SSL') ?? ''));
        const sslFromUrl = /[?&]sslmode=require/i.test(url);
        const sslOn = Boolean(dbSslFlag || sslFromUrl);
        // CA: inline or file path
        const caInline = cfg.get('database.caCert') ??
            cfg.get('PG_CA_CERT');
        const caPath = cfg.get('database.caCertPath') ??
            cfg.get('PG_CA_CERT_PATH');
        let caPem;
        if (caInline) {
            caPem = caInline.replace(/\\n/g, '\n').trim();
        }
        else if (caPath && (0, node_fs_1.existsSync)(caPath)) {
            caPem = (0, node_fs_1.readFileSync)(caPath, 'utf8');
        }
        const sslConfig = sslOn
            ? caPem
                ? { rejectUnauthorized: true, ca: caPem }
                : { rejectUnauthorized: false }
            : false;
        const base = {
            type: 'postgres',
            autoLoadEntities: true,
            // ✅ Important: use migrations only (no runtime schema sync)
            synchronize: false,
            ssl: sslConfig,
            extra: {
                ...(sslOn ? { ssl: sslConfig } : {}),
                keepAlive: true,
                connectionTimeoutMillis: 10_000,
                statement_timeout: 30_000,
                query_timeout: 30_000,
            },
            // For programmatic migration runs (if you ever call dataSource.runMigrations())
            migrations: [(0, node_path_1.resolve)(process.cwd(), 'dist/api/migrations/*.js')],
        };
        const discrete = {
            host: cfg.get('database.host') ?? cfg.get('DB_HOST') ?? 'localhost',
            port: parseInt(String(cfg.get('database.port') ?? cfg.get('DB_PORT') ?? '5432'), 10),
            username: cfg.get('database.user') ?? cfg.get('DB_USER') ?? 'postgres',
            password: cfg.get('database.pass') ?? cfg.get('DB_PASS') ?? 'postgres',
            database: cfg.get('database.name') ?? cfg.get('DB_NAME') ?? 'postgres',
        };
        return {
            ...base,
            ...(useUrl ? { url } : discrete),
        };
    },
};


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(1);
// api/src/app/app.controller.ts
const common_1 = __webpack_require__(2);
const app_service_1 = __webpack_require__(16);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    // GET /api/v1
    getRoot() {
        return this.appService.root();
    }
    // GET /api/v1/health
    getHealth() {
        return this.appService.health();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getRoot", null);
tslib_1.__decorate([
    (0, common_1.Get)('health'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(1);
// api/src/app/app.service.ts
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(17);
let AppService = class AppService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async root() {
        return {
            status: 'ok',
            message: 'HHSC Compliance API live',
        };
    }
    async health() {
        try {
            // simple DB ping
            await this.dataSource.query('SELECT 1');
            return {
                status: 'ok',
                db: 'up',
            };
        }
        catch (e) {
            return {
                status: 'degraded',
                db: 'down',
                error: e.message,
            };
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.DataSource !== "undefined" && typeorm_1.DataSource) === "function" ? _a : Object])
], AppService);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(19);
const auth_controller_1 = __webpack_require__(20);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
let AuthService = class AuthService {
    create(createAuthDto) {
        return 'This action adds a new auth';
    }
    findAll() {
        return `This action returns all auth`;
    }
    findOne(id) {
        return `This action returns a #${id} auth`;
    }
    update(id, updateAuthDto) {
        return `This action updates a #${id} auth`;
    }
    remove(id) {
        return `This action removes a #${id} auth`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AuthService);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(19);
const create_auth_dto_1 = __webpack_require__(21);
const update_auth_dto_1 = __webpack_require__(22);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    create(createAuthDto) {
        return this.authService.create(createAuthDto);
    }
    findAll() {
        return this.authService.findAll();
    }
    findOne(id) {
        return this.authService.findOne(+id);
    }
    update(id, updateAuthDto) {
        return this.authService.update(+id, updateAuthDto);
    }
    remove(id) {
        return this.authService.remove(+id);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_auth_dto_1.CreateAuthDto !== "undefined" && create_auth_dto_1.CreateAuthDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof update_auth_dto_1.UpdateAuthDto !== "undefined" && update_auth_dto_1.UpdateAuthDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "remove", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAuthDto = void 0;
class CreateAuthDto {
}
exports.CreateAuthDto = CreateAuthDto;


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAuthDto = void 0;
const swagger_1 = __webpack_require__(4);
const create_auth_dto_1 = __webpack_require__(21);
class UpdateAuthDto extends (0, swagger_1.PartialType)(create_auth_dto_1.CreateAuthDto) {
}
exports.UpdateAuthDto = UpdateAuthDto;


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RaciModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(10);
const raci_entities_1 = __webpack_require__(24);
const raci_service_1 = __webpack_require__(25);
const raci_controller_1 = __webpack_require__(33);
let RaciModule = class RaciModule {
};
exports.RaciModule = RaciModule;
exports.RaciModule = RaciModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([raci_entities_1.RoleCatalog, raci_entities_1.ModuleCatalog, raci_entities_1.RaciAssignment])],
        providers: [raci_service_1.RaciService],
        controllers: [raci_controller_1.RaciController],
        exports: [raci_service_1.RaciService],
    })
], RaciModule);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RaciAssignment = exports.ModuleCatalog = exports.RoleCatalog = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(17);
// Example lookups (adjust to your schema)
let RoleCatalog = class RoleCatalog {
};
exports.RoleCatalog = RoleCatalog;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], RoleCatalog.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    tslib_1.__metadata("design:type", Object)
], RoleCatalog.prototype, "name", void 0);
exports.RoleCatalog = RoleCatalog = tslib_1.__decorate([
    (0, typeorm_1.Entity)('role_catalog'),
    (0, typeorm_1.Unique)(['name'])
], RoleCatalog);
let ModuleCatalog = class ModuleCatalog {
};
exports.ModuleCatalog = ModuleCatalog;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], ModuleCatalog.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    tslib_1.__metadata("design:type", Object)
], ModuleCatalog.prototype, "key", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], ModuleCatalog.prototype, "label", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], ModuleCatalog.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], ModuleCatalog.prototype, "path", void 0);
exports.ModuleCatalog = ModuleCatalog = tslib_1.__decorate([
    (0, typeorm_1.Entity)('module_catalog'),
    (0, typeorm_1.Unique)(['key'])
], ModuleCatalog);
let RaciAssignment = class RaciAssignment {
};
exports.RaciAssignment = RaciAssignment;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], RaciAssignment.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => ModuleCatalog, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'moduleId' }),
    tslib_1.__metadata("design:type", ModuleCatalog)
], RaciAssignment.prototype, "module", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => RoleCatalog, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'roleId' }),
    tslib_1.__metadata("design:type", RoleCatalog)
], RaciAssignment.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], RaciAssignment.prototype, "moduleId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], RaciAssignment.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], RaciAssignment.prototype, "level", void 0);
exports.RaciAssignment = RaciAssignment = tslib_1.__decorate([
    (0, typeorm_1.Entity)('raci_assignment'),
    (0, typeorm_1.Unique)(['moduleId', 'roleId', 'level'])
], RaciAssignment);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RaciService = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(10);
const typeorm_2 = __webpack_require__(17);
const shared_models_1 = __webpack_require__(26);
const raci_entities_1 = __webpack_require__(24);
let RaciService = class RaciService {
    constructor(modules, roles, assignments) {
        this.modules = modules;
        this.roles = roles;
        this.assignments = assignments;
    }
    /** In-memory fallback (use DB if you’ve seeded ModuleCatalog / RoleCatalog / Assignments) */
    getDefaultRaciFor(moduleKey) {
        return shared_models_1.DEFAULT_RACI[moduleKey];
    }
    /** Allowed roles for a module = union of r, a, c, i (coarse RaciRole buckets) */
    async allowedRoles(moduleKey) {
        // DB path (if you’ve populated tables)
        const mod = await this.modules.findOne({ where: { key: moduleKey } });
        if (mod) {
            const rows = await this.assignments.find({
                where: { moduleId: mod.id },
                relations: ['role'],
            });
            const by = (lvl) => rows
                .filter((r) => r.level === lvl)
                .map((r) => r.role.name);
            const all = [...by('R'), ...by('A'), ...by('C'), ...by('I')];
            return Array.from(new Set(all));
        }
        // Fallback to in-memory default
        const r = this.getDefaultRaciFor(moduleKey);
        return Array.from(new Set([
            ...(r?.r ?? []),
            ...(r?.a ?? []),
            ...(r?.c ?? []),
            ...(r?.i ?? []),
        ]));
    }
    /** Build a simple nav list for a given coarse RaciRole bucket */
    async buildMenuForRole(role) {
        // Map module -> nav display (adjust labels/icons/paths here)
        const catalog = {
            // ✅ keys that ARE ModuleKey
            residential: {
                label: 'Residential',
                icon: 'home',
                path: '/compliance/residential',
            },
            programmatic: {
                label: 'Programmatic',
                icon: 'list-checks',
                path: '/compliance/programmatic',
            },
            finance: {
                label: 'Finance / Rent',
                icon: 'wallet',
                path: '/compliance/finance',
            },
            behavior: {
                label: 'Behavior',
                icon: 'activity',
                path: '/compliance/behavior',
            },
            ane: {
                label: 'Abuse/Neglect/ANE',
                icon: 'shield-alert',
                path: '/compliance/ane',
            },
            restraints: {
                label: 'Restraints',
                icon: 'hand',
                path: '/compliance/restraints',
            },
            billing: {
                label: 'Billing',
                icon: 'file-text',
                path: '/compliance/billing',
            },
            iss: {
                label: 'ISS',
                icon: 'users',
                path: '/iss',
            },
            settings: {
                label: 'Settings',
                icon: 'settings',
                path: '/settings',
            },
            raci: {
                label: 'RACI Matrix',
                icon: 'shield-check',
                path: '/admin/raci',
            },
            dashboard: {
                label: 'Dashboard',
                icon: 'layout-dashboard',
                path: '/dashboard',
            },
            // ✅ extra nav-only keys (NOT part of ModuleKey)
            'enclosed-beds': {
                label: 'Enclosed Beds',
                icon: 'bed',
                path: '/compliance/enclosed-beds',
            },
            'protective-devices': {
                label: 'Protective Devices',
                icon: 'shield',
                path: '/compliance/protective',
            },
            prohibitions: {
                label: 'Prohibitions',
                icon: 'ban',
                path: '/compliance/prohibitions',
            },
            'medical-nursing': {
                label: 'Nursing',
                icon: 'stethoscope',
                path: '/medical/nursing',
            },
            'medical-med-admin': {
                label: 'Med Admin',
                icon: 'pill',
                path: '/medical/med-admin',
            },
            staff: {
                label: 'Staff',
                icon: 'user-cog',
                path: '/staff',
            },
            'cost-report': {
                label: 'Cost Report',
                icon: 'file-spreadsheet',
                path: '/admin/cost-report',
            },
        };
        const items = [];
        // Only walk the RACI-aware modules
        for (const key of Object.keys(shared_models_1.DEFAULT_RACI)) {
            const allowed = await this.allowedRoles(key);
            if (allowed.includes(role)) {
                const d = catalog[key];
                if (d)
                    items.push({ key, ...d });
            }
        }
        // Ensure Dashboard present (in case RACI somehow filtered all else)
        if (!items.some((x) => x.key === 'dashboard')) {
            const d = catalog.dashboard;
            items.unshift({ key: 'dashboard', ...d });
        }
        return items;
    }
};
exports.RaciService = RaciService;
exports.RaciService = RaciService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(raci_entities_1.ModuleCatalog)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(raci_entities_1.RoleCatalog)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(raci_entities_1.RaciAssignment)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], RaciService);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


// libs/shared-models/src/index.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
// Canonical roles + role list
tslib_1.__exportStar(__webpack_require__(27), exports);
// RACI primitives (ModuleKey, allowedRolesFor, etc.)
tslib_1.__exportStar(__webpack_require__(28), exports);
// Legacy / misc exports
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {


// libs/shared-models/src/lib/auth/roles.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ALL_ROLES = void 0;
exports.ALL_ROLES = [
    'Admin',
    'CaseManager',
    'Nurse',
    'DirectCareStaff',
    'ISSManager',
    'ISSStaff',
    'Finance',
    'ProgramDirector',
    'ComplianceOfficer',
    'BehaviorSupportLead',
    'FinanceOfficer',
    'MedicalDirector',
];


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports) => {


// libs/shared-models/src/lib/raci.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ALL_MODULE_KEYS = exports.DEFAULT_RACI = void 0;
exports.allowedRolesFor = allowedRolesFor;
/**
 * Which RACI roles can SEE each module at all.
 * (The full R/A/C/I buckets per module are below in DEFAULT_RACI.)
 */
const MODULE_ACCESS = {
    dashboard: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'READONLY'],
    residential: ['OWNER', 'ADMIN', 'MANAGER'],
    programmatic: ['OWNER', 'ADMIN'],
    finance: ['OWNER', 'ADMIN'],
    behavior: ['OWNER', 'ADMIN', 'MANAGER'],
    ane: ['OWNER', 'ADMIN', 'MANAGER'],
    restraints: ['OWNER', 'ADMIN', 'MANAGER'],
    'enclosed-beds': ['OWNER', 'ADMIN', 'MANAGER'],
    'protective-devices': ['OWNER', 'ADMIN', 'MANAGER'],
    prohibitions: ['OWNER', 'ADMIN', 'MANAGER'],
    'medical-nursing': ['OWNER', 'ADMIN', 'MANAGER'],
    'medical-med-admin': ['OWNER', 'ADMIN', 'MANAGER'],
    iss: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF'],
    staff: ['OWNER', 'ADMIN', 'MANAGER'],
    'cost-report': ['OWNER', 'ADMIN'],
    billing: ['OWNER', 'ADMIN'],
    settings: ['OWNER', 'ADMIN'],
    raci: ['OWNER', 'ADMIN'],
};
/** Quick helper used by guards & services: which RACI roles can access this module? */
function allowedRolesFor(moduleKey) {
    return MODULE_ACCESS[moduleKey] ?? [];
}
/**
 * Default RACI configuration per module.
 * You can:
 *  - use this as an in-memory fallback (what you're doing now)
 *  - or seed it into the DB for ModuleCatalog / RaciAssignment
 */
exports.DEFAULT_RACI = Object.fromEntries(Object.keys(MODULE_ACCESS).map((key) => [
    key,
    {
        r: MODULE_ACCESS[key],
        a: ['OWNER', 'ADMIN'],
        c: ['MANAGER'],
        i: ['STAFF', 'READONLY'],
    },
]));
/** Convenience list if you ever need to iterate safely */
exports.ALL_MODULE_KEYS = Object.keys(MODULE_ACCESS);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {


// libs/shared-models/src/lib/shared-models.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sharedModels = sharedModels;
function sharedModels() {
    return 'shared-models';
}


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


// libs/shared-models/src/lib/ownership.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWNERSHIP_OWNER = void 0;
/**
 * Single "owner" role for each domain.
 * Adjust mappings to whatever fits your org.
 */
exports.OWNERSHIP_OWNER = {
    dashboard: 'ProgramDirector',
    residential: 'ProgramDirector',
    iss: 'ISSManager',
    billing: 'FinanceOfficer',
    settings: 'Admin',
    raci: 'ComplianceOfficer',
    programmatic: 'ProgramDirector',
    finance: 'FinanceOfficer',
};


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports) => {


// libs/shared-models/src/lib/nav/role-menu.ts
// Single source of truth for sidebar structure + icons to register
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MENU_ICON_NAMES = void 0;
exports.menuForRole = menuForRole;
// ---- Group presets ----
const CORE = {
    id: 'core',
    label: 'Core',
    items: [
        { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
        { label: 'Consumers', path: '/consumers', icon: 'users' },
        { label: 'Locations', path: '/residential/locations', icon: 'home' },
    ],
};
const COMPLIANCE = {
    id: 'compliance',
    label: 'Compliance',
    items: [
        { label: 'Residential', path: '/compliance/residential', icon: 'home' },
        { label: 'Programmatic', path: '/compliance/programmatic', icon: 'list-checks' },
        { label: 'Finance / Rent', path: '/compliance/finance', icon: 'wallet' },
        { label: 'Behavior', path: '/compliance/behavior', icon: 'activity' },
        { label: 'Abuse/Neglect/ANE', path: '/compliance/ane', icon: 'shield-alert' },
        { label: 'Restraints', path: '/compliance/restraints', icon: 'hand' },
        { label: 'Enclosed Beds', path: '/compliance/enclosed-beds', icon: 'bed' },
        { label: 'Protective Devices', path: '/compliance/protective', icon: 'shield' },
        { label: 'Prohibitions', path: '/compliance/prohibitions', icon: 'ban' },
    ],
};
const MEDICAL = {
    id: 'medical',
    label: 'Medical',
    items: [
        { label: 'Nursing', path: '/medical/nursing', icon: 'stethoscope' },
        { label: 'Med Admin', path: '/medical/med-admin', icon: 'pill' },
    ],
};
// Training lives under Staff
const STAFF = {
    id: 'staff',
    label: 'Staff',
    items: [
        { label: 'Direct Care Staff', path: '/staff/direct-care', icon: 'users' },
        { label: 'Case Manager', path: '/staff/case-manager', icon: 'briefcase' },
        { label: 'Training', path: '/staff/training', icon: 'graduation-cap' },
    ],
};
const ISS = {
    id: 'iss',
    label: 'ISS (Day Habilitation)',
    items: [
        { label: 'ISS Home', path: '/iss', icon: 'user-round' },
        { label: 'ISS Manager', path: '/iss/manager', icon: 'user-cog' },
        { label: 'Daily Log', path: '/iss/daily-log', icon: 'file-text' },
        { label: 'Notes Review', path: '/iss/notes-review', icon: 'list-checks' },
        { label: 'Notes Gallery', path: '/iss/notes-gallery', icon: 'images' },
    ],
};
const ADMIN = {
    id: 'admin',
    label: 'Admin',
    items: [
        { label: 'Cost Report', path: '/admin/cost-report', icon: 'file-spreadsheet' },
        { label: 'Users & Roles', path: '/admin/users', icon: 'shield-check' },
    ],
};
// ---- Role → Menus ----
// NOTE: AppRole currently includes:
// 'Admin' | 'CaseManager' | 'Nurse' | 'DirectCareStaff' | 'ISSManager' | 'ISSStaff' | 'Finance'
// | 'ProgramDirector' | 'ComplianceOfficer' | 'BehaviorSupportLead'
// | 'FinanceOfficer' | 'MedicalDirector'
const BY_ROLE = {
    // Full access
    Admin: [CORE, COMPLIANCE, MEDICAL, STAFF, ISS, ADMIN],
    // Program / compliance leadership – treat like Admin for now
    ProgramDirector: [CORE, COMPLIANCE, MEDICAL, STAFF, ISS, ADMIN],
    ComplianceOfficer: [CORE, COMPLIANCE, STAFF, ADMIN],
    // Clinical / behavior leads
    BehaviorSupportLead: [CORE, COMPLIANCE, STAFF],
    MedicalDirector: [CORE, MEDICAL, COMPLIANCE, STAFF],
    // Finance roles
    Finance: [CORE, COMPLIANCE, ADMIN],
    FinanceOfficer: [CORE, COMPLIANCE, ADMIN],
    // Case management / nursing / direct care
    CaseManager: [CORE, COMPLIANCE, STAFF],
    Nurse: [CORE, MEDICAL, COMPLIANCE],
    DirectCareStaff: [CORE, COMPLIANCE, STAFF],
    // ISS
    ISSManager: [CORE, ISS, COMPLIANCE],
    ISSStaff: [CORE, ISS],
};
// Pure, synchronous API expected by your Sidebar
function menuForRole(role) {
    return BY_ROLE[role] ?? [CORE];
}
// Export the list of Lucide icon names we use so the app can register them at bootstrap.
exports.MENU_ICON_NAMES = [
    'layout-dashboard', 'users', 'home',
    'list-checks', 'wallet', 'activity', 'shield-alert', 'hand', 'bed', 'shield', 'ban',
    'stethoscope', 'pill', 'briefcase', 'graduation-cap',
    'user-round', 'user-cog', 'file-spreadsheet', 'shield-check', 'file-text', 'images',
];


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports) => {


// libs/shared-models/src/lib/iss/iss.models.ts
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeStaffLogFromApi = normalizeStaffLogFromApi;
exports.buildStaffLogSavePayload = buildStaffLogSavePayload;
// ======================================================================
//  NORMALIZATION HELPERS (API ↔ UI)
// ======================================================================
/**
 * Normalize any date-like value to 'YYYY-MM-DD' or return null if invalid.
 */
function normalizeDateToYmd(value) {
    if (!value || typeof value !== 'string')
        return null;
    // Strip any time portion (e.g. '2025-10-01T00:00:00' → '2025-10-01')
    const candidate = value.slice(0, 10);
    // Very lightweight guard – only accept ISO-like 'YYYY-MM-DD'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
        return null;
    }
    return candidate;
}
/**
 * Normalize WeeklyNote[] dates coming back from the API.
 */
function normalizeWeeklyNotesDates(notes) {
    if (!Array.isArray(notes))
        return [];
    return notes.map((n) => {
        const normalized = normalizeDateToYmd(n.date);
        return {
            ...n,
            date: normalized ?? n.date ?? '',
        };
    });
}
/**
 * Normalize ServiceWeek.*[].date fields from various date formats
 * to 'YYYY-MM-DD' where possible.
 */
function normalizeServiceWeekDates(week) {
    if (!week)
        return undefined;
    const normalizeEntries = (entries) => {
        if (!Array.isArray(entries))
            return [];
        return entries.map((e) => {
            const normalized = normalizeDateToYmd(e.date);
            return {
                ...e,
                date: normalized ?? e.date ?? null,
            };
        });
    };
    return {
        ...week,
        monday: normalizeEntries(week.monday),
        tuesday: normalizeEntries(week.tuesday),
        wednesday: normalizeEntries(week.wednesday),
        thursday: normalizeEntries(week.thursday),
        friday: normalizeEntries(week.friday),
        saturday: normalizeEntries(week.saturday),
        sunday: normalizeEntries(week.sunday),
    };
}
/**
 * API → UI:
 * Normalize all date-like fields on StaffLog:
 * - serviceDate
 * - header.notes[].date
 * - serviceWeek.*[].date
 *
 * This lets your UI stay stable even if the backend sends
 * '2025-10-01T00:00:00Z', plain '2025-10-01', etc.
 */
function normalizeStaffLogFromApi(log) {
    const header = {
        ...(log.header ?? {}),
    };
    // Normalize header.notes dates
    header.notes = normalizeWeeklyNotesDates(header.notes);
    // Normalize serviceWeek dates
    const normalizedWeek = normalizeServiceWeekDates(log.serviceWeek);
    // Normalize top-level serviceDate
    const serviceDateNormalized = normalizeDateToYmd(log.serviceDate) ?? log.serviceDate;
    return {
        ...log,
        serviceDate: serviceDateNormalized,
        header,
        serviceWeek: normalizedWeek ?? log.serviceWeek,
    };
}
/**
 * UI → API:
 * Build the correct payload (CreateStaffLogDto vs UpdateStaffLogDto)
 * from a raw form value, and normalize all date fields on the way out.
 */
function buildStaffLogSavePayload(args) {
    const { currentLogId, providerId, consumerId, serviceDate, rawForm } = args;
    // ----- HEADER (flex bag with index signature) -----
    const rawHeader = rawForm.header ?? {};
    const normalizedNotes = (rawForm.notes ?? []).map((n) => {
        const normalized = normalizeDateToYmd(n?.date);
        return {
            date: normalized ?? (n?.date ?? ''),
            initials: n?.initials ?? '',
            comment: n?.comment ?? '',
        };
    });
    const header = {
        ...rawHeader,
        socialization: rawForm.socialization ?? [],
        selfHelp: rawForm.selfHelp ?? [],
        adaptive: rawForm.adaptive ?? [],
        implementation: rawForm.implementation ?? [],
        community: rawForm.community ?? [],
        notes: normalizedNotes,
    };
    // Optional: if header has a 'date' field, normalize it
    if (header.date) {
        const normalizedHeaderDate = normalizeDateToYmd(header.date);
        if (normalizedHeaderDate) {
            header.date = normalizedHeaderDate;
        }
    }
    // ----- SERVICE WEEK (rows → ServiceWeek) -----
    const rows = rawForm.serviceWeek ?? [];
    const mapRow = (v) => {
        const normalizedRowDate = normalizeDateToYmd(v?.date);
        return {
            // Core fields
            timeIn: v?.start ?? null,
            timeOut: v?.end ?? null,
            activity: null,
            notes: null,
            // Extended ISS fields
            date: normalizedRowDate ?? (v?.date ?? null),
            providerName: v?.providerName ?? null,
            providerSignature: v?.providerSignature ?? null,
            start: v?.start ?? null,
            end: v?.end ?? null,
            minutes: v?.minutes ?? 0,
            setting: v?.setting ?? 'on_site',
            individualsCount: v?.individualsCount ?? 0,
            staffCount: v?.staffCount ?? 1,
        };
    };
    // Always map 5 weekdays (fallback to empty object if missing row)
    const mon = mapRow(rows[0] ?? {});
    const tue = mapRow(rows[1] ?? {});
    const wed = mapRow(rows[2] ?? {});
    const thu = mapRow(rows[3] ?? {});
    const fri = mapRow(rows[4] ?? {});
    const serviceWeek = {
        monday: [mon],
        tuesday: [tue],
        wednesday: [wed],
        thursday: [thu],
        friday: [fri],
    };
    // Normalize serviceDate going out
    const normalizedServiceDate = normalizeDateToYmd(serviceDate) ?? serviceDate;
    // ----- Decide create vs update -----
    if (currentLogId) {
        const payload = {
            header,
            serviceWeek,
        };
        return { logId: currentLogId, payload };
    }
    const payload = {
        providerId,
        consumerId,
        serviceDate: normalizedServiceDate,
        header,
        serviceWeek,
    };
    return { logId: null, payload };
}


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RaciController = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const raci_service_1 = __webpack_require__(25);
let RaciController = class RaciController {
    constructor(svc) {
        this.svc = svc;
    }
    /**
     * GET /api/v1/raci/allowed-roles?module=programmatic
     * Returns the coarse-grained RACI roles for a given module.
     */
    allowedRoles(module) {
        return this.svc.allowedRoles(module);
    }
    /**
     * GET /api/v1/raci/menu?role=Admin
     * Builds a nav menu for a given fine-grained AppRole by mapping it
     * into a coarse RaciRole bucket.
     */
    async menu(role) {
        const raciRole = this.mapAppRoleToRaciRole(role);
        return this.svc.buildMenuForRole(raciRole);
    }
    /**
     * Map fine-grained AppRole -> coarse RaciRole bucket.
     * Adjust this mapping anytime you add/change AppRole values.
     */
    mapAppRoleToRaciRole(role) {
        switch (role) {
            // 🔑 Top-level owners/admins
            case 'Admin':
            case 'ProgramDirector':
            case 'ComplianceOfficer':
            case 'MedicalDirector':
            case 'FinanceOfficer':
                return 'ADMIN';
            // 👀 Managers / leads
            case 'ISSManager':
            case 'CaseManager':
            case 'BehaviorSupportLead':
            case 'Nurse':
                return 'MANAGER';
            // 🧑‍⚕️ Front-line staff
            case 'DirectCareStaff':
            case 'ISSStaff':
            case 'Finance':
                return 'STAFF';
            // Default to READONLY bucket
            default:
                return 'READONLY';
        }
    }
};
exports.RaciController = RaciController;
tslib_1.__decorate([
    (0, common_1.Get)('allowed-roles'),
    tslib_1.__param(0, (0, common_1.Query)('module')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RaciController.prototype, "allowedRoles", null);
tslib_1.__decorate([
    (0, common_1.Get)('menu'),
    tslib_1.__param(0, (0, common_1.Query)('role')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RaciController.prototype, "menu", null);
exports.RaciController = RaciController = tslib_1.__decorate([
    (0, common_1.Controller)({
        path: 'raci',
        version: '1',
    }),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof raci_service_1.RaciService !== "undefined" && raci_service_1.RaciService) === "function" ? _a : Object])
], RaciController);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestIdMiddleware = void 0;
const tslib_1 = __webpack_require__(1);
// api/src/app/common/middleware/request-id.middleware.ts
const common_1 = __webpack_require__(2);
const node_crypto_1 = __webpack_require__(35);
let RequestIdMiddleware = class RequestIdMiddleware {
    use(req, res, next) {
        const header = req.headers['x-request-id'] ||
            req.headers['x-requestid'];
        const id = header || (0, node_crypto_1.randomUUID)();
        req.id = id;
        res.setHeader('X-Request-Id', id);
        next();
    }
};
exports.RequestIdMiddleware = RequestIdMiddleware;
exports.RequestIdMiddleware = RequestIdMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)()
], RequestIdMiddleware);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssModule = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(10);
const iss_provider_entity_1 = __webpack_require__(37);
const iss_staff_log_entity_1 = __webpack_require__(38);
const iss_service_1 = __webpack_require__(40);
const iss_controller_1 = __webpack_require__(42);
const consumers_module_1 = __webpack_require__(49);
let IssModule = class IssModule {
};
exports.IssModule = IssModule;
exports.IssModule = IssModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([iss_provider_entity_1.IssProvider, iss_staff_log_entity_1.IssStaffLog]),
            consumers_module_1.ConsumersModule, // 👈 this makes ConsumersService visible here
        ],
        providers: [iss_service_1.IssService],
        controllers: [iss_controller_1.IssController],
        exports: [iss_service_1.IssService],
    })
], IssModule);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssProvider = void 0;
const tslib_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(17);
const iss_staff_log_entity_1 = __webpack_require__(38);
const consumer_entity_1 = __webpack_require__(39);
let IssProvider = class IssProvider {
};
exports.IssProvider = IssProvider;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], IssProvider.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    tslib_1.__metadata("design:type", String)
], IssProvider.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'license_number', length: 50 }),
    tslib_1.__metadata("design:type", String)
], IssProvider.prototype, "licenseNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => consumer_entity_1.Consumer, (consumer) => consumer.issProvider),
    tslib_1.__metadata("design:type", Array)
], IssProvider.prototype, "consumers", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => iss_staff_log_entity_1.IssStaffLog, (log) => log.issProvider),
    tslib_1.__metadata("design:type", Array)
], IssProvider.prototype, "staffLogs", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], IssProvider.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], IssProvider.prototype, "updatedAt", void 0);
exports.IssProvider = IssProvider = tslib_1.__decorate([
    (0, typeorm_1.Entity)('iss_provider')
], IssProvider);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssStaffLog = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const typeorm_1 = __webpack_require__(17);
const iss_provider_entity_1 = __webpack_require__(37);
const consumer_entity_1 = __webpack_require__(39);
let IssStaffLog = class IssStaffLog {
};
exports.IssStaffLog = IssStaffLog;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], IssStaffLog.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => consumer_entity_1.Consumer, (consumer) => consumer.staffLogs, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'consumer_id' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof consumer_entity_1.Consumer !== "undefined" && consumer_entity_1.Consumer) === "function" ? _a : Object)
], IssStaffLog.prototype, "consumer", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => iss_provider_entity_1.IssProvider, (provider) => provider.staffLogs, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'iss_provider_id' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof iss_provider_entity_1.IssProvider !== "undefined" && iss_provider_entity_1.IssProvider) === "function" ? _b : Object)
], IssStaffLog.prototype, "issProvider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'service_date', type: 'date' }),
    tslib_1.__metadata("design:type", String)
], IssStaffLog.prototype, "serviceDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'header', type: 'jsonb' }),
    tslib_1.__metadata("design:type", Object)
], IssStaffLog.prototype, "header", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'service_week', type: 'jsonb' }),
    tslib_1.__metadata("design:type", Object)
], IssStaffLog.prototype, "serviceWeek", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'weekly_sections', type: 'jsonb' }),
    tslib_1.__metadata("design:type", Object)
], IssStaffLog.prototype, "weeklySections", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'jsonb' }),
    tslib_1.__metadata("design:type", Object)
], IssStaffLog.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], IssStaffLog.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    tslib_1.__metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], IssStaffLog.prototype, "updatedAt", void 0);
exports.IssStaffLog = IssStaffLog = tslib_1.__decorate([
    (0, typeorm_1.Entity)('iss_staff_log')
], IssStaffLog);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Consumer = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const typeorm_1 = __webpack_require__(17);
const iss_provider_entity_1 = __webpack_require__(37);
const iss_staff_log_entity_1 = __webpack_require__(38);
let Consumer = class Consumer {
};
exports.Consumer = Consumer;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Consumer.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', length: 100 }),
    tslib_1.__metadata("design:type", String)
], Consumer.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', length: 100 }),
    tslib_1.__metadata("design:type", String)
], Consumer.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date', nullable: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Consumer.prototype, "dateOfBirth", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'medicaid_number', length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Consumer.prototype, "medicaidNumber", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'level_of_need', length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Consumer.prototype, "levelOfNeed", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'place_of_service', length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Consumer.prototype, "placeOfService", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => iss_provider_entity_1.IssProvider, (provider) => provider.consumers, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'iss_provider_id' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof iss_provider_entity_1.IssProvider !== "undefined" && iss_provider_entity_1.IssProvider) === "function" ? _b : Object)
], Consumer.prototype, "issProvider", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => iss_staff_log_entity_1.IssStaffLog, (log) => log.consumer),
    tslib_1.__metadata("design:type", Array)
], Consumer.prototype, "staffLogs", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Consumer.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    tslib_1.__metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Consumer.prototype, "updatedAt", void 0);
exports.Consumer = Consumer = tslib_1.__decorate([
    (0, typeorm_1.Entity)('consumer')
], Consumer);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssService = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(10);
const typeorm_2 = __webpack_require__(17);
const iss_provider_entity_1 = __webpack_require__(37);
const iss_staff_log_entity_1 = __webpack_require__(38);
const consumers_service_1 = __webpack_require__(41);
let IssService = class IssService {
    constructor(providerRepo, staffLogRepo, consumersService) {
        this.providerRepo = providerRepo;
        this.staffLogRepo = staffLogRepo;
        this.consumersService = consumersService;
    }
    /* =========================
     * PROVIDERS - CRUD
     * ========================= */
    async createProvider(dto) {
        const provider = this.providerRepo.create({
            name: dto.name,
            licenseNumber: dto.licenseNumber,
        });
        return this.providerRepo.save(provider);
    }
    async findAllProviders() {
        return this.providerRepo.find({
            order: { name: 'ASC' },
        });
    }
    async findProviderById(id) {
        const provider = await this.providerRepo.findOne({ where: { id } });
        if (!provider) {
            throw new common_1.NotFoundException(`ISS provider ${id} not found`);
        }
        return provider;
    }
    async updateProvider(id, dto) {
        const provider = await this.findProviderById(id);
        const merged = this.providerRepo.merge(provider, dto);
        return this.providerRepo.save(merged);
    }
    async removeProvider(id) {
        const provider = await this.findProviderById(id);
        await this.providerRepo.remove(provider);
    }
    /* =========================
     * CONSUMERS - delegated to ConsumersService
     * ========================= */
    async createConsumer(dto) {
        // mirrors POST /v1/iss/consumers in IssController
        return this.consumersService.create(dto);
    }
    async findConsumersByProvider(issProviderId) {
        // mirrors GET /v1/iss/consumers?issProviderId=...
        return this.consumersService.findByProvider(issProviderId);
    }
    /* =========================
     * STAFF LOGS (8615) - CREATE
     * ========================= */
    async createStaffLog(dto) {
        const consumer = await this.consumersService.findOne(dto.consumerId);
        if (!consumer.issProvider) {
            throw new common_1.NotFoundException(`Consumer ${dto.consumerId} has no associated ISS provider`);
        }
        // Strip DTO-only field
        const { consumerId, ...rest } = dto;
        const log = this.staffLogRepo.create({
            ...rest, // header, serviceWeek, weeklySections, notes, serviceDate
            consumer,
            issProvider: consumer.issProvider,
        });
        return this.staffLogRepo.save(log);
    }
    /* =========================
     * STAFF LOGS (8615) - READ / LIST
     * ========================= */
    async findStaffLogById(id) {
        const log = await this.staffLogRepo.findOne({
            where: { id },
            relations: ['consumer', 'issProvider'],
        });
        if (!log) {
            throw new common_1.NotFoundException(`ISS staff log ${id} not found`);
        }
        return log;
    }
    async findStaffLogsForConsumer(consumerId) {
        return this.staffLogRepo.find({
            where: { consumer: { id: consumerId } },
            relations: ['consumer', 'issProvider'],
            order: {
                serviceDate: 'DESC',
                createdAt: 'DESC',
            },
        });
    }
    /* =========================
     * STAFF LOGS (8615) - UPDATE
     * ========================= */
    async updateStaffLog(id, dto) {
        const existing = await this.findStaffLogById(id);
        const { consumerId, ...rest } = dto;
        const merged = this.staffLogRepo.merge(existing, rest);
        return this.staffLogRepo.save(merged);
    }
    /* =========================
     * STAFF LOGS (8615) - DELETE
     * ========================= */
    async removeStaffLog(id) {
        const existing = await this.findStaffLogById(id);
        await this.staffLogRepo.remove(existing);
    }
    /* =========================
     * CONSUMER + LATEST LOG
     * ========================= */
    async getConsumerWithLatestLog(consumerId) {
        const consumer = await this.consumersService.findOne(consumerId);
        const latestLog = await this.staffLogRepo.findOne({
            where: { consumer: { id: consumerId } },
            relations: ['consumer', 'issProvider'],
            order: {
                serviceDate: 'DESC',
                createdAt: 'DESC',
            },
        });
        return { consumer, latestLog };
    }
    /* =========================
     * LATEST OR DEFAULT TEMPLATE BY DATE
     * ========================= */
    async getLogForConsumerAndDate(consumerId, dateIso) {
        const consumer = await this.consumersService.findOne(consumerId);
        const targetDate = dateIso ?? new Date().toISOString().slice(0, 10);
        const log = await this.staffLogRepo.findOne({
            where: {
                consumer: { id: consumerId },
                serviceDate: targetDate,
            },
            relations: ['consumer', 'issProvider'],
        });
        if (log) {
            return { consumer, log };
        }
        const fullName = `${consumer.firstName} ${consumer.lastName}`;
        const provider = consumer.issProvider;
        const lonValue = consumer.levelOfNeed ??
            consumer.level_of_need ??
            '';
        const defaultTemplate = {
            serviceDate: targetDate,
            header: {
                individualName: fullName,
                date: targetDate,
                lon: lonValue,
                provider: provider?.name ?? '',
                license: provider?.licenseNumber ?? '',
                staffNameTitle: 'ISS Direct Care Staff',
            },
            serviceWeek: [],
            weeklySections: {},
            notes: [],
        };
        return { consumer, log: null, defaultTemplate };
    }
    /* =========================
     * LIST WEEKS FOR CONSUMER (1–N, paginated)
     * ========================= */
    async listWeeksForConsumer(consumerId, page = 1, limit = 52) {
        const take = Math.min(Math.max(limit, 1), 52);
        const safePage = Math.max(page, 1);
        const skip = (safePage - 1) * take;
        const [logs, total] = await this.staffLogRepo.findAndCount({
            where: { consumer: { id: consumerId } },
            order: { serviceDate: 'ASC' },
            select: ['id', 'serviceDate'],
            skip,
            take,
        });
        const data = logs.map((log, index) => {
            const rawDate = log.serviceDate;
            const asDate = rawDate instanceof Date ? rawDate : new Date(rawDate);
            return {
                weekNumber: skip + index + 1,
                serviceDate: asDate.toISOString().slice(0, 10),
                staffLogId: log.id,
            };
        });
        return {
            data,
            meta: {
                total,
                page: safePage,
                limit: take,
                pageCount: Math.ceil(total / take) || 1,
            },
        };
    }
};
exports.IssService = IssService;
exports.IssService = IssService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(iss_provider_entity_1.IssProvider)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(iss_staff_log_entity_1.IssStaffLog)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof consumers_service_1.ConsumersService !== "undefined" && consumers_service_1.ConsumersService) === "function" ? _c : Object])
], IssService);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsumersService = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(10);
const typeorm_2 = __webpack_require__(17);
const consumer_entity_1 = __webpack_require__(39);
const iss_provider_entity_1 = __webpack_require__(37);
let ConsumersService = class ConsumersService {
    constructor(consumerRepo, providerRepo) {
        this.consumerRepo = consumerRepo;
        this.providerRepo = providerRepo;
    }
    /* =========================
     * CREATE
     * ========================= */
    async create(dto) {
        const provider = await this.providerRepo.findOne({
            where: { id: dto.issProviderId },
        });
        if (!provider) {
            throw new common_1.NotFoundException(`ISS provider with id ${dto.issProviderId} not found`);
        }
        const { issProviderId, ...rest } = dto;
        const consumer = this.consumerRepo.create({
            ...rest,
            issProvider: provider,
        });
        return this.consumerRepo.save(consumer);
    }
    /* =========================
     * READ
     * ========================= */
    async findAll() {
        return this.consumerRepo.find({
            relations: ['issProvider'],
            order: {
                lastName: 'ASC',
                firstName: 'ASC',
            },
        });
    }
    async findByProvider(issProviderId) {
        return this.consumerRepo.find({
            where: { issProvider: { id: issProviderId } },
            relations: ['issProvider'],
            order: {
                lastName: 'ASC',
                firstName: 'ASC',
            },
        });
    }
    async findOne(id) {
        const consumer = await this.consumerRepo.findOne({
            where: { id },
            relations: ['issProvider'],
        });
        if (!consumer) {
            throw new common_1.NotFoundException(`Consumer ${id} not found`);
        }
        return consumer;
    }
    /* =========================
     * UPDATE
     * ========================= */
    async update(id, dto) {
        const consumer = await this.consumerRepo.findOne({
            where: { id },
            relations: ['issProvider'],
        });
        if (!consumer) {
            throw new common_1.NotFoundException(`Consumer ${id} not found`);
        }
        // If ISS provider is being changed
        if (dto.issProviderId !== undefined) {
            const provider = await this.providerRepo.findOne({
                where: { id: dto.issProviderId },
            });
            if (!provider) {
                throw new common_1.NotFoundException(`ISS provider with id ${dto.issProviderId} not found`);
            }
            consumer.issProvider = provider;
            delete dto.issProviderId;
        }
        Object.assign(consumer, dto);
        return this.consumerRepo.save(consumer);
    }
};
exports.ConsumersService = ConsumersService;
exports.ConsumersService = ConsumersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(consumer_entity_1.Consumer)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(iss_provider_entity_1.IssProvider)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], ConsumersService);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssController = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const iss_service_1 = __webpack_require__(40);
const create_iss_provider_dto_1 = __webpack_require__(43);
const create_iss_staff_log_dto_1 = __webpack_require__(45);
const update_iss_staff_log_dto_1 = __webpack_require__(46);
const create_consumer_dto_1 = __webpack_require__(48);
let IssController = class IssController {
    constructor(svc) {
        this.svc = svc;
    }
    /* =========================
     * PROVIDERS
     * ========================= */
    createProvider(dto) {
        return this.svc.createProvider(dto);
    }
    listProviders() {
        return this.svc.findAllProviders();
    }
    /* =========================
     * CONSUMERS
     * ========================= */
    createConsumer(dto) {
        return this.svc.createConsumer(dto);
    }
    listConsumers(issProviderId) {
        return this.svc.findConsumersByProvider(issProviderId);
    }
    /* =========================
     * STAFF LOGS (8615)
     * ========================= */
    createStaffLog(dto) {
        return this.svc.createStaffLog(dto);
    }
    listStaffLogs(consumerId) {
        return this.svc.findStaffLogsForConsumer(consumerId);
    }
    // 🔄 Update existing staff log
    updateStaffLog(id, dto) {
        return this.svc.updateStaffLog(id, dto);
    }
    /* =========================
     * CONSUMER + LATEST / BY DATE
     * ========================= */
    // Most recent log (legacy endpoint, still useful)
    getConsumerWithLatestLog(id) {
        return this.svc.getConsumerWithLatestLog(id);
    }
    // ✅ Latest-or-template for a specific date
    // GET /api/v1/iss/consumer/1/log?date=2025-10-06
    getConsumerLogForDate(id, date) {
        return this.svc.getLogForConsumerAndDate(id, date);
    }
    /* =========================
     * LIST WEEKS FOR CONSUMER
     * ========================= */
    // GET /api/v1/iss/consumer/1/weeks?page=1&limit=52
    listWeeksForConsumer(id, pageRaw, limitRaw) {
        const page = pageRaw ? parseInt(pageRaw, 10) || 1 : 1;
        const limit = limitRaw ? parseInt(limitRaw, 10) || 52 : 52;
        return this.svc.listWeeksForConsumer(id, page, limit);
    }
};
exports.IssController = IssController;
tslib_1.__decorate([
    (0, common_1.Post)('providers'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_iss_provider_dto_1.CreateIssProviderDto !== "undefined" && create_iss_provider_dto_1.CreateIssProviderDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IssController.prototype, "createProvider", null);
tslib_1.__decorate([
    (0, common_1.Get)('providers'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], IssController.prototype, "listProviders", null);
tslib_1.__decorate([
    (0, common_1.Post)('consumers'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof create_consumer_dto_1.CreateConsumerDto !== "undefined" && create_consumer_dto_1.CreateConsumerDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IssController.prototype, "createConsumer", null);
tslib_1.__decorate([
    (0, common_1.Get)('consumers'),
    tslib_1.__param(0, (0, common_1.Query)('issProviderId', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", void 0)
], IssController.prototype, "listConsumers", null);
tslib_1.__decorate([
    (0, common_1.Post)('staff-logs'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof create_iss_staff_log_dto_1.CreateIssStaffLogDto !== "undefined" && create_iss_staff_log_dto_1.CreateIssStaffLogDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], IssController.prototype, "createStaffLog", null);
tslib_1.__decorate([
    (0, common_1.Get)('staff-logs/:consumerId'),
    tslib_1.__param(0, (0, common_1.Param)('consumerId', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], IssController.prototype, "listStaffLogs", null);
tslib_1.__decorate([
    (0, common_1.Patch)('staff-logs/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, typeof (_g = typeof update_iss_staff_log_dto_1.UpdateIssStaffLogDto !== "undefined" && update_iss_staff_log_dto_1.UpdateIssStaffLogDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], IssController.prototype, "updateStaffLog", null);
tslib_1.__decorate([
    (0, common_1.Get)('consumer/:id/latest-log'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], IssController.prototype, "getConsumerWithLatestLog", null);
tslib_1.__decorate([
    (0, common_1.Get)('consumer/:id/log'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('date')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], IssController.prototype, "getConsumerLogForDate", null);
tslib_1.__decorate([
    (0, common_1.Get)('consumer/:id/weeks'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Query)('page')),
    tslib_1.__param(2, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], IssController.prototype, "listWeeksForConsumer", null);
exports.IssController = IssController = tslib_1.__decorate([
    (0, common_1.Controller)({
        path: 'iss',
        version: '1',
    }),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof iss_service_1.IssService !== "undefined" && iss_service_1.IssService) === "function" ? _a : Object])
], IssController);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateIssProviderDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(44);
class CreateIssProviderDto {
}
exports.CreateIssProviderDto = CreateIssProviderDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateIssProviderDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateIssProviderDto.prototype, "licenseNumber", void 0);


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateIssStaffLogDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(44);
class CreateIssStaffLogDto {
}
exports.CreateIssStaffLogDto = CreateIssStaffLogDto;
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    tslib_1.__metadata("design:type", Number)
], CreateIssStaffLogDto.prototype, "consumerId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateIssStaffLogDto.prototype, "serviceDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], CreateIssStaffLogDto.prototype, "header", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object)
], CreateIssStaffLogDto.prototype, "serviceWeek", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", typeof (_c = typeof Record !== "undefined" && Record) === "function" ? _c : Object)
], CreateIssStaffLogDto.prototype, "weeklySections", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", typeof (_d = typeof Array !== "undefined" && Array) === "function" ? _d : Object)
], CreateIssStaffLogDto.prototype, "notes", void 0);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateIssStaffLogDto = void 0;
const mapped_types_1 = __webpack_require__(47);
const create_iss_staff_log_dto_1 = __webpack_require__(45);
class UpdateIssStaffLogDto extends (0, mapped_types_1.PartialType)(create_iss_staff_log_dto_1.CreateIssStaffLogDto) {
}
exports.UpdateIssStaffLogDto = UpdateIssStaffLogDto;


/***/ }),
/* 47 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConsumerDto = void 0;
const tslib_1 = __webpack_require__(1);
const class_validator_1 = __webpack_require__(44);
class CreateConsumerDto {
}
exports.CreateConsumerDto = CreateConsumerDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    tslib_1.__metadata("design:type", String)
], CreateConsumerDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    tslib_1.__metadata("design:type", String)
], CreateConsumerDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateConsumerDto.prototype, "dateOfBirth", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    tslib_1.__metadata("design:type", String)
], CreateConsumerDto.prototype, "medicaidNumber", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    tslib_1.__metadata("design:type", String)
], CreateConsumerDto.prototype, "levelOfNeed", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    tslib_1.__metadata("design:type", String)
], CreateConsumerDto.prototype, "placeOfService", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    tslib_1.__metadata("design:type", Number)
], CreateConsumerDto.prototype, "issProviderId", void 0);


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsumersModule = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(10);
const consumer_entity_1 = __webpack_require__(39);
const consumers_service_1 = __webpack_require__(41);
const consumers_controller_1 = __webpack_require__(50);
const iss_provider_entity_1 = __webpack_require__(37); // 👈 adjust path if needed
let ConsumersModule = class ConsumersModule {
};
exports.ConsumersModule = ConsumersModule;
exports.ConsumersModule = ConsumersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            // 👇 Register both repositories used in ConsumersService
            typeorm_1.TypeOrmModule.forFeature([consumer_entity_1.Consumer, iss_provider_entity_1.IssProvider]),
        ],
        providers: [consumers_service_1.ConsumersService],
        controllers: [consumers_controller_1.ConsumersController],
        exports: [consumers_service_1.ConsumersService], // so IssModule can inject it
    })
], ConsumersModule);


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsumersController = void 0;
const tslib_1 = __webpack_require__(1);
/* eslint-disable @nx/enforce-module-boundaries */
const common_1 = __webpack_require__(2);
const consumers_service_1 = __webpack_require__(41);
const create_consumer_dto_1 = __webpack_require__(48);
const update_consumer_dto_1 = __webpack_require__(51);
let ConsumersController = class ConsumersController {
    constructor(consumersService) {
        this.consumersService = consumersService;
    }
    /**
     * POST /api/v1/consumers
     * Create a new consumer associated to an ISS provider.
     */
    create(dto) {
        return this.consumersService.create(dto);
    }
    /**
     * GET /api/v1/consumers
     * Optional: ?issProviderId=1 to filter by provider.
     */
    findAll(issProviderId) {
        if (issProviderId) {
            return this.consumersService.findByProvider(Number(issProviderId));
        }
        return this.consumersService.findAll();
    }
    /**
     * GET /api/v1/consumers/:id
     * Fetch a single consumer by id.
     */
    findOne(id) {
        return this.consumersService.findOne(id);
    }
    /**
     * PATCH /api/v1/consumers/:id
     * Update consumer demographics / metadata.
     */
    update(id, dto) {
        return this.consumersService.update(id, dto);
    }
};
exports.ConsumersController = ConsumersController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_consumer_dto_1.CreateConsumerDto !== "undefined" && create_consumer_dto_1.CreateConsumerDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ConsumersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('issProviderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ConsumersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ConsumersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, typeof (_f = typeof update_consumer_dto_1.UpdateConsumerDto !== "undefined" && update_consumer_dto_1.UpdateConsumerDto) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ConsumersController.prototype, "update", null);
exports.ConsumersController = ConsumersController = tslib_1.__decorate([
    (0, common_1.Controller)({
        path: 'consumers',
        version: '1',
    }),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof consumers_service_1.ConsumersService !== "undefined" && consumers_service_1.ConsumersService) === "function" ? _a : Object])
], ConsumersController);


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateConsumerDto = void 0;
const mapped_types_1 = __webpack_require__(47);
const create_consumer_dto_1 = __webpack_require__(48);
class UpdateConsumerDto extends (0, mapped_types_1.PartialType)(create_consumer_dto_1.CreateConsumerDto) {
}
exports.UpdateConsumerDto = UpdateConsumerDto;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
// api/src/main.ts
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const helmet_1 = tslib_1.__importDefault(__webpack_require__(5));
const compression_1 = tslib_1.__importDefault(__webpack_require__(6));
const cookie_parser_1 = tslib_1.__importDefault(__webpack_require__(7));
const app_module_1 = __webpack_require__(8);
function parseOrigins(csv) {
    return (csv ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            bufferLogs: true,
        });
        app.set('trust proxy', 1);
        const globalPrefix = process.env.API_PREFIX || 'api';
        app.setGlobalPrefix(globalPrefix);
        app.enableVersioning({ type: common_1.VersioningType.URI, defaultVersion: '1' });
        app.use((0, helmet_1.default)());
        app.use((0, compression_1.default)());
        app.use((0, cookie_parser_1.default)());
        const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
        app.enableCors({
            origin: allowedOrigins.length ? allowedOrigins : false,
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        const reflector = app.get(core_1.Reflector);
        app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector));
        const enableSwagger = process.env.ENABLE_SWAGGER === 'true' ||
            process.env.NODE_ENV !== 'production';
        if (enableSwagger) {
            const config = new swagger_1.DocumentBuilder()
                .setTitle('API')
                .setDescription('API documentation')
                .setVersion('1.0')
                .addBearerAuth()
                .addServer(`/${globalPrefix}`)
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            swagger_1.SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
        }
        app.enableShutdownHooks();
        const port = Number(process.env.PORT ?? 3000);
        await app.listen(port, '0.0.0.0');
        common_1.Logger.log(`🚀 App:  http://localhost:${port}/${globalPrefix}`);
        if (enableSwagger) {
            common_1.Logger.log(`📘 Docs: http://localhost:${port}/${globalPrefix}/docs`);
        }
    }
    catch (err) {
        // 🔥 THIS WILL SHOW YOU WHY IT'S CRASHING
        common_1.Logger.error('❌ Nest failed to start', err);
        // Make sure the process exits non-zero
        process.exit(1);
    }
}
bootstrap();

})();

/******/ })()
;