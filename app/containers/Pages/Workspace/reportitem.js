<button
          type="button"
          id={'element' + row.id}
          className={classes.imagearea}
          onMouseDown={() => this.selectElement(row.id)}
          style={{
            height: '200px',
            width: '200px',
            position: 'absolute'
          }}
          tabIndex={row.id}
          onBlur={() => this.unselectElement(row.id)}
          onKeyDown={e => this.handleRemoveItem(e, row.id)}
          onDoubleClick={() => this.openDialogChoose(row.id, 'image')}
        >
          <img
            src={row.chartURL}
            alt="chart holder"
            style={{
              height: '100%',
              width: '100%'
            }}
          />
        </button>