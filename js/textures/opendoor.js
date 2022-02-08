const openDoorTexture = `data:image/png;base64,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`