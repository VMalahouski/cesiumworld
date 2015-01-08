var viewer,
  Init = function () {
  };

Init.prototype.init = function (dataUrls) {
  if (dataUrls === undefined) {
    dataUrls = {
      chn: {
        jsonUrl: "../../Apps/SampleData/chn.json",
        catalogUrl: "https://www.google.ru/"
      },
      rus: {
        jsonUrl: "../../Apps/SampleData/rus.json",
        catalogUrl: "http://www.tut.by/"
      },
      blr: {
        jsonUrl: "../../Apps/SampleData/blr.json",
        catalogUrl: "http://www.onliner.by/"
      }
    }
  }

  initCesiumPlanet();

  // Инициализация по каждому json
  for (var data in dataUrls) {
    initColors(dataUrls[data]);
//    addCatalogAction(dataUrls[data]); not use now
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

  //Устанавливаем точку обзора
  viewer.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(75, 45, 14000000),
    Cesium.Cartesian3.fromDegrees(75, 50, 0), Cesium.Cartesian3.UNIT_Z);
  // Включаем границу дня/ночи
  viewer.scene.globe.enableLighting = true;
  // убираем надпись "Cesium"
  $('.cesium-widget-credits').css({'display': 'none'})
}

/**
 * initialization country colors
 * @param jsonUrl - path to current_map.json
 */
function initColors(jsonUrl) {

  var dataSource = new Cesium.GeoJsonDataSource();
  viewer.dataSources.add(dataSource);
  viewer.scene.primitives.destroyPrimitives = false;

  // глубокий синий: #25059B
  // red 37 green 5 blue 155
  // золотой: #FFD700
  // red 255 green 215 blue 0

  dataSource.loadUrl(jsonUrl.jsonUrl).then(function () {
    // Получаем массив объектов
    var entities = dataSource.entities.entities,
      color = Cesium.Color.GOLD;
    color.alpha = 0.5;

//    if (!color) {
//      color = Cesium.Color.fromRandom({
//        alpha : 0.4
//      });
//      colorHash[entities[0].name] = color;
//    }

    for (var i = 0; i < entities.length; i++) {
      entities[i].polygon.material = Cesium.ColorMaterialProperty.fromColor(color);
//      Поднять область в зависимости от численности населения штата (). Каждый объект хранит свойства для функции GeoJSON он был создан Поскольку население огромное количество, мы делим на 50.
//      entity.polygon.extrudedHeight = new Cesium.ConstantProperty(entity.properties.Population / 50.0);
    }
  });
}

function addCatalogAction(dataUrls) {

//    addPolygon()
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//  handler.destroy();
  handler.setInputAction(function () {
    alert("go to " + dataUrls.catalogUrl);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  var primitives = viewer.scene.primitives;

  handler.setInputAction(function(movement) {
    // clear picked flags
    var numberOfPrimitves = primitives.length;
    for (var i = 0; i < numberOfPrimitves; ++i) {
      var p = primitives.get(i);
      p.processedPick = false;
    }

    // get an array of all primitives at the mouse position
    var pickedObjects = viewer.scene.drillPick(movement.endPosition);
    if(Cesium.defined(pickedObjects)) {
      console.log('Cesium.defined(pickedObjects) = true');
      for( i=0; i<pickedObjects.length; ++i) {
        var polygon = pickedObjects[i].primitive;
        if(polygon.picked === false) {
          console.log('polygon.picked = false!!!!!!!!!!!!!');
        }else {
          console.log('polygon.picked = true!!!!!!!!!!!!!');
        }
      }
    }

  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}