const { createMachine } = XState;

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
