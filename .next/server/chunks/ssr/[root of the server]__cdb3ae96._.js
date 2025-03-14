module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/components/theme/ThemeToggle.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeToggle": (()=>ThemeToggle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SunIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SunIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/SunIcon.js [app-ssr] (ecmascript) <export default as SunIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MoonIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoonIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MoonIcon.js [app-ssr] (ecmascript) <export default as MoonIcon>");
"use client";
;
;
;
const ThemeToggle = ()=>{
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('dark');
    // Initialize theme on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemPreference;
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);
    // Apply theme changes
    const applyTheme = (newTheme)=>{
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
    };
    // Toggle between light and dark mode
    const toggleTheme = ()=>{
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
        title: theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
        children: theme === 'light' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MoonIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoonIcon$3e$__["MoonIcon"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/src/components/theme/ThemeToggle.tsx",
            lineNumber: 48,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SunIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SunIcon$3e$__["SunIcon"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/src/components/theme/ThemeToggle.tsx",
            lineNumber: 50,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/theme/ThemeToggle.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
}}),
"[project]/src/components/sidebar/Sidebar.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Sidebar": (()=>Sidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronRightIcon.js [app-ssr] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronDownIcon.js [app-ssr] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Cog6ToothIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cog6ToothIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/Cog6ToothIcon.js [app-ssr] (ecmascript) <export default as Cog6ToothIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme/ThemeToggle.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const mainNavItems = [
    {
        title: 'Home',
        path: '/'
    },
    {
        title: 'Company Wiki',
        path: '/wiki/company-wiki',
        children: [
            {
                title: 'About',
                path: '/wiki/company-wiki/about'
            },
            {
                title: 'Teams',
                path: '/wiki/company-wiki/teams'
            }
        ]
    },
    {
        title: 'HIPAA',
        path: '/wiki/hipaa',
        children: [
            {
                title: 'Comprehensive Guide',
                path: '/wiki/hipaa/comprehensive-guide'
            },
            {
                title: 'Dashboard',
                path: '/wiki/hipaa/dashboard'
            },
            {
                title: 'Checklists',
                path: '/wiki/hipaa/checklists'
            },
            {
                title: 'Documentation',
                path: '/wiki/hipaa/documentation',
                children: [
                    {
                        title: 'Technical Security',
                        path: '/wiki/hipaa/documentation/technical-security'
                    },
                    {
                        title: 'Access Control',
                        path: '/wiki/hipaa/documentation/access-control'
                    },
                    {
                        title: 'CCM Requirements',
                        path: '/wiki/hipaa/documentation/ccm-specific-requirements'
                    },
                    {
                        title: 'Incident Response',
                        path: '/wiki/hipaa/documentation/incident-response'
                    },
                    {
                        title: 'LLM Compliance',
                        path: '/wiki/hipaa/documentation/llm-compliance'
                    }
                ]
            }
        ]
    },
    {
        title: 'SOPs',
        path: '/wiki/sop',
        children: [
            {
                title: 'Engineering',
                path: '/wiki/sop/engineering',
                children: [
                    {
                        title: 'Deployment',
                        path: '/wiki/sop/engineering/deployment'
                    },
                    {
                        title: 'Code Review',
                        path: '/wiki/sop/engineering/code-review'
                    }
                ]
            },
            {
                title: 'Compliance',
                path: '/wiki/sop/compliance',
                children: [
                    {
                        title: 'Incident Response',
                        path: '/wiki/sop/compliance/incident-response'
                    },
                    {
                        title: 'Audit Procedures',
                        path: '/wiki/sop/compliance/audit-procedures'
                    }
                ]
            }
        ]
    }
];
// NavItem component
const NavItem = ({ item, depth = 0 })=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isOpen, setIsOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(pathname.startsWith(item.path));
    const hasChildren = item.children && item.children.length > 0;
    const isActive = pathname === item.path;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex items-center justify-between py-2 pr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`,
                style: {
                    paddingLeft: `${depth * 0.75 + 0.5}rem`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.path,
                        className: `flex-grow text-sm ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`,
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    hasChildren && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOpen(!isOpen),
                        className: "p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700",
                        children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                            lineNumber: 142,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                            lineNumber: 144,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            hasChildren && isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pl-4 border-l border-gray-200 dark:border-gray-700 ml-2",
                children: item.children?.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                        item: child,
                        depth: depth + 1
                    }, child.path, false, {
                        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                        lineNumber: 154,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
};
const Sidebar = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-64 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-2 flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-2 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-bold text-gray-900 dark:text-white",
                                children: "Company Wiki"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 dark:text-gray-400",
                                children: "Documentation & SOPs"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "space-y-1 flex-1 overflow-y-auto",
                children: mainNavItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavItem, {
                        item: item
                    }, item.path, false, {
                        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto pt-4 border-t border-gray-200 dark:border-gray-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 py-2 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Cog6ToothIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cog6ToothIcon$3e$__["Cog6ToothIcon"], {
                            className: "w-5 h-5 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Settings"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sidebar/Sidebar.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sidebar/Sidebar.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
};
}}),
"[project]/src/components/navigation/Breadcrumb.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Breadcrumb": (()=>Breadcrumb)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronRightIcon.js [app-ssr] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$HomeIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/HomeIcon.js [app-ssr] (ecmascript) <export default as HomeIcon>");
"use client";
;
;
;
;
const Breadcrumb = ()=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // Skip rendering breadcrumbs on homepage
    if (pathname === '/') {
        return null;
    }
    // Convert pathname to breadcrumb items
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems = pathSegments.map((segment, index)=>{
        // Build the URL for this breadcrumb item
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        // Format the title (capitalize and replace hyphens with spaces)
        const title = segment.split('-').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return {
            title,
            url
        };
    });
    // Add home as the first item
    breadcrumbItems.unshift({
        title: 'Home',
        url: '/'
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "flex py-3 px-4 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "inline-flex items-center space-x-1 md:space-x-3",
            children: breadcrumbItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "inline-flex items-center",
                    children: [
                        index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                            className: "w-4 h-4 mx-1 text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
                            lineNumber: 40,
                            columnNumber: 15
                        }, this),
                        index === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$HomeIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"], {
                            className: "w-4 h-4 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
                            lineNumber: 44,
                            columnNumber: 15
                        }, this),
                        index === breadcrumbItems.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-500 dark:text-gray-400",
                            "aria-current": "page",
                            children: item.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
                            lineNumber: 48,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.url,
                            className: "hover:text-blue-600 dark:hover:text-blue-400",
                            children: item.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
                            lineNumber: 52,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.url, true, {
                    fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
                    lineNumber: 38,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/navigation/Breadcrumb.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
};
}}),
"[project]/src/components/search/SearchBar.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SearchBar": (()=>SearchBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-ssr] (ecmascript) <export default as MagnifyingGlassIcon>");
"use client";
;
;
;
const SearchBar = ()=>{
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showResults, setShowResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSearch = async (e)=>{
        e.preventDefault();
        if (!query.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }
        setIsSearching(true);
        setShowResults(true);
        // Simulated search results - in a real implementation, this would call an API
        setTimeout(()=>{
            // Mock results based on the query
            const mockResults = [
                {
                    title: "HIPAA Documentation",
                    description: "Comprehensive guide to HIPAA compliance for healthcare software development",
                    path: "/wiki/hipaa",
                    matches: [
                        "Comprehensive HIPAA resources"
                    ]
                },
                {
                    title: "Technical Security Standards",
                    description: "HIPAA technical security requirements for healthcare software",
                    path: "/wiki/hipaa/core/technical-security",
                    matches: [
                        "All PHI stored in databases must be encrypted"
                    ]
                }
            ].filter((result)=>result.title.toLowerCase().includes(query.toLowerCase()) || result.description.toLowerCase().includes(query.toLowerCase()) || result.matches.some((match)=>match.toLowerCase().includes(query.toLowerCase())));
            setResults(mockResults);
            setIsSearching(false);
        }, 500);
    };
    const handleInputChange = (e)=>{
        setQuery(e.target.value);
        if (e.target.value === '') {
            setResults([]);
            setShowResults(false);
        }
    };
    const handleClickOutside = (e)=>{
        if (e.target === e.currentTarget) {
            setShowResults(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full max-w-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSearch,
                className: "w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Search documentation...",
                            value: query,
                            onChange: handleInputChange,
                            onFocus: ()=>query.trim() && setShowResults(true),
                            className: "w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchBar.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-y-0 left-0 flex items-center pl-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"], {
                                className: "w-5 h-5 text-gray-400 dark:text-gray-500"
                            }, void 0, false, {
                                fileName: "[project]/src/components/search/SearchBar.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchBar.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        isSearching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-y-0 right-0 flex items-center pr-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/src/components/search/SearchBar.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchBar.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/search/SearchBar.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/search/SearchBar.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            showResults && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-25 z-40",
                onClick: handleClickOutside,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-16 left-0 right-0 mx-auto w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden max-h-[80vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-b border-gray-200 dark:border-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-900 dark:text-white",
                                children: [
                                    "Search Results ",
                                    results.length ? `(${results.length})` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/search/SearchBar.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchBar.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this),
                        results.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 text-center text-gray-500 dark:text-gray-400",
                            children: isSearching ? 'Searching...' : 'No results found'
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchBar.tsx",
                            lineNumber: 108,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "divide-y divide-gray-200 dark:divide-gray-700",
                            children: results.map((result, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "p-4 hover:bg-gray-50 dark:hover:bg-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: result.path,
                                        className: "block",
                                        onClick: ()=>setShowResults(false),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-base font-medium text-blue-600 dark:text-blue-400",
                                                children: result.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchBar.tsx",
                                                lineNumber: 116,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm text-gray-600 dark:text-gray-300",
                                                children: result.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchBar.tsx",
                                                lineNumber: 117,
                                                columnNumber: 23
                                            }, this),
                                            result.matches.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 text-xs text-gray-500 dark:text-gray-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "block font-medium mb-1",
                                                        children: "Matching content:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/search/SearchBar.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 27
                                                    }, this),
                                                    result.matches.map((match, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate",
                                                            children: [
                                                                "• ",
                                                                match
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/src/components/search/SearchBar.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 29
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/search/SearchBar.tsx",
                                                lineNumber: 119,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/search/SearchBar.tsx",
                                        lineNumber: 115,
                                        columnNumber: 21
                                    }, this)
                                }, index, false, {
                                    fileName: "[project]/src/components/search/SearchBar.tsx",
                                    lineNumber: 114,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchBar.tsx",
                            lineNumber: 112,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/search/SearchBar.tsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/search/SearchBar.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/search/SearchBar.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
};
}}),
"[project]/src/components/layout/WikiLayout.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WikiLayout": (()=>WikiLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sidebar$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/sidebar/Sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$Breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/navigation/Breadcrumb.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$SearchBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/SearchBar.tsx [app-ssr] (ecmascript)");
;
;
;
;
const WikiLayout = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen bg-gray-50 dark:bg-gray-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sidebar$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/WikiLayout.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-screen flex flex-col overflow-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$Breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Breadcrumb"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/WikiLayout.tsx",
                                    lineNumber: 21,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 md:mt-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$SearchBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchBar"], {}, void 0, false, {
                                        fileName: "[project]/src/components/layout/WikiLayout.tsx",
                                        lineNumber: 23,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/WikiLayout.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/WikiLayout.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WikiLayout.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-auto p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-4xl mx-auto",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/WikiLayout.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WikiLayout.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: "py-4 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-sm text-gray-500 dark:text-gray-400",
                            children: [
                                "© ",
                                new Date().getFullYear().toString(),
                                " Company Wiki • HIPAA Compliant"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/WikiLayout.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/WikiLayout.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/WikiLayout.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/WikiLayout.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
};
}}),
"[project]/src/components/hipaa/HipaaChecklist.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * HIPAA Checklist Component
 * 
 * Server component that renders interactive checklists for HIPAA compliance verification.
 * 
 * #tags: hipaa, checklist, compliance
 */ __turbopack_context__.s({
    "HipaaChecklist": (()=>HipaaChecklist)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function HipaaChecklist({ title, description, categories, lastUpdated, onItemToggle = ()=>{} }) {
    // Calculate total progress
    const totalItems = categories.reduce((acc, category)=>acc + category.items.length, 0);
    const completedItems = categories.reduce((acc, category)=>acc + category.items.filter((item)=>item.completed).length, 0);
    const progressPercentage = totalItems > 0 ? Math.round(completedItems / totalItems * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 pt-6 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-gray-600 dark:text-gray-300",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                        children: "Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                        children: [
                                            completedItems,
                                            " of ",
                                            totalItems,
                                            " items completed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `h-2.5 rounded-full ${progressPercentage < 30 ? 'bg-red-500' : progressPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'}`,
                                    style: {
                                        width: `${progressPercentage}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-sm text-gray-500 dark:text-gray-400",
                        children: [
                            "Last updated: ",
                            lastUpdated
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-gray-200 dark:border-gray-800",
                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-200 dark:border-gray-800 last:border-b-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6 py-4 bg-gray-50 dark:bg-gray-800",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-gray-900 dark:text-white",
                                        children: category.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this),
                                    category.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-gray-600 dark:text-gray-300",
                                        children: category.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                        lineNumber: 102,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "divide-y divide-gray-200 dark:divide-gray-700",
                                children: category.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center h-5 mt-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-4 h-4 rounded border ${item.completed ? 'bg-blue-600 border-blue-600 flex items-center justify-center' : 'border-gray-300 dark:border-gray-600'}`,
                                                        "data-item-id": item.id,
                                                        "data-is-completed": item.completed.toString(),
                                                        "aria-checked": item.completed,
                                                        role: "checkbox",
                                                        children: item.completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-3 h-3 text-white",
                                                            viewBox: "0 0 20 20",
                                                            fill: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                fillRule: "evenodd",
                                                                d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                                clipRule: "evenodd"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                                lineNumber: 128,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ml-3 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "font-medium text-gray-700 dark:text-gray-200",
                                                                    children: item.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                                    lineNumber: 137,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `ml-2 px-2 py-0.5 text-xs rounded-full
                          ${item.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`,
                                                                    children: [
                                                                        item.priority === 'high' ? 'High' : item.priority === 'medium' ? 'Medium' : 'Low',
                                                                        " priority"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                                    lineNumber: 142,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                            lineNumber: 136,
                                                            columnNumber: 23
                                                        }, this),
                                                        item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-500 dark:text-gray-400 mt-1",
                                                            children: item.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                            lineNumber: 112,
                                            columnNumber: 19
                                        }, this)
                                    }, item.id, false, {
                                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        ]
                    }, category.id, true, {
                        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hipaa/HipaaChecklist.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/components/hipaa/HipaaChecklistWrapper.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "HipaaChecklistWrapper": (()=>HipaaChecklistWrapper)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Client-side wrapper for the HipaaChecklist component
 * 
 * Adds interactivity to the checklist items and provides state management
 * for updating completion status.
 * 
 * #tags: hipaa, checklist, client-component
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hipaa$2f$HipaaChecklist$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hipaa/HipaaChecklist.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function HipaaChecklistWrapper({ title, description, initialCategories, lastUpdated, onSave }) {
    // State to track the checklist categories and items
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialCategories);
    // Update categories when initialCategories changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCategories(initialCategories);
    }, [
        initialCategories
    ]);
    // Handle toggling a checklist item with useCallback to prevent infinite loops
    const handleItemToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((itemId, completed)=>{
        setCategories((prevCategories)=>{
            const updatedCategories = prevCategories.map((category)=>{
                const updatedItems = category.items.map((item)=>{
                    if (item.id === itemId) {
                        return {
                            ...item,
                            completed: !item.completed
                        };
                    }
                    return item;
                });
                return {
                    ...category,
                    items: updatedItems
                };
            });
            if (onSave) {
                onSave(updatedCategories);
            }
            return updatedCategories;
        });
    }, [
        onSave
    ]);
    // Handle click events on checklist items
    const handleClick = (event)=>{
        // Find the closest checkbox element
        const target = event.target;
        const checkbox = target.closest('[role="checkbox"]');
        if (checkbox) {
            const itemId = checkbox.getAttribute('data-item-id');
            const isCompleted = checkbox.getAttribute('data-is-completed') === 'true';
            if (itemId) {
                handleItemToggle(itemId, isCompleted);
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: handleClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hipaa$2f$HipaaChecklist$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HipaaChecklist"], {
                title: title,
                description: description,
                categories: categories,
                lastUpdated: lastUpdated
            }, void 0, false, {
                fileName: "[project]/src/components/hipaa/HipaaChecklistWrapper.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    onClick: ()=>onSave && onSave(categories),
                    children: "Save Progress"
                }, void 0, false, {
                    fileName: "[project]/src/components/hipaa/HipaaChecklistWrapper.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hipaa/HipaaChecklistWrapper.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hipaa/HipaaChecklistWrapper.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/lib/mock-data/hipaa-checklist-data.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Mock data for HIPAA checklists
 * 
 * This file provides structured data for the interactive HIPAA checklists
 * based on categories defined in the HIPAA security and privacy rules.
 * 
 * #tags: hipaa, checklist, mock-data
 */ __turbopack_context__.s({
    "getChecklistCategory": (()=>getChecklistCategory),
    "getChecklistItemsByCategory": (()=>getChecklistItemsByCategory),
    "getFilteredChecklist": (()=>getFilteredChecklist),
    "hipaaChecklistCategories": (()=>hipaaChecklistCategories)
});
// Technical Security checklist items
const technicalSecurityItems = [
    {
        id: 'tech-1',
        category: 'technical',
        label: 'Implement access controls (unique user identification)',
        description: 'Ensure each user has unique credentials and appropriate access levels.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'tech-2',
        category: 'technical',
        label: 'Implement audit controls and activity logs',
        description: 'Track all access to PHI with appropriate detail for investigations.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'tech-3',
        category: 'technical',
        label: 'Enable data integrity controls to prevent improper alteration',
        description: 'Implement mechanisms to ensure that PHI is not improperly altered or destroyed.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'tech-4',
        category: 'technical',
        label: 'Use secure transmission methods for PHI',
        description: 'Implement technical measures to guard against unauthorized access to PHI transmitted over networks.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'tech-5',
        category: 'technical',
        label: 'Implement encryption for PHI at rest',
        description: 'Ensure that stored PHI is protected using industry-standard encryption methods.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'tech-6',
        category: 'technical',
        label: 'Establish automatic logoff procedures',
        description: 'Implement technical mechanisms that terminate sessions after a predetermined time of inactivity.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'tech-7',
        category: 'technical',
        label: 'Implement emergency access procedures',
        description: 'Establish procedures for obtaining necessary PHI during an emergency.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'tech-8',
        category: 'technical',
        label: 'Conduct regular system vulnerability scans',
        description: 'Perform scans at least quarterly to identify potential security vulnerabilities.',
        completed: false,
        priority: 'medium'
    }
];
// Administrative Safeguards checklist items
const administrativeItems = [
    {
        id: 'admin-1',
        category: 'administrative',
        label: 'Conduct security risk assessment',
        description: 'Conduct an accurate and thorough assessment of potential risks to PHI.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'admin-2',
        category: 'administrative',
        label: 'Develop and implement security policies and procedures',
        description: 'Create comprehensive written policies and procedures that address all aspects of PHI security.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'admin-3',
        category: 'administrative',
        label: 'Designate a security official',
        description: 'Appoint an individual responsible for developing and implementing security policies.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'admin-4',
        category: 'administrative',
        label: 'Establish security awareness training for all staff',
        description: 'Provide regular training for all workforce members on security policies and procedures.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'admin-5',
        category: 'administrative',
        label: 'Create incident response and reporting procedures',
        description: 'Develop procedures for identifying, responding to, and documenting security incidents.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'admin-6',
        category: 'administrative',
        label: 'Develop contingency plans for emergencies',
        description: 'Create data backup, disaster recovery, and emergency operations plans.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'admin-7',
        category: 'administrative',
        label: 'Conduct regular security evaluations',
        description: 'Perform periodic technical and non-technical evaluations of security controls.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'admin-8',
        category: 'administrative',
        label: 'Establish Business Associate Agreements where required',
        description: 'Ensure that all business associates who handle PHI have signed appropriate agreements.',
        completed: false,
        priority: 'high'
    }
];
// Physical Safeguards checklist items
const physicalItems = [
    {
        id: 'phys-1',
        category: 'physical',
        label: 'Implement facility access controls',
        description: 'Limit physical access to facilities where systems containing PHI are housed.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'phys-2',
        category: 'physical',
        label: 'Create policies for workstation use and security',
        description: 'Implement policies governing the proper use and positioning of workstations with access to PHI.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'phys-3',
        category: 'physical',
        label: 'Establish device and media controls',
        description: 'Implement policies for the receipt and removal of hardware and electronic media containing PHI.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'phys-4',
        category: 'physical',
        label: 'Create procedures for media disposal',
        description: 'Implement procedures for the final disposition of PHI and the hardware or electronic media it is stored on.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'phys-5',
        category: 'physical',
        label: 'Develop hardware inventory management system',
        description: 'Maintain records of the movements of hardware and electronic media containing PHI.',
        completed: false,
        priority: 'low'
    },
    {
        id: 'phys-6',
        category: 'physical',
        label: 'Implement physical security for servers and equipment',
        description: 'Ensure that servers, network equipment, and backup media are physically secured.',
        completed: false,
        priority: 'high'
    }
];
// LLM and AI-specific checklist items
const llmItems = [
    {
        id: 'llm-1',
        category: 'llm',
        label: 'Implement data minimization for LLM inputs containing PHI',
        description: 'Ensure that only the minimum necessary PHI is included in LLM prompts.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'llm-2',
        category: 'llm',
        label: 'Establish secure prompt engineering guidelines',
        description: 'Develop guidelines for creating prompts that minimize risk of PHI disclosure.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'llm-3',
        category: 'llm',
        label: 'Create policy for reviewing LLM outputs before use',
        description: 'Implement procedures to review LLM-generated content before incorporating it into PHI workflows.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'llm-4',
        category: 'llm',
        label: 'Conduct regular audits of LLM interactions with PHI',
        description: 'Review logs and records of LLM usage involving PHI to ensure compliance.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'llm-5',
        category: 'llm',
        label: 'Establish incident response for LLM data breaches',
        description: 'Develop specific procedures for handling incidents involving LLM misuse or breaches.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'llm-6',
        category: 'llm',
        label: 'Implement BAAs with LLM service providers',
        description: 'Ensure business associate agreements are in place with LLM providers who may process PHI.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'llm-7',
        category: 'llm',
        label: 'Train staff on appropriate LLM use with PHI',
        description: 'Provide specialized training on safe use of LLMs when dealing with PHI.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'llm-8',
        category: 'llm',
        label: 'Document LLM risk assessment',
        description: 'Complete a specific risk assessment for LLM technologies used with PHI.',
        completed: false,
        priority: 'high'
    }
];
// CCM-specific checklist items
const ccmItems = [
    {
        id: 'ccm-1',
        category: 'ccm',
        label: 'Implement secure time tracking for CCM services',
        description: 'Ensure time tracking systems for CCM billing are secure and HIPAA compliant.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'ccm-2',
        category: 'ccm',
        label: 'Develop protocols for secure patient communication',
        description: 'Establish secure methods for communicating with patients during CCM activities.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'ccm-3',
        category: 'ccm',
        label: 'Create secure care plan sharing procedures',
        description: 'Implement secure methods for sharing care plans with patients and other providers.',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'ccm-4',
        category: 'ccm',
        label: 'Establish secure documentation of CCM activities',
        description: 'Ensure all CCM activities are documented securely in compliance with HIPAA.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'ccm-5',
        category: 'ccm',
        label: 'Implement consent management for CCM services',
        description: 'Track and manage patient consent for CCM services in a HIPAA-compliant manner.',
        completed: false,
        priority: 'high'
    },
    {
        id: 'ccm-6',
        category: 'ccm',
        label: 'Create secure process for handling screenshots',
        description: 'Establish procedures for securely capturing, storing, and transmitting screenshots.',
        completed: false,
        priority: 'high'
    }
];
const hipaaChecklistCategories = [
    {
        id: 'technical-security',
        name: 'Technical Security Safeguards',
        description: 'Technical measures to protect electronic protected health information (ePHI).',
        items: technicalSecurityItems
    },
    {
        id: 'administrative',
        name: 'Administrative Safeguards',
        description: 'Administrative actions, policies, and procedures to manage security measures.',
        items: administrativeItems
    },
    {
        id: 'physical',
        name: 'Physical Safeguards',
        description: 'Physical measures, policies, and procedures to protect systems and facilities.',
        items: physicalItems
    },
    {
        id: 'llm',
        name: 'LLM and AI Safeguards',
        description: 'Specific controls for using large language models and AI with PHI.',
        items: llmItems
    },
    {
        id: 'ccm',
        name: 'CCM Specific Requirements',
        description: 'Special requirements for Chronic Care Management services.',
        items: ccmItems
    }
];
function getChecklistCategory(id) {
    return hipaaChecklistCategories.find((category)=>category.id === id);
}
function getChecklistItemsByCategory(categoryId) {
    const category = getChecklistCategory(categoryId);
    return category ? category.items : [];
}
function getFilteredChecklist(categoryIds) {
    return hipaaChecklistCategories.filter((category)=>categoryIds.includes(category.id));
}
}}),
"[project]/src/app/wiki/hipaa/checklists/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>HipaaChecklistsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * HIPAA Checklists Page
 * 
 * Displays interactive HIPAA compliance checklists with completion tracking.
 * 
 * #tags: hipaa, checklists, compliance
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$WikiLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/WikiLayout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hipaa$2f$HipaaChecklistWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hipaa/HipaaChecklistWrapper.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2f$hipaa$2d$checklist$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data/hipaa-checklist-data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
// Technical Security safeguards checklist data
const technicalSecurityChecklist = [
    {
        id: 'access-control',
        name: 'Access Control',
        description: 'Technical policies and procedures for electronic information systems that maintain ePHI.',
        items: [
            {
                id: 'unique-user-id',
                category: 'access-control',
                label: 'Unique user identification for all system users',
                description: 'Assign a unique name and/or number for identifying and tracking user identity.',
                completed: true,
                priority: 'high'
            },
            {
                id: 'emergency-access',
                category: 'access-control',
                label: 'Emergency access procedure',
                description: 'Establish procedures for obtaining necessary ePHI during an emergency.',
                completed: false,
                priority: 'high'
            },
            {
                id: 'auto-logoff',
                category: 'access-control',
                label: 'Automatic logoff implemented',
                description: 'Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.',
                completed: false,
                priority: 'medium'
            },
            {
                id: 'encryption-decryption',
                category: 'access-control',
                label: 'Encryption and decryption',
                description: 'Implement a mechanism to encrypt and decrypt ePHI.',
                completed: true,
                priority: 'high'
            }
        ]
    },
    {
        id: 'audit-controls',
        name: 'Audit Controls',
        description: 'Hardware, software, and/or procedural mechanisms that record and examine activity in information systems.',
        items: [
            {
                id: 'activity-logs',
                category: 'audit-controls',
                label: 'System activity logs implemented',
                description: 'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.',
                completed: true,
                priority: 'high'
            },
            {
                id: 'audit-review',
                category: 'audit-controls',
                label: 'Regular audit log review procedure',
                description: 'Establish procedures for regularly reviewing records of information system activity.',
                completed: true,
                priority: 'medium'
            },
            {
                id: 'audit-retention',
                category: 'audit-controls',
                label: 'Audit log retention policy',
                description: 'Establish policies for audit log retention that comply with regulatory requirements.',
                completed: false,
                priority: 'medium'
            }
        ]
    },
    {
        id: 'integrity',
        name: 'Integrity',
        description: 'Policies and procedures to protect ePHI from improper alteration or destruction.',
        items: [
            {
                id: 'integrity-controls',
                category: 'integrity',
                label: 'Data integrity controls implemented',
                description: 'Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner.',
                completed: true,
                priority: 'high'
            },
            {
                id: 'data-validation',
                category: 'integrity',
                label: 'Data validation procedures',
                description: 'Implement procedures to verify the integrity of ePHI during storage and transmission.',
                completed: false,
                priority: 'medium'
            }
        ]
    },
    {
        id: 'transmission',
        name: 'Transmission Security',
        description: 'Technical security measures to guard against unauthorized access to ePHI being transmitted over a network.',
        items: [
            {
                id: 'transmission-encryption',
                category: 'transmission',
                label: 'Encryption for transmission',
                description: 'Implement a mechanism to encrypt ePHI whenever deemed appropriate.',
                completed: true,
                priority: 'high'
            },
            {
                id: 'integrity-checks',
                category: 'transmission',
                label: 'Integrity controls for transmission',
                description: 'Implement security measures to ensure that electronically transmitted ePHI is not improperly modified.',
                completed: false,
                priority: 'high'
            },
            {
                id: 'transmission-monitoring',
                category: 'transmission',
                label: 'Transmission monitoring',
                description: 'Implement procedures to monitor and log all transmissions of ePHI.',
                completed: false,
                priority: 'medium'
            }
        ]
    }
];
// Administrative safeguards checklist data
const administrativeChecklist = [
    {
        id: 'risk-analysis',
        name: 'Risk Analysis',
        description: 'Conduct an accurate and thorough assessment of potential risks and vulnerabilities.',
        items: [
            {
                id: 'risk-assessment',
                category: 'risk-analysis',
                label: 'Conduct risk assessment',
                description: 'Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI.',
                completed: true,
                priority: 'high'
            },
            {
                id: 'risk-management',
                category: 'risk-analysis',
                label: 'Implement risk management program',
                description: 'Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level.',
                completed: false,
                priority: 'high'
            },
            {
                id: 'sanction-policy',
                category: 'risk-analysis',
                label: 'Sanction policy',
                description: 'Apply appropriate sanctions against workforce members who fail to comply with security policies and procedures.',
                completed: true,
                priority: 'medium'
            },
            {
                id: 'review-procedures',
                category: 'risk-analysis',
                label: 'Information system activity review',
                description: 'Implement procedures to regularly review records of information system activity.',
                completed: false,
                priority: 'medium'
            }
        ]
    },
    {
        id: 'assigned-security',
        name: 'Assigned Security Responsibility',
        description: 'Identify the security official responsible for HIPAA Security compliance.',
        items: [
            {
                id: 'security-officer',
                category: 'assigned-security',
                label: 'Designate security official',
                description: 'Identify the security official who is responsible for the development and implementation of the security policies and procedures.',
                completed: true,
                priority: 'high'
            },
            {
                id: 'role-documentation',
                category: 'assigned-security',
                label: 'Document roles and responsibilities',
                description: 'Clearly document the security official\'s roles and responsibilities.',
                completed: true,
                priority: 'medium'
            }
        ]
    },
    {
        id: 'workforce-security',
        name: 'Workforce Security',
        description: 'Ensure that workforce members have appropriate access to ePHI.',
        items: [
            {
                id: 'authorization',
                category: 'workforce-security',
                label: 'Authorization procedures',
                description: 'Implement procedures for the authorization and/or supervision of workforce members who work with ePHI.',
                completed: false,
                priority: 'high'
            },
            {
                id: 'workforce-clearance',
                category: 'workforce-security',
                label: 'Workforce clearance procedure',
                description: 'Implement procedures to determine that the access of a workforce member to ePHI is appropriate.',
                completed: true,
                priority: 'medium'
            },
            {
                id: 'termination-procedures',
                category: 'workforce-security',
                label: 'Termination procedures',
                description: 'Implement procedures for terminating access to ePHI when employment ends.',
                completed: false,
                priority: 'high'
            }
        ]
    }
];
// Map of category filter to checklist data
const checklistData = {
    'technical': {
        title: 'Technical Security Safeguards Checklist',
        description: 'Verify implementation of technical security safeguards for ePHI.',
        categories: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2f$hipaa$2d$checklist$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hipaaChecklistCategories"][0]
        ]
    },
    'administrative': {
        title: 'Administrative Safeguards Checklist',
        description: 'Verify implementation of administrative security safeguards for ePHI.',
        categories: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2f$hipaa$2d$checklist$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hipaaChecklistCategories"][1]
        ]
    },
    'llm': {
        title: 'LLM and AI Safeguards Checklist',
        description: 'Verify implementation of safeguards for using LLMs and AI with PHI.',
        categories: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2f$hipaa$2d$checklist$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hipaaChecklistCategories"][3]
        ]
    },
    'ccm': {
        title: 'CCM Specific Requirements Checklist',
        description: 'Verify implementation of HIPAA safeguards for CCM services.',
        categories: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2f$hipaa$2d$checklist$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hipaaChecklistCategories"][4]
        ]
    },
    'all': {
        title: 'All HIPAA Safeguards Checklist',
        description: 'Comprehensive checklist for all HIPAA security safeguards.',
        categories: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2f$hipaa$2d$checklist$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hipaaChecklistCategories"]
    }
};
function HipaaChecklistsPage() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('technical');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Get the category from the URL query parameters
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            const lcCategory = categoryParam.toLowerCase();
            // First try direct matching with category IDs
            if (Object.keys(checklistData).includes(lcCategory)) {
                setSelectedCategory(lcCategory);
            } else if (lcCategory.includes('technical') || lcCategory.includes('security rule') || lcCategory.includes('transmission')) {
                setSelectedCategory('technical');
            } else if (lcCategory.includes('admin') || lcCategory.includes('physical')) {
                setSelectedCategory('administrative');
            } else if (lcCategory.includes('llm') || lcCategory.includes('ai')) {
                setSelectedCategory('llm');
            } else if (lcCategory.includes('ccm') || lcCategory.includes('chronic')) {
                setSelectedCategory('ccm');
            }
        }
    }, [
        searchParams
    ]);
    // Handle saving checklist progress
    const handleSaveChecklist = (categories)=>{
        console.log('Saving checklist:', categories);
        // In a real app, this would save to a database or localStorage
        alert('Checklist progress saved!');
    };
    // Force re-rendering when category changes to ensure the component is refreshed
    const [resetKey, setResetKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setResetKey((prev)=>prev + 1);
    }, [
        selectedCategory
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$WikiLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WikiLayout"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-gray-900 dark:text-white",
                            children: "HIPAA Compliance Checklists"
                        }, void 0, false, {
                            fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-gray-600 dark:text-gray-300",
                            children: "Interactive checklists to verify and track HIPAA compliance implementation"
                        }, void 0, false, {
                            fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                    lineNumber: 320,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory('technical'),
                                className: `px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'technical' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`,
                                children: "Technical Safeguards"
                            }, void 0, false, {
                                fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                                lineNumber: 332,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory('administrative'),
                                className: `px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'administrative' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`,
                                children: "Administrative Safeguards"
                            }, void 0, false, {
                                fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory('llm'),
                                className: `px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'llm' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`,
                                children: "LLM Safeguards"
                            }, void 0, false, {
                                fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                                lineNumber: 352,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory('ccm'),
                                className: `px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'ccm' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`,
                                children: "CCM Requirements"
                            }, void 0, false, {
                                fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                                lineNumber: 362,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory('all'),
                                className: `px-4 py-2 rounded-md text-sm font-medium ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`,
                                children: "All Safeguards"
                            }, void 0, false, {
                                fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                                lineNumber: 372,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                    lineNumber: 330,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hipaa$2f$HipaaChecklistWrapper$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HipaaChecklistWrapper"], {
                        title: checklistData[selectedCategory].title,
                        description: checklistData[selectedCategory].description,
                        initialCategories: checklistData[selectedCategory].categories,
                        lastUpdated: "March 13, 2025",
                        onSave: handleSaveChecklist
                    }, void 0, false, {
                        fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                        lineNumber: 387,
                        columnNumber: 11
                    }, this)
                }, resetKey, false, {
                    fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
            lineNumber: 319,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/wiki/hipaa/checklists/page.tsx",
        lineNumber: 318,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__cdb3ae96._.js.map