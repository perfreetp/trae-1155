export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/record/index',
    'pages/entry/index',
    'pages/learn/index',
    'pages/mine/index',
    'pages/map/index',
    'pages/review/index',
    'pages/recordDetail/index',
    'pages/entryDetail/index',
    'pages/consent/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F7F3EE',
    navigationBarTitleText: '方言采录',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#9E9185',
    selectedColor: '#C07842',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/record/index',
        text: '采录'
      },
      {
        pagePath: 'pages/entry/index',
        text: '词条'
      },
      {
        pagePath: 'pages/learn/index',
        text: '学习'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
