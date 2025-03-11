// Zed HyperPower Extension (Updated with Particle Effects & WOW Mode)
// Author: Joey King

import { Extension } from "zed";

export default class HyperPower extends Extension {
  constructor() {
    super();
    this.particles = [];
    this.wowMode = true; // Enable screen shake in wow mode
  }

  activate() {
    this.editor.on("input", (event) => {
      this.spawnParticles(event);
      if (this.wowMode) this.screenShake();
    });
  }

  deactivate() {
    this.editor.off("input", this.spawnParticles);
    this.editor.off("input", this.screenShake);
  }

  spawnParticles(event) {
    const editor = this.editor;
    const cursorPos = editor.getCursorScreenPosition();
    const particleCount = Math.random() * 10 + 5;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: cursorPos.left + Math.random() * 20 - 10,
        y: cursorPos.top + Math.random() * 20 - 10,
        velocity: { x: Math.random() - 0.5, y: Math.random() - 0.5 },
        lifetime: 1000,
      });
    }
    this.renderParticles();
  }

  renderParticles() {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.pointerEvents = "none";
    container.style.zIndex = "10000";
    document.body.appendChild(container);

    this.particles.forEach((particle, index) => {
      const elem = document.createElement("div");
      elem.style.position = "absolute";
      elem.style.width = "4px";
      elem.style.height = "4px";
      elem.style.background = "rgba(255,69,0,0.9)";
      elem.style.borderRadius = "50%";
      elem.style.left = `${particle.x}px`;
      elem.style.top = `${particle.y}px`;
      container.appendChild(elem);

      setTimeout(() => {
        elem.remove();
        this.particles.splice(index, 1);
      }, particle.lifetime);
    });
  }

  screenShake() {
    const intensity = 5;
    const duration = 100;
    const editor = document.querySelector(".zed-editor");
    if (!editor) return;

    const originalTransform = editor.style.transform;

    const shakeInterval = setInterval(() => {
      const x = Math.random() * intensity - intensity / 2;
      const y = Math.random() * intensity - intensity / 2;
      editor.style.transform = `translate(${x}px, ${y}px)`;
    }, 50);

    setTimeout(() => {
      clearInterval(shakeInterval);
      editor.style.transform = originalTransform;
    }, duration);
  }
}
