// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import UnoCSS from 'unocss/astro';
import pdf from 'astro-pdf';

// https://astro.build/config
export default defineConfig({
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'AlibabaPuHuiTi-3',
			cssVariable: '--font-cn',
			fallbacks: ['Microsoft YaHei', 'sans-serif'],
			optimizedFallbacks: false,
			options: {
				variants: [
					{ src: ['./src/assets/fonts/AlibabaPuHuiTi-3-55-Regular.woff2'], weight: '400', style: 'normal' },
					{ src: ['./src/assets/fonts/AlibabaPuHuiTi-3-65-Medium.woff2'], weight: '500', style: 'normal' },
					{ src: ['./src/assets/fonts/AlibabaPuHuiTi-3-75-SemiBold.woff2'], weight: '600', style: 'normal' },
					{ src: ['./src/assets/fonts/AlibabaPuHuiTi-3-85-Bold.woff2'], weight: '700', style: 'normal' },
					{ src: ['./src/assets/fonts/AlibabaPuHuiTi-3-105-Heavy.woff2'], weight: '900', style: 'normal' },
				],
			},
		},
	],
	integrations: [
		UnoCSS({ injectReset: true }),
		pdf({
			pages: {
				'/': {
					path: '/建设用地全周期审批实务手册.pdf',
					pdf: {
						format: 'A4',
						printBackground: true,
						// preferCssPageSize: false,
						margin: {
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
						},
					},
				},
			},
		}),
	],
});
