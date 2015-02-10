var viewer,
  Init = function () {
  };

Init.prototype.init = function (dataUrls) {
  if (dataUrls === undefined) {
    dataUrls = {
      chn: {
        id: "CHN",
        jsonUrl: "../../Apps/SampleData/chn.json",
        catalogUrl: "https://www.google.ru/"
      },
      rus: {
        id: "RUS",
        jsonUrl: "../../Apps/SampleData/rus.json",
        catalogUrl: "http://www.tut.by/"
      },
      blr: {
        id: "BLR",
        jsonUrl: "../../Apps/SampleData/blr.json",
        blrTempJSON: {},
        chooseFlag: false,
        catalogUrl: "http://www.onliner.by/"
      }
    }
  }
  Init.dataUrls = dataUrls;
  initCesiumPlanet();

  // Инициализация по каждому json
  for (var data in dataUrls) {
    initPolygon(Init.dataUrls[data]);
    addCatalogAction(Init.dataUrls[data]);
  }
  for (var data in dataUrls) {
    initPolygon(Init.dataUrls[data], Cesium.Color.GOLD);
    addCatalogAction(Init.dataUrls[data]);
  }
};

var d = new Init();
d.init(undefined);

/**
 * initialization planet and parts
 */
function initCesiumPlanet() {

  viewer = new Cesium.Viewer('cesiumContainer');

  // Включаем возможность читать json выбранной области
  Cesium.viewerEntityMixin(viewer);

  viewer.scene.backgroundColor = Cesium.Color.DARKBLUE;

  //Устанавливаем точку обзора
  viewer.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(75, 45, 14000000),
    Cesium.Cartesian3.fromDegrees(75, 50, 0), Cesium.Cartesian3.UNIT_Z);
  // Включаем границу дня/ночи
  viewer.scene.globe.enableLighting = true;
  // убираем надпись "Cesium" .cesium-widget-credits todo уже убрано Егором
  $('.cesium-widget-credits').css({'display': 'none'});
}
/**
 * initialize polygon from JSON & set color
 * @param jsonData - Object with params jsonUrl & id
 * @param color - Cesium color
 */
function initPolygon(jsonData, color) {

  var geoJsonData;
//  viewer.scene.primitives.destroyPrimitives = true;
//  polygon = initJsonDataSource(jsonUrl, fill);
//  viewer.dataSources.add(polygon);
//  if (Init.dataUrls.)
  if (color) {
    jsonData.geoJsonDataSelect = Cesium.GeoJsonDataSource.fromUrl(jsonData.jsonUrl, {
      stroke: Cesium.Color.GOLD,
      fill: color,
      strokeWidth: 3
    });
  } else {
    var fill = color ? color : getColor(jsonData.id)
    jsonData.geoJsonData = Cesium.GeoJsonDataSource.fromUrl(jsonData.jsonUrl, {
      stroke: Cesium.Color.GOLD,
      fill: fill,
      strokeWidth: 3
    });
    viewer.dataSources.add(jsonData.geoJsonData);
  }

  // глубокий синий: #25059B
  // red 37 green 5 blue 155
  // золотой: #FFD700
  // red 255 green 215 blue 0

}

function getColor(id) {
  var fill;
  if (!id) {
    console.log('error: no id to choose color!!!');
  } else if (!id.indexOf('BLR')) {
    fill = new Cesium.Color(1, 1, 1, 0.5);
  } else if (!id.indexOf('RUS')) {
    fill = new Cesium.Color(0, 0, 1, 0.5);
  } else if (!id.indexOf('CHN')) {
    fill = new Cesium.Color(1, 0, 0, 0.5);
  }
  return fill;
}

function initJsonDataSource(jsonUrl, fill) {
  var jsonDataSource = Cesium.GeoJsonDataSource.fromUrl(jsonUrl, {
    stroke: Cesium.Color.GOLD,
    fill: fill,
    strokeWidth: 3
  });
  for (var data in Init.dataUrls) {
    if (data.jsonUrl === jsonUrl) {
      data.dataPolygon = jsonDataSource;
    }
  }
  return jsondataSource;
}

