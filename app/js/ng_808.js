var ng808 = angular.module("ng808", [])

.controller("MainController", function ( $scope, $timeout ) {
  $scope.drumMachine = new DrumMachine({$timeout: $timeout});

  var helpers = {
    toggleLevel: function ( event ) {
      event.level = ( event.level + 64 );

      if ( event.level > 128 ) {
        event.level = 0;
      }
    },

    cellClass: function ( part, index ) {
      if ( part.sequence.currentStep === index ) {
        return "current";
      }
      else {
        return "";
      }
    },

    eventCellClass: function ( part, event, index ) {
      var descriptors = [];

      descriptors.push( this.cellClass(part, index) );
      descriptors.push( {0: "off", 64: "on", 128: "accent"}[event.level] );

      return descriptors.join(" ");
    },

    lastClass: function ( last ) {
      if ( last ) {
        return "last";
      }
      else {
        return "";
      }
    }
  };

  _.extend( $scope, helpers );
});
