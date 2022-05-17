import { makeAutoObservable } from 'mobx';

import Vector from '../render/vector.js';

export default class ImageMetadata {
  constructor( name, mode, manual, auto, bg = '' ) {
    this.name = name;
    this.mode = mode;
    this.manual = manual;
    this.auto = auto;
    this.bg = bg;

    makeAutoObservable( this );
  }

  static fromPlain( obj ) {
    const { name, mode, manual, auto, bg } = obj;

    return new ImageMetadata( name, mode, {
      offset: Vector.fromArray( manual.offset ),
      scale: manual.scale
    }, {
      pos: Vector.fromArray( auto.pos ),
      size: Vector.fromArray( auto.size )
    }, bg )
  }

  get asPlain() {
    return {
      name: this.name,
      mode: this.mode,
      bg: this.bg,
      manual: {
        offset: this.manual.offset.toArray(),
        scale: this.manual.scale,
      },
      auto: {
        pos: this.auto.pos.toArray(),
        size: this.auto.size.toArray(),
      }
    }
  }

  setAuto( pos, size, setMode = true ) {
    this.auto.pos = pos;
    this.auto.size = size;
    if ( setMode ) this.mode = 'auto';
  }

  setManual( offset, scale, setMode = true ) {
    this.manual.offset = offset;
    this.manual.scale = scale;
    if ( setMode ) this.mode = 'manual';
  }

  setMode( mode ) {
    this.mode = mode;
  }

  setBG( bg ) {
    this.bg = bg;
  }
}
