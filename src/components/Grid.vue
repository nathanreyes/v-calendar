<script>
export default {
  render(h) {
    // Grid divider renderer
    const getDivider = ({ isHorizontal = true, row, column, span }) =>
      h(
        'div',
        {
          class: [
            'vc-grid-divider-container',
            isHorizontal ? 'is-horizontal' : 'is-vertical',
          ],
          style: {
            ...(isHorizontal && {
              'grid-row': row,
              'grid-column': `1 / span ${span}`,
              height: this.gap,
            }),
            ...(!isHorizontal && {
              'grid-column': column,
              'grid-row': `1 / span ${span}`,
              width: this.gap,
            }),
          },
        },
        [
          h('div', {
            class: [
              this.innerBorderClass,
              isHorizontal ? 'is-horizontal' : 'is-vertical',
            ],
            style: {
              borderBottomWidth: '0',
              borderRightWidth: '0',
              flexGrow: '1',
            },
          }),
        ],
      );

    // Grid cell renderer
    const getCell = ({ position, row, column }) => {
      // Get the default slot first
      if (this.$slots.default && this.$slots.default.length >= position) {
        return this.$slots.default[position - 1];
      }
      // Get the scoped slot second
      if (this.$scopedSlots.default) {
        return this.$scopedSlots.default({
          position,
          row,
          column,
        });
      }
      return null;
    };

    // Grid cells renderer
    const getCells = () => {
      const cells = [];
      const totalRows = this.rows * 2 - 1;
      const totalColumns = this.columns * 2 - 1;
      for (let r = 1, p = 1; r <= totalRows; r++) {
        for (let c = 1; c <= totalColumns; c++) {
          // Add horizontal divider for non-zero even rows in the 1st column
          if (r % 2 === 0) {
            if (c === 1) {
              cells.push(
                getDivider({
                  isHorizontal: true,
                  row: r,
                  column: c,
                  span: totalColumns,
                }),
              );
            }
          } else {
            // Add vertical dividers for non-zero even columns in the 1st row
            if (c % 2 === 0) {
              if (r === 1) {
                cells.push(
                  getDivider({
                    isHorizontal: false,
                    row: r,
                    column: c,
                    span: totalRows,
                  }),
                );
              }
            } else {
              // Actually add the cell components
              cells.push(
                h(
                  'div',
                  {
                    class: 'c-grid-cell',
                    style: {
                      'grid-row': r,
                      'grid-column': c,
                    },
                  },
                  [getCell({ position: p++, row: r, column: c })],
                ),
              );
            }
          }
        }
      }
      return cells;
    };

    return h(
      'div',
      {
        class: 'vc-grid-container',
        style: this.containerStyle,
      },
      [...getCells()],
    );
  },
  props: {
    count: Number,
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    autofit: Boolean,
    gap: String,
    innerBorderClass: String,
    columnWidth: {
      type: String,
      default: '1fr',
    },
  },
  computed: {
    containerStyle() {
      return {
        gridTemplateColumns: this.gridTemplateColumns,
      };
    },
    gridTemplateColumns() {
      return `repeat(${this.autofit ? 'auto-fit' : this.columns}, ${
        this.columnWidth
      } auto)`;
    },
  },
};
</script>

<style scoped>
.vc-grid-container {
  position: relative;
  flex-shrink: 1;
  display: grid;
}

.vc-grid-divider-container {
  display: flex;
  align-items: center;
}

.vc-grid-divider-container.is-vertical {
  flex-direction: column;
}
</style>
