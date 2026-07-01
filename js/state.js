const STORAGE_KEY = 'mirror-fashion-state';

export const state = {
  activeCategory: 'All',
  saved: new Set(),
  bag: [],
  currentProduct: null,
  currentSize: 'M',
  currentColorIdx: 0,
  tryonCount: 0,
  lastScreen: 'screen-home',
  userPhoto: null,
  tryonPreview: null,
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.saved)) state.saved = new Set(data.saved);
    if (Array.isArray(data.bag)) state.bag = data.bag;
    if (typeof data.tryonCount === 'number') state.tryonCount = data.tryonCount;
    if (data.userPhoto) state.userPhoto = data.userPhoto;
  } catch {
    /* ignore corrupt storage */
  }
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      saved: [...state.saved],
      bag: state.bag,
      tryonCount: state.tryonCount,
      userPhoto: state.userPhoto,
    }));
  } catch {
    /* quota exceeded — skip */
  }
}

export function setUserPhoto(dataUrl) {
  state.userPhoto = dataUrl;
  saveState();
}
