import type { GameShop } from "@types";
import { registerEvent } from "../register-event";
import { gamesSublevel, levelKeys } from "@main/level";
import { uploadGamesBatch } from "@main/services/library-sync";
import { HydraApi } from "@main/services/hydra-api";
import { WindowManager } from "@main/services/window-manager";

const toggleGameVisibility = async (
  _event: Electron.IpcMainInvokeEvent,
  objectId: string,
  shop: GameShop,
  isHidden: boolean
) => {
  const gameKey = levelKeys.game(shop, objectId);
  const game = await gamesSublevel.get(gameKey);

  if (game) {
    await gamesSublevel.put(gameKey, {
      ...game,
      isHidden,
    });

    if (HydraApi.isLoggedIn()) {
      uploadGamesBatch();
      HydraApi.put(`/profile/games/${shop}/${objectId}/visibility`, {
        isHidden,
      }).catch(() => {});
    }

    WindowManager.mainWindow?.webContents.send("on-library-batch-complete");
  }
};

registerEvent("toggleGameVisibility", toggleGameVisibility);
