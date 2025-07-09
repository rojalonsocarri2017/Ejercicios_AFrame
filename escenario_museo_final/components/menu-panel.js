
AFRAME.registerComponent("menu-panel", {
  schema: {
    panel: { type: "selector" },
    offsetY: { type: "number", default: 1 },
    offsetZ: { type: "number", default: 0.5 }
  },
  init: function () {
    const button = this.el;
    const panel = this.data.panel;
    const offsetY = this.data.offsetY;
    const offsetZ = this.data.offsetZ;

    button.addEventListener("click", () => {
      const camera = document.querySelector("[camera]");
      const cameraWorldPos = new THREE.Vector3();
      const cameraDirection = new THREE.Vector3();

      camera.object3D.getWorldPosition(cameraWorldPos);
      camera.object3D.getWorldDirection(cameraDirection);
      cameraDirection.normalize();

      const distance = this.data.distance;
      
      // Si con eso queda detrás, prueba la siguiente línea en lugar de la anterior:
      let panelPos = cameraWorldPos.clone().add(cameraDirection.clone().multiplyScalar(-distance));

      panelPos.y += this.data.offsetY;

      this.data.panel.object3D.position.copy(panelPos);
      this.data.panel.object3D.lookAt(cameraWorldPos);
      this.data.panel.setAttribute("visible", true);
    });
  }
});




