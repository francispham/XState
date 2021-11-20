//* Docs: https://paka.dev/npm/xstate/v/4.26.0#module-index-export-Machine
//* Docs: https://paka.dev/npm/xstate/v/4.26.0#module-index-export-interpret 
const { Machine, interpret } = XState;

const lightBulbMachine = Machine({
  id: 'lightBulb',
  initial: 'unlit',
  states: {
    lit: {
      on: {
        BREAK: 'broken',
        TOGGLE: 'unlit'
      }
    },
    unlit: {
      on: {
        BREAK: 'broken',
        TOGGLE: 'lit'
      }
    },
    broken: {
      type: 'final'
    }
  }
});

//* Doc: https://xstate.js.org/docs/guides/transitions.html#machine-transition-method
console.log(lightBulbMachine.transition('unlit', 'TOGGLE').value);

//? Tutorial: https://egghead.io/lessons/xstate-use-an-interpreter-to-instantiate-a-machine 
//* Doc: https://xstate.js.org/docs/guides/interpretation.html#interpreter
const service = interpret(lightBulbMachine).start();

//* Doc: https://xstate.js.org/docs/guides/interpretation.html#transitions
service.onTransition(state => {
  if (state.changed) console.log(state.value);
});

service.send('TOGGLE');
service.send('TOGGLE');
service.send('BREAK');
