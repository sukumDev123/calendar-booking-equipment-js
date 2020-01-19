class WorkTable {
  /**
   * @returns {Element}
   */
  _queryS(queryS1) {
    return document.querySelector(queryS1);
  }

  /**
   *
   * @param {Element} elementName
   * @param {*} text
   */
  _create_element(elementName, text, class_) {
    const eleMent = document.createElement(elementName);
    if (class_) eleMent.className = class_;
    const textNode = document.createTextNode(text);
    eleMent.appendChild(textNode);

    return eleMent;
  }

  map_exists_data(datas) {
    let datas_event = {};

    Array.from(datas).forEach(d => {
      if (!datas_event[d.nameEvent]) datas_event[d.nameEvent] = [];
      datas_event[d.nameEvent].push({
        ...d
      });
    });

    return datas_event;
  }
  constructor(datas, queryS1, onClick) {
    this.datas = this.map_exists_data(datas);
    this.queryS1 = this._queryS(queryS1);

    this.onClick = onClick;

    const {
      createBigTable,
      createLeftTable,
      createRightTable
    } = this.createTable();
    this.createBigTable = createBigTable;
    this.createLeftTable = createLeftTable;
    this.createRightTable = createRightTable;

    this.loadTime();

    this.queryS1.appendChild(this.createBigTable);
  }
  createTable() {
    const createBigTable = this._create_element("div", "", "big-table");
    const createLeftTable = this._create_element("div", "", "left-table");
    const createRightTable = this._create_element("div", "", "right-table");
    if (this.queryS1) {
      createBigTable.appendChild(createLeftTable);
      createBigTable.appendChild(createRightTable);
      this.queryS1.appendChild(createBigTable);
    }

    return {
      createBigTable,
      createLeftTable,
      createRightTable
    };
  }

  _createTimes(start, end) {
    let h = [];
    for (let i = start; i < end; i++) {
      h.push(i);
    }
    return h;
  }
  _format(int_v) {
    return int_v >= 10 ? int_v : `0${int_v}`;
  }

  _create_header_times() {
    const hours = this._createTimes(0, 24);
    const mins = this._createTimes(0, 60);

    const map_times2D = hours.map(hour => {
      const arraysTime = mins
        .map(min =>
          min % 30 == 0 ? `${this._format(hour)}:${this._format(min)}` : ""
        )
        .filter(time => time);
      return arraysTime;
    });
    const map_time1D = map_times2D.reduce((variableMain, datas) => {
      datas.forEach(data => {
        variableMain.push(data);
      });
      return variableMain;
    }, []);

    const createDivHeaderRightTable = this._create_element(
      "div",
      "",
      "header-right-table_"
    );

    let times = {};
    map_time1D.forEach((time, index) => {
      if (index === 0) {
        const createh5 = this._create_element(
          "h5",
          "ชื่อของครุภัณฑ์",
          "time-header"
        );
        // times[time] = index;
        createDivHeaderRightTable.appendChild(createh5);
      } else {
        const createh5 = this._create_element(
          "h5",
          map_time1D[index - 1],
          "time-header"
        );
        times[map_time1D[index - 1]] = index;
        createDivHeaderRightTable.appendChild(createh5);
      }
    });
    return { createDivHeaderRightTable, times };
  }

  //
  loadTime() {
    const { createDivHeaderRightTable, times } = this._create_header_times();

    const map_event_with_times = this.datas;
    const keys = Object.keys(map_event_with_times);
    const createBigg = this._create_element("div", "", "time____");
    createBigg.appendChild(createDivHeaderRightTable);
    // createBigg.appendChild(createDivHeaderRightTableDatas);
    const createDivHeaderRightTableDatas = this._create_element(
      "div",
      "",
      "sub__"
    );
    keys.map((key, ind_) => {
      const subb = this._create_element("div", "", "header-right-table");
      const s__ = this._create_element("div", "");
      const createh5Null = this._create_element("h5", "", "time-header");
      const createSmallNull = this._create_element("p", key, "");
      s__.onclick = () => {
        this.onClick(key);
      };
      createh5Null.appendChild(createSmallNull);
      s__.append(createh5Null);
      subb.appendChild(s__);
      Object.keys(times).forEach((d, ind) => {
        const createh5Null = this._create_element(
          "h5",
          "",
          "time-header",
          this.onClick
        );
        const createSmallNull = this._create_element("p", "", "", this.onClick);
        createh5Null.addEventListener("click", () => console.log(`aaedas`));
        createh5Null.appendChild(createSmallNull);
        subb.appendChild(createh5Null);
      });
      createDivHeaderRightTableDatas.appendChild(subb);
    });
    createBigg.appendChild(createDivHeaderRightTableDatas);
    this.createRightTable.appendChild(createBigg);

    let start;
    let end;
    keys.forEach((key, i) => {
      let this_data_element = document.querySelector(`.sub__`).children[i];
      if (map_event_with_times[key].length) {
        map_event_with_times[key].forEach(data => {
          const indexOfelementTime = times[data.time];

          if (data.type == "start") {
            start = indexOfelementTime;
          }
          if (data.type == "end") {
            end = indexOfelementTime;
          }
          if (start && end) {
            this._draw(start, end, data, this_data_element);
          }
        });
      } else {
        // continue;
      }
    });
  }

  _draw(start, end, data, this_data_element) {
    for (let i = start; i <= end; i++) {
      this._add_event_to_element(i, data, this_data_element);
    }
  }

  _add_event_to_element(indexElement, time, createDivHeaderRightTableDatas) {
    if (createDivHeaderRightTableDatas) {
      const elementHandle =
        createDivHeaderRightTableDatas.children[indexElement].children[0];
      elementHandle.style.background = time.bk;
      elementHandle.style.color = time.color ? time.color : "black";
      elementHandle.innerHTML = time.nameEvent;
      elementHandle.style.borderLeft = `10px solid ${time.color}`;
    }
  }
  add_new_data(datas) {
    console.log({ datas });
    while (this.queryS1.firstChild) this.queryS1.firstChild.remove();
    this.datas = this.map_exists_data(datas);
    console.log(this.datas);
    const {
      createBigTable,
      createLeftTable,
      createRightTable
    } = this.createTable();
    this.createBigTable = createBigTable;
    this.createLeftTable = createLeftTable;
    this.createRightTable = createRightTable;
    this.loadTime();
  }
}
