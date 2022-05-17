import { makeAutoObservable } from 'mobx';

export default class UiStore {
  constructor() {
    this.view = 'menu';
    this.page = 'begin';

    this.confirm = true; // Menu view: ask users to confirm deletions
    this.cropMode = false; // Player view: defining auto crop region
    this.zoomActual = false; // Flag indicating view should zoom in to actual pixels

    makeAutoObservable( this, {
    }, { autoBind: true } );
  }

  setPage( page ) {
    this.page = page;
  }

  setView( view ) {
    this.view = view;
    if (view == 'player') ipc.send('toggle-view', true);
    else if (view == 'menu') ipc.send('toggle-view', false);
  }

  setConfirm( bool ) {
    this.confirm = bool;
  }

  setCropMode( bool ) {
    this.cropMode = bool;
  }

  setZoomActual(bool) {
    this.zoomActual = bool;
  }

}
