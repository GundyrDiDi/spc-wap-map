<template>
  <section class="detail">
    <aside class="gap"></aside>
    <template v-if="loaded">
      <div v-show="description">
        <div class="title">简介</div>
        <div class="hordivider"></div>
        <div class="text">
          <div v-for="(v,i) in text" :key="i">
            {{v}}
          </div>
        </div>
      </div>
      <aside class="gap"></aside>
      <div v-show="elementData">
        <div class="title">实时数据</div>
        <div class="hordivider"></div>
        <div>
          <div v-for="(v,i) in intime" :key="i">
            <div class="intime" @click="getFactor(v)">
              <div class="flex-between">
                <div>{{v.Name}}</div>
                <div :class="v.BiaoZhun&&'danger'">{{v.Value+v.Unit}}</div>
              </div>
              <div>{{v.DateTime}}</div>
            </div>
            <div class="hordivider"></div>
          </div>
        </div>
      </div>
      <aside class="gap"></aside>
      <div v-show="factorData">
        <div class="title">历史曲线</div>
        <div class="hordivider"></div>
        <div class="date-picker">
          <input type="date" v-model="startTime">
          <input type="date" v-model="endTime">
          <div>
            <el-input
              placeholder="开始日期"
              suffix-icon="el-icon-date"
              v-model="startTime"
              class="noclick"
            >
            </el-input>
          </div>
          <div>
            <el-input
              placeholder="结束日期"
              suffix-icon="el-icon-date"
              v-model="endTime"
              class="noclick"
            >
            </el-input>
          </div>
        </div>
        <div class="chart" ref="chart" :style="chartStyle">

        </div>
      </div>
    </template>
    <div v-else>
      请稍候...
    </div>
  </section>
</template>

<script>
// import Echarts from 'echarts'
export default {
  name: 'loc-detail',
  data () {
    return {
      description: null,
      elementData: null,
      factorData: null,
      startTime: null,
      endTime: null
    }
  },
  watch: {
    start (is) {
      if (is && !this.loaded) {
        this.getdetail(this.lct).then(() => {
          this.$emit('update:loaded', true)
        })
      }
    },
    startTime (a, old) {
      old && this.getFactor()
    },
    endTime (a, old) {
      old && this.getFactor()
    }
  },
  computed: {
    detail () {
      return {
        description: this.description,
        elementData: this.elementData,
        factorData: this.factorData
      }
    },
    text () {
      return this.description ? this.description.text.split('↵').filter(v => {
        return !!v
      }) : []
    },
    intime () {
      return this.elementData ? this.elementData.ZD_YZ.map(
        v => v.factdata
      ) : []
    },
    chartStyle () {
      return {
        height: this.topHeight + 'px'
      }
    }
  },
  methods: {
    async getdetail (lct) {
      // await this._leastTime()
      this.description = await this.menu_getDescription()
      this.elementData = await this.menu_getElementData()
      this.factorData = await this.menu_getElementFactorData()
      console.log(this.detail)
      this.createChart()
    },
    getFactor () {
      this.$emit('slide')
      this.createChart()
    },
    formatDate (date = '') {
      const d = new Date()
      const m = d.getMonth() + 1
      const t = d.getDate()
      return `${d.getFullYear()}-${m < 10 ? '0' + m : m}-${t < 10 ? '0' + t : t}`
    },
    createChart () {
      console.log(this.factorData)
      // this.chart=Echarts.init(this.$refs.chart)
      // this.chart.setOptions({
      //   xAxis: {
      //       type: 'category',
      //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //       type: 'value'
      //   },
      //   series: [{
      //       data: [820, 932, 901, 934, 1290, 1330, 1320],
      //       type: 'line',
      //       smooth: true
      //   }]
      // })
    }
  },
  mounted () {
    this.startTime = this.formatDate()
    this.endTime = this.formatDate()
  },
  props: ['lct', 'loaded', 'start']
}

</script>

<style scoped>
  .detail {
    font-size: var(--normalsize)
  }

  .detail>div {
    padding: .5rem 1rem;
  }
  .title{
    font-size:var(--normalsize);
    color:#888;
  }
  .hordivider{
    margin-bottom:5px;
  }
  .text>div{
    padding:8px 5px;
  }
  .intime{
    padding:8px 5px;
  }
  .intime>div{
    line-height:1.3rem
  }
  .intime>div:last-child{
    color:#999;
    font-weight:normal;
    font-size:var(--smallsize)
  }
  .danger{
    color:var(--dangercolor)
  }
  .date-picker{
    position: relative;
  }
  .date-picker>div{
    margin:.5rem 0;
  }
  .noclick{
    pointer-events: none;
  }
  .chart{
    border:1px solid #ddd
  }
  [type="date"]{
    position: absolute;
    width: 100%;
    height: 2rem;
    top: .3rem;
    opacity: 0;
  }
  [type="date"]:nth-child(2){
    top:3.2rem;
  }
</style>
