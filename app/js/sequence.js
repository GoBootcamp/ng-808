var Sequence = function ( attributes ) {
  attributes = attributes || {};

  Object.defineProperty( this, "numSteps", {
    get: function () {
      return this._numSteps;
    },
    set: function( n ) {
      this._numSteps = n;
      this.fullSequence = this.mapFullSequence();
    }
  });

  this.loadSteps( attributes.levels || this.defaultLevels() );

  this.numSteps    = attributes.steps || this.events.length;
  this.stepsRange  = _.range( this.numSteps );

  this.reset();
};

_.extend( Sequence.prototype, {
  next: function () {
    this.currentStep = (this.currentStep + 1) % this.numSteps;

    return this.currentEvent();
  },

  reset: function () {
    this.currentStep = this.numSteps - 1;
  },

  // Because writing out an array literal with 16
  // elements is boring (and error-prone).
  defaultLevels: function () {
    return _.map( _.range(16), function () {
      return 0;
    });
  },

  mapLevels: function ( levels ) {
    return _.map( _.range(16), function ( i ) {
      var level = levels[i] || 0;
      return new SequenceEvent({level: level});
    });
  },

  clear: function () {
    this.loadSteps( this.defaultLevels() );
  },

  loadSteps: function ( steps ) {
    this.events   = this.mapLevels( steps );
    this.numSteps = steps.length;
  },

  currentEvent: function () {
    return this.events[ this.currentStep ];
  },

  eventAt: function ( step ) {
    var adjustedStep = step % this.numSteps;

    var event = this.events[ adjustedStep ];

    if ( step > this.numSteps ) {
      return new DummySequenceEvent({originalEvent: event});
    }
    else {
      return event;
    }
  },

  mapFullSequence: function () {
    return _.map( _.range(16), function ( i ) {
      return this.eventAt(i);
    }, this);
  }
});
