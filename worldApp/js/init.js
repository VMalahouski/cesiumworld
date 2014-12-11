var viewer;
initCesiumPlanet();

/**
 * initialization planet and parts
 */
function initCesiumPlanet() {
  var chinaUrl = '../../Apps/SampleData/chn.json',
    russiaUrl = '../../Apps/SampleData/rus.json',
    belarusUrl = '../../Apps/SampleData/blr.json';
  viewer = new Cesium.Viewer('cesiumContainer');
//  viewer = new Cesium.Viewer('cesiumContainer', {
//    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
//      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
//    }),
//    baseLayerPicker: false
//  });

  // Включаем возможность читать json выбранной области
  Cesium.viewerEntityMixin(viewer);

  //Устанавливаем точку обзора
  viewer.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(75, 45, 14000000),
    Cesium.Cartesian3.fromDegrees(75, 50, 0), Cesium.Cartesian3.UNIT_Z);
  // Добавляем json карты
//viewer.dataSources.add(Cesium.GeoJsonDataSource.fromUrl(russiaUrl));
//viewer.dataSources.add(Cesium.GeoJsonDataSource.fromUrl(chinaUrl));
//viewer.dataSources.add(Cesium.GeoJsonDataSource.fromUrl(belarusUrl));
  // Включаем границу дня/ночи
  viewer.scene.globe.enableLighting = true;
  // Раскрашиваем страны
  initColors(russiaUrl);
  initColors(chinaUrl);
  initColors(belarusUrl);

  eventBox();

}

/**
 * initialization country colors
 * @param jsonUrl - path to current_map.json
 */
function initColors(jsonUrl) {

  var dataSource = new Cesium.GeoJsonDataSource();
  viewer.dataSources.add(dataSource);

  dataSource.loadUrl(jsonUrl).then(function () {
    // Получаем массив объектов
    var entities = dataSource.entities.entities,
      colorHash = {};

    var color = Cesium.Color.fromRandom({
      alpha: 0.4
    });
    colorHash[entities[0].name] = color;

    for (var i = 0; i < entities.length; i++) {
      entities[i].polygon.material = Cesium.ColorMaterialProperty.fromColor(color);
//      Поднять область в зависимости от численности населения штата (). Каждый объект хранит свойства для функции GeoJSON он был создан Поскольку население огромное количество, мы делим на 50.
//      entity.polygon.extrudedHeight = new Cesium.ConstantProperty(entity.properties.Population / 50.0);
    }
//    for (var i = 0; i < entities.length; i++) {
//      // Для каждого объекта, создать случайный цвет, основанный на имени государства.
//      // Некоторые государства имеют несколько объектов,
//      // поэтому мы накапливаем цвет в хэш, так что мы используем тот же цвет для всего государства.
//      var entity = entities[i],
//        name = entity.name,
//        color = colorHash[name];
//      if (!color) {
//        color = Cesium.Color.fromRandom({
//          alpha : 0.3
//        });
//        colorHash[name] = color;
//      }
//
//      //Устанавливаем polygon.material для нашего случайного цвета.
//      entity.polygon.material = Cesium.ColorMaterialProperty.fromColor(color);
//

//    }
  });
}

function MyObject() {};
MyObject.prototype.myListener = function (arg1, arg2) {
  this.myArg1Copy = arg1;
  this.myArg2Copy = arg2;
  console.log('My listener\t' + arg1 + '\t' + arg2);
};

function eventBox() {
  console.log('eventBox');
  var myArg1Copy, myArg2Copy;


  var myObjectInstance = new MyObject();
  var evt = new Cesium.Event();
  evt.addEventListener(MyObject.prototype.myListener, myObjectInstance);
  evt.raiseEvent('1', '2');
  evt.removeEventListener(MyObject.prototype.myListener);
  console.log('eventBox end');
}
