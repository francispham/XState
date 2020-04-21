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
        mousemove: {
          target: 'dragging',
          actions: assign((context, mouseEvent) => {
            return {
              ...context,
              dx: mouseEvent.clientX - context.x,
              dy: mouseEvent.clientY - context.y,
            }
          })
        },
        mouseup: {
          target: 'idle',
        }
      }
    },
  },
});

const body = document.body;
const box = document.getElementById('box')

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    if (state.changed) {
      console.log(state.context);
      // Moving the Box:
      box.style.setProperty('left', state.context.dx + 'px')
      box.style.setProperty('top', state.context.dy + 'px')
    }

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
body.addEventListener('mousemove', event => {
  dragDropService.send(event);
})