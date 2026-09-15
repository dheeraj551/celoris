import * as THREE from 'three';

export const buildProceduralModel = (
  type: string,
  primColor: string,
  secColor: string,
  wireframeOnly = false
): THREE.Group => {
  const group = new THREE.Group();
  group.name = 'ProceduralModelRoot';

  const pColor = new THREE.Color(primColor || '#059669');
  const sColor = new THREE.Color(secColor || '#10b981');
  const darkMetalColor = new THREE.Color('#1e293b');
  const lightMetalColor = new THREE.Color('#94a3b8');

  const createMat = (color: THREE.Color, metal: number, rough: number, emissive?: THREE.Color) => {
    if (wireframeOnly) {
      return new THREE.MeshBasicMaterial({
        color: emissive || color,
        wireframe: true,
      });
    }
    return new THREE.MeshStandardMaterial({
      color,
      metalness: metal,
      roughness: rough,
      emissive: emissive || new THREE.Color(0x000000),
      emissiveIntensity: emissive ? 1.2 : 0,
    });
  };

  if (type === 'drone') {
    // Sci-Fi VTOL Combat Drone
    const coreGeo = new THREE.SphereGeometry(0.75, 24, 24);
    coreGeo.scale(1.2, 0.6, 1.4);
    const coreMesh = new THREE.Mesh(coreGeo, createMat(darkMetalColor, 0.85, 0.25));
    group.add(coreMesh);

    // Armor shell panels
    const armorGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.3, 16);
    armorGeo.scale(1.1, 0.8, 1.2);
    const armorMesh = new THREE.Mesh(armorGeo, createMat(pColor, 0.7, 0.3));
    armorMesh.position.y = 0.15;
    group.add(armorMesh);

    // Center optical sensor
    const eyeGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const eyeMesh = new THREE.Mesh(eyeGeo, createMat(new THREE.Color('#030712'), 0.1, 0.1, sColor));
    eyeMesh.position.set(0, 0, 0.95);
    group.add(eyeMesh);

    // Rotor arms & thruster pods
    const armGeo = new THREE.BoxGeometry(2.4, 0.1, 0.2);
    const arm1 = new THREE.Mesh(armGeo, createMat(darkMetalColor, 0.9, 0.4));
    arm1.rotation.y = Math.PI / 4;
    const arm2 = new THREE.Mesh(armGeo, createMat(darkMetalColor, 0.9, 0.4));
    arm2.rotation.y = -Math.PI / 4;
    group.add(arm1, arm2);

    const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    angles.forEach((ang) => {
      const podGeo = new THREE.CylinderGeometry(0.35, 0.32, 0.4, 16);
      const podMesh = new THREE.Mesh(podGeo, createMat(lightMetalColor, 0.8, 0.3));
      podMesh.position.set(Math.cos(ang) * 1.3, 0.05, Math.sin(ang) * 1.3);

      const glowGeo = new THREE.TorusGeometry(0.28, 0.04, 12, 24);
      const glowMesh = new THREE.Mesh(glowGeo, createMat(new THREE.Color('#000'), 0, 1, pColor));
      glowMesh.rotation.x = Math.PI / 2;
      glowMesh.position.y = -0.18;
      podMesh.add(glowMesh);

      group.add(podMesh);
    });

    const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8);
    const ant = new THREE.Mesh(antGeo, createMat(lightMetalColor, 0.9, 0.2));
    ant.position.set(0.35, 0.6, -0.6);
    ant.rotation.x = -0.2;
    group.add(ant);
  } else if (type === 'helmet') {
    // Cyberpunk Samurai Helmet
    const domeGeo = new THREE.SphereGeometry(0.9, 32, 24);
    domeGeo.scale(0.9, 1.1, 1.05);
    const dome = new THREE.Mesh(domeGeo, createMat(darkMetalColor, 0.75, 0.3));
    group.add(dome);

    const visorGeo = new THREE.BoxGeometry(1.2, 0.22, 0.6);
    const visor = new THREE.Mesh(visorGeo, createMat(new THREE.Color('#000'), 0.1, 0.1, pColor));
    visor.position.set(0, 0.1, 0.7);
    group.add(visor);

    const cheekGeo = new THREE.BoxGeometry(0.35, 0.8, 0.5);
    const cheekL = new THREE.Mesh(cheekGeo, createMat(pColor, 0.65, 0.35));
    cheekL.position.set(0.7, -0.3, 0.4);
    cheekL.rotation.y = 0.3;
    const cheekR = new THREE.Mesh(cheekGeo, createMat(pColor, 0.65, 0.35));
    cheekR.position.set(-0.7, -0.3, 0.4);
    cheekR.rotation.y = -0.3;
    group.add(cheekL, cheekR);

    const hornGeo = new THREE.ConeGeometry(0.18, 1.1, 8);
    hornGeo.rotateZ(0.4);
    const hornL = new THREE.Mesh(hornGeo, createMat(sColor, 0.9, 0.2));
    hornL.position.set(0.5, 0.9, 0.1);
    const hornR = new THREE.Mesh(hornGeo.clone().rotateZ(-0.8), createMat(sColor, 0.9, 0.2));
    hornR.position.set(-0.5, 0.9, 0.1);
    group.add(hornL, hornR);

    const neckGeo = new THREE.TorusGeometry(0.75, 0.14, 12, 32);
    neckGeo.rotateX(Math.PI / 2);
    const neck = new THREE.Mesh(neckGeo, createMat(lightMetalColor, 0.8, 0.4));
    neck.position.y = -0.7;
    group.add(neck);
  } else if (type === 'sword') {
    // Plasma Relic Greatsword
    const bladeGeo = new THREE.BoxGeometry(0.24, 2.8, 0.05);
    const blade = new THREE.Mesh(bladeGeo, createMat(lightMetalColor, 0.95, 0.15));
    blade.position.y = 0.7;
    group.add(blade);

    const coreGeo = new THREE.BoxGeometry(0.06, 2.5, 0.06);
    const core = new THREE.Mesh(coreGeo, createMat(new THREE.Color('#000'), 0, 1, pColor));
    core.position.y = 0.7;
    group.add(core);

    const guardGeo = new THREE.BoxGeometry(1.2, 0.18, 0.22);
    const guard = new THREE.Mesh(guardGeo, createMat(sColor, 0.8, 0.3));
    guard.position.y = -0.7;
    group.add(guard);

    const hiltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
    const hilt = new THREE.Mesh(hiltGeo, createMat(darkMetalColor, 0.4, 0.7));
    hilt.position.y = -1.2;
    group.add(hilt);

    const pommelGeo = new THREE.DodecahedronGeometry(0.18);
    const pommel = new THREE.Mesh(pommelGeo, createMat(sColor, 0.85, 0.25));
    pommel.position.y = -1.7;
    group.add(pommel);
  } else if (type === 'car') {
    // Futuristic Hypercar
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.45, 2.8);
    bodyGeo.scale(1, 0.8, 1);
    const body = new THREE.Mesh(bodyGeo, createMat(pColor, 0.9, 0.2));
    body.position.y = 0.3;
    group.add(body);

    const canopyGeo = new THREE.SphereGeometry(0.55, 16, 16);
    canopyGeo.scale(1.1, 0.65, 1.8);
    const canopy = new THREE.Mesh(canopyGeo, createMat(new THREE.Color('#090d16'), 0.2, 0.05));
    canopy.position.set(0, 0.55, -0.1);
    group.add(canopy);

    const wheelPos = [
      [-0.78, 0.25, 0.85],
      [0.78, 0.25, 0.85],
      [-0.78, 0.25, -0.85],
      [0.78, 0.25, -0.85],
    ];
    wheelPos.forEach(([x, y, z]) => {
      const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 20);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheel = new THREE.Mesh(wheelGeo, createMat(darkMetalColor, 0.5, 0.6));
      wheel.position.set(x, y, z);

      const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, createMat(sColor, 0.9, 0.2));
      rim.position.set(x, y, z);
      group.add(wheel, rim);
    });

    const lightBarGeo = new THREE.BoxGeometry(1.2, 0.08, 0.1);
    const lightBar = new THREE.Mesh(lightBarGeo, createMat(new THREE.Color('#000'), 0, 1, sColor));
    lightBar.position.set(0, 0.4, -1.4);
    group.add(lightBar);
  } else if (type === 'building') {
    // Neo-Brutalist Architecture
    const baseGeo = new THREE.BoxGeometry(2.4, 0.3, 2.4);
    const base = new THREE.Mesh(baseGeo, createMat(new THREE.Color('#475569'), 0.2, 0.8));
    base.position.y = -0.8;
    group.add(base);

    const tower1Geo = new THREE.BoxGeometry(1.1, 2.2, 1.1);
    const tower1 = new THREE.Mesh(tower1Geo, createMat(new THREE.Color('#64748b'), 0.2, 0.75));
    tower1.position.set(-0.4, 0.4, -0.2);
    group.add(tower1);

    const tower2Geo = new THREE.BoxGeometry(0.9, 1.6, 0.9);
    const tower2 = new THREE.Mesh(tower2Geo, createMat(new THREE.Color('#94a3b8'), 0.3, 0.7));
    tower2.position.set(0.5, 0.1, 0.4);
    group.add(tower2);

    const bridgeGeo = new THREE.BoxGeometry(1.6, 0.25, 0.7);
    const bridge = new THREE.Mesh(bridgeGeo, createMat(pColor, 0.7, 0.3));
    bridge.position.set(0, 0.8, 0);
    group.add(bridge);

    const glassGeo = new THREE.BoxGeometry(0.8, 1.4, 0.05);
    const glass = new THREE.Mesh(glassGeo, createMat(new THREE.Color('#0284c7'), 0.1, 0.1, pColor));
    glass.position.set(0.5, 0.2, 0.88);
    group.add(glass);
  } else if (type === 'crystal') {
    // Aether Crystal Obelisk
    const crystalGeo = new THREE.OctahedronGeometry(1.1, 0);
    crystalGeo.scale(0.8, 2.0, 0.8);
    const crystal = new THREE.Mesh(crystalGeo, createMat(pColor, 0.4, 0.1, sColor));
    crystal.position.y = 0.2;
    group.add(crystal);

    for (let i = 0; i < 5; i++) {
      const shardGeo = new THREE.OctahedronGeometry(0.25, 0);
      shardGeo.scale(0.4, 1.2, 0.4);
      const shard = new THREE.Mesh(shardGeo, createMat(sColor, 0.3, 0.2));
      const angle = (i / 5) * Math.PI * 2;
      shard.position.set(Math.cos(angle) * 1.3, i % 2 === 0 ? 0.3 : -0.3, Math.sin(angle) * 1.3);
      shard.rotation.z = 0.2 * i;
      group.add(shard);
    }

    const ringGeo = new THREE.TorusGeometry(1.4, 0.06, 8, 32);
    ringGeo.rotateX(Math.PI / 2.3);
    const ring = new THREE.Mesh(ringGeo, createMat(darkMetalColor, 0.9, 0.3, pColor));
    group.add(ring);
  } else {
    // Battle Bot / Mech
    const torsoGeo = new THREE.BoxGeometry(1.1, 1.1, 0.9);
    const torso = new THREE.Mesh(torsoGeo, createMat(pColor, 0.75, 0.3));
    torso.position.y = 0.5;
    group.add(torso);

    const headGeo = new THREE.BoxGeometry(0.6, 0.45, 0.6);
    const head = new THREE.Mesh(headGeo, createMat(darkMetalColor, 0.8, 0.3));
    head.position.set(0, 1.2, 0);
    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.1, 0.1),
      createMat(new THREE.Color('#000'), 0, 1, sColor)
    );
    eye.position.set(0, 1.2, 0.32);
    group.add(head, eye);

    const armGeo = new THREE.CylinderGeometry(0.16, 0.14, 1.2, 12);
    const armL = new THREE.Mesh(armGeo, createMat(lightMetalColor, 0.8, 0.4));
    armL.position.set(0.85, 0.4, 0);
    armL.rotation.z = -0.2;
    const armR = new THREE.Mesh(armGeo, createMat(lightMetalColor, 0.8, 0.4));
    armR.position.set(-0.85, 0.4, 0);
    armR.rotation.z = 0.2;
    group.add(armL, armR);

    const legGeo = new THREE.BoxGeometry(0.35, 1.2, 0.45);
    const legL = new THREE.Mesh(legGeo, createMat(darkMetalColor, 0.85, 0.35));
    legL.position.set(0.4, -0.6, 0);
    const legR = new THREE.Mesh(legGeo, createMat(darkMetalColor, 0.85, 0.35));
    legR.position.set(-0.4, -0.6, 0);
    group.add(legL, legR);
  }

  return group;
};
