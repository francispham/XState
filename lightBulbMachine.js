const { Machine } = XState;

const lit = {
  on: {
    BREAK: 'broken',
    TOGGLE: 'unlit'
  }
};

const unlit = {
  on: {
    BREAK: 'broken',
    TOGGLE: 'lit'
  }
};

const broken = {
  type: 'final'
};

const states = { lit, unlit, broken }

const initial = 'unlit'

const config = {
  id: 'lightBulb',
  initial,
  states
}

const lightBulbMachine = Machine(config);

//* Doc: https://xstate.js.org/docs/guides/transitions.html#machine-transition-method
console.log(lightBulbMachine.transition('unlit', 'TOGGLE').value);