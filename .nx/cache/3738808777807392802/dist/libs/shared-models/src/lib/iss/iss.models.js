"use strict";
// libs/shared-models/src/lib/iss/iss.models.ts
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _a;
        const normalized = normalizeDateToYmd(n.date);
        return Object.assign(Object.assign({}, n), { date: (_a = normalized !== null && normalized !== void 0 ? normalized : n.date) !== null && _a !== void 0 ? _a : '' });
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
            var _a;
            const normalized = normalizeDateToYmd(e.date);
            return Object.assign(Object.assign({}, e), { date: (_a = normalized !== null && normalized !== void 0 ? normalized : e.date) !== null && _a !== void 0 ? _a : null });
        });
    };
    return Object.assign(Object.assign({}, week), { monday: normalizeEntries(week.monday), tuesday: normalizeEntries(week.tuesday), wednesday: normalizeEntries(week.wednesday), thursday: normalizeEntries(week.thursday), friday: normalizeEntries(week.friday), saturday: normalizeEntries(week.saturday), sunday: normalizeEntries(week.sunday) });
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
    var _a, _b;
    const header = Object.assign({}, ((_a = log.header) !== null && _a !== void 0 ? _a : {}));
    // Normalize header.notes dates
    header.notes = normalizeWeeklyNotesDates(header.notes);
    // Normalize serviceWeek dates
    const normalizedWeek = normalizeServiceWeekDates(log.serviceWeek);
    // Normalize top-level serviceDate
    const serviceDateNormalized = (_b = normalizeDateToYmd(log.serviceDate)) !== null && _b !== void 0 ? _b : log.serviceDate;
    return Object.assign(Object.assign({}, log), { serviceDate: serviceDateNormalized, header, serviceWeek: normalizedWeek !== null && normalizedWeek !== void 0 ? normalizedWeek : log.serviceWeek });
}
/**
 * UI → API:
 * Build the correct payload (CreateStaffLogDto vs UpdateStaffLogDto)
 * from a raw form value, and normalize all date fields on the way out.
 */
function buildStaffLogSavePayload(args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const { currentLogId, providerId, consumerId, serviceDate, rawForm } = args;
    // ----- HEADER (flex bag with index signature) -----
    const rawHeader = (_a = rawForm.header) !== null && _a !== void 0 ? _a : {};
    const normalizedNotes = ((_b = rawForm.notes) !== null && _b !== void 0 ? _b : []).map((n) => {
        var _a, _b, _c;
        const normalized = normalizeDateToYmd(n === null || n === void 0 ? void 0 : n.date);
        return {
            date: normalized !== null && normalized !== void 0 ? normalized : ((_a = n === null || n === void 0 ? void 0 : n.date) !== null && _a !== void 0 ? _a : ''),
            initials: (_b = n === null || n === void 0 ? void 0 : n.initials) !== null && _b !== void 0 ? _b : '',
            comment: (_c = n === null || n === void 0 ? void 0 : n.comment) !== null && _c !== void 0 ? _c : '',
        };
    });
    const header = Object.assign(Object.assign({}, rawHeader), { socialization: (_c = rawForm.socialization) !== null && _c !== void 0 ? _c : [], selfHelp: (_d = rawForm.selfHelp) !== null && _d !== void 0 ? _d : [], adaptive: (_e = rawForm.adaptive) !== null && _e !== void 0 ? _e : [], implementation: (_f = rawForm.implementation) !== null && _f !== void 0 ? _f : [], community: (_g = rawForm.community) !== null && _g !== void 0 ? _g : [], notes: normalizedNotes });
    // Optional: if header has a 'date' field, normalize it
    if (header.date) {
        const normalizedHeaderDate = normalizeDateToYmd(header.date);
        if (normalizedHeaderDate) {
            header.date = normalizedHeaderDate;
        }
    }
    // ----- SERVICE WEEK (rows → ServiceWeek) -----
    const rows = (_h = rawForm.serviceWeek) !== null && _h !== void 0 ? _h : [];
    const mapRow = (v) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const normalizedRowDate = normalizeDateToYmd(v === null || v === void 0 ? void 0 : v.date);
        return {
            // Core fields
            timeIn: (_a = v === null || v === void 0 ? void 0 : v.start) !== null && _a !== void 0 ? _a : null,
            timeOut: (_b = v === null || v === void 0 ? void 0 : v.end) !== null && _b !== void 0 ? _b : null,
            activity: null,
            notes: null,
            // Extended ISS fields
            date: normalizedRowDate !== null && normalizedRowDate !== void 0 ? normalizedRowDate : ((_c = v === null || v === void 0 ? void 0 : v.date) !== null && _c !== void 0 ? _c : null),
            providerName: (_d = v === null || v === void 0 ? void 0 : v.providerName) !== null && _d !== void 0 ? _d : null,
            providerSignature: (_e = v === null || v === void 0 ? void 0 : v.providerSignature) !== null && _e !== void 0 ? _e : null,
            start: (_f = v === null || v === void 0 ? void 0 : v.start) !== null && _f !== void 0 ? _f : null,
            end: (_g = v === null || v === void 0 ? void 0 : v.end) !== null && _g !== void 0 ? _g : null,
            minutes: (_h = v === null || v === void 0 ? void 0 : v.minutes) !== null && _h !== void 0 ? _h : 0,
            setting: (_j = v === null || v === void 0 ? void 0 : v.setting) !== null && _j !== void 0 ? _j : 'on_site',
            individualsCount: (_k = v === null || v === void 0 ? void 0 : v.individualsCount) !== null && _k !== void 0 ? _k : 0,
            staffCount: (_l = v === null || v === void 0 ? void 0 : v.staffCount) !== null && _l !== void 0 ? _l : 1,
        };
    };
    // Always map 5 weekdays (fallback to empty object if missing row)
    const mon = mapRow((_j = rows[0]) !== null && _j !== void 0 ? _j : {});
    const tue = mapRow((_k = rows[1]) !== null && _k !== void 0 ? _k : {});
    const wed = mapRow((_l = rows[2]) !== null && _l !== void 0 ? _l : {});
    const thu = mapRow((_m = rows[3]) !== null && _m !== void 0 ? _m : {});
    const fri = mapRow((_o = rows[4]) !== null && _o !== void 0 ? _o : {});
    const serviceWeek = {
        monday: [mon],
        tuesday: [tue],
        wednesday: [wed],
        thursday: [thu],
        friday: [fri],
    };
    // Normalize serviceDate going out
    const normalizedServiceDate = (_p = normalizeDateToYmd(serviceDate)) !== null && _p !== void 0 ? _p : serviceDate;
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
//# sourceMappingURL=iss.models.js.map