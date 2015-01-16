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
//        jsonUrl: "../../Apps/SampleData/map_2_polygons.topojson",
//        jsonUrl: "../../Apps/SampleData/map_2_polygons.geojson",
        catalogUrl: "http://www.onliner.by/"
      }
    }
  }
  Init.dataUrls = dataUrls;
  initCesiumPlanet();

  // Инициализация по каждому json
  for (var data in dataUrls) {
    initColors(dataUrls[data]);
    addCatalogAction(dataUrls[data]);
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
  // убираем надпись "Cesium" .cesium-widget-credits уже убрано Егором
  $('.cesium-widget-credits').css({'display': 'none'});
}

/**
 * initialization country colors
 * @param jsonUrl - path to current_map.json
 */
function initColors(jsonUrl, color) {

  viewer.scene.primitives.destroyPrimitives = true;

//  viewer.dataSources.add(Cesium.GeoJsonDataSource.fromUrl(jsonUrl.jsonUrl, {
//    stroke: Cesium.Color.HOTPINK,
//    fill: Cesium.Color.RED,
//    strokeWidth: 16,
//    markerSymbol: 'DDD'
//  }));


  var dataSource = new Cesium.GeoJsonDataSource({
    stroke : Cesium.Color.GOLD,
    fill : Cesium.Color.PINK ,
    strokeWidth :  5 ,
    markerSymbol :  'DDD'
  });
  viewer.dataSources.add(dataSource, {stroke: Cesium.Color.GREEN});
  viewer.scene.primitives.destroyPrimitives = true;

  // глубокий синий: #25059B
  // red 37 green 5 blue 155
  // золотой: #FFD700
  // red 255 green 215 blue 0

  dataSource.fromUrl(jsonUrl.jsonUrl, {stroke: Cesium.Color.GREEN}).then(function () {
    // Получаем массив объектов
    var entities = dataSource.entities.entities,
      color = color ? color : Cesium.Color.GOLD;


    if (!jsonUrl.id.indexOf('BLR')){
      color = new Cesium.Color(1.0, 0.0, 1.0, 0.5);
    } else if (!jsonUrl.id.indexOf('RUS')){
      color = new Cesium.Color(0.0, 1.0, 0.0, 0.5);
    } else if (!jsonUrl.id.indexOf('CHN')){
      color = new Cesium.Color(0.0, 0.0, 1.0, 0.5);
    }

    for (var i = 0; i < entities.length; i++) {
      entities[i].polygon.material = Cesium.ColorMaterialProperty.fromColor(color);
//      Поднять область в зависимости от численности населения штата (). Каждый объект хранит свойства для функции GeoJSON он был создан Поскольку население огромное количество, мы делим на 50.
//      entity.polygon.extrudedHeight = new Cesium.ConstantProperty(entity.properties.Population / 50.0);
    }
  });
}

function addCatalogAction() {

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  primitives = viewer.scene.primitives;

  handler.setInputAction(function (movement) {
//    alert("go to " + dataUrl.catalogUrl);
    console.log('left_click1');
    console.log(Cesium.GeoJsonDataSource);
    console.log(viewer.dataSources);

//    var dataSource = new Cesium.GeoJsonDataSource();
//    dataSource.loadUrl(Init.dataUrls['blr'].jsonUrl).then(function () {
//      var entities = dataSource.entities.entities,
//        color = Cesium.Color.AQUAMARINE;
//      for (var i = 0; i < entities.length; i++) {
//        entities[i].polygon.material = Cesium.ColorMaterialProperty.fromColor(color);
//      }
//    });
//
//    var pickedObjects = viewer.scene.drillPick(movement.endPosition);
//    for (var i = 0; i < numberOfPrimitves; ++i) {
//      var p = primitives.get(i);
//      p.processedPick = false;
//    }
//    if (Cesium.defined(pickedObjects)) {
//
//    } else {
//      console.log('not defined pickedObjects');
//    }


  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (movement) {
    console.log('action!!!');
    planetEventHandler(movement, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//    // return unpicked primitives to their original color
//    for (i = 0; i < numberOfPrimitves; ++i) {
//      var primitive = primitives.get(i);
//
//      if(primitive.processedPick === false && Cesium.defined(originalColor[primitive.id])) {
//        primitive.material.uniforms.color = originalColor[primitive.id];
//        primitive.picked = false;
//      }
//    }

//
//    // get an array of all primitives at the mouse position
//    var pickedObjects = viewer.scene.drillPick(movement.endPosition);


  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function planetEventHandler(movement, handlerType) {
  var
    numberOfPrimitves = primitives.length,
    originalColor = {};
  originalColor.gold = Cesium.Color.GOLD;
  originalColor.aquamarine = Cesium.Color.AQUAMARINE;
  originalColor.black = Cesium.Color.BLACK;
  // очищаем выбранные флаги
  for (var i = 0; i < numberOfPrimitves; ++i) {
    var p = primitives.get(i);
    p.processedPick = true;
  }

  var pickedObjects = viewer.scene.drillPick(movement.endPosition);
  if (Cesium.defined(pickedObjects)) {
    for (i = 0; i < pickedObjects.length; ++i) {
      var polygon = pickedObjects[i].primitive;
      if (polygon.picked === false) {
        console.log('polygon picked false');
        console.log(pickedObjects);

        for (var data in pickedObjects) {
          if (pickedObjects[i].id._id.indexOf('BLR') >= 0) {
            console.log('Belarus');
            resetJson();
          } else if (pickedObjects[i].id._id.indexOf('RUS') >= 0) {
            console.log('Russia');
          } else if (pickedObjects[i].id._id.indexOf('CHN') >= 0) {
            console.log('China');
          }
        }
        polygon.picked = true;
      } else {
        polygon.picked = false;
      }
      polygon.processedPick = true;
    }
  } else {
    polygon.processedPick = true;
    console.log('not defined pickedObjects');
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


function hui() {
// A solid white line segment
  var primitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.SimplePolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray([
          0.0, 0.0,
          5.0, 0.0
        ])
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 1.0, 1.0))
      }
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
      translucent: false
    })
  });

// Two rectangles in a primitive, each with a different color
  var instance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0)
    }),
    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5)
  });

  var anotherInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(0.0, 40.0, 10.0, 50.0)
    }),
    color: new Cesium.Color(0.0, 0.0, 1.0, 0.5)
  });

  var rectanglePrimitive = new Cesium.Primitive({
    geometryInstances: [instance, anotherInstance],
    appearance: new Cesium.PerInstanceColorAppearance()
  });
}