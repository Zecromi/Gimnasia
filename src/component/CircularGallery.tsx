import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

import './CircularGallery.css';

type GL = Renderer['gl'];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 30px monospace',
  color: string = 'black'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.15;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.02;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
  bgColor?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  bgColor: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    bgColor = "transparent"
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.bgColor = bgColor;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform vec3 uBgColor;
        uniform float uHasBg;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          // Zoom/Scale factor to make the image smaller within the card
          float zoom = 1.25; 
          vec2 centeredUv = (uv - 0.5) * zoom + 0.5;
          
          vec4 color = vec4(0.0);
          if (centeredUv.x >= 0.0 && centeredUv.x <= 1.0 && centeredUv.y >= 0.0 && centeredUv.y <= 1.0) {
            color = texture2D(tMap, centeredUv);
          }
          
          vec3 finalColor = color.rgb;
          if (uHasBg > 0.5) {
            finalColor = mix(uBgColor, color.rgb, color.a);
          }
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uBgColor: { value: this.hexToRgb(this.bgColor) },
        uHasBg: { value: this.bgColor !== "transparent" ? 1.0 : 0.0 }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  hexToRgb(hex: string) {
    if (hex === "transparent") return [0, 0, 0];
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }

  update(scroll: { current: number; last: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1000;
    this.plane.scale.y = (this.viewport.height * (600 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (500 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.0;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

interface AppConfig {
  items?: { image: string; text: string; bgColor?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onItemClick?: (item: { image: string; text: string }, index: number) => void;
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string; bgColor?: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  isVisible: boolean = true;
  isLoopRunning: boolean = false;
  observer?: IntersectionObserver;

  boundUpdate!: () => void;
  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: (e: MouseEvent | TouchEvent) => void;

  isDown: boolean = false;
  isTouch: boolean = false;
  start: number = 0;
  startTime: number = 0;
  lastTouchX: number = 0;
  lastTouchTime: number = 0;
  velocity: number = 0;
  onItemClick?: (item: { image: string; text: string }, index: number) => void;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      onItemClick
    }: AppConfig
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onItemClick = onItemClick;
    this.boundUpdate = this.update.bind(this);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.requestUpdate();
    this.addEventListeners();
    this.initObserver();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 10,
      widthSegments: 20
    });
  }

  createMedias(
    items: { image: string; text: string; bgColor?: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems = [
      {
        image: `https://picsum.photos/seed/1/800/600?grayscale`,
        text: 'Bridge'
      },
      {
        image: `https://picsum.photos/seed/2/800/600?grayscale`,
        text: 'Desk Setup'
      },
      {
        image: `https://picsum.photos/seed/3/800/600?grayscale`,
        text: 'Waterfall'
      },
      {
        image: `https://picsum.photos/seed/4/800/600?grayscale`,
        text: 'Strawberries'
      },
      {
        image: `https://picsum.photos/seed/5/800/600?grayscale`,
        text: 'Deep Diving'
      },
      {
        image: `https://picsum.photos/seed/16/800/600?grayscale`,
        text: 'Train Track'
      },
      {
        image: `https://picsum.photos/seed/17/800/600?grayscale`,
        text: 'Santorini'
      },
      {
        image: `https://picsum.photos/seed/8/800/600?grayscale`,
        text: 'Blurry Lights'
      },
      {
        image: `https://picsum.photos/seed/9/800/600?grayscale`,
        text: 'New York'
      },
      {
        image: `https://picsum.photos/seed/10/800/600?grayscale`,
        text: 'Good Boy'
      },
      {
        image: `https://picsum.photos/seed/21/800/600?grayscale`,
        text: 'Coastline'
      },
      {
        image: `https://picsum.photos/seed/12/800/600?grayscale`,
        text: 'Palm Trees'
      }
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        bgColor: data.bgColor
      });
    });
  }

  initObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(([entry]) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) {
          this.requestUpdate();
        }
      }, { threshold: 0.05 });
      this.observer.observe(this.container);
    }
  }

  requestUpdate() {
    if (!this.isLoopRunning && this.isVisible) {
      this.isLoopRunning = true;
      this.raf = window.requestAnimationFrame(this.boundUpdate);
    }
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.isTouch = 'touches' in e;
    this.scroll.position = this.scroll.current;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    this.start = clientX;
    this.lastTouchX = clientX;
    this.startTime = performance.now();
    this.lastTouchTime = this.startTime;
    this.velocity = 0;
    this.requestUpdate();
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const now = performance.now();
    const dt = now - this.lastTouchTime;

    // Track instantaneous velocity (pixels per millisecond) with weighted smoothing
    if (dt > 8) {
      const dx = this.lastTouchX - clientX;
      const currentVelocity = dx / dt;
      this.velocity = this.velocity * 0.35 + currentVelocity * 0.65;
      this.lastTouchX = clientX;
      this.lastTouchTime = now;
    }

    // Dynamic scale mapping:
    // When dragging on a small screen (mobile), a swipe should move items proportionately.
    const screenW = Math.max(this.screen?.width || window.innerWidth, 1);
    const worldPerPixel = (this.viewport?.width || 10) / screenW;

    // On touch devices, increase gesture responsiveness so movements are swift, agile, and natural
    const touchFactor = this.isTouch ? 2.5 : 1.2;
    const distance = (this.start - clientX) * worldPerPixel * touchFactor * (this.scrollSpeed * 0.85);
    this.scroll.target = (this.scroll.position ?? 0) + distance;
    this.requestUpdate();
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;

    const endX = 'changedTouches' in (e as any)
      ? (e as any).changedTouches[0].clientX
      : (e as MouseEvent).clientX;
    const distanceMoved = Math.abs(this.start - (endX || this.start));
    const duration = performance.now() - this.startTime;

    // Click / tap detection
    if (distanceMoved < 8 && duration < 300 && this.onItemClick) {
      this.handleClick(endX || this.start);
    }

    this.isDown = false;

    // Apply fluid inertial flick momentum when swiping on touch
    if (this.isTouch && Math.abs(this.velocity) > 0.06) {
      const screenW = Math.max(this.screen?.width || window.innerWidth, 1);
      const worldPerPixel = (this.viewport?.width || 10) / screenW;
      const clampedVelocity = Math.max(Math.min(this.velocity, 3.5), -3.5);
      const momentum = clampedVelocity * 220 * worldPerPixel * this.scrollSpeed;
      this.scroll.target += momentum;
    }

    this.onCheck();
    this.requestUpdate();
  }

  handleClick(mouseX: number) {
    if (!this.onItemClick) return;

    const rect = this.container.getBoundingClientRect();
    const normX = ((mouseX - rect.left) / rect.width) * 2 - 1;
    const worldX = normX * (this.viewport.width / 2);

    let closestMedia: Media | null = null;
    let minDistance = Infinity;
    let closestIndex = -1;

    this.medias.forEach((media, index) => {
      const distance = Math.abs(media.plane.position.x - worldX);
      if (distance < minDistance) {
        minDistance = distance;
        closestMedia = media;
        closestIndex = index;
      }
    });

    if (closestMedia && minDistance < (closestMedia as Media).plane.scale.x / 2) {
      const originalIndex = closestIndex % (this.mediasImages.length / 2);
      this.onItemClick(this.mediasImages[closestIndex], originalIndex);
    }
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    const delta = wheelEvent.deltaY || (wheelEvent as any).wheelDelta || (wheelEvent as any).detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.requestUpdate();
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
    this.requestUpdate();
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
    this.requestUpdate();
  }

  update() {
    // When dragging on touch, use immediate tracking ease so it tracks the finger directly
    // When released, smoothly decelerate
    const activeEase = this.isDown
      ? (this.isTouch ? 0.35 : 0.18)
      : Math.max(this.scroll.ease, 0.05);

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, activeEase);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;

    const diff = Math.abs(this.scroll.target - this.scroll.current);
    if (this.isVisible && (diff > 0.0005 || this.isDown)) {
      this.raf = window.requestAnimationFrame(this.boundUpdate);
    } else {
      this.isLoopRunning = false;
    }
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener('resize', this.boundOnResize);

    this.container.addEventListener('mousewheel', this.boundOnWheel, { passive: true } as any);
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true } as any);
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });

    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp, { passive: true });
    window.addEventListener('touchcancel', this.boundOnTouchUp, { passive: true });
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    this.isLoopRunning = false;
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.boundOnResize);

    this.container.removeEventListener('mousewheel', this.boundOnWheel as any);
    this.container.removeEventListener('wheel', this.boundOnWheel as any);
    this.container.removeEventListener('mousedown', this.boundOnTouchDown);
    this.container.removeEventListener('touchstart', this.boundOnTouchDown);

    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    window.removeEventListener('touchcancel', this.boundOnTouchUp);

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string; bgColor?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onItemClick?: (item: { image: string; text: string }, index: number) => void;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px sans-serif',
  scrollSpeed = 2,
  scrollEase = 0.05,
  onItemClick
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      onItemClick
    });
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, onItemClick]);
  return <div className="circular-gallery" ref={containerRef} />;
}

