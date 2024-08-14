<template>
  <div class="login">
    <van-nav-bar title="會員登入" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <div class="container">
      <div class="title">
        <h3>手機號碼登入</h3>
        <p>未註冊的手機號碼登入後將自動註冊</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="請輸入手機號碼" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="請輸入圖形驗證碼" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="請輸入簡訊驗證碼" type="text">
          <button @click="getCode">
            {{ second === totalSecond ? '獲取驗證碼' : second + '秒後重新發送'}}
          </button>
        </div>
      </div>
      <div @click="login" class="login-btn">登入</div>
    </div>
  </div>
</template>

<script>
import { getPicCode, getMsgCode, codeLogin } from '@/api/login'
// import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data () {
    return {
      picKey: '',
      picUrl: '',
      totalSecond: 60,
      second: 60,
      timer: null, // Timer id
      mobile: '15751776629',
      picCode: '1234',
      msgCode: '246810'
    }
  },
  async created () {
    this.getPicCode()
  },
  methods: {
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
      // Toast('Hello')
    },

    async getCode () {
      if (!this.validFn()) {
        return
      }
      if (!this.timer && this.second === this.totalSecond) {
        const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
        console.log(res)

        this.$toast('簡訊發送成功！')

        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) { // /^1[3-9]\d{9}$/ /^09\d{8}$/
        this.$toast('請輸入正確的手機號碼')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('請輸入正確的驗證碼')
        return false
      }
      return true
    },
    async login () {
      if (!this.validFn()) {
        return
      }

      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast('請輸入正確的手機驗證碼')
        return
      }

      console.log('發送登入請求')

      const res = await codeLogin(this.mobile, this.msgCode)
      this.$store.commit('user/setUserInfo', res.data)
      console.log(res)

      this.$toast('登入成功')

      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
