
import { getForecastMonthKeys, getEndOfForecastMonth } from "./reportSpending";

describe("getForecastMonthKeys", () => {
    test("should return the correct number of forecast months", () => {
        const result = getForecastMonthKeys("2026-10-01", 4);

        expect(result).toHaveLength(4);
    });

    test("should correctly handle a year change", () => {
        const result = getForecastMonthKeys("2026-10-01", 4);

        expect(result).toEqual([
            "2026-10",
            "2026-11",
            "2026-12",
            "2027-01",
        ]);
    });

    test("should return an empty array when zero months are requested", () => {
        const result = getForecastMonthKeys("2026-10-01", 0);

        expect(result).toEqual([]);
    });
});

describe("getEndOfForecastMonth", () => {
    test("should return the last day of February in a non-leap year", () => {
        const result = getEndOfForecastMonth("2026-02-01", 0);

        expect(result).toBe("2026-02-28");
    });

    test("should return the last day of February in a leap year", () => {
        const result = getEndOfForecastMonth("2028-02-01", 0);

        expect(result).toBe("2028-02-29");
    });

    test("should correctly handle a year change", () => {
        const result = getEndOfForecastMonth("2026-12-01", 1);

        expect(result).toBe("2027-01-31");
    });
});
