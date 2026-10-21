const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// The analytics module is pure; compile it in memory without adding a test runtime.
const compiled = ts.transpileModule(fs.readFileSync('lib/admin-analytics.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const analyticsModule = { exports: {} };
new Function('exports', 'require', 'module', compiled)(analyticsModule.exports, require, analyticsModule);
const { buildAdminAnalytics } = analyticsModule.exports;
const now = new Date(2026, 9, 21, 12);
const cleaning = (id, amount, status, date, paid = false) => ({
  id, invoiceNumber: id, serviceName: 'Cleaning', priceBreakdown: { total: amount },
  status, createdAt: date, paymentStatus: paid ? 'paid' : 'unpaid',
});

test('excludes cancelled orders from GMV and receipts, but keeps them in composition', () => {
  const result = buildAdminAnalytics([
    cleaning('a', 100, 'completed', now, true),
    cleaning('b', 200, 'assigned', now),
    cleaning('c', 500, 'cancelled', now, true),
  ], [], 'all', now);
  assert.equal(result.gmv, 300);
  assert.equal(result.paid, 100);
  assert.equal(result.rows.length, 3);
  assert.equal(result.composition[0].value, 3);
  assert.equal(result.statusCounts.reduce((sum, s) => sum + s.value, 0), 3);
});

test('7-day period includes its first day, excludes old and future orders, fills zero days', () => {
  const result = buildAdminAnalytics([
    cleaning('first', 10, 'completed', new Date(2026, 9, 15)),
    cleaning('old', 20, 'completed', new Date(2026, 9, 14, 23, 59)),
    cleaning('today', 30, 'completed', now),
    cleaning('future', 40, 'completed', new Date(2026, 9, 22)),
  ], [], '7', now);
  assert.equal(result.rows.length, 2);
  assert.equal(result.gmv, 40);
  assert.equal(result.trend.length, 7);
  assert.equal(result.trend[0].cleaning, 10);
});

test('empty dataset returns zero values and all products aggregate separately', () => {
  assert.equal(buildAdminAnalytics([], [], '30', now).trend.length, 30);
  const result = buildAdminAnalytics([], [{ id: 'p', invoiceNumber: 'p', items: [{ productName: 'Nails' }], total: 90, status: 'paid', paymentStatus: 'paid', createdAt: now }], 'all', now);
  assert.equal(result.gmv, 90);
  assert.equal(result.trend.at(-1).products, 90);
  assert.equal(result.trend.at(-1).cleaning, 0);
  assert.equal(result.composition[1].value, 1);
});
