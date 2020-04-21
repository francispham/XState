const { createMachine, interpret, assign } = XState;

const dragDropMachine = createMachine({
  initial: 'idle',
  context: {
    // The Position of the Box:
    x: 0,
    y: 0,
    // Where you Clicked:
    pointerX: 0,
    pointerY: 0,
    // How Far From Where you Clicked
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
              pointerX: mouseEvent.clientX,
              pointerY: mouseEvent.clientY,
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
              dx: mouseEvent.clientX - context.pointerX,
              dy: mouseEvent.clientY - context.pointerY,
            }
          })
        },
        mouseup: {
          target: 'idle',
          // Change context.x & context.y:
          actions: assign((context) => {
            return {
              ...context,
              x: context.x + context.dx,
              y: context.y + context.dy,
              dx: 0,
              dy: 0,
            }
          })
        }
      }
    },
  },
});

const body = document.body;
const box = document.getElementById('box');

const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {
    if (state.changed) {
      console.log(state.context);

      // Moving the Box:
      box.style.setProperty(
        'left', 
        // Where the Box is + How Far the Box Moved:
        state.context.x + state.context.dx + 'px',
      );
      box.style.setProperty(
        'top', 
        state.context.y + state.context.dy + 'px',
      );
      
      // Show Data Attributes on Browser
      body.dataset.state = state.toStrings().join(' ')
    }
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