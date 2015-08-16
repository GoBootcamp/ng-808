var Part = function ( attributes ) {
  Object.defineProperties( this, {
    currentStep: {
      get: function () {
        return this.sequence.currentStep;
      }
    }
  });

  this.name       = attributes.name;
  this.sampleName = attributes.sampleName;
  this.sequence   = new Sequence();

  this.initAudio();
  this.reset();
};

_.extend( Part.prototype, {
  advanceSequence: function ( by ) {
    this.currentEvent = this.sequence.advanceBy( by );
  },

  seekTo: function ( n ) {
    this.currentEvent = this.sequence.seekTo( n );
  },

  reset: function () {
    this.sequence.reset();
    this.advanceSequence();
  },

  samplePath: function () {
    return "samples/" + this.sampleName + ".wav";
  },

  initAudio: function () {
    if ( this.sampleName ) {
      this.sample = new Wad({
        source: this.samplePath(),
        volume: 0.0
      });
    }
  },

  playEvent: function ( event ) {
    if ( !this.sample ) { return; }

    if ( typeof(event) === "undefined" ) {
      event = this.currentEvent;
    }

    this.playSample( event.level );
  },

  playSample: function ( level ) {
    if ( level > 0 ) {
      this.sample.play({volume: level, callback: _.bind(_.partial( this.activateVisualizer, level), this)});
    }
  },

  activateVisualizer: function ( level ) {
    if ( this.sample.soundSource ) {
      this.bufferOscilloscope.connectStream( this.sample.soundSource );
      this.bufferOscilloscope.level =  level;
    }
  },

  loadSequence: function ( levels ) {
    this.sequence.loadSteps( levels );
    this.loadCurrentEvent();
  },

  clearSequence: function () {
    this.sequence.clear();
    this.loadCurrentEvent();
  },

  loadCurrentEvent: function () {
    this.currentEvent = this.sequence.currentEvent();
  },

  dumpSequence: function () {
    return this.sequence.dump();
  },

  setupBufferOscilloscope: function ( element ) {
    this.bufferOscilloscope = new BufferOscilloscope({element: element, sound: this.sample});
    this.bufferOscilloscope.draw();
  }
});
