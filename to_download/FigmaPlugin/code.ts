figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "batch-image-upload" && msg.items) {
    for (const item of msg.items) {
      try {
        const node = figma.getNodeById(item.nodeId);
        if (!node) {
          console.warn(`❌ Node ${item.nodeId} not found.`);
          continue;
        }

        if (!("fills" in node)) {
          console.warn(`❌ Node ${node.name} does not support fills.`);
          continue;
        }

        const image = figma.createImage(new Uint8Array(item.bytes));
        const newFill = {
          type: "IMAGE",
          scaleMode: "FILL",
          imageHash: image.hash,
        };

        node.fills = [newFill];
        figma.notify(`✔️ Applied image to ${node.name}`);
      } catch (err) {
        console.error(`❌ Error applying image to ${item.nodeId}:`, err);
      }
    }

    figma.closePlugin("✅ All images processed.");
  } else {
    figma.closePlugin("❌ No valid image data received.");
  }
};
