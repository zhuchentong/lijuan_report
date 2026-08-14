import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = '/home/zhuchentong/Projects/zhuchentong/lijuan_report/index.html';
const ROOT = '/home/zhuchentong/Projects/zhuchentong/pdf-report';

const html = readFileSync(SRC, 'utf8');

const STYLE_OPEN = '<style>';
const styleStart = html.indexOf(STYLE_OPEN) + STYLE_OPEN.length;
const styleEnd = html.indexOf('</style>');
const css = html.slice(styleStart, styleEnd);

const BODY_OPEN = '<body>';
const bodyStart = html.indexOf(BODY_OPEN) + BODY_OPEN.length;
const bodyEnd = html.indexOf('</body>');
const body = html.slice(bodyStart, bodyEnd);

const absolutize = (s) =>
	s
		.replace(/src="images\//g, 'src="/images/')
		.replace(/url\(['"]?fonts\//g, "url('/fonts/")
		.replace(/url\(['"]?images\//g, "url('/images/");

const cssAbs = absolutize(css);
const bodyAbs = absolutize(body);

const marker = '<div class="page ';
const starts = [];
let i = -1;
while ((i = bodyAbs.indexOf(marker, i + 1)) !== -1) starts.push(i);

if (starts.length !== 24) {
	console.error(`Expected 24 page blocks, found ${starts.length}`);
	process.exit(1);
}

const fragments = [];
for (let k = 0; k < starts.length; k++) {
	const end = k + 1 < starts.length ? starts[k + 1] : bodyAbs.length;
	fragments.push(bodyAbs.slice(starts[k], end).trim());
}

const layout = `---
interface Props {
	title?: string;
}
const { title = '建设用地全周期审批实务手册' } = Astro.props;
---
<!doctype html>
<html lang="zh-CN">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
	</head>
	<body>
		<slot />
	</body>
</html>

<style is:global>
${cssAbs}
</style>
`;

mkdirSync(join(ROOT, 'src/layouts'), { recursive: true });
writeFileSync(join(ROOT, 'src/layouts/BrochureLayout.astro'), layout);

const pagesDir = join(ROOT, 'src/components/pages');
mkdirSync(pagesDir, { recursive: true });
fragments.forEach((frag, k) => {
	const n = String(k + 1).padStart(2, '0');
	writeFileSync(join(pagesDir, `page_${n}.astro`), `${frag}\n`);
});

const imports = fragments
	.map((_, k) => {
		const n = String(k + 1).padStart(2, '0');
		return `import P${n} from '../components/pages/page_${n}.astro';`;
	})
	.join('\n');
const usage = fragments
	.map((_, k) => {
		const n = String(k + 1).padStart(2, '0');
		return `\t<P${n} />`;
	})
	.join('\n');
const index = `---
import BrochureLayout from '../layouts/BrochureLayout.astro';
${imports}
---
<BrochureLayout>
${usage}
</BrochureLayout>
`;
writeFileSync(join(ROOT, 'src/pages/index.astro'), index);

const leaks = [
	...(cssAbs.match(/(?:src|url\()['"]?(?!\/)[a-zA-Z0-9_\-\/]+\.(?:png|jpg|jpeg|svg|woff2?)/g) || []),
	...fragments.flatMap((f) => f.match(/(?:src|url\()['"]?(?!\/)[a-zA-Z0-9_\-\/]+\.(?:png|jpg|jpeg|svg|woff2?)/g) || []),
];
console.log(`Wrote layout + ${fragments.length} page components + index.`);
console.log(`Remaining relative asset refs: ${leaks.length}`);
if (leaks.length) console.log(leaks.slice(0, 10));
