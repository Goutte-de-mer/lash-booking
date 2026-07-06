import { getEndTime, formatTime, formatDay, formatMonth } from "../../src/lib/booking.js";

describe("getEndTime", () => {
  test("ajoute la durée au slotStart", () => {
    const start = new Date("2026-07-06T10:00:00.000Z");
    const booking = { slotStart: start, duration: 60 };
    const end = getEndTime(booking);
    expect(end.getTime() - start.getTime()).toBe(60 * 60 * 1000);
  });

  test("fonctionne avec 45 minutes", () => {
    const start = new Date("2026-07-06T10:00:00.000Z");
    const booking = { slotStart: start, duration: 45 };
    const end = getEndTime(booking);
    expect(end.getTime() - start.getTime()).toBe(45 * 60 * 1000);
  });
});

describe("formatTime", () => {
  test("retourne une chaîne au format HH:MM", () => {
    const date = new Date("2026-07-06T10:30:00.000Z");
    expect(formatTime(date)).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("formatDay", () => {
  test("retourne le numéro du jour en chaîne", () => {
    const date = new Date("2026-07-15T10:00:00.000Z");
    expect(formatDay(date)).toMatch(/^\d+$/);
  });
});

describe("formatMonth", () => {
  test("retourne le mois abrégé en chaîne non vide", () => {
    const date = new Date("2026-07-06T10:00:00.000Z");
    const result = formatMonth(date);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
