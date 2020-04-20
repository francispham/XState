const { createMachine, interpret } = XState;

const dragDropMachine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        // Event: NextState
        mousedown: {
          target: 'dragging'
        }
      }
    },
    dragging: {
      on: {
        mouseup: {
          target: 'idle'
        }
      }
    },
  },
});

console.log(dragDropMachine.transition('idle', 'mousedown'))

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    console.log(state);
  })
  .start();