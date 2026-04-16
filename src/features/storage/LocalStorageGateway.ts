import type { StorageGateway, StoredRoute } from "./StorageGateway";

const RECENTS_KEY = "arrivehae.recentRoutes";
const FAVORITES_KEY = "arrivehae.favoriteRoutes";

function readRoutes(storage: Storage, key: string): StoredRoute[] {
  try {
    return JSON.parse(storage.getItem(key) ?? "[]") as StoredRoute[];
  } catch {
    return [];
  }
}

function writeRoutes(storage: Storage, key: string, routes: StoredRoute[]) {
  storage.setItem(key, JSON.stringify(routes));
}

export type { StoredRoute } from "./StorageGateway";

export class LocalStorageGateway implements StorageGateway {
  constructor(private readonly storage: Storage) {}

  saveRecent(route: StoredRoute) {
    writeRoutes(this.storage, RECENTS_KEY, [route, ...this.getRecents()]);
  }

  getRecents(): StoredRoute[] {
    return readRoutes(this.storage, RECENTS_KEY);
  }

  saveFavorite(route: StoredRoute) {
    writeRoutes(this.storage, FAVORITES_KEY, [route, ...this.getFavorites()]);
  }

  getFavorites(): StoredRoute[] {
    return readRoutes(this.storage, FAVORITES_KEY);
  }
}
