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
            <div class="intime" @click="ss(i)">
              <div class="flex-between">
                <div>
                  {{v.Name}}
                  <i v-show="factor===elementData.ZD_YZ[i]" class="el-icon-data-line"></i>
                </div>
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
            <el-input placeholder="开始日期" suffix-icon="el-icon-date" v-model="startTime" class="noclick">
            </el-input>
          </div>
          <div>
            <el-input placeholder="结束日期" suffix-icon="el-icon-date" v-model="endTime" class="noclick">
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
export default {
  name: 'loc-detail',
  data () {
    return {
      description: null,
      elementData: null,
      factorData: null,
      startTime: null,
      endTime: null,
      factor: null
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
    factor (f, old) {
      old && this.getFactor()
    },
    startTime (a, old) {
      old && this.getFactor()
      old && this.$emit('slide')
    },
    endTime (a, old) {
      old && this.getFactor()
      old && this.$emit('slide')
    }
  },
  computed: {
    // detail() {
    //   return {
    //     description: this.description,
    //     elementData: this.elementData,
    //     factorData: this.factorData
    //   }
    // },
    text () {
      return this.description ? this.description.text.split('↵').filter(v => !!v) : []
    },
    intime () {
      return this.elementData ? this.elementData.ZD_YZ.map(
        v => v.factdata
      ) : []
    },
    chartData () {
      return this.factorData ? this.factorData.ZD_YZH : []
    },
    chartStyle () {
      return {
        height: this.topHeight + 'px'
      }
    }
  },
  methods: {
    async getdetail (lct) {
      await this._leastTime()
      this.description = await this.menu_getDescription()
      this.elementData = await this.menu_getElementData()
      this.factor = this.elementData.ZD_YZ[0]
      await this.getFactor()
    },
    async getFactor () {
      this.factorData = await this.menu_getElementFactorData()
      requestAnimationFrame(() => {
        this.lct && this.createChart()
      })
    },
    createChart () {
      if (!this.$refs.chart) return
      if (!this.charts) {
        this.charts = this.$echarts(this.$refs.chart)
      } else {
        this.charts.clear()
      }
      if (this.chartData.length) {
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '4%',
            right: '8%',
            top: '20%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
          }]
        }
        const legend = []
        this.chartData.forEach(v => {
          legend.includes(v.name) || legend.push(v.name)
        })
        option.legend = { data: legend }
        option.series = legend.map((v, i) => ({
          name: v,
          type: 'line',
          data: this.chartData.map(v => ({
            name: v.datetime,
            value: [v.datetime, v.value]
          })),
          markLine: {
            label: {
              position: 'end'
            },
            data: this.factor.thelines
          }
        }))
        this.charts.setOption(option)
      }
    },
    formatDate (date = '') {
      const d = new Date()
      const m = d.getMonth() + 1
      const t = d.getDate()
      return `${d.getFullYear()}-${m < 10 ? '0' + m : m}-${t < 10 ? '0' + t : t}`
    },
    ss (i) {
      this.factor = this.elementData.ZD_YZ[i]
      this.$emit('slide')
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

  .title {
    font-size: var(--normalsize);
    color: #888;
  }

  .hordivider {
    margin-bottom: 5px;
  }

  .text>div {
    padding: 8px 5px;
  }

  .intime {
    padding: 8px 5px;
  }

  .intime>div {
    line-height: 1.3rem
  }

  .intime>div:last-child {
    color: #999;
    font-weight: normal;
    font-size: var(--smallsize)
  }

  .danger {
    color: var(--dangercolor)
  }

  .date-picker {
    position: relative;
  }

  .date-picker>div {
    margin: .5rem 0;
  }

  .noclick {
    pointer-events: none;
  }

  .el-icon-data-line{
    font-size: var(--largesize);
    color: var(--bdcolor);
    margin-left:5px;
  }
  [type="date"] {
    position: absolute;
    width: 100%;
    height: 2rem;
    top: .3rem;
    opacity: 0;
  }

  [type="date"]:nth-child(2) {
    top: 3.2rem;
  }

</style>
