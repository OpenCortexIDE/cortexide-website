/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';

export class WebsiteIntegrityChecker {
	private results: any[] = [];

	async checkWebsite(): Promise<void> {
		console.log('Checking website integrity...');
		
		// Check structure
		this.checkStructure();
		
		// Check assets
		this.checkAssets();
		
		// Check branding
		this.checkBranding();
		
		// Check links
		this.checkLinks();
		
		// Check SEO
		this.checkSEO();
		
		console.log('Website integrity check completed');
	}

	private checkStructure(): void {
		const requiredDirs = ['app', 'components', 'public', 'lib'];
		const requiredFiles = ['package.json', 'next.config.mjs', 'README.md'];
		
		for (const dir of requiredDirs) {
			if (fs.existsSync(dir)) {
				console.log(`✅ Found directory: ${dir}`);
			} else {
				console.log(`❌ Missing directory: ${dir}`);
			}
		}
		
		for (const file of requiredFiles) {
			if (fs.existsSync(file)) {
				console.log(`✅ Found file: ${file}`);
			} else {
				console.log(`❌ Missing file: ${file}`);
			}
		}
	}

	private checkAssets(): void {
		const publicDir = 'public';
		if (!fs.existsSync(publicDir)) {
			console.log('❌ Public directory not found');
			return;
		}
		
		const criticalAssets = ['glass_icon.svg', 'yc.svg', 'docsearch.svg'];
		for (const asset of criticalAssets) {
			const assetPath = path.join(publicDir, asset);
			if (fs.existsSync(assetPath)) {
				console.log(`✅ Found critical asset: ${asset}`);
			} else {
				console.log(`⚠️ Missing critical asset: ${asset}`);
			}
		}
	}

	private checkBranding(): void {
		const brandingFiles = ['package.json', 'README.md', 'app/layout.tsx'];
		let brandedFiles = 0;
		
		for (const file of brandingFiles) {
			if (fs.existsSync(file)) {
				const content = fs.readFileSync(file, 'utf8');
				if (content.toLowerCase().includes('cortexide')) {
					brandedFiles++;
					console.log(`✅ Found CortexIDE branding in: ${file}`);
				} else {
					console.log(`⚠️ Missing CortexIDE branding in: ${file}`);
				}
			}
		}
		
		console.log(`Branding consistency: ${brandedFiles}/${brandingFiles.length} files`);
	}

	private checkLinks(): void {
		const linkFiles = ['components/links.ts'];
		for (const file of linkFiles) {
			if (fs.existsSync(file)) {
				console.log(`✅ Found link file: ${file}`);
			} else {
				console.log(`⚠️ Missing link file: ${file}`);
			}
		}
	}

	private checkSEO(): void {
		const seoFiles = ['app/robots.ts', 'app/sitemap.ts', 'app/og/route.tsx'];
		for (const file of seoFiles) {
			if (fs.existsSync(file)) {
				console.log(`✅ Found SEO file: ${file}`);
			} else {
				console.log(`⚠️ Missing SEO file: ${file}`);
			}
		}
	}
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
	const checker = new WebsiteIntegrityChecker();
	checker.checkWebsite().catch(console.error);
}
