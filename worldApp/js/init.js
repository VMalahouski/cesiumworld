function supportsWebGl() {

  var support = true;

  try {

    var $canvas = $('<canvas />');
    $('body').append($canvas);
    var canvas = $canvas[0];

    if (canvas.addEventListener) {
      canvas.addEventListener("webglcontextcreationerror", function(event) {
        console.log('webglcontextcreationerror');
        support = false;
      }, false);
    }

    var context = create3DContext(canvas);
    if (!context) {

      console.log('No webgl context');

      if (!window.WebGLRenderingContext) {
        console.log('No WebGLRenderingContext');
      }

      support = false;
    }
  }
  catch (e) {
    console.log(e);
  } finally {
    $canvas.remove();
  }

  return support;
}

function create3DContext(canvas) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii]);
    } catch (e) {}
    if (context) {
      break;
    }
  }
  return context;
}

//document.write('Client supports WebGL: ' + supportsWebGl());
//console.log('Client supports WebGL: ' + supportsWebGl());



var viewer,
  Init = function () {
  };

Init.prototype.init = function (dataUrls) {
  supportsWebGl();
  console.log('Client supports WebGL: ' + supportsWebGl());
  if (dataUrls === undefined) {
    dataUrls = {
      chn: {
        id: "CHN",
        //jsonUrl: "../../world/Apps/SampleData/chn.json",
        jsonUrl: "../../Apps/SampleData/chn.json",
        catalogUrl: "http://velmode.by/?page_id=46"
      },
      rus: {
        id: "RUS",
        //jsonUrl: "../../world/Apps/SampleData/rus.json",
        jsonUrl: "../../Apps/SampleData/rus.json",
        catalogUrl: "http://velmode.by/?page_id=37"
      },
      blr: {
        id: "BLR",
        //jsonUrl: "../../world/Apps/SampleData/blr.json",
        jsonUrl: "../../Apps/SampleData/blr.json",
        chooseFlag: undefined,
        catalogUrl: "http://velmode.by/?post_type=product"
      }
    }
  }
  Init.dataUrls = dataUrls;
  initCesiumPlanet();

  // Инициализация по каждому json
  for (var data in dataUrls) {
    initPolygon(Init.dataUrls[data], true);
//    addCatalogAction();
  }
  for (var data in dataUrls) {
    initPolygon(Init.dataUrls[data], false);
    addCatalogAction();
  }
  setChoosingFlags(false, false, false);

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

//  viewer.scene.backgroundColor = Cesium.Color.DARKBLUE;

  //Устанавливаем точку обзора
  viewer.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(75, 45, 14000000),
    Cesium.Cartesian3.fromDegrees(75, 50, 0), Cesium.Cartesian3.UNIT_Z);
  // Включаем границу дня/ночи
  viewer.scene.globe.enableLighting = true;
//  убираем надпись "Cesium" .cesium-widget-credits
  $('.cesium-widget-credits').css({'display': 'none'});
}
/**
 * initialize polygon from JSON & set color
 * @param jsonData - Object with params jsonUrl & id
 * @param flag - flag for init Cesium color
 */
function initPolygon(jsonData, flag) {

  var geoJsonData, fill;
  if (flag) {
    console.log("set select obj");
    fill = getColor(jsonData.id, 0.5);
    jsonData.geoJsonDataSelect = Cesium.GeoJsonDataSource.fromUrl(jsonData.jsonUrl, {
      stroke: Cesium.Color.GOLD,
      fill: fill,
      strokeWidth: 5
    });
//    viewer.dataSource.add(jsonData.geoJsonDataSelect);
  } else {
    console.log("set default obj");
    fill = getColor(jsonData.id, 0.5);
    jsonData.geoJsonData = Cesium.GeoJsonDataSource.fromUrl(jsonData.jsonUrl, {
      stroke: Cesium.Color.GOLD,
      fill: fill,
      strokeWidth: 5
    });
    viewer.dataSources.add(jsonData.geoJsonData);
  }
}

function getColor(id, transparent) {
  var fill;
  if (!id) {
    console.log('error: no id to choose color!!!');
  } else if (!id.indexOf('BLR')) {
    fill = new Cesium.Color(1, 1, 1, transparent);
  } else if (!id.indexOf('RUS')) {
    fill = new Cesium.Color(0, 0, 1, transparent);
  } else if (!id.indexOf('CHN')) {
    fill = new Cesium.Color(1, 0, 0, transparent);
  }
  return fill;
}

