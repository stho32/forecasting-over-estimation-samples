import * as asserts from "https://deno.land/std/testing/asserts.ts";

import { parse, difference, format } from "https://deno.land/std@0.113.0/datetime/mod.ts";
import {HistoricalData, HistoricalRecord, LoadHistory} from "../HistoryReader.ts"


Deno.test("Get first beginning date and last ending date", () =>{
    const sut = new HistoricalData(
        [
            new HistoricalRecord(parse("2021-11-28", "yyyy-MM-dd"), parse("2021-11-30", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-11-29", "yyyy-MM-dd"), parse("2021-12-02", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-13", "yyyy-MM-dd"), parse("2022-01-03", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-11-27", "yyyy-MM-dd"), parse("2021-12-04", "yyyy-MM-dd")),
        ]
    );

    asserts.assertEquals(sut.DateRange, [parse("2021-11-27", "yyyy-MM-dd"), parse("2022-01-03", "yyyy-MM-dd")])
})


Deno.test("Get working day calendar between first beginning and last finishing date", () =>{
    const sut = new HistoricalData(
        [
            new HistoricalRecord(parse("2021-11-26", "yyyy-MM-dd"), parse("2021-11-30", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-02", "yyyy-MM-dd"), parse("2021-12-06", "yyyy-MM-dd")),
        ]
    );

    asserts.assertEquals(sut.Calendar, [
        parse("2021-11-26", "yyyy-MM-dd"),
        parse("2021-11-27", "yyyy-MM-dd"),
        parse("2021-11-28", "yyyy-MM-dd"),
        parse("2021-11-29", "yyyy-MM-dd"),
        parse("2021-11-30", "yyyy-MM-dd"),
        parse("2021-12-01", "yyyy-MM-dd"),
        parse("2021-12-02", "yyyy-MM-dd"),
        parse("2021-12-03", "yyyy-MM-dd"),
        parse("2021-12-04", "yyyy-MM-dd"),
        parse("2021-12-05", "yyyy-MM-dd"),
        parse("2021-12-06", "yyyy-MM-dd")
    ]);
})


Deno.test("Get calendar with summer/winter time switch", () => {
    const sut = new HistoricalData(
        [
            new HistoricalRecord(parse("2021-10-30", "yyyy-MM-dd"), parse("2021-10-31", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-10-31", "yyyy-MM-dd"), parse("2021-11-01", "yyyy-MM-dd"))
        ]
    );

    asserts.assertEquals(sut.Calendar, [
        parse("2021-10-30", "yyyy-MM-dd"),
        parse("2021-10-31", "yyyy-MM-dd"),
        parse("2021-11-01", "yyyy-MM-dd"),
    ]);
})


Deno.test("Get throughputs", () => {
    const sut = new HistoricalData(
        [
            new HistoricalRecord(parse("2021-11-26", "yyyy-MM-dd"), parse("2021-12-06", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-11-26", "yyyy-MM-dd"), parse("2021-11-26", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-11-26", "yyyy-MM-dd"), parse("2021-11-29", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-11-27", "yyyy-MM-dd"), parse("2021-11-29", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-01", "yyyy-MM-dd"), parse("2021-12-01", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-01", "yyyy-MM-dd"), parse("2021-12-02", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-01", "yyyy-MM-dd"), parse("2021-12-02", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-01", "yyyy-MM-dd"), parse("2021-12-02", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-01", "yyyy-MM-dd"), parse("2021-12-03", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-12-01", "yyyy-MM-dd"), parse("2021-12-03", "yyyy-MM-dd")),
        ]
    );

    asserts.assertEquals(sut.Throughputs.map(x => x.Date), [
        parse("2021-11-26", "yyyy-MM-dd"),
        parse("2021-11-27", "yyyy-MM-dd"),
        parse("2021-11-28", "yyyy-MM-dd"),
        parse("2021-11-29", "yyyy-MM-dd"),
        parse("2021-11-30", "yyyy-MM-dd"),
        parse("2021-12-01", "yyyy-MM-dd"),
        parse("2021-12-02", "yyyy-MM-dd"),
        parse("2021-12-03", "yyyy-MM-dd"),
        parse("2021-12-04", "yyyy-MM-dd"),
        parse("2021-12-05", "yyyy-MM-dd"),
        parse("2021-12-06", "yyyy-MM-dd")
    ]);

    asserts.assertEquals(sut.Throughputs.map(x => x.Throughput), [
        1,
        0,
        0,
        2,
        0,
        1,
        3,
        2,
        0,
        0,
        1
    ]);
})


Deno.test("Get throughputs across sumer/winter time switch", () => {
    const sut = new HistoricalData(
        [
            new HistoricalRecord(parse("2021-10-30", "yyyy-MM-dd"), parse("2021-10-30", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-10-31", "yyyy-MM-dd"), parse("2021-10-31", "yyyy-MM-dd")),
            new HistoricalRecord(parse("2021-11-01", "yyyy-MM-dd"), parse("2021-11-01", "yyyy-MM-dd")),
        ]
    );

    asserts.assertEquals(sut.Throughputs.map(x => x.Date), [
        parse("2021-10-30", "yyyy-MM-dd"),
        parse("2021-10-31", "yyyy-MM-dd"),
        parse("2021-11-01", "yyyy-MM-dd"),
    ]);

    asserts.assertEquals(sut.Throughputs.map(x => x.Throughput), [
        1,
        1,
        1
    ]);
})