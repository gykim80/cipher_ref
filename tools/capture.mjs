import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve( import.meta.dirname, '..' );
const output = resolve( root, 'docs/book/img' );
const port = 4174;
mkdirSync( output, { recursive: true } );
const server = spawn( 'npm', [ 'exec', 'vite', '--', '--host', '127.0.0.1', '--port', String( port ) ], { cwd: root, stdio: 'ignore' } );

async function ready() {
	for ( let attempt = 0; attempt < 60; attempt++ ) {
		try { if ( ( await fetch( `http://127.0.0.1:${ port }` ) ).ok ) return; } catch {}
		await new Promise( ( resolveWait ) => setTimeout( resolveWait, 250 ) );
	}
	throw new Error( 'Vite server did not start' );
}

try {
	await ready();
	const browser = await chromium.launch();
	const page = await browser.newPage( { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 } );
	const errors = [];
	page.on( 'pageerror', ( error ) => errors.push( error.message ) );
	for ( const lesson of [ 'scene', 'light', 'camera', 'world', 'population', 'narrative' ] ) {
		const demo = lesson === 'narrative' ? '&demo=1' : '';
		await page.goto( `http://127.0.0.1:${ port }/?lesson=${ lesson }${ demo }`, { waitUntil: 'networkidle' } );
		await page.waitForTimeout( 700 );
		await page.screenshot( { path: resolve( output, `${ lesson }.png` ) } );
		console.log( `captured ${ lesson }.png` );
	}
	await browser.close();
	if ( errors.length ) throw new Error( errors.join( '\n' ) );
} finally {
	server.kill( 'SIGTERM' );
}