function addCatalogAction() {

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  primitives = viewer.scene.primitives;

  handler.setInputAction(function (movement) {
    console.log('left_click!');
    planetClickHandler(movement);

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (movement) {
    planetMoveHandler(movement);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function planetClickHandler(movement) {
  var pickedObjects = viewer.scene.drillPick(movement.position);
  if (Cesium.defined(pickedObjects)) {
    for (var i = 0; i < pickedObjects.length; ++i) {
      console.log('number of pickedObjects: ' + pickedObjects.lenght);
      var polygon = pickedObjects[i].primitive;
      if (polygon.picked === false) {
        console.log(pickedObjects[i].id._id);
        if (pickedObjects[i].id._id.indexOf('BLR') >= 0) {
//          console.log('go to ' + Init.dataUrls.blr.catalogUrl);
          window.open(Init.dataUrls.blr.catalogUrl, '_self');
//          Init.dataUrls.blr.chooseFlag = true;
        } else if (pickedObjects[i].id._id.indexOf('RUS') >= 0) {
//          console.log('go to ' + Init.dataUrls.rus.catalogUrl);
          window.open(Init.dataUrls.rus.catalogUrl, '_self');
//          Init.dataUrls.rus.chooseFlag = true;
        } else if (pickedObjects[i].id._id.indexOf('CHN') >= 0) {
//          console.log('go to ' + Init.dataUrls.chn.catalogUrl);
          window.open(Init.dataUrls.chn.catalogUrl, '_self');
//          Init.dataUrls.chn.chooseFlag = true;
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
    var n = 0;
  if (Cesium.defined(pickedObjects)) {
    console.log("pickedObjects.length: " + pickedObjects.length);
    //if (pickedObjects.length === 0 && getSelectedId() != null) {
    //  console.log("reset all polygons");
    //  setChoosingFlags(false, false, false);
    //  return;
    //}
    for (var i = 0; i < pickedObjects.length; i++) {
      var polygon = pickedObjects[i].primitive;
      if (polygon.picked === false) {
        if (pickedObjects[i].id._id.indexOf('BLR') >= 0) {
          console.log("move BLR");
          if (getSelectedId() != Init.dataUrls.blr.id) {
            setChoosingFlags(true, false, false);
          }
        } else if (pickedObjects[i].id._id.indexOf('RUS') >= 0) {
          console.log("move RUS");
          if (getSelectedId() != Init.dataUrls.rus.id) {

            setChoosingFlags(false, false, true);
          }
        } else if (pickedObjects[i].id._id.indexOf('CHN') >= 0) {
          console.log("move CHN");
          setChoosingFlags(false, true, false);
        }
        polygon.picked = true;
      } else {
        polygon.picked = false;
      }
      polygon.processedPick = true;
    }
  } else {
    console.log('not defined pickedObjects');
  }

}

/**
 * set selection flags true - select
 * @param blrFlag
 * @param chnFlag
 * @param rusFlag
 */
function setChoosingFlags(blrFlag, chnFlag, rusFlag) {
//  console.log("state before: ");
//  showState();
  if (blrFlag ) {
    changeDataSource('blr.json', Init.dataUrls.blr);
  } else if (rusFlag ) {
    changeDataSource('rus.json', Init.dataUrls.rus);
  } else if (chnFlag ) {
    changeDataSource('chn.json', Init.dataUrls.chn);
  } else {
    changeDataSource(null);
  }
  Init.dataUrls.blr.chooseFlag = blrFlag;
  Init.dataUrls.rus.chooseFlag = rusFlag;
  Init.dataUrls.chn.chooseFlag = chnFlag;
//  console.log("state after: ");
//  showState();
}

function showState() {
  console.log("Init.dataUrls.blr.chooseFlag: " + Init.dataUrls.blr.chooseFlag);
  console.log("Init.dataUrls.rus.chooseFlag: " + Init.dataUrls.rus.chooseFlag);
  console.log("Init.dataUrls.chn.chooseFlag: " + Init.dataUrls.chn.chooseFlag);
}

function getSelectedId() {
  if (Init.dataUrls.blr.chooseFlag) {
    return Init.dataUrls.blr.id;
  } else if (Init.dataUrls.rus.chooseFlag) {
    return Init.dataUrls.rus.id;
  } else if (Init.dataUrls.chn.chooseFlag) {
    return Init.dataUrls.chn.id;
  } else {
    return null;
  }
}

function changeDataSource(jsonName, dataObject) {
  showState();
  var dataSources = viewer.dataSources._dataSources;
  for (var i = 0; i < dataSources.length; i++) {
    if (jsonName === null) {
      console.log("jsonName = null");
      for (var data in Init.dataUrls) {
        if (dataSources[i] === Init.dataUrls[data].geoJsonDataSelect && Init.dataUrls[data].chooseFlag) {
//          console.log("true");
          viewer.dataSources.remove(dataSources[i], true);
          viewer.dataSources.add(Init.dataUrls[data].geoJsonData);
        }
      }
    } else if (dataSources[i].name === jsonName){
      console.log("jdataSources[i].name === jsonName");
//      console.log("need set select, index: " + i);
//      console.log("dataObject: ");
//      console.log(dataObject);

//      if (dataSources[i] === Init.dataUrls[data].geoJsonDataSelect && Init.dataUrls[data].chooseFlag) {
        viewer.dataSources.remove(dataSources[i], true);
        viewer.dataSources.add(dataObject.geoJsonDataSelect);
//      }
    } else {
      console.log("other if");
    }

  }



//  for (var i = 0; i < dataSources.length; i++) {
//
//    if (dataSources[i]._name === jsonName) {
//      console.log("dataSources[" + i + "]:");
//      console.log(dataSources[i]);
//      viewer.dataSources.remove(dataSources[i], true);
//      viewer.dataSources.add(dataObject.geoJsonDataSelect);
//    } else if (jsonName === null) {
//
//      for (var data in Init.dataUrls) {
//        if (/*dataSources[i] === Init.dataUrls[data].geoJsonDataSelect &&*/ Init.dataUrls[data].chooseFlag) {
//          viewer.dataSources.remove(dataSources[i], true);
////          viewer.dataSources.add(Init.dataUrls[data].geoJsonData);
//        }
//      }
////      console.log(dataSources[i]);
////      console.log(dataSources[i] === Init.dataUrls.chn.geoJsonData);
////      viewer.dataSources.remove(dataSources[i], true);
////      viewer.dataSources.add(dataObject.geoJsonDataSelect);
//    }
//  }
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
