import Mock from 'mockjs'
class API {
  constructor (path) {
    this.__path = path
    this._hosts = {}
  }

  setOrigin (path) {
    API.prototype.originPath = path
    return this
  }

  // 添加同源API
  add (apis) {
    apis.forEach(api => {
      Object.defineProperty(this, api.name || api, {
        value: api.url || api,
        writable: false,
        enumerable: false,
        configurable: false
      })
    })
  }

  // 添加跨域API
  cross (api) {
    // let _hosts=this._hosts
    // let rxg=/https?:\/\/[\.\d]+\//g
    // rxg.exec(apis)
    // let host=apis.slice(0,rxg.lastIndex)
    // let path=apis.slice(rxg.lastIndex)
    // if(!_hosts[host])_hosts[host]=[]
    // _hosts[host].push(path)
    this[`cross_${api.name}`] = api.url
  }
}
const api = new API()
const proxy = new Proxy(api, {
  get (target, key, receiver) {
    key = key.split('/').pop()
    let param = ''
    if (key.includes('?')) {
      param = key.slice(key.indexOf('?'))
      key = key.slice(0, key.indexOf('?'))
    }
    if ('cross_' + key in target) {
      return target['cross_' + key]
    } else if (key in target && !key.includes('__')) {
      return `${target.originPath}${target[key]}${param}`
    } else {
      return new Error('wrong api !')
    }
  }
})
export default proxy
// mock
const url = 'http://api/'
const mockdata = {
  login (obj) {
    const { username } = JSON.parse(obj.body)
    return {
      data: {
        success: username === 'username'
      }
    }
  },
  getfavorite: {
    data: [

    ]
  },
  search: {
    data: [{ name: '储运部一车间' }, { name: '培训与交流安置中心' }, { name: '金石物流（铁卸）' }, { name: '腈纶部' }, { name: '热电部东区' }, { name: '股份公司机关' }]
  },
  loadLocation: {
    data: { id: '9ebd0c0fe46d49d38cb4b4cec27784a7', name: '环保水务部东区', key: '', type: '行政区域', layer: 'XZQYu', disable: false, state: null, showType: 'PolygonShow', geoType: 'multipolygon', maxzoom: 40, minzoom: 10, zoom: 16, coords: [[[[13505208.882059857, 3596091.3709614994], [13505229.29749745, 3595948.215853487], [13505255.266801577, 3595772.703251936], [13505290.514962895, 3595546.0823540865], [13505517.259660669, 3595577.7219065083], [13505434.111027336, 3596126.2862261157], [13505208.882059857, 3596091.3709614994]]]], center: [13505361.97860371, 3595836.184290101, 232.2092455457896] }
  },
  getmapicons: {
    data: {
      curIcon: require('../assets/map/curCoord.png'),
      markIcon: require('../assets/map/mark.png'),
      actIcon: require('../assets/map/pin.png'),
      roadsIcon: require('../assets/map/roadstart.png'),
      roadeIcon: require('../assets/map/roadend.png'),
      lfarwIcon: require('../assets/map/leftarrow.png'),
      mk1Icon: require('../assets/map/custom-pin1.png'),
      mk2Icon: require('../assets/map/custom-pin2.png'),
      mk3Icon: require('../assets/map/custom-pin3.png'),
      mk4Icon: require('../assets/map/custom-pin4.png'),
      mk5Icon: require('../assets/map/custom-pin5.png'),
      mk6Icon: require('../assets/map/custom-pin6.png'),
      mspIcon: require('../assets/map/msp.png')
    }
  },
  gettiles: {
    data: [
      { appid: 'photo', name: '卫星地图', selected: false, require: true, icon: require('../assets/funimg/aerial.jpg'), param: 'AerialWithLabelsOnDemand', loadType: 'bingmap' },
      { appid: 'plat', name: '平面地图', selected: true, require: true, icon: require('../assets/funimg/plat.jpg'), param: 'RoadOnDemand', loadType: 'bingmap' }
    ]
    // data:[
    //   {
    //     appid:'photo',
    //     name:'卫星地图',
    //     selected: false,
    //     require: true,
    //     icon: require('../assets/funimg/aerial.jpg'),
    //     param:{
    //       url:'http://10.136.238.156:2142/geoserver/gwc/service/wmts',
    //       LAYER: "spcgis:L18WX",
    //       TILEMATRIXSET: "EPSG:3857",
    //       FORMAT: "image/jpeg",
    //       STYLE: "",
    //     },
    //     loadType:'wmts'
    //   },
    //   {
    //     appid:'plat',
    //     name:'平面地图',
    //     selected: true,
    //     require: true,
    //     icon: require('../assets/funimg/plat.jpg'),
    //     param:{
    //       url: "http://10.136.52.197:2142/geoserver/gwc/service/wmts?20191030",
    //       LAYER: "spcgis:spc-shanghai",
    //       TILEMATRIXSET: "EPSG:3857",
    //       FORMAT: "image/jpeg",
    //       STYLE: "",
    //     },
    //     loadType:'wmts'
    //   }
    // ],
  },
  getapplayers: {
    data: [
      {
        appid: 'XZQYu',
        name: '行政区域',
        icon: require('../assets/funimg/applayer/xzqy.png'),
        seticon: require('../assets/funimg/applayer/xzqy.png'),
        selected: true,
        loadType: 'vector',
        param: {
          normal: {
            Text: true,
            TFC: '#999',
            TSL: 0.9,
            TOY: 12,
            icon: {
              url: require('../assets/funimg/applayer/xzqy.png'),
              scale: 0.6,
              ac: [0.5, 0.8]
            }
          }
        },
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'ywfb',
        name: '异味分布',
        icon: require('../assets/funimg/applayer/yiwei.png'),
        seticon: require('../assets/funimg/applayer/yiwei.png'),
        selected: false,
        loadType: 'heatmap',
        param: {},
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'zsfb',
        name: '噪声分布',
        icon: require('../assets/funimg/applayer/zaosheng.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'cqzy',
        name: '厂区作业',
        icon: require('../assets/funimg/applayer/zuoye.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'cqdl',
        name: '厂区道路',
        icon: require('../assets/funimg/applayer/luzhang.png'),
        seticon: require('../assets/funimg/applayer/luzhang.png'),
        selected: false,
        loadType: 'vector',
        param: {
          normal: [{
            SW: 8,
            SC: '#0fdcad'
          }, {
            SW: 4,
            SC: '#fff'
          }],
          gold: [
            {
              SW: 8,
              SC: '#e6b732'
            }, {
              SW: 4,
              SC: '#fff'
            }
          ],
          red: [
            {
              SW: 8,
              SC: '#e62411'
            }, {
              SW: 4,
              SC: '#fff'
            }
          ]
        },
        loadFeature: {
          type: 'geojson'
        },
        dynamic: 0
      },
      {
        appid: 'xjlx',
        name: '巡检路线',
        icon: require('../assets/funimg/applayer/game2.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'ltejz',
        name: 'LTE基站',
        icon: require('../assets/funimg/applayer/leida.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'xfss',
        name: '消防设施',
        icon: require('../assets/funimg/applayer/xiaofang.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0
      },
      {
        appid: 'glzx',
        name: '光缆走向',
        icon: require('../assets/funimg/applayer/glzx.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0
      }
    ]
  },
  getellayers: {
    data: [
      {
        appid: 'sxj',
        name: '摄像机',
        icon: require('../assets/funimg/applayer/128/camera.png'),
        seticon: require('../assets/ele/摄像机.png'),
        selected: false,
        loadType: 'vector',
        param: {
          normal: {
            icon: {
              url: require('../assets/ele/摄像机.png'),
              ac: [0.5, 0.5],
              scale: 0.5
            }
          }
        },
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'blue'
      },
      {
        appid: 'gwc',
        name: '公务车',
        icon: require('../assets/funimg/applayer/128/car.png'),
        seticon: require('../assets/ele/公务车头.png'),
        selected: false,
        loadType: 'vector',
        param: {
          normal: {
            icon: {
              url: require('../assets/ele/公务车.png'),
              ac: [0.5, 0.5],
              scale: 0.9
            },
            defaultH: Math.PI / 2,
            Rotate: true
          }
        },
        loadFeature: {

        },
        dynamic: 1,
        bgcolor: 'blue'
      },
      {
        appid: 'voc',
        name: 'Voc',
        icon: require('../assets/funimg/applayer/128/Voc.png'),
        seticon: require('../assets/ele/Voc.png'),
        selected: true,
        loadType: 'vector',
        param: {
          normal: {
            icon: {
              url: require('../assets/ele/Voc.png'),
              ac: [0.5, 0.5],
              scale: 0.5
            }
          }
        },
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'green'
      },
      {
        appid: 'FBQYMJin',
        name: '门禁',
        icon: require('../assets/funimg/applayer/128/menjin.png'),
        seticon: require('../assets/ele/门禁.png'),
        selected: false,
        loadType: 'vector',
        param: {
          normal: {
            icon: {
              url: require('../assets/ele/门禁.png'),
              ac: [0.5, 0.5],
              scale: 0.5
            }
          },
          danger: {
            FC: 'rgba(236, 78, 86, 0.4)'
          }
        },
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'green'
      },
      {
        appid: 'xzqy4',
        name: '储罐',
        icon: require('../assets/funimg/applayer/128/youguan2.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'yellow'
      },
      {
        appid: 'xzqy5',
        name: '雨水',
        icon: require('../assets/funimg/applayer/128/qingxiashui.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'green'
      },
      {
        appid: 'xzqy6',
        name: '污水',
        icon: require('../assets/funimg/applayer/128/wushui.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'green'
      },
      {
        appid: 'xzqy7',
        name: '排气筒',
        icon: require('../assets/funimg/applayer/128/yanchong.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'green'
      },
      {
        appid: 'xzqy8',
        name: '生产装置',
        icon: require('../assets/funimg/applayer/128/proeqt.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'yellow'
      },
      {
        appid: 'xzqy9',
        name: '生产设备',
        icon: require('../assets/funimg/applayer/128/prodev.png'),
        selected: false,
        loadType: 'vector',
        param: {},
        loadFeature: {},
        dynamic: 0,
        bgcolor: 'yellow'
      }
    ]
  },
  getgisdata: {
    data: [{ appid: 'cqdl', appobjname: '厂区道路', appobjid: 'cqdl', loadtemp: 'linestring', gisdatasource: { type: 'FeatureCollection', features: [{ type: 'Feature', id: '47', geometry: { type: 'LineString', coordinates: [[121.33458298921242, 30.710938155163138], [121.33458302891242, 30.710938183463135], [121.33070438771242, 30.707416462663137], [121.33070437951241, 30.707416481263138], [121.33067745021242, 30.707392072763138], [121.33038553781242, 30.707031128163138], [121.33038566831242, 30.707031267963135], [121.32994480051242, 30.706601935063137], [121.32951815431242, 30.706197133663135], [121.32902040031242, 30.705847531163137], [121.32845740831242, 30.70544438106314], [121.32789689861242, 30.705099254663136], [121.32720715381242, 30.704737381163138], [121.32665962451242, 30.704485908963136], [121.32565700581242, 30.70414243356314], [121.32384268541242, 30.703632301963136], [121.32304024231242, 30.703461612663137], [121.32180296821242, 30.703148801463136], [121.32072924181242, 30.70292799286314], [121.31952752161241, 30.702829855563138], [121.31843957371242, 30.702860523463137], [121.31706008421241, 30.703032263663136], [121.31624234561242, 30.703179469263137], [121.31500129831242, 30.703365767463136], [121.31377253791241, 30.703572016363136], [121.31272962491242, 30.703735577263135], [121.31159664211242, 30.70390322676314], [121.31069594451242, 30.70405452006314], [121.30959614531241, 30.704222169063137], [121.30844976581241, 30.704391013463137], [121.30752928131241, 30.704561555163135], [121.30676605861242, 30.704680135563137], [121.30591750661242, 30.704823249563137], [121.30539605011242, 30.704896851063136], [121.30519301321242, 30.704916732463136], [121.30280772961241, 30.704737381163138]] }, properties: { Name: '大堤路', CFCC: 'L01' } }, { type: 'Feature', id: '1584', geometry: { type: 'LineString', coordinates: [[121.32634613464016, 30.70818408833984], [121.32628189881386, 30.70861192114332], [121.32621680653952, 30.70899855697621]] }, properties: { Name: null, CFCC: 'L21' } }, { type: 'Feature', id: '1585', geometry: { type: 'LineString', coordinates: [[121.32953447680647, 30.70068703800142], [121.32465623434658, 30.70008968789812]] }, properties: { Name: null, CFCC: 'L21' } }, { type: 'Feature', id: '1586', geometry: { type: 'LineString', coordinates: [[121.32627463198261, 30.704052234437256], [121.32661292163571, 30.7019227269564], [121.32696767084418, 30.699885854981815], [121.32698091164258, 30.699831988222222], [121.32709166512632, 30.699849587442873], [121.32783098881593, 30.699948949852185], [121.3296116738372, 30.700172974409]] }, properties: { Name: null, CFCC: 'L21' } }, { type: 'Feature', id: '9712', geometry: { type: 'LineString', coordinates: [[121.29815221055837, 30.724914957614228], [121.29835029856126, 30.724055427932125], [121.29745287378296, 30.723948632661003], [121.29530835583861, 30.72371351081409]] }, properties: { Name: '', CFCC: 'L21' } }] } }, { appid: 'ywfb', appobjname: '异味分布', loadtemp: 'point', icourl: '/Content/map/IcoManage/ele/门禁.png', total: null, gisdatasource: [{ subgisdatas: [], geomsttext: 'POINT (121.3106796917569 30.711413896520611)', gisid: '0e266c3148424e01a8927df017d59d3d', name: '芳烃部2#控制室', data_key: '63', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31629078074968 30.710343204666628)', gisid: '17495090401f4a2ca3410a7300f77639', name: '聚乙烯醇装置门禁', data_key: '46', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.3190873104987 30.70650535074742)', gisid: '22c9c41f732c426c94d0bf1306032f99', name: '工业长丝装置门禁', data_key: '31', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31261773590217 30.701021111512233)', gisid: '2c07560ba1c042d4814e6d7c82443f33', name: '1#碳五东', data_key: '39', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31617443150853 30.70664948489096)', gisid: '2c7802b759bd4300ac8a95f921a1bebe', name: '1号聚酯联合装置门禁', data_key: '32', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31162197295677 30.702640949715814)', gisid: '3da51fc31f7142e79dd624003c3e4202', name: '精细化工罐区', data_key: '40', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.3052756090061 30.702523081632322)', gisid: '3f8cac8f22854412b19960b61a7b7d28', name: '储运部二车间东', data_key: '', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.29690945242099 30.701544283344759)', gisid: '43df4b24cd044ca08f03477c6620f7b3', name: '烯烃14号门', data_key: '20', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.3068901655045 30.703229921979641)', gisid: '5daa9c1f80c042e4850ca81496449413', name: '火炬区', data_key: '59', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31260282583297 30.701264979017935)', gisid: '89abc01bbfae4d9bbb0abc7aec23c198', name: '2号碳五装置门禁', data_key: '39', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.32470586313727 30.707365711462103)', gisid: '8bd166ab2df54fdca8d17e6a3575308d', name: '1PE装置门禁', data_key: '43', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.30002924268018 30.707168624614596)', gisid: '9027903a642d4779ad759629b12dbfef', name: '储运一车间西', data_key: '', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.3122527975565 30.700419303812438)', gisid: '93723b57eb30497d9f7fe04f2f27a23d', name: '1号碳五装置门禁', data_key: '39', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.30155765643433 30.712478106511128)', gisid: '9af1d287f4e44d239d2014d74501a1d5', name: '乙二醇北门', data_key: '21', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31247688009954 30.710654278740677)', gisid: '9fc4be08db2d4525bae946502ab09476', name: '芳烃部纯水（在建）', data_key: '75', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.32624576471848 30.704017935736019)', gisid: 'a0996be8f1a448fe89cd217ff70896aa', name: '塑料部PP北', data_key: '57', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31411606262425 30.707474095887719)', gisid: 'a2fda04f630a47c48a55c63e6970fcc4', name: '芳烃4#门', data_key: '67', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.30982003398016 30.700720120417145)', gisid: 'cb475db6de514e4e8d53d49685ea811c', name: '异戊烯装置门禁', data_key: '38', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.32734010599641 30.701999983089365)', gisid: 'd2b368d1b9964d88b52fb936f499d896', name: '塑料部PP装置', data_key: '57', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.29699561651219 30.710022901724813)', gisid: 'dcac3316a4e14031b6388e58b9e9c589', name: '5#6#炼油', data_key: '62', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31798254219511 30.707169333605293)', gisid: 'e4ea9a0f754c4afa9cf8368c93e4c287', name: '工业长丝北', data_key: '31', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.30165829429201 30.711187324800775)', gisid: 'e4ebd4411eee4c528899093b8920143b', name: '乙二醇装置', data_key: '21', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.29880866087827 30.701738955754834)', gisid: 'eaa4815560994674a2586ed1ac20acab', name: '储运部二车间西', data_key: '', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31181694837906 30.710756675539471)', gisid: 'fc11144869184a90a674610939745604', name: '芳烃部炼化一路', data_key: '63', appobjname: '封闭区域门禁', appobjid: 'ywfb', Disenable: false, CallType: null, ShowTemp: 'PointShow' }] }, { appid: 'XZQYu', appobjname: '行政区域', loadtemp: 'multipolygon', icourl: '/Content/map/IcoManage/funimg/行政区域.png', total: null, gisdatasource: [{ subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29965441913382 30.710194157733987, 121.30000888842272 30.708257254912532, 121.29820500247469 30.70802583041193, 121.29837893247378 30.706982250417358, 121.29775210377318 30.706891144929763, 121.29803107247558 30.705451666425322, 121.30474477044066 30.70603143308897, 121.30397947844465 30.710762329064366, 121.29965441913382 30.710194157733987)))', gisid: '049d1ba240e4451fa6d144d5ee4295a0', name: '储运部一车间', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.32242627982173 30.724417800930933, 121.3225797390473 30.723659666547931, 121.32278759613267 30.723690873741187, 121.3231223402174 30.722162129353283, 121.32607809404202 30.722690585376547, 121.32554993953468 30.724957496452426, 121.32242627982173 30.724417800930933)))', gisid: '052d81c78e5541e29d6063af7f0bd7a1', name: '培训与交流安置中心', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31477481059962 30.704883935155564, 121.31504837457344 30.70356464390327, 121.31545721743548 30.703516544743032, 121.31692080616848 30.703289791559044, 121.31843850645679 30.703139052226511, 121.31989178822688 30.703121873954995, 121.32059609735897 30.703159666152327, 121.32068594615684 30.703166088004735, 121.32056174081595 30.70398422318501, 121.32069573133376 30.704003119283673, 121.32156838752667 30.704205822887541, 121.32259521870644 30.704487117083584, 121.32246638167008 30.705167376635547, 121.32338885485039 30.70531682759772, 121.32323940388822 30.706265068185306, 121.32179347801532 30.706083158135147, 121.32091451615747 30.705972567393626, 121.3208356329973 30.7059626423359, 121.32078279612666 30.706303680318992, 121.31973135720214 30.706168803970762, 121.31869403324558 30.706035738260589, 121.31877906568957 30.705463701819166, 121.31477481059962 30.704883935155564)))', gisid: '071f97edc7a04f579725fade20e9d99c', name: '金石物流（铁卸）', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31709630429026 30.709423402677693, 121.32267298994583 30.710060330626348, 121.32214293708051 30.712999449450109, 121.3201472150996 30.712719348119453, 121.3200888606557 30.713104487449105, 121.32004412224872 30.713363192150332, 121.31985349773201 30.714382449770216, 121.31940222336596 30.717004509448859, 121.31935553981084 30.71731573314959, 121.31771772508576 30.717012290041374, 121.31774500470767 30.716853103441014, 121.31536755389011 30.716513467609936, 121.31291666724687 30.716303391611941, 121.31360379082363 30.71234696031642, 121.31746977273113 30.712842973089455, 121.31756313984135 30.712014339986265, 121.31767984872913 30.711162365105515, 121.31780822850567 30.710380415557434, 121.31694458273616 30.710263706669661, 121.31709630429026 30.709423402677693)))', gisid: '219a81deb8f944f1a1c535a33b29e716', name: '腈纶部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.32169504613407 30.717436768102541, 121.32235367088327 30.713400992731472, 121.3258750566232 30.713794092907978, 121.32585571602185 30.713949504484013, 121.32572846956629 30.713935761866811, 121.32568813534827 30.714168601946405, 121.32548027826292 30.715323411249166, 121.32600077988995 30.715426480878261, 121.32575864818399 30.717159391760688, 121.32618731554936 30.717216621629589, 121.3260500603475 30.718050348019606, 121.32169504613407 30.717436768102541)))', gisid: '25e3b202d2e94ff0bc84adb77e3116fe', name: '热电部东区', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.32874236044785 30.71574367050421, 121.32762577279929 30.715610503111893, 121.32738871265235 30.715572710914554, 121.32600077988995 30.715426480878261, 121.32548027826292 30.715323411249166, 121.32572846956629 30.713935761866811, 121.32585571602185 30.713949504484013, 121.3258750566232 30.713794092907978, 121.32903238693204 30.714148381689302, 121.32874236044785 30.71574367050421)))', gisid: '27ee5c2ba03e4a27a583cf6ea2f62c6f', name: '股份公司机关', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29669302827683 30.713330858418932, 121.2971787439039 30.710375336804603, 121.30383446520271 30.711198605466997, 121.30311555453977 30.715813548109729, 121.30278195452316 30.715787038737282, 121.29935866655926 30.714630824115865, 121.29669302827683 30.713330858418932)))', gisid: '31b7fe4aee1149e4b0dc8129c12e2734', name: '化工部西区', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.3003459260802 30.716984925879586, 121.30032015867292 30.7170983024716, 121.30183375526332 30.717274085497213, 121.30179401304204 30.717564297935262, 121.3028816298259 30.717710413593764, 121.30259799747616 30.719504334126025, 121.29896479305019 30.71903858823951, 121.29934399545024 30.716871577539553, 121.3003459260802 30.716984925879586)))', gisid: '37fe6e4b8dea496d97737bacbab6a55d', name: '储运3车间', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31858106689464 30.720026641062159, 121.31058428567545 30.718368312617692, 121.30999182617829 30.718246156020342, 121.30975871067166 30.718240811669205, 121.30918610162158 30.718211799477331, 121.30904562246484 30.718819173384365, 121.30891404869941 30.718964064616905, 121.30870561900517 30.71905110119252, 121.30834169414238 30.718824109421558, 121.30800354620742 30.718570353094222, 121.30815127934247 30.717525914185924, 121.30942590708912 30.71758088465478, 121.30965953158176 30.716715099770269, 121.31320083225519 30.717006700929296, 121.31491178809839 30.717212840187511, 121.31618469801788 30.717351984186806, 121.31764828675121 30.717733341814508, 121.31761102582199 30.717918623643687, 121.31730300349369 30.718990791289624, 121.31876659222704 30.719289693214037, 121.31858106689464 30.720026641062159)))', gisid: '4fe3e0bf5d9d460d83d77da311bc62d1', name: '金石物流（内河）', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31414909205965 30.708936504134165, 121.31477481059962 30.704883935155564, 121.31877906568957 30.705463701819166, 121.31869403324558 30.706035738260589, 121.32078279612666 30.706303680318992, 121.3208356329973 30.7059626423359, 121.32323837486464 30.706264954663133, 121.32261368534827 30.710026465461745, 121.31414909205965 30.708936504134165)))', gisid: '5fad457abafa463d84bcd84751ff6f45', name: '涤纶东区/质管中心', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31040617733082 30.703865152314041, 121.31077748248846 30.701697445318555, 121.30897719963369 30.701535969566315, 121.30832098966182 30.700178886116628, 121.30926665350871 30.699934095747551, 121.31115969902966 30.699535559848403, 121.31302525931619 30.699205737035314, 121.31237740519494 30.703306540373696, 121.31247445182512 30.70332418521555, 121.31242898242496 30.703481631496697, 121.31040617733082 30.703865152314041)))', gisid: '648f4808d9064489abae49ca536f936e', name: '精细化工部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.32317176444414 30.708739383468533, 121.32458059743669 30.699364556518056, 121.33040725240592 30.700042883514474, 121.33192044339792 30.701190821508408, 121.33016375040719 30.709730784463297, 121.32317176444414 30.708739383468533)))', gisid: '6cc571827d7b4307804e281f41e243ba', name: '塑料部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.32827468200587 30.718053038593276, 121.32725819478192 30.717898427267951, 121.32740889712139 30.71696393617907, 121.32753601633061 30.716960500524767, 121.32772155200765 30.716180230285058, 121.32856671262167 30.716228706158123, 121.32827468200587 30.718053038593276)))', gisid: '797fbcd0af0b4111aef90c46fdafb596', name: '公用事业部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31362037861466 30.71200342554398, 121.31414090985974 30.709073408092259, 121.31709616888698 30.70942415260356, 121.31694458273616 30.710263706669661, 121.31780822850567 30.710380415557434, 121.31770789677307 30.71099152701964, 121.31756119347487 30.712031613988753, 121.31750341901211 30.7125443623458, 121.31362037861466 30.71200342554398)))', gisid: '79b8280463ad48788eeb66a81287573d', name: '化工部东区', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.30334771304751 30.716053295011573, 121.30411300504349 30.711102087704333, 121.3042289583762 30.710997729704882, 121.31330810432836 30.712110881699019, 121.3127051469982 30.716153787899934, 121.31024693634448 30.716022374122847, 121.30781191635731 30.715929611456669, 121.30509860837161 30.716014643900667, 121.30334771304751 30.716053295011573)))', gisid: '7f032e7a09164feeac87131f2d8f7653', name: '化工部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.31935553981084 30.71731573314959, 121.31953893480706 30.716210168834177, 121.31977222103521 30.714854695405059, 121.3200888606557 30.713104487449105, 121.32212574293173 30.713348843681107, 121.32137880604998 30.717585376307365, 121.31935553981084 30.71731573314959)))', gisid: '9ebd0c0fe46d49d38cb4b4cec27784a7', name: '环保水务部东区', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29909320062978 30.716843205139568, 121.29816557396784 30.716692465807, 121.29846318752188 30.715109058629871, 121.29925907277725 30.715385806804136, 121.29956141035571 30.715493457305556, 121.30035161084486 30.715738533979, 121.30138692933416 30.716170675809657, 121.301211913512 30.717201867295092, 121.30032015867292 30.7170983024716, 121.3003459260802 30.716984925879586, 121.29909320062978 30.716843205139568)))', gisid: 'a36e5126663147e286ad10c825fd79c5', name: '金地公司', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29003000621258 30.704606658501131, 121.29759274024752 30.705774351507408, 121.29762366113624 30.705898035062322, 121.29767777269153 30.705990797728511, 121.2972560461258 30.708863863639561, 121.2971619950892 30.708864078367981, 121.29582896121957 30.708740394813066, 121.29568809939313 30.709547773574315, 121.29516307194466 30.709461958982768, 121.29418671846264 30.709324456044609, 121.29421763935136 30.709039296737448, 121.2937194694774 30.708963712342776, 121.29362086813919 30.709553826412407, 121.28969073535015 30.709073438552071, 121.28938152646286 30.709111230749407, 121.28929907075958 30.709485717068453, 121.28912041673581 30.709475410105544, 121.28836800844341 30.709097488132194, 121.28774615501455 30.708111455347176, 121.28741633220143 30.707207878265436, 121.28735792607829 30.70665130226832, 121.28744381743586 30.705950428790466, 121.28778051155757 30.705239248349706, 121.28865016155306 30.70464144450095, 121.29003000621258 30.704606658501131)))', gisid: 'ab72a2abc75144ad9e2cf16af00f1089', name: '涤纶部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29641388136461 30.713315397974512, 121.29531189524691 30.712810356791973, 121.29404800392014 30.712021874129395, 121.29308559125846 30.711256582133366, 121.29212094426397 30.7105874344228, 121.28974613527578 30.70962164014184, 121.28980416804701 30.709186260077061, 121.2936060928854 30.70964225406766, 121.2937194694774 30.708963712342776, 121.29421763935136 30.709039296737448, 121.29418671846264 30.709324456044609, 121.29512484305498 30.709455710554113, 121.29568809939313 30.709547773574315, 121.29582896121957 30.708740394813066, 121.2971619950892 30.708864078367981, 121.29641388136461 30.713315397974512)))', gisid: 'af8c1ebd28fd4871a489f9b2bb9f22b7', name: '5-6号炼油', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.3095146038314 30.703927572002534, 121.30899582003164 30.704030641631626, 121.30901299830315 30.703425966474281, 121.30956957430026 30.703388174276949, 121.3098444266445 30.701708139322736, 121.31066898367725 30.701773416754495, 121.31035290348136 30.703724868398652, 121.3095146038314 30.703927572002534)))', gisid: 'b3c97798b028445b8b27e9b25f0c8ffd', name: '金森公司', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.3083915743311 30.704351875308959, 121.30863507632984 30.704864968806287, 121.30568524345598 30.705329164963178, 121.30522604834759 30.704864968806287, 121.29826164569864 30.70422466265082, 121.29902147183317 30.700001711649609, 121.30594882412161 30.700865545104897, 121.30725523167035 30.700494494440164, 121.30815193744347 30.703122769982031, 121.3083915743311 30.704351875308959)))', gisid: 'b8f0fbda9a53437092d1675dda11191a', name: '储运部二车间', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29743641797663 30.70936847536538, 121.29779593470971 30.706896672186161, 121.29837893247378 30.706982250417358, 121.29818986415383 30.708129253370817, 121.29838625222494 30.708156221226794, 121.29817336582465 30.709487005438842, 121.29743641797663 30.70936847536538)))', gisid: 'cdd85372e5a04aa7a5ad1d455e52879c', name: '炼油部办公区', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.32045437661894 30.702693705537495, 121.32105346883799 30.699297561259144, 121.32113077105981 30.698936817557346, 121.32273350379208 30.699114612667515, 121.32437231089455 30.699392900666048, 121.32440838526472 30.699480509850769, 121.32375775823112 30.703404885978184, 121.32363922815767 30.703404885978184, 121.32279921068063 30.703162672349833, 121.32169121216796 30.702863770425488, 121.32045437661894 30.702693705537495)))', gisid: 'e3550eb7dc22465588cd0c5af3c48128', name: '金菲公司', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.30423862115389 30.71077645209494, 121.30496526203895 30.706254272118763, 121.30882264290751 30.705504440567157, 121.3131283766626 30.704804855459731, 121.31465123043236 30.704503376794651, 121.31407919399093 30.707962651220871, 121.31339893443896 30.711878008755797, 121.30423862115389 30.71077645209494)))', gisid: 'f79821c6323342fa9e04b406bbcd59dc', name: '芳烃部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }, { subgisdatas: [], geomsttext: 'MULTIPOLYGON (((121.29328228246742 30.699277386067791, 121.2984643943747 30.699883206443229, 121.29777382785977 30.70423016805038, 121.29555783083418 30.704054949680916, 121.29511978491055 30.703980224199825, 121.28852332864837 30.702892839612858, 121.28906444420113 30.700450089403269, 121.29290378788497 30.701104581548034, 121.29328228246742 30.699277386067791)))', gisid: 'ff30c86957b1468e8f1265d3b0b085f7', name: '烯烃部', data_key: '', appobjname: '行政区域', appobjid: 'XZQYu', Disenable: false, CallType: null, ShowTemp: 'PolygonShow' }] }, { appid: 'FBQYMJin', appobjname: '封闭区域门禁', loadtemp: 'point', icourl: '/Content/map/IcoManage/ele/门禁.png', total: null, gisdatasource: [{ subgisdatas: [], geomsttext: 'POINT (121.3106796917569 30.711413896520611)', gisid: '0e266c3148424e01a8927df017d59d3d', name: '芳烃部2#控制室', data_key: '63', appobjname: '封闭区域门禁', appobjid: 'FBQYMJin', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31629078074968 30.710343204666628)', gisid: '17495090401f4a2ca3410a7300f77639', name: '聚乙烯醇装置门禁', data_key: '46', appobjname: '封闭区域门禁', appobjid: 'FBQYMJin', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.3190873104987 30.70650535074742)', gisid: '22c9c41f732c426c94d0bf1306032f99', name: '工业长丝装置门禁', data_key: '31', appobjname: '封闭区域门禁', appobjid: 'FBQYMJin', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31261773590217 30.701021111512233)', gisid: '2c07560ba1c042d4814e6d7c82443f33', name: '1#碳五东', data_key: '39', appobjname: '封闭区域门禁', appobjid: 'FBQYMJin', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31617443150853 30.70664948489096)', gisid: '2c7802b759bd4300ac8a95f921a1bebe', name: '1号聚酯联合装置门禁', data_key: '32', appobjname: '封闭区域门禁', appobjid: 'FBQYMJin', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31162197295677 30.702640949715814)', gisid: '3da51fc31f7142e79dd624003c3e4202', name: '精细化工罐区', data_key: '40', appobjname: '封闭区域门禁', appobjid: 'FBQYMJin', Disenable: false, CallType: null, ShowTemp: 'PointShow' }] }, { appid: 'sxj', appobjname: '摄像机', loadtemp: 'point', gisdatasource: [{ subgisdatas: [], geomsttext: 'POINT (121.3052756090061 30.702523081632322)', gisid: '3f8cac8f22854412b19960b61a7b7d28', name: '储运部二车间东', data_key: '', appobjname: '摄像机', appobjid: 'sxj', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.29690945242099 30.701544283344759)', gisid: '43df4b24cd044ca08f03477c6620f7b3', name: '烯烃14号门', data_key: '20', appobjname: '摄像机', appobjid: 'sxj', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.3068901655045 30.703229921979641)', gisid: '5daa9c1f80c042e4850ca81496449413', name: '火炬区', data_key: '59', appobjname: '摄像机', appobjid: 'sxj', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31260282583297 30.701264979017935)', gisid: '89abc01bbfae4d9bbb0abc7aec23c198', name: '2号碳五装置门禁', data_key: '39', appobjname: '摄像机', appobjid: 'sxj', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.32470586313727 30.707365711462103)', gisid: '8bd166ab2df54fdca8d17e6a3575308d', name: '1PE装置门禁', data_key: '43', appobjname: '摄像机', appobjid: 'sxj', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.30002924268018 30.707168624614596)', gisid: '9027903a642d4779ad759629b12dbfef', name: '储运一车间西', data_key: '', appobjname: '摄像机', appobjid: 'sxj', Disenable: false, CallType: null, ShowTemp: 'PointShow' }] }, { appid: 'voc', appobjname: 'Voc', loadtemp: 'point', gisdatasource: [{ subgisdatas: [], geomsttext: 'POINT (121.32734010599641 30.701999983089365)', gisid: 'd2b368d1b9964d88b52fb936f499d896', name: '塑料部PP装置', data_key: '57', appobjname: 'Voc', appobjid: 'voc', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.29699561651219 30.710022901724813)', gisid: 'dcac3316a4e14031b6388e58b9e9c589', name: '5#6#炼油', data_key: '62', appobjname: 'Voc', appobjid: 'voc', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31798254219511 30.707169333605293)', gisid: 'e4ea9a0f754c4afa9cf8368c93e4c287', name: '工业长丝北', data_key: '31', appobjname: 'Voc', appobjid: 'voc', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.30165829429201 30.711187324800775)', gisid: 'e4ebd4411eee4c528899093b8920143b', name: '乙二醇装置', data_key: '21', appobjname: 'Voc', appobjid: 'voc', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.29880866087827 30.701738955754834)', gisid: 'eaa4815560994674a2586ed1ac20acab', name: '储运部二车间西', data_key: '', appobjname: 'Voc', appobjid: 'voc', Disenable: false, CallType: null, ShowTemp: 'PointShow' }, { subgisdatas: [], geomsttext: 'POINT (121.31181694837906 30.710756675539471)', gisid: 'fc11144869184a90a674610939745604', name: '芳烃部炼化一路', data_key: '63', appobjname: 'Voc', appobjid: 'voc', Disenable: false, CallType: null, ShowTemp: 'PointShow' }] }]
  },
  getdydata (obj) {
    const { i } = JSON.parse(obj.body)
    const lines = [[{ coord: [13505512.93499273, 3595088.1383845834], h: -0.1141 }, { coord: [13505522.869985461, 3595089.276769167], h: -0.1141 }, { coord: [13505532.804978192, 3595090.41515375], h: -0.1141 }, { coord: [13505542.739970922, 3595091.5535383336], h: -0.1141 }, { coord: [13505552.674963653, 3595092.691922917], h: -0.1141 }, { coord: [13505562.609956384, 3595093.8303075004], h: -0.1141 }, { coord: [13505572.544949114, 3595094.968692084], h: -0.1141 }, { coord: [13505582.479941845, 3595096.1070766672], h: -0.1141 }, { coord: [13505592.414934576, 3595097.2454612507], h: -0.1141 }, { coord: [13505598.531227564, 3595101.339102114], h: -1.7103 }, { coord: [13505597.140973292, 3595111.2419902314], h: -1.7103 }, { coord: [13505595.75071902, 3595121.144878349], h: -1.7103 }, { coord: [13505594.360464748, 3595131.047766466], h: -1.7103 }, { coord: [13505592.970210476, 3595140.9506545835], h: -1.7103 }, { coord: [13505591.579956204, 3595150.853542701], h: -1.7103 }, { coord: [13505590.189701932, 3595160.7564308182], h: -1.7103 }, { coord: [13505588.79944766, 3595170.6593189356], h: -1.7103 }, { coord: [13505587.409193387, 3595180.562207053], h: -1.7103 }, { coord: [13505586.018939115, 3595190.4650951703], h: -1.7103 }, { coord: [13505584.628684843, 3595200.3679832877], h: -1.7103 }, { coord: [13505583.23843057, 3595210.270871405], h: -1.7103 }, { coord: [13505581.848176299, 3595220.1737595224], h: -1.7103 }, { coord: [13505580.457922027, 3595230.0766476397], h: -1.7103 }, { coord: [13505579.067667754, 3595239.979535757], h: -1.7103 }, { coord: [13505577.677413482, 3595249.8824238745], h: -1.7103 }, { coord: [13505576.28715921, 3595259.785311992], h: -1.7103 }, { coord: [13505574.896904938, 3595269.688200109], h: -1.7103 }, { coord: [13505573.506650666, 3595279.5910882265], h: -1.7103 }, { coord: [13505572.116396394, 3595289.493976344], h: -1.7103 }, { coord: [13505570.726142121, 3595299.3968644612], h: -1.7103 }, { coord: [13505569.33588785, 3595309.2997525786], h: -1.7103 }, { coord: [13505567.945633577, 3595319.202640696], h: -1.7103 }, { coord: [13505566.555379305, 3595329.1055288133], h: -1.7103 }, { coord: [13505565.165125033, 3595339.0084169307], h: -1.7103 }, { coord: [13505563.77487076, 3595348.911305048], h: -1.7103 }, { coord: [13505562.384616489, 3595358.8141931654], h: -1.7103 }, { coord: [13505560.994362216, 3595368.7170812828], h: -1.7103 }, { coord: [13505559.604107944, 3595378.6199694], h: -1.7103 }, { coord: [13505558.213853672, 3595388.5228575175], h: -1.7103 }, { coord: [13505556.8235994, 3595398.425745635], h: -1.7103 }, { coord: [13505555.433345128, 3595408.328633752], h: -1.7103 }, { coord: [13505554.043090856, 3595418.2315218695], h: -1.7103 }, { coord: [13505552.652836584, 3595428.134409987], h: -1.7103 }, { coord: [13505551.262582311, 3595438.0372981043], h: -1.7103 }, { coord: [13505549.87232804, 3595447.9401862216], h: -1.7103 }, { coord: [13505548.482073767, 3595457.843074339], h: -1.7103 }, { coord: [13505547.091819495, 3595467.7459624563], h: -1.7103 }, { coord: [13505545.701565223, 3595477.6488505737], h: -1.7103 }, { coord: [13505544.31131095, 3595487.551738691], h: -1.7103 }, { coord: [13505542.921056679, 3595497.4546268084], h: -1.7103 }, { coord: [13505541.530802406, 3595507.3575149258], h: -1.7103 }, { coord: [13505540.140548134, 3595517.260403043], h: -1.7103 }, { coord: [13505538.750293862, 3595527.1632911605], h: -1.7103 }, { coord: [13505537.36003959, 3595537.066179278], h: -1.7103 }, { coord: [13505535.969785318, 3595546.969067395], h: -1.7103 }, { coord: [13505534.579531046, 3595556.8719555126], h: -1.7103 }, { coord: [13505528.227848398, 3595560.1703272853], h: 2.9988 }, { coord: [13505518.329576641, 3595558.7475777515], h: 2.9988 }, { coord: [13505508.431304885, 3595557.3248282177], h: 2.9988 }, { coord: [13505498.533033129, 3595555.902078684], h: 2.9988 }, { coord: [13505488.634761373, 3595554.47932915], h: 2.9988 }, { coord: [13505478.736489616, 3595553.0565796164], h: 2.9988 }, { coord: [13505468.83821786, 3595551.6338300826], h: 2.9988 }, { coord: [13505458.939946104, 3595550.211080549], h: 2.9988 }, { coord: [13505449.041674348, 3595548.788331015], h: 2.9988 }, { coord: [13505439.143402591, 3595547.3655814813], h: 2.9988 }], [{ coord: [13505429.245130835, 3595545.9428319475], h: 2.9988 }, { coord: [13505419.346859079, 3595544.5200824137], h: 2.9988 }, { coord: [13505409.448587323, 3595543.09733288], h: 2.9988 }, { coord: [13505399.550315566, 3595541.674583346], h: 2.9988 }, { coord: [13505389.65204381, 3595540.2518338123], h: 2.9988 }, { coord: [13505379.753772054, 3595538.8290842785], h: 2.9988 }, { coord: [13505369.855500298, 3595537.4063347448], h: 2.9988 }, { coord: [13505359.957228541, 3595535.983585211], h: 2.9988 }, { coord: [13505350.058956785, 3595534.560835677], h: 2.9988 }, { coord: [13505340.160685029, 3595533.1380861434], h: 2.9988 }, { coord: [13505330.262413273, 3595531.7153366096], h: 2.9988 }, { coord: [13505320.364141516, 3595530.292587076], h: 2.9988 }, { coord: [13505310.46586976, 3595528.869837542], h: 2.9988 }, { coord: [13505300.567598004, 3595527.4470880083], h: 2.9988 }, { coord: [13505290.669326248, 3595526.0243384745], h: 2.9988 }, { coord: [13505280.771054491, 3595524.6015889407], h: 2.9988 }, { coord: [13505270.872782735, 3595523.178839407], h: 2.9988 }, { coord: [13505260.974510979, 3595521.756089873], h: 2.9988 }, { coord: [13505251.076239223, 3595520.3333403394], h: 2.9988 }, { coord: [13505241.177967466, 3595518.9105908056], h: 2.9988 }, { coord: [13505231.27969571, 3595517.487841272], h: 2.9988 }, { coord: [13505221.381423954, 3595516.065091738], h: 2.9988 }, { coord: [13505211.483152198, 3595514.642342204], h: 2.9988 }, { coord: [13505201.584880441, 3595513.2195926704], h: 2.9988 }, { coord: [13505191.686608685, 3595511.7968431367], h: 2.9988 }, { coord: [13505181.788336929, 3595510.374093603], h: 2.9988 }, { coord: [13505171.890065173, 3595508.951344069], h: 2.9988 }, { coord: [13505161.991793416, 3595507.5285945353], h: 2.9988 }, { coord: [13505152.09352166, 3595506.1058450015], h: 2.9988 }, { coord: [13505142.195249904, 3595504.6830954677], h: 2.9988 }, { coord: [13505132.296978148, 3595503.260345934], h: 2.9988 }, { coord: [13505122.398706391, 3595501.8375964], h: 2.9988 }, { coord: [13505112.500434635, 3595500.4148468664], h: 2.9988 }, { coord: [13505102.602162879, 3595498.9920973326], h: 2.9988 }, { coord: [13505092.703891123, 3595497.569347799], h: 2.9988 }, { coord: [13505082.805619366, 3595496.146598265], h: 2.9988 }, { coord: [13505072.90734761, 3595494.7238487313], h: 2.9988 }, { coord: [13505063.009075854, 3595493.3010991975], h: 2.9988 }, { coord: [13505053.110804098, 3595491.8783496637], h: 2.9988 }, { coord: [13505043.212532341, 3595490.45560013], h: 2.9988 }, { coord: [13505033.314260585, 3595489.032850596], h: 2.9988 }, { coord: [13505023.415988829, 3595487.6101010623], h: 2.9988 }, { coord: [13505013.517717073, 3595486.1873515286], h: 2.9988 }, { coord: [13505003.619445316, 3595484.764601995], h: 2.9988 }, { coord: [13504993.72117356, 3595483.341852461], h: 2.9988 }, { coord: [13504983.822901804, 3595481.919102927], h: 2.9988 }, { coord: [13504973.924630048, 3595480.4963533934], h: 2.9988 }, { coord: [13504964.026358292, 3595479.0736038596], h: 2.9988 }, { coord: [13504954.128086535, 3595477.650854326], h: 2.9988 }, { coord: [13504944.229814779, 3595476.228104792], h: 2.9988 }, { coord: [13504934.331543023, 3595474.8053552583], h: 2.9988 }, { coord: [13504924.433271267, 3595473.3826057245], h: 2.9988 }, { coord: [13504914.53499951, 3595471.9598561907], h: 2.9988 }, { coord: [13504904.636727754, 3595470.537106657], h: 2.9988 }, { coord: [13504894.738455998, 3595469.114357123], h: 2.9988 }, { coord: [13504884.840184242, 3595467.6916075894], h: 2.9988 }, { coord: [13504874.941912485, 3595466.2688580556], h: 2.9988 }, { coord: [13504865.043640729, 3595464.846108522], h: 2.9988 }, { coord: [13504855.145368973, 3595463.423358988], h: 2.9988 }, { coord: [13504845.247097217, 3595462.0006094542], h: 2.9988 }, { coord: [13504835.34882546, 3595460.5778599204], h: 2.9988 }, { coord: [13504825.450553704, 3595459.1551103867], h: 2.9988 }, { coord: [13504815.552281948, 3595457.732360853], h: 2.9988 }, { coord: [13504805.654010192, 3595456.309611319], h: 2.9988 }, { coord: [13504795.755738435, 3595454.8868617853], h: 2.9988 }, { coord: [13504785.857466679, 3595453.4641122515], h: 2.9988 }], [{ coord: [13504775.959194923, 3595452.0413627177], h: 2.9988 }, { coord: [13504766.060923167, 3595450.618613184], h: 2.9988 }, { coord: [13504756.16265141, 3595449.19586365], h: 2.9988 }, { coord: [13504746.264379654, 3595447.7731141164], h: 2.9988 }, { coord: [13504736.366107898, 3595446.3503645826], h: 2.9988 }, { coord: [13504726.467836142, 3595444.927615049], h: 2.9988 }, { coord: [13504716.569564385, 3595443.504865515], h: 2.9988 }, { coord: [13504706.67129263, 3595442.0821159813], h: 2.9988 }, { coord: [13504696.773020873, 3595440.6593664475], h: 2.9988 }, { coord: [13504686.874749117, 3595439.2366169137], h: 2.9988 }, { coord: [13504676.97647736, 3595437.81386738], h: 2.9988 }, { coord: [13504667.078205604, 3595436.391117846], h: 2.9988 }, { coord: [13504657.179933848, 3595434.9683683123], h: 2.9988 }, { coord: [13504647.281662092, 3595433.5456187786], h: 2.9988 }, { coord: [13504637.383390335, 3595432.122869245], h: 2.9988 }, { coord: [13504627.48511858, 3595430.700119711], h: 2.9988 }, { coord: [13504617.586846823, 3595429.277370177], h: 2.9988 }, { coord: [13504607.688575067, 3595427.8546206434], h: 2.9988 }, { coord: [13504597.79030331, 3595426.4318711096], h: 2.9988 }, { coord: [13504587.892031554, 3595425.009121576], h: 2.9988 }, { coord: [13504577.993759798, 3595423.586372042], h: 2.9988 }, { coord: [13504568.095488042, 3595422.1636225083], h: 2.9988 }, { coord: [13504560.233676847, 3595419.193741123], h: 1.4421 }, { coord: [13504561.516690943, 3595409.276388915], h: 1.4421 }, { coord: [13504562.79970504, 3595399.3590367064], h: 1.4421 }, { coord: [13504564.082719136, 3595389.441684498], h: 1.4421 }, { coord: [13504565.365733232, 3595379.5243322896], h: 1.4421 }, { coord: [13504566.648747329, 3595369.606980081], h: 1.4421 }, { coord: [13504567.931761425, 3595359.689627873], h: 1.4421 }, { coord: [13504569.214775521, 3595349.7722756644], h: 1.4421 }, { coord: [13504570.497789618, 3595339.854923456], h: 1.4421 }, { coord: [13504571.780803714, 3595329.9375712476], h: 1.4421 }, { coord: [13504573.06381781, 3595320.020219039], h: 1.4421 }, { coord: [13504574.346831907, 3595310.102866831], h: 1.4421 }, { coord: [13504575.629846003, 3595300.1855146224], h: 1.4421 }, { coord: [13504576.9128601, 3595290.268162414], h: 1.4421 }, { coord: [13504578.195874196, 3595280.3508102056], h: 1.4421 }, { coord: [13504579.478888292, 3595270.433457997], h: 1.4421 }, { coord: [13504580.761902388, 3595260.5161057888], h: 1.4421 }, { coord: [13504582.044916485, 3595250.5987535804], h: 1.4421 }, { coord: [13504583.32793058, 3595240.681401372], h: 1.4421 }, { coord: [13504584.610944677, 3595230.7640491636], h: 1.4421 }, { coord: [13504585.893958773, 3595220.846696955], h: 1.4421 }, { coord: [13504587.17697287, 3595210.9293447467], h: 1.4421 }, { coord: [13504588.459986966, 3595201.0119925383], h: 1.4421 }, { coord: [13504589.743001062, 3595191.09464033], h: 1.4421 }, { coord: [13504591.026015159, 3595181.1772881215], h: 1.4421 }, { coord: [13504592.309029255, 3595171.259935913], h: 1.4421 }, { coord: [13504593.592043351, 3595161.3425837047], h: 1.4421 }, { coord: [13504594.875057448, 3595151.4252314963], h: 1.4421 }, { coord: [13504596.158071544, 3595141.507879288], h: 1.4421 }, { coord: [13504600.404407453, 3595135.4786147396], h: -0.1397 }, { coord: [13504610.307025403, 3595136.8707920797], h: -0.1397 }, { coord: [13504620.209643353, 3595138.26296942], h: -0.1397 }, { coord: [13504630.112261303, 3595139.65514676], h: -0.1397 }, { coord: [13504640.014879253, 3595141.0473241], h: -0.1397 }, { coord: [13504649.917497203, 3595142.43950144], h: -0.1397 }, { coord: [13504659.820115153, 3595143.8316787803], h: -0.1397 }, { coord: [13504669.722733103, 3595145.2238561204], h: -0.1397 }, { coord: [13504679.625351053, 3595146.6160334605], h: -0.1397 }, { coord: [13504689.527969003, 3595148.0082108006], h: -0.1397 }, { coord: [13504699.430586953, 3595149.4003881407], h: -0.1397 }, { coord: [13504709.333204903, 3595150.792565481], h: -0.1397 }, { coord: [13504719.235822853, 3595152.184742821], h: -0.1397 }, { coord: [13504729.138440803, 3595153.576920161], h: -0.1397 }, { coord: [13504739.041058753, 3595154.969097501], h: -0.1397 }], [{ coord: [13504748.943676703, 3595156.3612748412], h: -0.1397 }, { coord: [13504758.846294653, 3595157.7534521814], h: -0.1397 }, { coord: [13504768.748912603, 3595159.1456295215], h: -0.1397 }, { coord: [13504778.651530553, 3595160.5378068616], h: -0.1397 }, { coord: [13504788.554148503, 3595161.9299842017], h: -0.1397 }, { coord: [13504798.456766453, 3595163.322161542], h: -0.1397 }, { coord: [13504808.359384403, 3595164.714338882], h: -0.1397 }, { coord: [13504818.262002353, 3595166.106516222], h: -0.1397 }, { coord: [13504828.164620303, 3595167.498693562], h: -0.1397 }, { coord: [13504838.067238253, 3595168.890870902], h: -0.1397 }, { coord: [13504847.969856203, 3595170.2830482423], h: -0.1397 }, { coord: [13504857.872474153, 3595171.6752255824], h: -0.1397 }, { coord: [13504867.775092103, 3595173.0674029225], h: -0.1397 }, { coord: [13504877.677710053, 3595174.4595802627], h: -0.1397 }, { coord: [13504887.580328003, 3595175.8517576028], h: -0.1397 }, { coord: [13504897.482945953, 3595177.243934943], h: -0.1397 }, { coord: [13504907.385563903, 3595178.636112283], h: -0.1397 }, { coord: [13504917.288181853, 3595180.028289623], h: -0.1397 }, { coord: [13504927.190799803, 3595181.420466963], h: -0.1397 }, { coord: [13504937.093417753, 3595182.8126443033], h: -0.1397 }, { coord: [13504946.996035703, 3595184.2048216434], h: -0.1397 }, { coord: [13504956.898653653, 3595185.5969989835], h: -0.1397 }, { coord: [13504966.801271603, 3595186.9891763236], h: -0.1397 }, { coord: [13504976.703889553, 3595188.3813536637], h: -0.1397 }, { coord: [13504986.606507502, 3595189.773531004], h: -0.1397 }, { coord: [13504996.509125452, 3595191.165708344], h: -0.1397 }, { coord: [13505006.411743402, 3595192.557885684], h: -0.1397 }, { coord: [13505016.314361352, 3595193.950063024], h: -0.1397 }, { coord: [13505026.216979302, 3595195.3422403643], h: -0.1397 }, { coord: [13505036.119597252, 3595196.7344177044], h: -0.1397 }, { coord: [13505046.022215202, 3595198.1265950445], h: -0.1397 }, { coord: [13505055.924833152, 3595199.5187723846], h: -0.1397 }, { coord: [13505065.827451102, 3595200.9109497247], h: -0.1397 }, { coord: [13505075.730069052, 3595202.303127065], h: -0.1397 }, { coord: [13505085.632687002, 3595203.695304405], h: -0.1397 }, { coord: [13505095.535304952, 3595205.087481745], h: -0.1397 }, { coord: [13505105.437922902, 3595206.479659085], h: -0.1397 }, { coord: [13505115.340540852, 3595207.8718364253], h: -0.1397 }, { coord: [13505125.243158802, 3595209.2640137654], h: -0.1397 }, { coord: [13505135.145776752, 3595210.6561911055], h: -0.1397 }, { coord: [13505145.048394702, 3595212.0483684456], h: -0.1397 }, { coord: [13505154.951012652, 3595213.4405457857], h: -0.1397 }, { coord: [13505164.853630602, 3595214.832723126], h: -0.1397 }, { coord: [13505174.756248552, 3595216.224900466], h: -0.1397 }, { coord: [13505184.658866502, 3595217.617077806], h: -0.1397 }, { coord: [13505194.561484452, 3595219.009255146], h: -0.1397 }, { coord: [13505204.464102402, 3595220.4014324863], h: -0.1397 }, { coord: [13505214.366720352, 3595221.7936098264], h: -0.1397 }, { coord: [13505224.269338302, 3595223.1857871665], h: -0.1397 }, { coord: [13505234.171956252, 3595224.5779645066], h: -0.1397 }, { coord: [13505244.074574202, 3595225.9701418467], h: -0.1397 }, { coord: [13505253.977192152, 3595227.362319187], h: -0.1397 }, { coord: [13505263.879810102, 3595228.754496527], h: -0.1397 }, { coord: [13505273.782428052, 3595230.146673867], h: -0.1397 }, { coord: [13505283.685046002, 3595231.538851207], h: -0.1397 }, { coord: [13505293.587663952, 3595232.931028547], h: -0.1397 }, { coord: [13505303.490281902, 3595234.3232058873], h: -0.1397 }, { coord: [13505313.392899852, 3595235.7153832274], h: -0.1397 }, { coord: [13505323.295517802, 3595237.1075605676], h: -0.1397 }, { coord: [13505333.198135752, 3595238.4997379077], h: -0.1397 }, { coord: [13505343.100753702, 3595239.891915248], h: -0.1397 }, { coord: [13505353.003371652, 3595241.284092588], h: -0.1397 }, { coord: [13505362.905989602, 3595242.676269928], h: -0.1397 }, { coord: [13505372.808607552, 3595244.068447268], h: -0.1397 }, { coord: [13505382.711225502, 3595245.460624608], h: -0.1397 }, { coord: [13505392.613843452, 3595246.8528019483], h: -0.1397 }]]
    return {
      data: [{
        dynamic: true,
        appid: 'gwc',
        appobjname: '公务车',
        loadtemp: 'point',
        gisdatasource: [
          {
            id: '888',
            name: '沪A12345',
            source: lines[i]
          }
        ]
      }]
    }
  },

  getDescription: {
    data: {
      text: '区域：西区涤纶部2#氧化装置南侧↵监控对象：涤纶部2#氧化污染源↵监测仪器：VOC（PID）↵监测因子：VOC↵标准(DB31/933-2015)：1000ppb↵型号厂家：LEAD-VOCS5002（莱帝科技有限公司）↵采样频次：1分钟↵↵'
    }
  },
  getElementData: {
    data: { ZD_YZ: [{ factid: '518c1ca7cd524930be0b5cf33061c57b', factstatu: 'black', thlines: [{ name: '', yAxis: 850.0 }, { name: '', yAxis: 1000.0 }], thranges: [{ gte: 0, lte: 850.0, style: 'black' }, { gt: 850.0, lte: 1000.0, style: 'yellow' }, { gt: 1000.0, style: 'red' }], factdata: { Name: 'VOC', Unit: 'ppb', Value: '0', DateTime: '2020/4/26 11:00:00', BiaoZhun: '1000' } }, { factid: '8ae1cea4ef3f4ed0b330da552afc2ead', factstatu: 'black', thlines: [], thranges: [], factdata: { Name: '温度', Unit: '℃', Value: '24.5125', DateTime: '2020/4/26 11:00:00', BiaoZhun: '' } }, { factid: 'f3a030ae358347ff942e2e671b11abb1', factstatu: 'black', thlines: [], thranges: [], factdata: { Name: '湿度', Unit: 'RH%', Value: '60.3025', DateTime: '2020/4/26 11:00:00', BiaoZhun: '' } }, { factid: 'd2517aa4ae3f4262b6796860fd08da61', factstatu: 'black', thlines: [], thranges: [], factdata: { Name: '气压', Unit: 'kPa', Value: '1021.092', DateTime: '2020/4/26 11:00:00', BiaoZhun: '' } }, { factid: 'f10d127b668645bbb52d87bdc213b80a', factstatu: 'black', thlines: [], thranges: [], factdata: { Name: '风速', Unit: 'm/s', Value: '0.62', DateTime: '2020/4/26 11:00:00', BiaoZhun: '' } }, { factid: '21a53503c7f74ef0a64c54c948fc1077', factstatu: 'black', thlines: [], thranges: [], factdata: { Name: '风向', Unit: '度', Value: '264.2', DateTime: '2020/4/26 11:00:00', BiaoZhun: '' } }], ZD_YZH: [{ factid: '518c1ca7cd524930be0b5cf33061c57b', factstatu: 'black', thlines: [{ name: '', yAxis: 850.0 }, { name: '', yAxis: 1000.0 }], thranges: [{ gte: 0, lte: 850.0, style: 'black' }, { gt: 850.0, lte: 1000.0, style: 'yellow' }, { gt: 1000.0, style: 'red' }], factdata: { name: 'VOC', unit: 'ppb', value: 0.000000, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.VOC' } }, { factid: '8ae1cea4ef3f4ed0b330da552afc2ead', factstatu: 'black', thlines: [], thranges: [], factdata: { name: '温度', unit: '℃', value: 24.512500, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.TE' } }, { factid: 'f3a030ae358347ff942e2e671b11abb1', factstatu: 'black', thlines: [], thranges: [], factdata: { name: '湿度', unit: 'RH%', value: 60.302500, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.RH' } }, { factid: 'd2517aa4ae3f4262b6796860fd08da61', factstatu: 'black', thlines: [], thranges: [], factdata: { name: '气压', unit: 'kPa', value: 1021.092000, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.PE' } }, { factid: 'f10d127b668645bbb52d87bdc213b80a', factstatu: 'black', thlines: [], thranges: [], factdata: { name: '风速', unit: 'm/s', value: 0.620000, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.FS' } }, { factid: '21a53503c7f74ef0a64c54c948fc1077', factstatu: 'black', thlines: [], thranges: [], factdata: { name: '风向', unit: '度', value: 264.200000, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.FX' } }] }
  },
  getElementFactorData: {
    data: { ZD_YZH: [{ name: 'VOC', unit: 'ppb', value: 1.000000, datetime: '2020-04-26 11:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 2.000000, datetime: '2020-04-26 10:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 0.000000, datetime: '2020-04-26 09:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 5.000000, datetime: '2020-04-26 08:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 4.000000, datetime: '2020-04-26 07:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 10.000000, datetime: '2020-04-26 06:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 0.000000, datetime: '2020-04-26 05:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 0.000000, datetime: '2020-04-26 04:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 7.000000, datetime: '2020-04-26 03:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 0.000000, datetime: '2020-04-26 02:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 9.000000, datetime: '2020-04-26 01:00:00', phd: 'AHB.VOC.A05.VOC' }, { name: 'VOC', unit: 'ppb', value: 1.000000, datetime: '2020-04-26 00:00:00', phd: 'AHB.VOC.A05.VOC' }] }
  },
  getRoadJson: {
    data: { type: 'Feature', id: '47', geometry: { type: 'LineString', coordinates: [[121.33458298921242, 30.710938155163138], [121.33458302891242, 30.710938183463135], [121.33070438771242, 30.707416462663137], [121.33070437951241, 30.707416481263138], [121.33067745021242, 30.707392072763138], [121.33038553781242, 30.707031128163138], [121.33038566831242, 30.707031267963135], [121.32994480051242, 30.706601935063137], [121.32951815431242, 30.706197133663135], [121.32902040031242, 30.705847531163137], [121.32845740831242, 30.70544438106314], [121.32789689861242, 30.705099254663136], [121.32720715381242, 30.704737381163138], [121.32665962451242, 30.704485908963136], [121.32565700581242, 30.70414243356314], [121.32384268541242, 30.703632301963136], [121.32304024231242, 30.703461612663137], [121.32180296821242, 30.703148801463136], [121.32072924181242, 30.70292799286314], [121.31952752161241, 30.702829855563138], [121.31843957371242, 30.702860523463137], [121.31706008421241, 30.703032263663136], [121.31624234561242, 30.703179469263137], [121.31500129831242, 30.703365767463136], [121.31377253791241, 30.703572016363136], [121.31272962491242, 30.703735577263135], [121.31159664211242, 30.70390322676314], [121.31069594451242, 30.70405452006314], [121.30959614531241, 30.704222169063137], [121.30844976581241, 30.704391013463137], [121.30752928131241, 30.704561555163135], [121.30676605861242, 30.704680135563137], [121.30591750661242, 30.704823249563137], [121.30539605011242, 30.704896851063136], [121.30519301321242, 30.704916732463136], [121.30280772961241, 30.704737381163138]] }, properties: { Name: '大堤路', CFCC: 'L01' } }
  },
  getuserlist: {
    data: [{ DepartmentId: 'dep_30451510', DepartmentName: '储运部储运二车间', onLineNum: 0, UserList: [{ UserId: 'EB28D4937A5D4871A4D96949234B7589', RealName: '印晓春', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: 'DCF0BA11D78E4056B557A7EDD48ABE65', RealName: '孙惠斌', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: 'C8E25FB8B67B452EB8016614CD6B7A3B', RealName: '周军', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: 'C2AAC4EC4EBB44C881759B6360AB18CF', RealName: '王文龙', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: 'A93FA7BFF1C7490DB56FB229188DDC94', RealName: '褚地隆', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: 'A0792B8D003A43B7B4FDA2AE9EDE0BFB', RealName: '王炳华', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '9D8F3FAC346343CBA8590A63800102C1', RealName: '诸益忠', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '9873E4787C014373933508DEECDF8D25', RealName: '费晓文', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '83CEA51357CE451283EB3852CBA5521F', RealName: '何国强', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '7C7A9FE14CE7447796AAB47EB3A33B8E', RealName: '邵鸿', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '77BC288FCC7D48EDB1B665130C9FCB4F', RealName: '张斌', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '734F3417E4F84193B35108CB77EDC67D', RealName: '訾雪', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '72A78EB90EDE48C8AB6CE5EFBFCC2F4A', RealName: '高洪弟', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '641638B7BCBA446983FF2C49F8824E24', RealName: '陈宇铭', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '635B2CBE7CC9449B9EB1D17591F84FCD', RealName: '张强', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '5D044882AFF74B77AC7745613EFA924D', RealName: '蔡佳奇', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '4253CAF4939F451FA3D0493742415E20', RealName: '杨树森', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '34000B78C9A54199B2F9B1EAB43CE549', RealName: '金凯峰', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '2D7B1C1E89BF4CB8BEAA401A01EFB1CE', RealName: '陆静华', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '268E6A2F020C4F3687231A23BBA36E85', RealName: '王建国', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '1ACBA7728F4F4D72B874FDD6DE78FB2E', RealName: '汪青', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }, { UserId: '140B8E70D2B14FE89B8572E3AC3C4F2B', RealName: '朱敏', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 1 }, { UserId: '0131B179DC1747D191F55F13EFFE45EA', RealName: '庄宏', DepartmentName: '储运部储运二车间', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451399', DepartmentName: '炼油部2号炼油联合装置', onLineNum: 0, UserList: [{ UserId: 'CC40AECB5BD046708C8C1F8456294CCE', RealName: '洪景林', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '69A0AEA1098C4C1FAA08F6C4764DD320', RealName: '朱银松', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 0 }, { UserId: 'B35E507878494B398500E820DACB1259', RealName: '张华', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 0 }, { UserId: 'B57A9A9FE8164F75A86BCEA39725ACFC', RealName: '陆金来', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '28C328CA39974039A3B4DAE289A1FB63', RealName: '徐连根', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '02D8FE1A91C442709238048B4090F02E', RealName: '季哲', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '0B4F26351EFB4DD8A44B069CE6A1DF7D', RealName: '陶嵘', DepartmentName: '炼油部2号炼油联合装置', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30451819', DepartmentName: '上海石化IT服务中心运行维护科', onLineNum: 0, UserList: [{ UserId: '8c9a53dea3ad43c5a9b6347781afe260', RealName: '梁永红', DepartmentName: '上海石化IT服务中心运行维护科', Gender: 0, UserOnLine: 1 }, { UserId: '96f4200582f949dc85d41196f203b2d1', RealName: '望劲松', DepartmentName: '上海石化IT服务中心运行维护科', Gender: 0, UserOnLine: 1 }, { UserId: '71e1928540554870a1b2c9d0def78d28', RealName: '陈晓鸥', DepartmentName: '上海石化IT服务中心运行维护科', Gender: 0, UserOnLine: 1 }, { UserId: '873594bc77fe4624b7a6f5880f347033', RealName: '王月', DepartmentName: '上海石化IT服务中心运行维护科', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451495', DepartmentName: '上海石化储运部(领导班子)', onLineNum: 0, UserList: [{ UserId: '72146ECF986A46C59D509548933F61E8', RealName: '顾颂德', DepartmentName: '上海石化储运部(领导班子)', Gender: 0, UserOnLine: 1 }, { UserId: '9886EE592761421B88E453E887C31591', RealName: '王丽群', DepartmentName: '上海石化储运部(领导班子)', Gender: 0, UserOnLine: 1 }, { UserId: 'A8F6CEED40E84F6A99A7A5B38175ECE6', RealName: '徐斌元', DepartmentName: '上海石化储运部(领导班子)', Gender: 0, UserOnLine: 0 }, { UserId: '124832EA449F40FF8745934C1A286858', RealName: '陈道江', DepartmentName: '上海石化储运部(领导班子)', Gender: 0, UserOnLine: 0 }, { UserId: '04A462C2A6734C679723FA34D8109F74', RealName: '陈华平', DepartmentName: '上海石化储运部(领导班子)', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30450432', DepartmentName: '上海石化涤纶部2号氧化联合装置', onLineNum: 0, UserList: [{ UserId: 'E294F4EE149546E1919709DF441BF365', RealName: '江益兰', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: 'CB605E5B87EE4F939AE21B9FC0043D5F', RealName: '许勇强', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: 'BBE76CFD90F544D399D72A404DD33C58', RealName: '沈杰', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '662CE8910F2C4D30BAAA05BBABA70E82', RealName: '邱建国', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '71D6F6606D2E4F6AA4B783DE8D07B875', RealName: '蔡守俭', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '7A5CA616D4724BA9B719F44F81BF2E91', RealName: '叶晓鸽', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '7BF87B92C5EC45A6B66BA750F01C7A1B', RealName: '张东咏', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '169097EABBF249A18E22BAB5300F3809', RealName: '顾益军', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '27D91A91B238479B9B2A3E0BF7836835', RealName: '陈炜', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '1452C9ACE5594020AC00358128E5A496', RealName: '沈军', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '0A035AA1ED6040E0B18B2A3928DE9085', RealName: '张存吉', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '01DDCC9AF6154CF9B38E2BE5F3B99457', RealName: '干卫星', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '007151506890444FA18465975E7A5F4F', RealName: '黄惠平', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '5F3F91103C0548FF991C67350C19592A', RealName: '孟欣', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '5B0F259D3798452385797AF0872C5DF9', RealName: '徐锋', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '33D6DDE2BFB441C794A44D4494568A7D', RealName: '孙铮', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 0 }, { UserId: '3E6B1B0AA04F40D4BEFD2D97130C0A22', RealName: '夏凤珍', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }, { UserId: '3BD252F506984CD4BDDDE8CE7BD58B6F', RealName: '郑春华', DepartmentName: '上海石化涤纶部2号氧化联合装置', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: '0eb7369c38434653974c82d6cd95317f', DepartmentName: '上海石化电气仪表中心电仪六车间', onLineNum: 0, UserList: [{ UserId: 'A06A1C1233BC4CC48C30FB84D5FB8434', RealName: '施凤根', DepartmentName: '上海石化电气仪表中心电仪六车间', Gender: 0, UserOnLine: 0 }, { UserId: 'A2CFBB98603A41808558DE98CF68B234', RealName: '张金林', DepartmentName: '上海石化电气仪表中心电仪六车间', Gender: 0, UserOnLine: 1 }, { UserId: 'E6D18A5D4E4F4FE483675FBD589D4279', RealName: '巫嘉浪', DepartmentName: '上海石化电气仪表中心电仪六车间', Gender: 0, UserOnLine: 0 }, { UserId: 'E87413152E4843E9AAE725F0A06BD4EB', RealName: '陈斌', DepartmentName: '上海石化电气仪表中心电仪六车间', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30450417', DepartmentName: '上海石化动力与成品储运车间', onLineNum: 0, UserList: [{ UserId: '2A433DA2F1F74ECF979717A29ADE8D3E', RealName: '沈沪花', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 1 }, { UserId: '06019030CFE7423BB87F0A0EEFF4F37D', RealName: '吴银慧', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 0 }, { UserId: '41465255FA7C4D22A803CE4C8629B269', RealName: '唐义厦', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 1 }, { UserId: '37EDDE113B5C4E258489861AF3BEE99B', RealName: '赵敏', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 0 }, { UserId: 'B1CBAF18037E4CFEAAD64887E957480D', RealName: '陈百昇', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 0 }, { UserId: 'BEF47A427C0E46758B7E89C9B751C8B8', RealName: '王剑辉', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 1 }, { UserId: '852A3A39A2B14221B7AC947B4587328F', RealName: '蒋峰', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 0 }, { UserId: '62F5D2ABBC524E54A10DDA659313E759', RealName: '周杰', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 0 }, { UserId: '6E4E01FE546A48DBA94EC9F8531DFD55', RealName: '严炯', DepartmentName: '上海石化动力与成品储运车间', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451436', DepartmentName: '上海石化芳烃部安全环保科', onLineNum: 0, UserList: [{ UserId: 'B41C4C4C00094AAAAF369C1BF0B114FD', RealName: '钱卫平', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '781207CE49434F97B7E67BDE4E97FA18', RealName: '朱旭红', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '749F881DC9954F45AF8E0FBE2B69AEE6', RealName: '史海英', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '81E460D19B594936A76C4B7855D56C0B', RealName: '顾天明', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '273187A6A95443AD87E61C1342C0E040', RealName: '黄骞', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '1D9125FD024F424880DBB5A3B6A583ED', RealName: '郭建敏', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '09BAC38C961A4070A1BC455963E84455', RealName: '张小红', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '06DFD1844B404B33A0CB58194F0532D8', RealName: '张静', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '00A54371D3674214A8A0B20D6678C4B3', RealName: '黄文杰', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '385F8528C4464F75960C6712AC0BDA36', RealName: '周俊俊', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '45007DBE2DDB420F94DB919D11EE6BC8', RealName: '胡国辉', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '45C7ED934DDD4926ACBFF24CD6D41DA2', RealName: '马永军', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '582916D421A242B4A73E8FE88B893998', RealName: '徐栋', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: 'F3BAFEA4F2E94A4ABB2AEE2801488C2D', RealName: '李人权', DepartmentName: '上海石化芳烃部安全环保科', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30450330', DepartmentName: '上海石化化工部(助理、副总师)', onLineNum: 0, UserList: [{ UserId: '547BE9BCE17548B48319ECF33506FA66', RealName: '盛斌', DepartmentName: '上海石化化工部(助理、副总师)', Gender: 0, UserOnLine: 0 }, { UserId: '10FBBE2AF8AB4C3F9AA2C031008B090C', RealName: '卓平', DepartmentName: '上海石化化工部(助理、副总师)', Gender: 0, UserOnLine: 0 }, { UserId: '116BBB939D904473B89EB4D4D89D2280', RealName: '蒋伟兵', DepartmentName: '上海石化化工部(助理、副总师)', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30451724', DepartmentName: '上海石化环保水务部安全环保科', onLineNum: 0, UserList: [{ UserId: 'F8C6BFBE24D341058D85B8E5FD7C7FA0', RealName: '张迪', DepartmentName: '上海石化环保水务部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: 'C169041C1EEC4C39B777BB1E022B8947', RealName: '张晶', DepartmentName: '上海石化环保水务部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: 'BA03C63C63A74C8CA67ADDDBA0B3AF25', RealName: '邱云', DepartmentName: '上海石化环保水务部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '794D10B75C724FEAB20E39237C5715FA', RealName: '华洋', DepartmentName: '上海石化环保水务部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '32128BAD4F004CF38F461FF7DD8D012E', RealName: '朱健', DepartmentName: '上海石化环保水务部安全环保科', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451531', DepartmentName: '上海石化腈纶部(助理、副总师)', onLineNum: 0, UserList: [{ UserId: '68695E2FD1D14287B002960BAFBF404B', RealName: '黄正林', DepartmentName: '上海石化腈纶部(助理、副总师)', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30450668', DepartmentName: '上海石化精细化工部(领导班子)', onLineNum: 0, UserList: [{ UserId: '4E9F35036A244ACDA4EDE245F5BC4C09', RealName: '孙晓峰', DepartmentName: '上海石化精细化工部(领导班子)', Gender: 0, UserOnLine: 1 }, { UserId: '6456C84E0F2A4E439D94500D122D3231', RealName: '许惠明', DepartmentName: '上海石化精细化工部(领导班子)', Gender: 0, UserOnLine: 1 }, { UserId: '8B0AC5D9B80F42DFBE6FC0CDD1809E85', RealName: '孙春水', DepartmentName: '上海石化精细化工部(领导班子)', Gender: 0, UserOnLine: 0 }, { UserId: '763FFCAEAA3B46A6A1C167C95664FE66', RealName: '陈国忠', DepartmentName: '上海石化精细化工部(领导班子)', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30450499', DepartmentName: '上海石化热电部安全环保科', onLineNum: 0, UserList: [{ UserId: 'FC130F7F30D949B09D08A9DF007FA96D', RealName: '安江飞', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '759A1FA68B7F4FD8B32092C11E68D1DB', RealName: '赵一鸣', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '86887892D30C4CCC970F4BF19F226F69', RealName: '蒋丽霞', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: 'A5B6ED7B7C7E4CE3A95226ED43C13336', RealName: '俞卫', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '96ADC21398DA497EBBB6B5FE43845A47', RealName: '袁奕萍', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '314610BA5A874524A2C4906ABCCD60ED', RealName: '杨国林', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '353F62B9BFAC4B4D82105A917DCFF0B8', RealName: '张忠', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '4E12D6A7A5134A6CBF4C038C70E40250', RealName: '姜伟', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '5EF71AFA01924766995FFC363978BF87', RealName: '谢建华', DepartmentName: '上海石化热电部安全环保科', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30450169', DepartmentName: '上海石化生产部（能源办公室）生产调度科', onLineNum: 1, UserList: [{ UserId: '2FCDC38E485C40A0899580C275FFDC28', RealName: '钱敏景', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: 'F8AF92CB442C473BA824FBF12A3F5498', RealName: '季海斌', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: 'D6715B676E4B40CB8FCBDE123E88DD1C', RealName: '何春水', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: 'C6CC68EF981744C986FC6E58379778BA', RealName: '黄陈谱', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: 'E8076D34A6DC40778C99383D86EF18BD', RealName: '陆建荣', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: 'E6ACBA4D9D0F4AE5BB4FD4E4BD39A232', RealName: '朱坚飞', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: 'EE1F5FA449954AE09A7ADE1B2E7441B6', RealName: '徐文龙', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: 'F3034140C4FB44A59A9A1FB630CE0149', RealName: '杨玉清', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: 'F2C2C710D6AC420FBFEDC7C9815E8CB1', RealName: '丁健强', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: 'AB01793562A347DEAFBCAA9558C0B567', RealName: '熊正伟', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: 'BBBE8D8706104B53B731644200FE9A3A', RealName: '姚伟国', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: 'C0822D54C2CA4BADA34523623AEE92E0', RealName: '傅惠良', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: 'B6A3EC71E0B440998618D6779E62411A', RealName: '周志伟', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '9C9617CA84A74F2AA6A17E2895BA8418', RealName: '寿伯欢', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '984C4BE040054843904F15E5205C630A', RealName: '金卫华', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '9735CA7429224A148228C8F01FDD178D', RealName: '朱慧峰', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '8E0D67E5D128498883DDCB9E0D938DAF', RealName: '姚连明', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '8042FE83BDCF4CD38CFF63F3A8D73DF6', RealName: '项贞云', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '84AF1103F81B4E05822D541ED6F4397A', RealName: '张建平', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '858EBB8CBE8643F18066C39E35D6F6E4', RealName: '杨秋东', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '634246C5C9FB4A25B59FFA1F1C6FD3B1', RealName: '顾海权', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '656F7DEDAD3C4ACD957CDEF59B4B1C31', RealName: '单中元', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '68B8EFE9D60A45ECAF1EF195A756E993', RealName: '金峰', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '051F6AD6139C44849F3981558CFD8B60', RealName: '许勇', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '136FE412A1424001A6E25CD08936E153', RealName: '计军', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '0CFADD48A23A41089967432533874A50', RealName: '周轶翀', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '168205744AB44D99916CFD0E241A1253', RealName: '吴静荣', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '20E63161D9EB4312A65DF977B4ADB3A9', RealName: '夏琦', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '3AA8EBE970D3423C8883A5B318F9F8CD', RealName: '陈子健', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '34855A5CE90E4C7987C47F20DFD335D4', RealName: '唐婧', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '33CF4FCCC8534CBF80ADACE333B07A0C', RealName: '杨哲', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '43F42931DF6341A395D78989A741B148', RealName: '沈健', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '4337E4209948449895A274DD1EEFE0E6', RealName: '刘长忠', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '416A141B92404DCE8BA772A2E79F7CEB', RealName: '陆爱明', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 1 }, { UserId: '3C331F4760164845BA43BA0885E530BB', RealName: '姚一斌', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '4022F8287AE54C9A9BB7EDD9A192D43E', RealName: '黄桂军', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '56A49E056A714280894B9B6B0C8B0A2E', RealName: '陶培良', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }, { UserId: '48F127D9983243589965E1030CF1C34C', RealName: '吴欢辉', DepartmentName: '上海石化生产部（能源办公室）生产调度科', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451734', DepartmentName: '上海石化统计中心党群工作办公室', onLineNum: 0, UserList: [{ UserId: 'A932F487FE3548BC9B58FE33BDDFE205', RealName: '俞彤', DepartmentName: '上海石化统计中心党群工作办公室', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451408', DepartmentName: '上海石化烯烃部安全环保科', onLineNum: 0, UserList: [{ UserId: 'F6096C8E8ECB491E92A9ECBEAA5CB294', RealName: '王蓓芝', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: 'E8582E44266A4CA1BD051D51D80E8905', RealName: '段文举', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: 'E2EEFA261E084C0E92CF6BB41F478985', RealName: '龚月平', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: 'CCE3C66768354F7EA1C407750AC1807E', RealName: '韩玉麟', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '905A91AA4276450AABEAD5E26747145A', RealName: '艾家梁', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '848A82B5BD7B41B7A7D39CF9F918ADCD', RealName: '马余法', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '6AB0073270004953863BEFD1EC81CD0C', RealName: '汪忠辉', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '0CE616C083B948538B649B27954F58EF', RealName: '汤春妹', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 1 }, { UserId: '0EAD344CA677471E85F013A159B772A2', RealName: '张永红', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 0 }, { UserId: '0B8577702D4D45109C3776D37EEB3DD6', RealName: '姚永革', DepartmentName: '上海石化烯烃部安全环保科', Gender: 0, UserOnLine: 0 }] }, { DepartmentId: 'dep_30451695', DepartmentName: '上海石化质量管理中心党群工作办公室', onLineNum: 0, UserList: [{ UserId: '897962A900284FA9B6EDC0295F8396B6', RealName: '张军民', DepartmentName: '上海石化质量管理中心党群工作办公室', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30451371', DepartmentName: '中国石化上海石油化工股份有限公司(助理、副总师)', onLineNum: 0, UserList: [{ UserId: '7678513E95044A47925506E76C6C004C', RealName: '王佩琳', DepartmentName: '中国石化上海石油化工股份有限公司(助理、副总师)', Gender: 0, UserOnLine: 1 }, { UserId: '1FECCF3142184BBBACCD3F7828C3D8F0', RealName: '周军', DepartmentName: '中国石化上海石油化工股份有限公司(助理、副总师)', Gender: 0, UserOnLine: 0 }, { UserId: 'CCA7D807C53840719352DD012E18E717', RealName: '任国强', DepartmentName: '中国石化上海石油化工股份有限公司(助理、副总师)', Gender: 0, UserOnLine: 1 }] }, { DepartmentId: 'dep_30451728', DepartmentName: '中国石化上海石油化工股份有限公司统计中心(领导班子)', onLineNum: 0, UserList: [{ UserId: '9EB2FBBC7103482293B9F28312462F3C', RealName: '李江', DepartmentName: '中国石化上海石油化工股份有限公司统计中心(领导班子)', Gender: 0, UserOnLine: 1 }, { UserId: '30adbe9bf7d54c25be87e5cc46c12834', RealName: '陆峰', DepartmentName: '中国石化上海石油化工股份有限公司统计中心(领导班子)', Gender: 0, UserOnLine: 0 }, { UserId: 'C79E22E5B66C485591EB81AF2B5EC57D', RealName: '陈文训', DepartmentName: '中国石化上海石油化工股份有限公司统计中心(领导班子)', Gender: 0, UserOnLine: 0 }] }]
  }
}
Object.entries(mockdata).forEach(([api, redata]) => {
  Mock.mock(url + api, redata)
})
api.setOrigin(url).add(Object.keys(mockdata))

// api.cross({
//   name:'gettiles',
//   url:'http://10.136.238.197/api/public/Getcurrentthemejson'
// })
