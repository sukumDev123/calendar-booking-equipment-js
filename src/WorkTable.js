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
    eleMent.className = class_;
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
  constructor(datas, queryS1) {
    this.datas = this.map_exists_data(datas);
    this.queryS1 = this._queryS(queryS1);
    const {
      createBigTable,
      createLeftTable,
      createRightTable
    } = this.createTable();

    this.createBigTable = createBigTable;
    this.createLeftTable = createLeftTable;
    this.createRightTable = createRightTable;

    this.loadDataForLeftTable();
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
  loadDataForLeftTable() {
    const datas = this.datas;
    const keys = Object.keys(datas);
    const bigDiv = this._create_element("div", "", "");
    // keys.forEach((key, ind) => {
    //   if (ind === 0) {
    //     const h3 = this._create_element("h3", "EEE", "");
    //     bigDiv.appendChild(h3);
    //   } else {
    //     const h3 = this._create_element("h3", keys[ind - 1], "");
    //     bigDiv.appendChild(h3);
    //   }
    // });
    this.createRightTable.appendChild(bigDiv);
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

  __createAndZipTime() {
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
      console.log({ times });
    });
    return { createDivHeaderRightTable, times };
  }

  //
  loadTime() {
    const {
      createDivHeaderRightTable,

      times
    } = this.__createAndZipTime();

    const map_event_with_times = this.datas;
    const keys = Object.keys(map_event_with_times);
    let handleData = (time, type, color, name) => ({
      time: time,
      type: type,
      color: color,
      nameEvent: name
    });
    const createBigg = this._create_element("div", "", "time____");
    createBigg.appendChild(createDivHeaderRightTable);
    // createBigg.appendChild(createDivHeaderRightTableDatas);
    const createDivHeaderRightTableDatas = this._create_element(
      "div",
      "",
      "sub__"
    );
    let name__ = {};
    keys.map((key, ind_) => {
      const subb = this._create_element("div", "", "header-right-table");
      const createh5Null = this._create_element("h5", "", "time-header");
      const createSmallNull = this._create_element("p", key, "");
      name__[key] = ind_;
      createh5Null.appendChild(createSmallNull);
      subb.appendChild(createh5Null);
      Object.keys(times).forEach((d, ind) => {
        const createh5Null = this._create_element("h5", "", "time-header");
        const createSmallNull = this._create_element("p", "", "");
        createh5Null.appendChild(createSmallNull);
        subb.appendChild(createh5Null);
      });
      createDivHeaderRightTableDatas.appendChild(subb);
    });
    createBigg.appendChild(createDivHeaderRightTableDatas);
    // console.log({ c: createBigg, name__ });

    this.createRightTable.appendChild(createBigg);

    let start;
    let end;
    keys.map((key, i) => {
      // map_event_with_times
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
          if ((start && end) || start === 0 || end === 0) {
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

      elementHandle.style.background = time.color;
      elementHandle.innerHTML = time.nameEvent;
    }
  }
}

//   createDivHeaderRightTableDatas.children[0].innerHTML = key;
//   createDivHeaderRightTableDatas.children[map_event_with_times[key]];
//   this._add_event_to_element(
//     centerDrew,
//     handleData(time_.timeEnd, time_.end, time_.color, key),
//     createDivHeaderRightTableDatas
//   );
//   const time_ = map_event_with_times[key];
//   let indexElement = "";
//   if (time_.start) {
//     indexElement = times[time_.timeStart];
//     this._add_event_to_element(
//       indexElement,
//       handleData(time_.timeStart, time_.start, time_.color, "start"),
//       createDivHeaderRightTableDatas
//     );
//     goAware = true;
//     centerDrew = indexElement;
//   }
//   if (time_.end) {
//     goAware = false;
//     indexElement = times[time_.timeEnd];
//     this._add_event_to_element(
//       indexElement,
//       handleData(time_.timeEnd, time_.end, time_.color, "end"),
//       createDivHeaderRightTableDatas
//     );
//     centerDrew = parseInt((centerDrew + indexElement) / 2);
//     this._add_event_to_element(
//       centerDrew,
//       handleData(time_.timeEnd, time_.end, time_.color, key),
//       createDivHeaderRightTableDatas
//     );
//   }
