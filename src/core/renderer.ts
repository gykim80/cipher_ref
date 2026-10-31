import { ACESFilmicToneMapping, AmbientLight, Clock, Color, DirectionalLight, Fog, GridHelper, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';

export interface IRenderHost {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	clock: Clock;
	lookAt: Vector3;
}

export function createRenderHost( canvas: HTMLCanvasElement, lesson: string ): IRenderHost {
	const scene = new Scene();
	scene.background = new Color( lesson === 'scene' ? 0x18202b : 0xb9d6df );
	scene.fog = lesson === 'scene' ? null : new Fog( 0xb9d6df, 32, 72 );
	const camera = new PerspectiveCamera( 32, 1, 0.1, 160 );
	camera.position.set( 15, 13, 15 );
	const renderer = new WebGLRenderer( { canvas, antialias: true } );
	renderer.setPixelRatio( Math.min( devicePixelRatio, 2 ) );
	renderer.shadowMap.enabled = true;
	renderer.toneMapping = ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;

	if ( lesson === 'scene' ) scene.add( new GridHelper( 20, 20, 0x6b8baa, 0x334455 ) );
	const sun = new DirectionalLight( 0xfff0cf, lesson === 'scene' ? 2 : 4 );
	sun.position.set( -12, 18, 9 );
	sun.castShadow = true;
	sun.shadow.mapSize.set( 2048, 2048 );
	sun.shadow.camera.left = -24; sun.shadow.camera.right = 24; sun.shadow.camera.top = 24; sun.shadow.camera.bottom = -24;
	scene.add( sun, new AmbientLight( lesson === 'scene' ? 0x8aa0bc : 0x7f99a8, 1.7 ) );
	return { scene, camera, renderer, clock: new Clock(), lookAt: new Vector3() };
}

export function resizeAndRender( host: IRenderHost ): void {
	const width = host.renderer.domElement.clientWidth;
	const height = host.renderer.domElement.clientHeight;
	if ( host.renderer.domElement.width !== width || host.renderer.domElement.height !== height ) {
		host.renderer.setSize( width, height, false );
		host.camera.aspect = width / height;
		host.camera.updateProjectionMatrix();
	}
	host.camera.lookAt( host.lookAt );
	host.renderer.render( host.scene, host.camera );
}
