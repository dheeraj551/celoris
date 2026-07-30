export async function generate3DModelMock(prompt: string, imageBase64?: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      let url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";
      
      if (lowerPrompt.includes("helmet")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb";
      } else if (lowerPrompt.includes("shoe") || lowerPrompt.includes("sneaker")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb";
      } else if (lowerPrompt.includes("avocado")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb";
      } else if (lowerPrompt.includes("car") || lowerPrompt.includes("vehicle")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb";
      } else if (lowerPrompt.includes("chair") || lowerPrompt.includes("seat")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb";
      } else if (lowerPrompt.includes("bag") || lowerPrompt.includes("backpack")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb"; // Using BoomBox as a placeholder for a bag
      } else if (lowerPrompt.includes("potion") || lowerPrompt.includes("flask")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb"; // Using WaterBottle as a placeholder for a potion
      } else if (lowerPrompt.includes("sword") || lowerPrompt.includes("blade")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb"; // Placeholder for sword
      } else if (lowerPrompt.includes("shield") || lowerPrompt.includes("buckler")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SciFiHelmet/glTF-Binary/SciFiHelmet.glb"; // Placeholder for shield
      } else if (lowerPrompt.includes("house") || lowerPrompt.includes("building") || lowerPrompt.includes("home") || lowerPrompt.includes("cottage") || lowerPrompt.includes("cabin") || lowerPrompt.includes("apartment")) {
        url = "https://raw.githubusercontent.com/graasp/graasp-app-insulation-simulator/main/public/House.glb";
      } else if (lowerPrompt.includes("fox") || lowerPrompt.includes("animal") || lowerPrompt.includes("dog") || lowerPrompt.includes("wolf") || lowerPrompt.includes("cat")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb";
      } else if (lowerPrompt.includes("truck") || lowerPrompt.includes("delivery") || lowerPrompt.includes("van")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb";
      } else if (lowerPrompt.includes("man") || lowerPrompt.includes("person") || lowerPrompt.includes("character") || lowerPrompt.includes("human") || lowerPrompt.includes("runner") || lowerPrompt.includes("guy")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb";
      } else if (lowerPrompt.includes("fish") || lowerPrompt.includes("shark") || lowerPrompt.includes("salmon") || lowerPrompt.includes("sea")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb";
      } else if (lowerPrompt.includes("lantern") || lowerPrompt.includes("lamp") || lowerPrompt.includes("light") || lowerPrompt.includes("torch")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb";
      } else if (lowerPrompt.includes("box") || lowerPrompt.includes("cube") || lowerPrompt.includes("block")) {
        url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF-Binary/BoxTextured.glb";
      }
      
      resolve(url);
    }, 3000); // Simulate network delay
  });
}
