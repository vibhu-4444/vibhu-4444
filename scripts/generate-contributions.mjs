import { writeFile } from "node:fs/promises";

const username = "vibhu-4444";
const outputPath = new URL("../assets/contributions.svg", import.meta.url);
const response = await fetch(
  `https://github-contributions.vercel.app/api/v1/${username}`,
  { headers: { "user-agent": "vibhu-4444-profile-contribution-chart" } },
);

if (!response.ok) {
  throw new Error(`Contribution data request failed: HTTP ${response.status}`);
}

const data = await response.json();
if (!Array.isArray(data.years) || !Array.isArray(data.contributions)) {
  throw new Error("Contribution API returned an unexpected response.");
}

const currentYear = new Date().getUTCFullYear();
const byDate = new Map(data.contributions.map((day) => [day.date, day]));
const years = data.years
  .map((entry) => ({ year: Number(entry.year), total: Number(entry.total) }))
  .filter((entry) => Number.isInteger(entry.year) && Number.isFinite(entry.total))
  .sort((a, b) => b.year - a.year);

if (years.length === 0 || years.some((entry) => entry.total < 0)) {
  throw new Error("Contribution API returned no valid yearly totals.");
}

const width = 680;
const left = 20;
const cell = 9;
const gap = 3;
const pitch = cell + gap;
const palette = ["#303030", "#555555", "#777777", "#aaaaaa", "#eeeeee"];
const escapeXml = (value) =>
  String(value).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[
      character
    ],
  );

const parts = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="HEIGHT" viewBox="0 0 ${width} HEIGHT" role="img" aria-labelledby="title description">`,
  `<title id="title">GitHub contributions for @${username}</title>`,
  `<desc id="description">Year-by-year contribution calendar using the dark grayscale style shown on the GitHub profile.</desc>`,
  `<rect width="100%" height="100%" fill="#000000"/>`,
  `<g fill="#f0f0f0" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">`,
  `<text x="${left}" y="27" font-size="19">@${username} on GitHub</text>`,
  `<text x="${left}" y="49" font-size="11">Total Contributions: ${years.reduce((sum, entry) => sum + entry.total, 0).toLocaleString("en-US")}</text>`,
  `</g>`,
];

parts.push(
  `<g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" fill="#eeeeee">`,
  `<text x="465" y="27">Less</text>`,
);
palette.forEach((color, index) => {
  parts.push(
    `<rect x="${492 + index * 13}" y="18" width="10" height="10" rx="1" fill="${color}"/>`,
  );
});
parts.push(`<text x="562" y="27">More</text></g>`);

let sectionTop = 70;
for (const entry of years) {
  const year = entry.year;
  const firstDay = new Date(Date.UTC(year, 0, 1));
  const lastDay =
    year === currentYear
      ? new Date(Math.min(Date.now(), Date.UTC(year, 11, 31)))
      : new Date(Date.UTC(year, 11, 31));
  const dayCount = Math.floor((lastDay - firstDay) / 86_400_000) + 1;
  const firstWeekday = firstDay.getUTCDay();
  const weekCount = Math.ceil((firstWeekday + dayCount) / 7);
  const currentYearLabel = year === currentYear ? " (so far)" : "";

  parts.push(
    `<g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fill="#eeeeee">`,
    `<text x="${left}" y="${sectionTop + 10}" font-size="11">${year}: ${entry.total.toLocaleString("en-US")} ${entry.total === 1 ? "Contribution" : "Contributions"}${currentYearLabel}</text>`,
  );

  for (let month = 0; month < 12; month += 1) {
    const monthDate = new Date(Date.UTC(year, month, 1));
    if (monthDate > lastDay) break;
    const dayOfYear = Math.floor((monthDate - firstDay) / 86_400_000);
    const column = Math.floor((firstWeekday + dayOfYear) / 7);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    parts.push(
      `<text x="${left + column * pitch}" y="${sectionTop + 26}" font-size="9" fill="#aaaaaa">${monthNames[month]}</text>`,
    );
  }
  parts.push(`</g>`);

  const gridTop = sectionTop + 34;
  for (let offset = 0; offset < dayCount; offset += 1) {
    const date = new Date(firstDay.getTime() + offset * 86_400_000)
      .toISOString()
      .slice(0, 10);
    const weekday = (firstWeekday + offset) % 7;
    const column = Math.floor((firstWeekday + offset) / 7);
    const contribution = byDate.get(date);
    const rawLevel = Number(contribution?.intensity ?? 0);
    const level = Number.isInteger(rawLevel) ? Math.max(0, Math.min(4, rawLevel)) : 0;
    const title = level === 0 ? `${date}: no contributions` : `${date}: activity level ${level}`;
    parts.push(
      `<g><title>${escapeXml(title)}</title><rect x="${left + column * pitch}" y="${gridTop + weekday * pitch}" width="${cell}" height="${cell}" fill="${palette[level]}"/></g>`,
    );
  }

  sectionTop = gridTop + 7 * pitch + 16;
}

const height = sectionTop + 16;
parts[0] = parts[0].replaceAll("HEIGHT", String(height));
parts.push(
  `<text x="${left}" y="${height - 5}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" fill="#888888">Contribution data from GitHub · Generated daily</text>`,
  `</svg>`,
);

await writeFile(outputPath, `${parts.join("\n")}\n`, "utf8");
console.log(`Generated ${outputPath.pathname} with ${years.length} years of contribution data.`);
