const { createMachine, interpret, assign } = XState;

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
          target: 'dragging',
          // Side Effect somewhere here
          actions: assign((context, mouseEvent) => {
            // Mutating context works but not recommended!
            // context.x = mouseEvent.clientX
            // Best way is Immutable (return a new context):
            return {
              ...context,
              x: mouseEvent.clientX,
              y: mouseEvent.clientY,
            }
          })
        }
      }
    },
    dragging: {
      on: {
        mouseup: {
          target: 'idle',
          actions: assign((context, mouseEvent) => {
            return {
              ...context,
              x: mouseEvent.clientX,
              y: mouseEvent.clientY,
            }
          })
        }
      }
    },
  },
});

const body = document.body;
const box = document.getElementById('box')

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    console.log(state.context);
    // Moving the Box:
    box.style.setProperty('left', state.context.x + 'px')
    box.style.setProperty('top', state.context.y + 'px')

    // Show Data Attributes on Browser
    body.dataset.state = state.toStrings().join(' ')
  })
  .start();

body.addEventListener('mousedown', event => {
  // event.clientX
  // event.clientY
  dragDropService.send(event);
})
body.addEventListener('mouseup', event => {
  dragDropService.send(event);
})