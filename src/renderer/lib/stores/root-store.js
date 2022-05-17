import PrefsStore from './prefs-store.js';
import SourcesStore from './sources-store.js';
import UiStore from './ui-store.js';
import CollectionsStore from './collections-store.js';

export default class RootStore {
  constructor() {
    this.prefStore = new PrefsStore(this);
    this.srcStore = new SourcesStore(this);
    this.uiStore = new UiStore(this);
    this.colStore = new CollectionsStore(this);
  }
}
