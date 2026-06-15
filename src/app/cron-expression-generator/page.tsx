"use client";

import { useMemo, useState } from "react";

type CronPreset = {
  label: string;
  minute: string;
  hour: string;
  dom: string;
  month: string;
  dow: string;
};

const PRESETS: CronPreset[] = [
  { label: "Every minute", minute: "*", hour: "*", dom: "*", month: "*", dow: "*" },
  { label: "Every 5 minutes", minute: "*/5", hour: "*", dom: "*", month: "*", dow: "*" },
  { label: "Every 15 minutes", minute: "*/15", hour: "*", dom: "*", month: "*", dow: "*" },
  { label: "Every 30 minutes", minute: "*/30", hour: "*", dom: "*", month: "*", dow: "*" },
  { label: "Hourly", minute: "0", hour: "*", dom: "*", month: "*", dow: "*" },
  { label: "Daily at midnight", minute: "0", hour: "0", dom: "*", month: "*", dow: "*" },
  { label: "Daily at 9 AM", minute: "0", hour: "9", dom: "*", month: "*", dow: "*" },
  { label: "Weekly on Monday 9 AM", minute: "0", hour: "9", dom: "*", month: "*", dow: "1" },
  { label: "First day of month", minute: "0", hour: "0", dom: "1", month: "*", dow: "*" },
  { label: "Every weekday 9 AM", minute: "0", hour: "9", dom: "*", month: "*", dow: "1-5" },
  { label: "Custom", minute: "0", hour: "12", dom: "*", month: "*", dow: "*" },
];

function describeCron(minute: string, hour: string, dom: string, month: string, dow: string): string {
  if (minute === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every minute";
  if (minute.startsWith("*/")) {
    const n = minute.slice(2);
    if (hour === "*" && dom === "*" && month === "*" && dow === "*") return `Every ${n} minutes`;
  }
  if (minute === "0" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every hour";
  if (minute === "0" && hour !== "*" && dom === "*" && month === "*" && dow === "*") return `Daily at ${hour}:00`;
  if (minute === "0" && hour !== "*" && dom === "*" && month === "*" && dow !== "*") {
    const days: Record<string, string> = { "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday", "7": "Sunday", "1-5": "Weekdays", "0,6": "Weekends" };
    return `Every ${days[dow] || dow} at ${hour}:00`;
  }
  return `${minute} ${hour} ${dom} ${month} ${dow}`;
}

function nextFires(expr: string, count = 5): string[] {
  const parts = expr.split(" ");
  if (parts.length !== 5) return [];
  const [min, hr, dom, mon, dow] = parts;
  const results: string[] = [];
  const now = new Date();
  let candidate = new Date(now);

  for (let i = 0; i < 10000 && results.length < count; i++) {
    candidate = new Date(candidate.getTime() + 60000);
    const matchesMin = min === "*" || min.includes(String(candidate.getMinutes()));
    const matchesHr = hr === "*" || hr.includes(String(candidate.getHours()));
    const matchesDom = dom === "*" || dom.includes(String(candidate.getDate()));
    const matchesMon = mon === "*" || mon.includes(String(candidate.getMonth() + 1));
    const matchesDow = dow === "*" || dow.includes(String(candidate.getDay()));
    if (matchesMin && matchesHr && matchesDom && matchesMon && matchesDow) {
      results.push(candidate.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }));
    }
  }
  return results;
}

export default function CronGeneratorPage() {
  const [selectedPreset, setSelectedPreset] = useState("Daily at 9 AM");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const [copied, setCopied] = useState(false);

  const currentPreset = PRESETS.find((p) => p.label === selectedPreset);

  const expression = useMemo(() => {
    const p = currentPreset || PRESETS[PRESETS.length - 1];
    return `${p.minute} ${p.hour} ${p.dom} ${p.month} ${p.dow}`;
  }, [currentPreset]);

  const description = useMemo(() => {
    const p = currentPreset || PRESETS[PRESETS.length - 1];
    return describeCron(p.minute, p.hour, p.dom, p.month, p.dow);
  }, [currentPreset]);

  const fires = useMemo(() => nextFires(expression), [expression]);

  function applyPreset(p: CronPreset) {
    setSelectedPreset(p.label);
    setMinute(p.minute);
    setHour(p.hour);
    setDom(p.dom);
    setMonth(p.month);
    setDow(p.dow);
  }

  async function copyExpression() {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container">
          <p className="eyebrow">Free developer utility</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-normal md:text-5xl">
            Cron Expression Generator
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Build cron schedules visually, read the human-friendly description, and copy ready-to-use expressions.
          </p>
        </div>
      </section>

      <section className="container grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <div className="card p-5">
            <p className="text-sm font-bold mb-4">Quick presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    selectedPreset === p.label
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold mb-4">Manual input</p>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: "minute", value: minute, set: setMinute, desc: "0-59" },
                { label: "hour", value: hour, set: setHour, desc: "0-23" },
                { label: "day of month", value: dom, set: setDom, desc: "1-31" },
                { label: "month", value: month, set: setMonth, desc: "1-12" },
                { label: "day of week", value: dow, set: setDow, desc: "0-7 Sun" },
              ].map((field) => (
                <label key={field.label} className="grid gap-1">
                  <span className="text-xs font-semibold text-slate-500">{field.label}</span>
                  <input
                    className="rounded-md border border-slate-300 px-2 py-2 font-mono text-sm text-center"
                    value={field.value}
                    onChange={(e) => {
                      setSelectedPreset("Custom");
                      field.set(e.target.value);
                    }}
                  />
                  <span className="text-[10px] text-slate-400 text-center">{field.desc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-5">
          <div className="card p-5">
            <p className="text-sm font-bold">Expression</p>
            <div className="mt-3 rounded-md bg-slate-950 p-4">
              <code className="text-lg font-mono text-emerald-300">{expression}</code>
            </div>
            <button
              onClick={copyExpression}
              className="btn mt-4 w-full"
            >
              {copied ? "Copied!" : "Copy expression"}
            </button>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold">Schedule</p>
            <p className="mt-2 text-base font-semibold text-emerald-700">{description}</p>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold">Next 5 fire times</p>
            <div className="mt-3 grid gap-2">
              {fires.map((t, i) => (
                <div key={i} className="text-sm font-mono text-slate-700 border-b border-slate-100 pb-2">
                  {t}
                </div>
              ))}
              {fires.length === 0 && (
                <p className="text-sm text-slate-500">No upcoming times found (check your expression)</p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container">
          <div className="rounded-lg border border-slate-200 bg-[#f7f4ef] p-6">
            <p className="text-sm font-bold">Need help setting up cron jobs?</p>
            <p className="mt-2 text-sm text-slate-600">
              If you need help configuring scheduled tasks, CI/CD cron triggers, or server cron jobs,
              send us your use case and we will help with the setup.
            </p>
            <a
              className="btn mt-4 inline-flex"
              href="mailto:huazai16168@gmail.com?subject=Cron%20setup%20help"
            >
              Request cron help
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
