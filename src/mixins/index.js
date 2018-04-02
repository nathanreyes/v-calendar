export const mergeListeners = {
  methods: {
    mergeListeners(sourceListeners, targetListeners = this.$listeners) {
      return Object.keys(sourceListeners).reduce(
        (existing, event) => {
          existing[event] = existing[event]
            ? [existing[event], sourceListeners[event]]
            : sourceListeners[event];
          return existing;
        },
        { ...targetListeners },
      );
    },
  },
};
