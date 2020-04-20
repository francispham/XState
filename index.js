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

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    console.log(state);
  })
  .start();

const box = document.getElementById('box')
box.addEventListener('mousedown', event => {
  // service.send(event)
  dragDropService.send('mousedown')
})
box.addEventListener('mouseup', event => {
  dragDropService.send('mouseup')
})