export const projectReducer = (state, action) => {
  switch (action.type) {
    case "add": {
      return [...state, action.data];
    }

    default: {
      return state;
    }
  }
};
