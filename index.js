const { createMachine, interpret } = XState;

const dragDropMachine = createMachine({
  initial: 'idle',
  context: {
    x: 0,
    y: 0,
    dx: 0, // How Far on the X Axis 
    dy: 0, // How Far on the Y Axis 
  },
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

const body = document.body;

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    console.log(state.value);
    // Show Data Attributes on Browser
    body.dataset.state = state.toStrings().join(' ')
  })
  .start();

const box = document.getElementById('box')
body.addEventListener('mousedown', event => {
  // service.send(event)
  // event.clientX
  // event.clientY
  dragDropService.send('mousedown')
})
body.addEventListener('mouseup', event => {
  dragDropService.send('mouseup')
})