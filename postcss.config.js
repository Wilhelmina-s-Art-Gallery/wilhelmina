// PurgeCSS for the Hugo-built stylesheet (layouts/partials/head/styles.html).
// Added 15 Sep 2026, when the stylesheet stopped being a committed CodeKit file.
//
// hugo_stats.json lists every tag, class and id in the rendered HTML
// (writeStats = true in hugo.toml); any rule matching none of them goes.
// Production only - `hugo server` keeps the full stylesheet for development.
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  // Classes that exist only at runtime never appear in hugo_stats.json, so
  // PurgeCSS would delete their rules. is-active is toggled by the navbar
  // burger script in layouts/partials/footer/footer-scripts.html; without it
  // the mobile menu would open to nothing.
  safelist: ["is-active"],
  // hugo_stats.json records tags, classes and ids - never attributes - so
  // PurgeCSS drops any rule keyed on one. The first build lost Bulma's
  // `.textarea:not([rows])` min-height, collapsing the contact form's message
  // box on every page, and quietly lost the [disabled]/[readonly] form states
  // too. These are all seven attribute names the compiled Bulma uses; a
  // selector naming any of them is kept whole.
  dynamicAttributes: ["align", "class", "disabled", "multiple", "readonly", "rows", "type"],
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
