module.exports = {

"[project]/.next-internal/server/app/api/content/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/next-mdx-remote/rsc [external] (next-mdx-remote/rsc, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("next-mdx-remote/rsc");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/utils/mdx.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "getAllContentFilePaths": (()=>getAllContentFilePaths),
    "getAllContentMeta": (()=>getAllContentMeta),
    "getContentBySection": (()=>getContentBySection),
    "getContentBySlug": (()=>getContentBySlug),
    "getContentSections": (()=>getContentSections),
    "getMDXContent": (()=>getMDXContent)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gray-matter/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$rsc__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$rsc$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/next-mdx-remote/rsc [external] (next-mdx-remote/rsc, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$highlight$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rehype-highlight/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$slug$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rehype-slug/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$rsc__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$rsc$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$rsc__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$rsc$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
;
// Define the content directory path
const contentDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'content');
function getAllContentFilePaths(dir = contentDirectory) {
    const files = [];
    // Get all files from the directory
    const items = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(dir, {
        withFileTypes: true
    });
    // Loop through each item
    for (const item of items){
        const itemPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dir, item.name);
        if (item.isDirectory()) {
            // If directory, recurse and get files
            files.push(...getAllContentFilePaths(itemPath));
        } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
            // If markdown file, add to list
            files.push(itemPath);
        }
    }
    return files;
}
async function getMDXContent(filePath) {
    // Read the file
    const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf8');
    // Extract frontmatter
    const { data, content } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(fileContent);
    // Compile MDX
    const compiled = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$rsc__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$rsc$2c$__esm_import$29$__["compileMDX"])({
        source: content,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$highlight$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$slug$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
                ],
                remarkPlugins: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
                ]
            }
        }
    });
    // Get slug from file path
    const relativePath = filePath.replace(contentDirectory, '');
    const slug = relativePath.replace(/^\//, '') // Remove leading slash
    .replace(/\.(md|mdx)$/, ''); // Remove extension
    return {
        frontmatter: data,
        content: compiled.content,
        rawContent: content,
        slug
    };
}
async function getAllContentMeta(directory = '') {
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(contentDirectory, directory);
    // Check if directory exists
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dir)) {
        return [];
    }
    // Get all markdown files in the directory
    const files = getAllContentFilePaths(dir);
    // Extract frontmatter from each file
    const contentMeta = files.map((filePath)=>{
        const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf8');
        const { data } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(fileContent);
        // Get slug from file path
        const relativePath = filePath.replace(contentDirectory, '');
        const slug = relativePath.replace(/^\//, '') // Remove leading slash
        .replace(/\.(md|mdx)$/, ''); // Remove extension
        return {
            frontmatter: data,
            slug,
            path: relativePath
        };
    });
    // Sort by title
    return contentMeta.sort((a, b)=>{
        if (a.frontmatter.title < b.frontmatter.title) return -1;
        if (a.frontmatter.title > b.frontmatter.title) return 1;
        return 0;
    });
}
async function getContentBySlug(slug) {
    // Log the slug for debugging
    console.log(`Looking for content with slug: ${slug}`);
    // Construct possible file paths (.md or .mdx)
    const mdPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(contentDirectory, `${slug}.md`);
    const mdxPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(contentDirectory, `${slug}.mdx`);
    const indexMdPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(contentDirectory, slug, 'index.md');
    const indexMdxPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(contentDirectory, slug, 'index.mdx');
    // Check if any of the possible files exist
    let filePath = null;
    // Try all possible file paths
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(mdPath)) {
        console.log(`Found file at: ${mdPath}`);
        filePath = mdPath;
    } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(mdxPath)) {
        console.log(`Found file at: ${mdxPath}`);
        filePath = mdxPath;
    } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(indexMdPath)) {
        console.log(`Found index file at: ${indexMdPath}`);
        filePath = indexMdPath;
    } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(indexMdxPath)) {
        console.log(`Found index file at: ${indexMdxPath}`);
        filePath = indexMdxPath;
    } else {
        console.error(`No content file found for slug: ${slug}`);
        return null;
    }
    // Read and parse the content
    try {
        return await getMDXContent(filePath);
    } catch (error) {
        console.error(`Error parsing content for slug ${slug}:`, error);
        return null;
    }
}
async function getContentBySection(section) {
    return await getAllContentMeta(section);
}
async function getContentSections() {
    // Get all top-level directories in the content directory
    const items = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(contentDirectory, {
        withFileTypes: true
    });
    const sections = {};
    // For each directory, get content metadata
    for (const item of items){
        if (item.isDirectory()) {
            const sectionItems = await getContentBySection(item.name);
            sections[item.name] = sectionItems;
        }
    }
    return sections;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/content/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mdx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/mdx.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mdx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mdx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
async function GET(request) {
    try {
        // Get the content path from query params
        const contentPath = request.nextUrl.searchParams.get('path');
        if (!contentPath) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                error: 'Missing content path parameter'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Get the slug from the path (remove extension)
        const slug = contentPath.replace(/\.md$/, '');
        // Use the existing utility to get content
        const content = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$mdx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getContentBySlug"])(slug);
        if (!content) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                error: 'Content not found'
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Return only the necessary data
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
            frontmatter: content.frontmatter,
            content: content.rawContent,
            path: contentPath
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching content:', error);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
            error: 'Failed to fetch content'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__1c0c925d._.js.map