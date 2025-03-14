// Zed HyperPower Extension
import {Extension} from "zed";

export default class HyperPower extends Extension {
  constructor() {
    super();
    this.particles = [];
    this.wowMode = true;
    this.eventHandlers = {};
    this.particleContainer = this.createParticleContainer();
  }

  activate() {
    this.eventHandlers.triggerEffects = this.triggerEffects.bind(this);
    this.editor.on("input", this.eventHandlers.triggerEffects);
    document.body.appendChild(this.particleContainer);
  }

  deactivate() {
    this.editor.off("input", this.eventHandlers.triggerEffects);
    if (this.particleContainer.parentElement) {
      this.particleContainer.remove();
    }
    this.particles = [];
  }

  createParticleContainer() {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.pointerEvents = "none";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.zIndex = "10000";
    return container;
  }

  triggerEffects(event) {
    this.spawnParticles(event);
    if (this.wowMode) this.screenShake();
  }

  spawnParticles(event) {
    const cursorPos = this.editor.getCursorScreenPosition();
    const particleCount = Math.floor(Math.random() * 10 + 5);

    for (let i = 0; i < particleCount; i++) {
      const particle = this.createParticle(cursorPos);
      this.particles.push(particle);
      this.particleContainer.appendChild(particle.element);

      setTimeout(() => {
        if (particle.element.parentElement) {
          particle.element.remove();
        }
        this.particles.splice(this.particles.indexOf(particle), 1);
      }, particle.lifetime);
    }
  }

  createParticle(cursorPos) {
    const size = Math.random() * 4 + 2;
    const lifetime = Math.random() * 800 + 600;
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.background = "rgba(255,69,0,0.9)";
    element.style.borderRadius = "50%";
    element.style.left = `${cursorPos.left + Math.random() * 20 - 10}px`;
    element.style.top = `${cursorPos.top + Math.random() * 20 - 10}px`;
    return {
      element,
      lifetime
    };
  }

  screenShake() {
    const intensity = 5;
    const duration = 100;
    const editor = document.querySelector(".zed-editor");
    if (!editor) return;

    const original = editor.style.transform;
    const shakes = Math.floor(duration / 50);

    let count = 0;
    const interval = setInterval(() => {
      const x = Math.random() * intensity - intensity / 2;
      const y = Math.random() * intensity - intensity / 2;
      editor.style.transform = `translate(${x}px, ${y}px)`;
      count++;
      if (count >= shakes) {
        clearInterval(interval);
        editor.style.transform = original;
      }
    }, 50);
  }
}