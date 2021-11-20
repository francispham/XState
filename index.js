//* Docs: https://xstate.js.org/docs/guides/context.html#context
//* Docs: https://xstate.js.org/docs/guides/machines.html#machines
//* Docs: https://xstate.js.org/docs/guides/interpretation.html#interpreter
const { createMachine, interpret, assign } = XState;

//* Docs: https://xstate.js.org/docs/guides/machines.html#configuration
const dragDropMachine = createMachine({
  initial: 'idle',
  //? Local context for entire machine
  context: {
    //? The Position of the Box:
    x: 0,
    y: 0,
    //? Where you Clicked:
    pointerX: 0,
    pointerY: 0,
    //? How Far From Where you Clicked
    dx: 0, //? How Far on the X Axis 
    dy: 0, //? How Far on the Y Axis 
  },
  //? State definitions
  states: {
    //* Docs: https://xstate.js.org/docs/guides/statenodes.html#state-nodes
    idle: {
      //* Docs: https://xstate.js.org/docs/guides/events.html#sending-events
      on: {
        //? Event: NextState
        mousedown: {
          target: 'dragging',
          //? Side Effect somewhere here
          actions: assign((context, mouseEvent) => { //* Docs: https://xstate.js.org/docs/guides/context.html#assign-action
            /*  Mutating context works but not recommended!
              context.x = mouseEvent.clientX
              Best way is Immutable (return a new context): 
            */
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
          //? Change context.x & context.y:
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

//* Docs: https://xstate.js.org/docs/guides/interpretation.html#interpreter
const dragDropService = interpret(dragDropMachine)
  .onTransition(state => {  //* Docs: https://xstate.js.org/docs/guides/interpretation.html#transitions
    if (state.changed) { //* Docs: https://xstate.js.org/docs/guides/states.html#state-changed
      console.log(state.context); //* Docs: https://xstate.js.org/docs/guides/states.html#state-definition

      //? Moving the Box:
      box.style.setProperty(
        'left', 
        //? Where the Box is + How Far the Box Moved:
        state.context.x + state.context.dx + 'px',
      );
      box.style.setProperty(
        'top', 
        state.context.y + state.context.dy + 'px',
      );
      
      //? Show Data Attributes on Browser
      body.dataset.state = state.toStrings().join(' ')
    }
  })
  .start(); //* Docs: https://xstate.js.org/docs/guides/interpretation.html#starting-and-stopping

body.addEventListener('mousedown', event => {
  // event.clientX
  // event.clientY
  dragDropService.send(event); //* Docs: https://xstate.js.org/docs/guides/interpretation.html#sending-events
})
body.addEventListener('mouseup', event => {
  dragDropService.send(event);
})
body.addEventListener('mousemove', event => {
  dragDropService.send(event);
})