"use strict";
// libs/shared-models/src/lib/iss/iss.mappers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStaffLogFromApi = normalizeStaffLogFromApi;
/**
 * Normalize a date-like string to `YYYY-MM-DD`, or return null if falsy.
 * Works with:
 * - '2025-10-01'
 * - '2025-10-01T00:00:00.000Z'
 */
function normalizeDateOnly(value) {
    if (!value)
        return null;
    try {
        // new Date(...) works for both 'YYYY-MM-DD' and full ISO strings.
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) {
            return value; // fallback: leave as-is if parsing fails
        }
        return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    }
    catch (_a) {
        return value;
    }
}
/**
 * Normalize header fields that contain dates:
 * - header.date
 * - header.notes[].date
 */
function normalizeHeaderDates(header) {
    var _a;
    if (!header)
        return {};
    const normalized = Object.assign({}, header);
    // Normalize header.date if present
    if (header.date) {
        normalized.date = (_a = normalizeDateOnly(header.date)) !== null && _a !== void 0 ? _a : header.date;
    }
    // Normalize header.notes[].date if present
    if (Array.isArray(header.notes)) {
        const notes = header.notes;
        normalized.notes = notes.map((n) => {
            var _a;
            return (Object.assign(Object.assign({}, n), { date: (_a = normalizeDateOnly(n.date)) !== null && _a !== void 0 ? _a : n.date }));
        });
    }
    return normalized;
}
/**
 * Normalize ServiceWeek day entries that contain dates:
 * - serviceWeek.monday[i].date, tuesday[i].date, etc.
 */
function normalizeServiceWeekDates(serviceWeek) {
    if (!serviceWeek) {
        return {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
        };
    }
    const normalizeEntries = (entries) => (entries !== null && entries !== void 0 ? entries : []).map((e) => {
        var _a;
        return (Object.assign(Object.assign({}, e), { date: (_a = normalizeDateOnly(e.date)) !== null && _a !== void 0 ? _a : e.date }));
    });
    return Object.assign(Object.assign({}, serviceWeek), { monday: normalizeEntries(serviceWeek.monday), tuesday: normalizeEntries(serviceWeek.tuesday), wednesday: normalizeEntries(serviceWeek.wednesday), thursday: normalizeEntries(serviceWeek.thursday), friday: normalizeEntries(serviceWeek.friday), 
        // keep weekend if present
        saturday: serviceWeek.saturday
            ? normalizeEntries(serviceWeek.saturday)
            : serviceWeek.saturday, sunday: serviceWeek.sunday
            ? normalizeEntries(serviceWeek.sunday)
            : serviceWeek.sunday });
}
/**
 * Main entry point: normalize a StaffLog coming back from the API so:
 * - serviceDate is `YYYY-MM-DD`
 * - header.date is `YYYY-MM-DD` (if present)
 * - header.notes[].date are `YYYY-MM-DD`
 * - serviceWeek.*[].date are `YYYY-MM-DD`
 *
 * Everything else is left as-is.
 */
function normalizeStaffLogFromApi(log) {
    var _a;
    if (!log)
        return log;
    const normalizedServiceDate = (_a = normalizeDateOnly(log.serviceDate)) !== null && _a !== void 0 ? _a : log.serviceDate;
    return Object.assign(Object.assign({}, log), { serviceDate: normalizedServiceDate, header: normalizeHeaderDates(log.header), serviceWeek: normalizeServiceWeekDates(log.serviceWeek) });
}
//# sourceMappingURL=iss.mappers.js.map