function addCatalogAction() {

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  primitives = viewer.scene.primitives;

  handler.setInputAction(function (movement) {
    console.log('left_click1');
    planetClickHandler(movement);

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (movement) {
    console.log('action!!!');
    planetMoveHandler(movement);
//    // get an array of all primitives at the mouse position
//    var pickedObjects = viewer.scene.drillPick(movement.endPosition);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function planetClickHandler(movement) {
  var pickedObjects = viewer.scene.drillPick(movement.position);
  if (Cesium.defined(pickedObjects)) {
    for (i = 0; i < pickedObjects.length; ++i) {
      console.log('number of pickedObjects: ' + pickedObjects.lenght);
      var polygon = pickedObjects[i].primitive;
      if (polygon.picked === false) {
        console.log(pickedObjects[i].id._id);
        if (pickedObjects[i].id._id.indexOf('BLR') >= 0) {
          // 'go to ' + Init.dataUrls.blr.catalogUrl
          Init.dataUrls.blr.chooseFlag = true;
        } else if (pickedObjects[i].id._id.indexOf('RUS') >= 0) {
          // 'go to ' + Init.dataUrls.rus.catalogUrl
          Init.dataUrls.rus.chooseFlag = true;
        } else if (pickedObjects[i].id._id.indexOf('CHN') >= 0) {
          // 'go to ' + Init.dataUrls.chn.catalogUrl
          Init.dataUrls.chn.chooseFlag = true;
        }
      } else {
        polygon.picked = false;
      }
      polygon.processedPick = true;
    }
  } else {
    console.log('not defined pickedObjects after click');
  }
}
function planetMoveHandler(movement) {
  var pickedObjects = viewer.scene.drillPick(movement.endPosition);
//  console.log('pickedObjects.lenght: ' + pickedObjects.lenght);
  if (Cesium.defined(pickedObjects)) {
    for (i = 0; i < pickedObjects.length; ++i) {
      var polygon = pickedObjects[i].primitive;
      if (polygon.picked === false) {
        if (pickedObjects[i].id._id.indexOf('BLR') >= 0) {
          changeDataSource('blr.json', Init.dataUrls.blr);
          setChoosingFlags(true, false, false);
        } else if (pickedObjects[i].id._id.indexOf('RUS') >= 0) {
          changeDataSource('rus.json', Init.dataUrls.rus);
          setChoosingFlags(false, false, true);
        } else if (pickedObjects[i].id._id.indexOf('CHN') >= 0) {
          changeDataSource('chn.json', Init.dataUrls.chn);
          setChoosingFlags(false, true, false);
        }
        polygon.picked = true;
      } else {
        setChoosingFlags(false, false, false);
        polygon.picked = false;
      }
      polygon.processedPick = true;
    }
  } else {
    console.log('not defined pickedObjects');
  }
}

function setChoosingFlags(blrFlag, chnFlag, rusFlag) {
  Init.dataUrls.blr.chooseFlag = blrFlag;
  Init.dataUrls.rus.chooseFlag = rusFlag;
  Init.dataUrls.chn.chooseFlag = chnFlag;
}

function changeDataSource(jsonName, dataObject) {
  var dataSources = viewer.dataSources._dataSources;
  for (var i = 0; i < dataSources.length; i++) {
    if (dataSources[i]._name === jsonName && !dataObject.chooseFlag) {
      viewer.dataSources.remove(dataSources[i], true);
      viewer.dataSources.add(dataObject.geoJsonDataSelect);
    } else if (dataSources[i]._name != jsonName) {
      for (var data in Init.dataUrls) {
        if (dataSources[i] === Init.dataUrls[data].geoJsonDataSelect && Init.dataUrls[data].chooseFlag) {
          viewer.dataSources.remove(dataSources[i], true);
          viewer.dataSources.add(Init.dataUrls[data].geoJsonData);
        }
      }
//      console.log(dataSources[i]);
//      console.log(dataSources[i] === Init.dataUrls.chn.geoJsonData);
//      viewer.dataSources.remove(dataSources[i], true);
//      viewer.dataSources.add(dataObject.geoJsonDataSelect);
    }
  }
}

function resetJson() {
  //Reset the scene when switching demos.
  Sandcastle.reset = function () {
    viewer.dataSources.remove();
    viewer.dataSources.removeAll();

//    //Set the camera to a US centered tilted view.
//    var camera = viewer.scene.camera;
//    viewer.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(75, 45, 14000000),
//      Cesium.Cartesian3.fromDegrees(75, 50, 0), Cesium.Cartesian3.UNIT_Z);
  };
}