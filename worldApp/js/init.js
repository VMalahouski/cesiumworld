var viewer;
initCesiumPlanet();

/**
 * initialization planet and parts
 */
function initCesiumPlanet() {
  var russiaUrl = '../dataJSONs/russia.json',
    chinaUrl = '../dataJSONs/china.json',
    belarusUrl = '../dataJSONs/belarus.json';
  viewer = new Cesium.Viewer('cesiumContainer');
//  viewer = new Cesium.Viewer('cesiumContainer', {
//    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
//      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
//    }),
//    baseLayerPicker: false
//  });

  //Устанавливаем точку обзора
  viewer.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(75, 45, 14000000),
    Cesium.Cartesian3.fromDegrees(75, 50, 0), Cesium.Cartesian3.UNIT_Z);
  // Добавляем json карты
  viewer.dataSources.add(Cesium.GeoJsonDataSource.fromUrl(russiaUrl));
  viewer.dataSources.add(Cesium.GeoJsonDataSource.fromUrl(chinaUrl));
  // Включаем границу дня/ночи
  viewer.scene.globe.enableLighting = true;
  // Раскрашиваем страны
  initColors(russiaUrl);
  initColors(chinaUrl);
}

/**
 * initialization country colors
 * @param jsonUrl - path to current_map.json
 */
function initColors(jsonUrl) {

  var dataSource = new Cesium.GeoJsonDataSource();
  viewer.dataSources.add(dataSource);

  dataSource.loadUrl(jsonUrl).then(function() {
    // Получаем массив объектов
    var entities = dataSource.entities.entities,
      colorHash = {};
    console.log('entities[0].name: ');
    console.log(entities[0].name);
    console.log('entities.length: ' + entities.length);
    for (var i = 0; i < entities.length; i++) {
      // Для каждого объекта, создать случайный цвет, основанный на имени государства.
      // Некоторые государства имеют несколько объектов,
      // поэтому мы накапливаем цвет в хэш, так что мы используем тот же цвет для всего государства.
      var entity = entities[i];
      var name = entity.name;
      var color = colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({
          alpha : 0.3
        });
        colorHash[name] = color;
      }

      //Устанавливаем polygon.material для нашего случайного цвета.
      entity.polygon.material = Cesium.ColorMaterialProperty.fromColor(color);

      //Выдавите полигон зависимости от численности населения штата. Каждый объект хранит свойства для функции GeoJSON он был создан Поскольку население огромное количество, мы делим на 50.
//      entity.polygon.extrudedHeight = new Cesium.ConstantProperty(entity.properties.Population / 50.0);
    }
  });
}